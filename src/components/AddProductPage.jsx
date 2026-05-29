import { useMemo, useState } from "react";
import { ImagePlus, Loader2, Minus, Pencil, Plus, Trash2 } from "lucide-react";
import ImageLightbox from "./ImageLightbox";
import { usePosStore } from "../store/usePosStore";
import { getStockStatus } from "../utils/productStatus";
import { formatPHP } from "../utils/format";

const EMPTY = {
  name: "",
  category: "General",
  description: "",
  costPrice: "",
  sellingPrice: "",
  stockQuantity: "",
  supplier: "",
};

const CATEGORIES = ["General", "Hats", "Bags", "Home", "Tools", "Brooms", "Decor", "Baskets"];

export default function AddProductPage() {
  const products = usePosStore((s) => s.products);
  const saveProduct = usePosStore((s) => s.saveProduct);
  const deleteProduct = usePosStore((s) => s.deleteProduct);
  const adjustStock = usePosStore((s) => s.adjustStock);

  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [preview, setPreview] = useState("");
  const [existingImage, setExistingImage] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [lightbox, setLightbox] = useState(null);

  const resetForm = () => {
    setForm(EMPTY);
    setEditingId(null);
    setPreview("");
    setExistingImage("");
    setError("");
  };

  const loadEdit = (p) => {
    setEditingId(p.id);
    setForm({
      name: p.name || "",
      category: p.category || "General",
      description: p.description || "",
      costPrice: String(p.cost ?? ""),
      sellingPrice: String(p.price ?? ""),
      stockQuantity: String(p.stock ?? ""),
      supplier: p.supplier || "",
    });
    setExistingImage(p.image || "");
    setPreview(p.image || "");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (!selected?.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result);
      setError("");
    };
    reader.readAsDataURL(selected);
  };

  const handleSave = () => {
    if (!form.name.trim()) {
      setError("Product name is required.");
      return;
    }
    if (form.costPrice === "" || Number(form.costPrice) < 0) {
      setError("Cost price is required.");
      return;
    }
    if (form.sellingPrice === "" || Number(form.sellingPrice) < 0) {
      setError("Selling price is required.");
      return;
    }
    if (form.stockQuantity === "" || Number(form.stockQuantity) < 0) {
      setError("Stock quantity is required.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      saveProduct({
        id: editingId || undefined,
        ...form,
        preview: preview || existingImage,
        existingImage,
      });
      resetForm();
    } catch (err) {
      setError(err.message || "Failed to save product.");
    } finally {
      setSaving(false);
    }
  };

  const handleStock = (id, sign) => {
    const amount = Number(prompt(sign > 0 ? "Units to add:" : "Units to deduct:", "1") || 0);
    if (!amount || amount <= 0) return;
    adjustStock(id, sign > 0 ? amount : -amount);
  };

  const sorted = useMemo(() => [...products].sort((a, b) => a.name.localeCompare(b.name)), [products]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-[Poppins] text-2xl font-semibold text-slate-800">Add Product</h1>
        <p className="text-sm text-slate-500">
          Manage inventory — add, edit, update stock, and delete products.
        </p>
      </div>

      <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-card space-y-4">
        <h2 className="font-[Poppins] font-semibold">{editingId ? "Edit Product" : "Add New Product"}</h2>
        {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-medium text-slate-500">Product Name *</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">Product Category *</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">Available Stock *</label>
            <input
              type="number"
              min="0"
              value={form.stockQuantity}
              onChange={(e) => setForm({ ...form, stockQuantity: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">Cost Price *</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.costPrice}
              onChange={(e) => setForm({ ...form, costPrice: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">Selling Price *</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.sellingPrice}
              onChange={(e) => setForm({ ...form, sellingPrice: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-medium text-slate-500">Product Image</label>
            <div className="flex items-center gap-4">
              {preview ? (
                <img src={preview} alt="" className="h-20 w-20 rounded-xl object-cover border" />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-xl border bg-slate-100 text-xs text-slate-400">
                  No image
                </div>
              )}
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-dashed px-4 py-2 text-sm">
                <ImagePlus size={16} /> Upload
                <input type="file" accept="image/*" className="hidden" onChange={onFileChange} />
              </label>
            </div>
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-medium text-slate-500">Description</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 border-t pt-4">
          <button
            type="button"
            disabled={saving}
            onClick={handleSave}
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : null}
            Save Product
          </button>
          <button type="button" onClick={resetForm} className="rounded-xl border px-4 py-2.5 text-sm font-medium">
            Reset Form
          </button>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-card">
        <div className="border-b px-5 py-4">
          <h2 className="font-[Poppins] font-semibold">Inventory Management</h2>
          <p className="text-sm text-slate-500">{products.length} products</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3">Product Name</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((p) => {
                const status = getStockStatus(p.stock);
                return (
                  <tr key={p.id} className="border-t">
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => setLightbox({ src: p.image, alt: p.name })}
                        className="block overflow-hidden rounded-lg border"
                        title="Click to enlarge"
                      >
                        <img
                          src={p.image}
                          alt={p.name}
                          className="h-12 w-12 cursor-zoom-in object-cover transition hover:opacity-80"
                          onError={(e) => {
                            e.currentTarget.src = "assets/logo-new.png";
                          }}
                        />
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium">{p.name}</p>
                      <p className="text-xs text-slate-500">{p.category}</p>
                    </td>
                    <td className="px-4 py-3 font-semibold">{formatPHP(p.price)}</td>
                    <td className="px-4 py-3 font-semibold">{p.stock}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${status.className}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => loadEdit(p)}
                          className="rounded-lg border px-2 py-1 text-accent"
                          title="Edit"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStock(p.id, 1)}
                          className="rounded-lg border px-2 py-1"
                          title="Add stock"
                        >
                          <Plus size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStock(p.id, -1)}
                          className="rounded-lg border px-2 py-1"
                          title="Deduct stock"
                        >
                          <Minus size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm("Delete this product?")) deleteProduct(p.id);
                          }}
                          className="rounded-lg border px-2 py-1 text-red-500"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {!sorted.length && (
            <p className="p-8 text-center text-slate-500">No products yet. Add one above.</p>
          )}
        </div>
      </section>

      {lightbox && (
        <ImageLightbox
          src={lightbox.src}
          alt={lightbox.alt}
          onClose={() => setLightbox(null)}
        />
      )}
    </div>
  );
}
