import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CATEGORIES, PRODUCTS } from "../data/products";
import ProductCard from "../components/ProductCard";
import FilterSidebar from "../components/FilterSidebar";
import { Breadcrumbs } from "../components/ui";

const MAX = Math.ceil(Math.max(...PRODUCTS.map((p) => p.price)) / 10) * 10;
const SORTS = [
  { id: "popular", label: "Most popular" },
  { id: "rating", label: "Highest rated" },
  { id: "new", label: "Newest" },
  { id: "low", label: "Price: low to high" },
  { id: "high", label: "Price: high to low" },
];

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const urlCat = params.get("category") ?? "";
  const urlSearch = params.get("search") ?? "";

  const [view, setView] = useState("grid");
  const [sort, setSort] = useState("popular");
  const [search, setSearch] = useState(urlSearch);
  const [filters, setFilters] = useState({
    categories: urlCat ? [urlCat] : [],
    brands: [],
    sizes: [],
    maxPrice: MAX,
    inStockOnly: false,
  });
  const [mobileFilters, setMobileFilters] = useState(false);

  const applySearch = (v) => {
    setSearch(v);
    setParams((p) => {
      const next = new URLSearchParams(p);
      if (v.trim()) next.set("search", v.trim());
      else next.delete("search");
      return next;
    });
  };

  const results = useMemo(() => {
    let list = [...PRODUCTS];
    const cats = urlCat && !filters.categories.includes(urlCat) ? [...filters.categories, urlCat] : filters.categories;
    if (cats.length) list = list.filter((p) => cats.includes(p.category));
    if (filters.brands.length) list = list.filter((p) => filters.brands.includes(p.brand));
    if (filters.sizes.length) list = list.filter((p) => p.sizes.some((s) => filters.sizes.includes(s)));
    list = list.filter((p) => p.price <= filters.maxPrice);
    if (filters.inStockOnly) list = list.filter((p) => p.stock > 0);
    const q = (urlSearch || search).toLowerCase();
    if (q) list = list.filter((p) => `${p.name} ${p.brand} ${p.description}`.toLowerCase().includes(q));
    switch (sort) {
      case "low": list.sort((a, b) => a.price - b.price); break;
      case "high": list.sort((a, b) => b.price - a.price); break;
      case "rating": list.sort((a, b) => b.rating - a.rating); break;
      case "new": list.sort((a, b) => Number(b.isNew) - Number(a.isNew) || b.popularity - a.popularity); break;
      default: list.sort((a, b) => b.popularity - a.popularity);
    }
    return list;
  }, [filters, sort, search, urlSearch, urlCat]);

  const activeCat = urlCat ? CATEGORIES.find((c) => c.slug === urlCat)?.label : null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <Breadcrumbs trail={[{ to: "/shop", label: "Shop" }, ...(activeCat ? [{ label: activeCat }] : [])]} />
      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-black uppercase tracking-tight text-white">{activeCat ?? "All gear"} <span className="text-base font-medium text-zinc-500">({results.length})</span></h1>
        <div className="flex items-center gap-2">
          <input value={search} onChange={(e) => applySearch(e.target.value)} placeholder="Search products…" className="w-44 rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white outline-none focus:border-orange-500 sm:w-56" />
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-md border border-zinc-700 bg-zinc-900 px-2 py-2 text-sm text-white outline-none">
            {SORTS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
          <div className="hidden overflow-hidden rounded-md border border-zinc-700 sm:flex">
            {(["grid", "list"]).map((v) => (
              <button key={v} onClick={() => setView(v)} className={`px-3 py-2 text-sm font-bold ${view === v ? "bg-orange-600 text-white" : "text-zinc-400 hover:text-white"}`}>{v === "grid" ? "▦" : "☰"}</button>
            ))}
          </div>
          <button onClick={() => setMobileFilters((v) => !v)} className="rounded-md border border-zinc-700 px-3 py-2 text-sm font-bold text-white lg:hidden">Filters</button>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-6 lg:flex-row">
        <div className={`${mobileFilters ? "block" : "hidden"} lg:block`}>
          <FilterSidebar filters={filters} setFilters={setFilters} maxPrice={MAX} />
        </div>
        <div className="flex-1">
          {results.length === 0 ? (
            <div className="rounded-xl border border-dashed border-zinc-700 p-16 text-center">
              <p className="text-lg font-bold text-white">No gear matches those filters</p>
              <p className="text-sm text-zinc-400">Try widening the price range or clearing a filter.</p>
              <button onClick={() => { setFilters({ categories: [], brands: [], sizes: [], maxPrice: MAX, inStockOnly: false }); applySearch(""); }} className="mt-4 rounded-md bg-orange-600 px-5 py-2 text-sm font-bold text-white hover:bg-orange-500">Reset</button>
            </div>
          ) : view === "grid" ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <div className="grid gap-3">
              {results.map((p) => <ProductCard key={p.id} product={p} layout="list" />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
