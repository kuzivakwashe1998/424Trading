import { useState } from "react";
import { isSupabaseConfigured, SUPABASE_URL } from "../../lib/supabaseClient";
import { seedSupabase } from "../../lib/db";
import { CheckIcon } from "../../components/Icons";

export default function AdminSetup() {
  const [seeding, setSeeding] = useState(false);
  const [result, setResult] = useState("");

  const seed = async () => {
    setSeeding(true);
    setResult("");
    try {
      setResult(await seedSupabase());
    } catch (e: any) {
      setResult(`Error: ${e?.message ?? e}`);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-extrabold text-ink-950">Setup &amp; Supabase</h1>
      <p className="mt-1 text-sm text-ink-500">
        Connect this website to your Supabase project — database and product
        image storage.
      </p>

      <div
        className={`mt-6 rounded-xl border px-5 py-4 text-sm font-semibold ${
          isSupabaseConfigured
            ? "bg-emerald-50 border-emerald-200 text-emerald-800"
            : "bg-accent-50 border-accent-200 text-accent-900"
        }`}
      >
        {isSupabaseConfigured ? (
          <span className="flex items-center gap-2">
            <CheckIcon className="w-4 h-4" /> Connected to {SUPABASE_URL}
          </span>
        ) : (
          "Not connected — the site is running in demo mode with sample data."
        )}
      </div>

      <div className="mt-6 bg-white border border-ink-100 rounded-xl p-6 space-y-5 text-sm text-ink-700 leading-relaxed">
        <div>
          <h2 className="font-extrabold text-ink-950">1. Create the database</h2>
          <p className="mt-1">
            In your Supabase project, open <strong>SQL Editor</strong> and run
            the file <code className="bg-ink-50 px-1.5 py-0.5 rounded font-mono text-xs">supabase/schema.sql</code>{" "}
            (included with this project). It creates the six tables
            (categories, products, customers, orders, order_items,
            quote_requests), the secure <code className="bg-ink-50 px-1.5 py-0.5 rounded font-mono text-xs">submit_order</code>{" "}
            function, the public <code className="bg-ink-50 px-1.5 py-0.5 rounded font-mono text-xs">product-images</code>{" "}
            storage bucket and the access policies.
          </p>
        </div>
        <div>
          <h2 className="font-extrabold text-ink-950">2. Add your credentials</h2>
          <p className="mt-1">
            Copy <code className="bg-ink-50 px-1.5 py-0.5 rounded font-mono text-xs">.env.example</code> to{" "}
            <code className="bg-ink-50 px-1.5 py-0.5 rounded font-mono text-xs">.env</code> and fill in{" "}
            <code className="bg-ink-50 px-1.5 py-0.5 rounded font-mono text-xs">VITE_SUPABASE_URL</code>,{" "}
            <code className="bg-ink-50 px-1.5 py-0.5 rounded font-mono text-xs">VITE_SUPABASE_ANON_KEY</code> and a{" "}
            <code className="bg-ink-50 px-1.5 py-0.5 rounded font-mono text-xs">VITE_ADMIN_PASSWORD</code> of your
            choice, then restart the dev server / redeploy.
          </p>
        </div>
        <div>
          <h2 className="font-extrabold text-ink-950">3. Load starter data (optional)</h2>
          <p className="mt-1">
            Once connected, the button below inserts the sample categories and
            products so your shop is never empty. You can then edit everything
            from the Products and Categories pages.
          </p>
          {isSupabaseConfigured && (
            <button
              onClick={seed}
              disabled={seeding}
              className="mt-3 px-5 py-2.5 rounded-lg bg-ink-950 text-white text-sm font-bold hover:bg-accent-600 disabled:opacity-60"
            >
              {seeding ? "Seeding…" : "Seed database with sample catalogue"}
            </button>
          )}
          {result && (
            <p className="mt-2 font-semibold text-ink-900">{result}</p>
          )}
        </div>
        <div>
          <h2 className="font-extrabold text-ink-950">How images work</h2>
          <p className="mt-1">
            Product and category images uploaded from this dashboard go to the{" "}
            <code className="bg-ink-50 px-1.5 py-0.5 rounded font-mono text-xs">product-images</code> bucket in
            Supabase Storage and are served publicly. You can also paste any
            image URL when editing a product.
          </p>
        </div>
      </div>
    </div>
  );
}
