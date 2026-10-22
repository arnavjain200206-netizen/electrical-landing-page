# Electrical Insulation India — Landing Page

Single-page landing site for a wholesale supplier of **PVC sheets (electrical insulation) and packaging material**.
Goal: visitors contact the business on **WhatsApp or email**.

Pure HTML + CSS + a little vanilla JavaScript — no framework, no build step.

```
index.html        page markup, SEO / Open Graph tags, JSON-LD
style.css         all styles (design tokens at the top, light + dark theme)
script.js         mobile menu, theme switch, nav highlight, quote form -> WhatsApp / email
products.js       product catalogue data (specs, sizes, FAQs, WhatsApp form fields)
product-view.js   renders the product detail pages (#/product/<slug>)
assets/           favicon, og-image.png, hero-stack.svg (animated hero art), fonts/ (IBM Plex, self-hosted), products/*.svg (animated)
```

**Motion:** circuit traces with flowing current and a spark that is stopped by the PVC stack (hero), rotating headline word, count-up numbers, scrolling ticker, scroll progress bar, scroll reveals, tilt + spotlight on product cards, magnetic buttons, animated product illustrations, rotating border on the quote form. Pointer effects only run on mouse / trackpad, and everything respects `prefers-reduced-motion` (animations off, content shown as-is). All motion is CSS + a small amount of vanilla JS in `script.js`; no libraries.

**Sections:** Contact strip · Navbar · Hero · Products · How to order · About · FAQ · Contact (+ quote form) · Footer, plus a floating WhatsApp button and a light / dark theme switch.

---

## 1. Before you go live — check these

| What | Where |
|---|---|
| **Product photos.** The images in `assets/products/` are neutral illustrations. Replace each with a real photo of your stock (same file name, 4:3, ideally on a plain light background). Photos are static; the card tilt, spotlight and zoom still apply. | `assets/products/*.svg`. To use `.jpg` files instead, replace `.svg` with `.jpg` in `index.html` and `product-view.js`. |
| Live site URL (`www.example.com`) | `index.html` — canonical, `og:url`, `og:image`, `twitter:image`, JSON-LD `url` |
| WhatsApp number `917982644262`, email, phone | `index.html`, `script.js` (`CONFIG`), `products.js` (`SITE`) |
| Address / hours | `index.html` (strip, About, Contact, Footer, FAQ, JSON-LD) |
| Product claims (thickness range, test certificate, credit terms, delivery times) | `index.html` FAQ + `products.js` — make sure they match what you really offer |
| GSTIN (optional, builds trust) | add to the footer in `index.html` |

Customer reviews and "years in business / number of buyers" figures were removed on purpose. Add them back only when they are real (for example a `#testimonials` section with names and cities you have permission to publish).

Quick find-and-replace for contact details (edit the values first):

```bash
sed -i 's/917982644262/91YOURNUMBER/g; s/arnavjaincena@gmail.com/you@yourdomain.com/g' index.html script.js products.js
sed -i 's#https://www.example.com/#https://yourdomain.com/#g' index.html
```

### Branding
Colours are CSS variables at the top of `style.css` (`--paper`, `--navy`, `--amber`, …; dark theme overrides in `:root[data-theme="dark"]`). Fonts are self-hosted IBM Plex, so the page makes no third-party font requests.

### Open Graph image
`assets/og-image.png` (1200×630) is what WhatsApp / Facebook / LinkedIn show when your link is shared. Replace it with your own banner when you have one.

---

## 2. Run locally

Just open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

---

## 3. Deploy (all free options; the site is static)

### Option A — GitHub Pages (simplest, since this is a GitHub repo)
1. Merge your work into the `main` branch.
2. GitHub repo → **Settings → Pages**.
3. **Source:** *Deploy from a branch* → Branch: `main`, Folder: `/ (root)` → **Save**.
4. After ~1 minute the site is live at `https://<username>.github.io/electrical-landing-page/`.
5. Update the URLs in `index.html` (canonical, `og:*`) to that address.

### Option B — Netlify
1. Sign in at [netlify.com](https://www.netlify.com) → **Add new site → Import an existing project** → pick this repo.
2. Build command: *(leave empty)* · Publish directory: `.`
3. Deploy. Or drag-and-drop the project folder onto the Netlify dashboard.

### Option C — Vercel
1. [vercel.com](https://vercel.com) → **Add New → Project** → import this repo.
2. Framework preset: **Other**. Leave build command empty; output directory `.`.
3. Deploy.

### Option D — Any hosting / cPanel
Upload `index.html`, `style.css`, `script.js`, `products.js`, `product-view.js` and the `assets/` folder into `public_html/` using File Manager or FTP.

### Custom domain
Buy a domain (e.g. `.in` / `.com`), then add it in your host's **Domains** settings (GitHub Pages: Settings → Pages → *Custom domain*; Netlify/Vercel: Domains) and create the DNS records they show. HTTPS is enabled automatically. Afterwards, update the URLs in `index.html` to the final domain.

---

## 4. After deploy checklist

- [ ] Tap the WhatsApp buttons on a phone — chat opens with the pre-filled message.
- [ ] Submit the quote form (WhatsApp and email buttons) and confirm the message arrives.
- [ ] Paste the URL into WhatsApp / [opengraph.xyz](https://www.opengraph.xyz) and check the preview image & title.
- [ ] Run Google [PageSpeed Insights](https://pagespeed.web.dev) / Lighthouse (mobile).
- [ ] Add the site to [Google Search Console](https://search.google.com/search-console) and create a **Google Business Profile** with the same address/phone — this helps local B2B search a lot.
- [ ] Optional: add `robots.txt` and `sitemap.xml` once the final domain is fixed.

## Notes
- The quote form has no backend: it builds a message and opens WhatsApp (`wa.me`) or the visitor's email app. This keeps hosting free and gets leads straight to your phone.
- Keyboard accessible, text contrast checked against WCAG AA in both themes, and works without JavaScript (links still work; the form, menu and product detail pages need JS).
- Product detail pages use `#/product/<slug>` links on the same page. They work for visitors but search engines index only the home page; separate HTML pages per product would be the next step for SEO.
