import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { listCategories, type Category } from "../lib/db";
import { COMPANY } from "../lib/config";
import Logo from "./Logo";
import {
  CartIcon,
  ChevronDownIcon,
  MailIcon,
  MenuIcon,
  PhoneIcon,
  PinIcon,
  SearchIcon,
  XIcon,
} from "./Icons";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/categories", label: "Categories" },
  { to: "/request-quote", label: "Request a Quote" },
  { to: "/how-to-order", label: "How to Order" },
  { to: "/about", label: "About Us" },
  { to: "/contact", label: "Contact" },
];

export default function Header() {
  const { count } = useCart();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [cats, setCats] = useState<Category[]>([]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listCategories()
      .then(setCats)
      .catch(() => setCats([]));
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setDropOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(query.trim() ? `/shop?q=${encodeURIComponent(query.trim())}` : "/shop");
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-40">
      {/* Top info strip */}
      <div className="bg-ink-950 text-ink-200 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-9 flex items-center justify-between gap-4">
          <div className="flex items-center gap-5 min-w-0">
            <a
              href={`tel:${COMPANY.phoneRaw}`}
              className="flex items-center gap-1.5 hover:text-accent-400 transition-colors whitespace-nowrap"
            >
              <PhoneIcon className="w-3.5 h-3.5" />
              {COMPANY.phone}
            </a>
            <a
              href={`mailto:${COMPANY.email}`}
              className="hidden sm:flex items-center gap-1.5 hover:text-accent-400 transition-colors truncate"
            >
              <MailIcon className="w-3.5 h-3.5" />
              {COMPANY.email}
            </a>
          </div>
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <PinIcon className="w-3.5 h-3.5 text-accent-500" />
            {COMPANY.location}
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div
        className={`bg-white/95 backdrop-blur border-b border-ink-100 transition-shadow ${
          scrolled ? "shadow-md shadow-ink-950/5" : ""
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center gap-4 sm:gap-8">
          <Logo />

          <form
            onSubmit={submitSearch}
            className="hidden md:flex flex-1 max-w-xl ml-auto relative"
            role="search"
          >
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products, e.g. floodlight, VSD, granite…"
              className="w-full h-11 rounded-lg border border-ink-200 bg-ink-50 pl-4 pr-12 text-sm outline-none focus:border-accent-500 focus:bg-white focus:ring-2 focus:ring-accent-500/20 transition"
            />
            <button
              type="submit"
              aria-label="Search"
              className="absolute right-1.5 top-1.5 bottom-1.5 px-3 rounded-md bg-ink-950 text-white hover:bg-accent-600 transition-colors"
            >
              <SearchIcon className="w-5 h-5" />
            </button>
          </form>

          <div className="flex items-center gap-2 ml-auto md:ml-0">
            <Link
              to="/cart"
              className="relative p-2.5 rounded-lg text-ink-700 hover:bg-ink-50 hover:text-ink-950 transition-colors"
              aria-label="Cart"
            >
              <CartIcon className="w-6 h-6" />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-5 h-5 px-1 rounded-full bg-accent-600 text-white text-[11px] font-bold flex items-center justify-center">
                  {count}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2.5 rounded-lg text-ink-700 hover:bg-ink-50"
              aria-label="Open menu"
            >
              <MenuIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Desktop nav */}
        <nav className="hidden lg:block border-t border-ink-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-1 h-12">
            {NAV.slice(0, 2).map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                className={({ isActive }) =>
                  `px-4 h-full flex items-center text-sm font-semibold tracking-wide transition-colors border-b-2 ${
                    isActive
                      ? "border-accent-600 text-ink-950"
                      : "border-transparent text-ink-600 hover:text-ink-950"
                  }`
                }
              >
                {n.label}
              </NavLink>
            ))}

            {/* Categories dropdown */}
            <div className="relative h-full" ref={dropRef}>
              <button
                onClick={() => setDropOpen((v) => !v)}
                className={`px-4 h-full flex items-center gap-1.5 text-sm font-semibold tracking-wide border-b-2 transition-colors ${
                  dropOpen
                    ? "border-accent-600 text-ink-950"
                    : "border-transparent text-ink-600 hover:text-ink-950"
                }`}
              >
                Categories
                <ChevronDownIcon
                  className={`w-4 h-4 transition-transform ${dropOpen ? "rotate-180" : ""}`}
                />
              </button>
              {dropOpen && (
                <div className="absolute left-0 top-full w-72 bg-white border border-ink-100 rounded-xl shadow-xl shadow-ink-950/10 p-2 animate-fade-in">
                  {cats.map((c) => (
                    <Link
                      key={c.id}
                      to={`/shop?category=${c.id}`}
                      onClick={() => setDropOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-ink-50 transition-colors"
                    >
                      <img
                        src={c.image_url}
                        alt=""
                        className="w-9 h-9 rounded-md object-cover"
                      />
                      <span className="text-sm font-medium text-ink-800">
                        {c.name}
                      </span>
                    </Link>
                  ))}
                  <Link
                    to="/categories"
                    onClick={() => setDropOpen(false)}
                    className="block px-3 py-2.5 mt-1 rounded-lg text-sm font-semibold text-accent-600 hover:bg-accent-50"
                  >
                    View all categories →
                  </Link>
                </div>
              )}
            </div>

            {NAV.slice(3).map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                className={({ isActive }) =>
                  `px-4 h-full flex items-center text-sm font-semibold tracking-wide transition-colors border-b-2 ${
                    isActive
                      ? "border-accent-600 text-ink-950"
                      : "border-transparent text-ink-600 hover:text-ink-950"
                  }`
                }
              >
                {n.label}
              </NavLink>
            ))}

            <Link
              to="/request-quote"
              className="ml-auto h-9 px-5 flex items-center rounded-lg bg-accent-600 text-white text-sm font-bold hover:bg-accent-700 transition-colors shadow-sm"
            >
              Get a Quote
            </Link>
          </div>
        </nav>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-ink-950/60 animate-fade-in"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-80 max-w-[85%] bg-white shadow-2xl flex flex-col animate-fade-in">
            <div className="flex items-center justify-between px-5 h-16 border-b border-ink-100">
              <span className="font-extrabold tracking-tight text-ink-950">
                424 TRADING
              </span>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 rounded-lg hover:bg-ink-50"
                aria-label="Close menu"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={submitSearch} className="p-4 border-b border-ink-100">
              <div className="relative">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products…"
                  className="w-full h-11 rounded-lg border border-ink-200 bg-ink-50 pl-4 pr-11 text-sm outline-none focus:border-accent-500"
                />
                <button
                  type="submit"
                  aria-label="Search"
                  className="absolute right-1.5 top-1.5 bottom-1.5 px-3 rounded-md bg-ink-950 text-white"
                >
                  <SearchIcon className="w-4 h-4" />
                </button>
              </div>
            </form>
            <nav className="flex-1 overflow-y-auto p-4 space-y-1">
              {NAV.map((n) => (
                <NavLink
                  key={n.to}
                  to={n.to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `block px-4 py-3 rounded-lg text-sm font-semibold ${
                      isActive
                        ? "bg-accent-50 text-accent-600"
                        : "text-ink-700 hover:bg-ink-50"
                    }`
                  }
                >
                  {n.label}
                </NavLink>
              ))}
              <div className="pt-3 mt-3 border-t border-ink-100">
                <p className="px-4 pb-2 text-[11px] font-bold tracking-[0.15em] text-ink-400">
                  CATEGORIES
                </p>
                {cats.map((c) => (
                  <Link
                    key={c.id}
                    to={`/shop?category=${c.id}`}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-ink-700 hover:bg-ink-50"
                  >
                    <img
                      src={c.image_url}
                      alt=""
                      className="w-8 h-8 rounded-md object-cover"
                    />
                    {c.name}
                  </Link>
                ))}
              </div>
            </nav>
            <div className="p-4 border-t border-ink-100 space-y-2 text-sm text-ink-600">
              <a href={`tel:${COMPANY.phoneRaw}`} className="flex items-center gap-2">
                <PhoneIcon className="w-4 h-4 text-accent-600" /> {COMPANY.phone}
              </a>
              <a href={`mailto:${COMPANY.email}`} className="flex items-center gap-2">
                <MailIcon className="w-4 h-4 text-accent-600" /> {COMPANY.email}
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
