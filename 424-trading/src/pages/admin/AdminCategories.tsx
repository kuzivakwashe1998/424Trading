import { useEffect, useRef, useState } from "react";
import {
  deleteCategory,
  listCategories,
  saveCategory,
  uid,
  type Category,
} from "../../lib/db";
import { uploadCategoryImage } from "../../lib/storage";
import { isSupabaseConfigured } from "../../lib/supabaseClient";
import { EditIcon, PlusIcon, TrashIcon, UploadIcon } from "../../components/Icons";

const inputCls =
  "w-full h-10 rounded-lg border border-ink-200 bg-white px-3 text-sm outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20";

export default function AdminCategories() {
  const [cats, setCats] = useState<Category[]>([]);
  const [form, setForm] = useState<Category | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const refresh = () =>
    listCategories().then(setCats).catch(() => {});

  useEffect(() => {
    refresh();
  }, []);

  const save = async () => {
    if (!form) return;
    if (!form.name.trim()) {
      setError("Category name is required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await saveCategory({
        ...form,
        id: form.id || `cat-${uid().slice(0, 8)}`,
        created_at: form.created_at || new Date().toISOString(),
      });
      setForm(null);
      refresh();
    } catch (e: any) {
      setError(e?.message ?? "Could not save category.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (c: Category) => {
    if (!window.confirm(`Delete category "${c.name}"?`)) return;
    try {
      await deleteCategory(c.id);
      refresh();
    } catch (e: any) {
      window.alert(e?.message ?? "Could not delete category.");
    }
  };

  const onFile = async (file: File | null) => {
    if (!file || !form) return;
    setUploading(true);
    try {
      const url = await uploadCategoryImage(file);
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
          <h1 className="text-2xl font-extrabold text-ink-950">Categories</h1>
          <p className="mt-1 text-sm text-ink-500">
            The product ranges shown across the website.
          </p>
        </div>
        <button
          onClick={() => {
            setError("");
            setForm({ id: "", name: "", description: "", image_url: "", created_at: "" });
          }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent-600 text-white text-sm font-bold hover:bg-accent-700"
        >
          <PlusIcon className="w-4 h-4" /> Add Category
        </button>
      </div>

      <div className="mt-6 grid sm:grid-cols-2 gap-4">
        {cats.map((c) => (
          <div
            key={c.id}
            className="bg-white border border-ink-100 rounded-xl p-4 flex items-center gap-4"
          >
            <img
              src={c.image_url}
              alt=""
              className="w-16 h-16 rounded-lg object-cover bg-ink-100"
            />
            <div className="flex-1 min-w-0">
              <p className="font-extrabold text-ink-950">{c.name}</p>
              <p className="text-xs text-ink-500 line-clamp-2">{c.description}</p>
            </div>
            <div className="flex flex-col gap-1">
              <button
                onClick={() => {
                  setError("");
                  setForm({ ...c });
                }}
                className="p-2 rounded-lg text-ink-500 hover:text-ink-950 hover:bg-ink-100"
                aria-label={`Edit ${c.name}`}
              >
                <EditIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => remove(c)}
                className="p-2 rounded-lg text-ink-500 hover:text-red-600 hover:bg-red-50"
                aria-label={`Delete ${c.name}`}
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {form && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-ink-950/60 animate-fade-in"
            onClick={() => setForm(null)}
          />
          <div className="relative w-full max-w-lg bg-white rounded-2xl p-6 sm:p-8 animate-fade-up">
            <h2 className="text-xl font-extrabold text-ink-950">
              {form.id ? "Edit Category" : "Add Category"}
            </h2>
            <div className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-ink-600 mb-1.5">
                  NAME *
                </label>
                <input
                  className={inputCls}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Electrical Products"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-ink-600 mb-1.5">
                  DESCRIPTION
                </label>
                <textarea
                  className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm outline-none focus:border-accent-500 min-h-20"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-ink-600 mb-1.5">
                  IMAGE
                </label>
                <div className="flex items-center gap-4">
                  <img
                    src={form.image_url || "/media/hero.jpg"}
                    alt=""
                    className="w-16 h-16 rounded-lg object-cover border border-ink-200 bg-ink-50"
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
                      value={form.image_url}
                      onChange={(e) =>
                        setForm({ ...form, image_url: e.target.value })
                      }
                      placeholder="…or paste an image URL"
                    />
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
                {saving ? "Saving…" : "Save Category"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
