import { Link } from "react-router-dom";
import { CATEGORIES, PRODUCTS } from "../data/products";
import ProductCard from "../components/ProductCard";
import { SectionTitle, handleImgError } from "../components/ui";

const HERO_IMG = "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=1600&q=80&auto=format&fit=crop";

export default function Home() {
  const featured = PRODUCTS.filter((p) => p.featured);
  const newArrivals = PRODUCTS.filter((p) => p.isNew).slice(0, 4);
  const topRated = [...PRODUCTS].sort((a, b) => b.rating - a.rating).slice(0, 4);

  return (
    <div>
      {/* Hero */}
      <section className="texture-carbon relative overflow-hidden bg-zinc-900">
        <img src={HERO_IMG} onError={(e) => handleImgError(e, "Ride")} alt="Rider" className="absolute inset-0 h-full w-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/70 to-transparent" />
        <div className="animate-fade-up relative mx-auto max-w-7xl px-4 py-20 sm:py-28">
          <p className="mb-2 inline-block rounded bg-orange-600 px-3 py-1 text-xs font-black uppercase tracking-[0.2em] text-white">New season · ECE 22.06 gear</p>
          <h1 className="max-w-2xl text-4xl font-black uppercase leading-[1.02] tracking-tight text-white sm:text-6xl">
            Built for the <span className="text-orange-500">bold.</span><br />Worn by riders.
          </h1>
          <p className="mt-4 max-w-xl text-zinc-300">Helmets, jackets, boots and armour from six rider-trusted brands. Certified protection with street-ready style.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/shop" className="rounded-md bg-orange-600 px-6 py-3 text-sm font-black uppercase tracking-wide text-white hover:bg-orange-500">Shop all gear</Link>
            <Link to="/shop?category=helmets" className="rounded-md border border-zinc-600 px-6 py-3 text-sm font-black uppercase tracking-wide text-white hover:border-white">Helmets</Link>
          </div>
          <div className="mt-8 flex gap-6 text-sm">
            {[["20+", "Products"], ["6", "Top brands"], ["4.6★", "Avg rating"]].map(([v, l]) => (
              <div key={l}><p className="text-xl font-black text-white">{v}</p><p className="text-zinc-400">{l}</p></div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <SectionTitle kicker="Departments" title="Shop by category" action={<Link to="/shop" className="text-sm font-bold text-orange-500 hover:text-orange-400">View all →</Link>} />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {CATEGORIES.map((c) => {
            const n = PRODUCTS.filter((p) => p.category === c.slug).length;
            return (
              <Link key={c.slug} to={`/shop?category=${c.slug}`} className="group rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-center transition-colors hover:border-orange-600">
                <p className="font-extrabold uppercase text-white group-hover:text-orange-400">{c.label}</p>
                <p className="mt-1 text-xs text-zinc-500">{n} products</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured */}
      <section className="mx-auto max-w-7xl px-4 py-6">
        <SectionTitle kicker="Hand-picked" title="Featured gear" action={<Link to="/shop" className="text-sm font-bold text-orange-500 hover:text-orange-400">View all →</Link>} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Value props */}
      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            ["🛡️", "Certified protection", "ECE, DOT & CE-rated gear only."],
            ["🚚", "Free shipping $150+", "Fast dispatch, 30-day returns."],
            ["🔁", "Crash replacement", "30% off replacement after a crash."],
          ].map(([icon, t, d]) => (
            <div key={t} className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
              <p className="text-2xl">{icon}</p>
              <p className="mt-2 font-extrabold uppercase text-white">{t}</p>
              <p className="text-sm text-zinc-400">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* New + top rated */}
      <section className="mx-auto max-w-7xl px-4 py-6">
        <SectionTitle kicker="Fresh in" title="New arrivals" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {newArrivals.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-6">
        <SectionTitle kicker="Rider approved" title="Top rated" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {topRated.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>
    </div>
  );
}
