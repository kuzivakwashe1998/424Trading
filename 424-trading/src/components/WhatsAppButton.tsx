import { COMPANY, waLink } from "../lib/config";
import { WhatsAppIcon } from "./Icons";

/** Floating WhatsApp enquiry button (bottom-right on every page). */
export default function WhatsAppButton() {
  return (
    <a
      href={waLink(
        `Hello ${COMPANY.name}, I would like to make an enquiry about your products.`
      )}
      target="_blank"
      rel="noreferrer"
      aria-label={`Chat with ${COMPANY.name} on WhatsApp (${COMPANY.phone})`}
      className="fixed bottom-6 right-6 z-40 group"
    >
      <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-40 animate-ping [animation-duration:2.2s]" />
      <span className="relative flex items-center gap-2.5 rounded-full bg-[#25D366] text-white pl-4 pr-5 py-3.5 shadow-xl shadow-[#25D366]/30 group-hover:scale-105 transition-transform">
        <WhatsAppIcon className="w-6 h-6" />
        <span className="hidden sm:block text-sm font-bold leading-none">
          WhatsApp Us
          <span className="block text-[10px] font-medium opacity-90 mt-1">
            {COMPANY.phone}
          </span>
        </span>
      </span>
    </a>
  );
}
