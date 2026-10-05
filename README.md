# SakhiGo

Quick-commerce mobile web app for delivering menstrual hygiene products in 15–20 minutes.
Built with TanStack Start (React 19 + Vite 7), Tailwind CSS v4 and shadcn/ui.

## Run locally

1. Install [Bun](https://bun.sh) (or Node 20+ with npm — commands below use Bun).
2. Install dependencies:

   ```bash
   bun install
   ```

3. Start the dev server:

   ```bash
   bun run dev
   ```

4. Open http://localhost:8080

## Build for production

```bash
bun run build
```

## Project structure

```
src/
  assets/           Product and editorial images
  components/
    PhoneShell.tsx  Shared mobile shell (header, cart badge, sticky footer)
    ui/             shadcn/ui primitives
  lib/
    sakhigo-data.ts  Product catalog, categories, address autocomplete data
    cart-store.tsx   Cart context with localStorage persistence
  routes/
    __root.tsx       Root layout, fonts, metadata
    index.tsx        Home: editorial hero, search, categories, product grid
    product.$id.tsx  Product detail with add-to-cart / Buy Now
    cart.tsx         Cart: quantities, remove, subtotal
    checkout.tsx     Checkout form (name, address, phone) with address autocomplete
    confirmation.tsx Order confirmation with live delivery countdown & tracking timeline
  styles.css         Theme tokens (blush & sage palette, Sora/Manrope fonts)
```

No backend or payment gateway is required — orders are confirmed in-app.
