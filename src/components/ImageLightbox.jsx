import { useEffect } from "react";
import { X } from "lucide-react";

export default function ImageLightbox({ src, alt, onClose }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  if (!src) return null;

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={alt || "Product image preview"}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 z-10 rounded-full bg-white/90 p-2 text-slate-800 shadow-lg hover:bg-white"
        aria-label="Close image"
      >
        <X size={22} />
      </button>
      <img
        src={src}
        alt={alt || "Product"}
        className="max-h-[90vh] max-w-[min(90vw,900px)] rounded-xl object-contain shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      />
      {alt && (
        <p className="absolute bottom-6 left-1/2 max-w-lg -translate-x-1/2 rounded-lg bg-black/60 px-4 py-2 text-center text-sm text-white">
          {alt}
        </p>
      )}
    </div>
  );
}
