# Deploying to 21mv.com — API reference

> **For the kid using kilocode**: most of this happens automatically when the AI runs the deploy step. Bookmark this page only if a deploy fails and the AI doesn't know why. The error → cause table near the bottom is the part you'll actually use.

This is the verified, end-to-end reference for the 21mv.com deploy platform's HTTP API. Every error message and behavior listed here was reproduced live against `https://deploy.21mv.com` during an audit, so the table reflects what the server actually returns — not docstrings.

## TL;DR

```bash
curl -X POST https://deploy.21mv.com/api/v1/deploy \
  -H "Authorization: Bearer dp_..." \
  -H "Origin: https://deploy.21mv.com" \
  -F "name=my-site" \
  -F "file=@my-site.tgz"
```

If you get **`Cross-site POST form submissions are forbidden`**, you are missing the `Origin` header. That is by far the most common failure mode. Add it.

## Endpoints

### `POST /api/v1/deploy` — create a new deployment

| Header | Value | Required? |
|---|---|---|
| `Authorization` | `Bearer dp_…` | yes — get a key from `/dashboard/keys` on https://21mv.com |
| `Origin` | `https://deploy.21mv.com` | **yes for multipart POSTs** — SvelteKit's CSRF check rejects them otherwise |

| Form field | Type | Required | Notes |
|---|---|---|---|
| `name` | string | yes | Subdomain. Lowercase letters, digits, dashes only. Length 3–63. Anything outside `[a-z0-9-]` is silently stripped (e.g. `Foo_Bar!` becomes `foobar`). |
| `file` | file | yes | Gzipped tarball (`.tar.gz`). **Field name MUST be `file`** — `tarball`, `archive`, `upload` are rejected with `"No file uploaded"`. |

**Success response** (HTTP 201):
```json
{ "id": "uuid…", "subdomain": "my-site", "url": "https://my-site.21mv.com" }
```

The container takes 40–60 seconds to build and start. Cloudflare may return 524 if the platform exceeds 100s — the deploy still completes; verify with `GET /api/v1/deployments`.

### `GET /api/v1/deployments` — list your deployments

```bash
curl https://deploy.21mv.com/api/v1/deployments \
  -H "Authorization: Bearer dp_..."
```

Returns `{ "deployments": [ { id, subdomain, port, status, created_at, updated_at, url }, … ] }`.

### `GET /api/v1/deployments/{id}` — get one

Same auth, returns the same shape as one element of the list.

### `POST /api/v1/deployments/{id}` — restart

```bash
curl -X POST https://deploy.21mv.com/api/v1/deployments/{id} \
  -H "Authorization: Bearer dp_..." \
  -H "Origin: https://deploy.21mv.com" \
  -H "Content-Type: application/json" \
  -d '{"action":"restart"}'
```

### `DELETE /api/v1/deployments/{id}` — tear down

Removes the container, the per-app database, the DNS record, and the deployment row. **Heads-up:** there's a known platform bug — DELETE leaves the Docker container as an orphan. If you re-deploy with the same subdomain right after, you'll get `Container name "/deploy-<sub>" already in use`. Workaround: SSH to the host and `docker stop deploy-<sub> && docker rm deploy-<sub>` before the new POST, or pick a different subdomain.

### `POST /api/v1/mail/send` — send an email through the platform

```bash
curl -X POST https://deploy.21mv.com/api/v1/mail/send \
  -H "Authorization: Bearer dp_..." \
  -H "Content-Type: application/json" \
  -d '{
    "to": "someone@example.com",
    "subject": "Hello from my-site",
    "html": "<p>Hi from my app</p>"
  }'
```

Uses the same `dp_…` key. Sends through verified domains the platform owns (`21mv.com`, `3ava.com`, etc.) — no DNS / SPF / DKIM work for you. Returns `{ "ok": true, "provider_id": "...", "status": "queued" }`.

## Constraints

