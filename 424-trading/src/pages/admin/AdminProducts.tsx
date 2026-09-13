import { useEffect, useMemo, useRef, useState } from "react";
import {
  adminListProducts,
  deleteProduct,
  listCategories,
  saveProduct,
  uid,
  type Category,
  type Product,
} from "../../lib/db";
import { uploadProductImage } from "../../lib/storage";
import { isSupabaseConfigured } from "../../lib/supabaseClient";
import {
  EditIcon,
  PlusIcon,
  SearchIcon,
  TrashIcon,
  UploadIcon,
} from "../../components/Icons";

const inputCls =
  "w-full h-10 rounded-lg border border-ink-200 bg-white px-3 text-sm outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20";

const emptyForm = (categoryId = ""): Product => ({
  id: "",
  category_id: categoryId,
  name: "",
  description: "",
  price: null,
  image_url: "",
  stock: 0,
  available: true,
  featured: false,
  subcategory: "",
  created_at: "",
});

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cats, setCats] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const refresh = () => {
    setLoading(true);
    adminListProducts()
      .then(setProducts)
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    listCategories().then(setCats).catch(() => {});
    refresh();
  }, []);

  const visible = useMemo(() => {
    const s = search.toLowerCase();
    return s
      ? products.filter(
          (p) =>
            p.name.toLowerCase().includes(s) ||
            (p.category_name ?? "").toLowerCase().includes(s) ||
            (p.subcategory ?? "").toLowerCase().includes(s)
        )
      : products;
  }, [products, search]);

  const openNew = () => {
    setError("");
    setForm(emptyForm(cats[0]?.id ?? ""));
  };

  const openEdit = (p: Product) => {
    setError("");
    setForm({ ...p });
  };

  const save = async () => {
    if (!form) return;
    if (!form.name.trim() || !form.category_id) {
      setError("Product name and category are required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const row: Product = {
        ...form,
        id: form.id || uid(),
        created_at: form.created_at || new Date().toISOString(),
        price: null, // all products are priced on request
      };
      await saveProduct(row);
      setForm(null);
      refresh();
    } catch (e: any) {
      setError(e?.message ?? "Could not save product.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (p: Product) => {
    if (!window.confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
    try {
      await deleteProduct(p.id);
      refresh();
    } catch (e: any) {
      window.alert(e?.message ?? "Could not delete product.");
    }
  };

  const onFile = async (file: File | null) => {
    if (!file || !form) return;
    setUploading(true);
    try {
      const url = await uploadProductImage(file);
      setForm((f) => (f ? { ...f, image_url: url } : f));
    } catch (e: any) {
      window.alert(e?.message ?? "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-ink-950">Products</h1>
          <p className="mt-1 text-sm text-ink-500">
            Add, edit and remove the products shown in your shop.
          </p>
        </div>
        <button
          onClick={openNew}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent-600 text-white text-sm font-bold hover:bg-accent-700 transition-colors"
        >
          <PlusIcon className="w-4 h-4" /> Add Product
        </button>
      </div>

      <div className="relative mt-5 max-w-sm">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products…"
          className="w-full h-10 rounded-lg border border-ink-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-accent-500"
        />
        <SearchIcon className="w-4 h-4 absolute left-3 top-3 text-ink-400" />
      </div>

      <div className="mt-4 bg-white border border-ink-100 rounded-xl overflow-x-auto slim-scroll">
        <table className="w-full text-sm min-w-[720px]">
          <thead>
            <tr className="text-left text-xs font-bold text-ink-500 border-b border-ink-100 bg-ink-50">
              <th className="px-4 py-3">PRODUCT</th>
              <th className="px-4 py-3">CATEGORY</th>
              <th className="px-4 py-3">STOCK</th>
              <th className="px-4 py-3">STATUS</th>
              <th className="px-4 py-3 text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-ink-500">
                  Loading products…
                </td>
              </tr>
            ) : (
              visible.map((p) => (
                <tr key={p.id} className="hover:bg-ink-50/60">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.image_url || "/media/hero.jpg"}
                        alt=""
                        className="w-10 h-10 rounded-lg object-cover bg-ink-100"
                      />
                      <div>
                        <p className="font-bold text-ink-900">{p.name}</p>
                        <p className="text-xs text-ink-500">{p.subcategory}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-ink-600">{p.category_name}</td>
                  <td className="px-4 py-3 text-ink-600">{p.stock}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-[11px] font-bold ${
                        p.available
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-ink-100 text-ink-500"
                      }`}
                    >
                      {p.available ? "AVAILABLE" : "HIDDEN"}
                    </span>
                    {p.featured && (
                      <span className="ml-1 px-2 py-1 rounded-full text-[11px] font-bold bg-accent-50 text-accent-600">
                        ★
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button
                      onClick={() => openEdit(p)}
                      className="p-2 rounded-lg text-ink-500 hover:text-ink-950 hover:bg-ink-100"
                      aria-label={`Edit ${p.name}`}
                    >
                      <EditIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => remove(p)}
                      className="p-2 rounded-lg text-ink-500 hover:text-red-600 hover:bg-red-50"
                      aria-label={`Delete ${p.name}`}
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit / create modal */}
      {form && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-ink-950/60 animate-fade-in"
            onClick={() => setForm(null)}
          />
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto slim-scroll bg-white rounded-2xl p-6 sm:p-8 animate-fade-up">
            <h2 className="text-xl font-extrabold text-ink-950">
              {form.id ? "Edit Product" : "Add Product"}
            </h2>

            <div className="mt-5 grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-ink-600 mb-1.5">
                  PRODUCT NAME *
                </label>
                <input
                  className={inputCls}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. LED Floodlight 100W IP66"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-ink-600 mb-1.5">
                  CATEGORY *
                </label>
                <select
                  className={inputCls}
                  value={form.category_id}
                  onChange={(e) =>
                    setForm({ ...form, category_id: e.target.value })
                  }
                >
                  {cats.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-ink-600 mb-1.5">
                  PRODUCT LINE / SUBCATEGORY
                </label>
                <input
                  className={inputCls}
                  value={form.subcategory}
                  onChange={(e) =>
                    setForm({ ...form, subcategory: e.target.value })
                  }
                  placeholder="e.g. Floodlights"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-ink-600 mb-1.5">
                  DESCRIPTION
                </label>
                <textarea
                  className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm outline-none focus:border-accent-500 min-h-24"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-ink-600 mb-1.5">
                  STOCK
                </label>
                <input
                  type="number"
                  min="0"
                  className={inputCls}
                  value={form.stock}
                  onChange={(e) =>
                    setForm({ ...form, stock: Number(e.target.value) || 0 })
                  }
                />
                <div className="mt-2 flex gap-4">
                  <label className="flex items-center gap-2 text-xs font-semibold text-ink-600">
                    <input
                      type="checkbox"
                      checked={form.available}
                      onChange={(e) =>
                        setForm({ ...form, available: e.target.checked })
                      }
                      className="accent-accent-600"
                    />
                    Available
                  </label>
                  <label className="flex items-center gap-2 text-xs font-semibold text-ink-600">
                    <input
                      type="checkbox"
                      checked={form.featured}
                      onChange={(e) =>
                        setForm({ ...form, featured: e.target.checked })
                      }
                      className="accent-accent-600"
                    />
                    Featured
                  </label>
                </div>
              </div>

              {/* Image */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-ink-600 mb-1.5">
                  PRODUCT IMAGE
                </label>
                <div className="flex items-center gap-4">
                  <img
                    src={form.image_url || "/media/hero.jpg"}
                    alt=""
                    className="w-20 h-20 rounded-lg object-cover border border-ink-200 bg-ink-50"
                  />
                  <div className="flex-1 space-y-2">
                    {isSupabaseConfigured && (
                      <button
                        type="button"
                        onClick={() => fileRef.current?.click()}
                        disabled={uploading}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-ink-950 text-white text-xs font-bold hover:bg-accent-600 disabled:opacity-60"
                      >
                        <UploadIcon className="w-4 h-4" />
                        {uploading ? "Uploading…" : "Upload image"}
                      </button>
                    )}
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => onFile(e.target.files?.[0] ?? null)}
                    />
                    <input
                      className={inputCls}
                      value={form.image_url.startsWith("http") || form.image_url.startsWith("/") ? form.image_url : ""}
                      onChange={(e) =>
                        setForm({ ...form, image_url: e.target.value })
                      }
                      placeholder="…or paste an image URL"
                    />
                    {!isSupabaseConfigured && (
                      <p className="text-[11px] text-ink-500">
                        Image upload to Supabase Storage becomes available once
                        connected. You can paste any image URL meanwhile.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <p className="mt-4 text-sm font-semibold text-red-600">{error}</p>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setForm(null)}
                className="px-5 py-2.5 rounded-lg border-2 border-ink-200 text-sm font-bold text-ink-600 hover:border-ink-950"
              >
                Cancel
              </button>
              <button
                onClick={save}
                disabled={saving}
                className="px-6 py-2.5 rounded-lg bg-accent-600 text-white text-sm font-bold hover:bg-accent-700 disabled:opacity-60"
              >
                {saving ? "Saving…" : "Save Product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
