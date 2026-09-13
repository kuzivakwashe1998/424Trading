import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Reveal from "../components/Reveal";
import ProductCard from "../components/ProductCard";
import {
  getFeaturedProducts,
  listCategories,
  type Category,
  type Product,
} from "../lib/db";
import { COMPANY, waLink } from "../lib/config";
import {
  ArrowRightIcon,
  BoltIcon,
  BoxIcon,
  CheckIcon,
  LightbulbIcon,
  GemIcon,
  DropletIcon,
  MailIcon,
  PhoneIcon,
  PinIcon,
  ShieldIcon,
  TagIcon,
  TruckIcon,
  WhatsAppIcon,
} from "../components/Icons";

const CATEGORY_ICON: Record<string, (p: { className?: string }) => any> = {
  "Electrical Products": BoltIcon,
  "Lighting Solutions": LightbulbIcon,
  "Automotive Products": TruckIcon,
  "Marble & Stone": GemIcon,
  "Fuel & Oil Lubricants": DropletIcon,
};

export default function Home() {
  const [cats, setCats] = useState<Category[]>([]);
  const [featured, setFeatured] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([listCategories(), getFeaturedProducts()])
      .then(([c, f]) => {
        setCats(c);
        setFeatured(f);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      {/* ================= HERO ================= */}
      <section className="relative bg-ink-950 text-white overflow-hidden">
        <img
          src="/media/hero.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/85 to-ink-950/30" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-28 lg:py-32">
          <div className="max-w-3xl animate-fade-up">
            <p className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent-500/40 bg-accent-500/10 text-accent-400 text-xs font-bold tracking-[0.18em]">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-500" />
              HARARE, ZIMBABWE — INDUSTRIAL &amp; COMMERCIAL SUPPLY
            </p>
            <h1 className="mt-6 text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05]">
              QUALITY PRODUCTS.
              <span className="block bg-gradient-to-r from-accent-400 via-accent-500 to-accent-300 bg-clip-text text-transparent">
                CONVENIENTLY SOURCED
              </span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-ink-300 max-w-xl">
              Find what you need. Order with confidence.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2.5 px-7 py-4 rounded-lg bg-accent-600 text-white font-bold hover:bg-accent-700 hover:gap-3.5 transition-all shadow-lg shadow-accent-600/25"
              >
                Shop Products <ArrowRightIcon className="w-5 h-5" />
              </Link>
              <Link
                to="/request-quote"
                className="inline-flex items-center gap-2.5 px-7 py-4 rounded-lg border-2 border-white/25 text-white font-bold hover:border-accent-500 hover:text-accent-400 transition-colors"
              >
                Request a Quote
              </Link>
            </div>
          </div>

          {/* Stats strip */}
          <div className="mt-16 sm:mt-20 grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 rounded-xl overflow-hidden border border-white/10">
            {[
              ["5", "Product Categories"],
              ["20+", "Product Lines Stocked"],
              ["24h", "Quote Turnaround"],
              ["1", "Trusted Supply Partner"],
            ].map(([num, label]) => (
              <div key={label} className="bg-ink-950/70 backdrop-blur px-6 py-5">
                <p className="text-2xl sm:text-3xl font-black text-accent-500">
                  {num}
                </p>
                <p className="mt-1 text-xs sm:text-sm text-ink-300 font-medium">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CATEGORIES ================= */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Reveal className="flex flex-wrap items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-xs font-bold tracking-[0.2em] text-accent-600">
                WHAT WE SUPPLY
              </p>
              <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-ink-950">
                Product Categories
              </h2>
            </div>
            <Link
              to="/categories"
              className="text-sm font-bold text-accent-600 hover:text-accent-700 inline-flex items-center gap-1.5"
            >
              View all categories <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {cats.map((c, i) => {
              const Icon = CATEGORY_ICON[c.name] ?? BoxIcon;
              return (
                <Reveal key={c.id} delay={i * 70}>
                  <Link
                    to={`/shop?category=${c.id}`}
                    className="group block bg-white border border-ink-100 rounded-xl overflow-hidden hover:shadow-xl hover:shadow-ink-950/8 hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="aspect-[4/3] overflow-hidden bg-ink-50">
                      <img
                        src={c.image_url}
                        alt={c.name}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-2.5">
                        <span className="w-8 h-8 rounded-lg bg-ink-950 text-accent-500 flex items-center justify-center shrink-0 group-hover:bg-accent-600 group-hover:text-white transition-colors">
                          <Icon className="w-4 h-4" />
                        </span>
                        <span className="font-bold text-sm text-ink-900 leading-tight">
                          {c.name}
                        </span>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= FEATURED ================= */}
      <section className="py-16 sm:py-24 bg-ink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Reveal className="flex flex-wrap items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-xs font-bold tracking-[0.2em] text-accent-600">
                HAND-PICKED STOCK
              </p>
              <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-ink-950">
                Featured Products
              </h2>
            </div>
            <Link
              to="/shop"
              className="text-sm font-bold text-accent-600 hover:text-accent-700 inline-flex items-center gap-1.5"
            >
              Browse the full shop <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </Reveal>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="h-80 rounded-xl bg-ink-100 animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {featured.map((p, i) => (
                <Reveal key={p.id} delay={i * 60}>
                  <ProductCard product={p} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ================= WHY CHOOSE ================= */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Reveal className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-xs font-bold tracking-[0.2em] text-accent-600">
              WHY CHOOSE 424 TRADING
            </p>
            <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-ink-950">
              A supply partner Zimbabwean businesses rely on
            </h2>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: ShieldIcon,
                title: "Quality Assured",
                text: "Every product is sourced from reputable manufacturers and checked before it reaches you.",
              },
              {
                icon: TagIcon,
                title: "Competitive Pricing",
                text: "Straightforward USD pricing with quote-based rates for bulk and project orders.",
              },
              {
                icon: BoltIcon,
                title: "Conveniently Sourced",
                text: "One supplier across electrical, lighting, automotive, stone and lubricants — less chasing, more doing.",
              },
              {
                icon: TruckIcon,
                title: "Delivery or Collection",
                text: "Arrange delivery to your site or collect in Harare — whatever suits your operation.",
              },
            ].map((f, i) => (
              <Reveal key={f.title} delay={i * 70}>
                <div className="h-full bg-white border border-ink-100 rounded-xl p-6 hover:shadow-lg hover:shadow-ink-950/6 hover:border-accent-200 transition-all">
                  <span className="w-12 h-12 rounded-xl bg-ink-950 text-accent-500 flex items-center justify-center">
                    <f.icon className="w-6 h-6" />
                  </span>
                  <h3 className="mt-5 font-extrabold text-ink-950">{f.title}</h3>
                  <p className="mt-2 text-sm text-ink-600 leading-relaxed">
                    {f.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="py-16 sm:py-24 bg-ink-950 text-white relative overflow-hidden">
        <div className="absolute -left-32 top-0 w-96 h-96 rounded-full bg-accent-600/15 blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <Reveal className="flex flex-wrap items-end justify-between gap-4 mb-12">
            <div>
              <p className="text-xs font-bold tracking-[0.2em] text-accent-500">
                SIMPLE BY DESIGN
              </p>
              <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight">
                How It Works
              </h2>
            </div>
            <Link
              to="/how-to-order"
              className="text-sm font-bold text-accent-400 hover:text-accent-300 inline-flex items-center gap-1.5"
            >
              Read the full ordering guide <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              ["01", "Browse", "Explore our products and categories."],
              [
                "02",
                "Enquire",
                "Contact us for availability, specifications and pricing.",
              ],
              ["03", "Order", "Confirm your order and payment details."],
              [
                "04",
                "Delivery / Collection",
                "Arrange delivery or collection.",
              ],
            ].map(([num, title, text], i) => (
              <Reveal key={num} delay={i * 80}>
                <div className="relative h-full rounded-xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition-colors">
                  <span className="text-4xl font-black text-accent-500/90">
                    {num}
                  </span>
                  <h3 className="mt-4 font-extrabold text-lg">{title}</h3>
                  <p className="mt-2 text-sm text-ink-300 leading-relaxed">
                    {text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================= SUPPORT ================= */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-10 items-center">
          <Reveal>
            <p className="text-xs font-bold tracking-[0.2em] text-accent-600">
              CUSTOMER SUPPORT
            </p>
            <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-ink-950">
              Talk to a real person, fast.
            </h2>
            <p className="mt-4 text-ink-600 leading-relaxed max-w-lg">
              Need specifications, stock confirmation or a bulk price? Our
              Harare team responds quickly on WhatsApp, phone and email — so
              your project never waits on a supplier.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Product specifications and technical advice",
                "Stock availability and lead times",
                "Bulk, project and trade pricing",
                "Delivery scheduling across Zimbabwe",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3 text-sm text-ink-700">
                  <span className="w-5 h-5 rounded-full bg-accent-100 text-accent-600 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckIcon className="w-3 h-3" />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={120}>
            <div className="bg-ink-50 border border-ink-100 rounded-2xl p-6 sm:p-8 space-y-4">
              <a
                href={waLink(
                  `Hello ${COMPANY.name}, I need help choosing a product.`
                )}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-4 bg-[#25D366] text-white rounded-xl px-5 py-4 hover:brightness-110 transition"
              >
                <WhatsAppIcon className="w-7 h-7" />
                <span>
                  <span className="block font-extrabold">WhatsApp us</span>
                  <span className="block text-sm opacity-90">
                    {COMPANY.phone} — fastest response
                  </span>
                </span>
              </a>
              <a
                href={`tel:${COMPANY.phoneRaw}`}
                className="flex items-center gap-4 bg-ink-950 text-white rounded-xl px-5 py-4 hover:bg-ink-900 transition"
              >
                <PhoneIcon className="w-7 h-7 text-accent-500" />
                <span>
                  <span className="block font-extrabold">Call us</span>
                  <span className="block text-sm text-ink-300">
                    {COMPANY.phone}
                  </span>
                </span>
              </a>
              <a
                href={`mailto:${COMPANY.email}`}
                className="flex items-center gap-4 bg-white border border-ink-200 rounded-xl px-5 py-4 hover:border-accent-500 transition"
              >
                <MailIcon className="w-7 h-7 text-accent-600" />
                <span>
                  <span className="block font-extrabold text-ink-950">
                    Email us
                  </span>
                  <span className="block text-sm text-ink-600">
                    {COMPANY.email}
                  </span>
                </span>
              </a>
              <p className="flex items-center gap-2 text-xs text-ink-500 pt-1">
                <PinIcon className="w-4 h-4 text-accent-600" />
                {COMPANY.location} · Mon–Sat, 8:00–17:00
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================= CONTACT STRIP ================= */}
      <section className="bg-accent-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Ready to source your next order?
            </h2>
            <p className="mt-1 text-accent-100 text-sm sm:text-base">
              {COMPANY.location} · {COMPANY.phone} · {COMPANY.email}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/shop"
              className="px-6 py-3.5 rounded-lg bg-ink-950 text-white font-bold hover:bg-ink-900 transition-colors"
            >
              Shop Products
            </Link>
            <Link
              to="/request-quote"
              className="px-6 py-3.5 rounded-lg bg-white text-accent-600 font-bold hover:bg-accent-50 transition-colors"
            >
              Request a Quote
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
