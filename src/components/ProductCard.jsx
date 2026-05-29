import { useState } from "react";
import { Plus } from "lucide-react";
import { usePosStore, computeAvailableStock } from "../store/usePosStore";
import { formatPHP } from "../utils/format";
import { BRAND } from "../data/mockData";
import { getStockStatus, isLowStock, isOutOfStock } from "../utils/productStatus";
import ImageLightbox from "./ImageLightbox";

export default function ProductCard({ product }) {
  const addToCart = usePosStore((state) => state.addToCart);
  const available = usePosStore((state) => computeAvailableStock(state, product.id));
  const status = getStockStatus(available);
  const outOfStock = isOutOfStock(available);
  const lowStock = isLowStock(available);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState(product.image);

  const handleAdd = () => {
    const success = addToCart(product.id);
    if (!success) {
      alert("Not enough stock for this product.");
    }
  };

  return (
    <article
      className={`group flex flex-col overflow-hidden rounded-2xl border bg-white shadow-card transition hover:-translate-y-0.5 hover:shadow-lg ${
        outOfStock
          ? "border-red-300 ring-2 ring-red-100"
          : lowStock
            ? "border-amber-300 ring-2 ring-amber-100"
            : "border-slate-200/80"
      }`}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <img
          src={imageSrc}
          alt={product.name}
          loading="lazy"
          onError={() => setImageSrc(BRAND.logo)}
          onClick={() => setLightboxOpen(true)}
          className="h-full w-full cursor-zoom-in object-cover transition duration-300 group-hover:scale-105 hover:opacity-90"
          title="Click to enlarge"
        />
        {lightboxOpen && (
          <ImageLightbox
            src={imageSrc}
            alt={product.name}
            onClose={() => setLightboxOpen(false)}
          />
        )}
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-slate-600 backdrop-blur">
          {product.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-[Poppins] text-sm font-semibold text-slate-800 sm:text-base">{product.name}</h3>
          <p className="shrink-0 font-semibold text-accent">{formatPHP(product.price)}</p>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${status.className}`}>
            {status.label}
          </span>
          <span className="text-xs font-medium text-slate-500">
            Stock: {product.stock}
            {available < product.stock && ` · ${available} available`}
          </span>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          disabled={outOfStock}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-600/25 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
        >
          <Plus size={16} />
          Add
        </button>
      </div>
    </article>
  );
}
