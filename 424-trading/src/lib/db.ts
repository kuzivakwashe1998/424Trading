// ---------------------------------------------------------------------------
// Data layer for 424 TRADING.
// Every page talks to this module only. It uses Supabase when configured and
// falls back to a bundled sample database (persisted in localStorage) when it
// is not, so the site is fully browsable in "demo mode".
// ---------------------------------------------------------------------------

import { supabase } from "./supabaseClient";
import { seedCategories, seedProducts, seedForSupabase } from "./seed";

export interface Category {
  id: string;
  name: string;
  description: string;
  image_url: string;
  created_at: string;
}

export interface Product {
  id: string;
  category_id: string;
  name: string;
  description: string;
  price: number | null;
  image_url: string;
  stock: number;
  available: boolean;
  featured: boolean;
  subcategory: string;
  created_at: string;
  category_name?: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number | null;
  product_name?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  created_at: string;
}

export interface Order {
  id: string;
  customer_id: string;
  total: number;
  status: string;
  delivery_method: string;
  notes?: string;
  created_at: string;
  customer?: Customer;
  items?: OrderItem[];
}

export interface QuoteRequest {
  id: string;
  customer_name: string;
  company: string;
  email: string;
  phone: string;
  product: string;
  quantity: string;
  requirements: string;
  delivery_location: string;
  status: string;
  created_at: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export function uid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const delay = (ms = 120) => new Promise((r) => setTimeout(r, ms));

// ---------------------------------------------------------------------------
// Demo-mode store (localStorage-backed)
// ---------------------------------------------------------------------------

interface DemoDB {
  categories: Category[];
  products: Product[];
  orders: Order[];
  order_items: OrderItem[];
  quotes: QuoteRequest[];
}

const DEMO_KEY = "424_demo_db_v2";

function demoLoad(): DemoDB {
  try {
    const raw = localStorage.getItem(DEMO_KEY);
    if (raw) return JSON.parse(raw) as DemoDB;
  } catch {
    /* ignore */
  }
  const db: DemoDB = {
    categories: seedCategories.map((c) => ({ ...c })),
    products: seedProducts.map((p) => ({ ...p })),
    orders: [],
    order_items: [],
    quotes: [],
  };
  return db;
}

function demoSave(db: DemoDB) {
  try {
    localStorage.setItem(DEMO_KEY, JSON.stringify(db));
  } catch {
    /* storage full / unavailable — demo only */
  }
}

function decorate(p: Product, cats: Category[]): Product {
  const c = cats.find((x) => x.id === p.category_id);
  return { ...p, category_name: c?.name ?? "" };
}

// ---------------------------------------------------------------------------
// Public catalogue API
// ---------------------------------------------------------------------------

export async function listCategories(): Promise<Category[]> {
  if (supabase) {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name");
    if (error) throw new Error(error.message);
    return (data ?? []) as Category[];
  }
  await delay();
  return demoLoad().categories.sort((a, b) => a.name.localeCompare(b.name));
}

export interface ProductFilters {
  categoryId?: string;
  subcategory?: string;
  search?: string;
}

export async function listProducts(f: ProductFilters = {}): Promise<Product[]> {
  if (supabase) {
    let q = supabase
      .from("products")
      .select("*, categories(name)")
      .eq("available", true)
      .order("created_at", { ascending: false });
    if (f.categoryId) q = q.eq("category_id", f.categoryId);
    if (f.search) q = q.ilike("name", `%${f.search}%`);
    const { data, error } = await q;
    if (error) throw new Error(error.message);
    let rows = (data ?? []) as any[];
    if (f.subcategory) {
      rows = rows.filter((r) => (r.subcategory ?? "") === f.subcategory);
    }
    return rows.map((r) => ({
      ...r,
      category_name: r.categories?.name ?? "",
    })) as Product[];
  }
  await delay();
  const db = demoLoad();
  let rows = db.products.filter((p) => p.available);
  if (f.categoryId) rows = rows.filter((p) => p.category_id === f.categoryId);
  if (f.subcategory) rows = rows.filter((p) => p.subcategory === f.subcategory);
  if (f.search) {
    const s = f.search.toLowerCase();
    rows = rows.filter(
      (p) =>
        p.name.toLowerCase().includes(s) ||
        p.description.toLowerCase().includes(s) ||
        p.subcategory.toLowerCase().includes(s)
    );
  }
  return rows
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .map((p) => decorate(p, db.categories));
}

export async function getFeaturedProducts(): Promise<Product[]> {
  if (supabase) {
    const { data, error } = await supabase
      .from("products")
      .select("*, categories(name)")
      .eq("available", true)
      .eq("featured", true)
      .order("created_at", { ascending: false })
      .limit(8);
    if (error) throw new Error(error.message);
    return ((data ?? []) as any[]).map((r) => ({
      ...r,
      category_name: r.categories?.name ?? "",
    })) as Product[];
  }
  await delay();
  const db = demoLoad();
  return db.products
    .filter((p) => p.available && p.featured)
    .slice(0, 8)
    .map((p) => decorate(p, db.categories));
}

export async function getProduct(id: string): Promise<Product | null> {
  if (supabase) {
    const { data, error } = await supabase
      .from("products")
      .select("*, categories(name)")
      .eq("id", id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) return null;
    const r = data as any;
    return { ...r, category_name: r.categories?.name ?? "" } as Product;
  }
  await delay();
  const db = demoLoad();
  const p = db.products.find((x) => x.id === id);
  return p ? decorate(p, db.categories) : null;
}

export async function listSubcategories(categoryId: string): Promise<string[]> {
  const rows = await listProducts({ categoryId });
  const set = new Set<string>();
  rows.forEach((r) => r.subcategory && set.add(r.subcategory));
  return Array.from(set).sort();
}

// ---------------------------------------------------------------------------
// Orders & quotes
// ---------------------------------------------------------------------------

export interface SubmitOrderInput {
  customer: {
    name: string;
    email: string;
    phone: string;
    company: string;
    address: string;
  };
  deliveryMethod: string;
  notes: string;
  items: CartItem[];
}

export async function submitOrder(input: SubmitOrderInput): Promise<string> {
  if (supabase) {
    const payload = {
      customer: input.customer,
      delivery_method: input.deliveryMethod,
      notes: input.notes,
      items: input.items.map((i) => ({
        product_id: i.productId,
        quantity: i.quantity,
      })),
    };
    // Preferred path: atomic SQL function.
    const rpc = await supabase.rpc("submit_order", { p: payload as any });
    if (!rpc.error && rpc.data) return rpc.data as string;

    // Fallback path (in case the SQL function was not run): manual inserts.
    let customerId: string;
    const existing = await supabase
      .from("customers")
      .select("id")
      .eq("email", input.customer.email)
      .maybeSingle();
    if (existing.data) {
      customerId = existing.data.id;
      await supabase
        .from("customers")
        .update({
          name: input.customer.name,
          phone: input.customer.phone,
          company: input.customer.company,
          address: input.customer.address,
        })
        .eq("id", customerId);
    } else {
      customerId = uid();
      const ins = await supabase.from("customers").insert({
        id: customerId,
        ...input.customer,
      });
      if (ins.error) throw new Error(ins.error.message);
    }

    const { data: prods, error: perr } = await supabase
      .from("products")
      .select("id, price")
      .in(
        "id",
        input.items.map((i) => i.productId)
      );
    if (perr) throw new Error(perr.message);
    const priceOf = new Map(
      ((prods ?? []) as any[]).map((p) => [p.id, p.price as number | null])
    );
    const total = input.items.reduce((sum, i) => {
      const price = priceOf.get(i.productId) ?? null;
      return sum + (price ? price * i.quantity : 0);
    }, 0);

    const orderId = uid();
    const { error: oerr } = await supabase.from("orders").insert({
      id: orderId,
      customer_id: customerId,
      total,
      status: "pending",
      delivery_method: input.deliveryMethod,
      notes: input.notes,
    });
    if (oerr) throw new Error(oerr.message);

    const { error: ierr } = await supabase.from("order_items").insert(
      input.items.map((i) => ({
        id: uid(),
        order_id: orderId,
        product_id: i.productId,
        quantity: i.quantity,
        price: priceOf.get(i.productId) ?? null,
      }))
    );
    if (ierr) throw new Error(ierr.message);
    return orderId;
  }

  // Demo mode
  await delay(300);
  const db = demoLoad();
  const orderId = uid();
  let total = 0;
  const items: OrderItem[] = input.items.map((i) => {
    const p = db.products.find((x) => x.id === i.productId);
    const price = p?.price ?? null;
    if (price) total += price * i.quantity;
    if (p) p.stock = Math.max(0, p.stock - i.quantity);
    return {
      id: uid(),
      order_id: orderId,
      product_id: i.productId,
      quantity: i.quantity,
      price,
      product_name: p?.name ?? "",
    };
  });
  const customer: Customer = {
    id: uid(),
    ...input.customer,
    created_at: new Date().toISOString(),
  };
  db.orders.unshift({
    id: orderId,
    customer_id: customer.id,
    total,
    status: "pending",
    delivery_method: input.deliveryMethod,
    notes: input.notes,
    created_at: new Date().toISOString(),
    customer,
    items,
  });
  db.order_items.push(...items);
  demoSave(db);
  return orderId;
}

export interface QuoteInput {
  customer_name: string;
  company: string;
  email: string;
  phone: string;
  product: string;
  quantity: string;
  requirements: string;
  delivery_location: string;
}

export async function submitQuote(input: QuoteInput): Promise<void> {
  if (supabase) {
    const { error } = await supabase
      .from("quote_requests")
      .insert({ ...input, status: "new" });
    if (error) throw new Error(error.message);
    return;
  }
  await delay(250);
  const db = demoLoad();
  db.quotes.unshift({
    id: uid(),
    ...input,
    status: "new",
    created_at: new Date().toISOString(),
  });
  demoSave(db);
}

// ---------------------------------------------------------------------------
// Admin API
// ---------------------------------------------------------------------------

export async function adminListProducts(): Promise<Product[]> {
  if (supabase) {
    const { data, error } = await supabase
      .from("products")
      .select("*, categories(name)")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return ((data ?? []) as any[]).map((r) => ({
      ...r,
      category_name: r.categories?.name ?? "",
    })) as Product[];
  }
  await delay();
  const db = demoLoad();
  return db.products
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .map((p) => decorate(p, db.categories));
}

export async function saveProduct(p: Product): Promise<void> {
  if (supabase) {
    const row = { ...p };
    delete (row as any).category_name;
    const { error } = await supabase.from("products").upsert(row);
    if (error) throw new Error(error.message);
    return;
  }
  await delay(150);
  const db = demoLoad();
  const idx = db.products.findIndex((x) => x.id === p.id);
  const row = { ...p };
  delete (row as any).category_name;
  if (idx >= 0) db.products[idx] = row;
  else db.products.unshift({ ...row, created_at: new Date().toISOString() });
  demoSave(db);
}

export async function deleteProduct(id: string): Promise<void> {
  if (supabase) {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) throw new Error(error.message);
    return;
  }
  await delay(150);
  const db = demoLoad();
  db.products = db.products.filter((p) => p.id !== id);
  demoSave(db);
}

