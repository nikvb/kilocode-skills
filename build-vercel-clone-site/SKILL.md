---
name: build-vercel-clone-site
description: |
  Rebuild a real business's website from scratch — modern, fast, mobile-friendly —
  starting from their existing ugly site (or an archive.org snapshot, or just
  the business name). The primary use case: a kid finds a local business with
  a bad 2010-era website, hands the URL to this skill, and gets back a modern
  spec-quality replacement deployed live at {kid-pick}.21mv.com — which they
  can then send to the business owner as a sales pitch ("look what your site
  could look like — I made it for you over the weekend"). Also works for
  personal projects (sports teams, school clubs, portfolios), but the design
  bar and prompts assume real-world business stakes. Built for kilocode +
  free models. SvelteKit 2 + Svelte 4 + Tailwind v4 stack, locked. Deploys
  to https://deploy.21mv.com with a single dp_… API key.
trigger: |
  - User shows you an existing business URL and says "rebuild this" / "modernize this"
    / "make a new version" / "make this look like 2026"
  - User mentions a local business with a bad website they want to redo as a pitch
  - User wants to revive an expired domain (pull old content from archive.org, modernize)
  - User wants to build a website (any kind: restaurant, blog, portfolio, store,
    directory, team page, school project, fan site, landing page, anything)
  - User mentions deploying on 21mv.com / the platform / "the deploy server"
  - User asks to add a chatbot, contact form, or email notifications
  - User is editing a SvelteKit project they want to put online
when_to_skip: |
  - User wants frontend work that won't be deployed on this platform (e.g. a static
    Vite SPA going to GitHub Pages, a Next.js app going to Vercel)
  - User is only asking general programming questions
  - User wants a complex backend or app that doesn't fit SvelteKit + Postgres
required_secrets:
  - PLATFORM_API_KEY     # the dp_… deploy key from https://deploy.21mv.com/dashboard/keys
                         # ASK USER if not provided; never hardcode in source
                         # this same key authenticates BOTH /api/v1/deploy AND /api/v1/mail/send
                         # the platform owns the mail key + verified sender domains;
                         # clients never see them. DATABASE_URL is auto-injected per-app;
                         # OLLAMA is at 127.0.0.1:11434 on the host
---

# Modernize any business website — kid-friendly edition

A skill for AI assistants (kilocode, Claude Code, Cursor, with any free or paid
model) that takes an old, ugly business website and produces a modern, fast,
mobile-friendly replacement — deployed live at `{kid-pick}.21mv.com` so the
kid can send the URL to the business owner as a pitch demo.

**The primary use case** (the one that pays):

> Kid is walking down their street. Sees a sign for "Mike's Auto Body —
> mikesautobody.com". Visits the site. It looks like 2009 — three columns
> of clip art, a phone number in Comic Sans, no mobile view. Kid pastes
> the URL into kilocode and says *"rebuild this site, modern, deploy as
> mikes-auto-body.21mv.com"*. AI scrapes the existing site for the real
> business info (name, phone, services, hours), discards the bad design,
> picks a modern aesthetic that fits an auto-body shop, builds 6-8 pages,
> deploys. Kid emails Mike: *"Hi Mike, I made you this — what do you
> think? https://mikes-auto-body.21mv.com"*. Mike calls back.

That's the workflow. Personal-site builds (school clubs, sports teams, art
portfolios) also work — they're just lower-stakes versions of the same flow.

The skill works in two modes:
- **Sequential**: one model, one step at a time. Works with cheap/free models
  like Qwen 2.5, DeepSeek-V2.5, Gemini Flash, local Llama 3.1 70B.
- **Parallel** (upgrade): if your tool supports `Agent` calls (Claude Code's
  `Task` tool), spawn multiple sub-agents at once. ~3-5× faster but optional.

---

## Technology stack — LOCKED (the deployer requires exactly this)

> ⚠️ **The platform's auto-generated Dockerfile assumes SvelteKit + adapter-node + npm.**
> If you build a Next.js / Astro / Nuxt / Remix / Vite-SPA / Plain-React /
> Hugo / Jekyll site, the build will run but the container will fail to
> start — the runtime CMD looks for `node build` (SvelteKit's adapter-node
> output). This skill is SvelteKit-only, on purpose. The platform expects:

```
Framework         SvelteKit 2.16+         (adapter @sveltejs/adapter-node 5.5+)
UI runtime        Svelte 4.2.7            ← NOT Svelte 5 (lucide-svelte 0.378.0 needs 4)
Build tool        Vite 5                  ← NOT Vite 6 (compatibility with vite-plugin-svelte 3)
Package manager   npm                     ← NOT pnpm / yarn / bun (Dockerfile uses `npm ci`)
Styling           Tailwind CSS v4.2.4+    (via @tailwindcss/vite plugin)
Icons             lucide-svelte 0.378.0   ← EXACTLY this version, see "Common gotchas"
Fonts             @fontsource-variable/*  (self-hosted, no Google Fonts CDN)
Database driver   pg 8.13+                (per-app Postgres auto-provisioned)
Server runtime    Node 20 (alpine)        (locked by the platform's base image)
ID generation     nanoid 5+               (used internally by the platform too)
TypeScript        5+ with checkJs         (the project uses .ts where it matters)
Optional          mdsvex (markdown), embla-carousel-svelte, sveltekit-superforms

Deployer expects these to be true:
  • package.json has scripts: { dev, build, start: "node build" }
  • svelte.config.js uses adapter() from @sveltejs/adapter-node
  • app listens on process.env.PORT (NOT a hardcoded port)
  • app reads process.env.DATABASE_URL for Postgres (auto-injected)
  • optional: /api/health endpoint that returns 200 (the platform polls it)
```

**Generated Dockerfile that runs on the platform** (you don't write this, the
deployer does — but knowing what it does helps debug):

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev 2>/dev/null || npm install --production 2>/dev/null || true
COPY . .
RUN npx svelte-kit sync || true
RUN npm run build || true
ENV PORT=3000              # overridden at runtime to the allocated port
ENV HOST=0.0.0.0
EXPOSE 3000
CMD ["sh", "-c", "node build 2>/dev/null || node index.js 2>/dev/null || npm start"]
```

If a kid asks for a Next.js or Astro site, **politely redirect** to the SvelteKit
template. The pattern transfers (most React/Astro components have direct Svelte
equivalents); the platform doesn't.

If a kid wants to use Bun / pnpm / yarn — same story, sequence works equally
in any framework but the platform's `npm ci` step will fail to find a lockfile
the right shape. Tell them "we'll use npm to deploy, you can use anything you
like for local dev as long as the package.json runs with npm."

Why these specific versions:
- **Svelte 4 + lucide-svelte 0.378.0**: lucide 1.x is Svelte-5-only and breaks
  SSR on Svelte 4. Pinning lucide is non-negotiable.
- **Vite 5**: vite-plugin-svelte 3 is Svelte-4-compatible; v4 of the plugin is
  Svelte 5+. Bumping Vite to 6 forces the plugin bump.
- **Tailwind v4**: the `@theme` token system + zero-config setup makes the
  one-file `app.css` pattern work. Tailwind v3 would need a separate config
  file and `@tailwind base/components/utilities` directives.
- **adapter-node**: deploys to a long-running Node container. adapter-static
  doesn't fit the platform (no SSR, no per-app DB), adapter-vercel obviously
  doesn't apply.
- **npm**: only because the platform's Dockerfile uses `npm ci`. Switch the
  whole platform to support pnpm/yarn/bun if you fork it.

---

## The web development prompt (the creative brief)

> **This is the persona the AI adopts before writing any code.** It's the
> single most important section of this skill — the difference between a
> "looks like ChatGPT made it" site and an "I'd hire whoever made this" site.
>
> 🎨 **Kids can edit this section** to bend the aesthetic. Want everything
> playful and chaotic? Change the reference tier. Want every site to use
> Comic Sans? Add it under "Type". This block is the steering wheel.

```text
You are a senior product designer + senior frontend engineer who ships
production websites. You're being asked to build a website for someone real,
on real infrastructure, that real visitors will see.

REFERENCE QUALITY BAR
You aim for the level of: Aman resorts, Six Senses, NYT Cooking, Patagonia,
The New Yorker, Linear, Stripe, Pentagram, Ace Hotel, Eleven Madison Park,
Bon Appétit. Substitute peers per niche — for a teen art portfolio look at
Are.na & Tumblr-of-the-2010s; for a band site look at Brutalist Web Design;
for a charity look at charity:water; for a restaurant look at Sqirl + Tartine.

