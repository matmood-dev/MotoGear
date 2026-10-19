import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { CATEGORIES } from "../data/products";
import { useStore } from "../context/StoreContext";

export default function Navbar() {
  const { count, setCartOpen, user, wishlist } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  const submitSearch = (e) => {
    e.preventDefault();
    navigate(q.trim() ? `/shop?search=${encodeURIComponent(q.trim())}` : "/shop");
    setMobileOpen(false);
  };

  const linkCls = ({ isActive }) =>
    `text-sm font-semibold uppercase tracking-wide transition-colors ${
      isActive ? "text-orange-500" : "text-zinc-300 hover:text-white"
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur">
      <div className="bg-orange-600 px-4 py-1.5 text-center text-[11px] font-bold uppercase tracking-[0.18em] text-white">
        Free shipping over $150 — 30-day crash replacement
      </div>
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
        <button
          className="rounded p-2 text-zinc-300 hover:bg-zinc-800 lg:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6 fill-none stroke-current stroke-2"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
        </button>

        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded bg-orange-600 text-lg font-black text-white">M</span>
          <span className="text-lg font-black uppercase tracking-tight text-white">
            Moto<span className="text-orange-500">Gear</span>
          </span>
        </Link>

        <nav className="ml-4 hidden items-center gap-5 lg:flex">
          <NavLink to="/" className={linkCls}>Home</NavLink>
          <NavLink to="/shop" className={linkCls}>Shop</NavLink>
          {CATEGORIES.slice(0, 4).map((c) => (
            <NavLink key={c.slug} to={`/shop?category=${c.slug}`} className={linkCls}>{c.label}</NavLink>
          ))}
        </nav>

        <form onSubmit={submitSearch} className="ml-auto hidden min-w-0 flex-1 max-w-xs items-center md:flex">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search helmets, gloves…"
            className="w-full rounded-l-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white placeholder-zinc-500 outline-none focus:border-orange-500"
          />
          <button className="rounded-r-md bg-orange-600 px-3 py-2 text-sm font-bold text-white hover:bg-orange-500">Go</button>
        </form>

        <div className="ml-auto flex items-center gap-1 md:ml-0">
          <Link to="/wishlist" className="relative rounded p-2 text-zinc-300 hover:bg-zinc-800 hover:text-white" aria-label="Wishlist">
            <svg viewBox="0 0 24 24" className="h-6 w-6 fill-none stroke-current stroke-2"><path d="M12 21s-7-4.5-9.5-9C.9 8.9 2.4 5.5 5.7 5.5c2 0 3.4 1.1 4.1 2.3h4.4c.7-1.2 2.1-2.3 4.1-2.3 3.3 0 4.8 3.4 3.2 6.5C19 16.5 12 21 12 21z" transform="scale(0.9) translate(1.3 0)" /></svg>
            {wishlist.length > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-5 w-5 place-items-center rounded-full bg-zinc-700 text-[10px] font-bold text-white">{wishlist.length}</span>
            )}
          </Link>
          <Link to={user ? "/profile" : "/login"} className="rounded p-2 text-zinc-300 hover:bg-zinc-800 hover:text-white" aria-label="Account">
            <svg viewBox="0 0 24 24" className="h-6 w-6 fill-none stroke-current stroke-2"><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.5-6.5 8-6.5s8 2.5 8 6.5" /></svg>
          </Link>
          <button onClick={() => setCartOpen(true)} className="relative rounded p-2 text-zinc-300 hover:bg-zinc-800 hover:text-white" aria-label="Open cart">
            <svg viewBox="0 0 24 24" className="h-6 w-6 fill-none stroke-current stroke-2"><path d="M3 3h2l2.4 12.2A1 1 0 0 0 8.4 16H18a1 1 0 0 0 1-.8L21.5 8H6" /><circle cx="9.5" cy="20" r="1.5" /><circle cx="17" cy="20" r="1.5" /></svg>
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-orange-600 px-1 text-[10px] font-bold text-white">{count}</span>
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-zinc-800 bg-zinc-950 px-4 pb-4 pt-2 lg:hidden">
          <form onSubmit={submitSearch} className="mb-3 flex md:hidden">
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search gear…" className="w-full rounded-l-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white outline-none focus:border-orange-500" />
            <button className="rounded-r-md bg-orange-600 px-3 py-2 text-sm font-bold text-white">Go</button>
          </form>
          <div className="grid gap-1">
            {[{ to: "/", label: "Home" }, { to: "/shop", label: "Shop All" }, ...CATEGORIES.map((c) => ({ to: `/shop?category=${c.slug}`, label: c.label })), { to: "/orders", label: "Order History" }].map((l) => (
              <Link key={l.label} to={l.to} onClick={() => setMobileOpen(false)} className="rounded px-2 py-2 text-sm font-semibold uppercase tracking-wide text-zinc-200 hover:bg-zinc-800">{l.label}</Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