export async function saveCategory(c: Category): Promise<void> {
  if (supabase) {
    const { error } = await supabase.from("categories").upsert({ ...c });
    if (error) throw new Error(error.message);
    return;
  }
  await delay(150);
  const db = demoLoad();
  const idx = db.categories.findIndex((x) => x.id === c.id);
  if (idx >= 0) db.categories[idx] = c;
  else db.categories.push({ ...c, created_at: new Date().toISOString() });
  demoSave(db);
}

export async function deleteCategory(id: string): Promise<void> {
  if (supabase) {
    const { count } = await supabase
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("category_id", id);
    if (count && count > 0) {
      throw new Error(
        "This category still has products. Move or delete them first."
      );
    }
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) throw new Error(error.message);
    return;
  }
  await delay(150);
  const db = demoLoad();
  if (db.products.some((p) => p.category_id === id)) {
    throw new Error(
      "This category still has products. Move or delete them first."
    );
  }
  db.categories = db.categories.filter((c) => c.id !== id);
  demoSave(db);
}

export async function adminListOrders(): Promise<Order[]> {
  if (supabase) {
    const { data: orders, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    const list = (orders ?? []) as Order[];
    if (!list.length) return [];
    const custIds = Array.from(new Set(list.map((o) => o.customer_id)));
    const orderIds = list.map((o) => o.id);
    const [{ data: custs }, { data: items }] = await Promise.all([
      supabase.from("customers").select("*").in("id", custIds),
      supabase.from("order_items").select("*").in("order_id", orderIds),
    ]);
    const custMap = new Map(((custs ?? []) as Customer[]).map((c) => [c.id, c]));
    const itemMap = new Map<string, OrderItem[]>();
    ((items ?? []) as OrderItem[]).forEach((i) => {
      const arr = itemMap.get(i.order_id) ?? [];
      arr.push(i);
      itemMap.set(i.order_id, arr);
    });
    return list.map((o) => ({
      ...o,
      customer: custMap.get(o.customer_id),
      items: itemMap.get(o.id) ?? [],
    }));
  }
  await delay();
  return demoLoad().orders;
}

export async function updateOrderStatus(id: string, status: string) {
  if (supabase) {
    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", id);
    if (error) throw new Error(error.message);
    return;
  }
  await delay(120);
  const db = demoLoad();
  const o = db.orders.find((x) => x.id === id);
  if (o) o.status = status;
  demoSave(db);
}

export async function adminListQuotes(): Promise<QuoteRequest[]> {
  if (supabase) {
    const { data, error } = await supabase
      .from("quote_requests")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []) as QuoteRequest[];
  }
  await delay();
  return demoLoad().quotes;
}