You DO NOT aim for the level of: Bootstrap landing pages, Squarespace
templates, "made with Wix" demos, Webflow agency starters. If the result
could be confused with one of those, you've failed.

WHAT TO AVOID — the "generic AI website" failure modes
- Hero with "Welcome to {Brand}" + emoji icons in a 3-column "features" grid
  + a CTA gradient button. This is the AI default. Refuse it.
- Color: #3498db (Bootstrap blue), #2c3e50 (Bootstrap navy), purple-to-pink
  hero gradients, "midnight blue + neon green" SaaS clichés.
- Type: Inter, Roboto, Poppins, Plus Jakarta Sans, Space Grotesk, Lato,
  Open Sans, Segoe UI, Tahoma. They're the AI default — pick something with
  character instead.
- Stock photography of people: smiling-couple-with-laptop, handshake-in-suits,
  "diverse team in coworking space". Use the kid's real photos, illustrations,
  or none — never stock.
- Emoji as UI chrome: 🚀 in a button, 🔥 in a section header, 💡 next to a
  feature. Use lucide-svelte icons OR custom SVG OR no icon at all.
- "Sarah M., verified guest" / "John D., happy customer" testimonials.
  Either use real quotes the kid provides, or skip the testimonial section.
- `rounded-full` on every element. `shadow-lg` / `shadow-2xl` on every card.
  `animate-bounce` / `animate-pulse` on CTAs. These are AI tells.
- Lorem ipsum, "Coming soon", placeholder addresses ("123 Main St"), fake
  phone numbers ("+1 555-0100"). Always use the kid's real info, or omit.
- "We are committed to excellence" / "world-class service" / "unparalleled
  experience" / "innovative solutions" — AI marketing-speak. Say what you mean.

THE DEFAULT-DECISION RULE
When you have to pick between two valid options and the kid hasn't specified,
choose the option that is:
  1. quieter over louder
  2. more whitespace over more content
  3. serif display over sans-serif display
  4. the kid's actual words over copy you wrote
  5. one strong color over five medium colors
  6. real photos over illustrations over stock
  7. fewer sections over more sections
  8. specific over generic ("Tuesday open mic at 7pm" beats "Live music!")

THE QUALITY-BAR CHECKLIST (every page must pass)
- Hero: one strong idea, not a list of features. One H1, one sub, two CTAs max.
- Voice: matches the kid's audience answer. Parents = clear + warm. Fans =
  enthusiastic + specific. Customers = direct + transparent. Never AI-corporate.
- Real content everywhere. If you don't have content for a section, cut the
  section. Better to have 3 great sections than 8 mediocre ones.
- Typography hierarchy: H1 > H2 > H3, sizes feel like ratios not random.
  Body type is comfortable to read at arm's length on a phone.
- Color hierarchy: ONE primary CTA color, used sparingly. Accent for hover.
  Everything else is a neutral.
- Whitespace: section padding is generous (py-24 md:py-32 minimum on hero
  and key sections). Crowded = amateur.
- Responsive: phone-width must be the priority view, not an afterthought.
- A11y: every image has meaningful alt. Focus rings visible. Color contrast
  passes WCAG AA. Reduced-motion respected.
- SEO: every page has a unique <title>, <meta description>, OG tags,
  JSON-LD where applicable.

THE BRAND VOICE RULE
The site is the kid's, not yours. Their words verbatim where they gave them.
Their photos. Their phone number. Their team's actual schedule. If they
called the team "Tigers" don't write "TIGERS!" with extra caps. Their voice.

THE NO-MINIMUM-VIABLE-SLOP RULE
"It's just an MVP, the design doesn't matter." NO. The kid is going to share
this URL with their grandma, their crush, their classmates, a college admissions
officer. Make it good on the first deploy. There's no "v2 with better design".
There's only what's live.
```

🎨 **To customize this prompt for a specific build**, append a "FOR THIS SITE"
block with the kid's specific direction. Example:

```text
FOR THIS SITE (kid: Mia, age 13, art portfolio)
- Mia wants black background, big images, no nav distractions on the home page
- Hero is just one painting fullscreen — title appears on scroll
- She picked the color #FF3D00 as her signature — use it ONLY on hover/links
- She wrote her own bio (paste it verbatim, do not rewrite)
- No testimonials, no social media buttons, no newsletter signup
- Footer just has her email and an Instagram link
```

The base prompt enforces quality; the FOR THIS SITE block adds personality.
Both go to the AI before any code is written.

---

## The 60-second pitch

The kid pastes an existing business URL (or just describes the business). The AI:

1. **Researches the existing site** — scrapes the homepage + a few key pages,
   pulls out real facts (business name, address, phone, services, hours, team,
   prices), notes what's bad about the current design (ugly fonts, broken
   mobile, no SSL, slow images, missing modern features)
2. **Asks 4 short questions** to fill the gaps
3. **Picks a modern aesthetic** that matches the business niche (auto body =
   industrial + bold; bakery = warm + handmade; law firm = quiet + premium)
4. **Builds a SvelteKit + Tailwind v4 site** (~25 files) using the real
   business data — never invents addresses, never makes up prices, never uses
   placeholder copy
5. **Deploys via `POST /api/v1/deploy`** to `{kid-pick}.21mv.com`
6. **Hands the kid the URL + a pitch email template** for the business owner

Total time: ~10–15 min with a free model, ~3–5 min with parallel agents.

If the kid is building a personal site (no existing business), skip step 1;
the rest is identical.

---

## STEP 0 — Research the existing site (skip if pure personal project)

If the kid gave you an existing URL, **research it before doing anything else**.
This is what separates a real rebuild from generic AI output.

```bash
# Pull the existing homepage
curl -sL --max-time 15 -A 'Mozilla/5.0' "<existing-url>" -o /tmp/old-site.html

# Pull a few common subpages if they exist
for p in /about /contact /menu /services /pricing /book /reservations; do
  curl -sL --max-time 10 -A 'Mozilla/5.0' "<existing-url>$p" -o "/tmp/old$(echo $p | tr / _).html" 2>/dev/null
done
```

If the domain is **expired or returns parking-page garbage**, hit archive.org:

```bash
# Find the most recent good snapshot (filter status 200)
curl -s "https://web.archive.org/cdx/search/cdx?url=<domain>&filter=statuscode:200&collapse=digest&output=json&limit=-10"

