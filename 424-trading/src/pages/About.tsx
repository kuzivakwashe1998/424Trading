import { Link } from "react-router-dom";
import PageBand from "../components/PageBand";
import Reveal from "../components/Reveal";
import { COMPANY, waLink } from "../lib/config";
import {
  ArrowRightIcon,
  BoltIcon,
  CheckIcon,
  ShieldIcon,
  TagIcon,
  TruckIcon,
  WhatsAppIcon,
} from "../components/Icons";

export default function About() {
  return (
    <>
      <PageBand
        crumb="ABOUT US"
        title="About 424 TRADING"
        intro="A Harare-based supply company built on one promise: quality products, conveniently sourced."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <Reveal>
            <p className="text-xs font-bold tracking-[0.2em] text-accent-600">
              WHO WE ARE
            </p>
            <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-ink-950">
              One supplier. Five ranges. Zero hassle.
            </h2>
            <div className="mt-5 space-y-4 text-ink-600 leading-relaxed">
              <p>
                424 TRADING is a Zimbabwean trading company headquartered in
                Harare. We supply quality products across electrical, lighting,
                automotive, marble &amp; stone and fuel &amp; oil lubricants —
                the everyday essentials that keep businesses, sites and homes
                running.
              </p>
              <p>
                Our model is simple: we do the sourcing, verification and
                logistics so you don&apos;t have to. Whether you need a single
                VSD drive, a truckload of tyres, or granite slabs cut to
                measure, you deal with one team from enquiry to delivery.
              </p>
              <p>
                We work with contractors, retailers, farmers, manufacturers and
                households across Zimbabwe — and we price in clear, honest USD
                terms. Where a product needs project pricing, we quote fast.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-ink-950 text-white font-bold hover:bg-accent-600 transition-colors"
              >
                Shop Products <ArrowRightIcon className="w-4 h-4" />
              </Link>
              <a
                href={waLink(`Hello ${COMPANY.name}, I'd like to know more about your company.`)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-[#25D366] text-white font-bold hover:brightness-110 transition"
              >
                <WhatsAppIcon className="w-5 h-5" /> Talk to us
              </a>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="rounded-2xl overflow-hidden border border-ink-100">
              <img
                src="/media/hero.jpg"
                alt="424 TRADING warehouse"
                className="w-full aspect-[16/10] object-cover"
              />
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4">
              {[
                [ShieldIcon, "Quality first", "Reputable brands and verified stock only."],
                [TagIcon, "Honest pricing", "Clear USD pricing, fast quotes."],
                [BoltIcon, "Quick response", "WhatsApp-first support, Harare based."],
                [TruckIcon, "Flexible fulfilment", "Delivery or collection, your choice."],
              ].map(([Icon, title, text]: any, i) => (
                <div
                  key={title}
                  className="bg-ink-50 border border-ink-100 rounded-xl p-5"
                >
                  <Icon className="w-6 h-6 text-accent-600" />
                  <p className="mt-3 font-extrabold text-ink-950 text-sm">
                    {title}
                  </p>
                  <p className="mt-1 text-xs text-ink-500 leading-relaxed">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Mission strip */}
        <Reveal className="mt-16">
          <div className="bg-ink-950 text-white rounded-2xl px-8 py-10 sm:px-12 grid md:grid-cols-3 gap-8">
            <div>
              <p className="text-xs font-bold tracking-[0.2em] text-accent-500">
                OUR MISSION
              </p>
              <p className="mt-3 text-sm text-ink-300 leading-relaxed">
                To make quality products conveniently available to every
                Zimbabwean business — with honest advice, fair prices and
                dependable fulfilment.
              </p>
            </div>
            <div>
              <p className="text-xs font-bold tracking-[0.2em] text-accent-500">
                WHAT WE STAND FOR
              </p>
              <ul className="mt-3 space-y-2 text-sm text-ink-300">
                {["Quality products, verified", "Straightforward communication", "On-time fulfilment"].map(
                  (t) => (
                    <li key={t} className="flex items-center gap-2">
                      <CheckIcon className="w-3.5 h-3.5 text-accent-500" /> {t}
                    </li>
                  )
                )}
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold tracking-[0.2em] text-accent-500">
                FIND US
              </p>
              <p className="mt-3 text-sm text-ink-300 leading-relaxed">
                {COMPANY.location}
                <br />
                {COMPANY.phone}
                <br />
                {COMPANY.email}
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </>
  );
}
