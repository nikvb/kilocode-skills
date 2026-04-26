# kilocode-skills

Agent skills for AI coding assistants — works with **kilocode** (free models!), **Claude Code**, **Cursor**, and any tool that understands skill files with YAML frontmatter.

## What's here

### [`build-vercel-clone-site`](./build-vercel-clone-site/SKILL.md)

**Rebuild any business's old, ugly website into a modern one — and pitch it to them.**

Find a local business with a bad 2010-era site. Paste the URL into kilocode. The AI:

1. Scrapes the existing site for the **real business info** (name, address, phone, services, hours, team)
2. Picks a modern design that fits the business niche (auto body = bold/industrial, bakery = warm/handmade, dentist = clean/trust)
3. Builds the new site (~25 SvelteKit + Tailwind v4 files) using the real data — never fabricates
4. Deploys it live at `{your-pick}.21mv.com`
5. Hands you a pitch-email template you can send to the business owner

**That's the kid-side service business.** Walk down your street, find an ugly site, rebuild it over the weekend, email the owner with a `https://your-version.21mv.com` URL, charge $300–800 if they want to keep it. Real businesses, real money, real portfolio.

Also works for personal projects (your soccer team, school club, art portfolio, D&D campaign) — same skill, lower stakes.

Designed for **kids and beginners using kilocode with FREE models** (Qwen 2.5, DeepSeek-V2.5, Gemini Flash, local Llama 3.1). No credit card. The AI builds the site on your computer, then asks for your platform API key and deploys it for you.

