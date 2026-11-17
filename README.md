# Beracah Impex FZCO website

A fast static website with one serverless function, ready for Vercel. No build step, no frameworks, no npm install needed.

## What's inside

| Path | What it is |
| --- | --- |
| `index.html`, `about.html`, `services.html`, `products.html`, `product.html`, `quote.html`, `contact.html`, `suppliers.html`, `404.html` | The pages (generated, see "Editing pages") |
| `assets/js/products.js` | **The product catalogue.** Edit this to add, remove or change products |
| `assets/js/main.js` | Menu, animations, catalogue, quote basket, forms |
| `assets/css/styles.css` | All styles (brand colours are at the top) |
| `assets/img/` | Logo (vector SVGs traced from the company profile), favicon, social share image, dotted map |
| `assets/fonts/` | Self-hosted fonts (Marcellus, IBM Plex Sans, Noto Serif Ethiopic) |
| `assets/docs/` | Downloadable company profile PDF |
| `api/quote.js` | Vercel function that emails quote requests, contact messages and supplier registrations |
| `vercel.json` | Clean URLs (`/about` instead of `/about.html`), caching and security headers |
| `_src/` | Page templates and the build script (not deployed) |

## Deploy to Vercel

**Option A: Git (recommended)**
1. Push this folder to a GitHub repository.
2. In Vercel, choose **Add New → Project**, import the repo.
3. Framework preset: **Other**. Leave build command and output directory empty.
4. Deploy.

**Option B: CLI**
```bash
npm i -g vercel
cd "Beracah Impex Website"
vercel          # preview deployment
vercel --prod   # production
```

Then add the domain in **Project → Settings → Domains** (`beracahimpex.com` and `www.beracahimpex.com`) and update the DNS records Vercel shows you.

## Turn on form emails (Resend)

The quote, contact and supplier forms post to `/api/quote`, which sends an email through [Resend](https://resend.com).

1. Create a Resend account and **verify the domain** `beracahimpex.com` (Resend gives you DNS records to add).
2. Create an API key.
3. In Vercel, go to **Project → Settings → Environment Variables** and add:

| Name | Example value |
| --- | --- |
| `RESEND_API_KEY` | `re_...` |
| `MAIL_TO` | `info@beracahimpex.com` (comma-separate several addresses) |
| `MAIL_FROM` | `Beracah Impex Website <website@beracahimpex.com>` |

4. Redeploy.

Until this is set up, the forms still work: if sending fails, the visitor gets **Send by WhatsApp** and **Send by email** buttons with everything they typed already filled in. Replies to the notification email go straight to the visitor (`reply_to` is set to their address).

## Editing products

Open `assets/js/products.js`. Each product looks like this:

```js
{
  id: "truck-tyres",            // used in the URL: /product?id=truck-tyres
  division: "auto",             // food | build | chem | auto
  sym: "Tt",                    // the two letters on the tile
  hs: "4011.20",                // indicative HS code
  name: "Heavy-duty truck tyres",
  summary: "One line for cards.",
  description: "A short paragraph for the product page.",
  origin: "China",
  packaging: "Loose-loaded in 40ft HQ containers",
  moq: "1 × 40ft HQ container",
  specs: { "Sizes": "295/80R22.5, ...", "Patterns": "..." },
  uses: ["Long-haul trucking", "Trailers"],
  note: "Optional warning shown under the spec table"
}
```

Changes appear automatically on the home page tiles, the commodity ticker, the catalogue, product pages and the quote basket. If you add products, also add their URLs to `sitemap.xml`.

> The specifications in the file are typical industry values written as a starting point. Replace them with Beracah Impex's confirmed specifications, origins and minimum orders before launch.

## Editing pages

Header, footer and page bodies are generated from `_src/` so they stay identical on every page.

1. Edit `_src/pages/<page>.html` (page content) or `_src/build.py` (header, footer, navigation, hero map).
2. Run `python _src/build.py` from this folder.
3. Commit and deploy.

Small text fixes can also be made directly in the root `.html` files, but they will be overwritten the next time the build script runs.

## Preview locally

```bash
npx serve .
```
Then open http://localhost:3000. (`serve` supports the same clean URLs as Vercel. Forms fall back to WhatsApp/email locally because the API function only runs on Vercel or with `vercel dev`.)

## Features

- Animated hero map: shipping routes from China, Indonesia, India and the UAE draw in to Djibouti, with cargo moving along them and the inland leg to Addis Ababa
- Scrolling commodity ticker built from the product list
- Scroll-linked "How your order reaches you" timeline with a ship that sails as you scroll
- Product catalogue with division filters and search (name, origin, HS code, uses)
- Product pages with spec tables, quantity and unit, WhatsApp enquiry and a print-ready spec sheet
- Multi-product quote basket stored in the visitor's browser, with delivery terms, destination port and payment method
- Contact form, supplier registration form, Google Map, floating WhatsApp button
- SEO basics: page titles and descriptions, Open Graph image, Organization structured data, sitemap, robots.txt
- Respects "reduce motion" settings, keyboard accessible, responsive down to small phones
- Smooth page-to-page transitions in browsers that support them
