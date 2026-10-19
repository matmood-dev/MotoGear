import { BRANDS, CATEGORIES } from "../data/products";

export default function FilterSidebar({ filters, setFilters, maxPrice }) {
  const update = (patch) => setFilters((f) => ({ ...f, ...patch }));

  const toggleList = (key, value) => {
    setFilters((f) => {
      const list = f[key].includes(value) ? f[key].filter((v) => v !== value) : [...f[key], value];
      return { ...f, [key]: list };
    });
  };

  return (
    <aside className="w-full shrink-0 rounded-xl border border-zinc-800 bg-zinc-900 p-4 lg:w-64">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-black uppercase tracking-wide text-white">Filters</h3>
        <button
          onClick={() => setFilters({ categories: [], brands: [], sizes: [], maxPrice, inStockOnly: false })}
          className="text-xs font-semibold text-orange-500 hover:text-orange-400"
        >
          Clear all
        </button>
      </div>

      <div className="mb-5">
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-zinc-500">Category</p>
        <div className="grid gap-1.5">
          {CATEGORIES.map((c) => (
            <label key={c.slug} className="flex cursor-pointer items-center gap-2 text-sm text-zinc-300 hover:text-white">
              <input type="checkbox" checked={filters.categories.includes(c.slug)} onChange={() => toggleList("categories", c.slug)} className="h-4 w-4 accent-orange-600" />
              {c.label}
            </label>
          ))}
        </div>
      </div>

      <div className="mb-5">
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-zinc-500">Max price: ${filters.maxPrice}</p>
        <input type="range" min={20} max={maxPrice} step={10} value={filters.maxPrice} onChange={(e) => update({ maxPrice: Number(e.target.value) })} className="w-full accent-orange-600" />
        <div className="flex justify-between text-[11px] text-zinc-500"><span>$20</span><span>${maxPrice}</span></div>
      </div>

      <div className="mb-5">
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-zinc-500">Brand</p>
        <div className="grid gap-1.5">
          {BRANDS.map((b) => (
            <label key={b} className="flex cursor-pointer items-center gap-2 text-sm text-zinc-300 hover:text-white">
              <input type="checkbox" checked={filters.brands.includes(b)} onChange={() => toggleList("brands", b)} className="h-4 w-4 accent-orange-600" />
              {b}
            </label>
          ))}
        </div>
      </div>

      <div className="mb-5">
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-zinc-500">Size</p>
        <div className="flex flex-wrap gap-1.5">
          {["S", "M", "L", "XL", "XXL"].map((s) => (
            <button key={s} onClick={() => toggleList("sizes", s)} className={`rounded-md border px-2.5 py-1 text-xs font-bold ${filters.sizes.includes(s) ? "border-orange-500 bg-orange-600 text-white" : "border-zinc-700 text-zinc-300 hover:border-zinc-500"}`}>{s}</button>
          ))}
        </div>
      </div>

      <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-300">
        <input type="checkbox" checked={filters.inStockOnly} onChange={(e) => update({ inStockOnly: e.target.checked })} className="h-4 w-4 accent-orange-600" />
        In stock only
      </label>
    </aside>
  );
}
