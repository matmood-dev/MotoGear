import { Link } from "react-router-dom";
import { money } from "../data/products";
import { useStore } from "../context/StoreContext";
import { handleImgError } from "./ui";

export default function CartDrawer() {
  const { cart, cartOpen, setCartOpen, updateQty, removeItem, subtotal } = useStore();
  if (!cartOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/70" onClick={() => setCartOpen(false)} />
      <aside className="animate-slide-in-right absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-zinc-900 shadow-2xl">
        <div className="flex items-center justify-between border-b border-zinc-800 p-4">
          <h2 className="font-black uppercase text-white">Your cart ({cart.reduce((s, i) => s + i.qty, 0)})</h2>
          <button onClick={() => setCartOpen(false)} className="rounded p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white" aria-label="Close cart">✕</button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {cart.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-5xl">🏍️</p>
              <p className="mt-3 font-bold text-white">Cart's running on empty</p>
              <p className="text-sm text-zinc-400">Gear up — your next ride deserves better.</p>
              <button onClick={() => setCartOpen(false)} className="mt-4 rounded-md bg-orange-600 px-5 py-2 text-sm font-bold text-white hover:bg-orange-500">
                <Link to="/shop">Browse gear</Link>
              </button>
            </div>
          ) : (
            <ul className="grid gap-3">
              {cart.map((i) => (
                <li key={i.key} className="flex gap-3 rounded-lg border border-zinc-800 bg-zinc-950 p-2.5">
                  <img src={i.product.images[0]} onError={(e) => handleImgError(e, i.product.name)} alt={i.product.name} className="h-20 w-20 rounded-md object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-white">{i.product.name}</p>
                    <p className="text-xs text-zinc-500">{i.size} · {i.color}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateQty(i.key, i.qty - 1)} className="grid h-7 w-7 place-items-center rounded bg-zinc-800 text-white hover:bg-zinc-700">−</button>
                        <span className="w-6 text-center text-sm font-bold text-white">{i.qty}</span>
                        <button onClick={() => updateQty(i.key, i.qty + 1)} className="grid h-7 w-7 place-items-center rounded bg-zinc-800 text-white hover:bg-zinc-700">+</button>
                      </div>
                      <span className="text-sm font-extrabold text-white">{money(i.product.price * i.qty)}</span>
                    </div>
                  </div>
                  <button onClick={() => removeItem(i.key)} className="self-start rounded p-1 text-zinc-500 hover:text-red-400" aria-label="Remove item">✕</button>
                </li>
              ))}
            </ul>
          )}
        </div>
        {cart.length > 0 && (
          <div className="border-t border-zinc-800 p-4">
            <div className="mb-3 flex justify-between text-sm"><span className="text-zinc-400">Subtotal</span><span className="font-extrabold text-white">{money(subtotal)}</span></div>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => setCartOpen(false)} className="rounded-md border border-zinc-700 py-2.5 text-sm font-bold text-white hover:bg-zinc-800"><Link to="/cart" className="block">View cart</Link></button>
              <button onClick={() => setCartOpen(false)} className="rounded-md bg-orange-600 py-2.5 text-sm font-bold text-white hover:bg-orange-500"><Link to="/checkout" className="block">Checkout</Link></button>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
