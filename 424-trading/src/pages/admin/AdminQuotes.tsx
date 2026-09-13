import { useEffect, useState } from "react";
import { adminListQuotes, updateQuoteStatus, type QuoteRequest } from "../../lib/db";
import { COMPANY, formatDate, QUOTE_STATUSES } from "../../lib/config";

const STATUS_STYLE: Record<string, string> = {
  new: "bg-accent-50 text-accent-600",
  contacted: "bg-sky-50 text-sky-700",
  quoted: "bg-emerald-50 text-emerald-700",
  closed: "bg-ink-100 text-ink-500",
};

export default function AdminQuotes() {
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminListQuotes()
      .then(setQuotes)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const setStatus = async (id: string, status: string) => {
    try {
      await updateQuoteStatus(id, status);
      setQuotes((q) => q.map((x) => (x.id === id ? { ...x, status } : x)));
    } catch (e: any) {
      window.alert(e?.message ?? "Could not update status.");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-ink-950">Quote Requests</h1>
      <p className="mt-1 text-sm text-ink-500">
        Enquiries and quote requests submitted through the website.
      </p>

      <div className="mt-6 space-y-3">
        {loading ? (
          <div className="h-32 rounded-xl bg-ink-100 animate-pulse" />
        ) : quotes.length === 0 ? (
          <div className="bg-white border border-ink-100 rounded-xl py-16 text-center text-ink-500 text-sm">
            No quote requests yet.
          </div>
        ) : (
          quotes.map((q) => (
            <div
              key={q.id}
              className="bg-white border border-ink-100 rounded-xl p-5"
            >
              <div className="flex flex-wrap items-center gap-3">
                <p className="font-extrabold text-ink-950">{q.product}</p>
                {q.quantity && (
                  <span className="text-xs font-bold text-ink-500 bg-ink-50 border border-ink-100 rounded-full px-2.5 py-1">
                    Qty: {q.quantity}
                  </span>
                )}
                <span
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase ${
                    STATUS_STYLE[q.status] ?? "bg-ink-100 text-ink-600"
                  }`}
                >
                  {q.status}
                </span>
                <span className="ml-auto text-xs text-ink-400">
                  {formatDate(q.created_at)}
                </span>
              </div>

              <div className="mt-3 grid sm:grid-cols-2 gap-x-6 gap-y-1 text-sm text-ink-700">
                <p>
                  <span className="font-bold text-ink-950">From:</span>{" "}
                  {q.customer_name}
                  {q.company ? ` — ${q.company}` : ""}
                </p>
                <p>
                  <span className="font-bold text-ink-950">Contact:</span>{" "}
                  {q.email}
                  {q.phone ? ` · ${q.phone}` : ""}
                </p>
                {q.delivery_location && (
                  <p>
                    <span className="font-bold text-ink-950">Deliver to:</span>{" "}
                    {q.delivery_location}
                  </p>
                )}
              </div>
              {q.requirements && (
                <p className="mt-3 text-sm text-ink-600 bg-ink-50 rounded-lg p-3">
                  {q.requirements}
                </p>
              )}

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <select
                  value={q.status}
                  onChange={(e) => setStatus(q.id, e.target.value)}
                  className="h-10 rounded-lg border border-ink-200 bg-white px-3 text-sm font-semibold outline-none focus:border-accent-500"
                >
                  {QUOTE_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                {q.phone && (
                  <a
                    href={`https://wa.me/${q.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                      `Hello ${q.customer_name}, this is ${COMPANY.name} regarding your quote request for ${q.product}.`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2.5 rounded-lg bg-[#25D366] text-white text-xs font-bold hover:brightness-110"
                  >
                    WhatsApp
                  </a>
                )}
                {q.email && (
                  <a
                    href={`mailto:${q.email}?subject=Quote for ${encodeURIComponent(
                      q.product
                    )} — ${COMPANY.name}`}
                    className="px-4 py-2.5 rounded-lg border-2 border-ink-200 text-xs font-bold text-ink-700 hover:border-ink-950"
                  >
                    Email quote
                  </a>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
