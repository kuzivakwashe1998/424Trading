import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { getProduct, type Product } from "../lib/db";
import PageBand from "../components/PageBand";
import {
  ArrowRightIcon,
  CartIcon,
  MinusIcon,
  PlusIcon,
  TrashIcon,
} from "../components/Icons";

interface Row {
  product: Product;
  quantity: number;
}

export default function Cart() {
  const { items, setQty, remove } = useCart();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    Promise.all(
      items.map(async (i) => ({
        product: await getProduct(i.productId),
        quantity: i.quantity,
      }))
    )
      .then(
        (r) =>
          alive &&
          setRows(r.filter((x): x is Row => Boolean(x.product)))
      )
      .catch(() => {})
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [items]);

  return (
    <>
      <PageBand
        crumb="CART"
        title="Your Cart"
        intro="Review your order before checkout. Items marked “Request a Quote” will be priced and confirmed by our team."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14 grid lg:grid-cols-[1fr_380px] gap-8 items-start">
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="h-32 rounded-xl bg-ink-100 animate-pulse" />
            ))}
          </div>
        ) : rows.length === 0 ? (
          <div className="bg-ink-50 border border-ink-100 rounded-2xl py-24 text-center">
            <CartIcon className="w-12 h-12 mx-auto text-ink-300" />
            <h2 className="mt-4 text-2xl font-extrabold text-ink-950">
              Your cart is empty
            </h2>
            <p className="mt-2 text-sm text-ink-500">
              Browse the shop and add products to get started.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-lg bg-ink-950 text-white font-bold hover:bg-accent-600 transition-colors"
            >
              Shop Products <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {rows.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="flex gap-4 bg-white border border-ink-100 rounded-xl p-4"
                >
                  <Link
                    to={`/product/${product.id}`}
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg overflow-hidden bg-ink-50 shrink-0"
                  >
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[11px] font-bold tracking-[0.14em] text-accent-600 uppercase">
                          {product.category_name}
                        </p>
                        <Link
                          to={`/product/${product.id}`}
                          className="font-bold text-ink-950 hover:text-accent-700 transition-colors"
                        >
                          {product.name}
                        </Link>
                      </div>
                      <button
                        onClick={() => remove(product.id)}
                        className="p-2 rounded-lg text-ink-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        aria-label={`Remove ${product.name}`}
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center border border-ink-200 rounded-lg">
                        <button
                          onClick={() => setQty(product.id, quantity - 1)}
                          className="p-2 text-ink-600 hover:text-ink-950"
                          aria-label="Decrease quantity"
                        >
                          <MinusIcon className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-10 text-center text-sm font-extrabold">
                          {quantity}
                        </span>
                        <button
                          onClick={() => setQty(product.id, quantity + 1)}
                          className="p-2 text-ink-600 hover:text-ink-950"
                          aria-label="Increase quantity"
                        >
                          <PlusIcon className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-xs font-bold tracking-wide text-ink-500 uppercase">
                        Pricing on request
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <aside className="bg-ink-50 border border-ink-100 rounded-2xl p-6 lg:sticky lg:top-40">
              <h2 className="text-lg font-extrabold text-ink-950">
                Order Summary
              </h2>
              <div className="mt-4 flex justify-between text-sm text-ink-600">
                <span>Items</span>
                <span className="font-semibold text-ink-900">
                  {rows.reduce((s, r) => s + r.quantity, 0)}
                </span>
              </div>
              <p className="mt-3 rounded-lg bg-accent-50 border border-accent-200 px-3 py-2.5 text-xs text-accent-600 font-semibold leading-relaxed">
                All products are priced on request. Our team will confirm
                pricing with you before payment.
              </p>
              <Link
                to="/checkout"
                className="mt-5 w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-lg bg-accent-600 text-white font-bold hover:bg-accent-700 transition-colors"
              >
                Proceed to Checkout <ArrowRightIcon className="w-4 h-4" />
              </Link>
              <Link
                to="/shop"
                className="mt-3 w-full inline-flex items-center justify-center px-6 py-3 rounded-lg border-2 border-ink-200 text-ink-700 text-sm font-bold hover:border-ink-950 hover:text-ink-950 transition-colors"
              >
                Continue Shopping
              </Link>
            </aside>
          </>
        )}
      </div>
    </>
  );
}
