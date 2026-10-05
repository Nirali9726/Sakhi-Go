import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { MapPin, Check } from "lucide-react";
import { PhoneShell } from "@/components/PhoneShell";
import { CartProvider, useCart } from "@/lib/cart-store";
import { formatPrice, localities, type Locality } from "@/lib/sakhigo-data";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout | SakhiGo" }, { name: "description", content: "Enter your delivery details for discreet period care in Pune." }, { property: "og:title", content: "Checkout | SakhiGo" }, { property: "og:description", content: "Enter your delivery details for discreet period care in Pune." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: () => (
    <CartProvider>
      <CheckoutPage />
    </CartProvider>
  ),
});

const DELIVERY = 29;

interface FormState {
  name: string;
  flat: string;
  area: string;
  city: string;
  pincode: string;
  phone: string;
}

function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const nav = useNavigate();
  const [form, setForm] = useState<FormState>({ name: "", flat: "", area: "", city: "", pincode: "", phone: "" });
  const [areaFocus, setAreaFocus] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  const total = subtotal + (subtotal > 0 ? DELIVERY : 0);

  const suggestions = useMemo(() => {
    const q = form.area.trim().toLowerCase();
    if (!q) return [];
    return localities.filter((l) => l.area.toLowerCase().includes(q)).slice(0, 5);
  }, [form.area]);

  const pincodeIsServiced = (pin: string) => localities.some((l) => l.pincode === pin);

  const pickLocality = (l: Locality) => {
    setForm((f) => ({ ...f, area: l.area, city: l.city, pincode: l.pincode }));
    setAreaFocus(false);
    setErrors((e) => ({ ...e, area: undefined, city: undefined, pincode: undefined }));
  };

  const validate = (): boolean => {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (form.name.trim().length < 2) e.name = "Please enter your full name";
    if (form.flat.trim().length < 3) e.flat = "Flat / house no. required";
    if (form.area.trim().length < 2) e.area = "Pick your area";
    if (form.city.trim().length < 2) e.city = "City required";
    if (!/^\d{6}$/.test(form.pincode)) e.pincode = "6-digit pincode";
    else if (!pincodeIsServiced(form.pincode)) e.pincode = "Sorry, we don't deliver here yet";
    if (!/^\d{10}$/.test(form.phone)) e.phone = "10-digit mobile number";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (items.length === 0) return;
    if (!validate()) return;
    const address = `${form.flat}, ${form.area}, ${form.city} — ${form.pincode}`;
    try {
      sessionStorage.setItem("sakhigo-last-order", JSON.stringify({
        name: form.name,
        address,
        phone: form.phone,
        total,
        itemCount: items.reduce((s, i) => s + i.qty, 0),
        placedAt: Date.now(),
      }));
    } catch {}
    clear();
    nav({ to: "/confirmation" });
  };

  return (
    <PhoneShell
      back
      title="Checkout"
      showCart={false}
      footer={
        <div className="p-4">
           <Button
            form="checkout-form"
            type="submit"
            disabled={items.length === 0}
             className="h-12 w-full rounded-md"
          >
            Buy now · {formatPrice(total)}
           </Button>
          <p className="mt-2 text-center text-[11px] text-muted-foreground">Cash on delivery. No payment needed now.</p>
        </div>
      }
    >
       <form id="checkout-form" onSubmit={onSubmit} className="space-y-5 px-6 pt-4" noValidate>
        <div>
          <h2 className="font-display text-lg font-semibold">Delivery details</h2>
          <p className="text-xs text-muted-foreground">We'll text you when our delivery partner is on the way.</p>
        </div>

        <Field
          label="Full name"
          value={form.name}
          onChange={(v) => setForm({ ...form, name: v })}
          placeholder="e.g. Priya Sharma"
          error={errors.name}
        />

        <Field
          label="Flat / house no."
          value={form.flat}
          onChange={(v) => setForm({ ...form, flat: v })}
          placeholder="Flat 402, Tower B, Lily Residences"
          error={errors.flat}
        />

        <div className="relative">
          <label className="block">
            <span className="mb-1.5 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Area / locality
              <span className="inline-flex items-center gap-1 normal-case tracking-normal text-[10px] text-primary">
                <MapPin className="h-3 w-3" /> autocomplete
              </span>
            </span>
            <input
              value={form.area}
              onChange={(e) => { setForm({ ...form, area: e.target.value }); setAreaFocus(true); }}
              onFocus={() => setAreaFocus(true)}
              onBlur={() => setTimeout(() => setAreaFocus(false), 150)}
              placeholder="Start typing your area…"
              autoComplete="off"
              className={`w-full rounded-2xl border bg-card px-4 py-3 text-sm outline-none transition-colors ${
                errors.area ? "border-destructive" : "border-border focus:border-primary"
              }`}
            />
          </label>
          {areaFocus && suggestions.length > 0 && (
            <ul className="absolute left-0 right-0 z-20 mt-1 overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
              {suggestions.map((l) => (
                <li key={`${l.area}-${l.pincode}`}>
                     <Button variant="ghost"
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => pickLocality(l)}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm hover:bg-secondary"
                  >
                    <MapPin className="h-4 w-4 shrink-0 text-primary" />
                    <span className="flex-1">
                      <span className="font-medium">{l.area}</span>
                      <span className="ml-1 text-xs text-muted-foreground">{l.city} · {l.pincode}</span>
                    </span>
                     </Button>
                </li>
              ))}
            </ul>
          )}
          {errors.area && <p className="mt-1 text-[11px] text-destructive">{errors.area}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field
            label="City"
            value={form.city}
            onChange={(v) => setForm({ ...form, city: v })}
            placeholder="Pune"
            error={errors.city}
          />
          <Field
            label="Pincode"
            value={form.pincode}
            onChange={(v) => setForm({ ...form, pincode: v.replace(/\D/g, "").slice(0, 6) })}
            placeholder="411001"
            inputMode="numeric"
            error={errors.pincode}
            success={/^\d{6}$/.test(form.pincode) && pincodeIsServiced(form.pincode) ? "Delivers here ✓" : undefined}
          />
        </div>

        <Field
          label="Phone number"
          value={form.phone}
          onChange={(v) => setForm({ ...form, phone: v.replace(/\D/g, "").slice(0, 10) })}
          placeholder="10-digit mobile"
          inputMode="numeric"
          error={errors.phone}
        />

        <div className="rounded-2xl bg-secondary p-4 text-xs italic text-secondary-foreground">
          Delivered discreetly in plain packaging. Your information stays private.
        </div>

        <div className="rounded-2xl border border-border bg-card p-4">
          <h3 className="text-sm font-semibold">Order summary</h3>
          <div className="mt-3 space-y-2 text-sm">
            {items.map(({ product, qty }) => (
              <div key={product.id} className="flex justify-between">
                <span className="text-muted-foreground">{product.name} × {qty}</span>
                <span>{formatPrice(product.price * qty)}</span>
              </div>
            ))}
            <div className="flex justify-between border-t border-border pt-2">
              <span className="text-muted-foreground">Delivery</span>
              <span>{formatPrice(DELIVERY)}</span>
            </div>
            <div className="flex justify-between pt-1 font-semibold">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
        </div>
      </form>
    </PhoneShell>
  );
}

interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  inputMode?: "text" | "numeric";
  error?: string;
  success?: string;
}
function Field({ label, value, onChange, placeholder, inputMode, error, success }: FieldProps) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        inputMode={inputMode}
        className={`w-full rounded-2xl border bg-card px-4 py-3 text-sm outline-none transition-colors ${
          error ? "border-destructive" : "border-border focus:border-primary"
        }`}
      />
      {error && <p className="mt-1 text-[11px] text-destructive">{error}</p>}
      {!error && success && (
        <p className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium text-primary">
          <Check className="h-3 w-3" /> {success}
        </p>
      )}
    </label>
  );
}
