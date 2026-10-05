import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Check, Clock, Shield, Truck } from "lucide-react";
import { PhoneShell } from "@/components/PhoneShell";
import { CartProvider, useCart } from "@/lib/cart-store";
import { products, formatPrice } from "@/lib/sakhigo-data";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/product/$id")({
  head: ({ params }) => {
    const product = products.find((p) => p.id === params.id);
    const title = `${product?.name ?? "Product"} | SakhiGo`;
    const description = product?.description ?? "Explore discreet period care delivered by SakhiGo.";
    return { meta: [{ title }, { name: "description", content: description }, { property: "og:title", content: title }, { property: "og:description", content: description }, { property: "og:type", content: "product" }, { name: "twitter:card", content: "summary" }] };
  },
  component: () => (
    <CartProvider>
      <ProductPage />
    </CartProvider>
  ),
});

function ProductPage() {
  const { id } = Route.useParams();
  const product = products.find((p) => p.id === id);
  const { add } = useCart();
  const nav = useNavigate();
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <PhoneShell back title="Not found">
        <div className="p-8 text-center text-sm text-muted-foreground">
          We couldn't find that product. <Link to="/" className="text-primary underline">Back to home</Link>
        </div>
      </PhoneShell>
    );
  }

  const onAdd = () => {
    add(product.id);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <PhoneShell
      back
      footer={
        <div className="flex items-center gap-3 p-4">
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Total</p>
            <p className="font-display text-xl font-semibold leading-tight">{formatPrice(product.price)}</p>
          </div>
          <Button variant="outline"
            onClick={onAdd}
            className="ml-auto h-12 rounded-md border-primary px-4 text-sm text-primary"
          >
            {added ? <><Check className="h-4 w-4" /> Added</> : "Add to cart"}
          </Button>
          <Button
            onClick={() => { add(product.id); nav({ to: "/checkout" }); }}
            className="h-12 rounded-md px-5 text-sm"
          >
            Buy now
          </Button>
        </div>
      }
    >
       <div className="px-6 pt-4">
         <div className="aspect-square w-full overflow-hidden rounded-md bg-blush">
          <img src={product.image} alt={product.name} width={600} height={600} className="h-full w-full object-cover" />
        </div>

        <div className="mt-5">
          <p className="text-[11px] uppercase tracking-wider text-primary">{product.category} · {product.brand}</p>
          <h1 className="mt-1 font-display text-2xl font-semibold leading-tight">{product.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{product.size}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-display text-2xl font-semibold">{formatPrice(product.price)}</span>
            {product.mrp && product.mrp > product.price && (
              <>
                <span className="text-sm text-muted-foreground line-through">{formatPrice(product.mrp)}</span>
                <span className="text-xs font-semibold text-primary">{Math.round((1 - product.price / product.mrp) * 100)}% off</span>
              </>
            )}
          </div>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-foreground/80">{product.description}</p>

        <div className="mt-6 grid grid-cols-3 gap-2">
          <Badge icon={<Clock className="h-4 w-4" />} label="15–20 min" />
          <Badge icon={<Shield className="h-4 w-4" />} label="Discreet pack" />
          <Badge icon={<Truck className="h-4 w-4" />} label="Free delivery" />
        </div>

         <div className="mt-6 border-l-2 border-sage bg-secondary p-4 text-xs text-secondary-foreground">
          Your order arrives in plain, unmarked packaging. No labels, no awkwardness — just care.
        </div>
      </div>
    </PhoneShell>
  );
}

function Badge({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-2xl bg-blush p-3 text-center text-blush-foreground">
      {icon}
      <span className="text-[11px] font-medium leading-tight">{label}</span>
    </div>
  );
}
