import { Link } from "react-router-dom";
import { categoryLabel, money } from "../data/products";
import { useStore } from "../context/StoreContext";
import { Price, Stars, handleImgError } from "./ui";

export default function ProductCard({ product, layout = "grid" }) {
  const { addToCart, wishlist, toggleWishlist } = useStore();
  const wished = wishlist.includes(product.id);
  const out = product.stock === 0;

  if (layout === "list") {
    return (
      <div className="flex gap-4 rounded-xl border border-zinc-800 bg-zinc-900 p-3 transition-colors hover:border-zinc-600">
        <Link to={`/product/${product.id}`} className="h-32 w-36 shrink-0 overflow-hidden rounded-lg bg-zinc-800 sm:h-40 sm:w-52">
          <img src={product.images[0]} onError={(e) => handleImgError(e, product.name)} alt={product.name} className="h-full w-full object-cover transition-transform duration-300 hover:scale-105" loading="lazy" />
        </Link>
        <div className="flex min-w-0 flex-1 flex-col">
          <p className="text-[11px] font-bold uppercase tracking-widest text-orange-500">{categoryLabel(product.category)} · {product.brand}</p>
          <Link to={`/product/${product.id}`} className="truncate font-bold text-white hover:text-orange-400">{product.name}</Link>
          <span className="mt-1"><Stars value={product.rating} /></span>
          <p className="mt-1 hidden text-sm text-zinc-400 sm:line-clamp-2">{product.description}</p>
          <div className="mt-auto flex items-center justify-between pt-2">
            <Price product={product} />
            <button disabled={out} onClick={() => addToCart(product.id)} className="rounded-md bg-orange-600 px-4 py-2 text-sm font-bold text-white hover:bg-orange-500 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400">
              {out ? "Sold out" : "Add to cart"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 transition-all hover:-translate-y-1 hover:border-zinc-600 hover:shadow-xl hover:shadow-black/50">
      <div className="relative aspect-[4/3] overflow-hidden bg-zinc-800">
        <Link to={`/product/${product.id}`}>
          <img src={product.images[0]} onError={(e) => handleImgError(e, product.name)} alt={product.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
        </Link>
        {product.compareAt && <span className="absolute left-2 top-2 rounded bg-red-600 px-2 py-0.5 text-[11px] font-bold text-white">-{Math.round((1 - product.price / product.compareAt) * 100)}%</span>}
        {product.isNew && <span className="absolute left-2 top-2 mt-7 rounded bg-emerald-600 px-2 py-0.5 text-[11px] font-bold text-white">NEW</span>}
        {out && <span className="absolute inset-x-0 bottom-0 bg-black/70 py-1 text-center text-xs font-bold uppercase tracking-widest text-red-400">Out of stock</span>}
        <button onClick={() => toggleWishlist(product.id)} aria-label="Toggle wishlist" className={`absolute right-2 top-2 grid h-9 w-9 place-items-center rounded-full ${wished ? "bg-orange-600 text-white" : "bg-black/60 text-zinc-200 hover:bg-black/80"}`}>
          <svg viewBox="0 0 24 24" className={`h-5 w-5 ${wished ? "fill-current" : "fill-none stroke-current stroke-2"}`}><path d="M12 21C7 16.5 3 13 3 8.8 3 6 5.2 4 7.8 4c1.7 0 3.2.9 4.2 2.3C13 4.9 14.5 4 16.2 4 18.8 4 21 6 21 8.8c0 4.2-4 7.7-9 12.2z" /></svg>
        </button>
      </div>
      <div className="p-4">
        <p className="text-[11px] font-bold uppercase tracking-widest text-orange-500">{categoryLabel(product.category)} · {product.brand}</p>
        <Link to={`/product/${product.id}`} className="mt-0.5 block truncate font-bold text-white hover:text-orange-400">{product.name}</Link>
        <div className="mt-1 flex items-center gap-2">
          <Stars value={product.rating} />
          <span className="text-xs text-zinc-500">({product.reviewsCount})</span>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-lg font-extrabold text-white">{money(product.price)}</span>
          <button disabled={out} onClick={() => addToCart(product.id)} className="rounded-md bg-orange-600 px-3 py-1.5 text-sm font-bold text-white transition-colors hover:bg-orange-500 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400">
            {out ? "Sold out" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}
