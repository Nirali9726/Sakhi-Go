import { createFileRoute, Link } from "@tanstack/react-router";
// import { useState } from "react";
import { ArrowDown, Clock, MapPin, Plus, Search, Minus, ChevronDown } from "lucide-react";
import { CartProvider, useCart } from "@/lib/cart-store";
import { categories, products, formatPrice, localities, type Category } from "@/lib/sakhigo-data";
import { Button } from "@/components/ui/button";
import { useState, type JSX } from "react";
import editorialCare from "@/assets/editorial-care.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SakhiGo — Period & Family care delivered in 20 minutes" },
      { name: "description", content: "Discreet, fast delivery of pads, tampons, cups, kids care and women safety products. By women. For women. Delivered with care." },
      { property: "og:title", content: "SakhiGo — Period & Family care delivered in 20 minutes" },
      { property: "og:description", content: "Discreet, fast delivery of pads, tampons, cups, kids care and women safety products." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <CartProvider>
      <Home />
    </CartProvider>
  ),
});

function Home() {
  const [active, setActive] = useState<Category | "All">("All");
  const [q, setQ] = useState("");
  const [location, setLocation] = useState("Koregaon Park");
  const [showLocation, setShowLocation] = useState(false);
  const [locationSearch, setLocationSearch] = useState("");

  const filteredLocalities = localities.filter(l =>
    l.area.toLowerCase().includes(locationSearch.toLowerCase()) ||
    l.city.toLowerCase().includes(locationSearch.toLowerCase())
  );

  const list = products.filter((p) => {
    const inCat = active === "All" || p.category === active;
    const inQ = !q || p.name.toLowerCase().includes(q.toLowerCase()) || p.brand.toLowerCase().includes(q.toLowerCase());
    return inCat && inQ;
  });

  return (
    <div className="min-h-screen bg-background">

      {/* HEADER */}
      <header className="sticky top-0 z-10 border-b border-border/60 bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="font-display text-xl font-semibold text-foreground">
            Sakhi<span className="text-primary">Go</span>
          </Link>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowLocation(true)}
              className="hidden items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground sm:inline-flex"
            >
              <MapPin className="h-3.5 w-3.5 text-sage" />
              Delivering to <strong className="font-semibold text-foreground">{location}</strong>
              <ChevronDown className="h-3 w-3" />
            </button>
            <span className="hidden items-center gap-1 text-xs font-semibold text-sage sm:inline-flex">
              <Clock className="h-3.5 w-3.5" /> 15–20 min
            </span>
            <CartIcon />
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative h-[280px] overflow-hidden sm:h-[380px] lg:h-[480px]">
        <img
          src={editorialCare}
          alt="Care essentials"
          className="absolute inset-0 h-full w-full object-cover object-[center_58%]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/35 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 pt-8 sm:px-6 sm:pt-12 lg:px-8 lg:pt-16">
          <p className="text-[10px] font-bold uppercase text-sage sm:text-xs">Care, when you need it</p>
          <h1 className="mt-2 max-w-xs font-display text-2xl font-semibold leading-tight text-foreground sm:max-w-md sm:text-4xl lg:text-5xl">
            Period & family care on your doorstep.
          </h1>
          <p className="mt-2 max-w-sm text-xs font-medium leading-relaxed text-foreground sm:text-sm">
            By women. For women.<br />Delivered with care.
          </p>
          <a
            href="#shop"
            className="mt-4 inline-flex items-center gap-1 border-b border-foreground pb-1 text-[11px] font-bold text-foreground sm:text-xs"
          >
            Shop essentials <ArrowDown className="h-3 w-3" />
          </a>
        </div>
      </section>

      {/* DELIVERY BANNER — mobile only */}
      <button
        onClick={() => setShowLocation(true)}
        className="flex w-full items-center justify-between gap-2 bg-muted/50 px-4 py-2 text-xs text-muted-foreground sm:hidden"
      >
        <span className="inline-flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-sage" />
          Delivering to <strong className="font-semibold text-foreground">{location}</strong>
          <ChevronDown className="h-3 w-3" />
        </span>
        <span className="inline-flex items-center gap-1 font-semibold text-sage">
          <Clock className="h-3.5 w-3.5" /> 15–20 min
        </span>
      </button>

      
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {categories.map((c) => (
            <button
              key={c.name}
              onClick={() => {
                setActive(c.name);
                document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" });
              }}
              className={`flex flex-col items-center gap-2 rounded-xl border p-3 transition-all hover:border-sage hover:shadow-sm ${active === c.name ? "border-sage bg-sage/5" : "border-border bg-card"}`}
            >
              <span className="text-xl">{getCategoryIcon(c.name)}</span>
              <span className="text-[10px] font-semibold text-foreground text-center leading-tight">{c.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* SHOP SECTION */}
      <section id="shop" className="mx-auto max-w-7xl scroll-mt-20 px-4 pb-16 sm:px-6 lg:px-8">

        {/* Search */}
        <div className="relative mb-5">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search pads, cups, brands…"
            aria-label="Search products"
            className="h-11 w-full rounded-md border border-border bg-card pl-11 pr-4 text-sm outline-none transition-colors focus:border-sage"
          />
        </div>

        {/* Category Pills */}
        <div className="mb-6 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <CatChip label="All" active={active === "All"} onClick={() => setActive("All")} />
          {categories.map((c) => (
            <CatChip key={c.name} label={c.label} active={active === c.name} onClick={() => setActive(c.name)} />
          ))}
        </div>

        {/* Section Header */}
        <div className="flex items-end justify-between border-b border-border pb-3 mb-6">
          <div>
            <p className="mb-1 text-[10px] font-bold uppercase text-sage">The essentials</p>
            <h2 className="font-display text-xl font-semibold">
              {active === "All" ? "Shop your care" : active}
            </h2>
          </div>
          <span className="text-[11px] text-muted-foreground">{list.length} products</span>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {list.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>

        {list.length === 0 && (
          <div className="mt-10 text-center text-sm text-muted-foreground">
            Nothing matches — try another category.
          </div>
        )}
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border bg-muted/30 px-4 py-8 text-center text-xs text-muted-foreground">
        <p className="font-display text-lg font-semibold text-foreground mb-1">
          Sakhi<span className="text-primary">Go</span>
        </p>
        <p>By women. For women. Delivered with care.</p>
        <p className="mt-2">© 2025 SakhiGo. All rights reserved.</p>
      </footer>

      {/* LOCATION MODAL */}
      {showLocation && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50"
          onClick={() => { setShowLocation(false); setLocationSearch(""); }}
        >
          <div
            className="w-full max-w-md rounded-t-2xl sm:rounded-2xl bg-background p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-semibold">Choose delivery location</h2>
              <button
                onClick={() => { setShowLocation(false); setLocationSearch(""); }}
                className="text-muted-foreground hover:text-foreground text-xl leading-none"
              >
                ✕
              </button>
            </div>
            <div className="relative mb-4">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={locationSearch}
                onChange={(e) => setLocationSearch(e.target.value)}
                placeholder="Search your area..."
                className="h-11 w-full rounded-xl border border-border bg-card pl-11 pr-4 text-sm outline-none focus:border-sage"
                autoFocus
              />
            </div>
            <div className="max-h-64 overflow-y-auto space-y-1">
              {filteredLocalities.map((l) => (
                <button
                  key={`${l.area}-${l.pincode}`}
                  onClick={() => {
                    setLocation(l.area);
                    setShowLocation(false);
                    setLocationSearch("");
                  }}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm hover:bg-muted transition-colors ${location === l.area ? "bg-sage/10 font-semibold" : ""}`}
                >
                  <MapPin className="h-4 w-4 shrink-0 text-sage" />
                  <span className="flex-1">
                    <span className="font-medium">{l.area}</span>
                    <span className="ml-2 text-xs text-muted-foreground">{l.city} · {l.pincode}</span>
                  </span>
                  {location === l.area && <span className="text-sage text-xs">✓</span>}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

function CartIcon() {
  const { count } = useCart();
  return (
    <Link to="/cart" aria-label="Cart" className="relative grid h-10 w-10 place-items-center rounded-full text-foreground transition-colors hover:bg-secondary">
      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.7} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" strokeLinecap="round" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 10a4 4 0 01-8 0" />
      </svg>
      {count > 0 && (
        <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[11px] font-semibold text-primary-foreground">
          {count}
        </span>
      )}
    </Link>
  );
}

function ProductCard({ p }: { p: (typeof products)[number] }) {
  const { add, setQty, lines } = useCart();
  const line = lines.find((l) => l.productId === p.id);
  const qty = line?.qty ?? 0;

  return (
    <article className="group flex min-w-0 flex-col">
      <Link to="/product/$id" params={{ id: p.id }} className="relative block">
        <div className="aspect-square overflow-hidden rounded-xl bg-muted">
          <img
            src={p.image}
            alt={p.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=400&q=80";
            }}
          />
        </div>
        {p.mrp && p.mrp > p.price && (
          <span className="absolute left-2 top-2 rounded-sm bg-background/95 px-2 py-1 text-[10px] font-bold text-primary">
            -{Math.round((1 - p.price / p.mrp) * 100)}%
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col pt-3">
        <Link to="/product/$id" params={{ id: p.id }} className="flex-1">
          <p className="text-[10px] font-bold uppercase text-sage">{p.brand}</p>
          <h3 className="mt-1 line-clamp-2 text-xs font-semibold leading-snug text-foreground">{p.name}</h3>
          <p className="mt-1 text-[11px] text-muted-foreground">{p.size}</p>
        </Link>
        <div className="mt-2 flex items-center justify-between gap-1">
          <div className="flex flex-wrap items-baseline gap-x-1.5">
            <span className="text-[13px] font-bold">{formatPrice(p.price)}</span>
            {p.mrp && p.mrp > p.price && (
              <span className="text-[10px] text-muted-foreground line-through">{formatPrice(p.mrp)}</span>
            )}
          </div>
          {qty === 0 ? (
            <Button
              variant="outline"
              size="icon"
              onClick={() => add(p.id)}
              aria-label={`Add ${p.name}`}
              className="h-8 w-8 shrink-0 rounded-full border-sage text-sage transition-transform active:scale-90"
            >
              <Plus className="h-4 w-4" strokeWidth={2.5} />
            </Button>
          ) : (
            <div className="flex items-center rounded-full bg-sage text-sage-foreground">
              <Button variant="ghost" size="icon" onClick={() => setQty(p.id, qty - 1)} className="h-8 w-7 rounded-full text-sage-foreground hover:bg-sage hover:text-sage-foreground">
                <Minus className="h-3.5 w-3.5" strokeWidth={2.5} />
              </Button>
              <span className="min-w-4 text-center text-xs font-semibold tabular-nums">{qty}</span>
              <Button variant="ghost" size="icon" onClick={() => setQty(p.id, qty + 1)} className="h-8 w-7 rounded-full text-sage-foreground hover:bg-sage hover:text-sage-foreground">
                <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
              </Button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

function CatChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <Button
      variant={active ? "default" : "outline"}
      onClick={onClick}
      className={`h-9 shrink-0 rounded-full px-4 text-xs font-semibold transition-colors ${active ? "bg-foreground text-background hover:bg-foreground/90" : "border-border bg-background text-foreground hover:border-sage"}`}
    >
      {label}
    </Button>
  );
}

function getCategoryIcon(name: string) {
  const icons: Record<string, JSX.Element> = {
    "Pads": (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-6 w-6">
        <rect x="4" y="6" width="16" height="12" rx="6" />
        <path d="M8 12h8" strokeLinecap="round" />
      </svg>
    ),
    "Tampons": (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-6 w-6">
        <path d="M12 3v18M9 6c0 0 1.5 2 3 2s3-2 3-2" strokeLinecap="round" />
        <ellipse cx="12" cy="6" rx="3" ry="2" />
      </svg>
    ),
    "Cups": (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-6 w-6">
        <path d="M8 3l-2 13h12L16 3H8z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6 16c0 2.2 2.7 4 6 4s6-1.8 6-4" strokeLinecap="round" />
      </svg>
    ),
    "Pain Relief": (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-6 w-6">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v8M8 12h8" strokeLinecap="round" />
      </svg>
    ),
    "Wipes": (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-6 w-6">
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <path d="M4 9h16M9 9v11" strokeLinecap="round" />
      </svg>
    ),
    "Kids Care": (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-6 w-6">
        <circle cx="12" cy="8" r="4" />
        <path d="M6 20c0-3.3 2.7-6 6-6s6 2.7 6 6" strokeLinecap="round" />
      </svg>
    ),
    "Women Wellness": (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-6 w-6">
        <circle cx="12" cy="10" r="6" />
        <path d="M12 16v6M9 19h6" strokeLinecap="round" />
      </svg>
    ),
    "Safety": (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-6 w-6">
        <path d="M12 3l8 4v5c0 4.4-3.4 8.5-8 9.5C7.4 20.5 4 16.4 4 12V7l8-4z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  };
  return icons[name] || (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-6 w-6">
      <circle cx="12" cy="12" r="9" />
    </svg>
  );
}