export async function updateQuoteStatus(id: string, status: string) {
  if (supabase) {
    const { error } = await supabase
      .from("quote_requests")
      .update({ status })
      .eq("id", id);
    if (error) throw new Error(error.message);
    return;
  }
  await delay(120);
  const db = demoLoad();
  const q = db.quotes.find((x) => x.id === id);
  if (q) q.status = status;
  demoSave(db);
}

/** Seeds the Supabase database with the sample catalogue (idempotent). */
export async function seedSupabase(): Promise<string> {
  if (!supabase) throw new Error("Supabase is not configured.");
  const { categories, products } = seedForSupabase();
  let inserted = 0;
  for (const c of categories) {
    const { data } = await supabase
      .from("categories")
      .select("id")
      .eq("id", c.id)
      .maybeSingle();
    if (!data) {
      const { error } = await supabase.from("categories").upsert(c);
      if (error) throw new Error(error.message);
      inserted++;
    }
  }
  for (const p of products) {
    const { data } = await supabase
      .from("products")
      .select("id")
      .eq("id", p.id)
      .maybeSingle();
    if (!data) {
      const { error } = await supabase.from("products").upsert(p);
      if (error) throw new Error(error.message);
      inserted++;
    }
  }
  return inserted
    ? `Seeded ${inserted} records.`
    : "Database already contains the sample catalogue.";
}
