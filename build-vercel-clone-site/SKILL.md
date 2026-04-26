---
name: build-vercel-clone-site
description: |
  Build a real website with one prompt — restaurants, sports teams, school clubs,
  portfolios, photographers, online stores, local businesses, directories,
  expired-domain revivals, anything. Designed for kids and beginners using
  kilocode with FREE models (Qwen, DeepSeek, Gemini Flash, local Llama). The
  skill walks the model through a step-by-step build of a SvelteKit + Tailwind
  v4 site, then deploys it to https://deploy.21mv.com — the kid only needs ONE
  API key (their dp_… deploy key) to get a live URL at {their-name}.21mv.com.
  No server, no email setup, no DNS — the platform handles everything.
trigger: |
  - User wants to build a website (any kind: restaurant, blog, portfolio, store,
    directory, team page, school project, fan site, landing page, anything)
  - User mentions deploying on 21mv.com / the platform / "the deploy server"
  - User asks to revive an expired domain
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

# Build any website with one prompt — kid-friendly edition

A skill for AI assistants (kilocode, Claude Code, Cursor, with any free or paid
model) that builds and deploys a real website on the hosted vercel-clone
platform at `https://deploy.21mv.com`. Designed so a 12-year-old can say
*"build me a site for my soccer team"* and walk away with a live URL.

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

The kid types ONE prompt. The AI:

1. Asks them 5 short questions about what they want
2. Picks a design palette + fonts that fit their answer
3. Builds a SvelteKit + Tailwind v4 site (about 25 files)
4. Tars it up
5. POSTs to `https://deploy.21mv.com/api/v1/deploy`
6. Returns the live URL: `https://{theirpick}.21mv.com`

Total time: ~10–15 minutes with a free model, ~3–5 minutes with parallel agents.

---

## STEP 1 — The 5-minute first conversation

