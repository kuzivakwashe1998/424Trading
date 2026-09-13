import { useState } from "react";
import PageBand from "../components/PageBand";
import Reveal from "../components/Reveal";
import { COMPANY, waLink } from "../lib/config";
import { submitQuote } from "../lib/db";
import {
  CheckIcon,
  MailIcon,
  PhoneIcon,
  PinIcon,
  WhatsAppIcon,
} from "../components/Icons";

const inputCls =
  "w-full h-11 rounded-lg border border-ink-200 bg-white px-4 text-sm outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 transition";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  const set =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      // Messages arrive in the admin dashboard as quote requests.
      await submitQuote({
        customer_name: form.name,
        company: "",
        email: form.email,
        phone: "",
        product: "General enquiry",
        quantity: "",
        requirements: form.message,
        delivery_location: "",
      });
      setDone(true);
    } catch {
      // Fall back to opening the user's mail app.
      window.location.href = `mailto:${COMPANY.email}?subject=Enquiry from ${encodeURIComponent(
        form.name
      )}&body=${encodeURIComponent(form.message)}`;
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <PageBand
        crumb="CONTACT"
        title="Contact Us"
        intro="Reach the 424 TRADING team on WhatsApp, phone or email — or send a message and we'll get back to you within one business day."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20 grid lg:grid-cols-[380px_1fr] gap-8 items-start">
        <div className="space-y-4">
          {[
            {
              icon: PinIcon,
              title: "Visit us",
              lines: [COMPANY.location, "Mon–Sat · 8:00–17:00"],
            },
            {
              icon: PhoneIcon,
              title: "Call us",
              lines: [COMPANY.phone],
              href: `tel:${COMPANY.phoneRaw}`,
            },
            {
              icon: MailIcon,
              title: "Email us",
              lines: [COMPANY.email],
              href: `mailto:${COMPANY.email}`,
            },
          ].map((c) => (
            <Reveal key={c.title}>
              <div className="flex items-start gap-4 bg-white border border-ink-100 rounded-xl p-5">
                <span className="w-11 h-11 rounded-xl bg-ink-950 text-accent-500 flex items-center justify-center shrink-0">
                  <c.icon className="w-5 h-5" />
                </span>
                <div>
                  <p className="font-extrabold text-ink-950">{c.title}</p>
                  {c.lines.map((l) =>
                    c.href ? (
                      <a
                        key={l}
                        href={c.href}
                        className="block text-sm text-ink-600 hover:text-accent-700 transition-colors"
                      >
                        {l}
                      </a>
                    ) : (
                      <p key={l} className="text-sm text-ink-600">
                        {l}
                      </p>
                    )
                  )}
                </div>
              </div>
            </Reveal>
          ))}

          <Reveal delay={100}>
            <a
              href={waLink(`Hello ${COMPANY.name}, I have an enquiry.`)}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2.5 w-full px-6 py-4 rounded-xl bg-[#25D366] text-white font-bold hover:brightness-110 transition"
            >
              <WhatsAppIcon className="w-5 h-5" />
              Chat on WhatsApp — {COMPANY.phone}
            </a>
          </Reveal>
        </div>

        <Reveal delay={80}>
          <form
            onSubmit={submit}
            className="bg-white border border-ink-100 rounded-2xl p-6 sm:p-8"
          >
            <h2 className="text-xl font-extrabold text-ink-950">
              Send us a message
            </h2>
            {done ? (
              <div className="mt-6 bg-emerald-50 border border-emerald-200 rounded-xl p-5 text-emerald-800 text-sm flex items-start gap-3">
                <CheckIcon className="w-5 h-5 shrink-0" />
                Thank you — your message has been received. We&apos;ll respond
                within one business day.
              </div>
            ) : (
              <div className="mt-5 grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-ink-600 mb-1.5">
                    YOUR NAME *
                  </label>
                  <input className={inputCls} value={form.name} onChange={set("name")} required placeholder="Full name" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-ink-600 mb-1.5">
                    EMAIL *
                  </label>
                  <input type="email" className={inputCls} value={form.email} onChange={set("email")} required placeholder="you@company.co.zw" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-ink-600 mb-1.5">
                    MESSAGE *
                  </label>
                  <textarea
                    className="w-full rounded-lg border border-ink-200 bg-white px-4 py-3 text-sm outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 transition min-h-40"
                    value={form.message}
                    onChange={set("message")}
                    required
                    placeholder="How can we help?"
                  />
                </div>
                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    disabled={sending}
                    className="px-8 py-3.5 rounded-lg bg-ink-950 text-white font-bold hover:bg-accent-600 transition-colors disabled:opacity-60"
                  >
                    {sending ? "Sending…" : "Send Message"}
                  </button>
                </div>
              </div>
            )}
          </form>
        </Reveal>
      </div>
    </>
  );
}