| | |
|---|---|
| Body size limit | **100 MB** (`PLATFORM_BODY_SIZE_LIMIT`). Strip `node_modules`, `.svelte-kit`, `build`, `.git`, `static/videos`, large `.mp4`/`.mov` files before tar. A real SvelteKit project's source is usually under 5 MB. If you're at 25 MB+, something shouldn't be in the tarball. |
| Reserved subdomains | `www`, `mail`, `admin`, `api`, `app`, `platform`, `ns1`, `ns2`, `ftp`, `smtp`, `pop`, `imap`. Pick anything else. |
| Uniqueness | A subdomain can only be live once. To redeploy with the same name: DELETE first (and kill the orphan container as noted above). |
| Stack | The build container generates `Dockerfile` for **SvelteKit 2 + adapter-node + npm + Node 20**. Next.js, Astro, Nuxt, pnpm, bun won't build cleanly. See [SKILL.md "LOCKED stack"](./SKILL.md#technology-stack--locked-the-deployer-requires-exactly-this) for why. |

## Error → cause map

Every row below was reproduced live against the production endpoint. If you hit one, it'll be one of these.

| HTTP | Body | Cause | Fix |
|---|---|---|---|
| `403` | `Cross-site POST form submissions are forbidden` *(plain text, not JSON)* | Missing or wrong `Origin` header. SvelteKit's built-in CSRF blocks multipart POSTs unless Origin matches. | Add `-H "Origin: https://deploy.21mv.com"` to your curl. |
| `403` | *(empty body)* | Missing `Authorization` header | Include `-H "Authorization: Bearer dp_..."`. |
| `400` | `{"error":"No file uploaded. Send a .tar.gz of your project."}` | Wrong field name — must be `file`, not `tarball`/`archive`/`upload`. Or no file attached. | Use `-F "file=@my-site.tgz"`. |
| `500` | `{"error":"Subdomain must be 3-63 characters"}` | After lowercasing + stripping non `[a-z0-9-]`, the name is too short or too long. Common cause: only special chars in the name. | Use 3–63 lowercase alnum/dash characters. |
| `500` | `{"error":"Subdomain \"X\" is reserved"}` | Hit a reserved name (www, mail, admin, api, app, platform, ns1/2, ftp, smtp, pop, imap). | Pick another. `home`, `web`, `site`, `landing` are not reserved. |
| `500` | `{"error":"Subdomain \"X\" is already taken"}` | Subdomain in use. Need to redeploy? DELETE old + clean orphan container first. | See "Re-deploying same subdomain" below. |
| `500` | `{"error":"Content-Length of N exceeds limit of M bytes."}` | Tarball larger than the platform body-size limit (currently 100 MB). | Slim the tarball — exclude `node_modules`, `.svelte-kit`, `build`, large media. See "Tarball checklist" below. |
| `500` | `{"error":"Container failed: …"}` (any image-build / docker error) | The Dockerfile generated by the platform couldn't build your project. Usually missing dependency, wrong stack, or `npm install` failure. | Check container logs via the dashboard. The platform requires the locked stack — see `SKILL.md`. |

## Tarball checklist

Always exclude these. A 25 MB tarball almost always means one of these slipped through:

```bash
tar --exclude='./node_modules' \
    --exclude='./.svelte-kit' \
    --exclude='./build' \
    --exclude='./.git' \
    --exclude='./.env' \
    --exclude='./.env.*' \
    --exclude='./*.log' \
    -czf my-site.tgz .
```

For projects with a lot of static media, also exclude:

- `static/videos/` and any `.mp4` / `.mov` / `.webm` files
- Original (uncompressed) image sources — keep only the optimized versions you actually serve
- `.cache/`, `.next/`, `dist/`, `coverage/`, `.nyc_output/`, `.turbo/`

Sanity-check the tarball before uploading:

```bash
du -sh my-site.tgz                # should be under ~10 MB for typical sites
tar -tzf my-site.tgz | wc -l       # number of files — sanity check
tar -tzf my-site.tgz | head -50    # what's actually in it
```

## Re-deploying the same subdomain

The platform doesn't currently have an in-place update endpoint. To deploy a new version:

