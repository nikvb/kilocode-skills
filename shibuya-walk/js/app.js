/* Shibuya Walk — app logic (vanilla JS, Leaflet).
 * Handles: map + markers, live GPS, curated routes, and turn-toward-target
 * guidance (distance + compass bearing, arrow rotates with device heading). */
(function () {
  "use strict";

  const { CATEGORIES, SPOTS, ROUTES } = window.SHIBUYA;
  const SPOT_BY_ID = Object.fromEntries(SPOTS.map((s) => [s.id, s]));
  const SHIBUYA_CENTER = [35.6595, 139.7005];

  // ---- State ----
  const state = {
    me: null,               // {lat, lng, accuracy}
    heading: null,          // device compass heading (deg), if available
    activeRoute: null,      // route object
    stepIndex: 0,           // current stop in active route
    targetSpotId: null,     // single-shop target (when not on a route)
    activeFilters: new Set(Object.keys(CATEGORIES)),
    markers: {},            // id -> Leaflet marker
    routeLine: null,        // Leaflet polyline
    legLine: null,          // line from me -> current target
  };

  // ---- Map ----
  const map = L.map("map", { zoomControl: false, attributionControl: true }).setView(SHIBUYA_CENTER, 16);
  L.control.zoom({ position: "bottomright" }).addTo(map);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(map);

  let meMarker = null;
  let meAccuracyCircle = null;

  // ---- Helpers ----
  function toRad(d) { return (d * Math.PI) / 180; }
  function toDeg(r) { return (r * 180) / Math.PI; }

  // Haversine distance in metres
  function distanceM(a, b) {
    const R = 6371000;
    const dLat = toRad(b.lat - a.lat);
    const dLng = toRad(b.lng - a.lng);
    const lat1 = toRad(a.lat), lat2 = toRad(b.lat);
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(h));
  }

  // Initial bearing from a -> b in degrees (0 = north, clockwise)
  function bearingDeg(a, b) {
    const y = Math.sin(toRad(b.lng - a.lng)) * Math.cos(toRad(b.lat));
    const x =
      Math.cos(toRad(a.lat)) * Math.sin(toRad(b.lat)) -
      Math.sin(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.cos(toRad(b.lng - a.lng));
    return (toDeg(Math.atan2(y, x)) + 360) % 360;
  }

  function fmtDist(m) {
    if (m == null) return "—";
    if (m < 1000) return Math.round(m / 5) * 5 + " m";
    return (m / 1000).toFixed(m < 10000 ? 1 : 0) + " km";
  }

  function walkMinutes(m) {
    // ~80 m/min average city walking pace
    return Math.max(1, Math.round(m / 80));
  }

  const COMPASS = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  function compass(deg) { return COMPASS[Math.round(deg / 45) % 8]; }

  function toast(msg, ms = 2600) {
    const el = document.getElementById("toast");
    el.textContent = msg;
    el.classList.remove("hidden");
    clearTimeout(toast._t);
    toast._t = setTimeout(() => el.classList.add("hidden"), ms);
  }

  // ---- Markers ----
  function makePinIcon(cat, active) {
    const c = CATEGORIES[cat] || CATEGORIES.landmark;
    return L.divIcon({
      className: "",
      html: `<div class="pin ${active ? "active-pin" : ""}" style="background:${c.color}"><span>${c.icon}</span></div>`,
      iconSize: [26, 26],
      iconAnchor: [13, 26],
      popupAnchor: [0, -24],
    });
  }

  function popupHtml(s) {
    const c = CATEGORIES[s.category];
    return `
      <b>${s.name}</b><br>
      <span style="color:#94a3b8">${s.jp} · ${c.label}</span><br>
      <span style="display:block;margin-top:6px">${s.desc}</span>
      <span style="display:block;margin-top:6px;color:#94a3b8">🕑 ${s.hours}</span>
      <span style="display:block;margin-top:4px;color:#cbd5e1">💡 ${s.tip}</span>
      <span class="popup-go" data-go="${s.id}">Guide me here →</span>`;
  }

  function renderMarkers() {
    SPOTS.forEach((s) => {
      const active = state.targetSpotId === s.id ||
        (state.activeRoute && state.activeRoute.stops[state.stepIndex] === s.id);
      const visible = state.activeFilters.has(s.category);
      let m = state.markers[s.id];
      if (!m) {
        m = L.marker([s.lat, s.lng], { icon: makePinIcon(s.category, active) }).bindPopup(popupHtml(s));
        state.markers[s.id] = m;
      } else {
        m.setIcon(makePinIcon(s.category, active));
      }
      if (visible && !map.hasLayer(m)) m.addTo(map);
      if (!visible && map.hasLayer(m)) map.removeLayer(m);
    });
  }

  // Delegate popup "Guide me here" button
  map.on("popupopen", (e) => {
    const btn = e.popup._contentNode && e.popup._contentNode.querySelector("[data-go]");
    if (btn) btn.addEventListener("click", () => targetSpot(btn.getAttribute("data-go")));
  });

  // ---- GPS ----
  function startGeolocation() {
    if (!("geolocation" in navigator)) {
      toast("Geolocation not supported on this device.");
      return;
    }
    navigator.geolocation.watchPosition(onPosition, onPosError, {
      enableHighAccuracy: true,
      maximumAge: 2000,
      timeout: 15000,
    });
    requestHeading();
  }

  function onPosition(pos) {
    const { latitude, longitude, accuracy } = pos.coords;
    state.me = { lat: latitude, lng: longitude, accuracy };
    if (typeof pos.coords.heading === "number" && !Number.isNaN(pos.coords.heading)) {
      state.heading = pos.coords.heading;
    }
    drawMe();
    updateGuidance();
    refreshShopDistances();
  }

  function onPosError(err) {
    const map = {
      1: "Location permission denied. Enable it in your browser settings to get directions.",
      2: "Location unavailable right now — move to open sky and try again.",
      3: "Location timed out. Retrying…",
    };
    toast(map[err.code] || "Location error.");
  }

  function drawMe() {
    if (!state.me) return;
    const ll = [state.me.lat, state.me.lng];
    if (!meMarker) {
      meMarker = L.marker(ll, {
        icon: L.divIcon({ className: "", html: '<div class="me-dot"></div>', iconSize: [18, 18], iconAnchor: [9, 9] }),
        zIndexOffset: 1000,
      }).addTo(map);
      meAccuracyCircle = L.circle(ll, { radius: state.me.accuracy || 20, color: "#38bdf8", weight: 1, opacity: .4, fillOpacity: .08 }).addTo(map);
    } else {
      meMarker.setLatLng(ll);
      meAccuracyCircle.setLatLng(ll).setRadius(state.me.accuracy || 20);
    }
  }

  // Device compass heading (iOS needs permission; Android via deviceorientationabsolute)
  function requestHeading() {
    function handle(e) {
      let h = null;
      if (typeof e.webkitCompassHeading === "number") h = e.webkitCompassHeading; // iOS
      else if (e.absolute && typeof e.alpha === "number") h = 360 - e.alpha;       // Android absolute
      if (h != null && !Number.isNaN(h)) { state.heading = h; updateArrow(); }
    }
    window.addEventListener("deviceorientationabsolute", handle, true);
    window.addEventListener("deviceorientation", handle, true);
  }

  // ---- Guidance ----
  function currentTarget() {
    if (state.activeRoute) {
      const id = state.activeRoute.stops[state.stepIndex];
      return id ? SPOT_BY_ID[id] : null;
    }
    if (state.targetSpotId) return SPOT_BY_ID[state.targetSpotId];
    return null;
  }

  function updateGuidance() {
    const banner = document.getElementById("guidance");
    const target = currentTarget();
    if (!target) { banner.classList.add("hidden"); return; }
    banner.classList.remove("hidden");

    const titleEl = document.getElementById("g-title");
    const subEl = document.getElementById("g-sub");

    if (!state.me) {
      titleEl.textContent = "Heading to " + target.name;
      subEl.textContent = "Waiting for GPS… tap 📍 Locate me and allow location.";
      return;
    }

    const d = distanceM(state.me, target);
    const brg = bearingDeg(state.me, target);
    titleEl.textContent = target.name;

    if (d < 25) {
      subEl.textContent = "🎉 You've arrived! " + (target.tip || "");
      if (state.activeRoute) subEl.textContent += " — tap Next › for the next stop.";
    } else {
      subEl.textContent = `${fmtDist(d)} away · ~${walkMinutes(d)} min · head ${compass(brg)}`;
    }
    banner.dataset.bearing = brg;
    updateArrow();
    drawLeg(target);

    // update active-list distances live
    if (state.activeRoute) renderActive();
  }

  function updateArrow() {
    const banner = document.getElementById("guidance");
    const glyph = document.getElementById("g-arrow-glyph");
    const brg = parseFloat(banner.dataset.bearing);
    if (Number.isNaN(brg) || !state.me) { glyph.style.transform = "rotate(0deg)"; return; }
    // If we know device heading, point the arrow relative to where the phone faces.
    const rel = state.heading != null ? (brg - state.heading + 360) % 360 : brg;
    glyph.style.transform = `rotate(${rel}deg)`;
  }

  function drawLeg(target) {
    if (!state.me) return;
    const pts = [[state.me.lat, state.me.lng], [target.lat, target.lng]];
    if (!state.legLine) {
      state.legLine = L.polyline(pts, { color: "#38bdf8", weight: 4, opacity: .9, dashArray: "1 10", lineCap: "round" }).addTo(map);
    } else {
      state.legLine.setLatLngs(pts);
    }
  }

  function clearLeg() {
    if (state.legLine) { map.removeLayer(state.legLine); state.legLine = null; }
  }

  // ---- Targeting a single shop ----
  function targetSpot(id) {
    state.activeRoute = null;
    state.stepIndex = 0;
    state.targetSpotId = id;
    const s = SPOT_BY_ID[id];
    renderMarkers();
    updateGuidance();
    map.closePopup();
    if (state.me) map.fitBounds([[state.me.lat, state.me.lng], [s.lat, s.lng]], { padding: [60, 60], maxZoom: 17 });
    else map.setView([s.lat, s.lng], 17);
    setActiveTab("active");
    renderActive();
    collapseSheetPeek();
    toast("Guiding you to " + s.name);
  }

  // ---- Routes ----
  function startRoute(routeId) {
    const r = ROUTES.find((x) => x.id === routeId);
    if (!r) return;
    state.activeRoute = r;
    state.targetSpotId = null;
    state.stepIndex = 0;
    drawRouteLine(r);
    renderMarkers();
    renderRoutes();
    renderActive();
    updateGuidance();
    fitRoute(r);
    setActiveTab("active");
    collapseSheetPeek();
    toast(`Started “${r.name}” · ${r.stops.length} stops`);
  }

  function drawRouteLine(r) {
    const pts = r.stops.map((id) => [SPOT_BY_ID[id].lat, SPOT_BY_ID[id].lng]);
    if (state.routeLine) map.removeLayer(state.routeLine);
    state.routeLine = L.polyline(pts, { color: "#e11d48", weight: 4, opacity: .7 }).addTo(map);
  }

  function fitRoute(r) {
    const pts = r.stops.map((id) => [SPOT_BY_ID[id].lat, SPOT_BY_ID[id].lng]);
    if (state.me) pts.push([state.me.lat, state.me.lng]);
    map.fitBounds(pts, { padding: [50, 50] });
  }

  function nextStop() {
    if (!state.activeRoute) return;
    if (state.stepIndex < state.activeRoute.stops.length - 1) {
      state.stepIndex++;
      renderMarkers();
      renderActive();
      updateGuidance();
      const s = currentTarget();
      if (state.me) map.fitBounds([[state.me.lat, state.me.lng], [s.lat, s.lng]], { padding: [60, 60], maxZoom: 17 });
      else map.panTo([s.lat, s.lng]);
      toast("Next stop: " + s.name);
    } else {
      toast("🏁 Route complete — enjoy Shibuya!");
      endRoute();
    }
  }

  function endRoute() {
    state.activeRoute = null;
    state.targetSpotId = null;
    state.stepIndex = 0;
    if (state.routeLine) { map.removeLayer(state.routeLine); state.routeLine = null; }
    clearLeg();
    renderMarkers();
    renderRoutes();
    renderActive();
    updateGuidance();
  }

  // ---- UI: Routes tab ----
  function renderRoutes() {
    const el = document.querySelector('[data-panel="routes"]');
    el.innerHTML = ROUTES.map((r) => {
      const isActive = state.activeRoute && state.activeRoute.id === r.id;
      const stopNames = r.stops.map((id) => SPOT_BY_ID[id].name).join(" → ");
      return `
        <div class="route-card ${isActive ? "active-route" : ""}" data-route="${r.id}">
          <h3>${r.emoji} ${r.name}</h3>
          <div class="meta">${r.stops.length} stops · ~${r.minutes} min</div>
          <p>${r.blurb}</p>
          <p style="font-size:12px;color:#94a3b8">${stopNames}</p>
          <span class="go">${isActive ? "Restart route ↻" : "Start route ▶"}</span>
        </div>`;
    }).join("");
    el.querySelectorAll("[data-route]").forEach((c) =>
      c.addEventListener("click", () => startRoute(c.getAttribute("data-route"))));
  }

  // ---- UI: Shops tab ----
  function renderFilters() {
    const row = document.getElementById("filter-row");
    row.innerHTML = Object.entries(CATEGORIES).map(([key, c]) =>
      `<button class="chip ${state.activeFilters.has(key) ? "on" : ""}" data-cat="${key}" style="color:${state.activeFilters.has(key) ? c.color : ""}">${c.icon} ${c.label}</button>`
    ).join("");
    row.querySelectorAll("[data-cat]").forEach((chip) =>
      chip.addEventListener("click", () => {
        const k = chip.getAttribute("data-cat");
        if (state.activeFilters.has(k)) state.activeFilters.delete(k);
        else state.activeFilters.add(k);
        renderFilters();
        renderShops();
        renderMarkers();
      }));
  }

  function sortedVisibleShops() {
    let list = SPOTS.filter((s) => state.activeFilters.has(s.category));
    if (state.me) {
      list = list.map((s) => ({ ...s, _d: distanceM(state.me, s) })).sort((a, b) => a._d - b._d);
    }
    return list;
  }

  function renderShops() {
    const el = document.getElementById("shop-list");
    const list = sortedVisibleShops();
    if (!list.length) { el.innerHTML = '<div class="empty">No shops match your filters.</div>'; return; }
    el.innerHTML = list.map((s) => {
      const c = CATEGORIES[s.category];
      const dist = s._d != null ? `<div class="shop-dist">${fmtDist(s._d)}<br><span style="color:#94a3b8;font-weight:400">${walkMinutes(s._d)}min</span></div>` : "";
      return `
        <div class="shop-item" data-spot="${s.id}">
          <div class="shop-badge" style="background:${c.color}">${c.icon}</div>
          <div class="shop-main">
            <h4>${s.name}</h4>
            <div class="jp">${s.jp} · ${c.label}</div>
            <div class="d">${s.desc}</div>
            <div class="hrs">🕑 ${s.hours}</div>
            <span class="go-mini" data-go="${s.id}">Guide me here →</span>
          </div>
          ${dist}
        </div>`;
    }).join("");
    el.querySelectorAll(".shop-item").forEach((it) => {
      const id = it.getAttribute("data-spot");
      it.addEventListener("click", (ev) => {
        if (ev.target.hasAttribute("data-go")) { targetSpot(id); return; }
        // focus on map
        const s = SPOT_BY_ID[id];
        map.setView([s.lat, s.lng], 18);
        state.markers[id] && state.markers[id].openPopup();
      });
    });
  }

  function refreshShopDistances() {
    // Cheap live update when GPS moves and shops tab is visible
    if (document.querySelector('[data-panel="shops"]').classList.contains("hidden")) return;
    renderShops();
  }

  // ---- UI: Active walk tab ----
  function renderActive() {
    const empty = document.getElementById("active-empty");
    const listEl = document.getElementById("active-list");

    if (!state.activeRoute && !state.targetSpotId) {
      empty.classList.remove("hidden");
      listEl.innerHTML = "";
      return;
    }
    empty.classList.add("hidden");

    let stops, title;
    if (state.activeRoute) { stops = state.activeRoute.stops; title = state.activeRoute.name; }
    else { stops = [state.targetSpotId]; title = "Single destination"; }

    const toolbar = `
      <div class="active-toolbar">
        ${state.activeRoute ? '<button class="pill" id="tb-next">Next stop ›</button>' : ""}
        <button class="pill" id="tb-recenter">Recenter</button>
        <button class="pill btn-danger" id="tb-stop">Stop</button>
      </div>`;

    const steps = stops.map((id, i) => {
      const s = SPOT_BY_ID[id];
      const isCurrent = state.activeRoute ? i === state.stepIndex : true;
      const isDone = state.activeRoute && i < state.stepIndex;
      let dist = "";
      if (isCurrent && state.me) dist = `<div class="step-dist">${fmtDist(distanceM(state.me, s))}</div>`;
      return `
        <div class="active-step ${isCurrent ? "current" : ""} ${isDone ? "done" : ""}" data-jump="${i}">
          <div class="step-num">${isDone ? "✓" : i + 1}</div>
          <div class="step-body">
            <h4>${s.name}</h4>
            <small>${s.jp} · ${CATEGORIES[s.category].label} · 🕑 ${s.hours}</small>
          </div>
          ${dist}
        </div>`;
    }).join("");

    listEl.innerHTML = `<h3 style="margin:2px 0 10px;font-size:15px">${title}</h3>${toolbar}${steps}`;

    const nextBtn = document.getElementById("tb-next");
    if (nextBtn) nextBtn.addEventListener("click", nextStop);
    document.getElementById("tb-recenter").addEventListener("click", recenter);
    document.getElementById("tb-stop").addEventListener("click", () => { endRoute(); toast("Walk ended."); });

    listEl.querySelectorAll("[data-jump]").forEach((row) =>
      row.addEventListener("click", (ev) => {
        if (ev.target.closest(".active-toolbar")) return;
        if (!state.activeRoute) return;
        state.stepIndex = parseInt(row.getAttribute("data-jump"), 10);
        renderMarkers(); renderActive(); updateGuidance();
        const s = currentTarget();
        map.panTo([s.lat, s.lng]);
      }));
  }

  function recenter() {
    if (state.me) map.setView([state.me.lat, state.me.lng], 17);
    else { map.setView(SHIBUYA_CENTER, 16); toast("No GPS fix yet — showing Shibuya center."); }
  }

  // ---- Sheet + tabs ----
  function setActiveTab(name) {
    document.querySelectorAll(".tab").forEach((t) => t.classList.toggle("active", t.dataset.tab === name));
    document.querySelectorAll(".tab-panel").forEach((p) => p.classList.toggle("hidden", p.dataset.panel !== name));
    if (name === "shops") renderShops();
    if (name === "active") renderActive();
    if (name === "routes") renderRoutes();
  }

  document.querySelectorAll(".tab").forEach((t) =>
    t.addEventListener("click", () => setActiveTab(t.dataset.tab)));

  // Sheet expand/collapse by tapping the handle; simple 3-state cycle
  const sheet = document.getElementById("sheet");
  const sheetStates = ["", "expanded", "collapsed"];
  let sheetState = 0;
  function collapseSheetPeek() { sheet.className = "sheet"; sheetState = 0; setTimeout(() => map.invalidateSize(), 300); }
  document.getElementById("sheet-handle").addEventListener("click", () => {
    sheetState = (sheetState + 1) % sheetStates.length;
    sheet.className = "sheet " + sheetStates[sheetState];
    setTimeout(() => map.invalidateSize(), 300);
  });

  // Drag the handle vertically (touch)
  (function enableDrag() {
    const handle = document.getElementById("sheet-handle");
    let startY = 0, dragging = false;
    const onStart = (y) => { dragging = true; startY = y; };
    const onEnd = (y) => {
      if (!dragging) return; dragging = false;
      const dy = y - startY;
      if (dy < -40) { sheet.className = "sheet expanded"; sheetState = 1; }
      else if (dy > 40) { sheet.className = "sheet collapsed"; sheetState = 2; }
      setTimeout(() => map.invalidateSize(), 300);
    };
    handle.addEventListener("touchstart", (e) => onStart(e.touches[0].clientY), { passive: true });
    handle.addEventListener("touchend", (e) => onEnd(e.changedTouches[0].clientY));
    handle.addEventListener("mousedown", (e) => onStart(e.clientY));
    window.addEventListener("mouseup", (e) => onEnd(e.clientY));
  })();

  // ---- Locate button (also triggers iOS permission prompt on user gesture) ----
  document.getElementById("btn-locate").addEventListener("click", () => {
    // iOS 13+ requires a user gesture to request orientation permission
    if (typeof DeviceOrientationEvent !== "undefined" &&
        typeof DeviceOrientationEvent.requestPermission === "function") {
      DeviceOrientationEvent.requestPermission().catch(() => {});
    }
    if (state.me) { recenter(); }
    else { toast("Getting your location…"); }
    // ensure watch is running
    startGeolocation();
  });

  document.getElementById("g-next").addEventListener("click", nextStop);

  // ---- Init ----
  renderRoutes();
  renderFilters();
  renderShops();
  renderActive();
  renderMarkers();
  startGeolocation();

  // Re-fit map on orientation/resize
  window.addEventListener("resize", () => setTimeout(() => map.invalidateSize(), 200));
})();
