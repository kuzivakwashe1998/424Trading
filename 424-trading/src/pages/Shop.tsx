import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import PageBand from "../components/PageBand";
import { SearchIcon } from "../components/Icons";
import {
  listCategories,
  listProducts,
  type Category,
  type Product,
} from "../lib/db";

type SortKey = "newest" | "name" | "price-asc" | "price-desc";

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const categoryId = params.get("category") ?? "";
  const q = params.get("q") ?? "";
  const sub = params.get("sub") ?? "";

  const [cats, setCats] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<SortKey>("newest");

  useEffect(() => {
    listCategories().then(setCats).catch(() => {});
  }, []);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    listProducts({ categoryId: categoryId || undefined, search: q || undefined })
      .then((rows) => alive && setProducts(rows))
      .catch(() => alive && setProducts([]))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [categoryId, q]);

  const subcategories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => p.subcategory && set.add(p.subcategory));
    return Array.from(set).sort();
  }, [products]);

  const visible = useMemo(() => {
    let rows = sub ? products.filter((p) => p.subcategory === sub) : products;
    rows = [...rows];
    switch (sort) {
      case "name":
        rows.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "price-asc":
        rows.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
        break;
      case "price-desc":
        rows.sort((a, b) => (b.price ?? -1) - (a.price ?? -1));
        break;
      default:
        rows.sort((a, b) => b.created_at.localeCompare(a.created_at));
    }
    return rows;
  }, [products, sub, sort]);

  const activeCat = cats.find((c) => c.id === categoryId);

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  };

  return (
    <>
      <PageBand
        crumb="SHOP"
        title={activeCat ? activeCat.name : "Shop All Products"}
        intro={
          activeCat
            ? activeCat.description
            : "Browse our full catalogue of electrical, lighting, automotive, stone and lubricant products."
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14 grid lg:grid-cols-[260px_1fr] gap-8">
        {/* Sidebar */}
        <aside className="space-y-6">
          <div className="bg-white border border-ink-100 rounded-xl p-5">
            <p className="text-xs font-bold tracking-[0.18em] text-ink-400 mb-3">
              CATEGORIES
            </p>
            <button
              onClick={() => {
                setParam("category", "");
                setParam("sub", "");
              }}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                !categoryId
                  ? "bg-ink-950 text-white"
                  : "text-ink-700 hover:bg-ink-50"
              }`}
            >
              All Products
            </button>
            {cats.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  setParam("category", c.id);
                  setParam("sub", "");
                }}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                  categoryId === c.id
                    ? "bg-ink-950 text-white"
                    : "text-ink-700 hover:bg-ink-50"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          {subcategories.length > 0 && (
            <div className="bg-white border border-ink-100 rounded-xl p-5">
              <p className="text-xs font-bold tracking-[0.18em] text-ink-400 mb-3">
                PRODUCT LINES
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setParam("sub", "")}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${
                    !sub
                      ? "bg-accent-600 border-accent-600 text-white"
                      : "border-ink-200 text-ink-600 hover:border-accent-500"
                  }`}
                >
                  All
                </button>
                {subcategories.map((s) => (
                  <button
                    key={s}
                    onClick={() => setParam("sub", sub === s ? "" : s)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${
                      sub === s
                        ? "bg-accent-600 border-accent-600 text-white"
                        : "border-ink-200 text-ink-600 hover:border-accent-500"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* Results */}
        <div>
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <input
                defaultValue={q}
                key={q}
                placeholder="Search within results…"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setParam("q", (e.target as HTMLInputElement).value.trim());
                  }
                }}
                className="w-full h-11 rounded-lg border border-ink-200 bg-white pl-10 pr-4 text-sm outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20"
              />
              <SearchIcon className="w-4 h-4 absolute left-3.5 top-3.5 text-ink-400" />
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="h-11 rounded-lg border border-ink-200 bg-white px-3 text-sm font-semibold text-ink-700 outline-none focus:border-accent-500"
              aria-label="Sort products"
            >
              <option value="newest">Newest first</option>
              <option value="name">Name A–Z</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
            </select>
            <p className="text-sm text-ink-500 font-medium">
              {loading ? "Loading…" : `${visible.length} product${visible.length === 1 ? "" : "s"}`}
            </p>
          </div>

          {loading ? (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-80 rounded-xl bg-ink-100 animate-pulse" />
              ))}
            </div>
          ) : visible.length === 0 ? (
            <div className="bg-ink-50 border border-ink-100 rounded-xl py-20 text-center">
              <p className="font-extrabold text-ink-900 text-lg">
                No products found
              </p>
              <p className="mt-2 text-sm text-ink-500">
                Try a different search term or category — or request a quote and
                we&apos;ll source it for you.
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {visible.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
