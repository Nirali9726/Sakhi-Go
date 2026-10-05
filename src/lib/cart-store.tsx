import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { products, type Product } from "./sakhigo-data";

export interface CartLine { productId: string; qty: number }
interface CartCtx {
  lines: CartLine[];
  add: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  count: number;
  subtotal: number;
  items: { product: Product; qty: number }[];
}

const Ctx = createContext<CartCtx | null>(null);
const KEY = "sakhigo-cart-v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setLines(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem(KEY, JSON.stringify(lines)); } catch {}
  }, [lines, hydrated]);

  const add = (id: string) =>
    setLines((prev) => {
      const ex = prev.find((l) => l.productId === id);
      if (ex) return prev.map((l) => (l.productId === id ? { ...l, qty: l.qty + 1 } : l));
      return [...prev, { productId: id, qty: 1 }];
    });

  const setQty = (id: string, qty: number) =>
    setLines((prev) =>
      qty <= 0 ? prev.filter((l) => l.productId !== id) : prev.map((l) => (l.productId === id ? { ...l, qty } : l)),
    );

  const remove = (id: string) => setLines((prev) => prev.filter((l) => l.productId !== id));
  const clear = () => setLines([]);

  const items = lines
    .map((l) => {
      const product = products.find((p) => p.id === l.productId);
      return product ? { product, qty: l.qty } : null;
    })
    .filter(Boolean) as { product: Product; qty: number }[];

  const count = items.reduce((s, i) => s + i.qty, 0);
  const subtotal = items.reduce((s, i) => s + i.qty * i.product.price, 0);

  return <Ctx.Provider value={{ lines, add, setQty, remove, clear, count, subtotal, items }}>{children}</Ctx.Provider>;
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be inside CartProvider");
  return ctx;
}
