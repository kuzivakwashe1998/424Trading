import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { COMPANY, waLink } from "../lib/config";
import { listCategories, type Category } from "../lib/db";
import { MailIcon, PhoneIcon, PinIcon, WhatsAppIcon } from "./Icons";
import Logo from "./Logo";

export default function Footer() {
  const [cats, setCats] = useState<Category[]>([]);

  useEffect(() => {
    listCategories()
      .then(setCats)
      .catch(() => setCats([]));
  }, []);

  return (
    <footer className="bg-ink-950 text-ink-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo dark />
          <p className="text-sm leading-relaxed mt-4">
            Your trusted Zimbabwean supplier of electrical products, lighting
            solutions, automotive products, marble &amp; stone and fuel &amp;
            oil lubricants. Based in Harare, supplying nationwide.
          </p>
        </div>

        <div>
          <p className="text-white font-bold text-sm tracking-widest mb-4">
            QUICK LINKS
          </p>
          <ul className="space-y-2.5 text-sm">
            {[
              ["/shop", "Shop Products"],
              ["/categories", "Categories"],
              ["/request-quote", "Request a Quote"],
              ["/how-to-order", "How to Order"],
              ["/about", "About Us"],
              ["/contact", "Contact"],
            ].map(([to, label]) => (
              <li key={to}>
                <Link to={to} className="hover:text-accent-400 transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-white font-bold text-sm tracking-widest mb-4">
            CATEGORIES
          </p>
          <ul className="space-y-2.5 text-sm">
            {cats.map((c) => (
              <li key={c.id}>
                <Link
                  to={`/shop?category=${c.id}`}
                  className="hover:text-accent-400 transition-colors"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-white font-bold text-sm tracking-widest mb-4">
            GET IN TOUCH
          </p>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <PinIcon className="w-4 h-4 mt-0.5 text-accent-500 shrink-0" />
              {COMPANY.location}
            </li>
            <li>
              <a
                href={`tel:${COMPANY.phoneRaw}`}
                className="flex items-center gap-3 hover:text-accent-400 transition-colors"
              >
                <PhoneIcon className="w-4 h-4 text-accent-500 shrink-0" />
                {COMPANY.phone}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${COMPANY.email}`}
                className="flex items-center gap-3 hover:text-accent-400 transition-colors"
              >
                <MailIcon className="w-4 h-4 text-accent-500 shrink-0" />
                {COMPANY.email}
              </a>
            </li>
            <li>
              <a
                href={waLink("Hello 424 TRADING, I would like to make an enquiry.")}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 mt-2 px-4 py-2.5 rounded-lg bg-[#25D366] text-white font-semibold hover:brightness-110 transition"
              >
                <WhatsAppIcon className="w-4 h-4" />
                Chat on WhatsApp
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-ink-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-6 text-xs text-ink-500">
          <p>
            © {new Date().getFullYear()} {COMPANY.name}. All rights reserved.
          </p>
          <Link to="/admin" className="hover:text-accent-400 transition-colors">
            Admin
          </Link>
          <p>Made by NOVRA GROUP</p>
        </div>
      </div>
    </footer>
  );
}
