# Utopia Sum

Mobile-first landing page built from the Figma file **Utopia x Embacy — IN Pages**.

## Run locally

```bash
cd "/Users/arkhipovau/Utopia Sum"
python3 -m http.server 5500
```

Open [http://127.0.0.1:5500](http://127.0.0.1:5500) in Safari or Chrome (best). ES modules require a local server (not `file://`). If port 5500 is busy, try `5501`.

### v3 — client mobile (reference copy)

The folder [`v3/`](v3/) is the client-facing mobile build ([nikostor2.github.io/utopia-site](https://nikostor2.github.io/utopia-site/#top)): copy *It’s all yours*, no Beyond/CTA screens, v2 carousel for Days/Ecosystem. Shared `css/`, `assets/`, and most `js/` are symlinked from the repo root.

```bash
python3 -m http.server 5500
# → http://127.0.0.1:5500/v3/
```

## Screens

1. **Hero** — crossfading location backgrounds + horizontal destination cards; fixed dock menu.
2. **Ecosystem** — Tropical / Urban / Alpine tabs with location carousel.
3. **Opening** — scroll-pinned Revolut-style section; 3 atmospheric slides with progress.
4. **Beyond villas** — Private Jet & Superyacht cards.
5. **Days designed** — horizontal experience carousel with progress bar.
6. **CTA + footer** — personalization CTA and site map.

## Stack

Vanilla HTML, CSS, and ES modules — no build step.

Image and brand assets live in `assets/`.

### Git (no Cursor co-author)

Cursor may append `Co-authored-by: Cursor <cursoragent@cursor.com>` to commits from the agent. To block it in this repo, run once:

```bash
./scripts/install-git-hooks.sh
```

In **Cursor → Settings → Agents → Git**, turn off **Add co-author to commits** (wording may vary).

## Fonts

Brand fonts from Font Book (also in `fonts/` for deployment):

| Role | Font | File |
|------|------|------|
| Headlines | GT Ultra Median Trial Regular | `fonts/gt-ultra-median-regular.otf` |
| UI & body | NB International Regular | `fonts/nb-international-regular.otf` |

Declared in `css/fonts.css` with `local()` + file fallback. Google Fonts removed.

## Deploy to a server

Upload the **contents** of this folder (or the whole folder) so `index.html` sits in the site root (`public_html`, `www`, `htdocs`, etc.).

Required on the server:

```
index.html
css/
js/
assets/    (all .jpg and .svg — ~70 MB)
fonts/     (both .otf files)
.htaccess  (Apache — fixes JS module MIME type)
```

### Site does not load / blank page

1. Open the browser **Developer tools → Console** and **Network**.
2. Typical errors:
   - **404** on `js/main.js` or `css/...` — wrong folder (e.g. files are in `public_html/Utopia Sum/` but you open the domain root). Open the URL that contains `index.html`, or move files up one level.
   - **MIME type** `text/plain` for `.js` — Apache without correct types; keep `.htaccess` in the same folder as `index.html`.
   - **403 Forbidden** — missing `index.html` in that directory or permissions; folders `755`, files `644`.
3. Do **not** open the site as `file://` — use `https://your-domain/`.
4. Avoid spaces in the server path if possible; rename to `utopia-sum` on upload.
5. If you deploy via Git, ensure `assets/` and `fonts/` are committed — they are not optional.

### Nginx

```nginx
root /var/www/utopia;
index index.html;
location / {
  try_files $uri $uri/ =404;
}
types {
  application/javascript js;
}
```

## Cloudflare Pages

Dashboard: [Workers & Pages](https://dash.cloudflare.com/) → **Create** → **Pages** → **Upload assets** (or connect Git).

| Setting | Value |
|--------|--------|
| Framework preset | **None** |
| Build command | *(leave empty)* |
| Build output directory | `.` |

The repo root must contain `index.html` (not only a parent folder). If the Git root is above this project, set **Root directory** to the folder that contains `index.html`.

Upload **the whole project** including `assets/` (~70 MB) and `fonts/`. Files `_headers` and `wrangler.toml` are included for MIME types and CLI deploy.

### Deploy from terminal (optional)

```bash
cd "/Users/arkhipovau/Utopia Sum"
npx wrangler pages deploy . --project-name=utopia-sum
```

After deploy, open the `*.pages.dev` URL Cloudflare shows — not the dashboard link.

### If the build fails on Cloudflare

- Do not pick React/Vite/etc. — there is no build step.
- Empty build command, output directory `.`
- Error “Output directory not found” → output path is wrong; use `.` not `dist` or `public`.
