import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Check, Heart, MapPin, Package, Phone, Bike, Home as HomeIcon } from "lucide-react";
import { PhoneShell } from "@/components/PhoneShell";
import { CartProvider } from "@/lib/cart-store";
import { formatPrice } from "@/lib/sakhigo-data";

export const Route = createFileRoute("/confirmation")({
  head: () => ({ meta: [{ title: "Order confirmation | SakhiGo" }, { name: "description", content: "Follow your SakhiGo order and its live arrival countdown." }, { property: "og:title", content: "Order confirmation | SakhiGo" }, { property: "og:description", content: "Follow your SakhiGo order and its live arrival countdown." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: () => (
    <CartProvider>
      <ConfirmationPage />
    </CartProvider>
  ),
});

const ETA_MINUTES = 18;

interface Order {
  name: string;
  address: string;
  phone: string;
  total: number;
  itemCount: number;
  placedAt: number;
}

interface Stage {
  key: string;
  label: string;
  hint: string;
  icon: React.ReactNode;
  atProgress: number; // 0..1
}

const STAGES: Stage[] = [
  { key: "confirmed", label: "Order confirmed", hint: "We received your order.", icon: <Check className="h-4 w-4" />, atProgress: 0 },
  { key: "packing", label: "Packing discreetly", hint: "Sealing in plain, unmarked packaging.", icon: <Package className="h-4 w-4" />, atProgress: 0.15 },
  { key: "picked", label: "Picked up by Anjali", hint: "Your delivery partner is on her way.", icon: <Bike className="h-4 w-4" />, atProgress: 0.4 },
  { key: "nearby", label: "Arriving in your lane", hint: "2 minutes away from your address.", icon: <MapPin className="h-4 w-4" />, atProgress: 0.85 },
  { key: "delivered", label: "Delivered", hint: "Enjoy. Take care of yourself today. 💗", icon: <HomeIcon className="h-4 w-4" />, atProgress: 1 },
];

function ConfirmationPage() {
  const [order, setOrder] = useState<Order | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(ETA_MINUTES * 60);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("sakhigo-last-order");
      if (raw) {
        const o = JSON.parse(raw) as Order;
        setOrder(o);
        const elapsed = Math.floor((Date.now() - o.placedAt) / 1000);
        setSecondsLeft(Math.max(0, ETA_MINUTES * 60 - elapsed));
      }
    } catch {}
  }, []);

  useEffect(() => {
    const t = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const progress = 1 - secondsLeft / (ETA_MINUTES * 60);

  const currentStageIndex = useMemo(() => {
    let idx = 0;
    STAGES.forEach((s, i) => { if (progress >= s.atProgress) idx = i; });
    return idx;
  }, [progress]);
  const current = STAGES[currentStageIndex];

  return (
    <PhoneShell back={false} showCart={false}>
       <div className="px-6 pt-5">
        <div className="flex flex-col items-center text-center">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-blush">
            <Check className="h-8 w-8 text-primary" strokeWidth={2.5} />
          </div>
          <h1 className="mt-4 font-display text-2xl font-semibold">Order confirmed</h1>
          <p className="mt-1 max-w-xs text-sm text-muted-foreground">
            Thank you{order?.name ? `, ${order.name.split(" ")[0]}` : ""}. We're on it.
          </p>
        </div>

        {/* Live ETA */}
         <div className="relative mt-5 overflow-hidden rounded-md bg-blush p-6 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-blush-foreground/80">Arriving in</p>
          <p className="mt-1 font-display text-5xl font-semibold tabular-nums text-blush-foreground">
            {mins}<span className="text-2xl">m</span> {String(secs).padStart(2, "0")}<span className="text-2xl">s</span>
          </p>
          <p className="mt-1 text-sm text-blush-foreground/80">
            {secondsLeft === 0 ? "Your order is at your door." : current.label}
          </p>

          {/* Live map ribbon */}
           <div className="relative mt-5 h-12 overflow-hidden rounded-md bg-background/70">
            <div
               className="absolute left-0 top-0 h-full bg-sage/20 transition-[width] duration-1000 ease-linear motion-reduce:transition-none"
              style={{ width: `${Math.min(100, progress * 100)}%` }}
            />
            <div className="absolute inset-y-0 left-3 flex items-center text-[10px] font-semibold uppercase tracking-wider text-primary">
              <Package className="mr-1 h-3 w-3" /> Store
            </div>
            <div className="absolute inset-y-0 right-3 flex items-center text-[10px] font-semibold uppercase tracking-wider text-primary">
              You <HomeIcon className="ml-1 h-3 w-3" />
            </div>
            <div
              className="absolute top-1/2 -translate-y-1/2 transition-[left] duration-1000 ease-linear"
              style={{ left: `calc(${Math.min(96, Math.max(2, progress * 96))}% )` }}
            >
               <div className="grid h-9 w-9 -translate-x-1/2 place-items-center rounded-full bg-sage text-sage-foreground ring-4 ring-background/70">
                <Bike className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Stage timeline */}
         <div className="mt-5 border-t border-border pt-4">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Where is your order?</p>
          <ol className="mt-3 space-y-3">
            {STAGES.map((s, i) => {
              const done = i < currentStageIndex;
              const active = i === currentStageIndex;
              return (
                <li key={s.key} className="flex items-start gap-3">
                  <div className="relative flex flex-col items-center">
                    <div
                      className={`grid h-7 w-7 place-items-center rounded-full border transition-colors ${
                        done
                          ? "border-primary bg-primary text-primary-foreground"
                          : active
                           ? "border-primary bg-card text-primary"
                           : "border-border bg-card text-muted-foreground"
                      }`}
                    >
                      {done ? <Check className="h-3.5 w-3.5" /> : s.icon}
                    </div>
                    {i < STAGES.length - 1 && (
                      <div className={`mt-1 h-6 w-px ${i < currentStageIndex ? "bg-primary" : "bg-border"}`} />
                    )}
                  </div>
                  <div className="flex-1 pb-1">
                    <p className={`text-sm font-semibold ${active ? "text-primary" : done ? "text-foreground" : "text-muted-foreground"}`}>
                      {s.label} {active && <span className="ml-1 inline-flex h-1.5 w-1.5 animate-pulse rounded-full bg-primary align-middle" />}
                    </p>
                    <p className="text-[11px] text-muted-foreground">{s.hint}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Address + phone */}
         <div className="mt-5 space-y-3 border-t border-border pt-4 text-sm">
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Delivering to</p>
              <p className="font-medium leading-snug">{order?.address || "Your saved address"}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <div>
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Updates on</p>
              <p className="font-medium">+91 {order?.phone || "—"}</p>
            </div>
          </div>
        </div>

        {order && (
          <div className="mt-4 flex items-center justify-between rounded-2xl bg-secondary p-4 text-sm">
            <span className="text-muted-foreground">{order.itemCount} {order.itemCount === 1 ? "item" : "items"} · cash on delivery</span>
            <span className="font-display text-lg font-semibold">{formatPrice(order.total)}</span>
          </div>
        )}

        <div className="mt-5 flex items-center justify-center gap-1.5 text-xs italic text-muted-foreground">
          <Heart className="h-3.5 w-3.5 text-primary" /> By women. For women. Delivered with care.
        </div>

        <Link
          to="/"
          className="mt-5 mb-2 block h-12 rounded-full border border-primary text-center font-semibold leading-[3rem] text-primary"
        >
          Back to home
        </Link>
      </div>
    </PhoneShell>
  );
}
