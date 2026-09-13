// Read-only verification that the app's data layer talks to the real
// Supabase project (run with the project .env loaded).
import { createServer } from "vite";

// Node 20 has no native WebSocket; supabase-js realtime needs one.
if (!globalThis.WebSocket) {
  const { default: WS } = await import("ws");
  globalThis.WebSocket = WS;
}

const server = await createServer({
  server: { middlewareMode: true },
  appType: "custom",
  logLevel: "error",
});

const { isSupabaseConfigured } = await server.ssrLoadModule(
  "/src/lib/supabaseClient.ts"
);
const db = await server.ssrLoadModule("/src/lib/db.ts");

let fails = 0;
const check = (label, cond, extra = "") => {
  console.log(`${cond ? "PASS" : "FAIL"} ${label} ${extra}`);
  if (!cond) fails++;
};

check("supabase configured", isSupabaseConfigured === true);

const cats = await db.listCategories();
check("categories from Supabase", cats.length === 5, `(${cats.length})`);

const prods = await db.listProducts();
check("products from Supabase", prods.length === 44, `(${prods.length})`);

const lighting = await db.listProducts({
  categoryId: "42400000-0000-4000-8000-000000000002",
});
check("lighting filter", lighting.length === 10, `(${lighting.length})`);

const feat = await db.getFeaturedProducts();
check("featured", feat.length >= 6, `(${feat.length})`);

const sample = prods[0];
check(
  "image url is Supabase storage",
  (sample?.image_url ?? "").startsWith("https://") &&
    sample.image_url.includes("/storage/v1/object/public/product-images/"),
  sample?.image_url
);

const res = await fetch(sample.image_url);
check("storage image reachable", res.status === 200, `(HTTP ${res.status})`);

const search = await db.listProducts({ search: "castrol" });
check("search castrol", search.length >= 6, `(${search.length})`);

await server.close();
console.log(fails === 0 ? "LIVE VERIFICATION PASSED" : `${fails} FAILURES`);
process.exit(fails === 0 ? 0 : 1);
