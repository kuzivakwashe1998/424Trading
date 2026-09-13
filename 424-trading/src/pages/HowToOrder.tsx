import { Link } from "react-router-dom";
import PageBand from "../components/PageBand";
import Reveal from "../components/Reveal";
import { COMPANY, waLink } from "../lib/config";
import {
  ArrowRightIcon,
  SearchIcon,
  TagIcon,
  TruckIcon,
  WhatsAppIcon,
} from "../components/Icons";

const STEPS = [
  {
    num: "1",
    icon: SearchIcon,
    title: "Browse",
    text: "Explore our products and categories.",
    detail:
      "Use the shop to search, filter by category and compare product lines. Products without a fixed price are available on request — we'll quote them for you.",
  },
  {
    num: "2",
    icon: TagIcon,
    title: "Enquire",
    text: "Contact us for availability, specifications and pricing.",
    detail:
      "Send a quote request, chat on WhatsApp or call us. We confirm stock, specs and your best price — usually within one business day.",
  },
  {
    num: "3",
    icon: ArrowRightIcon,
    title: "Order",
    text: "Confirm your order and payment details.",
    detail:
      "Place your order online or confirm with our team. We agree payment details with you directly — bank transfer, mobile money or card on collection.",
  },
  {
    num: "4",
    icon: TruckIcon,
    title: "Delivery / Collection",
    text: "Arrange delivery or collection.",
    detail:
      "Collect from our Harare premises or have us deliver to your site anywhere in Zimbabwe. Bulk and project deliveries scheduled around your timeline.",
  },
];

export default function HowToOrder() {
  return (
    <>
      <PageBand
        crumb="HOW TO ORDER"
        title="How to Order"
        intro="Four simple steps from browsing to delivery. No accounts, no card required online — just a straightforward order process."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">
          {STEPS.map((s, i) => (
            <Reveal key={s.num} delay={i * 80}>
              <div className="relative h-full bg-white border border-ink-100 rounded-2xl p-6 hover:shadow-xl hover:shadow-ink-950/8 hover:-translate-y-1 transition-all">
                <div className="flex items-center justify-between">
                  <span className="w-12 h-12 rounded-xl bg-ink-950 text-accent-500 flex items-center justify-center">
                    <s.icon className="w-6 h-6" />
                  </span>
                  <span className="text-5xl font-black text-ink-100">
                    {s.num}
                  </span>
                </div>
                <h2 className="mt-5 text-xl font-extrabold text-ink-950">
                  {s.title}
                </h2>
                <p className="mt-1 text-sm font-semibold text-accent-600">
                  {s.text}
                </p>
                <p className="mt-3 text-sm text-ink-600 leading-relaxed">
                  {s.detail}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-14">
          <div className="bg-accent-600 text-white rounded-2xl px-8 py-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Start your order now
              </h2>
              <p className="mt-1 text-accent-100 text-sm sm:text-base">
                Browse the shop or send us your requirements — we&apos;ll handle
                the rest.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/shop"
                className="px-6 py-3.5 rounded-lg bg-ink-950 text-white font-bold hover:bg-ink-900 transition-colors"
              >
                Browse Products
              </Link>
              <a
                href={waLink(`Hello ${COMPANY.name}, I'd like to place an order.`)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-white text-accent-600 font-bold hover:bg-accent-50 transition-colors"
              >
                <WhatsAppIcon className="w-5 h-5" /> Order on WhatsApp
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </>
  );
}
