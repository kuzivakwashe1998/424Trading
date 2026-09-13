import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { isSupabaseConfigured } from "../lib/supabaseClient";
import { listCategories } from "../lib/db";

/**
 * Top-of-site notices:
 *  - demo mode (no Supabase credentials) -> sample-data banner
 *  - Supabase connected but catalogue empty -> seed banner
 */
export default function StoreNotice() {
  const [emptyCatalog, setEmptyCatalog] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    listCategories()
      .then((c) => setEmptyCatalog(c.length === 0))
      .catch(() => {});
  }, []);

  if (!isSupabaseConfigured) {
    return (
      <div className="bg-accent-600 text-white text-xs sm:text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex items-center justify-center gap-2 text-center">
          <span className="font-semibold">
            Demo mode — showing sample catalogue.
          </span>
          <Link
            to="/admin/setup"
            className="underline font-bold hover:text-accent-100"
          >
            Connect Supabase →
          </Link>
        </div>
      </div>
    );
  }

  if (!emptyCatalog) return null;

  return (
    <div className="bg-accent-600 text-white text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex items-center justify-center gap-2 text-center">
        <span className="font-semibold">
          Supabase is connected but your catalogue is empty.
        </span>
        <Link to="/admin/setup" className="underline font-bold hover:text-accent-100">
          Load the starter catalogue in Admin → Setup →
        </Link>
      </div>
    </div>
  );
}
