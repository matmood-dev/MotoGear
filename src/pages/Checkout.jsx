import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { money } from "../data/products";
import { useStore } from "../context/StoreContext";
import { Breadcrumbs, handleImgError } from "../components/ui";

const STEPS = ["Shipping", "Payment", "Review"];

const inputCls = "w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-orange-500";
const labelCls = "mb-1 block text-xs font-bold uppercase tracking-widest text-zinc-400";

export default function Checkout() {
  const { cart, subtotal, tax, shipping, total, clearCart, user } = useStore();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(null);
  const [form, setForm] = useState({
    name: user?.name ?? "", email: user?.email ?? "", address: "", city: "", zip: "", country: "United States",
    card: "", expiry: "", cvc: "",
  });
  const [errors, setErrors] = useState({});

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (step === 0) {
      if (!form.name.trim()) e.name = "Required";
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) e.email = "Invalid email";
      if (!form.address.trim()) e.address = "Required";
      if (!form.city.trim()) e.city = "Required";
      if (!form.zip.trim()) e.zip = "Required";
    }
    if (step === 1) {
      if (form.card.replace(/\s/g, "").length < 12) e.card = "Enter a valid card number";
      if (!/^\d{2}\/\d{2}$/.test(form.expiry)) e.expiry = "MM/YY";
      if (!/^\d{3,4}$/.test(form.cvc)) e.cvc = "3–4 digits";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => validate() && setStep((s) => Math.min(2, s + 1));

  const placeOrder = () => {
    if (!validate()) return;
    const orderId = `MG-${Math.floor(10000 + Math.random() * 89999)}`;
    setDone({ id: orderId, total });
    clearCart();
  };

  if (done) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-emerald-600 text-3xl text-white">✓</div>
        <h1 className="mt-4 text-3xl font-black uppercase text-white">Order confirmed</h1>
        <p className="mt-2 text-zinc-400">Order <span className="font-bold text-white">{done.id}</span> is being prepped. A mock confirmation was sent to <span className="text-white">{form.email}</span>.</p>
        <p className="mt-1 text-sm text-zinc-500">Charged {money(done.total)} (demo — no real payment).</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link to="/shop" className="rounded-md bg-orange-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-orange-500">Keep shopping</Link>
          <Link to="/orders" className="rounded-md border border-zinc-700 px-6 py-2.5 text-sm font-bold text-white hover:bg-zinc-800">Order history</Link>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="text-2xl font-black uppercase text-white">Nothing to check out</h1>
        <button onClick={() => navigate("/shop")} className="mt-4 rounded-md bg-orange-600 px-8 py-3 text-sm font-bold text-white">Shop gear</button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <Breadcrumbs trail={[{ to: "/cart", label: "Cart" }, { label: "Checkout" }]} />
      <h1 className="mt-2 text-3xl font-black uppercase text-white">Checkout</h1>

      <ol className="mt-4 flex gap-2">
        {STEPS.map((s, i) => (
          <li key={s} className={`flex-1 rounded-md px-3 py-2 text-center text-xs font-black uppercase tracking-wide ${i === step ? "bg-orange-600 text-white" : i < step ? "bg-emerald-900 text-emerald-300" : "bg-zinc-800 text-zinc-400"}`}>
            {i + 1}. {s}
          </li>
        ))}
      </ol>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 lg:col-span-2">
          {step === 0 && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-1"><label className={labelCls}>Full name</label><input className={inputCls} value={form.name} onChange={(e) => set("name", e.target.value)} />{errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}</div>
              <div className="sm:col-span-1"><label className={labelCls}>Email</label><input className={inputCls} value={form.email} onChange={(e) => set("email", e.target.value)} />{errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}</div>
              <div className="sm:col-span-2"><label className={labelCls}>Address</label><input className={inputCls} placeholder="Street + number" value={form.address} onChange={(e) => set("address", e.target.value)} />{errors.address && <p className="mt-1 text-xs text-red-400">{errors.address}</p>}</div>
              <div><label className={labelCls}>City</label><input className={inputCls} value={form.city} onChange={(e) => set("city", e.target.value)} />{errors.city && <p className="mt-1 text-xs text-red-400">{errors.city}</p>}</div>
              <div><label className={labelCls}>ZIP</label><input className={inputCls} value={form.zip} onChange={(e) => set("zip", e.target.value)} />{errors.zip && <p className="mt-1 text-xs text-red-400">{errors.zip}</p>}</div>
              <div className="sm:col-span-2"><label className={labelCls}>Country</label>
                <select className={inputCls} value={form.country} onChange={(e) => set("country", e.target.value)}>
                  {["United States", "United Kingdom", "Germany", "Canada", "Australia"].map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
          )}
          {step === 1 && (
            <div className="grid gap-4">
              <div className="rounded-md border border-amber-700 bg-amber-950/40 p-3 text-xs text-amber-300">Demo checkout — use any test card, e.g. 4242 4242 4242 4242.</div>
              <div><label className={labelCls}>Card number</label><input className={inputCls} inputMode="numeric" placeholder="4242 4242 4242 4242" value={form.card} onChange={(e) => set("card", e.target.value)} />{errors.card && <p className="mt-1 text-xs text-red-400">{errors.card}</p>}</div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className={labelCls}>Expiry</label><input className={inputCls} placeholder="MM/YY" value={form.expiry} onChange={(e) => set("expiry", e.target.value)} />{errors.expiry && <p className="mt-1 text-xs text-red-400">{errors.expiry}</p>}</div>
                <div><label className={labelCls}>CVC</label><input className={inputCls} inputMode="numeric" placeholder="123" value={form.cvc} onChange={(e) => set("cvc", e.target.value)} />{errors.cvc && <p className="mt-1 text-xs text-red-400">{errors.cvc}</p>}</div>
              </div>
            </div>
          )}
          {step === 2 && (
            <div>
              <h3 className="font-bold uppercase text-white">Review your order</h3>
              <div className="mt-3 rounded-md bg-zinc-950 p-3 text-sm text-zinc-300">
                <p className="font-bold text-white">{form.name} · {form.email}</p>
                <p>{form.address}, {form.city} {form.zip}, {form.country}</p>
                <p className="mt-1">Card •••• {form.card.replace(/\s/g, "").slice(-4) || "····"}</p>
              </div>
              <ul className="mt-3 grid gap-2">
                {cart.map((i) => (
                  <li key={i.key} className="flex items-center gap-3 text-sm">
                    <img src={i.product.images[0]} onError={(e) => handleImgError(e, i.product.name)} alt="" className="h-12 w-12 rounded object-cover" />
                    <span className="flex-1 text-zinc-300">{i.product.name} × {i.qty} <span className="text-zinc-500">({i.size}/{i.color})</span></span>
                    <span className="font-bold text-white">{money(i.product.price * i.qty)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="mt-6 flex justify-between">
            <button onClick={() => (step === 0 ? navigate("/cart") : setStep((s) => s - 1))} className="rounded-md border border-zinc-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-zinc-800">Back</button>
            {step < 2 ? (
              <button onClick={next} className="rounded-md bg-orange-600 px-8 py-2.5 text-sm font-black uppercase text-white hover:bg-orange-500">Continue</button>
            ) : (
              <button onClick={placeOrder} className="rounded-md bg-emerald-600 px-8 py-2.5 text-sm font-black uppercase text-white hover:bg-emerald-500">Place order · {money(total)}</button>
            )}
          </div>
        </div>

        <div className="h-fit rounded-xl border border-zinc-800 bg-zinc-900 p-5 lg:sticky lg:top-32">
          <h2 className="font-black uppercase text-white">Order summary</h2>
          <p className="mt-1 text-xs text-zinc-500">{cart.reduce((s, i) => s + i.qty, 0)} items</p>
          <dl className="mt-3 grid gap-2 text-sm">
            <div className="flex justify-between"><dt className="text-zinc-400">Subtotal</dt><dd className="font-bold text-white">{money(subtotal)}</dd></div>
            <div className="flex justify-between"><dt className="text-zinc-400">Tax</dt><dd className="font-bold text-white">{money(tax)}</dd></div>
            <div className="flex justify-between"><dt className="text-zinc-400">Shipping</dt><dd className="font-bold text-white">{shipping === 0 ? "FREE" : money(shipping)}</dd></div>
            <div className="flex justify-between border-t border-zinc-800 pt-2"><dt className="font-bold text-white">Total</dt><dd className="font-black text-orange-500">{money(total)}</dd></div>
          </dl>
        </div>
      </div>
    </div>
  );
}
