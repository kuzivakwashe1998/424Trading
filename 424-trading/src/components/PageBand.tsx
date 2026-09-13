import { Link } from "react-router-dom";

/** Consistent page-title band used on inner pages. */
export default function PageBand({
  title,
  intro,
  crumb,
}: {
  title: string;
  intro?: string;
  crumb?: string;
}) {
  return (
    <section className="bg-ink-950 text-white relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, #fff 0 2px, transparent 2px 22px)",
        }}
      />
      <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-accent-600/20 blur-3xl" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-16">
        <p className="text-[11px] font-bold tracking-[0.2em] text-accent-500">
          <Link to="/" className="hover:text-accent-400">
            HOME
          </Link>
          {crumb && <span className="text-ink-500"> / {crumb.toUpperCase()}</span>}
        </p>
        <h1 className="mt-3 text-3xl sm:text-5xl font-extrabold tracking-tight">
          {title}
        </h1>
        {intro && (
          <p className="mt-4 max-w-2xl text-ink-300 text-sm sm:text-base leading-relaxed">
            {intro}
          </p>
        )}
      </div>
    </section>
  );
}
