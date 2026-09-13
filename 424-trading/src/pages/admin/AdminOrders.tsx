import { useEffect, useState } from "react";
import { adminListOrders, updateOrderStatus, type Order } from "../../lib/db";
import { COMPANY, formatDate, formatMoney, ORDER_STATUSES } from "../../lib/config";
import { ChevronDownIcon } from "../../components/Icons";

const STATUS_STYLE: Record<string, string> = {
  pending: "bg-accent-50 text-accent-600",
  confirmed: "bg-sky-50 text-sky-700",
  processing: "bg-indigo-50 text-indigo-700",
  ready: "bg-emerald-50 text-emerald-700",
  delivered: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-red-50 text-red-600",
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const refresh = () => {
    setLoading(true);
    adminListOrders()
      .then(setOrders)
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(refresh, []);

  const setStatus = async (id: string, status: string) => {
    setBusy(id);
    try {
      await updateOrderStatus(id, status);
      setOrders((o) => o.map((x) => (x.id === id ? { ...x, status } : x)));
    } catch (e: any) {
      window.alert(e?.message ?? "Could not update status.");
    } finally {
      setBusy(null);
    }
  };

  const waOrder = (o: Order) => {
    const lines = (o.items ?? [])
      .map((i) => `• ${i.product_name ?? i.product_id} × ${i.quantity}`)
      .join("\n");
    return `https://wa.me/${(o.customer?.phone || COMPANY.whatsappNumber)
      .replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
      `Hello ${o.customer?.name ?? ""}, thank you for your order #${o.id
        .slice(0, 8)
        .toUpperCase()} with ${COMPANY.name}:\n${lines}\nWe will confirm pricing, payment and ${
        o.delivery_method
      } details shortly.`
    )}`;
  };

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-ink-950">Orders</h1>
      <p className="mt-1 text-sm text-ink-500">
        Orders placed on the website. Update the status as you fulfil them.
      </p>

      <div className="mt-6 space-y-3">
        {loading ? (
          <div className="h-32 rounded-xl bg-ink-100 animate-pulse" />
        ) : orders.length === 0 ? (
          <div className="bg-white border border-ink-100 rounded-xl py-16 text-center text-ink-500 text-sm">
            No orders yet. Orders placed on the website will appear here.
          </div>
        ) : (
          orders.map((o) => (
            <div
              key={o.id}
              className="bg-white border border-ink-100 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === o.id ? null : o.id)}
                className="w-full px-5 py-4 flex flex-wrap items-center gap-3 text-left hover:bg-ink-50/60"
              >
                <span className="font-mono font-bold text-ink-950">
                  #{o.id.slice(0, 8).toUpperCase()}
                </span>
                <span className="text-sm text-ink-600">
                  {o.customer?.name ?? "Customer"}
                  {o.customer?.company ? ` (${o.customer.company})` : ""}
                </span>
                <span className="text-xs text-ink-400">
                  {formatDate(o.created_at)}
                </span>
                <span className="ml-auto flex items-center gap-3">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase ${
                      STATUS_STYLE[o.status] ?? "bg-ink-100 text-ink-600"
                    }`}
                  >
                    {o.status}
                  </span>
                  <span className="font-extrabold text-ink-950">
                    {o.total > 0 ? formatMoney(o.total) : "To be quoted"}
                  </span>
                  <ChevronDownIcon
                    className={`w-4 h-4 text-ink-400 transition-transform ${
                      open === o.id ? "rotate-180" : ""
                    }`}
                  />
                </span>
              </button>

              {open === o.id && (
                <div className="px-5 pb-5 border-t border-ink-100 pt-4 grid lg:grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs font-bold tracking-widest text-ink-400">
                      ITEMS
                    </p>
                    <ul className="mt-2 space-y-2 text-sm">
                      {(o.items ?? []).map((i) => (
                        <li key={i.id} className="flex justify-between gap-3">
                          <span className="text-ink-700">
                            {i.product_name ?? i.product_id}{" "}
                            <span className="text-ink-400">× {i.quantity}</span>
                          </span>
                          <span className="font-semibold text-ink-900">
                            {i.price !== null ? formatMoney(i.price * i.quantity) : "Quote"}
                          </span>
                        </li>
                      ))}
                    </ul>
                    {o.notes && (
                      <p className="mt-3 text-xs text-ink-500 bg-ink-50 rounded-lg p-3">
                        <strong>Notes:</strong> {o.notes}
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-bold tracking-widest text-ink-400">
                      CUSTOMER
                    </p>
                    <div className="mt-2 text-sm text-ink-700 space-y-1">
                      <p className="font-bold text-ink-950">
                        {o.customer?.name}
                      </p>
                      <p>{o.customer?.phone}</p>
                      <p>{o.customer?.email}</p>
                      {o.customer?.company && <p>{o.customer.company}</p>}
                      {o.customer?.address && <p>{o.customer.address}</p>}
                      <p className="pt-1 text-xs font-bold text-accent-600 uppercase">
                        {o.delivery_method === "delivery"
                          ? "Delivery requested"
                          : "Collection in Harare"}
                      </p>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <select
                        value={o.status}
                        disabled={busy === o.id}
                        onChange={(e) => setStatus(o.id, e.target.value)}
                        className="h-10 rounded-lg border border-ink-200 bg-white px-3 text-sm font-semibold outline-none focus:border-accent-500 disabled:opacity-60"
                      >
                        {ORDER_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      {o.customer?.phone && (
                        <a
                          href={waOrder(o)}
                          target="_blank"
                          rel="noreferrer"
                          className="px-4 py-2.5 rounded-lg bg-[#25D366] text-white text-xs font-bold hover:brightness-110"
                        >
                          WhatsApp customer
                        </a>
                      )}
                      {o.customer?.email && (
                        <a
                          href={`mailto:${o.customer.email}?subject=Your order ${o.id
                            .slice(0, 8)
                            .toUpperCase()} — ${COMPANY.name}`}
                          className="px-4 py-2.5 rounded-lg border-2 border-ink-200 text-xs font-bold text-ink-700 hover:border-ink-950"
                        >
                          Email customer
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
