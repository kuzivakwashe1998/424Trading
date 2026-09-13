import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-24 text-center">
      <p className="text-7xl font-black text-ink-100 select-none">404</p>
      <h1 className="mt-2 text-3xl font-extrabold text-ink-950">
        Page not found
      </h1>
      <p className="mt-3 text-ink-600">
        The page you are looking for doesn&apos;t exist or has moved.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Link
          to="/"
          className="px-6 py-3 rounded-lg bg-ink-950 text-white font-bold hover:bg-accent-600 transition-colors"
        >
          Back to Home
        </Link>
        <Link
          to="/shop"
          className="px-6 py-3 rounded-lg border-2 border-ink-200 font-bold text-ink-700 hover:border-ink-950 hover:text-ink-950 transition-colors"
        >
          Shop Products
        </Link>
      </div>
    </div>
  );
}
