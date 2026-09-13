import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { getProduct, submitOrder, type Product } from "../lib/db";
import { COMPANY } from "../lib/config";
import PageBand from "../components/PageBand";
import { CheckIcon } from "../components/Icons";

interface Row {
  product: Product;
  quantity: number;
}

const inputCls =
  "w-full h-11 rounded-lg border border-ink-200 bg-white px-4 text-sm outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 transition";

export default function Checkout() {
  const { items, clear } = useCart();
  const navigate = useNavigate();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [orderId, setOrderId] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    address: "",
    delivery: "collection",
    notes: "",
  });

  useEffect(() => {
    let alive = true;
    Promise.all(
      items.map(async (i) => ({
        product: await getProduct(i.productId),
        quantity: i.quantity,
      }))
    )
      .then((r) => alive && setRows(r.filter((x): x is Row => Boolean(x.product))))
      .catch(() => {})
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [items]);

  const set = (k: keyof typeof form) => (e: any) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.email || !form.phone) {
      setError("Please fill in your name, email and phone number.");
      return;
    }
    setSubmitting(true);
    try {
      const id = await submitOrder({
        customer: {
          name: form.name,
          email: form.email,
          phone: form.phone,
          company: form.company,
          address: form.address,
        },
        deliveryMethod: form.delivery,
        notes: form.notes,
        items: items,
      });
      setOrderId(id);
      clear();
      window.scrollTo(0, 0);
    } catch (err: any) {
      setError(err?.message ?? "Something went wrong placing your order.");
    } finally {
      setSubmitting(false);
    }
  };

  if (orderId) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <span className="mx-auto w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
          <CheckIcon className="w-8 h-8" />
        </span>
        <h1 className="mt-6 text-3xl font-extrabold text-ink-950">
          Order placed — thank you!
        </h1>
        <p className="mt-3 text-ink-600">
          Your order reference is{" "}
          <span className="font-mono font-bold text-ink-950">
            {orderId.slice(0, 8).toUpperCase()}
          </span>
          . Our team will contact you on {form.phone || "your phone"} to confirm
          availability, final pricing and payment details.
        </p>
        <p className="mt-2 text-sm text-ink-500">
          Our team will confirm availability and pricing for every item before
          payment.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link
            to="/shop"
            className="px-6 py-3 rounded-lg bg-ink-950 text-white font-bold hover:bg-accent-600 transition-colors"
          >
            Continue Shopping
          </Link>
          <Link
            to="/"
            className="px-6 py-3 rounded-lg border-2 border-ink-200 font-bold text-ink-700 hover:border-ink-950"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!loading && rows.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <h1 className="text-3xl font-extrabold text-ink-950">
          Nothing to check out
        </h1>
        <p className="mt-3 text-ink-600">Your cart is empty.</p>
        <Link
          to="/shop"
          className="inline-block mt-6 px-6 py-3 rounded-lg bg-ink-950 text-white font-bold hover:bg-accent-600"
        >
          Shop Products
        </Link>
      </div>
    );
  }

  return (
    <>
      <PageBand
        crumb="CHECKOUT"
        title="Checkout"
        intro="Submit your order and our team will confirm availability, payment and delivery with you directly."
      />

      <form
        onSubmit={submit}
        className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14 grid lg:grid-cols-[1fr_400px] gap-8 items-start"
      >
        <div className="space-y-6">
          <section className="bg-white border border-ink-100 rounded-2xl p-6 sm:p-8">
            <h2 className="text-lg font-extrabold text-ink-950">
              1. Your Details
            </h2>
            <div className="mt-5 grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-ink-600 mb-1.5">
                  FULL NAME *
                </label>
                <input className={inputCls} value={form.name} onChange={set("name")} placeholder="Tendai Moyo" required />
              </div>
              <div>
                <label className="block text-xs font-bold text-ink-600 mb-1.5">
                  EMAIL *
                </label>
                <input type="email" className={inputCls} value={form.email} onChange={set("email")} placeholder="you@company.co.zw" required />
              </div>
              <div>
                <label className="block text-xs font-bold text-ink-600 mb-1.5">
                  PHONE / WHATSAPP *
                </label>
                <input className={inputCls} value={form.phone} onChange={set("phone")} placeholder="+263 77 000 0000" required />
              </div>
              <div>
                <label className="block text-xs font-bold text-ink-600 mb-1.5">
                  COMPANY (OPTIONAL)
                </label>
                <input className={inputCls} value={form.company} onChange={set("company")} placeholder="Company (Pvt) Ltd" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-ink-600 mb-1.5">
                  ADDRESS
                </label>
                <input className={inputCls} value={form.address} onChange={set("address")} placeholder="Street, suburb, city" />
              </div>
            </div>
          </section>

          <section className="bg-white border border-ink-100 rounded-2xl p-6 sm:p-8">
            <h2 className="text-lg font-extrabold text-ink-950">
              2. Delivery Method
            </h2>
            <div className="mt-5 grid sm:grid-cols-2 gap-3">
              {[
                ["collection", "Collection in Harare", "Collect from our Harare premises."],
                ["delivery", "Delivery", "We deliver to your site or premises."],
              ].map(([val, label, hint]) => (
                <label
                  key={val}
                  className={`flex items-start gap-3 rounded-xl border-2 p-4 cursor-pointer transition-colors ${
                    form.delivery === val
                      ? "border-accent-600 bg-accent-50"
                      : "border-ink-100 hover:border-ink-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="delivery"
                    value={val}
                    checked={form.delivery === val}
                    onChange={set("delivery")}
                    className="mt-1 accent-accent-600"
                  />
                  <span>
                    <span className="block font-bold text-ink-950 text-sm">
                      {label}
                    </span>
                    <span className="block text-xs text-ink-500 mt-0.5">
                      {hint}
                    </span>
                  </span>
                </label>
              ))}
            </div>
            <div className="mt-4">
              <label className="block text-xs font-bold text-ink-600 mb-1.5">
                ORDER NOTES (OPTIONAL)
              </label>
              <textarea
                className="w-full rounded-lg border border-ink-200 bg-white px-4 py-3 text-sm outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 transition min-h-24"
                value={form.notes}
                onChange={set("notes")}
                placeholder="Any specifications, delivery instructions or questions…"
              />
            </div>
          </section>
        </div>

        {/* Summary */}
        <aside className="bg-ink-50 border border-ink-100 rounded-2xl p-6 lg:sticky lg:top-40">
          <h2 className="text-lg font-extrabold text-ink-950">Your Order</h2>
          <ul className="mt-4 space-y-3 max-h-72 overflow-y-auto slim-scroll pr-1">
            {rows.map(({ product, quantity }) => (
              <li key={product.id} className="flex items-center gap-3 text-sm">
                <img
                  src={product.image_url}
                  alt=""
                  className="w-12 h-12 rounded-lg object-cover bg-white border border-ink-100"
                />
                <span className="flex-1 min-w-0">
                  <span className="block font-semibold text-ink-900 truncate">
                    {product.name}
                  </span>
                  <span className="text-xs text-ink-500">× {quantity}</span>
                </span>
                <span className="text-xs font-bold text-ink-500 whitespace-nowrap uppercase">
                  Quote
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4 pt-4 border-t border-ink-200 flex justify-between text-sm">
            <span className="font-extrabold text-ink-950">Total</span>
            <span className="font-black text-accent-600">To be quoted</span>
          </div>
          {error && (
            <p className="mt-3 text-sm font-semibold text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="mt-5 w-full px-6 py-4 rounded-lg bg-accent-600 text-white font-bold hover:bg-accent-700 transition-colors disabled:opacity-60"
          >
            {submitting ? "Placing order…" : "Place Order"}
          </button>
          <p className="mt-3 text-xs text-ink-500 leading-relaxed">
            By placing this order you agree to be contacted by {COMPANY.name} to
            confirm pricing, payment and delivery. No payment is taken online.
          </p>
        </aside>
      </form>
    </>
  );
}
