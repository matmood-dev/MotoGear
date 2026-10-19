# MotoGear — Motorbike Gear Shop

A frontend-only e-commerce demo for a motorbike gear store, built with React and Vite. Everything is mocked: the product catalog, authentication, and checkout all run in the browser with no backend. State persists to `localStorage`, so the cart, wishlist, and login survive a page reload.

> **Demo only.** There is no server, no real payments, and no real accounts.

## Table of contents

- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
- [Available scripts](#available-scripts)
- [Project structure](#project-structure)
- [Routes](#routes)
- [Features](#features)
- [State & persistence](#state--persistence)
- [Design system](#design-system)
- [Mock data](#mock-data)
- [Notes & limitations](#notes--limitations)

## Tech stack

| Concern        | Choice                                             |
| -------------- | -------------------------------------------------- |
| Framework      | React 19                                           |
| Build tool     | Vite 8                                             |
| Routing        | React Router 7 (`react-router-dom`)                |
| Styling        | Tailwind CSS v4 via `@tailwindcss/vite`            |
| State          | React Context API (`StoreContext`) + `localStorage` |
| Linting        | oxlint                                             |

## Getting started

Requires **Node.js 20.19+** (or 22.12+) and npm.

```bash
# install dependencies
npm install

# start the dev server → http://localhost:5173
npm run dev
```

Then open <http://localhost:5173> in your browser.

### Production build

```bash
npm run build     # outputs to dist/
npm run preview   # serve the built app locally
```

## Available scripts

| Script            | Description                                  |
| ----------------- | -------------------------------------------- |
| `npm run dev`     | Start the Vite dev server with HMR           |
| `npm run build`   | Create an optimized production build in `dist/` |
| `npm run preview` | Locally preview the production build         |
| `npm run lint`    | Run oxlint over the source                   |

## Project structure

```
motogear-shop/
├── index.html              # HTML entry point
├── vite.config.js          # Vite + React + Tailwind config
├── public/                 # Static assets (favicon, icon sprite)
└── src/
    ├── main.jsx            # React root
    ├── App.jsx             # Router, layout, toast, 404
    ├── index.css           # Tailwind import + theme tokens + animations
    ├── data/
    │   └── products.js     # 20 mock products, categories, brands, orders
    ├── context/
    │   └── StoreContext.jsx# cart, wishlist, user, toast + localStorage
    ├── components/
    │   ├── Navbar.jsx      # promo bar, search, cart badge, mobile menu
    │   ├── Footer.jsx      # links, socials, newsletter signup
    │   ├── ProductCard.jsx # grid + list layouts, wishlist heart, sale badge
    │   ├── FilterSidebar.jsx# category, price, brand, size, stock filters
    │   ├── CartDrawer.jsx  # slide-in mini cart
    │   └── ui.jsx          # Stars, Breadcrumbs, StockBadge, Price, SectionTitle
    └── pages/
        ├── Home.jsx        # hero, categories, featured / new / top-rated
        ├── Shop.jsx        # filters + sort + search + grid/list toggle
        ├── ProductDetails.jsx # zoom gallery, variants, tabs, reviews, related
        ├── Cart.jsx        # quantities, subtotal / tax / shipping
        ├── Checkout.jsx    # 3-step form with validation + mock confirmation
        ├── Auth.jsx        # Login + Signup (mock)
        ├── Account.jsx     # Profile + Orders (mock data)
        └── Wishlist.jsx
```

## Routes

| Path            | Page           | Purpose                                        |
| --------------- | -------------- | ---------------------------------------------- |
| `/`             | Home           | Hero, category tiles, featured/new/top-rated   |
| `/shop`         | Shop           | Full catalog with filters, sort, and search    |
| `/product/:id`  | ProductDetails | Gallery, variants, specs/reviews, related items|
| `/cart`         | Cart           | Full cart with totals                          |
| `/checkout`     | Checkout       | 3-step checkout with validation                |
| `/wishlist`     | Wishlist       | Saved products                                 |
| `/login`        | Login          | Mock sign-in                                   |
| `/signup`       | Signup         | Mock registration                              |
| `/profile`      | Profile        | Account details                                |
| `/orders`       | Orders         | Dummy order history                            |
| `*`             | NotFound       | 404 page                                       |

## Features

- **Catalog** — search plus category, brand, size, price, and stock filters; 5 sort orders; grid and list views.
- **Product page** — image zoom with thumbnails, size/color selectors, stock indicator, specs/reviews tabs, related products.
- **Cart** — slide-in drawer and full page, quantity controls, free-shipping threshold ($150), 8% tax placeholder, persistence across reloads.
- **Checkout** — shipping → payment → review with per-step validation, then a mock confirmation with a generated order ID.
- **Accounts** — mock login/signup, profile page, dummy order history, and a wishlist.
- **UX** — toast notifications, responsive layout, animated drawer and page transitions.

## State & persistence

All application state lives in `StoreContext` (`src/context/StoreContext.jsx`) and is consumed through the `useStore()` hook.

| `localStorage` key | Contents                                            |
| ------------------ | --------------------------------------------------- |
| `mg_cart`          | Cart line items (product, size, color, quantity)    |
| `mg_wishlist`      | Saved product IDs                                   |
| `mg_user`          | Signed-in user object (name, email, join date)      |

Derived values such as `subtotal`, `tax`, `shipping`, `total`, and `count` are computed from the cart and exposed alongside the mutating actions (`addToCart`, `updateQty`, `removeItem`, `clearCart`, `toggleWishlist`, `login`, `signup`, `logout`).

## Design system

A dark "carbon" theme is defined with Tailwind v4 `@theme` tokens in `src/index.css`:

- **Colors** — `carbon` (near-black backgrounds) and `blaze` (orange accent).
- **Font** — a condensed display face for headings.
- **Utilities** — `texture-carbon` background detail, `animate-slide-in-right` and `animate-fade-up` keyframes, and a `no-scrollbar` helper.

## Mock data

`src/data/products.js` is the single source of truth for the demo:

- **20 products** across **6 categories**: helmets, gloves, riding boots, vests & jackets, protective gear, and accessories.
- **6 fictional brands**: Torque, Ironhide, Velocity, Asphalt Kings, Redline, Nomad.
- Each product includes pricing, `compareAt` (for sale badges), rating, review count, popularity, colors, sizes, stock, specs, and sample reviews.
- Product images hotlink from Unsplash with an automatic `placehold.co` fallback if a request fails.

## Notes & limitations

- Frontend-only: no API, database, or real authentication. Any credentials are accepted.
- Checkout is a simulation — no payment is processed and no order is actually placed.
- Product imagery is loaded from a third-party CDN; the placeholder fallback keeps the UI intact offline.
- Built as a portfolio/demo project, not for production use.
