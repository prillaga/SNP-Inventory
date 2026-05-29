# How to see your latest changes

The app loads **pre-built JavaScript** from `dist/bundle.js`, not the `src/` folder directly.

## Every time code changes in `src/`:

```bash
cd /Users/Pril/Documents/santillan-pos
bash build.sh
```

Then refresh the browser with **hard reload**:
- Mac: `Cmd + Shift + R`
- Windows: `Ctrl + Shift + R`

## Start the app

```bash
cd /Users/Pril/Documents/santillan-pos
bash serve.sh
```

Open: http://localhost:8080/index.html

## Confirm you have the new build

1. Sidebar footer shows **Build 2026.05.29**
2. **Suppliers** is gone; **Add Product** is in the menu
3. Home inventory has **no** "+ Add Product" button
4. Click **Add Product** → full page with form + inventory table

## Cloud version (Next.js)

```bash
cd /Users/Pril/Documents/santillan-pos-cloud
npm install
npm run dev
```

Open: http://localhost:3000/dashboard
