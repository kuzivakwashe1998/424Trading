// Runtime smoke test: renders every route via ReactDOMServer and exercises the
// demo-mode data layer (catalogue, order flow, quotes). Run with:
//   node scripts/ssr-smoke.mjs
import { JSDOM } from "jsdom";

const dom = new JSDOM(
  '<!doctype html><html><body><div id="root"></div></body></html>',
  { url: "http://localhost/", pretendToBeVisual: true }
);

globalThis.window = dom.window;
globalThis.document = dom.window.document;
globalThis.localStorage = dom.window.localStorage;
globalThis.sessionStorage = dom.window.sessionStorage;
if (!globalThis.navigator) globalThis.navigator = dom.window.navigator;
globalThis.IntersectionObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};
globalThis.matchMedia =
  globalThis.matchMedia ||
  (() => ({
    matches: false,
    addListener() {},
    removeListener() {},
    addEventListener() {},
    removeEventListener() {},
  }));

const React = (await import("react")).default;
const { renderToString } = await import("react-dom/server");
const { MemoryRouter } = await import("react-router-dom");
const { createServer } = await import("vite");

const server = await createServer({
  server: { middlewareMode: true },
  appType: "custom",
  logLevel: "error",
});

const { default: App } = await server.ssrLoadModule("/src/App.tsx");
const { CartProvider } = await server.ssrLoadModule(
  "/src/context/CartContext.tsx"
);
const db = await server.ssrLoadModule("/src/lib/db.ts");

let failures = 0;
const check = (label, cond, extra = "") => {
  if (cond) console.log(`PASS ${label} ${extra}`);
  else {
    failures++;
    console.log(`FAIL ${label} ${extra}`);
  }
};

// ---- Render every route ----
const routes = [
  "/",
  "/shop",
  "/shop?category=cat-lighting",
  "/categories",
  "/product/p-vsd-22",
  "/product/p-granite-blk",
  "/cart",
  "/checkout",
  "/request-quote",
  "/about",
  "/how-to-order",
  "/contact",
  "/this-page-does-not-exist",
  "/admin",
  "/admin/products",
  "/admin/categories",
  "/admin/orders",
  "/admin/quotes",
  "/admin/setup",
];
for (const r of routes) {
  try {
    const html = renderToString(
      React.createElement(
        MemoryRouter,
        { initialEntries: [r] },
        React.createElement(CartProvider, null, React.createElement(App))
      )
    );
    check(`render ${r}`, html.length > 500, `(${html.length} bytes)`);
  } catch (e) {
    check(`render ${r}`, false, String(e?.message ?? e));
  }
}

// ---- Data layer: catalogue ----
const cats = await db.listCategories();
check("categories seeded", cats.length === 5, `(${cats.length})`);
const prods = await db.listProducts();
check("all products quote-only", prods.every((p) => p.price === null));
check("products listed", prods.length === 44, `(${prods.length})`);
const lighting = await db.listProducts({ categoryId: "cat-lighting" });
check("category filter", lighting.length === 10, `(${lighting.length})`);
const search = await db.listProducts({ search: "floodlight" });
check("search works", search.length === 4, `(${search.length})`);
const feat = await db.getFeaturedProducts();
check("featured products", feat.length >= 6, `(${feat.length})`);
const one = await db.getProduct("p-vsd-22");
check("getProduct + join", one?.category_name === "Electrical Products");
const quoteOnly = await db.getProduct("p-granite-blk");
check("null price = quote", quoteOnly?.price === null);
const midea = await db.getProduct("p-midea-solar-200");
check("new product quote-only", midea?.price === null && (midea?.image_url ?? "").includes("/media/products/"));

// ---- Data layer: order flow ----
const orderId = await db.submitOrder({
  customer: {
    name: "Smoke Test",
    email: "smoke@test.co.zw",
    phone: "+263 77 000 0000",
    company: "Smoke (Pvt) Ltd",
    address: "1 Test St, Harare",
  },
  deliveryMethod: "delivery",
  notes: "smoke test",
  items: [
    { productId: "p-led-panel", quantity: 2 },
    { productId: "p-granite-blk", quantity: 1 }, // quote item, no price
  ],
});
check("order created", Boolean(orderId));
const orders = await db.adminListOrders();
const order = orders.find((o) => o.id === orderId);
check("order total 0 (quote-only)", Number(order?.total) === 0, `(total=${order?.total})`);
check("order items joined", order?.items?.length === 2);
check("order customer joined", order?.customer?.name === "Smoke Test");
await db.updateOrderStatus(orderId, "confirmed");
const after = (await db.adminListOrders()).find((o) => o.id === orderId);
check("order status updated", after?.status === "confirmed");

// ---- Data layer: quotes ----
await db.submitQuote({
  customer_name: "Smoke Test",
  company: "",
  email: "smoke@test.co.zw",
  phone: "",
  product: "Black Granite",
  quantity: "10 m2",
  requirements: "polished",
  delivery_location: "Harare",
});
const quotes = await db.adminListQuotes();
check("quote stored", quotes.length === 1, `(${quotes.length})`);
await db.updateQuoteStatus(quotes[0].id, "quoted");
check(
  "quote status updated",
  (await db.adminListQuotes())[0].status === "quoted"
);

// ---- Data layer: admin product CRUD ----
await db.saveProduct({
  id: "",
  category_id: "cat-automotive",
  name: "Smoke Tyre",
  description: "t",
  price: 10,
  image_url: "/media/cat-automotive.jpg",
  stock: 1,
  available: true,
  featured: false,
  subcategory: "Tyres",
  created_at: "",
});
const withNew = await db.adminListProducts();
check("product added", withNew.length === 45, `(${withNew.length})`);
const newId = withNew.find((p) => p.name === "Smoke Tyre")?.id;
await db.deleteProduct(newId);
check(
  "product deleted",
  (await db.adminListProducts()).length === 44
);

await server.close();
console.log(failures === 0 ? "\nALL CHECKS PASSED" : `\n${failures} FAILURES`);
process.exit(failures === 0 ? 0 : 1);
