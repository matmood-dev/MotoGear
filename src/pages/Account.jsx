import { Link, useNavigate } from "react-router-dom";
import { MOCK_ORDERS, money } from "../data/products";
import { useStore } from "../context/StoreContext";
import { Breadcrumbs } from "../components/ui";

export function Profile() {
  const { user, logout, wishlist, count } = useStore();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="text-2xl font-black uppercase text-white">You're signed out</h1>
        <p className="mt-2 text-sm text-zinc-400">Sign in to view your profile, orders and wishlist.</p>
        <Link to="/login" className="mt-5 inline-block rounded-md bg-orange-600 px-8 py-3 text-sm font-bold text-white hover:bg-orange-500">Sign in</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <Breadcrumbs trail={[{ label: "Profile" }]} />
      <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900 p-6">
        <div className="flex flex-wrap items-center gap-4">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-orange-600 text-2xl font-black text-white">{user.name[0]?.toUpperCase()}</span>
          <div className="flex-1">
            <h1 className="text-2xl font-black text-white">{user.name}</h1>
            <p className="text-sm text-zinc-400">{user.email} · Rider since {user.joined}</p>
          </div>
          <button onClick={() => { logout(); navigate("/"); }} className="rounded-md border border-zinc-700 px-4 py-2 text-sm font-bold text-white hover:bg-zinc-800">Sign out</button>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-3 text-center">
          {[[MOCK_ORDERS.length, "Orders", "/orders"], [wishlist.length, "Wishlist", "/wishlist"], [count, "In cart", "/cart"]].map(([v, l, to]) => (
            <Link key={l} to={to} className="rounded-lg bg-zinc-950 p-4 hover:border hover:border-orange-600">
              <p className="text-2xl font-black text-white">{v}</p>
              <p className="text-xs uppercase tracking-widest text-zinc-500">{l}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Orders() {
  const { user } = useStore();
  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <Breadcrumbs trail={[{ label: "Order history" }]} />
      <h1 className="mt-2 text-3xl font-black uppercase text-white">Order history</h1>
      {!user && <p className="mt-2 text-sm text-amber-400">Demo data shown — <Link to="/login" className="font-bold underline">sign in</Link> to sync real orders.</p>}
      <ul className="mt-5 grid gap-3">
        {MOCK_ORDERS.map((o) => (
          <li key={o.id} className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-black text-white">{o.id} <span className="ml-2 text-xs font-medium text-zinc-500">{o.date}</span></p>
              <span className={`rounded px-2.5 py-1 text-xs font-bold ${o.status === "Delivered" ? "bg-emerald-900 text-emerald-300" : "bg-amber-900 text-amber-300"}`}>{o.status}</span>
            </div>
            <p className="mt-1 text-sm text-zinc-400">{o.items.join(" · ")}</p>
            <p className="mt-2 font-extrabold text-orange-500">{money(o.total)}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
