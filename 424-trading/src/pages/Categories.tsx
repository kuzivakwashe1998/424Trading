import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageBand from "../components/PageBand";
import Reveal from "../components/Reveal";
import { ArrowRightIcon } from "../components/Icons";
import {
  listCategories,
  listProducts,
  type Category,
  type Product,
} from "../lib/db";

export default function Categories() {
  const [cats, setCats] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([listCategories(), listProducts()])
      .then(([c, p]) => {
        setCats(c);
        setProducts(p);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <PageBand
        crumb="CATEGORIES"
        title="Product Categories"
        intro="Five focused ranges, one reliable supplier. Every category is stocked with quality products sourced for Zimbabwean businesses and projects."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-8">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-64 rounded-2xl bg-ink-100 animate-pulse" />
            ))
          : cats.map((c, i) => {
              const inCat = products.filter((p) => p.category_id === c.id);
              const subs = Array.from(new Set(inCat.map((p) => p.subcategory)))
                .filter(Boolean)
                .sort();
              return (
                <Reveal key={c.id} delay={i * 40}>
                  <div className="group grid md:grid-cols-[380px_1fr] bg-white border border-ink-100 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-ink-950/8 transition-shadow">
                    <Link
                      to={`/shop?category=${c.id}`}
                      className="relative block aspect-[16/9] md:aspect-auto md:min-h-[260px] overflow-hidden bg-ink-50"
                    >
                      <img
                        src={c.image_url}
                        alt={c.name}
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute bottom-4 left-4 px-3 py-1.5 rounded-md bg-ink-950/85 text-white text-xs font-bold">
                        {inCat.length} product{inCat.length === 1 ? "" : "s"}
                      </span>
                    </Link>
                    <div className="p-6 sm:p-8 flex flex-col">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h2 className="text-2xl font-extrabold tracking-tight text-ink-950">
                            {c.name}
                          </h2>
                          <p className="mt-2 text-sm text-ink-600 leading-relaxed max-w-2xl">
                            {c.description}
                          </p>
                        </div>
                        <Link
                          to={`/shop?category=${c.id}`}
                          className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 border-ink-950 text-ink-950 text-xs font-bold hover:bg-ink-950 hover:text-white transition-colors"
                        >
                          Browse <ArrowRightIcon className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                      {subs.length > 0 && (
                        <div className="mt-5 flex flex-wrap gap-2">
                          {subs.map((s) => (
                            <Link
                              key={s}
                              to={`/shop?category=${c.id}&sub=${encodeURIComponent(s)}`}
                              className="px-3.5 py-2 rounded-full bg-ink-50 border border-ink-200 text-xs font-bold text-ink-700 hover:border-accent-500 hover:text-accent-700 transition-colors"
                            >
                              {s}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Reveal>
              );
            })}
      </div>
    </>
  );
}
