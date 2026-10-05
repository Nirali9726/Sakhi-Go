import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { CartProvider, useCart } from "@/lib/cart-store";
import { formatPrice } from "@/lib/sakhigo-data";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your cart | SakhiGo" },
      { name: "description", content: "Review your essentials and prepare for discreet delivery." },
    ],
  }),
  component: () => (
    <CartProvider>
      <CartPage />
    </CartProvider>
  ),
});

const DELIVERY = 29;

function CartPage() {
  const { items, setQty, remove, subtotal } = useCart();
  const nav = useNavigate();
  const total = subtotal > 0 ? subtotal + DELIVERY : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* HEADER */}
      <header className="sticky top-0 z-10 border-b border-border/60 bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => nav({ to: "/" })}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              ← Back
            </button>
            <h1 className="font-display text-lg font-semibold">Your Cart</h1>
          </div>
          <Link to="/" className="font-display text-xl font-semibold text-foreground">
            Sakhi<span className="text-primary">Go</span>
          </Link>
        </div>
      </header>

      {items.length === 0 ? (
        <div className="flex flex-col items-center px-8 pt-20 text-center">
          <div className="grid h-20 w-20 place-items-center rounded-full bg-blush">
            <ShoppingBag className="h-8 w-8 text-primary" />
          </div>
          <h2 className="mt-5 font-display text-xl font-semibold">Your cart is empty</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Add a few essentials and we'll have them at your door in 20 minutes.
          </p>
          <Link
            to="/"
            className="mt-6 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
          >
            Browse products
          </Link>
        </div>
      ) : (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* CART ITEMS */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {items.map(({ product, qty }) => (
                  <div
                    key={product.id}
                    className="flex gap-4 rounded-xl border border-border bg-card p-4"
                  >
                    <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-muted">
                      <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=400&q=80";
                        }}
                      />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                        {product.brand}
                      </p>
                      <h3 className="text-sm font-semibold leading-snug">{product.name}</h3>
                      <p className="text-[11px] text-muted-foreground">{product.size}</p>
                      <div className="mt-auto flex items-center justify-between pt-2">
                        <span className="text-sm font-semibold">
                          {formatPrice(product.price * qty)}
                        </span>
                        <div className="flex items-center gap-1 rounded-full border border-border">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setQty(product.id, qty - 1)}
                            className="h-8 w-8 text-primary"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="min-w-5 text-center text-sm font-semibold tabular-nums">
                            {qty}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setQty(product.id, qty + 1)}
                            className="h-8 w-8 text-primary"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(product.id)}
                      className="h-8 w-8 self-start text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* ORDER SUMMARY */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 rounded-xl border border-border bg-card p-6">
                <h2 className="font-display text-lg font-semibold mb-4">Order Summary</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Delivery (15–20 min)</span>
                    <span className="font-medium">{formatPrice(DELIVERY)}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-border pt-3">
                    <span className="font-display text-base font-semibold">Total</span>
                    <span className="font-display text-xl font-semibold">{formatPrice(total)}</span>
                  </div>
                </div>
                <Button
                  onClick={() => nav({ to: "/checkout" })}
                  className="mt-6 h-12 w-full rounded-xl"
                >
                  Proceed to Checkout · {formatPrice(total)}
                </Button>
                <p className="mt-3 text-center text-[11px] text-muted-foreground">
                  Cash on delivery. No payment needed now.
                </p>
                <Link
                  to="/"
                  className="mt-3 block text-center text-xs text-primary hover:underline"
                >
                  Continue shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}