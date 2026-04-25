# kilocode-skills

Agent skills for AI coding assistants — works with **kilocode**, **Claude Code**, **Cursor**, and any tool that understands skill files with YAML frontmatter.

## What's here

### [`build-vercel-clone-site`](./build-vercel-clone-site/SKILL.md)

**Build a real website with one prompt.** Tell your AI assistant the kind of site you want — *"I want a directory of basketball camps for kids"* or *"a one-page restaurant site for my mom's bakery"* — and it'll build the whole thing and put it live on the internet at `your-name.21mv.com`.

You don't need to set up a server, install anything, or learn DevOps. The skill calls a hosted platform that does all of that for you.

**What you get when you use this skill:**

- A real, live website on the open web at `<your-pick>.21mv.com`
- SvelteKit 2 + Svelte 4 + Tailwind v4 — modern, fast, mobile-friendly
- Built-in pages: home, search, listings, detail pages, FAQ, custom 404, sitemap
- A working contact / lead form that actually emails you (transactional email is wired automatically)
- A chatbot widget (powered by a local Gemma model) that can answer questions about your content
- SEO done right: per-page Open Graph, JSON-LD schema for Google rich results, dynamic sitemap
- Database (Postgres) provisioned and connected — every site gets its own
- The whole thing built and deployed in about 15 minutes by 9 sub-agents working in parallel

**Live demonstrations** (built with this exact skill):

| URL | What it is |
|---|---|
| <https://areghotel.21mv.com> | A historical Yerevan hotel revived from archive.org snapshots — oxblood + sun-gold palette |
| <https://campscout.21mv.com> | Worldwide kids' summer-camp directory with lead-gen CRM and chatbot — pine + sun palette |

## Install

### kilocode

```bash
git clone https://github.com/nikvb/kilocode-skills ~/.kilocode/skills/kilocode-skills
```

Or grab just the one skill (no git needed):

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

## All you need: a platform API key

The skill calls a hosted platform at `https://deploy.21mv.com`. The platform handles servers, databases, mail, DNS — none of that is your problem.

**To deploy you need ONE thing:** an API key from `deploy.21mv.com`.

1. Go to <https://deploy.21mv.com/auth/signup> and create a free account
2. After login, visit `/dashboard/keys` and click **"Generate API key"**
3. Copy the `dp_…` key. **Save it somewhere safe — the platform shows it once.**
4. When your AI assistant asks for `PLATFORM_API_KEY`, paste it.

That's it. Your assistant takes it from there: builds the site, packages it, POSTs to the platform, the platform builds a Docker image and runs it, you get a `https://{your-subdomain}.21mv.com` URL.

### What the platform gives every deployed site (you don't configure these)

| Service | How your code uses it |
|---|---|
| Postgres database (per app) | `process.env.DATABASE_URL` |
| Transactional email via [3ava.com](https://mail.3ava.com) | `process.env.MAIL_API_KEY`, `process.env.MAIL_API_BASE`, `process.env.MAIL_FROM` |
| Local Gemma 2B chatbot | `http://127.0.0.1:11434` (Ollama API) |
| Public HTTPS via Cloudflare | `process.env.ORIGIN` (your site's full URL) |
| Server port | `process.env.PORT` |

## Example prompts your kid (or anyone) can give the AI assistant

Once the skill is installed and you have a key:

> *"Build me a directory of skate parks in California with a contact form. Use the build-vercel-clone-site skill. Here's my deploy key: `dp_…`"*

> *"I want a one-page site for my soccer team — schedule, roster, contact form for new player tryouts. Use the build skill, name it `<teamname>.21mv.com`."*

> *"Revive cstandt.com from archive.org as a Colorado-Springs gymnastics directory. Use the skill."*

The assistant reads the skill, asks a few clarifying questions (sport scope, color palette, catalog size), then fans out 9 sub-agents that build the whole site in parallel and deploy it. You watch live URLs appear.

## What if I want to run my OWN platform?

The hosted platform at `deploy.21mv.com` is one specific deployment. The platform source itself is a SvelteKit app — you can run your own copy and point the skill at your URL by editing the `deploy.21mv.com` reference in `SKILL.md` to your own host.

## License

MIT. Remix freely.

## Contributing

Pull requests welcome. New skills (e.g. `revive-expired-domain`, `niche-research`, `seo-audit`) are a great fit for this repo as separate top-level directories alongside `build-vercel-clone-site/`.
