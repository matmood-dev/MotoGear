import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { PRODUCTS, categoryLabel, getProduct } from "../data/products";
import { useStore } from "../context/StoreContext";
import ProductCard from "../components/ProductCard";
import { Breadcrumbs, Price, Stars, StockBadge, handleImgError } from "../components/ui";

export default function ProductDetails() {
  const { id } = useParams();
  const product = getProduct(id);
  const { addToCart, wishlist, toggleWishlist } = useStore();
  const [imgIdx, setImgIdx] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [size, setSize] = useState(product?.sizes[0]);
  const [color, setColor] = useState(product?.colors[0]);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState("desc");

  const related = useMemo(() => {
    if (!product) return [];
    return PRODUCTS.filter((p) => p.id !== product.id && (p.category === product.category || p.brand === product.brand)).slice(0, 4);
  }, [product]);

  if (!product) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="text-2xl font-black text-white">Product not found</p>
        <Link to="/shop" className="mt-4 inline-block rounded-md bg-orange-600 px-6 py-2.5 text-sm font-bold text-white">Back to shop</Link>
      </div>
    );
  }

  const wished = wishlist.includes(product.id);
  const out = product.stock === 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <Breadcrumbs trail={[{ to: "/shop", label: "Shop" }, { to: `/shop?category=${product.category}`, label: categoryLabel(product.category) }, { label: product.name }]} />

      <div className="mt-4 grid gap-8 lg:grid-cols-2">
        {/* Gallery */}
        <div>
          <div className="relative aspect-[4/3] cursor-zoom-in overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900" onClick={() => setZoom((z) => !z)}>
            <img
              key={imgIdx}
              src={product.images[imgIdx]} onError={(e) => handleImgError(e, product.name)} alt={product.name}
              className={`h-full w-full object-cover transition-transform duration-300 ${zoom ? "scale-150" : "scale-100"}`}
            />
            <span className="absolute bottom-2 right-2 rounded bg-black/70 px-2 py-1 text-[11px] font-semibold text-zinc-300">Click to {zoom ? "unzoom" : "zoom"}</span>
          </div>
          {product.images.length > 1 && (
            <div className="mt-2 flex gap-2">
              {product.images.map((src, i) => (
                <button key={i} onClick={() => { setImgIdx(i); setZoom(false); }} className={`h-20 w-24 overflow-hidden rounded-lg border-2 ${i === imgIdx ? "border-orange-500" : "border-zinc-800"}`}>
                  <img src={src} onError={(e) => handleImgError(e, product.name)} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-500">{categoryLabel(product.category)} · {product.brand}</p>
          <h1 className="mt-1 text-3xl font-black uppercase tracking-tight text-white">{product.name}</h1>
          <div className="mt-2 flex items-center gap-2">
            <Stars value={product.rating} />
            <span className="text-sm text-zinc-400">{product.rating} · {product.reviewsCount} reviews</span>
          </div>
          <div className="mt-3"><Price product={product} large /></div>
          <div className="mt-2"><StockBadge stock={product.stock} /></div>

          <p className="mt-4 text-sm leading-relaxed text-zinc-300">{product.description}</p>

          <div className="mt-5">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-zinc-500">Size — <span className="text-white">{size}</span></p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button key={s} onClick={() => setSize(s)} className={`min-w-11 rounded-md border px-3 py-2 text-sm font-bold ${size === s ? "border-orange-500 bg-orange-600 text-white" : "border-zinc-700 text-zinc-200 hover:border-zinc-500"}`}>{s}</button>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-zinc-500">Color — <span className="text-white">{color}</span></p>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((c) => (
                <button key={c} onClick={() => setColor(c)} className={`rounded-md border px-3 py-2 text-sm font-semibold ${color === c ? "border-orange-500 bg-zinc-800 text-white" : "border-zinc-700 text-zinc-300 hover:border-zinc-500"}`}>{c}</button>
              ))}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-10 w-10 place-items-center rounded-md bg-zinc-800 text-lg text-white hover:bg-zinc-700">−</button>
              <span className="w-8 text-center font-bold text-white">{qty}</span>
              <button onClick={() => setQty((q) => Math.min(10, q + 1))} className="grid h-10 w-10 place-items-center rounded-md bg-zinc-800 text-lg text-white hover:bg-zinc-700">+</button>
            </div>
            <button disabled={out} onClick={() => addToCart(product.id, { size, color, qty })} className="flex-1 rounded-md bg-orange-600 px-6 py-3 text-sm font-black uppercase tracking-wide text-white hover:bg-orange-500 disabled:bg-zinc-700 disabled:text-zinc-400 sm:flex-none sm:px-10">
              {out ? "Out of stock" : "Add to cart"}
            </button>
            <button onClick={() => toggleWishlist(product.id)} className={`rounded-md border px-4 py-3 text-sm font-bold ${wished ? "border-orange-500 bg-orange-600/20 text-orange-400" : "border-zinc-700 text-zinc-200 hover:border-zinc-500"}`}>
              {wished ? "♥ Saved" : "♡ Wishlist"}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-10 rounded-xl border border-zinc-800 bg-zinc-900">
        <div className="flex border-b border-zinc-800">
          {[["desc", "Description & Specs"], ["rev", `Reviews (${product.reviews.length})`]].map(([tid, label]) => (
            <button key={tid} onClick={() => setTab(tid)} className={`px-5 py-3 text-sm font-bold uppercase tracking-wide ${tab === tid ? "border-b-2 border-orange-500 text-white" : "text-zinc-500 hover:text-white"}`}>{label}</button>
          ))}
        </div>
        <div className="p-5">
          {tab === "desc" ? (
            <div className="grid gap-6 md:grid-cols-2">
              <p className="text-sm leading-relaxed text-zinc-300">{product.description}</p>
              <dl className="grid content-start gap-2">
                {Object.entries(product.specs).map(([k, v]) => (
                  <div key={k} className="flex justify-between rounded bg-zinc-950 px-3 py-2 text-sm">
                    <dt className="text-zinc-500">{k}</dt><dd className="font-semibold text-white">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : product.reviews.length === 0 ? (
            <p className="text-sm text-zinc-400">No reviews yet — be the first to review this product.</p>
          ) : (
            <ul className="grid gap-3">
              {product.reviews.map((r, i) => (
                <li key={i} className="rounded-lg bg-zinc-950 p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-white">{r.author}</p>
                    <span className="text-xs text-zinc-500">{r.date}</span>
                  </div>
                  <Stars value={r.rating} className="mt-1" />
                  <p className="mt-1 text-sm text-zinc-300">{r.text}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-10">
          <h2 className="mb-4 text-xl font-black uppercase text-white">Related products</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  );
}