Before writing a single line of code, ask the kid these five questions in order.
Use AskUserQuestion (or just plain text in tools that don't have it). **Do not skip**
— the answers are what makes the site theirs and not generic AI slop.

1. **"What's the site for?"** — pick an industry from the list below, or describe
   it in a sentence. (Restaurant, sports team, school club, portfolio, online
   store, blog, photographer, hotel, charity, event, directory, fan site, …)

2. **"Who's it for?"** — pick the main audience. (Parents, classmates, fans,
   customers, people in my city, anyone on the internet, …) Keeps tone right.

3. **"What 3 things do you want visitors to do?"** — pick the top 3 actions:
   `book a table`, `email me`, `read my posts`, `buy a thing`, `find a class`,
   `download my résumé`, `watch a video`, `donate`, `RSVP`, `subscribe`, etc.
   Each becomes a CTA on the site.

4. **"What's the vibe?"** — pick 2–3 words: `playful, bright, friendly` /
   `professional, calm, modern` / `cozy, warm, handmade` / `bold, edgy, loud` /
   `quiet, premium, refined` / `nature, earthy, outdoor` / `retro, 80s, neon`.
   This drives the palette.

5. **"What's the URL name?"** — they pick the subdomain. Letters and dashes only,
   3–63 chars. Examples: `tigers-soccer`, `sams-bakery`, `mias-art`, `coachmike`.
   The site lives at `https://{their-pick}.21mv.com`.

After they answer, **also ask for any specifics they want included**:

- Specific images (hand them URLs or paths)
- Specific text (a paragraph they wrote, a quote, an "about me")
- Specific colors (their team colors, school colors, an existing logo color)
- Specific contact info (their email, their phone, their school's address)
- Anything off-limits (no testimonials, no chatbot, no signup form, …)

These go into a section called **"What the kid told us"** in your build notes,
and you reference it on every page.

---

## STEP 2 — Pick an industry template

Match their answer to one of these patterns. Each gives a default IA, voice, and
palette starter. **You can mix-and-match** — most real sites are hybrids.

| Industry / use case | Default routes | Voice | Palette starter |
|---|---|---|---|
| **Restaurant / café / bakery** | `/`, `/menu`, `/visit`, `/reserve`, `/about` | warm, sensory, food-forward | terracotta + cream + leaf-green |
| **Sports team / club** | `/`, `/schedule`, `/roster`, `/news`, `/join` | energetic, proud, local | team-color primary + chalk-white + scoreboard-dark |
| **School club / class project** | `/`, `/about`, `/projects`, `/members`, `/contact` | clear, friendly, concise | one bold accent + neutrals |
| **Personal portfolio / résumé** | `/`, `/work`, `/about`, `/writing`, `/contact` | confident, quiet, editorial | one signature color + paper-white + ink |
| **Photographer / videographer** | `/`, `/galleries`, `/galleries/[slug]`, `/about`, `/book` | image-led, minimal text | full-bleed black/white + accent |
| **Tutor / coach / lessons** | `/`, `/services`, `/rates`, `/testimonials`, `/book` | encouraging, expert, parent-friendly | trust-blue + warm cream + accent |
| **Online store (≤30 products)** | `/`, `/shop`, `/shop/[slug]`, `/cart`, `/about` | direct, product-led | brand color + product-neutral |
| **Blog / newsletter** | `/`, `/posts`, `/posts/[slug]`, `/about`, `/subscribe` | thoughtful, editorial | serif heavy, single accent |
| **Hotel / B&B / vacation rental** | `/`, `/rooms`, `/rooms/[slug]`, `/visit`, `/book` | quiet, premium, place-specific | local stone/wood tones |
| **Charity / nonprofit** | `/`, `/mission`, `/programs`, `/stories`, `/donate` | warm, plainspoken, hopeful | mission-driven primary + warm neutrals |
| **Directory / lead-gen** | `/`, `/{cat}`, `/{cat}/[slug]`, `/search`, `/list-your-X`, `/admin` | informative, scout-like, parent-trusted | depth-color + signal-yellow |
| **Event landing (party, wedding, festival)** | `/`, `/details`, `/rsvp`, `/photos`, `/faq` | celebratory, specific, single-purpose | event-color theme |
| **Fan site / hobby community** | `/`, `/fav`, `/posts`, `/links`, `/about` | enthusiastic, personal, niche-specific | playful, saturated |
| **Expired-domain revival** | depends on what archive.org shows | match the original tone | derived from old logo / old palette |

If their answer doesn't fit any of these cleanly, pick the **closest** + tell
them you're starting from that template and they can correct.

---

## STEP 3 — Pick a palette + type pairing

The look is half the work. Don't default to the same beige-and-blue every time.

**Picking a palette (8 colors)** — derived from the kid's vibe answer:

```
--color-ink            #1A1A17   /* near-black warm text */
--color-paper          #FFFFFF   /* card / elevated surface */
--color-bg             <pick>    /* primary page bg — warm or cool? */
--color-surface        <pick>    /* secondary bg, slightly different from --bg */
--color-primary        <pick>    /* the brand main color — chosen from vibe */
--color-accent         <pick>    /* hover, CTA hover, single highlights */
--color-muted          <pick>    /* text that's secondary, borders, chrome */
--color-pop            <pick>    /* rarely used; price, alerts, decorative */
```

Vibe-to-color mappings (use these as starting points, adjust per-site):

| Vibe | Primary | Accent | Background |
|---|---|---|---|
| playful, bright | `#F5B841` (sunny gold) | `#DE5A37` (warm terracotta) | `#FAF4E8` warm cream |
| professional, calm | `#1F3A5F` (deep navy) | `#C49A4F` (muted gold) | `#F4F2EC` paper-bone |
| cozy, warm, handmade | `#9C5A36` (toasted clay) | `#3F5C4A` (forest) | `#F2EAD7` butter-cream |
| bold, edgy, loud | `#0A0A0A` (near-black) | `#FF3D00` (red-orange) | `#FAFAFA` near-white |
| quiet, premium | `#2C2A28` (charcoal) | `#A89070` (taupe-gold) | `#F8F5EE` ivory |
| nature, earthy | `#3F5C4A` (pine) | `#B8856A` (terracotta) | `#F0EBE0` linen |
| retro, 80s | `#FF006E` (hot pink) | `#3A86FF` (electric blue) | `#FFF5F0` light peach |
| sport-team-specific | their primary jersey color | secondary jersey color | white or chalk |

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
  --color-ink:     #1A1A17;
  --color-paper:   #FFFFFF;
  --color-bg:      <pick>;
  --color-surface: <pick>;
  --color-primary: <pick>;
  --color-accent:  <pick>;
  --color-muted:   <pick>;
  --color-pop:     <pick>;

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
  ::selection { background: var(--color-primary); color: var(--color-ink); }
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
    background: var(--color-primary); color: var(--color-ink);
    font-weight: 600; font-size: 0.95rem;
    border-radius: 999px;
    transition: transform 180ms, box-shadow 180ms, background 180ms;
  }
  .btn-primary:hover {
    transform: translateY(-1px);
    background: var(--color-accent);
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

**1. *"I want a site for my soccer team, the Tigers. Show our schedule and roster."***
- Industry template: **Sports team**
- Subdomain: `tigers-soccer.21mv.com`
- Routes: `/`, `/schedule`, `/roster`, `/news`, `/join`
- Palette: their jersey colors (ask: "what color are your jerseys?")
- Hero: action photo or solid jersey-color block + "TIGERS · 2026 SEASON"
- Schedule renders from a static array; roster is photo grid
- Contact form to `/api/leads` for "Want to join the team" requests

**2. *"My mom owns a bakery — site with menu, location, contact form."***
- Industry: **Restaurant / café / bakery**
- Subdomain: `<momsname>-bakery.21mv.com`
- Routes: `/`, `/menu`, `/visit`, `/order`, `/about`
- Palette: terracotta + cream + leaf-green (cozy, warm, handmade)
- Hero: full-bleed photo of pastries + "Fresh, daily, since [year]"
- Menu page is a long list grouped by category, prices in tabular nums
- `/visit` has hours, address, embedded map (Leaflet + OSM, no Google Maps)

**3. *"My art portfolio — drawings, paintings, comics. Black background, big images."***
- Industry: **Photographer / videographer** (close enough — image-led)
- Subdomain: `<theirname>-art.21mv.com`
- Routes: `/`, `/galleries`, `/galleries/[slug]`, `/about`, `/contact`
- Palette: bg=#0A0A0A, primary=their signature accent color, paper=#1A1A1A
- Type: serif display + mono body for that art-zine feel
- Hero: zero text initially, just a 16:9 of the strongest piece. Headline appears on scroll.
- Galleries are masonry layouts; clicking opens lightbox

**4. *"Site for my dad's tutoring business, math + physics, ages 14-18."***
- Industry: **Tutor / coach / lessons**
- Subdomain: `<dadsname>-tutoring.21mv.com`
- Routes: `/`, `/services`, `/rates`, `/about`, `/book`
- Palette: trust-blue + warm cream + orange accent (professional, parent-friendly)
- Hero: "Math + physics tutoring for high schoolers · Brooklyn · since 2018"
- `/services` lists subjects with grade levels; `/rates` has a transparent table
- `/book` form captures parent name, student age, subjects, preferred times → `/api/leads`

**5. *"Website for my D&D campaign — character pages, recap blog, session schedule."***
- Industry: **Fan site / hobby community** (with blog elements)
- Subdomain: `<campaign-name>.21mv.com`
- Routes: `/`, `/characters`, `/characters/[slug]`, `/recaps`, `/recaps/[slug]`, `/schedule`
- Palette: parchment + ink + gold + crimson (cozy + premium hybrid)
- Type: serif heavy (Fraunces + Cormorant Garamond), italic accent
- Character pages have stat blocks, portrait, backstory
- Recaps are markdown blog posts (use mdsvex)

**6. *"My senior project: an online directory of LGBTQ-friendly therapists in the Bay Area."***
- Industry: **Directory / lead-gen** (close to Campscout)
- Subdomain: `bay-affirming-care.21mv.com`
- Routes: `/`, `/specialty`, `/specialty/[slug]`, `/therapists/[slug]`, `/search`, `/about`, `/list-your-practice`
- Palette: muted lilac + sage + cream (quiet, premium, calming)
- Hero: editorial headline, no stock photos
- Therapist detail pages with verified credentials + lead form
- Sensitive topic — voice is calm, plain, anti-marketing

**7. *"My band's website. We're called Static Bloom. Show tour dates, stream our songs, sell merch."***
- Industry: **Hybrid** (events + store + about)
- Subdomain: `staticbloom.21mv.com`
- Routes: `/`, `/tour`, `/listen`, `/shop`, `/shop/[slug]`, `/about`
- Palette: bold/edgy — black + neon green or magenta + grain texture
- Type: Bowlby One display + Space Mono body
- Hero: full-bleed band photo (B&W) + tour-dates strip below
- Shop is barebones (Stripe link out, not an embedded checkout — that's another feature)

**8. *"Charity site: we collect winter coats for kids. Just need a donate page and our mission."***
- Industry: **Charity / nonprofit**
- Subdomain: `coats-for-kids-<city>.21mv.com`
- Routes: `/`, `/mission`, `/programs`, `/donate`, `/contact`
- Palette: warm primary (mustard or rust) + deep brown text + cream bg
- Hero: real photo of kid in coat (ask the kid for an image they have permission to use)
- `/donate` links to their existing GoFundMe / Stripe / Bank QR
- Plain, sincere voice. No marketing-speak.

**9. *"Birthday party invite for my brother — RSVP, address, what to bring."***
- Industry: **Event landing**
- Subdomain: `<brothername>-bday.21mv.com`
- Routes: `/`, `/details`, `/rsvp`
- Palette: party-bright (whatever theme — superhero, dinosaur, princess, gaming)
- Hero: countdown timer + "Lucas turns 8! · Saturday March 14"
- `/details` is the practical block — address, what to bring, parking
- `/rsvp` form → `/api/leads` (parent name + kid name + yes/no)

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
