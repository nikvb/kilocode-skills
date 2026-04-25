# kilocode-skills

A growing collection of agent skills for AI coding assistants — works with **kilocode**, **Claude Code**, **Cursor**, and any other tool that understands skill files with YAML frontmatter.

## What's here

### [`build-vercel-clone-site`](./build-vercel-clone-site/SKILL.md)

Build, deploy, and operate niche-specific websites — directories, lead-gen sites, expired-domain revivals, hotels, kids' camps, restaurants, SaaS landing pages — on a self-hosted vercel-clone-style platform.

**What you get when an agent uses this skill:**

- SvelteKit 2 + Svelte 4 + Tailwind v4 + lucide-svelte production stack
- Per-page Open Graph + JSON-LD schema (Hotel / SportsActivityLocation / FAQPage / Organization / WebSite / BreadcrumbList) for SEO
- Lead-capture form → DB → transactional email (Resend / Resend-compatible API)
- Streaming chatbot proxied to a local Ollama model (gemma2:2b default), RAG-augmented from the catalog
- Sitemap, robots, custom 404, full-bleed editorial home page, search with filters, side-by-side compare, localStorage shortlist
- A **parallel agent fanout pattern** that produces a coherent ~25-page site in one session by spawning 9 sub-agents in a single message

**Live demonstrations** (built with this exact skill):

| URL | Niche | Brand |
|---|---|---|
| `https://<sister-app>.<your-base-domain>` | Yerevan hotel revived from archive.org snapshots | oxblood + sun-gold on cream, Fraunces + Public Sans |
| `https://<your-app>.<your-base-domain>` | Worldwide kids' summer-camp directory + lead-gen CRM | pine + sun on cream, Bricolage Grotesque + Figtree |

(Substitute the host names from your own platform.)

## Install

### kilocode

Clone all skills:

```bash
git clone https://github.com/nikvb/kilocode-skills ~/.kilocode/skills
```

Or just one:

```bash
mkdir -p ~/.kilocode/skills/build-vercel-clone-site
curl -sL https://raw.githubusercontent.com/nikvb/kilocode-skills/main/build-vercel-clone-site/SKILL.md \
  -o ~/.kilocode/skills/build-vercel-clone-site/SKILL.md
```

### Claude Code (per-project)

```bash
mkdir -p .claude/skills
cd .claude/skills
git submodule add https://github.com/nikvb/kilocode-skills .
```

Or copy a single skill into `.claude/skills/<name>/SKILL.md`.

### Cursor / others

Most tools that read frontmatter-Markdown skills can use these as-is. Drop the file in your tool's skills directory.

## You'll need to substitute

The skill is parameterized — you provide your own infrastructure values. Find these placeholder variables in `build-vercel-clone-site/SKILL.md` and replace them with your own (or just give them to the AI when it asks):

| Placeholder | What it is | Example |
|---|---|---|
| `{{PLATFORM_HOST}}` | IP address of your VPS that runs the platform | `203.0.113.42` |
| `{{PLATFORM_HOSTNAME}}` | DNS hostname of the platform's dashboard/API | `deploy.mydomain.com` |
| `{{BASE_DOMAIN}}` | Where deployed sites land as subdomains | `mydomain.com` |
| `{{MAIL_HOST}}` | Resend or Resend-compatible mail API host | `api.resend.com` or `mail.mybrand.com` |

And two API keys (the skill prompts for these at runtime — never commit them):

| Secret | Source |
|---|---|
| `PLATFORM_API_KEY` (`dp_…`) | Generated in your platform's `/dashboard/keys` page |
| `MAIL_API_KEY` (`am_…` for Resend / Resend-clones, `re_…` for Resend itself) | Resend dashboard or your self-hosted clone |

## What the platform looks like

```
   ┌────────────────────────────────────────────┐
   │  Cloudflare (proxied DNS, free tier)       │
   │  - your-domain.com zone (wildcard target)  │
   │  - mail-domain.com (verified mail sender)  │
   └──────────────────┬─────────────────────────┘
                      │ HTTPS
   ┌──────────────────┴─────────────────────────┐
   │  Your VPS (Hetzner / Netcup / DigitalOcean)│
   │  ┌─────────────────────────────────────┐   │
   │  │  nginx — vhost per deploy           │   │
   │  └────────┬────────────────────────────┘   │
   │           │ proxy_pass http://127.0.0.1:N  │
   │  ┌────────┴────────┐  ┌─────────────────┐  │
   │  │ vercel-clone    │  │ deploy-<sub>    │  │
   │  │ platform        │  │ host-networked  │  │
   │  │ :3000 (systemd) │  │ Docker          │  │
   │  └────────┬────────┘  └────────┬────────┘  │
   │           │ DATABASE_URL       │            │
   │  ┌────────┴───────────────────┴──┐         │
   │  │  PostgreSQL 16                 │         │
   │  └────────────────────────────────┘         │
   │  ┌─────────────────────┐                    │
   │  │ Ollama (native)     │                    │
   │  │ 127.0.0.1:11434     │                    │
   │  │ - gemma2:2b         │                    │
   │  └─────────────────────┘                    │
   └─────────────────────────────────────────────┘
```

If you don't have a platform yet, the original is at [github.com/nikvb/vercel-clone](https://github.com/nikvb/vercel-clone) (or wherever the source lives — open-sourced separately).

## Why this is a skill, not a template

A template gives you starter code; a skill teaches an AI assistant the **pattern** — design tokens, parallel fanout, 9 platform pitfalls and their fixes, mail integration, RAG chatbot wiring, the whole verification checklist — so that when a kid (or any developer) says *"build me a directory of local skate parks"*, the assistant can produce a production site without hand-holding.

The skill encodes about 40 hours of working through bugs and tradeoffs. Whoever uses it gets the lessons for free.

## License

MIT — do anything you want, including remix and republish under another name. Pull requests welcome if you fix something.
