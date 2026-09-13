import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  adminLogin,
  adminLogout,
  isAdminLoggedIn,
} from "../../lib/adminAuth";
import { isSupabaseConfigured } from "../../lib/supabaseClient";
import { COMPANY } from "../../lib/config";
import {
  BoxIcon,
  LogoutIcon,
  TagIcon,
  TruckIcon,
  EditIcon,
  BoltIcon,
  CartIcon,
} from "../../components/Icons";

function Login() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminLogin(password)) {
      navigate("/admin", { replace: true });
    } else {
      setError("Incorrect password. Try again.");
    }
  };

  return (
    <div className="min-h-screen bg-ink-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white border border-ink-100 rounded-2xl p-8 shadow-xl shadow-ink-950/5">
        <img src="/media/logo-mark.png" alt="" className="h-12 w-auto" />
        <h1 className="mt-5 text-2xl font-extrabold text-ink-950">
          Admin Dashboard
        </h1>
        <p className="mt-1 text-sm text-ink-500">
          {COMPANY.name} — sign in to manage products, orders and quotes.
        </p>
        <form onSubmit={submit} className="mt-6">
          <label className="block text-xs font-bold text-ink-600 mb-1.5">
            ADMIN PASSWORD
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-12 rounded-lg border border-ink-200 px-4 text-sm outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20"
            placeholder="••••••••"
            autoFocus
          />
          {error && (
            <p className="mt-2 text-sm font-semibold text-red-600">{error}</p>
          )}
          <button
            type="submit"
            className="mt-4 w-full h-12 rounded-lg bg-ink-950 text-white font-bold hover:bg-accent-600 transition-colors"
          >
            Sign In
          </button>
        </form>
        <Link
          to="/"
          className="block mt-4 text-center text-sm text-ink-500 hover:text-ink-950"
        >
          ← Back to website
        </Link>
      </div>
    </div>
  );
}

const NAV = [
  { to: "/admin", label: "Overview", icon: BoltIcon, end: true },
  { to: "/admin/products", label: "Products", icon: BoxIcon },
  { to: "/admin/categories", label: "Categories", icon: TagIcon },
  { to: "/admin/orders", label: "Orders", icon: CartIcon },
  { to: "/admin/quotes", label: "Quote Requests", icon: EditIcon },
  { to: "/admin/setup", label: "Setup & Supabase", icon: TruckIcon },
];

export default function AdminLayout() {
  const [authed, setAuthed] = useState(isAdminLoggedIn());

  if (!authed) return <Login />;

  return (
    <div className="min-h-screen bg-ink-50 lg:grid lg:grid-cols-[240px_1fr]">
      {/* Sidebar */}
      <aside className="bg-ink-950 text-ink-300 lg:min-h-screen flex lg:flex-col items-center lg:items-stretch gap-1 px-3 py-3 lg:p-5 overflow-x-auto lg:overflow-visible">
        <div className="hidden lg:block mb-6">
          <div className="flex items-center gap-2.5">
            <img src="/media/logo-mark.png" alt="" className="h-8 w-auto" />
            <p className="font-extrabold text-white tracking-tight">
              424 TRADING
            </p>
          </div>
          <p className="text-[10px] font-bold tracking-[0.18em] text-accent-400 mt-1.5">
            ADMIN DASHBOARD
          </p>
        </div>
        {NAV.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            end={n.end}
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold whitespace-nowrap hover:bg-white/10 hover:text-white transition-colors [&.active]:bg-accent-600 [&.active]:text-white"
          >
            <n.icon className="w-4 h-4" />
            {n.label}
          </NavLink>
        ))}
        <div className="lg:mt-auto lg:pt-6 flex lg:flex-col items-center lg:items-stretch gap-1">
          <Link
            to="/"
            className="px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-white/10 hover:text-white whitespace-nowrap"
          >
            ← View website
          </Link>
          <button
            onClick={() => {
              adminLogout();
              setAuthed(false);
            }}
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-white/10 hover:text-white whitespace-nowrap"
          >
            <LogoutIcon className="w-4 h-4" /> Sign out
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="p-4 sm:p-8 max-w-6xl w-full mx-auto">
        {!isSupabaseConfigured && (
          <div className="mb-6 bg-accent-50 border border-accent-200 text-accent-900 rounded-xl px-4 py-3 text-sm">
            <strong>Not connected to Supabase.</strong> Changes are saved in
            this browser only (demo mode).{" "}
            <Link to="/admin/setup" className="font-bold underline">
              Open Setup →
            </Link>
          </div>
        )}
        <Outlet />
      </main>
    </div>
  );
}
