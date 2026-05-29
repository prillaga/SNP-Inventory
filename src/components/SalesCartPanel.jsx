import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { usePosStore } from "../store/usePosStore";
import { formatPHP } from "../utils/format";

export default function SalesCartPanel() {
  const cart = usePosStore((state) => state.cart);
  const updateCartQty = usePosStore((state) => state.updateCartQty);
  const checkout = usePosStore((state) => state.checkout);
  const subtotal = usePosStore((state) =>
    state.cart.reduce((sum, item) => sum + item.price * item.qty, 0)
  );

  const handleCheckout = () => {
    const success = checkout();
    if (!success) {
      alert("Cart is empty. Add products before checkout.");
    }
  };

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-card sm:p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-[Poppins] text-base font-semibold text-slate-800">Current Sale</h3>
          <p className="text-sm text-slate-500">{cart.length} item types in cart</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-accent">
          <ShoppingBag size={18} />
        </div>
      </div>

      <ul className="max-h-72 space-y-3 overflow-y-auto pr-1 scrollbar-thin">
        {cart.length === 0 && (
          <li className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
            No items yet. Click Add on a product to start a sale.
          </li>
        )}
        {cart.map((item) => (
          <li
            key={item.productId}
            className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/80 p-3"
          >
            <img src={item.image} alt={item.name} className="h-12 w-12 rounded-lg object-cover" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-800">{item.name}</p>
              <p className="text-xs text-slate-500">{formatPHP(item.price)} each</p>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => updateCartQty(item.productId, -1)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                aria-label="Decrease quantity"
              >
                <Minus size={14} />
              </button>
              <span className="w-6 text-center text-sm font-semibold text-slate-800">{item.qty}</span>
              <button
                type="button"
                onClick={() => updateCartQty(item.productId, 1)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                aria-label="Increase quantity"
              >
                <Plus size={14} />
              </button>
            </div>
            <button
              type="button"
              onClick={() => updateCartQty(item.productId, -item.qty)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-red-500 hover:bg-red-50"
              aria-label="Remove item"
            >
              <Trash2 size={14} />
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-4 space-y-2 border-t border-slate-100 pt-4">
        <div className="flex items-center justify-between text-sm text-slate-600">
          <span>Subtotal</span>
          <span className="font-medium text-slate-800">{formatPHP(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-[Poppins] text-base font-semibold text-slate-800">Total</span>
          <span className="font-[Poppins] text-xl font-bold text-accent">{formatPHP(subtotal)}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleCheckout}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:bg-blue-700"
      >
        Checkout
      </button>
    </section>
  );
}
