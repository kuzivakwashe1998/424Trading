import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import PageBand from "../components/PageBand";
import { submitQuote } from "../lib/db";
import { COMPANY, waLink } from "../lib/config";
import { CheckIcon, WhatsAppIcon } from "../components/Icons";

const inputCls =
  "w-full h-11 rounded-lg border border-ink-200 bg-white px-4 text-sm outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 transition";

export default function RequestQuote() {
  const [params] = useSearchParams();
  const [form, setForm] = useState({
    customer_name: "",
    company: "",
    email: "",
    phone: "",
    product: params.get("product") ?? "",
    quantity: "",
    requirements: "",
    delivery_location: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const set =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.customer_name || !form.email || !form.product) {
      setError("Please provide your name, email and the product you need.");
      return;
    }
    setSubmitting(true);
    try {
      await submitQuote(form);
      setDone(true);
      window.scrollTo(0, 0);
    } catch (err: any) {
      setError(err?.message ?? "Could not submit your request. Try WhatsApp instead.");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <span className="mx-auto w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
          <CheckIcon className="w-8 h-8" />
        </span>
        <h1 className="mt-6 text-3xl font-extrabold text-ink-950">
          Quote request received
        </h1>
        <p className="mt-3 text-ink-600">
          Thank you, {form.customer_name.split(" ")[0]}. Our team will review
          your requirements for{" "}
          <strong className="text-ink-900">{form.product}</strong> and respond
          within one business day on {form.email || form.phone}.
        </p>
        <a
          href={waLink(
            `Hello ${COMPANY.name}, I just submitted a quote request for ${form.product}. Could you follow up urgently?`
          )}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-lg bg-[#25D366] text-white font-bold hover:brightness-110 transition"
        >
          <WhatsAppIcon className="w-5 h-5" /> Fast-track on WhatsApp
        </a>
      </div>
    );
  }

  return (
    <>
      <PageBand
        crumb="REQUEST A QUOTE"
        title="Request a Quote"
        intro="Tell us what you need — product, quantity and delivery location — and we'll come back with pricing and availability, usually within one business day."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14 grid lg:grid-cols-[1fr_360px] gap-8 items-start">
        <form
          onSubmit={submit}
          className="bg-white border border-ink-100 rounded-2xl p-6 sm:p-8"
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-ink-600 mb-1.5">
                YOUR NAME *
              </label>
              <input className={inputCls} value={form.customer_name} onChange={set("customer_name")} placeholder="Full name" required />
            </div>
            <div>
              <label className="block text-xs font-bold text-ink-600 mb-1.5">
                COMPANY
              </label>
              <input className={inputCls} value={form.company} onChange={set("company")} placeholder="Company (Pvt) Ltd" />
            </div>
            <div>
              <label className="block text-xs font-bold text-ink-600 mb-1.5">
                EMAIL *
              </label>
              <input type="email" className={inputCls} value={form.email} onChange={set("email")} placeholder="you@company.co.zw" required />
            </div>
            <div>
              <label className="block text-xs font-bold text-ink-600 mb-1.5">
                PHONE / WHATSAPP
              </label>
              <input className={inputCls} value={form.phone} onChange={set("phone")} placeholder="+263 77 000 0000" />
            </div>
            <div>
              <label className="block text-xs font-bold text-ink-600 mb-1.5">
                PRODUCT *
              </label>
              <input className={inputCls} value={form.product} onChange={set("product")} placeholder="e.g. LED Floodlight 200W" required />
            </div>
            <div>
              <label className="block text-xs font-bold text-ink-600 mb-1.5">
                ESTIMATED QUANTITY
              </label>
              <input className={inputCls} value={form.quantity} onChange={set("quantity")} placeholder="e.g. 50 units / 200 m²" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-ink-600 mb-1.5">
                REQUIREMENTS / SPECIFICATIONS
              </label>
              <textarea
                className="w-full rounded-lg border border-ink-200 bg-white px-4 py-3 text-sm outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 transition min-h-28"
                value={form.requirements}
                onChange={set("requirements")}
                placeholder="Specifications, brands, standards, timelines…"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-ink-600 mb-1.5">
                DELIVERY LOCATION
              </label>
              <input className={inputCls} value={form.delivery_location} onChange={set("delivery_location")} placeholder="e.g. Harare CBD, Bulawayo, site address…" />
            </div>
          </div>

          {error && (
            <p className="mt-4 text-sm font-semibold text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-6 w-full sm:w-auto px-8 py-4 rounded-lg bg-accent-600 text-white font-bold hover:bg-accent-700 transition-colors disabled:opacity-60"
          >
            {submitting ? "Sending…" : "Submit Quote Request"}
          </button>
        </form>

        <aside className="bg-ink-950 text-white rounded-2xl p-6 sm:p-8">
          <h2 className="text-lg font-extrabold">Prefer to talk?</h2>
          <p className="mt-2 text-sm text-ink-300 leading-relaxed">
            Send your requirements straight to our sales desk — we reply fast on
            WhatsApp during business hours.
          </p>
          <a
            href={waLink(
              `Hello ${COMPANY.name}, I would like a quote.${
                form.product ? ` Product: ${form.product}.` : ""
              }${form.quantity ? ` Quantity: ${form.quantity}.` : ""}`
            )}
            target="_blank"
            rel="noreferrer"
            className="mt-5 w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-[#25D366] text-white font-bold hover:brightness-110 transition"
          >
            <WhatsAppIcon className="w-5 h-5" /> WhatsApp {COMPANY.phone}
          </a>
          <div className="mt-6 pt-6 border-t border-ink-800 text-sm space-y-2 text-ink-300">
            <p>
              <span className="text-accent-500 font-bold">Email:</span>{" "}
              {COMPANY.email}
            </p>
            <p>
              <span className="text-accent-500 font-bold">Phone:</span>{" "}
              {COMPANY.phone}
            </p>
            <p>
              <span className="text-accent-500 font-bold">Location:</span>{" "}
              {COMPANY.location}
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}