> **Stack is locked**: SvelteKit 2 + Svelte 4 + Tailwind v4 + lucide-svelte 0.378.0 + adapter-node + npm + Node 20. The platform's Dockerfile generator expects exactly this. Next.js / Astro / Nuxt / pnpm / bun won't work. (See [skill](./build-vercel-clone-site/SKILL.md#technology-stack--locked-the-deployer-requires-exactly-this) for why.)

**Sites you can build with this**:

- 🍞 Restaurants, cafés, bakeries — menu, hours, reservations
- ⚽ Sports teams & clubs — schedule, roster, news, signup
- 🎒 School clubs & class projects — about, members, projects
- 📷 Portfolios — artists, photographers, writers, students applying for internships
- 🛍️ Tiny online stores — up to ~30 products
- 📝 Blogs & newsletters — markdown posts, RSS, subscribe
- 🏨 Hotels & B&Bs — rooms, gallery, booking
- ❤️ Charities — mission, programs, donate page
- 🔍 Directories — lead-gen sites for any niche (camps, therapists, contractors, etc.)
- 🎉 Event landing pages — birthdays, weddings, festivals, RSVPs
- 🎲 Fan / hobby sites — D&D campaigns, fandoms, niche communities
- 🌐 Expired-domain revivals — pull the old site from archive.org, modernize, relaunch
- ✨ Anything else — the skill covers patterns, not just specific niches

**Live demonstrations** (built with this exact skill):

| URL | What it is |
|---|---|
| <https://areghotel.21mv.com> | A historical Yerevan hotel revived from archive.org snapshots — oxblood + sun-gold palette |
| <https://campscout.21mv.com> | Worldwide kids' summer-camp directory with lead-gen CRM and chatbot — pine + sun palette |

## How it works (kid version)

1. **Install kilocode** in VS Code (it's free): <https://kilo.code>
2. **Pick any free model** in kilocode's settings (Qwen 2.5 Coder is great)
3. **Drop the skill into your project**:
   ```bash
   git clone https://github.com/nikvb/kilocode-skills ~/.kilocode/skills/kilocode-skills
   ```
4. **Sign up at <https://deploy.21mv.com/auth/signup>** and copy your `dp_…` API key
5. **Tell the AI what you want** — it'll ask 5 quick questions, then build the site
6. **Give it your API key when it asks** — it deploys, you get a live URL

That's the whole thing. No servers. No DNS. No email setup.

## Install

### kilocode

```bash
git clone https://github.com/nikvb/kilocode-skills ~/.kilocode/skills/kilocode-skills
```

Or grab just the one skill:

```bash
mkdir -p ~/.kilocode/skills/build-vercel-clone-site && \
curl -sL https://raw.githubusercontent.com/nikvb/kilocode-skills/main/build-vercel-clone-site/SKILL.md \
  -o ~/.kilocode/skills/build-vercel-clone-site/SKILL.md
```

### Claude Code (per project)

```bash
mkdir -p .claude/skills && \
curl -sL https://raw.githubusercontent.com/nikvb/kilocode-skills/main/build-vercel-clone-site/SKILL.md \
  -o .claude/skills/build-vercel-clone-site.md
```

### Cursor / others

Drop the file in your tool's skills directory.

## What the AI asks the kid

When the skill activates, the AI runs through 5 quick questions (~2 minutes total):

1. **What's the site for?** — restaurant, sports team, portfolio, store, etc.
2. **Who's it for?** — parents, classmates, customers, fans, anyone…
3. **What 3 things do you want visitors to do?** — book, email, read, buy, RSVP, donate, sign up…
4. **What's the vibe?** — playful / professional / cozy / bold / quiet / nature / retro
5. **What's the URL name?** — letters and dashes only, e.g. `tigers-soccer` → `tigers-soccer.21mv.com`

Plus any **specific stuff the kid wants included**: their photos, their text, their colors, their phone number, things to leave OUT, etc.

The AI uses every answer on every page. Generic AI slop is the failure mode this skill works hardest to avoid.

## Example prompts a kid can paste

> *"Build me a site for my soccer team, the Tigers. Show our schedule and roster. Use the build-vercel-clone-site skill. My deploy key is dp_…"*

> *"My mom owns a bakery — site with menu, location, contact form. Use the build skill, name it `morning-glory-bakery`."*

> *"Resume site for me — I'm 16, applying for a coding internship. Use the skill, my name is the subdomain."*

> *"Revive cstandt.com from archive.org as a Colorado-Springs gymnastics directory."*

> *"Birthday invite for my brother Lucas — RSVP page, what to bring, address. He's turning 8."*

The skill includes 10 worked examples in [Appendix A](./build-vercel-clone-site/SKILL.md#appendix-a--kid-prompt-examples-and-what-to-build-for-each).

## What the platform gives every deployed site (you don't configure these)

| Service | How your code uses it |
|---|---|
| Postgres database (per app, isolated) | `process.env.DATABASE_URL` |
| Local Gemma 2B chatbot | `http://127.0.0.1:11434` (Ollama API) |
| Public HTTPS via Cloudflare | `process.env.ORIGIN` |
| Server port | `process.env.PORT` |

### Sending email from your app

Your app does NOT send mail directly. It calls the platform's mail proxy with the same `dp_…` API key:

```bash
curl -X POST https://deploy.21mv.com/api/v1/mail/send \
  -H 'Authorization: Bearer dp_…' \
  -H 'Content-Type: application/json' \
  -d '{"to":"someone@example.com","subject":"Hello","html":"<p>Hi from my app</p>"}'
```

The platform sends through verified domains (`21mv.com`, `3ava.com`, etc.) on your app's behalf. You never need a separate mail key, and you never have to verify your own sending domain. Returns `{"ok":true,"provider_id":"...","status":"queued"}` on success.

## Why a SKILL, not a TEMPLATE?

A template gives starter code. A skill teaches the AI assistant the **pattern** — design tokens, build sequence, common gotchas, mail flow, chatbot flow, the verification checklist — so when a kid says *"build me a site for my D&D campaign"* the assistant adapts the pattern to that specific brief instead of dumping a generic template on them.

The skill encodes ~40 hours of trial-and-error. Whoever uses it gets the lessons free.

## Free models that work well with this skill

The skill is written for sequential, deterministic builds, so even smaller free models do well:

- **Qwen 2.5 Coder 32B** (free on OpenRouter / local) — best for SvelteKit code
- **DeepSeek-V2.5** (free on DeepSeek API) — great reasoning, fast
- **Gemini 2.0 Flash** (free on Google AI Studio) — solid all-rounder
- **Llama 3.1 70B Instruct** (free on Groq / local) — works fine
- **Local: Qwen 2.5 7B / Gemma 2 9B** — if you have a decent laptop

Avoid the smallest models (under 7B) — they struggle with longer context and multi-file consistency.

## License

MIT. Remix freely.

## Contributing

Pull requests welcome. Ideas for more skills in this repo:
- `revive-expired-domain` — wraps the archive.org → modern site flow into a reusable pattern
- `niche-research` — drives parallel web-search agents for directory cataloging
- `seo-audit` — runs a checklist against any deployed site
- `kid-friendly-color-picker` — turns a vibe word into a complete palette
