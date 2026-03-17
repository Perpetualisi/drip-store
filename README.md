# Drip Store 👕

A premium 3D clothing store built with React. Every product has a animated 3D garment you can view before buying.

**Live site:** [https://drip-store-sooty.vercel.app/] 
**Demo video:** [https://www.youtube.com/watch?v=4g8Y3Zj8zqg]

## Tech stack

- React
- vite
- Three.js
- Tailwind CSS
- Vercel
- Framer Motion
- React Three Fiber
- Vercel

---

## What it does

- Browse 40 clothing items across 8 styles (hoodies, jackets, dresses, coats, tees, pants, shorts, skirts)
- Every product has a live animated 3D garment — not a photo
- Change colors on any product and watch it update in real time
- Add to cart, save to wishlist, checkout
- Dark mode and light mode
- Works on mobile and desktop

---

## Pages

| Page | What it does |
|------|-------------|
| `/` | Home — hero, bestsellers, new arrivals, sale timer |
| `/shop` | Browse all 40 products with filters and sorting |
| `/product/:id` | Product detail with 3D viewer, color picker, reviews |
| `/cart` | Shopping cart |
| `/checkout` | 2-step checkout form |
| `/wishlist` | Saved items |
| `/collections` | Men and women collections |
| `/new-arrivals` | Latest drops |
| `/sale` | Sale items |
| `/contact` | Contact form |
| `/shipping` | Shipping info |
| `/returns` | Returns policy |

---

## Features

**Shopping**
- 40 products — 20 male, 20 female
- Filter by category, gender, price
- Sort by featured, price, new arrivals, top rated
- Quick add to cart from shop page
- Sticky add to cart bar on product pages
- Color variants — 6 colors per product, changes the 3D model live
- Size selector
- Stock counter — shows how many are left
- Sold out state with waitlist form

**3D Models**
- 8 hand-crafted SVG garment types
- Fabric texture, shimmer and shadow effects
- Mouse parallax tilt on hover
- Floating animation
- Micro-animations — sleeves wave, collar lifts, hem flutters

**Social proof**
- Star ratings on every product
- Full review section with rating breakdown, fit feedback, verified badges
- "X people viewing this right now" on product pages
- Flash sale countdown timer

**UI**
- Dark mode — remembers your choice
- Smooth page transitions with progress bar
- Mobile responsive with hamburger menu
- Live search with product previews
- Animated page transitions

---

## Tech stack

| Tool | What it does |
|------|-------------|
| React 18 | UI framework |
| Vite | Build tool |
| TypeScript | Type safety |
| Tailwind CSS (CDN) | Styling |
| React Router v6 | Page routing |
| Zustand | Cart, wishlist and theme state |
| SVG | 3D garment models |

---

## Run it locally
```bash
# Clone the repo
git clone https://github.com/Perpetualisi/drip-store.git

# Go into the folder
cd drip-store

# Install packages
npm install

# Start the dev server
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## Build for production
```bash
npm run build
```

---

## Project structure
```
src/
├── components/
│   ├── 3d/           # SVG garment models
│   ├── cart/         # Cart drawer
│   ├── layout/       # Navbar, footer, page transitions
│   └── reviews/      # Star ratings, review cards
├── data/
│   ├── products.ts   # All 40 products
│   ├── reviews.ts    # Auto-generated reviews
│   └── stock.ts      # Stock levels
├── pages/            # All page components
└── store/            # Zustand stores (cart, wishlist, theme)
```

---

## Deployment

Deployed on Vercel. Every push to `main` auto-deploys.

The `vercel.json` file handles page refresh 404s:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

---

Built with React + Vite + TypeScript + Zustand + TailwindCSS + Three.js