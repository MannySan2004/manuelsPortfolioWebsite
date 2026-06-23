# Setup & Deployment Guide

This is a **Vite + React** site with a **Cloudflare** backend (Pages + R2 + D1 +
Functions) and an **admin-only photo uploader** gated by **Cloudflare Access**.

---

## 0. Prerequisite: install Node.js

You need Node.js (which includes `npm`) to build/run the site locally.

- Easiest on Windows: `winget install OpenJS.NodeJS.LTS`
  (or download the **LTS** installer from https://nodejs.org)
- Close & reopen your terminal afterward, then verify: `node -v` and `npm -v`

---

## 1. Run it locally

```bash
npm install      # one time — installs dependencies
npm run dev      # start the dev server (prints a http://localhost:5173 URL)
```

The gallery shows **sample images** until the Cloudflare backend (steps 3–5) is
wired up. Everything else — timeline, projects, theme toggle, animations — works
immediately.

```bash
npm run build    # production build into /dist
npm run preview  # preview the production build locally
```

### Personalize the content
- `src/data/site.js` — your name, role, email, **LinkedIn URL**, résumé path.
- `src/data/timeline.js` — your real college experience milestones.
- `src/data/projects.js` — your projects (GitHub + demo links, tech tags).
- `src/data/skills.js` — your skills.
- Drop these files into **`public/`**: `headshot.jpg`, your résumé as
  `Manuel_Rosales_Resume.pdf`, and (optional) `og-image.jpg` for link previews.

---

## 2. Deploy the site (frontend only — free, no backend yet)

1. Push to GitHub (already configured: `MannySan2004/manuelsPortfolioWebsite`).
2. Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git**.
3. Pick the repo. Build settings:
   - **Build command:** `npm run build`
   - **Output directory:** `dist`
4. Deploy. You get a free `*.pages.dev` URL. Add your custom domain under the
   Pages project → **Custom domains** (point your domain's nameservers to
   Cloudflare first).
5. Optional: enable **Web Analytics** (free) under the Pages project → Analytics.

---

## 3. Create the storage (one time)

Install the CLI helper and log in:
```bash
npx wrangler login
```

Create the bucket + database, then apply the schema:
```bash
npx wrangler r2 bucket create portfolio-photos
npx wrangler d1 create portfolio-photos      # copy the printed database_id
# paste that id into wrangler.toml -> [[d1_databases]].database_id
npx wrangler d1 execute portfolio-photos --remote --file=./schema.sql
```

In the Pages project → **Settings → Functions → Bindings**, add:
- **R2 bucket** binding named `PHOTOS_BUCKET` → `portfolio-photos`
- **D1 database** binding named `DB` → `portfolio-photos`

Redeploy (push a commit, or "Retry deployment"). The gallery is now live and the
sample-images banner disappears once you upload real photos.

---

## 4. Lock the admin page to just you (Cloudflare Access)

1. Cloudflare dashboard → **Zero Trust → Access → Applications → Add an
   application → Self-hosted**.
2. Application domain: your site, path `/admin`. Add a second app (or path) for
   `/api/upload` and `/api/delete`.
3. Add a **policy**: Action *Allow*, rule *Emails* = **your Google email**.
4. Copy the application **AUD tag**, and note your team domain
   (`<team>.cloudflareaccess.com`).
5. In `wrangler.toml` (or Pages → Settings → Variables) set:
   - `ACCESS_TEAM_DOMAIN` = `<team>` (just the subdomain part)
   - `ACCESS_AUD` = the AUD tag
6. Redeploy.

Now visiting `/admin` prompts a Google login and only **your** email gets in —
and the upload/delete APIs independently verify that login. Anyone else is
rejected at Cloudflare's edge.

> **Quick alternative for testing:** skip Access and set a secret instead —
> `npx wrangler pages secret put ADMIN_TOKEN` — then send it as the
> `x-admin-token` header. Cloudflare Access is the recommended production setup.

---

## 5. Use it

Go to `https://yourdomain.com/admin`, log in, drag photos in, add captions, and
hit **Upload all**. They're resized in your browser, stored in R2, indexed in D1,
and appear in everyone's gallery instantly.
