import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";

const inputCls = "w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-orange-500";
const labelCls = "mb-1 block text-xs font-bold uppercase tracking-widest text-zinc-400";

export function Login() {
  const { login } = useStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  return (
    <div className="mx-auto max-w-md px-4 py-14">
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
        <h1 className="text-2xl font-black uppercase text-white">Welcome back</h1>
        <p className="mt-1 text-sm text-zinc-400">Mock auth — any email + 6-char password works.</p>
        <form
          className="mt-5 grid gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return setErr("Enter a valid email.");
            if (password.length < 6) return setErr("Password must be at least 6 characters.");
            login(email);
            navigate("/profile");
          }}
        >
          <div><label className={labelCls}>Email</label><input className={inputCls} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="rider@fastmail.com" /></div>
          <div><label className={labelCls}>Password</label><input className={inputCls} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" /></div>
          {err && <p className="text-sm text-red-400">{err}</p>}
          <button className="rounded-md bg-orange-600 py-3 text-sm font-black uppercase text-white hover:bg-orange-500">Sign in</button>
        </form>
        <p className="mt-4 text-center text-sm text-zinc-400">No account? <Link to="/signup" className="font-bold text-orange-500">Create one</Link></p>
      </div>
    </div>
  );
}

export function Signup() {
  const { signup } = useStore();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  return (
    <div className="mx-auto max-w-md px-4 py-14">
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
        <h1 className="text-2xl font-black uppercase text-white">Join MotoGear</h1>
        <p className="mt-1 text-sm text-zinc-400">Mock signup — stored in localStorage only.</p>
        <form
          className="mt-5 grid gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (name.trim().length < 2) return setErr("Enter your name.");
            if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return setErr("Enter a valid email.");
            if (password.length < 6) return setErr("Password must be at least 6 characters.");
            signup(name.trim(), email);
            navigate("/profile");
          }}
        >
          <div><label className={labelCls}>Name</label><input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder="Alex Rider" /></div>
          <div><label className={labelCls}>Email</label><input className={inputCls} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="rider@fastmail.com" /></div>
          <div><label className={labelCls}>Password</label><input className={inputCls} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 6 characters" /></div>
          {err && <p className="text-sm text-red-400">{err}</p>}
          <button className="rounded-md bg-orange-600 py-3 text-sm font-black uppercase text-white hover:bg-orange-500">Create account</button>
        </form>
        <p className="mt-4 text-center text-sm text-zinc-400">Have an account? <Link to="/login" className="font-bold text-orange-500">Sign in</Link></p>
      </div>
    </div>
  );
}
