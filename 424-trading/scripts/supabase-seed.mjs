// Seeds the connected Supabase project with the 424 TRADING catalogue.
// If the `product-images` bucket exists, all images are uploaded to
// Supabase Storage first and database rows point at the storage URLs;
// otherwise rows point at the site's own /media/ assets.
//
//   node scripts/supabase-seed.mjs
import { readFileSync, readdirSync } from "node:fs";
import { createServer } from "vite";

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_ANON_KEY;
if (!url || !key) {
  console.error("Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY in .env");
  process.exit(1);
}
const H = {
  apikey: key,
  Authorization: `Bearer ${key}`,
  "Content-Type": "application/json",
};

const server = await createServer({
  server: { middlewareMode: true },
  appType: "custom",
  logLevel: "error",
});
const { seedForSupabase } = await server.ssrLoadModule("/src/lib/seed.ts");
await server.close();
const { categories: seedCategories, products: seedProducts } =
  seedForSupabase();

// ---- storage probe: can we upload to product-images? ----
let storageOk = false;
const probePath = `media/_probe-${Date.now()}.txt`;
try {
  const r = await fetch(`${url}/storage/v1/object/product-images/${probePath}`, {
    method: "POST",
    headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "text/plain" },
    body: "probe",
  });
  storageOk = r.ok;
  if (storageOk) {
    // remove probe
    await fetch(`${url}/storage/v1/object/product-images/${probePath}`, {
      method: "DELETE",
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    });
  }
} catch {
  storageOk = false;
}
console.log(storageOk ? "Storage bucket available — uploading images…" : "Storage bucket NOT available — using /media URLs served by the website.");

const mime = (f) => (f.endsWith(".png") ? "image/png" : "image/jpeg");

async function upload(local, remote) {
  const body = readFileSync(local);
  const r = await fetch(`${url}/storage/v1/object/product-images/${remote}`, {
    method: "POST",
    headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": mime(remote) },
    body,
  });
  const publicUrl = `${url}/storage/v1/object/public/product-images/${remote}`;
  if (!r.ok && r.status !== 409) {
    const t = await r.text();
    if (r.status === 400 && /duplicate|already exists/i.test(t)) return publicUrl;
    throw new Error(`upload ${remote} failed: ${r.status} ${t}`);
  }
  return publicUrl;
}

async function mapUrl(path) {
  if (!path.startsWith("/media/")) return path;
  if (!storageOk) return path;
  const remote = path.replace(/^\//, ""); // media/...
  return await upload(`public/${path}`, remote);
}

// ---- upload + remap categories ----
const cats = [];
for (const c of seedCategories) {
  cats.push({ ...c, image_url: await mapUrl(c.image_url) });
}
let r = await fetch(`${url}/rest/v1/categories`, {
  method: "POST",
  headers: { ...H, Prefer: "resolution=merge-duplicates" },
  body: JSON.stringify(cats),
});
if (!r.ok) throw new Error(`categories upsert failed: ${r.status} ${await r.text()}`);
console.log(`categories upserted: ${cats.length}`);

// ---- upload + remap products ----
const prods = [];
for (const p of seedProducts) {
  prods.push({ ...p, image_url: await mapUrl(p.image_url) });
}
r = await fetch(`${url}/rest/v1/products`, {
  method: "POST",
  headers: { ...H, Prefer: "resolution=merge-duplicates" },
  body: JSON.stringify(prods),
});
if (!r.ok) throw new Error(`products upsert failed: ${r.status} ${await r.text()}`);
console.log(`products upserted: ${prods.length}`);

// ---- verify ----
r = await fetch(`${url}/rest/v1/products?select=id&category_id=not.is.null`, { headers: H });
const rows = await r.json();
console.log(`verified products in Supabase: ${Array.isArray(rows) ? rows.length : rows?.message}`);
console.log("DONE");
