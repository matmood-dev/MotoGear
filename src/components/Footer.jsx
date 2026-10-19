import { useState } from "react";
import { Link } from "react-router-dom";
import { CATEGORIES } from "../data/products";
import { useStore } from "../context/StoreContext";

export default function Footer() {
  const { notify } = useStore();
  const [email, setEmail] = useState("");

  return (
    <footer className="mt-16 border-t border-zinc-800 bg-zinc-950">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-4">
        <div>
          <p className="text-lg font-black uppercase text-white">Moto<span className="text-orange-500">Gear</span></p>
          <p className="mt-2 text-sm text-zinc-400">Rugged, certified motorbike gear for the road and the dirt. Ride hard, ride protected.</p>
          <div className="mt-4 flex gap-2">
            {["X", "IG", "YT", "FB"].map((s) => (
              <a key={s} href="#" onClick={(e) => e.preventDefault()} className="grid h-9 w-9 place-items-center rounded bg-zinc-800 text-xs font-bold text-zinc-300 hover:bg-orange-600 hover:text-white">{s}</a>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-zinc-500">Shop</p>
          <ul className="grid gap-2 text-sm">
            <li><Link to="/shop" className="text-zinc-300 hover:text-orange-400">Shop All</Link></li>
            {CATEGORIES.map((c) => (
              <li key={c.slug}><Link to={`/shop?category=${c.slug}`} className="text-zinc-300 hover:text-orange-400">{c.label}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-zinc-500">Account</p>
          <ul className="grid gap-2 text-sm">
            <li><Link to="/login" className="text-zinc-300 hover:text-orange-400">Sign In</Link></li>
            <li><Link to="/profile" className="text-zinc-300 hover:text-orange-400">Profile</Link></li>
            <li><Link to="/orders" className="text-zinc-300 hover:text-orange-400">Order History</Link></li>
            <li><Link to="/wishlist" className="text-zinc-300 hover:text-orange-400">Wishlist</Link></li>
            <li><Link to="/cart" className="text-zinc-300 hover:text-orange-400">Cart</Link></li>
          </ul>
        </div>
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-zinc-500">Pit-lane newsletter</p>
          <p className="text-sm text-zinc-400">Drops, deals & ride guides. No spam.</p>
          <form
            className="mt-3 flex"
            onSubmit={(e) => { e.preventDefault(); if (email.trim()) { notify("Subscribed — welcome to the pit lane"); setEmail(""); } }}
          >
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required placeholder="you@fastmail.com" className="w-full rounded-l-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white outline-none focus:border-orange-500" />
            <button className="rounded-r-md bg-orange-600 px-4 text-sm font-bold text-white hover:bg-orange-500">Join</button>
          </form>
        </div>
      </div>
      <div className="border-t border-zinc-800 py-4 text-center text-xs text-zinc-500">
        © 2026 MotoGear. Frontend demo — mock data, no real orders processed.
      </div>
    </footer>
  );
}
