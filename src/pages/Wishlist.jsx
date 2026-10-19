import { Link } from "react-router-dom";
import { getProduct } from "../data/products";
import { useStore } from "../context/StoreContext";
import ProductCard from "../components/ProductCard";
import { Breadcrumbs } from "../components/ui";

export default function Wishlist() {
  const { wishlist } = useStore();
  const items = wishlist.map(getProduct).filter(Boolean);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <Breadcrumbs trail={[{ label: "Wishlist" }]} />
      <h1 className="mt-2 text-3xl font-black uppercase text-white">Wishlist <span className="text-base font-medium text-zinc-500">({items.length})</span></h1>
      {items.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-zinc-700 p-16 text-center">
          <p className="text-lg font-bold text-white">Nothing saved yet</p>
          <p className="text-sm text-zinc-400">Tap the heart on any product to save it here.</p>
          <Link to="/shop" className="mt-4 inline-block rounded-md bg-orange-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-orange-500">Browse gear</Link>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
