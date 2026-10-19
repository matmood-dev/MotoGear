import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { getProduct } from "../data/products";

const StoreContext = createContext(null);

const load = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

export function StoreProvider({ children }) {
  const [cart, setCart] = useState(() => load("mg_cart", []));
  const [wishlist, setWishlist] = useState(() => load("mg_wishlist", []));
  const [user, setUser] = useState(() => load("mg_user", null));
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  useEffect(() => localStorage.setItem("mg_cart", JSON.stringify(cart)), [cart]);
  useEffect(() => localStorage.setItem("mg_wishlist", JSON.stringify(wishlist)), [wishlist]);
  useEffect(() => localStorage.setItem("mg_user", JSON.stringify(user)), [user]);

  const notify = useCallback((msg) => {
    setToast(msg);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2400);
  }, []);

  const addToCart = useCallback(
    (productId, { size, color, qty = 1 } = {}) => {
      const p = getProduct(productId);
      if (!p) return;
      if (p.stock === 0) {
        notify(`${p.name} is out of stock`);
        return;
      }
      const key = `${productId}|${size ?? p.sizes[0]}|${color ?? p.colors[0]}`;
      setCart((prev) => {
        const found = prev.find((i) => i.key === key);
        if (found) {
          return prev.map((i) => (i.key === key ? { ...i, qty: Math.min(i.qty + qty, 99) } : i));
        }
        return [...prev, { key, productId, size: size ?? p.sizes[0], color: color ?? p.colors[0], qty }];
      });
      notify(`Added to cart — ${p.name}`);
      setCartOpen(true);
    },
    [notify]
  );

  const updateQty = useCallback((key, qty) => {
    setCart((prev) =>
      qty <= 0 ? prev.filter((i) => i.key !== key) : prev.map((i) => (i.key === key ? { ...i, qty } : i))
    );
  }, []);

  const removeItem = useCallback((key) => {
    setCart((prev) => prev.filter((i) => i.key !== key));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const toggleWishlist = useCallback(
    (productId) => {
      setWishlist((prev) => {
        const has = prev.includes(productId);
        notify(has ? "Removed from wishlist" : "Saved to wishlist");
        return has ? prev.filter((id) => id !== productId) : [...prev, productId];
      });
    },
    [notify]
  );

  const login = useCallback(
    (email) => {
      const u = { name: email.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()), email, joined: "2025-03-14" };
      setUser(u);
      notify(`Welcome back, ${u.name}`);
      return u;
    },
    [notify]
  );

  const signup = useCallback(
    (name, email) => {
      const u = { name, email, joined: new Date().toISOString().slice(0, 10) };
      setUser(u);
      notify(`Account created — welcome, ${name}`);
      return u;
    },
    [notify]
  );

  const logout = useCallback(() => {
    setUser(null);
    notify("Signed out");
  }, [notify]);

  const detailedCart = useMemo(
    () =>
      cart
        .map((i) => ({ ...i, product: getProduct(i.productId) }))
        .filter((i) => i.product),
    [cart]
  );

  const subtotal = useMemo(
    () => detailedCart.reduce((s, i) => s + i.product.price * i.qty, 0),
    [detailedCart]
  );
  const count = useMemo(() => detailedCart.reduce((s, i) => s + i.qty, 0), [detailedCart]);
  const tax = subtotal * 0.08;
  const shipping = subtotal === 0 ? 0 : subtotal > 150 ? 0 : 9.99;

  const value = {
    cart: detailedCart,
    cartOpen,
    setCartOpen,
    addToCart,
    updateQty,
    removeItem,
    clearCart,
    subtotal,
    tax,
    shipping,
    total: subtotal + tax + shipping,
    count,
    wishlist,
    toggleWishlist,
    user,
    login,
    signup,
    logout,
    toast,
    notify,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
};
