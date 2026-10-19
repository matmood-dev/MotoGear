import { Link } from "react-router-dom";
import { money } from "../data/products";

export function Stars({ value = 0, className = "" }) {
  return (
    <span className={`inline-flex items-center gap-0.5 ${className}`} aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          className={`h-3.5 w-3.5 ${i <= Math.round(value) ? "fill-orange-500" : "fill-zinc-700"}`}
        >
          <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.9L10 14.9 4.8 17.7l1-5.9L1.5 7.7l5.9-.9L10 1.5z" />
        </svg>
      ))}
    </span>
  );
}

export function Breadcrumbs({ trail = [] }) {
  return (
    <nav className="flex items-center gap-2 text-xs text-zinc-400" aria-label="Breadcrumb">
      <Link to="/" className="hover:text-orange-400">Home</Link>
      {trail.map((t, i) => (
        <span key={i} className="flex items-center gap-2">
          <span className="text-zinc-600">/</span>
          {t.to ? (
            <Link to={t.to} className="hover:text-orange-400">{t.label}</Link>
          ) : (
            <span className="text-zinc-200">{t.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

export function StockBadge({ stock }) {
  if (stock === 0)
    return <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-400"><span className="h-2 w-2 rounded-full bg-red-500" />Out of stock</span>;
  if (stock <= 8)
    return <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400"><span className="h-2 w-2 rounded-full bg-amber-400" />Only {stock} left</span>;
  return <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400"><span className="h-2 w-2 rounded-full bg-emerald-400" />In stock</span>;
}

export function Price({ product, large = false }) {
  return (
    <span className={`flex items-baseline gap-2 ${large ? "text-3xl" : "text-lg"} font-extrabold text-white`}>
      {money(product.price)}
      {product.compareAt && (
        <span className={`${large ? "text-lg" : "text-sm"} font-medium text-zinc-500 line-through`}>
          {money(product.compareAt)}
        </span>
      )}
    </span>
  );
}

export function SectionTitle({ kicker, title, action }) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        {kicker && <p className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-orange-500">{kicker}</p>}
        <h2 className="text-2xl font-black uppercase tracking-tight text-white sm:text-3xl">{title}</h2>
      </div>
      {action}
    </div>
  );
}

export const FALLBACK_IMG = (label = "MotoGear") =>
  `https://placehold.co/800x600/18181b/f97316?text=${encodeURIComponent(label)}`;

export function handleImgError(e, label) {
  e.currentTarget.src = FALLBACK_IMG(label);
}
