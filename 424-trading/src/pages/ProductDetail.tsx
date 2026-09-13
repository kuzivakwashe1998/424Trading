import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import {
  getProduct,
  listProducts,
  type Product,
} from "../lib/db";
import { COMPANY, waLink } from "../lib/config";
import { useCart } from "../context/CartContext";
import {
  CartIcon,
  CheckIcon,
  MinusIcon,
  PlusIcon,
  TagIcon,
  TruckIcon,
  WhatsAppIcon,
} from "../components/Icons";

export default function ProductDetail() {
  const { id } = useParams();
  const { add } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!id) return;
    let alive = true;
    setLoading(true);
    setQty(1);
    setAdded(false);
    getProduct(id)
      .then(async (p) => {
        if (!alive) return;
        setProduct(p);
        if (p) {
          const rows = await listProducts({ categoryId: p.category_id });
          if (alive)
            setRelated(rows.filter((r) => r.id !== p.id).slice(0, 4));
        }
      })
      .catch(() => alive && setProduct(null))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 grid lg:grid-cols-2 gap-10">
        <div className="aspect-square rounded-2xl bg-ink-100 animate-pulse" />
        <div className="space-y-4">
          <div className="h-6 w-40 rounded bg-ink-100 animate-pulse" />
          <div className="h-10 w-3/4 rounded bg-ink-100 animate-pulse" />
          <div className="h-24 rounded bg-ink-100 animate-pulse" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <h1 className="text-3xl font-extrabold text-ink-950">
          Product not found
        </h1>
        <p className="mt-3 text-ink-600">
          The product you are looking for may have been removed.
        </p>
        <Link
          to="/shop"
          className="inline-block mt-6 px-6 py-3 rounded-lg bg-ink-950 text-white font-bold hover:bg-ink-900"
        >
          Back to Shop
        </Link>
      </div>
    );
  }

  const handleAdd = () => {
    add(product.id, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Breadcrumb */}
        <nav className="text-xs font-semibold text-ink-500 flex flex-wrap items-center gap-1.5">
          <Link to="/" className="hover:text-accent-700">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-accent-700">Shop</Link>
          <span>/</span>
          <Link
            to={`/shop?category=${product.category_id}`}
            className="hover:text-accent-700"
          >
            {product.category_name}
          </Link>
          <span>/</span>
          <span className="text-ink-900">{product.name}</span>
        </nav>

        <div className="mt-8 grid lg:grid-cols-2 gap-10 lg:gap-14">
          {/* Image */}
          <div className="relative rounded-2xl overflow-hidden border border-ink-100 bg-ink-50 aspect-square">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.featured && (
              <span className="absolute top-4 left-4 px-3 py-1.5 rounded-md bg-accent-600 text-white text-xs font-bold tracking-wide">
                FEATURED
              </span>
            )}
          </div>

          {/* Info */}
          <div>
            <p className="text-xs font-bold tracking-[0.18em] text-accent-600 uppercase">
              {product.category_name}
              {product.subcategory ? ` · ${product.subcategory}` : ""}
            </p>
            <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-ink-950">
              {product.name}
            </h1>

            <div className="mt-5 flex items-center gap-3">
              <span className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-ink-950 text-white text-sm font-bold tracking-wide">
                <TagIcon className="w-4 h-4 text-accent-500" />
                REQUEST A QUOTE
              </span>
              {product.available ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  IN STOCK
                </span>
              ) : (
                <span className="px-3 py-1.5 rounded-full bg-ink-100 text-ink-500 text-xs font-bold">
                  OUT OF STOCK
                </span>
              )}
            </div>

            <p className="mt-6 text-ink-600 leading-relaxed">
              {product.description}
            </p>

            <div className="mt-8 space-y-3">
              {product.available && (
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center border-2 border-ink-200 rounded-lg">
                    <button
                      onClick={() => setQty((v) => Math.max(1, v - 1))}
                      className="p-3 text-ink-600 hover:text-ink-950"
                      aria-label="Decrease quantity"
                    >
                      <MinusIcon className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-extrabold text-ink-950">
                      {qty}
                    </span>
                    <button
                      onClick={() => setQty((v) => v + 1)}
                      className="p-3 text-ink-600 hover:text-ink-950"
                      aria-label="Increase quantity"
                    >
                      <PlusIcon className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    onClick={handleAdd}
                    className={`inline-flex items-center gap-2.5 px-7 py-3.5 rounded-lg font-bold transition-all active:scale-95 ${
                      added
                        ? "bg-emerald-600 text-white"
                        : "bg-ink-950 text-white hover:bg-accent-600"
                    }`}
                  >
                    {added ? (
                      <>
                        <CheckIcon className="w-5 h-5" /> Added to cart
                      </>
                    ) : (
                      <>
                        <CartIcon className="w-5 h-5" /> Add to Cart
                      </>
                    )}
                  </button>
                </div>
              )}

              <a
                href={waLink(
                  `Hello ${COMPANY.name}, I would like to request a quote for: ${product.name}.`
                )}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-lg bg-accent-600 text-white font-bold hover:bg-accent-700 transition-colors active:scale-95"
              >
                <WhatsAppIcon className="w-5 h-5" />
                Request a Quote on WhatsApp
              </a>
            </div>

            <div className="mt-8 grid sm:grid-cols-2 gap-3 text-sm">
              <div className="flex items-start gap-3 bg-ink-50 border border-ink-100 rounded-xl px-4 py-3.5">
                <TruckIcon className="w-5 h-5 text-accent-600 shrink-0 mt-0.5" />
                <span className="text-ink-700">
                  <strong className="text-ink-950">Delivery or collection</strong>
                  <br />
                  arranged across Zimbabwe.
                </span>
              </div>
              <div className="flex items-start gap-3 bg-ink-50 border border-ink-100 rounded-xl px-4 py-3.5">
                <CheckIcon className="w-5 h-5 text-accent-600 shrink-0 mt-0.5" />
                <span className="text-ink-700">
                  <strong className="text-ink-950">Quality assured</strong>
                  <br />
                  sourced from reputable suppliers.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-16 sm:mt-24">
            <h2 className="text-2xl font-extrabold tracking-tight text-ink-950 mb-6">
              More in {product.category_name}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