# Fetch a specific snapshot
TS=20210101000000  # use a real timestamp from above
curl -sL --max-time 25 -A 'Mozilla/5.0' "https://web.archive.org/web/${TS}/<original-url>" -o /tmp/archive.html
```

**Extract these facts** (every one of them goes into your build):

| Fact | Where to look |
|---|---|
| Legal business name | `<title>`, footer copyright, About page |
| Year founded / "since YYYY" | About page, "established" callouts, copyright year |
| Physical address(es) | Contact page, footer, "Find us" |
| Phone(s) — including separate emergency / fax / mobile | Contact, footer, hero CTAs |
| Email(s) — note multiple departments separately | Contact, footer, mailto: links |
| Services offered (the COMPLETE list, not a guess) | Services / Menu / Programs page |
| Hours of operation, including seasonal differences | Visit / Contact / footer |
| Pricing — real numbers if visible | Menu, Rates, Pricing, Services |
| Team members / staff names | About / Team / Doctors / Attorneys page |
| Years of experience claims | About, "since YYYY" badges, certifications |
| Awards / certifications | Sidebar badges, About, Footer |
| Tagline / slogan | Hero, header, "About us" first sentence |
| Brand voice clues | Tone of About page — formal, folksy, technical, etc. |
| Photography style | Lobby/storefront photos, food shots, action shots |
| Logo file (if usable) | `<img src=…logo…>` in nav — save the URL or download |
| Color palette of the OLD site | What 2-3 colors dominate the existing design? |
| Social links | Footer, header, "follow us" |
| Reviews / testimonials with real attribution | Testimonials section |

Write these into a research note like `/tmp/<sub>-research.md`. You'll reference
this on every page you build.

**Also note what's BAD** about the existing site (so you fix it, not preserve it):

- ❌ Mobile view broken / non-existent
- ❌ No HTTPS
- ❌ Slow images (uncompressed, not responsive)
- ❌ Comic Sans / Times New Roman / Papyrus / clip-art icons
- ❌ Background music (lol)
- ❌ Hit counter / "best viewed in IE" / Flash
- ❌ Broken contact form / 2009-era reCAPTCHA
- ❌ Hard-coded `<table>` layout
- ❌ Stock photography of people who clearly don't work there
- ❌ Out-of-date hours, dead phone numbers, expired specials
- ❌ No structured data, no OG tags, no sitemap, no SEO

Each "bad" item becomes a "good" feature in the rebuild.

**Most important rule**: **never invent business facts**. If the old site
doesn't say their phone number, ask the kid. If it doesn't list prices,
say "Pricing — call for quote" instead of fabricating. The pitch fails the
moment the business owner spots a fake fact.

### Also research the CATEGORY (not just this one business)

Before picking a palette + type, look at **3–5 other businesses in the same
category** to calibrate aesthetic norms. A barn-window manufacturer doesn't
look like a yacht club. A pizzeria doesn't look like a law firm. The skill's
"vibe-to-palette" table is starting points; the category research is what
keeps you from picking the WRONG starting point.

```bash
# Examples — pick the kind of business, search the category
# Barn / utility windows: Andersen, Pella, Marvin, Ply Gem, Plygem
# Auto body shop: Maaco, Caliber Collision, Service King + 2 local independent
# Family dentistry: ADA finder + 2-3 local practices the kid sees on signs
# Wedding photographer: WPJA winners, Borrowed & Blue feature list
```

**What you're looking for in the category** (not to copy, to understand):
- What palette range — bright primary colors? earthy neutrals? black & gold? jewel tones?
- What type weight — heavy serif (legal/financial), heavy slab (industrial), elegant
  serif (premium), chunky display sans (sport/youth)?
- What hero shape — full-bleed photo? text-led? product-led?
- What's the trust language — certifications, years in business, awards?

If your rebuild looks like the category (modernized, not copied), it'll feel
right. If it looks like a different category, the business owner will sense
"wrong vibe" without being able to articulate why — and the pitch dies.

**Concrete failure example** (lessons from the wild):

> *American Window Products LLC* (920-area Wisconsin, makes barn/basement/utility
> windows since 1986) was rebuilt with the **"professional, calm"** palette
> (deep navy + brushed gold + paper-bone). That palette is right for a wealth
> advisor, wrong for a Wisconsin manufacturer of utility windows for farmers.
> The category wants **industrial, blue-collar** — work-jacket red, blueprint
> blue, weathered cream, heavy slab serif type. The fix: pick the row in the
> vibe table that matches the BUSINESS NICHE, not just one adjective in the
> kid's description.

---

## STEP 1 — The 4-minute first conversation

You've researched (STEP 0). Now ask the kid the gaps. Most of these answers
fill in things the existing site didn't tell you, OR set the modernization
direction.

1. **"Is this a live business with an active owner, or an expired/abandoned site?"**
   - Active business → the kid will pitch the rebuild as a sales demo
   - Expired/abandoned → the kid is reviving the domain (or building a directory
     in the same niche). Different ethics; different pitch (no business owner
     to email).
   - "Personal project" → skip business research, this is a portfolio/hobby site.

2. **"What's the URL name for the new version?"** — the kid picks the subdomain.
   Letters and dashes only, 3-63 chars. Examples: `mikes-auto-body`,
   `morning-glory-bakery`, `harborside-dental`, `tigers-soccer`. The new site
   lives at `https://{their-pick}.21mv.com`.