```bash
DP_KEY="dp_..."
SUB="my-site"

# 1. Find the deployment id
ID=$(curl -s https://deploy.21mv.com/api/v1/deployments \
  -H "Authorization: Bearer $DP_KEY" \
  | jq -r ".deployments[] | select(.subdomain==\"$SUB\") | .id")

# 2. Delete the old deployment
curl -X DELETE "https://deploy.21mv.com/api/v1/deployments/$ID" \
  -H "Authorization: Bearer $DP_KEY" \
  -H "Origin: https://deploy.21mv.com"

# 3. Clean the orphan Docker container (platform bug — see "Constraints")
#    You need shell access to the platform host for this. If you don't,
#    just pick a new subdomain like "$SUB-v2".

# 4. Re-deploy with the same name
curl -X POST https://deploy.21mv.com/api/v1/deploy \
  -H "Authorization: Bearer $DP_KEY" \
  -H "Origin: https://deploy.21mv.com" \
  -F "name=$SUB" \
  -F "file=@$SUB.tgz"
```

## Reusable deploy script

```bash
#!/usr/bin/env bash
set -euo pipefail

DP_KEY="${DP_KEY:?Set DP_KEY env var to your dp_… key}"
SUB="${1:?Pass subdomain as first arg}"
SRC="${2:-.}"
TGZ="/tmp/deploy-${SUB}.tgz"

cd "$SRC"

tar --exclude='./node_modules' \
    --exclude='./.svelte-kit' \
    --exclude='./build' \
    --exclude='./.git' \
    --exclude='./.env' \
    --exclude='./.env.*' \
    -czf "$TGZ" .

SIZE=$(du -h "$TGZ" | cut -f1)
echo "Tarball: $TGZ ($SIZE)"

RESULT=$(curl -fsS -X POST https://deploy.21mv.com/api/v1/deploy \
  -H "Authorization: Bearer $DP_KEY" \
  -H "Origin: https://deploy.21mv.com" \
  -F "name=$SUB" \
  -F "file=@$TGZ" \
  --max-time 300)

URL=$(echo "$RESULT" | jq -r .url)
echo "Deploying to: $URL"
echo "Allow 30–60 seconds for the container to build and start, then load $URL in your browser."
```

Usage:
```bash
chmod +x deploy.sh
DP_KEY="dp_..." ./deploy.sh my-site /path/to/my-site
```

## Custom domains (aliases)

Once a site is deployed, you can point a customer's own domain at it:

1. Customer adds an A record at their DNS provider:
   ```
   Type:  A
   Name:  @  (and another for "www")
   Value: 152.53.194.247
   TTL:   Auto / 300
   ```
   Or proxies the domain through their own Cloudflare zone — both work.

2. You add the hostname at https://21mv.com/dashboard/sites/<subdomain> → **Custom domains** → enter `customerdomain.com`.

3. Click **verify**. The platform's DNS check resolves the A record. If it points to `152.53.194.247` or to a Cloudflare proxy, status flips to `pending_ssl`.

4. A background watcher writes the nginx vhost and runs `certbot` for a Let's Encrypt cert. Status flips to `active` within ~30 seconds.

5. `https://customerdomain.com` now serves the site.

You only need to give the customer the IP and the instructions in step 1. Everything else is automatic.

## Things that aren't documented anywhere else

- **`csrf: { checkOrigin: false }` per-route option is a no-op in SvelteKit.** That's why the Origin header matters everywhere on this API. The platform code has the option set, but the framework doesn't honor it for `+server.ts` files. Don't trust the source comments.
- **The platform's `BASE_DOMAIN` defaults differ across files** — the canonical truth is `BASE_DOMAIN=21mv.com` in `/opt/deploy-platform/.env` on the production host. Code defaults to `amdy.io` which is **production for AMD servers and must not be used as a deploy target**. The skill's stack lock and the deploy URL above assume 21mv.com.
- **The mail proxy uses verified sending domains** the platform owns. You don't need to verify your own domain to send mail from your app.

## Reporting bugs

The platform is open-source and self-hosted. If you hit an error not in the table above, ping the maintainer with the exact `curl -v` output (redact your `dp_…` key) — error messages here are kept honest by re-running them when bugs are reported.
