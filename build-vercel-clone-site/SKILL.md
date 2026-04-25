---
name: build-vercel-clone-site
description: |
  Build, deploy, and operate a niche-specific website (directory, lead-gen, expired-domain revival,
  hotel/camp/restaurant/SaaS) on the user's self-hosted vercel-clone platform at {{PLATFORM_HOSTNAME}}.
  Stack: SvelteKit 2 + Svelte 4 + Tailwind v4 + lucide-svelte + Postgres (per-app) + optional
  Ollama (gemma2:2b) chatbot + 3ava.com transactional mail. Includes the full design-token
  pattern, parallel agent fanout strategy, deploy lifecycle, and the platform's known bugs +
  workarounds. Use whenever the user asks to "build a website", "deploy on the platform",
  "revive a domain", "add a CRM", "add a chatbot", or work on cstandt.com / campscout / areghotel.
trigger: |
  - User mentions building/deploying a new site on their domains ({{BASE_DOMAIN}}, cstandt.com, amdy.io
    is FORBIDDEN, or any domain in their portfolio)
  - User wants to use the vercel-clone platform (POST /api/v1/deploy)
  - User asks for a directory / lead-gen / revival site in any niche
  - User mentions Gemma, 3ava.com mail, or platform deploy bugs
  - User is editing ~/vercel-clone, ~/your-projects/<sister-app>, ~/your-projects/<your-app>, or a sister project
