import { Link } from "react-router-dom";
import { money } from "../data/products";
import { useStore } from "../context/StoreContext";
import { Breadcrumbs, handleImgError } from "../components/ui";

export default function Cart() {
  const { cart, updateQty, removeItem, subtotal, tax, shipping, total } = useStore();

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="text-6xl">🏍️</p>
        <h1 className="mt-4 text-2xl font-black uppercase text-white">Your cart is empty</h1>
        <Link to="/shop" className="mt-5 inline-block rounded-md bg-orange-600 px-8 py-3 text-sm font-black uppercase text-white hover:bg-orange-500">Shop gear</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <Breadcrumbs trail={[{ label: "Cart" }]} />
      <h1 className="mt-2 text-3xl font-black uppercase text-white">Shopping cart</h1>
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <ul className="grid content-start gap-3 lg:col-span-2">
          {cart.map((i) => (
            <li key={i.key} className="flex gap-4 rounded-xl border border-zinc-800 bg-zinc-900 p-3">
              <Link to={`/product/${i.productId}`} className="h-24 w-28 shrink-0 overflow-hidden rounded-lg bg-zinc-800 sm:h-28 sm:w-36">
                <img src={i.product.images[0]} onError={(e) => handleImgError(e, i.product.name)} alt={i.product.name} className="h-full w-full object-cover" />
              </Link>
              <div className="min-w-0 flex-1">
                <Link to={`/product/${i.productId}`} className="font-bold text-white hover:text-orange-400">{i.product.name}</Link>
                <p className="text-xs text-zinc-500">{i.product.brand} · {i.size} · {i.color}</p>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQty(i.key, i.qty - 1)} className="grid h-8 w-8 place-items-center rounded bg-zinc-800 text-white hover:bg-zinc-700">−</button>
                    <span className="w-6 text-center font-bold text-white">{i.qty}</span>
                    <button onClick={() => updateQty(i.key, i.qty + 1)} className="grid h-8 w-8 place-items-center rounded bg-zinc-800 text-white hover:bg-zinc-700">+</button>
                    <button onClick={() => removeItem(i.key)} className="ml-2 text-xs font-semibold text-red-400 hover:text-red-300">Remove</button>
                  </div>
                  <span className="font-extrabold text-white">{money(i.product.price * i.qty)}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <div className="h-fit rounded-xl border border-zinc-800 bg-zinc-900 p-5 lg:sticky lg:top-32">
          <h2 className="font-black uppercase text-white">Summary</h2>
          <dl className="mt-3 grid gap-2 text-sm">
            <div className="flex justify-between"><dt className="text-zinc-400">Subtotal</dt><dd className="font-bold text-white">{money(subtotal)}</dd></div>
            <div className="flex justify-between"><dt className="text-zinc-400">Est. tax (8%)</dt><dd className="font-bold text-white">{money(tax)}</dd></div>
            <div className="flex justify-between"><dt className="text-zinc-400">Shipping</dt><dd className="font-bold text-white">{shipping === 0 ? "FREE" : money(shipping)}</dd></div>
            <div className="flex justify-between border-t border-zinc-800 pt-2 text-base"><dt className="font-bold text-white">Total</dt><dd className="font-black text-orange-500">{money(total)}</dd></div>
          </dl>
          {shipping > 0 && <p className="mt-2 text-xs text-zinc-500">Add {money(150 - subtotal)} more for free shipping.</p>}
          <Link to="/checkout" className="mt-4 block rounded-md bg-orange-600 py-3 text-center text-sm font-black uppercase text-white hover:bg-orange-500">Proceed to checkout</Link>
          <Link to="/shop" className="mt-2 block rounded-md border border-zinc-700 py-3 text-center text-sm font-bold text-white hover:bg-zinc-800">Continue shopping</Link>
        </div>
      </div>
    </div>
  );
}
