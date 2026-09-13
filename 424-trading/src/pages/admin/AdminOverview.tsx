import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  adminListOrders,
  adminListProducts,
  adminListQuotes,
  listCategories,
  type Order,
  type QuoteRequest,
} from "../../lib/db";
import { COMPANY, formatDate, formatMoney } from "../../lib/config";
import {
  BoxIcon,
  CartIcon,
  EditIcon,
  TagIcon,
} from "../../components/Icons";

export default function AdminOverview() {
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    orders: 0,
    quotes: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [recentQuotes, setRecentQuotes] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      adminListProducts(),
      listCategories(),
      adminListOrders(),
      adminListQuotes(),
    ])
      .then(([p, c, o, q]) => {
        setStats({
          products: p.length,
          categories: c.length,
          orders: o.length,
          quotes: q.length,
        });
        setRecentOrders(o.slice(0, 5));
        setRecentQuotes(q.filter((x) => x.status === "new").slice(0, 5));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    { label: "Products", value: stats.products, to: "/admin/products", icon: BoxIcon },
    { label: "Categories", value: stats.categories, to: "/admin/categories", icon: TagIcon },
    { label: "Orders", value: stats.orders, to: "/admin/orders", icon: CartIcon },
    { label: "New Quotes", value: stats.quotes, to: "/admin/quotes", icon: EditIcon },
  ];

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-ink-950">Overview</h1>
      <p className="mt-1 text-sm text-ink-500">
        Welcome back. Here&apos;s what&apos;s happening at {COMPANY.name}.
      </p>

      <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            to={c.to}
            className="bg-white border border-ink-100 rounded-xl p-5 hover:shadow-lg hover:shadow-ink-950/6 hover:-translate-y-0.5 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="w-10 h-10 rounded-lg bg-ink-950 text-accent-500 flex items-center justify-center">
                <c.icon className="w-5 h-5" />
              </span>
              {loading ? (
                <span className="w-8 h-8 rounded bg-ink-100 animate-pulse" />
              ) : (
                <span className="text-3xl font-black text-ink-950">
                  {c.value}
                </span>
              )}
            </div>
            <p className="mt-3 text-sm font-bold text-ink-600">{c.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid lg:grid-cols-2 gap-6">
        <div className="bg-white border border-ink-100 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-ink-950">Recent Orders</h2>
            <Link to="/admin/orders" className="text-xs font-bold text-accent-600">
              View all →
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="mt-4 text-sm text-ink-500">
              No orders yet. New orders will appear here.
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-ink-100">
              {recentOrders.map((o) => (
                <li key={o.id} className="py-3 flex items-center justify-between gap-3 text-sm">
                  <div>
                    <p className="font-bold text-ink-900">
                      #{o.id.slice(0, 8).toUpperCase()}
                    </p>
                    <p className="text-xs text-ink-500">
                      {o.customer?.name ?? "Customer"} · {formatDate(o.created_at)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-ink-900">
                      {o.total > 0 ? formatMoney(o.total) : "To be quoted"}
                    </p>
                    <span className="text-[11px] font-bold uppercase text-accent-600">
                      {o.status}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white border border-ink-100 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-ink-950">New Quote Requests</h2>
            <Link to="/admin/quotes" className="text-xs font-bold text-accent-600">
              View all →
            </Link>
          </div>
          {recentQuotes.length === 0 ? (
            <p className="mt-4 text-sm text-ink-500">
              No new quote requests right now.
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-ink-100">
              {recentQuotes.map((q) => (
                <li key={q.id} className="py-3 text-sm">
                  <p className="font-bold text-ink-900">{q.product}</p>
                  <p className="text-xs text-ink-500">
                    {q.customer_name}
                    {q.company ? ` · ${q.company}` : ""} ·{" "}
                    {formatDate(q.created_at)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
