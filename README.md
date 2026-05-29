# Santillan Native Products — POS Inventory (GitHub Pages)

Static, **offline-first** point-of-sale and inventory dashboard. No login, no backend, no database setup.

- All data stored in **browser localStorage** (auto-saves on every change)
- Works completely **offline** after first load
- **Export / Import JSON** to move data between devices manually
- Deploy to **GitHub Pages** with included workflow

## Features

- **Dashboard** — Total products, daily revenue, products sold, orders today, daily profit
- **Products** — Browse inventory with search and categories
- **Add Sale** — Cart and checkout (stock updates on checkout only)
- **Sales History** — Transaction log with profit
- **Add Product** — Full inventory management (add, edit, delete, stock +/-, images)
- **Customers & Expenses** — Local CRUD
- **Reports** — Sales summary and stock alerts
- **Settings** — Store name, export JSON, export CSV, import backup

## Run locally

```bash
cd santillan-pos
bash build.sh
bash serve.sh
```

Open http://localhost:8080/index.html

Or with Vite dev server:

```bash
npm install
npm run dev
```

## Deploy to GitHub Pages

1. Push this folder to a GitHub repository
2. Go to **Settings → Pages → Build and deployment**
3. Source: **GitHub Actions** (not “Deploy from a branch”)
4. Push to `main` or `master` — workflow `.github/workflows/deploy.yml` builds and publishes the site

Your site URL: `https://<username>.github.io/<repo-name>/`

If deploy fails in Actions, open the failed run log. Common fixes:

- **Build job**: needs Linux-compatible `build.sh` (included) — do not commit `.tools/` (macOS binaries)
- **Deploy job**: Pages source must be **GitHub Actions**; first deploy creates the `github-pages` environment
- **Blank site**: hard-refresh; confirm `dist/bundle.js` exists in the workflow artifact (`_site` folder)

## Data & sync

| Action | How |
|--------|-----|
| Auto-save | Every change writes to `localStorage` key `santillan-pos-data-v1` |
| Backup | Settings → **Export Data (JSON)** |
| Restore | Settings → **Import Data** |
| Inventory CSV | Settings → **Export Inventory (CSV)** |
| Other device | Export on device A → transfer file → Import on device B |

GitHub Pages cannot sync live data between devices without a backend. For real-time multi-device sync, add Supabase or Firebase later.

## Project structure

```
index.html          # Entry (loads dist/bundle.js)
dist/bundle.js      # Built app (run build.sh after src changes)
assets/             # Product images & logo
src/                # React source
legacy/             # Old vanilla HTML app
```

## Rebuild after editing source

```bash
bash build.sh
```

Then hard-refresh the browser (Cmd+Shift+R).
