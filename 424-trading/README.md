# 424 TRADING — E-commerce Website

**QUALITY PRODUCTS. CONVENIENTLY SOURCED**

A professional B2B e-commerce website for 424 TRADING (Harare, Zimbabwe),
built with **React + Vite + Tailwind CSS** and powered by **Supabase**
(PostgreSQL database + Storage for product images).

## Features

- **Storefront** — Home, Shop (search / category / product-line filters),
  Categories, Product Details, Cart, Checkout, Request a Quote, About Us,
  How to Order, Contact.
- Products with a `NULL` price automatically display **“Request a Quote”**.
- Cart with quantity controls, order submission, quote requests, and a
  floating **WhatsApp** button (`+263 774 606 387`).
- **Admin dashboard** (`/admin`) — add / edit / delete products, upload images
  to Supabase Storage, manage categories, view orders, update order status,
  and review quote requests. Signed in with a simple password
  (`VITE_ADMIN_PASSWORD` in `.env`; until you set one, the default password in
  demo mode is `424admin`).

## Quick start

```bash
npm install
npm run dev        # http://localhost:5173
```

Without any configuration the site runs in **demo mode** with a bundled
sample catalogue (changes from the admin are kept in your browser).

## Connect Supabase (go live)

1. Create a free project at [supabase.com](https://supabase.com).
2. Open **SQL Editor** and run the file `supabase/schema.sql` — it creates
   the tables (`categories`, `products`, `customers`, `orders`,
   `order_items`, `quote_requests`), the secure `submit_order` function,
   access policies and the public `product-images` storage bucket.
3. Copy `.env.example` → `.env` and fill in:

   ```
   VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
   VITE_SUPABASE_ANON_KEY=YOUR-ANON-KEY
   VITE_ADMIN_PASSWORD=change-me
   ```

4. Restart `npm run dev`. The demo banner disappears and everything reads and
   writes to Supabase. Optional: **Admin → Setup & Supabase → Seed database**
   loads the sample catalogue into your new database.

## Admin Dashboard — how to open it from the live site

1. Open the live website in your browser.
2. Either of these gets you in:
   - **Footer link** — scroll to the very bottom of any page; in the dark
     footer bar, just after the copyright line (left side, kept clear of the
     floating WhatsApp button), click **Admin**.
   - **Direct URL** — add `/admin` to your site address, e.g.
     `http://localhost:5173/admin` (or `https://your-domain.com/admin` when
     deployed).
3. On the sign-in screen, enter the admin password — the value of
   `VITE_ADMIN_PASSWORD` from your `.env` file (in this project that is
   `424Admin`) — and press **Sign In**.
4. You now have the dashboard sidebar: **Overview**, **Products**,
   **Categories**, **Orders**, **Quote Requests** and **Setup & Supabase**.
   You stay signed in until you press **Sign out**.

Notes:

- Without `.env` configured (demo mode) the fallback password is `424admin`.
- The Admin link sits quietly in the footer, so customers browse the shop
  while you manage it from the same site.

## Notes

- `products.subcategory` holds the product line inside a category
  (e.g. *Floodlights*, *VSD Drives*) and powers the filter chips in the shop.
- `orders.notes` stores checkout notes; both are included in `schema.sql`.
- All prices are USD. Orders are confirmed by the business via phone /
  WhatsApp / email — no online payment is taken.

## Troubleshooting

- **Blank page / no images when running locally** — always run the dev server
  (`npm install`, then `npm run dev`, open `http://localhost:5173`). Do not open
  `index.html` directly from the folder; the app must be served.
- **Catalogue empty after connecting Supabase** — run `supabase/schema.sql` in
  the SQL Editor, then open **Admin → Setup & Supabase → Seed database** (or add
  your own products in Admin → Products). The site shows a banner at the top
  while the connected catalogue is empty.
- **Images missing on a host** — make sure the whole project was uploaded,
  including the `public/media/` folder, and that the site is served from the
  root of its domain.

## Structure

```
supabase/schema.sql      Database + storage setup (run once)
src/lib/db.ts            Data layer (Supabase or demo fallback)
src/lib/seed.ts          Sample catalogue
src/pages/...            Storefront pages
src/pages/admin/...      Admin dashboard
```