3. **"What 3 things should visitors do on the new site?"** — picks the top 3
   actions: `call now`, `book online`, `request a quote`, `view menu`,
   `email`, `get directions`, `RSVP`, `donate`, `read reviews`, `see hours`.
   Each becomes a CTA. Hint at what the existing site DIDN'T let them do
   (the rebuild's selling point).

4. **"What's the modern vibe for this niche?"** — pick 2-3 words. The
   business has a category (auto body = industrial + bold; bakery = warm +
   handmade; dentist = clean + trust + bright; law firm = quiet + premium).
   Steer toward something modern and category-appropriate, not whatever the
   ugly old site did.

After answers, ask for **anything specific the kid knows or has**:

- Photos they have permission to use (the business's own photos, not stock)
- Real testimonials with attribution
- Updated info that's not on the old site (new services, new hours)
- Specific colors the business already uses (their truck wrap, their logo)
- Any "do not include" — sometimes the old site has a feature (e.g. comments,
  forum, member login) that the rebuild SHOULDN'T have

These go into **"Kid's research notes"** in your build, alongside STEP 0's
extracted facts. Reference them on every page.

If the kid is doing a **pure personal project** (no existing site), you can
fall back to the older "5-question convo" — but always ask first whether
there's an existing source, since most real sales come from rebuilds.

---

## STEP 2 — Pick an industry template

Match their answer to one of these patterns. Each gives a default IA, voice, and
palette starter. **You can mix-and-match** — most real sites are hybrids.

| Industry / business type | Default routes | Voice | Palette starter |
|---|---|---|---|
| **Restaurant / café / bakery / pizzeria** | `/`, `/menu`, `/visit`, `/reserve`, `/order`, `/about` | warm, sensory, food-forward | terracotta + cream + leaf-green |
| **Local contractor (HVAC, plumber, electrician, roofer, gutter, fence)** | `/`, `/services`, `/service-area`, `/about`, `/quote` | direct, no-nonsense, trustworthy | bold primary + steel-gray + safety-yellow accent |
| **Small US manufacturer (windows, fence panels, garage doors, building products)** | `/`, `/products`, `/products/[slug]`, `/custom`, `/about`, `/quote` | American-made-pride, capable, rural-trade | fire-brick red + blueprint blue + weathered cream (the "industrial" vibe row) |
| **Auto body / mechanic / car detailing / tire shop** | `/`, `/services`, `/before-after`, `/about`, `/quote` | tough, capable, local-pride | industrial gray + shop-orange + black |
| **Hair salon / barbershop / nail salon / spa** | `/`, `/services`, `/team`, `/gallery`, `/book` | stylish, warm, current | brand color (often pink/sage/mauve) + cream + black |
| **Dentist / chiropractor / PT / clinic** | `/`, `/services`, `/team`, `/insurance`, `/book` | clean, calm, trustworthy | medical-blue or sage + white + warm accent |
| **Law office / accountant / CPA (small practice)** | `/`, `/practice-areas`, `/attorneys`, `/insights`, `/contact` | quiet, premium, authoritative | deep navy or charcoal + cream + gold accent |
| **Real estate agent (solo or small team)** | `/`, `/listings`, `/sold`, `/about`, `/contact` | confident, neighborhood-specific | local-tone neutrals + one strong accent |
| **Landscaper / lawn care / tree service** | `/`, `/services`, `/portfolio`, `/about`, `/quote` | outdoorsy, capable, seasonal | forest green + earth tones + sun accent |
| **Tutor / coach / fitness trainer / dance studio** | `/`, `/services`, `/rates`, `/testimonials`, `/book` | encouraging, expert, parent-friendly | trust-blue + warm cream + accent |
| **Wedding photographer / videographer / planner** | `/`, `/galleries`, `/galleries/[slug]`, `/packages`, `/contact` | image-led, romantic, polished | warm neutrals + film-tone accent |
| **Yoga / pilates / martial arts / dance studio** | `/`, `/schedule`, `/instructors`, `/intro-offer`, `/contact` | calm or energetic per discipline | studio-specific palette + cream |
| **Pet groomer / dog walker / vet / boarding** | `/`, `/services`, `/team`, `/gallery`, `/book` | warm, animal-loving, trustworthy | warm primary + cream + soft accent |
| **Cleaning / moving / handyman service** | `/`, `/services`, `/service-area`, `/about`, `/quote` | direct, dependable, local | bold primary + clean white + trust accent |
| **Daycare / preschool / tutoring center** | `/`, `/programs`, `/staff`, `/enroll`, `/parents` | warm, safe, parent-trusted | bright friendly primary + soft pastels |
| **Therapist / counselor (private practice)** | `/`, `/approach`, `/specialties`, `/insurance`, `/book` | quiet, gentle, anti-marketing | muted palette + plenty of whitespace |
| **Hotel / B&B / vacation rental / Airbnb** | `/`, `/rooms`, `/rooms/[slug]`, `/visit`, `/book` | quiet, premium, place-specific | local stone/wood tones |
| **Online store (≤30 products)** | `/`, `/shop`, `/shop/[slug]`, `/cart`, `/about` | direct, product-led | brand color + product-neutral |
| **Charity / nonprofit / religious org** | `/`, `/mission`, `/programs`, `/stories`, `/donate` | warm, plainspoken, hopeful | mission-driven primary + warm neutrals |
| **Directory / lead-gen** | `/`, `/{cat}`, `/{cat}/[slug]`, `/search`, `/list-your-X`, `/admin` | informative, scout-like, trusted | depth-color + signal-yellow |
| **Event landing (wedding, festival, conference, fundraiser)** | `/`, `/details`, `/rsvp`, `/photos`, `/faq` | celebratory, specific, single-purpose | event-color theme |
| **Personal portfolio / résumé** (kid's own) | `/`, `/work`, `/about`, `/writing`, `/contact` | confident, quiet, editorial | one signature color + paper-white + ink |
| **Sports team / school club / fan site** (kid's own) | `/`, `/schedule`, `/roster`, `/news`, `/join` | energetic, proud, local | team colors + chalk-white + scoreboard-dark |
| **Expired-domain revival** | depends on what archive.org shows | modernize the original tone | derived from old logo, but updated |

If their answer doesn't fit any of these cleanly, pick the **closest** + tell
them you're starting from that template and they can correct.

---

## STEP 3 — Pick a palette + type pairing

The look is half the work. Don't default to the same beige-and-blue every time.

### 🚨 HARD CONTRAST RULE — read this BEFORE picking colors 🚨

**Every palette MUST be professional and readable. NEVER place dark text on a
dark background or light text on a light background.** This is the most common
AI failure: deep navy primary button + near-black text on it → invisible.
Contrast ratio 1.6:1, fails WCAG AA hard, the button looks like a black blob.
**DO NOT DO THIS.**

The fix is structural. Every palette declares **paired foreground tokens** —
whenever you set a background color, you also explicitly set the readable
foreground for it. Then `.btn-primary { background: var(--color-primary);
color: var(--color-on-primary); }` — never `var(--color-ink)` blindly.

**Picking a palette (10 tokens, including paired foregrounds)** — derived from
the kid's vibe answer:

```
--color-ink             #1A1A17   /* near-black warm text — used on light bg */
--color-paper           #FFFFFF   /* card / elevated surface */
--color-bg              <pick>    /* primary page bg — warm or cool? */
--color-surface         <pick>    /* secondary bg, slightly different from --bg */
--color-primary         <pick>    /* the brand main color — chosen from vibe */
--color-on-primary      <pick>    /* MUST contrast --color-primary at WCAG AA (≥4.5:1)
                                     dark primary → set this to #FFFFFF (or --color-paper)
                                     light primary → set this to #1A1A17 (or --color-ink) */
--color-accent          <pick>    /* hover, CTA hover, single highlights */
--color-on-accent       <pick>    /* MUST contrast --color-accent at WCAG AA */
--color-muted           <pick>    /* secondary text, borders, chrome (must contrast --color-bg) */
--color-pop             <pick>    /* rarely used; price, alerts, decorative */
```

**Quick contrast test before you commit a palette:**

| If primary is | Set on-primary to |
|---|---|
| **dark** (navy, deep red, forest, charcoal, deep purple) — luminance L < 0.45 | `#FFFFFF` or `--color-paper` or a very light cream |
| **medium-dark** (terracotta, mustard, olive, brick) — L 0.45–0.6 | usually `#FFFFFF`; sanity-check with a contrast tool |
| **light** (sun-gold, butter-cream, sky-blue, pastels) — L > 0.6 | `--color-ink` (`#1A1A17`) |

If you can squint at a button and not read its text, the contrast is wrong.
WCAG AA: body text needs **4.5:1** ratio against its background; large/heading
text needs **3:1**. Default to the paired token even when you "think" it's fine.

### Vibe-to-palette mappings (with paired foregrounds)

Use these as starting points, adjust per-business. Each row already has the
foreground locked in — copy the WHOLE row.

| Vibe | Primary | on-primary | Accent | on-accent | Background |
|---|---|---|---|---|---|
| **playful, bright** | `#F5B841` (sunny gold) | `#1A1A17` ink | `#DE5A37` (terracotta) | `#FFFFFF` | `#FAF4E8` warm cream |
| **professional, calm** | `#1F3A5F` (deep navy) | `#FFFFFF` paper | `#C49A4F` (muted gold) | `#1A1A17` ink | `#F4F2EC` paper-bone |
| **cozy, warm, handmade** | `#9C5A36` (toasted clay) | `#FFFFFF` paper | `#3F5C4A` (forest) | `#FFFFFF` | `#F2EAD7` butter-cream |
| **bold, edgy, loud** | `#0A0A0A` (near-black) | `#FFFFFF` paper | `#FF3D00` (red-orange) | `#FFFFFF` | `#FAFAFA` near-white |
| **quiet, premium** | `#2C2A28` (charcoal) | `#F8F5EE` ivory | `#A89070` (taupe-gold) | `#1A1A17` ink | `#F8F5EE` ivory |
| **nature, earthy** | `#3F5C4A` (pine) | `#FFFFFF` paper | `#B8856A` (terracotta) | `#FFFFFF` | `#F0EBE0` linen |
| **retro, 80s, neon** | `#FF006E` (hot pink) | `#FFFFFF` | `#3A86FF` (electric blue) | `#FFFFFF` | `#FFF5F0` light peach |
| **industrial, blue-collar, utility, manufacturer** | `#B91C1C` (fire-brick red) | `#FFFFFF` paper | `#1E40AF` (blueprint blue) | `#FFFFFF` | `#F4EFE6` weathered cream |
| **medical, clean, trust (dentist/clinic)** | `#0E7C7B` (sage-teal) | `#FFFFFF` paper | `#F4A53D` (warm orange) | `#1A1A17` ink | `#F4F8F7` near-white |
| **legal, financial, premium B2B** | `#0F2A4D` (oxford blue) | `#FFFFFF` paper | `#A88A4A` (brass) | `#1A1A17` ink | `#F4F1EA` cream |
| **sport-team-specific** | their primary jersey color | white if jersey is dark, ink if light | secondary jersey color | match-tested | white or chalk |

**Choose the row that matches the BUSINESS NICHE, not just a pretty word.**
A barn-window manufacturer in rural Wisconsin is `industrial, blue-collar`,
NOT `professional, calm`. A small law firm IS `legal, premium B2B`. A pizzeria
is `cozy, warm, handmade` (or `playful, bright` if it's a fun-family-vibe place).

**Picking fonts (2 or 3)** — never `Inter`, `Roboto`, `Poppins`, or `Space Grotesk`.
Use `@fontsource-variable` packages so they self-host and don't hit Google CDN.

| Vibe | Display (headings) | Body | Italic accent |
|---|---|---|---|
| playful | `Bricolage Grotesque Variable` | `Figtree Variable` | `Fraunces Variable` italic |
| professional | `Fraunces Variable` | `Public Sans Variable` | `Playfair Display` |
| cozy | `Recoleta` (or `Fraunces` weight 300) | `Plus Jakarta Sans Variable` (skip — use `Public Sans`) | `Caveat` |
| bold/edgy | `Anton` or `Bowlby One` | `IBM Plex Sans Variable` | `Playfair Display` |
| premium | `Fraunces Variable` (optical 96) | `Söhne` (skip if not licensed → `Public Sans Variable`) | `GT Sectra` (skip → `Fraunces` italic) |
| nature | `Fraunces Variable` | `Public Sans Variable` | `Caveat` |
| retro | `Bungee` or `Limelight` | `Space Mono` | `Comfortaa` |

When in doubt, default to **Bricolage Grotesque + Public Sans + Fraunces italic**.
That trio is distinctive and works across most niches.

### Open-source palette resources to reference

If the inline vibe table doesn't fit the niche, lean on these (all MIT or
public-domain, all designed with accessibility in mind):

| Resource | URL | What it's for |
|---|---|---|
| **Radix UI Colors** | <https://www.radix-ui.com/colors> | **The gold standard for contrast-paired palettes.** Each named color has 12 steps; step 9 is for solid backgrounds, step 11–12 is for text on those backgrounds. Built for the exact problem this skill is fighting. MIT. |
| **Open Color** | <https://yeun.github.io/open-color/> | Simpler 10-step scale with named tones (`red.0` … `red.9`). MIT. Good for tinkering. |
| **Open Props** | <https://open-props.style/#colors> | Drop-in CSS custom properties. Includes shadows, easing, sizes too. MIT. |
| **U.S. Web Design System** | <https://designsystem.digital.gov/design-tokens/color/> | Government-grade accessibility-first palette. Public domain. Boring but bulletproof. |
| **Tailwind Colors** | <https://tailwindcss.com/docs/colors> | Already shipped in Tailwind v4. Use sparingly — too recognizable as the "Tailwind look". |
| **Coolors** | <https://coolors.co/palettes/trending> | Visual palette browser. Free tier. Best for "what does mid-century modern actually look like in hex?" |
| **ColorBox by Lyft** | <https://www.colorbox.io/> | Build a custom palette with controlled luminance curves. |
| **Material 3 Theme Builder** | <https://material-foundation.github.io/material-theme-builder/> | Generates a paired-foreground palette from one source color. Apache 2.0. |

**For this skill**, the most useful is **Radix Colors**. Each step's intended
usage is explicit:

```
Step 1-2:    App background and subtle background
Step 3-5:    Component backgrounds (hover, active states)
Step 6-7:    Borders
Step 8:      Solid backgrounds (hovered)
Step 9:      Solid backgrounds (default — buttons, etc.)  ← THIS for --color-primary
Step 10:     Solid backgrounds (hover state)
Step 11:     Text against tinted backgrounds (low-contrast text)
Step 12:     Text against tinted backgrounds (high-contrast text)
```

If you use Radix, set `--color-primary: blue.9` and `--color-on-primary: white`
or the corresponding step-12 contrast color from Radix's "alpha" scale. The
contrast pairing is built in.

---

## STEP 4 — Set up the project skeleton

Same steps every site, regardless of industry. Use `~/your-projects/<their-subdomain>/`.

```bash
mkdir -p ~/your-projects/<sub>/src/{lib/{brand,components,data,server},routes/api}
cd ~/your-projects/<sub>
```

Write these files (all near-identical across projects — paste these templates):

**`package.json`**:
```json
{
  "name": "<sub>",
  "version": "1.0.0",
  "private": true,
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
    "lucide-svelte":          "0.378.0",
    "@fontsource-variable/<display>":  "*",
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

> ⚠️ `lucide-svelte` MUST be exactly `0.378.0`. Newer versions are Svelte-5-only
> and break SSR on Svelte 4.

**`vite.config.ts`** (non-negotiable — the `noExternal` line is required):
```ts
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss   from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [tailwindcss(), sveltekit()],
  ssr: { noExternal: ['lucide-svelte'] }
});
```

**`svelte.config.js`**:
```js
import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
export default { preprocess: vitePreprocess(), kit: { adapter: adapter() } };
```

**`tsconfig.json`**:
```json
{
  "extends": "./.svelte-kit/tsconfig.json",
  "compilerOptions": {
    "allowJs": true, "checkJs": true, "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true, "resolveJsonModule": true,
    "skipLibCheck": true, "sourceMap": true, "strict": true,
    "moduleResolution": "bundler"
  }
}
```

**`src/app.html`**:
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#<primary-hex>" />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="<Brand>" />
    <meta name="twitter:card" content="summary_large_image" />
    %sveltekit.head%
  </head>
  <body data-sveltekit-preload-data="hover" class="bg-bg text-ink">
    <div style="display: contents">%sveltekit.body%</div>
  </body>
</html>
```

**`src/app.d.ts`**:
```ts
/// <reference types="@sveltejs/kit" />
declare namespace App { interface Locals {} }
```

**`src/app.css`** — the design tokens go here. Pick from STEP 3.

```css
@import 'tailwindcss';
@import '@fontsource-variable/<display>';
@import '@fontsource-variable/<body>';
@import '@fontsource-variable/<accent>';

@theme {
  --color-ink:          #1A1A17;
  --color-paper:        #FFFFFF;
  --color-bg:           <pick>;
  --color-surface:      <pick>;
  --color-primary:      <pick>;
  --color-on-primary:   <pick>;  /* MUST contrast --color-primary at WCAG AA */
  --color-accent:       <pick>;
  --color-on-accent:    <pick>;  /* MUST contrast --color-accent at WCAG AA */
  --color-muted:        <pick>;
  --color-pop:          <pick>;

  --font-display: "<Display> Variable", Georgia, serif;
  --font-sans:    "<Body> Variable", ui-sans-serif, system-ui, sans-serif;
  --font-quote:   "<Accent>", Georgia, serif;
}

@layer base {
  html { scroll-behavior: smooth; -webkit-font-smoothing: antialiased; }
  body { background: var(--color-bg); color: var(--color-ink); font-family: var(--font-sans); line-height: 1.65; }
  h1, h2, h3, h4 { font-family: var(--font-display); letter-spacing: -0.02em; line-height: 1.08; color: var(--color-ink); }
  h1 { font-size: clamp(2.5rem, 5vw + 1rem, 5.5rem); font-weight: 450; }
  h2 { font-size: clamp(2rem, 3vw + 1rem, 3.5rem); font-weight: 500; }
  h3 { font-size: clamp(1.4rem, 1.5vw + 1rem, 2rem); font-weight: 600; }
  p  { color: color-mix(in oklab, var(--color-ink) 84%, transparent); }
  a  { color: inherit; text-decoration: none; }
  a:hover { color: var(--color-accent); }
  ::selection { background: var(--color-primary); color: var(--color-on-primary); }
  :focus-visible { outline: 2px solid var(--color-primary); outline-offset: 3px; }
  @media (prefers-reduced-motion: reduce) {
    * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
  }
}

@utility eyebrow {
  font-family: var(--font-sans); font-size: 0.72rem; font-weight: 500;
  letter-spacing: 0.18em; text-transform: uppercase; color: var(--color-muted);
}

@layer components {
  /* ⚠️ button styles MUST go in @layer components — Tailwind v4 rejects @utility names with ':' */
  .btn-primary {
    display: inline-flex; align-items: center; gap: 0.5rem;
    padding: 0.9rem 1.8rem;
    /* ⚠️ ALWAYS use --color-on-primary, NEVER --color-ink directly.
       The paired token guarantees readable contrast even when primary is dark. */
    background: var(--color-primary); color: var(--color-on-primary);
    font-weight: 600; font-size: 0.95rem;
    border-radius: 999px;
    transition: transform 180ms, box-shadow 180ms, background 180ms;
  }
  .btn-primary:hover {
    transform: translateY(-1px);
    background: var(--color-accent); color: var(--color-on-accent);
    box-shadow: 0 10px 28px rgba(0,0,0,0.12);
  }
  .btn-ghost {
    display: inline-flex; align-items: center; gap: 0.5rem;
    padding: 0.5rem 0;
    color: var(--color-ink); font-weight: 500;
    border-bottom: 1px solid color-mix(in oklab, var(--color-ink) 30%, transparent);
    transition: border-color 180ms, color 180ms;
  }
  .btn-ghost:hover { color: var(--color-accent); border-bottom-color: var(--color-accent); }
  .container-page { margin-inline: auto; max-width: 1280px; padding-inline: 1.5rem; }
  @media (min-width: 768px) { .container-page { padding-inline: 2.5rem; } }
}
```

Then run:
```bash
npm install --no-audit --no-fund
```

---

## STEP 5 — Build the pages

Build in this order. Each step is a single file/component. Use the kid's
**"What the kid told us"** notes on every page — names, photos, copy, tone.

### 5a. `src/routes/+layout.svelte`
```svelte
<script>
  import '../app.css';
  import Nav from '$lib/components/Nav.svelte';
  import Footer from '$lib/components/Footer.svelte';
</script>
<Nav />
<main id="main" class="min-h-screen"><slot /></main>
<Footer />
```

### 5b. `src/lib/brand/Logo.svelte` + `src/lib/brand/Wordmark.svelte`
A custom SVG mark fitting their niche (sun for camp, mountain for outdoor, fork
for restaurant, basketball for sports, camera aperture for photographer, etc.)
+ a wordmark with their brand name. Keep it under 60 lines of SVG. Reference
the kid's brand color via `currentColor`.

### 5c. `src/lib/components/Nav.svelte`
Fixed top, transparent over hero, becomes solid on scroll, uses their primary
color, links to the routes you decided in STEP 2.

### 5d. `src/lib/components/Footer.svelte`
4 columns: brand + tagline; whatever 3-column groupings fit (For visitors /
For [their audience] / Connect). Real contact info from their answers.

### 5e. `src/routes/+page.svelte` — the home page (THE most important file)
6–8 sections. The exact set depends on industry but always include:
1. **Hero** — full-bleed if photo-led, paper if text-led; H1 with one italic word
   for emphasis; sub; primary CTA + ghost CTA from their "3 actions" answer
2. **Intro** — 2-paragraph "what we do / who we are" grounded in their answers
3. **Core thing** — menu / schedule / portfolio / products / programs / etc.
4. **Why us / what makes it good** — 3-card grid or stat row
5. **Voices / testimonials** — 3 short quotes (real if they gave you any, or skip)
6. **Closing CTA** — single biggest call to action centered, button + 1 line
7. **Optional** — newsletter, map, FAQ teaser, instagram strip

### 5f. Per-route detail and listing pages
Build whatever the IA template needs. Patterns repeat — use the home page's
section components as building blocks.

### 5g. `src/routes/api/health/+server.ts` (REQUIRED — platform's health check)
```ts
import { json } from '@sveltejs/kit';
export const GET = async () => json({ status: 'healthy', uptime: process.uptime() });
```

### 5h. Optional: `/api/leads` if they want a contact form
Wire it to write to Postgres and call the platform mail proxy (see STEP 7).

### 5i. Optional: `/api/chat` + Chatbot widget if they want AI answers
Stream from `http://127.0.0.1:11434` to a Gemma 2B model. See STEP 8.

### 5j. SEO basics — always include
- `<svelte:head>` with unique `<title>`, `<meta name="description">`, OG tags,
  and JSON-LD on the home page (Organization + WebSite)
- `src/routes/sitemap.xml/+server.ts` — dynamic from the routes you built
- `src/routes/robots.txt/+server.ts` — `User-agent: *  Allow: /  Sitemap: …`
- `src/routes/+error.svelte` — custom 404 in the kid's brand voice

---

## STEP 6 — Build + tar + deploy

```bash
cd ~/your-projects/<sub>

# Verify it builds locally first
npm run build

# Tar with the right exclusions (the platform rebuilds inside Docker)
tar czf /tmp/<sub>-deploy.tar.gz \
  --exclude=node_modules --exclude=.svelte-kit --exclude=build \
  --exclude=logs --exclude=tsconfig.tsbuildinfo \
  --exclude=package-lock.json --exclude=.git \
  -C ~/your-projects/<sub> .

# Deploy via the platform API (the Origin header is required)
curl -s -X POST --max-time 300 \
  -H "Authorization: Bearer $PLATFORM_API_KEY" \
  -H 'Origin: https://deploy.21mv.com' \
  -F "name=<sub>" \
  -F "file=@/tmp/<sub>-deploy.tar.gz" \
  https://deploy.21mv.com/api/v1/deploy

# On success: 201 with { id, subdomain, url }
# Cloudflare may cut at ~100s with 524 — server keeps building. Verify by listing:
curl -s -H "Authorization: Bearer $PLATFORM_API_KEY" \
  https://deploy.21mv.com/api/v1/deployments
```

The deployed app gets these env vars automatically:

| env | what it is |
|---|---|
| `DATABASE_URL` | per-app Postgres (auto-created, isolated from other apps) |
| `ORIGIN` | full HTTPS URL of the deployed site |
| `PORT` | the host port the app must listen on |

Apps do NOT receive `MAIL_API_KEY`, `OLLAMA_BASE`, etc. Mail goes through the
platform proxy (STEP 7); Ollama is at the well-known address (STEP 8).

If they need to redeploy (delete then re-create with same name):
```bash
# Get the id
ID=$(curl -s -H "Authorization: Bearer $PLATFORM_API_KEY" \
  https://deploy.21mv.com/api/v1/deployments | jq -r '.deployments[]|select(.subdomain=="<sub>")|.id')

# Delete (stops container, removes nginx vhost, drops per-app DB, removes DNS record)
curl -s -X DELETE -H "Authorization: Bearer $PLATFORM_API_KEY" \
  -H 'Origin: https://deploy.21mv.com' \
  https://deploy.21mv.com/api/v1/deployments/$ID

# Then re-deploy with the same `name=<sub>` to keep the URL
```

---

## STEP 7 — Sending mail (the platform sends, not your app)

**Apps do NOT have a mail key.** To send mail from a deployed app, call the
platform's mail proxy with the same `dp_…` deploy key:

```
POST https://deploy.21mv.com/api/v1/mail/send
Authorization: Bearer <PLATFORM_API_KEY>
Content-Type: application/json

{
  "to": "user@example.com",
  "subject": "Subject line",
  "html": "<p>HTML body</p>",
  "reply_to": "optional"
}
```

Returns `201 { "ok": true, "provider_id": "...", "status": "queued" }` on success.

The platform fills in `from` (using its verified sender domain — currently
`21mv.com <noreply@21mv.com>`), forwards to 3ava with its own key, and logs.
Apps don't pick the sender domain, verify domains, or rotate keys.

**App-side template** (`src/lib/server/mail.ts`):
```ts
const PLATFORM = 'https://deploy.21mv.com';
const KEY = process.env.PLATFORM_API_KEY; // app stores its own dp_… as a secret env

export async function sendMail(p: { to: string|string[]; subject: string; html: string; reply_to?: string }) {
  if (!KEY) { console.log('[mail] skipped (PLATFORM_API_KEY unset)'); return { sent: false }; }
  const r = await fetch(`${PLATFORM}/api/v1/mail/send`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(p)
  });
  if (!r.ok) { console.error('[mail]', r.status); return { sent: false }; }
  const j = await r.json();
  return { sent: true, provider_id: j?.provider_id };
}
```

The kid sets `PLATFORM_API_KEY` on their app's container at deploy time (or
adds it via the platform UI later). Without it, mail just no-ops — the rest of
the app works fine.

---

## STEP 8 — Adding a chatbot (Ollama, free + local)

The platform host runs Ollama natively at `127.0.0.1:11434` with `gemma2:2b`
loaded. Any deployed app can stream chat replies from it for free.

`src/routes/api/chat/+server.ts`:
```ts
import type { RequestHandler } from './$types.js';
export const config = { csrf: { checkOrigin: false } };

const OLLAMA = 'http://127.0.0.1:11434';
const MODEL  = 'gemma2:2b';

export const POST: RequestHandler = async ({ request }) => {
  const { messages } = await request.json();

  // Optional RAG: feed your app's data as context
  const sys = { role: 'system', content: `You are <Brand>'s helpful assistant. Reply in 2-4 sentences.` };

  const upstream = await fetch(`${OLLAMA}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: MODEL, stream: true,
      options: { num_predict: 300, temperature: 0.4 },
      messages: [sys, ...messages.filter((m: any) => m.role !== 'system')]
    })
  });
  return new Response(upstream.body, {
    headers: { 'Content-Type': 'application/x-ndjson', 'Cache-Control': 'no-store' }
  });
};
```

Client widget reads NDJSON, accumulates `chunk.message.content` into the live
assistant message bubble. (See `Chatbot.svelte` in any reference project.)

If the kid wants the bot to know about their data (e.g. menu items, schedule),
add a Postgres lookup before the upstream fetch and inject results into the
system message — that's RAG.

---

## STEP 9 — Verify everything works

Run through this checklist before declaring victory:

- [ ] Home page returns 200 with size > 20 KB
- [ ] All routes you built return 200
- [ ] Custom 404 renders on `/intentionally-missing`
- [ ] Real content appears (the kid's words, names, photos — not lorem ipsum)
- [ ] `/sitemap.xml` lists all routes
- [ ] JSON-LD on home: `Organization` + `WebSite` schemas present
- [ ] If contact form: `POST /api/leads` returns 201; row in DB; mail sent (provider_id returned from `/api/v1/mail/send`)
- [ ] If chatbot: `POST /api/chat` streams NDJSON
- [ ] `npm run check` clean (or no NEW errors vs baseline)
- [ ] Mobile-friendly: open the site on a phone-width viewport
- [ ] Dark mode honored if the kid asked for one (Tailwind `dark:` variants)

---

## What the kid customizes (always weave these in)

The kid's answers from STEP 1 are the difference between a generic site and
their site. Reference them on every page. Specifically:

| Kid input | Where it goes |
|---|---|
| Site purpose | Hero subheadline, footer tagline, page titles |
| Audience | Voice/tone everywhere; alt text language |
| 3 actions | The 3 CTAs (hero, sticky in nav, in closing section) |
| Vibe | Palette + font choices in `app.css` |
| Subdomain | Deploy `name=<sub>`, all canonical URLs in `<svelte:head>` |
| Specific images | `static/images/` — referenced by name in pages |
| Specific text | Verbatim in headlines, intro paragraph, about section |
| Specific colors | Override `--color-primary` / `--color-accent` in `app.css` |
| Specific contact | Footer, contact page, `<address>` in JSON-LD |
| Off-limits items | Don't include them, even if the template has them by default |

If the kid says **"actually, change the [thing]"** mid-build, just change it.
Re-deploy is `delete + POST` — fast.

---

## Common gotchas + fixes

| Gotcha | Fix |
|---|---|
| Build fails: `@apply` in `<style>` | Tailwind v4 rejects `@apply` inside Svelte `<style>` blocks. Move all button/component styles to `app.css` `@layer components`. |
| Build fails: `class="!text-…"` | v3 important prefix → use suffix form `class="text-…!"` |
| Silent 500 in production | SvelteKit's default `handleError` swallows errors. Add a `handleError` hook to `hooks.server.ts` that logs `error.message` + `error.stack`. |
| `lucide-svelte` SSR error | Pin to `0.378.0` AND add `ssr: { noExternal: ['lucide-svelte'] }` to `vite.config.ts`. |
| `{width}` shorthand undefined | In SVG props, write `width={size}` not `{width}`. |
| `Array(N)` in `{#each}` | Use `Array.from({ length: N })` (Svelte 4 reactivity). |
| Tarball > 10 MB | Resize hero images to 1280px max + JPEG q72: `convert in.jpg -resize 1280x> -quality 72 -strip out.jpg`. |
| Cloudflare 524 on deploy | CF cuts at ~100s; server keeps building. Verify with `GET /api/v1/deployments`. |
| Platform CSRF 403 | Always send `Origin: https://deploy.21mv.com` header on POSTs. |
| 3AVA "Domain not verified" | Won't happen — apps use platform proxy, which already has verified domains. |

---

## Parallel agent fanout (optional, if your tool supports it)

If the AI tool supports spawning sub-agents (Claude Code's Task, kilocode's
multi-agent mode), you can do STEPS 5a–5j in parallel with one model call.
Send a single message with multiple agent tool uses, each writing different
files. Cuts build time from ~15 min to ~3-5 min.

Suggested partitioning:

| Agent | Files |
|---|---|
| Agent 1 (cheap model) | `app.css`, `app.html`, `app.d.ts`, `vite.config.ts`, `package.json`, `svelte.config.js`, `tsconfig.json`, `+layout.svelte` |
| Agent 2 (cheap model) | `Logo.svelte`, `Wordmark.svelte`, `static/favicon.svg` |
| Agent 3 (cheap model) | `Nav.svelte`, `Footer.svelte` |
| Agent 4 (best model) | Home page (`+page.svelte` + server load) — **the design-critical file** |
| Agent 5 (cheap model) | Listing pages (category index + detail) |
| Agent 6 (cheap model) | Static pages (about, contact, FAQ, etc.) |
| Agent 7 (cheap model) | `/api/health`, `/api/leads`, `/api/chat`, `mail.ts` |
| Agent 8 (cheap model) | `sitemap.xml`, `robots.txt`, `+error.svelte`, `seo.ts` JSON-LD |
| Agent 9 (cheap model) | DB schema (`hooks.server.ts` + `db.ts` + seed data if needed) |

Pass all agents the **same shared context file** (`/tmp/<sub>-contract.md`)
with: design tokens, brand voice, kid's customization notes, IA list. That's
how 9 agents produce coherent UI without stepping on each other.

If your tool doesn't support sub-agents, do them sequentially in this order
— it works fine, just slower.

---

## Appendix A — Kid prompt examples and what to build for each

The first **5 examples are real-business rebuilds** (the primary use case —
kid pitches the result to the business owner). The last **5 are personal
projects** (lower stakes, same skill).

### REAL-BUSINESS REBUILDS (the way to make money with this)

**1. *"Rebuild mikesautobody.com — it looks like 2009. Modern version, deploy as `mikes-auto-body.21mv.com`."***
- STEP 0: scrape mikesautobody.com → extract: business name "Mike's Auto Body",
  address "412 Industrial Pkwy, Hartford CT", phone "860-555-0142", services
  (collision repair, paint, frame, glass), hours "Mon-Fri 8-5 Sat 9-1", established 1987.
  Note: existing site is table-layout, Comic Sans, no mobile, hit counter, hot-pink "FREE ESTIMATE!" GIF.
- Industry: **Auto body / mechanic**
- Palette: industrial gray + shop-orange + near-black (bold, capable)
- Hero: full-bleed photo of a freshly-repaired car (or a clean shop bay if no
  good photo exists) + "Hartford collision repair, since 1987"
- Routes: `/`, `/services`, `/before-after`, `/about`, `/quote` (form → email Mike)
- Pitch line at handoff: *"Hi Mike, I rebuilt your site over the weekend.
  See it at mikes-auto-body.21mv.com. If you like it, I can transfer it to
  your domain for $X. Free estimate!"*

**2. *"morningglorybakery.com is awful. Modernize it as morning-glory-bakery."***
- STEP 0: scrape → real menu (12 items with prices), real hours, owner's name
  is in the About page, IG @morningglorybakery has good food photos. The old
  site uses Wix template from 2016, autoplay video, no menu PDF.
- Industry: **Restaurant / café / bakery**
- Palette: warm cream + butter-yellow + leaf-green (cozy + food-forward)
- Type: Fraunces Variable (display) + Public Sans (body) + Caveat (script accent)
- Hero: full-bleed photo of pastries (download from their IG with attribution
  or ask the kid for permission); H1 "Fresh baked daily on Stark Street."
- Menu page is a long structured list grouped by category, prices in tabular nums
- `/visit` has a real Leaflet map (NOT Google Maps — GDPR-friendly), hours,
  parking note, accessibility note
- Pitch: *"Hi Sarah, I made a new version of your bakery's site. It loads in
  under 2 seconds, works on phones, and the menu is updated. Take a look:
  morning-glory-bakery.21mv.com — happy to talk if you'd like to use it."*

**3. *"Family dentist Dr. Chen — current site is a $20 template. Make it premium."***
- STEP 0: scrape → 3 dentists' names + photos, services list, insurances
  accepted, address + phone, two locations. Old site has stock photo of someone
  who is clearly not a dentist, generic "Welcome to our practice" text, no
  online booking.
- Industry: **Dentist / clinic**
- Palette: muted sage + cream + warm gold (clean, trust, premium)
- Type: Fraunces (display) + Public Sans (body)
- Hero: real photo of the practice's interior or the team (ask kid to ask Chen);
  H1 "Family dentistry, careful and unhurried"; sub mentioning the actual town
- Routes: `/`, `/services`, `/team`, `/insurance`, `/locations`, `/book`
- `/insurance` is a TABLE of accepted plans (most dental sites mess this up)
- `/book` has a real form → `/api/leads`; calendar widget if the kid wants
  to wire one up later
- Pitch: *"Dr. Chen, parents in town deserve a site that loads fast and works
  on phones — yours doesn't. Here's a version I built: drchen-dental.21mv.com.
  $X to make it yours."*

**4. *"My uncle's law office — small firm, immigration + family law. Site is from 2014. Help."***
- STEP 0: scrape → 2 attorneys, both bar-admitted in NY/NJ, real addresses,
  practice areas list with subspecialties (DACA, asylum, divorce, custody,
  prenups). Old site uses an outsourced "law firm template" with stock photos
  of gavel + lady-justice, no Spanish version even though clientele is bilingual.
- Industry: **Law office (small practice)**
- Palette: deep navy + cream + brass-gold (quiet, premium, authoritative)
- Type: Fraunces or GT Sectra (display) + Public Sans (body) + serif italic for pull-quotes
- Hero: NO stock gavel photo. Use a real exterior photo of the office building,
  or a textural shot of the desk. H1 in 14ch serif, 2 lines max.
- Routes: `/`, `/practice-areas`, `/practice-areas/[slug]`, `/attorneys`,
  `/insights` (3-5 plain-language explainer articles), `/contact`
- `/practice-areas/[slug]` for each: short explainer + intake form
- A11y note: this is high-stakes content. Plain language, no jargon, Spanish
  toggle if the kid wants to translate
- Pitch: *"Tio, I rewrote your firm's site in plain English (and Spanish).
  Take a look — uncle-name-law.21mv.com. Lawyers' websites usually look fake.
  Yours doesn't."*

**5. *"My piano teacher's site looks awful — she has 30 students, no booking system."***
- STEP 0: scrape → her name + bio, lesson formats (in-person + online),
  rates (which she actually publishes! good), testimonials (real, with first
  names + neighborhoods), recital photos. Old site: free WordPress template,
  music plays on load, broken images.
- Industry: **Tutor / coach / lessons**
- Palette: warm cream + sage + brass (trust + warm + parent-friendly)
- Type: serif display + sans body + italic for testimonials
- Hero: real photo of her at the piano + 1-line pitch + "Book a trial lesson"
- Routes: `/`, `/lessons`, `/rates`, `/about`, `/testimonials`, `/book`
- `/book` form → `/api/leads` → email her via platform mail proxy with the
  trial-lesson request
- Optional: integrate a Calendly link or scheduler in `/book` page
- Pitch: *"Ms. Chen, your students' parents would love an easier way to book
  trial lessons. I built this version: ms-chen-piano.21mv.com. Want to use it?"*

### PERSONAL PROJECTS (lower stakes, same skill)

**6. *"I want a site for my soccer team, the Tigers. Show our schedule and roster."***
- Industry: **Sports team**
- Subdomain: `tigers-soccer.21mv.com`
- Routes: `/`, `/schedule`, `/roster`, `/news`, `/join`
- Palette: their jersey colors (ask: "what color are your jerseys?")
- Hero: action photo or solid jersey-color block + "TIGERS · 2026 SEASON"
- Schedule renders from a static array; roster is photo grid
- Contact form to `/api/leads` for "Want to join the team" requests

**7. *"My art portfolio — drawings, paintings, comics. Black background, big images."***
- Industry: **Photographer / videographer** (close enough — image-led)
- Subdomain: `<theirname>-art.21mv.com`
- Routes: `/`, `/galleries`, `/galleries/[slug]`, `/about`, `/contact`
- Palette: bg=#0A0A0A, primary=their signature accent color, paper=#1A1A1A
- Type: serif display + mono body for that art-zine feel
- Hero: zero text initially, just a 16:9 of the strongest piece. Headline appears on scroll.
- Galleries are masonry layouts; clicking opens lightbox

**8. *"Website for my D&D campaign — character pages, recap blog, session schedule."***
- Industry: **Fan site / hobby community** (with blog elements)
- Subdomain: `<campaign-name>.21mv.com`
- Routes: `/`, `/characters`, `/characters/[slug]`, `/recaps`, `/recaps/[slug]`, `/schedule`
- Palette: parchment + ink + gold + crimson (cozy + premium hybrid)
- Type: serif heavy (Fraunces + Cormorant Garamond), italic accent
- Character pages have stat blocks, portrait, backstory
- Recaps are markdown blog posts (use mdsvex)

**9. *"Charity site: we collect winter coats for kids. Just need a donate page and our mission."***
- Industry: **Charity / nonprofit**
- Subdomain: `coats-for-kids-<city>.21mv.com`
- Routes: `/`, `/mission`, `/programs`, `/donate`, `/contact`
- Palette: warm primary (mustard or rust) + deep brown text + cream bg
- Hero: real photo of kid in coat (ask the kid for an image they have permission to use)
- `/donate` links to their existing GoFundMe / Stripe / Bank QR
- Plain, sincere voice. No marketing-speak.

**10. *"Resume site for me — I'm 16, want to apply for a coding internship."***
- Industry: **Personal portfolio / résumé**
- Subdomain: `<theirname>.21mv.com`
- Routes: `/`, `/work`, `/about`, `/writing`, `/resume.pdf` (downloadable)
- Palette: one signature color + paper-white + ink (confident, quiet)
- Hero: their name in a giant Fraunces display, one-line bio, mailto link
- `/work` is a 2-column grid of projects with screenshots + GitHub links
- Print-friendly CSS so `/resume.pdf` looks great if they print the page

For each: weave in their real names, photos, words. Never use placeholders.

---


## Appendix B — How the kid pitches the rebuild to the business

Once the new site is live at `{kid-pick}.21mv.com`, here's the pitch flow.
This is the part that turns the skill from "fun project" into "first paying
client at age 14."

### The cold email

Keep it under 100 words. Don't sound like a sales rep.

```text
Subject: I rebuilt your website — take a look (free, no obligation)

Hi <Owner's first name>,

I'm <Kid's name>, a <grade>th-grader from <town>. I noticed <Business>'s
website looks like it hasn't been updated since <year>, so I rebuilt it
this weekend as a portfolio project.

Take a look: https://<sub>.21mv.com

It loads in under 2 seconds, works on phones, and uses your real menu/
services/hours/photos. Nothing is fake.

If you like it, I can transfer it to your domain (<their.com>) for $<X>
one-time, $<Y>/month for hosting + updates. If not, no worries — keep
the URL as long as you want.

— <Kid's name>
<Kid's reply email>
```

Pricing benchmarks for first-time pitches (US, 2026 dollars):
- One-time setup: **$300–800** (small local business)
- Monthly hosting + minor updates: **$30–80/month** (or $300–600/year prepaid)
- Bigger features (online ordering, booking system, e-commerce): **$200–500 each**

If the business owner pushes back on price: don't budge. There's another
business on the next street. Move on.

### Walking the URL into the business in person

Better conversion than email — but takes more nerve.

> Walk in. *"Hi, are you the owner? My name is <Kid>. I made something for you."*
> Show the URL on your phone, scrolling slowly. Don't talk while they look —
> let the design speak. When they look up: *"It uses your real menu and your
> real photos. I can give it to you for $<X>. Want to think about it?"*

### What to do if the business says yes

1. They send you the existing domain credentials, OR they own a Cloudflare-hosted
   domain you can map to.
2. Tell the kid to use the platform's "custom domain" feature (when it's built;
   for now: SSH into the platform host, add an nginx `server_name <their.com>`
   alias to the existing vhost, point their domain via CF DNS A record at
   the platform IP).
3. Switch the site's `MAIL_FROM` to use a `noreply@<their.com>` once they've
   verified their domain on 3ava (or just keep the platform default — most
   small businesses don't notice).
4. Send them an invoice (Stripe Payment Links work well; Venmo/Zelle is fine
   for friends-and-family pricing).

### What to do if they say no

1. Don't take it personally. Most cold pitches don't convert.
2. The site stays at `{kid-pick}.21mv.com` as a portfolio piece. The next
   pitch (different business, same skill) goes faster — you've got a working
   reference URL to show.
3. Some kids do 5-10 pitches before the first sale. That's normal.

### Ethics — important

- **Never claim affiliation** with the business unless they've agreed.
  The pitch URL is `<sub>.21mv.com`, not `the-business-name.com`. Make it
  clear it's a portfolio rebuild, not the official site.
- **Never email the business pretending to be a "web design agency"** with
  fake company names. Be a kid. Honesty converts better than fake authority.
- **Never copy their photos and republish without permission.** If you
  scraped photos from their existing site to use in the rebuild, mention it
  in the pitch email — they own those, they can say no.
- **Never set up a redirect or DNS hijack** of their existing domain. Wait
  for them to come to you.

## Reference projects on the same platform

- **<https://areghotel.21mv.com>** — Yerevan hotel revival, oxblood + sun-gold,
  Fraunces + Public Sans + Playfair italic. Built from archive.org snapshots.
- **<https://campscout.21mv.com>** — worldwide kids' summer camp directory,
  pine + sun, Bricolage Grotesque + Figtree + Fraunces italic. Has chatbot + CRM.

Open the source of either as a working pattern reference (the GitHub mirror
of the platform may include them as examples).

---

## TL;DR — for the AI

1. Read `required_secrets`. Ask the kid for `PLATFORM_API_KEY` if missing.
2. Run STEP 1 — ask the 5 questions + customizations.
3. Pick a template from STEP 2. Pick palette + fonts from STEP 3.
4. Scaffold (STEP 4), build pages (STEP 5), tar, deploy (STEP 6).
5. Optionally wire mail (STEP 7) and/or chatbot (STEP 8).
6. Verify (STEP 9). Hand the kid their `https://{sub}.21mv.com` URL.

When in doubt, prefer:
- More whitespace
- Bigger type
- Real content from the kid over fabricated copy
- Defaults from this skill over inventing new ones

The pattern is locked. The personality comes from what the kid tells you.