when_to_skip: |
  - User wants frontend work that has nothing to do with the platform (e.g. a Vite SPA they'll deploy elsewhere)
  - User is only asking general programming questions
  - User is doing infrastructure work on a different host
required_secrets:
  - PLATFORM_API_KEY     # bearer token for {{PLATFORM_HOSTNAME}} — prefix dp_…
  - MAIL_API_KEY         # bearer for {{MAIL_HOST}} — prefix am_…
  - SSH_HOST             # {{PLATFORM_HOST}} (default) — change if user moved the platform
---

# Build & deploy a niche site on the vercel-clone platform

This skill captures the entire end-to-end pattern for building a production-quality
niche directory or revival site and deploying it on the user's self-hosted vercel-clone
platform. It also documents the bugs we hit and the workarounds.

## When you start a session

If the user asks for any of the things in `trigger` above, take these steps in order:

1. **Ask for the API keys you don't have.** This skill never hardcodes keys. Always:
   - Ask for `PLATFORM_API_KEY` (the `dp_…` token for `{{PLATFORM_HOSTNAME}}`) before any deploy.
   - Ask for `MAIL_API_KEY` (the `am_…` token for `{{MAIL_HOST}}`) before wiring lead-email.
   - SSH host defaults to `root@{{PLATFORM_HOST}}`. Confirm if user mentions a different host.
2. **Read user memory** — `~/.claude/projects/<project>/memory/MEMORY.md` for cross-session
   context (Resend-clone existence, domain portfolio, prior project state).
3. **Confirm the niche + scope** with one round of `AskUserQuestion`:
   - Domain to target (must NOT be `amdy.io` — that's production for AMD servers).
   - Brand name (the site's display name; does NOT need to match the URL).
   - Catalog / content size for MVP.
   - Listing depth (minimal / standard / rich).
4. **Pick a brand palette + type** distinct from any sibling sites you've already built
   on the user's platform. Check existing sites first: `https://<your-app>.{{BASE_DOMAIN}}`
   (pine + sun), `https://<sister-app>.{{BASE_DOMAIN}}` (oxblood + sun-gold). Don't duplicate.

## Hard rules (NEVER violate)

- **`amdy.io` is production for AMD servers. Do not deploy to it, touch its DNS, or use it
  as a test target.** The codebase has historical `amdy.io` defaults — they are wrong.
  Always set `BASE_DOMAIN={{BASE_DOMAIN}}` (or another non-amdy domain).
- **Never hardcode API keys in source.** Read from `process.env.MAIL_API_KEY` etc.
  The `mail.ts` abstraction in `src/lib/server/mail.ts` is gated on env vars and
  silently no-ops if missing.
- **Never echo a secret back to the user** in a final message. Acknowledge receipt,
  use it, and persist only on the server (in the platform's `/opt/deploy-platform/.env`).
- **Don't deploy without a body-size limit fix in place.** SvelteKit's default 512 KB
  rejects every real tarball. Platform `.env` must have `BODY_SIZE_LIMIT=10485760`.

## Architecture you're building on

```
   ┌────────────────────────────────────────────┐
   │  Cloudflare (proxied DNS, free tier)       │
   │  - {{BASE_DOMAIN}} zone (your wildcard target)    │
   │  - 3ava.com (mail), other portfolio zones  │
   └──────────────────┬─────────────────────────┘
                      │ HTTPS
   ┌──────────────────┴─────────────────────────┐
   │  {{PLATFORM_HOST}} (Netcup VPS)               │
   │  ┌─────────────────────────────────────┐   │
   │  │  nginx (host) — vhost per deploy    │   │
   │  └────────┬────────────────────────────┘   │
   │           │ proxy_pass http://127.0.0.1:N  │
   │  ┌────────┴────────┐  ┌─────────────────┐  │
   │  │ deploy-platform │  │ deploy-<sub>    │  │
   │  │ :3000 (systemd) │  │ :10001..N (host │  │
   │  │ vercel-clone    │  │   networked     │  │
   │  │   - hooks.ts    │  │   Docker)       │  │
   │  │   - deployer.ts │  └────────┬────────┘  │
   │  └────────┬────────┘           │            │
   │           │ DATABASE_URL       │            │
   │  ┌────────┴───────────────────┴──┐         │
   │  │  PostgreSQL 16                 │         │
   │  │  - deployplatform (platform)   │         │
   │  │  - app_<id> (per deployment)   │         │
   │  └────────────────────────────────┘         │
   │                                             │
   │  ┌─────────────────────┐                    │
   │  │ Ollama (native)     │                    │
   │  │ 127.0.0.1:11434     │                    │
   │  │ - gemma2:2b (chat)  │                    │
   │  │ - gemma4:e4b (idle) │                    │
   │  └─────────────────────┘                    │
   └─────────────────────────────────────────────┘
```

The platform deploys ONLY to subdomains under its `BASE_DOMAIN` (currently `{{BASE_DOMAIN}}`).
To put a site on a different domain (e.g. `cstandt.com`) requires manual nginx vhost
+ DNS A record after the deploy completes — this is NOT automated.

## Tech stack (locked, in this exact configuration)

```jsonc
// package.json
{
  "type": "module",
  "scripts": {
    "dev": "vite dev",
    "build": "vite build",
    "preview": "vite preview",
    "start": "node build",
    "check": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json"
  },
  "dependencies": {
    "@sveltejs/adapter-node": "^5.5.4",
    "@sveltejs/kit":          "^2.16.0",
    "@tailwindcss/vite":      "^4.2.4",
    "tailwindcss":            "^4.2.4",
    "lucide-svelte":          "0.378.0",   // EXACTLY this version — newer 1.x is Svelte-5 only
    "@fontsource-variable/<display>":  "*", // pick distinctive serif/sans
    "@fontsource-variable/<body>":     "*",
    "@fontsource-variable/<accent>":   "*",
    "pg":                     "^8.13.1",
    "nanoid":                 "^5.1.3"
  },
  "devDependencies": {
    "svelte":                          "^4.2.7",
    "@sveltejs/vite-plugin-svelte":    "^3.0.0",
    "vite":                            "^5.0.0",
    "svelte-check":                    "^3.6.0",
    "typescript":                      "^5.0.0"
  }
}
```

```ts
// vite.config.ts — non-negotiable
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss   from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [tailwindcss(), sveltekit()],
  ssr: { noExternal: ['lucide-svelte'] }   // REQUIRED: lucide-svelte ships pre-compiled JS
                                            //  that Svelte 4 SSR rejects without this.
});
```

```ts
// svelte.config.js
import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
export default { preprocess: vitePreprocess(), kit: { adapter: adapter() } };
```

## Design system pattern (the part that matters)

The site quality bar is set by a **token contract written before any agent is spawned**.
Every parallel agent reads the same contract — that's how 9 agents produce coherent UI.

Write the contract to `/tmp/<project>-contract.md` and reference it from every agent prompt.
Required sections:

1. **Working directory** (e.g. `~/your-projects/<project>/`)
2. **Color tokens** — `@theme` block in `app.css`. Pick a **distinctive palette** keyed
   to the niche; do NOT reuse Areg's oxblood+sun or Campscout's pine+sun.
3. **Type pairing** — never `Inter`, `Roboto`, `Poppins`, or `Space Grotesk`. Use
   `@fontsource-variable` packages for self-hosted variable fonts. Pair a distinctive
   display serif/sans-serif with a quieter body face, plus an italic accent.
4. **Component contracts** — `$lib/brand/Logo.svelte`, `$lib/brand/Wordmark.svelte`,
   `$lib/components/Nav.svelte`, `Footer.svelte`, plus niche-specific cards.
5. **Authoritative facts** — every name, address, phone, price comes from real sources
   (archive.org snapshots, the user's docs, current websites). NEVER fabricate.
6. **Don't-do list** — listed-out aesthetic failure modes (`#3498db`, `Segoe UI`,
   emoji icons, `rounded-full` everywhere, Bootstrap shadows, "Sarah M. verified guest").

Tailwind v4 specifics:

```css
/* src/app.css — the entire CSS file (under 200 lines) */
@import 'tailwindcss';
@import '@fontsource-variable/<display>';
@import '@fontsource-variable/<body>';
@import '@fontsource-variable/<accent>';

@theme {
  --color-<primary>: #...;
  /* … 8-12 named colors total … */
  --font-display: "<Display> Variable", Georgia, serif;
  --font-sans:    "<Body> Variable", ui-sans-serif, system-ui, sans-serif;
  --font-quote:   "<Accent> Variable", Georgia, serif;
}

@layer base { /* typography, focus ring, prefers-reduced-motion, ::selection */ }

/* ⚠️ CRITICAL: button variants go in @layer components, NOT @utility — Tailwind v4
   rejects @utility names containing ':' (so `@utility btn-primary:hover` fails build). */
@layer components {
  .btn-primary { /* ... */ }
  .btn-primary:hover { /* ... */ }
  .btn-ghost   { /* ... */ }
  /* … */
}

@utility eyebrow { /* utility-only classes are fine here */ }
```

## Information architecture template (niche-agnostic)

```
/                        Hero + 6-8 home-page sections
/<categoryA>             Index
/<categoryA>/[slug]      Detail
/<categoryB>             Index
/<categoryB>/[slug]      Detail
/search                  Filters + results
/about
/contact
/list-your-X             Operator-side B2B page (if directory)
/guides                  SEO content hub
/guides/[slug]           Long-form articles (3-5 to start)
/faq                     FAQ + FAQPage JSON-LD schema
/compare?ids=…           Side-by-side (if catalog-shaped)
/shortlist               localStorage favorites
/admin                   Password-gated CRM/leads view
/sitemap.xml             Dynamic from DB
/robots.txt              Cloudflare-managed prepended; append our rules
/+error.svelte           Custom 404
/api/health              Health JSON (PLATFORM USES THIS — DO NOT REMOVE)
/api/leads               POST → DB insert + 2 emails (admin notify + parent confirm)
/api/chat                Streaming proxy → Ollama gemma2:2b with RAG
/api/<niche-specific>    e.g. /api/camps-by-slug for shortlist hydration
```

For each detail page, the `<svelte:head>` MUST include:
- Unique `<title>` and `<meta name="description">`
- Canonical URL
- Open Graph + Twitter cards
- JSON-LD: `BreadcrumbList` + niche-appropriate (`Hotel`, `SportsActivityLocation`,
  `LocalBusiness`, `Organization`, `Product`, etc.)

JSON-LD helpers live in `$lib/server/seo.ts` exporting `organizationSchema`,
`websiteSchema`, `breadcrumbSchema`, `<niche>Schema`, `faqSchema`.

## Build sequence (parallel agent fanout)

This is THE pattern. It produced Campscout in one session.

1. **Set up the empty project skeleton yourself** (no agent):
   - `mkdir -p ~/your-projects/<project>/src/{lib/{brand,components,data,server},routes/api}`
   - Write `package.json`, `vite.config.ts`, `svelte.config.js`, `tsconfig.json`,
     `src/app.html`, `src/app.d.ts`, `src/app.css`
   - `npm install --no-audit --no-fund`
2. **Write the design-token contract** to `/tmp/<project>-contract.md`.
3. **Spawn parallel agents in a single message** (multiple Agent tool calls):

   | Agent | Model | Files |
   |---|---|---|
   | Brand assets | haiku | `Logo.svelte`, `Wordmark.svelte`, `static/favicon.svg` |
   | Nav + Footer | haiku | `Nav.svelte`, `Footer.svelte` |
   | Layout + DB + seed | haiku | `+layout.svelte`, `db.ts`, `hooks.server.ts`, `data/sports.ts`, `data/seed.ts`, `api/health` |
   | Home page (8 sections) | sonnet | `+page.svelte`, `+page.server.ts` |
   | Category index + detail | haiku | `<cat>/+page.svelte`, `<cat>/[slug]/+page.svelte` and server loads |
   | Item detail + lead form | sonnet | `<item>/[slug]/+page.svelte`, `LeadForm.svelte` |
   | Search with filters | sonnet | `/search/+page.svelte` |
   | Static pages | haiku | `/about`, `/list-your-X`, `/contact`, `/guides`, `/faq`, `/admin` |
   | API + chatbot widget | sonnet | `/api/leads`, `/api/chat`, `Chatbot.svelte`, `mail.ts` |
   | SEO core | haiku | `/sitemap.xml`, `/robots.txt`, `/+error.svelte`, `seo.ts` JSON-LD helpers |

   Use **haiku** for mechanical work and **sonnet** for design judgement (home page,
   detail pages, search UX, chatbot streaming).

4. **`npm run build`** locally to catch errors. Common failures + fixes:
   - `@apply` in a Svelte `<style>` block → remove (won't compile under Tailwind v4
     unless you set up `@reference`; easier to delete the `<style>` and rely on
     classes from `app.css`).
   - `class="!text-[…]"` (v3 important prefix) → rewrite to `class="text-[…]!"`
     (v4 suffix form). Sed: `s/!text-\[\([^]]+\)\]/text-[\1]!/g`.
   - Svelte template references undefined identifier (e.g. `{width}` instead of
     `width={size}` in an SVG) — Logo.svelte hit this; surfaces as silent
     "Internal Error" in production until `handleError` hook is added.
   - `Array(N)` in `{#each}` → use `Array.from({ length: N })` for Svelte 4.
5. **Tar with the right exclusions**:
   ```bash
   tar czf /tmp/<project>-deploy.tar.gz \
     --exclude=node_modules --exclude=.svelte-kit --exclude=build \
     --exclude=logs --exclude=tsconfig.tsbuildinfo \
     --exclude=package-lock.json --exclude=.git \
     -C ~/your-projects/<project> .
   ```
6. **Deploy via the platform API** (see Deploy section below).

## Platform deploy lifecycle

```bash
PLATFORM='https://{{PLATFORM_HOSTNAME}}'
AUTH="Authorization: Bearer $PLATFORM_API_KEY"
ORIGIN='Origin: https://{{PLATFORM_HOSTNAME}}'   # REQUIRED — SvelteKit CSRF rejects multipart POST without it

# List existing
curl -s -H "$AUTH" "$PLATFORM/api/v1/deployments"

# Delete (if exists, before redeploy with same subdomain)
curl -s -X DELETE -H "$AUTH" "$PLATFORM/api/v1/deployments/<id>"

# Deploy
curl -s -X POST --max-time 300 \
  -H "$AUTH" -H "$ORIGIN" \
  -F "name=<subdomain>" \
  -F "file=@/tmp/<project>-deploy.tar.gz" \
  "$PLATFORM/api/v1/deploy"
# Returns 201 with { id, subdomain, url }; on slow builds CF returns 524 after
# ~100s but server keeps building — verify by re-listing deployments.

# Verify
curl -sL "https://<subdomain>.{{BASE_DOMAIN}}/api/health"
```

Container env (set automatically by deployer):
```
DATABASE_URL=postgresql://u_<id>:<pw>@127.0.0.1:5432/app_<id>
ORIGIN=https://<subdomain>.{{BASE_DOMAIN}}
PORT=<allocated, e.g. 10007>
MAIL_API_KEY=<from platform .env>
MAIL_API_BASE=<from platform .env, e.g. https://{{MAIL_HOST}}/api>
ADMIN_EMAIL=<from platform .env>
MAIL_FROM=<from platform .env, e.g. "Brand <hello@verified-domain.com>">
```

Container uses `NetworkMode: 'host'` so:
- App listens on `0.0.0.0:${PORT}` directly on host
- Can reach Postgres at `127.0.0.1:5432`
- Can reach Ollama at `127.0.0.1:11434`
- Has working host DNS for outbound to {{MAIL_HOST}} etc.

## 3ava.com mail integration (Resend-compatible)

Endpoint: `POST https://{{MAIL_HOST}}/api/emails`

Auth: `Authorization: Bearer <MAIL_API_KEY>` (key prefix `am_…`)

Body (Resend shape):
```json
{
  "from": "Brand <hello@verified-domain.com>",
  "to": ["recipient@example.com"],
  "subject": "...",
  "html": "<p>...</p>",
  "reply_to": "user@example.com"
}
```

Response: `{ "id": "...", "status": "queued" }` on success.

The `from` domain MUST be verified on the user's 3ava account. Check verified domains:
```bash
curl -s -H "Authorization: Bearer $MAIL_API_KEY" https://{{MAIL_HOST}}/api/domains
```

Pick a verified domain or ask the user to verify a new one before changing `MAIL_FROM`.
Common verified domains as of 2026-04: `3ava.com`, `724vacation.com`, `hi2b.com`, `amdy.io`.
Default to `Brand <hello@3ava.com>` unless the user specifies otherwise.

`mail.ts` pattern (copy this verbatim, gated on env):
```ts
const KEY  = process.env.MAIL_API_KEY;
const BASE = (process.env.MAIL_API_BASE || 'https://{{MAIL_HOST}}/api').replace(/\/+$/, '');
const FROM = process.env.MAIL_FROM || 'Brand <hello@3ava.com>';

export async function sendMail(p: { to: string|string[]; subject: string; html: string; reply_to?: string }) {
  if (!KEY) { console.log('[mail] skipped (no key)'); return { sent: false, reason: 'no key' }; }
  const r = await fetch(`${BASE}/emails`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: FROM,
      to: Array.isArray(p.to) ? p.to : [p.to],
      subject: p.subject, html: p.html, reply_to: p.reply_to
    })
  });
  if (!r.ok) return { sent: false, reason: `HTTP ${r.status}` };
  const j = await r.json();
  return { sent: true, provider_id: j?.id };
}
```

## Ollama chatbot integration (RAG)

The deploy server runs Ollama natively on `127.0.0.1:11434`. Available models:
- `gemma2:2b` — recommended default, ~16 tok/s, ~2 GB RAM, ~0.5s first token
- `gemma4:e4b` — Google's 2026 reasoning model, ~6 tok/s, ~10 GB RAM, ~5s first token,
  REQUIRES `"think": false` in the request or it hits the predict cap on internal
  reasoning tokens with empty visible content

Server-side proxy at `/api/chat`:
```ts
const OLLAMA = process.env.OLLAMA_BASE || 'http://127.0.0.1:11434';
const MODEL  = process.env.CHAT_MODEL  || 'gemma2:2b';

export const POST: RequestHandler = async ({ request }) => {
  const { messages } = await request.json();
  const last = [...messages].reverse().find(m => m.role === 'user')?.content || '';

  // RAG: keyword-match against your DB, top 5
  const tokens = last.toLowerCase().match(/[a-z]{3,}/g) || [];
  // … build SQL query joining context tables, params=tokens.slice(0,6), LIMIT 5 …
  const ctx = relevant.map(r => `• ${r.name} — ${r.short_description}`).join('\n');

  const sysMsg = {
    role: 'system',
    content: `You are <Brand>'s assistant. Reply in 2-4 sentences. Never invent items not in CONTEXT below.\n\nCONTEXT:\n${ctx}`
  };
  const upstream = await fetch(`${OLLAMA}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: MODEL, stream: true,
      options: { num_predict: 300, temperature: 0.4 },
      messages: [sysMsg, ...messages.filter(m => m.role !== 'system')]
    })
  });
  return new Response(upstream.body, {
    headers: { 'Content-Type': 'application/x-ndjson', 'Cache-Control': 'no-store' }
  });
};
```

Client widget streams NDJSON, accumulates `chunk.message.content` into the live
assistant message bubble. See `Chatbot.svelte` in any deployed site for the pattern.

## Platform's known bugs (fixed but watch out)

These bugs were in the platform source on the server. They've been fixed but if a
fresh `npm run build` / `systemctl restart deploy-platform` exposes any of them
again on a new host setup, here's the playbook:

1. **`hooks.server.ts` prefix bug**: `split('_').slice(0,2).join('_')` rejoins to the
   full key, never matches the 8-char DB prefix. Fix: `rawKey.substring(0, 8)`.
2. **`auth.ts` SELECT missing `key_hash`** → bcrypt.compare(password, undefined) → 500.
   Fix: `SELECT ak.user_id, ak.key_hash, u.email FROM api_keys ak JOIN users u ON ak.user_id = u.id WHERE ak.prefix = $1`.
3. **API routes missing CSRF disable** → 403 on multipart POST. Add to every
   `/api/v1/*` route: `export const config = { csrf: { checkOrigin: false } };`.
4. **`createAppDatabase` missing public schema GRANTs** (Postgres 15+ default-deny).
   After CREATE DATABASE + CREATE USER + GRANT ALL PRIVILEGES ON DATABASE, also:
   ```ts
   const adminAppPool = new Pool({ connectionString: process.env.DATABASE_URL.replace(/\/[^/]+$/, `/${dbName}`) });
   await adminAppPool.query(`GRANT ALL ON SCHEMA public TO ${dbUser}`);
   await adminAppPool.query(`GRANT ALL ON SCHEMA public TO PUBLIC`);
   await adminAppPool.end();
   ```
5. **`docker.buildImage({}, { networkmode: 'host' })` silently ignored** by current
   Docker Engine. npm install hangs on bridge-network DNS. Fix: shell out to
   `execSync('docker build --network=host -t ${imageName} ${deployDir}', { stdio: 'inherit' })`.
6. **Container `NetworkMode: 'bridge'` + `PortBindings`** has DNS issues on this host —
   container can't resolve external hostnames. Use `NetworkMode: 'host'` + bind to the
   allocated port directly (Env: `PORT=${port}`, DB host: `127.0.0.1`).
7. **PostgreSQL `listen_addresses`**: must be `*` (not `localhost`) so containers can
   reach 5432 from any interface. `ALTER SYSTEM SET listen_addresses = '*'` + restart.
8. **nftables firewall** (`inet filter input`, policy drop): allow rules needed for
   - Cloudflare IPs → 80, 443
   - Docker bridge `172.17.0.0/16` → 5432 (harmless safety net even with host-net containers)
9. **SvelteKit body limit 512 KB** rejects every real tarball. Set
   `BODY_SIZE_LIMIT=10485760` in platform `.env` (loaded via systemd `EnvironmentFile`).
10. **`BASE_DOMAIN` env not loaded by systemd.** Required: `EnvironmentFile=-/opt/deploy-platform/.env`
    in the systemd unit. Also `Environment=NODE_ENV=production`.

## Tarball size budget

Max upload via `POST /api/v1/deploy` is the platform's `BODY_SIZE_LIMIT` (10 MB if
configured per #9 above). Hero images dominate. If your tar exceeds the limit:

```bash
# Resize to 1280px max width, q72, strip metadata
for img in static/images/*.{jpg,jpeg,png}; do
  convert "$img" -resize '1280x>' -quality 72 -strip -interlace JPEG "$img.new"
  mv "$img.new" "$img"
done
```

## Verification checklist (run before declaring victory)

- [ ] `curl -sL "$URL/" -o /dev/null -w 'HTTP %{http_code} size=%{size_download}\n'` → 200, > 20 KB
- [ ] Real-content grep on home: niche-specific keywords appear ≥3 times each (proves
      DB seed loaded, not a fallback page)
- [ ] All static + dynamic routes return 200 (loop the IA list)
- [ ] Custom 404 renders on `/intentionally-missing` — grep for your "still at camp"
      style brand-voice phrase
- [ ] `/sitemap.xml` lists every dynamic route (count `<url>` entries vs DB row count)
- [ ] `/robots.txt` ends with `Sitemap: $URL/sitemap.xml` (Cloudflare prepends managed
      content; that's fine, your line stays valid at the bottom)
- [ ] JSON-LD on home: grep `'application/ld+json'`, `'Organization'`, `'WebSite'`
- [ ] JSON-LD on item detail: niche-specific schema (Hotel/SportsActivityLocation/etc) +
      `BreadcrumbList`
- [ ] FAQPage JSON-LD on `/faq` if applicable
- [ ] `POST /api/leads` returns 201; row appears in `leads` table; if `MAIL_API_KEY`
      configured, two real sends appear in `GET https://{{MAIL_HOST}}/api/emails?limit=3`
- [ ] `POST /api/chat` streams NDJSON; assistant grounded in catalog (no hallucinations)
- [ ] `npm run check` clean (or no NEW errors versus baseline)

## Mapping a custom domain (e.g. cstandt.com → campscout container)

The platform only auto-provisions `*.{{BASE_DOMAIN}}`. For a custom domain:

1. **Cloudflare A record**: in the target domain's CF zone, add `@` and `www` A records
   pointing to `{{PLATFORM_HOST}}`, proxied. Or wildcard if you want all subdomains
   inherited.
2. **nginx vhost**: SSH and add a vhost in `/etc/nginx/sites-available/<custom-domain>`
   that proxies to the same `127.0.0.1:<port>` as the platform-managed vhost. Use the
   exact template from `templates/nginx-site.conf` in the vercel-clone repo.
3. **CF SSL mode**: must be `Flexible` if origin only has port 80, OR provision an
   Origin CA cert / Let's Encrypt and use `Full (Strict)`. Dashboard → SSL/TLS → Overview.

## Files to never delete

- `/api/health` route (platform's status check uses it)
- `hooks.server.ts` (lazy-init platform DB schema on first request)
- `nanoid` dep (used by ID generation in deployer)

## Cost-aware sub-agent model selection

When spawning sub-agents via the Agent tool:
- **Haiku** for mechanical/boilerplate: file scaffolds, npm installs, git ops,
  formatting fixes, web-search-driven research, scraping
- **Sonnet** for design judgment: home pages, detail pages, search UX, chatbot
  streaming, debugging unknown failure modes
- **Opus** is rarely needed for this kind of work — reserve for cross-system
  refactors or hard architectural decisions

User's standing rule (saved in memory): "estimate task difficulty before spawning;
default to haiku for simple work."

## Reference projects on this platform

- **`~/your-projects/<sister-app>/`** → `https://<sister-app>.{{BASE_DOMAIN}}` — Yerevan hotel
  revival from archive.org 2019 snapshots. Palette: oxblood + sun-gold on cream.
  Type: Fraunces + Public Sans + Playfair italic.
- **`~/your-projects/<your-app>/`** → `https://<your-app>.{{BASE_DOMAIN}}` — worldwide kids' summer
  camp directory with lead-gen CRM. Palette: pine + sun + ember on cream.
  Type: Bricolage Grotesque + Figtree + Fraunces italic. 25 seeded camps + chatbot.

Read either project's source as a working reference when starting a new niche.

## Memory artifacts

This skill is most powerful when paired with persistent memory at:
- `~/.claude/projects/-home-na-vercel-clone/memory/MEMORY.md` and siblings
- Specifically `project_campscout.md`, `reference_user_owned_services.md`,
  `feedback_agent_model_for_installs.md`

When starting a new project, write a fresh `project_<name>.md` memory file capturing:
- Domain target, brand name, sport/niche
- API keys location reminder (NEVER the keys themselves)
- Catalog size and depth decision
- Open follow-ups
