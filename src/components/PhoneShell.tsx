import { Link, useRouter } from "@tanstack/react-router";
import { ChevronLeft, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  title?: string;
  back?: boolean;
  showCart?: boolean;
  children: ReactNode;
  footer?: ReactNode;
}

export function PhoneShell({ title, back, showCart = true, children, footer }: Props) {
  const router = useRouter();
  const { count } = useCart();
  return (
    <div className="phone-shell flex flex-col">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border/60 bg-background/95 px-6 py-4 backdrop-blur-md">
        <div className="flex items-center gap-2">
          {back ? (
            <Button variant="ghost" size="icon"
              onClick={() => router.history.back()}
              aria-label="Back"
              className="-ml-2 rounded-full"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          ) : (
            <Link to="/" className="font-display text-xl font-semibold text-foreground">Sakhi<span className="text-primary">Go</span></Link>
          )}
          {title && back && <h1 className="font-display text-lg font-semibold">{title}</h1>}
        </div>
        {showCart && (
           <Link to="/cart" aria-label="Cart" className="relative grid h-10 w-10 place-items-center rounded-full text-foreground transition-colors hover:bg-secondary">
             <ShoppingBag className="h-5 w-5" strokeWidth={1.7} />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[11px] font-semibold text-primary-foreground">
                {count}
              </span>
            )}
          </Link>
        )}
      </header>
       <main className={`flex-1 ${footer ? "pb-28" : "pb-12"}`}>{children}</main>
      {footer && <div className="sticky bottom-0 border-t border-border bg-background/95 backdrop-blur-md">{footer}</div>}
    </div>
  );
}
