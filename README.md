# Electrical Insulation India: website

Static website for a wholesale supplier of **PVC sheets (electrical insulation) and packaging material**, in **English and Hindi**.
Goal: visitors contact the business on **WhatsApp, phone or email**.

HTML, CSS and a little vanilla JavaScript. No framework and no runtime dependencies. The pages are generated from one set of content files by a small Node script, and the generated pages are committed, so **hosting needs no build step**.

## What is on the site

| Page | Address (English / Hindi) |
|---|---|
| Home: hero, products, industries, free tools, how to order, about, guides, FAQ, contact | `/` and `/hi/` |
| 8 product pages with specs, sizes, FAQs and a WhatsApp quote builder | `/products/<name>/` and `/hi/products/<name>/` |
| Tools: PVC weight & cost calculator, cut-to-size fit checker, "Which thickness?" guide | `/tools/` and `/hi/tools/` |
| Buying guides: PVC sheet thickness, stretch film micron | `/guides/...` and `/hi/guides/...` |

Also: **enquiry list** (visitors collect products from any page and send one WhatsApp message), light / dark theme, page transitions, click tracking, `sitemap.xml`, `robots.txt`, `404.html`.

```
build/            the generator and ALL the content
  site.js         business details, site address, analytics IDs
  i18n/en.js hi.js  every sentence on the site, in both languages
  data/           product data (english + hindi), industry starter lists
  layout.js pages/  page templates
  build.js        run this:  node build/build.js
style.css         all styles (tokens at the top, light + dark theme, Hindi type)
script.js         menu, theme, nav, scroll effects, contact form
basket.js         enquiry list
quote-builder.js  WhatsApp message builder on product pages
tools.js          calculators, fit checker, thickness guide
analytics.js      click tracking (off until you add an ID)
assets/           favicon, og-image.png, fonts (IBM Plex + Noto Sans Devanagari), animated product art
index.html, hi/, products/, tools/, guides/, sitemap.xml, robots.txt, 404.html   <- generated, do not edit by hand
```

---

## 1. Editing the site

All text lives in `build/`. **Never edit the generated pages**: change the source, then rebuild.

```bash
node build/build.js --url https://yourdomain.in/      # or: npm run build
```

* Change a sentence: edit `build/i18n/en.js` and the same key in `build/i18n/hi.js`. The build **stops with a list of problems** if a key is missing in either language, so the two can never drift apart.
* Change a product (specs, sizes, FAQs): `build/data/products.en.js` and `products.hi.js`.
* Change phone, email, address, hours: `build/site.js` (the nav strip, footer, contact and structured data all follow).
* WhatsApp messages sent to you are always in **English** (product names and field names), whatever language the visitor used, so they are easy to read and search.

## 2. Before you go live

| What | Where |
|---|---|
| **Live site address.** Currently `https://www.example.com/`. It feeds canonical links, the sitemap, hreflang and share previews. On GitHub Pages use the full address including the folder, e.g. `https://username.github.io/electrical-landing-page/`. | run the build with `--url ...` (or edit `build/site.js`) |
| **Product photos.** The pictures in `assets/products/` are animated illustrations. Replace each with a real photo of your stock (same name, 4:3, plain light background). Photos are static; the card tilt and zoom still apply. To use `.jpg`, replace `.svg` with `.jpg` in `build/pages/*.js` and rebuild. | `assets/products/` |
| **Claims.** Thickness range, test certificates, credit terms, delivery times. Make sure they match what you really offer. | `build/i18n/*.js`, `build/data/products.*.js` |
| **Estimates.** The calculators say "indicative"; the thickness guide and guides are general advice, not an engineering standard. Review the guide text once. | `build/i18n/*.js` (`guides`, `tools`) |
| **GSTIN, Udyam badge** (optional, builds trust) | add to the footer in `build/layout.js` |

Customer reviews and "years in business / number of buyers" figures are not included on purpose. Add them only when real.

## 3. Analytics: which button was clicked how many times

The site records these events: `whatsapp_click`, `call_click`, `email_click`, `map_click`, `review_click`, `add_to_enquiry`, `add_starter_list`, `enquiry_open`, `quote_form_submit`, `tool_use`, `language_switch`. Each carries `where` (hero, nav, float, contact, product_builder, enquiry_list, tool_weight, ...), `item` (product) and `language`.

Nothing is sent until you add an ID:

1. Create a free **Google Analytics 4** property (analytics.google.com) and copy the Measurement ID (`G-XXXXXXXXXX`).
2. Rebuild: `node build/build.js --url https://yourdomain.in/ --ga4 G-XXXXXXXXXX` (or set it in `build/site.js`).
3. In GA4: *Reports > Engagement > Events* shows the counts. Open an event and add the `where` parameter as a custom dimension (*Admin > Custom definitions*) to see **which button** was used. Mark `whatsapp_click` and `call_click` as key events.
4. Prefer a privacy-friendly tool? Use `--plausible yourdomain.in` instead.

To test: open any page with `?debug_analytics` and watch the browser console.
Every WhatsApp message also ends with `(Sent from the website: /page/)`, so you can see which page produced the enquiry even without analytics.
Consider a short privacy note on the site once analytics is on.

## 4. Google Business Profile and search

* Create / claim the profile at business.google.com with the **same name, address and phone** as the site. This matters most for "PVC sheet wholesaler Delhi" searches.
* Copy the profile's review link and rebuild with `--review https://g.page/r/XXXX/review` (and `--gbp <profile url>`). A "Review us on Google" link then appears in the footer and contact section, and the profile is added to the structured data.
* After deploying, add the site to **Google Search Console**, submit `sitemap.xml`, and check the Hindi pages are indexed.
* Each page has its own title, description, canonical, hreflang (English / Hindi), Open Graph image and structured data (business, breadcrumbs, FAQ, articles).

---

## 5. Run locally

Serve the folder (page links such as `tools/` need a web server, opening the file directly will not follow them):

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

---

## 6. Deploy (all free options; the site is static)

### Option A — GitHub Pages (simplest, since this is a GitHub repo)
1. Merge your work into the `main` branch.
2. GitHub repo → **Settings → Pages**.
3. **Source:** *Deploy from a branch* → Branch: `main`, Folder: `/ (root)` → **Save**.
4. After ~1 minute the site is live at `https://<username>.github.io/electrical-landing-page/`.
5. Rebuild with that address so canonical links, the sitemap and share previews are right: `node build/build.js --url https://<username>.github.io/electrical-landing-page/`, then commit the result.

### Option B — Netlify
1. Sign in at [netlify.com](https://www.netlify.com) → **Add new site → Import an existing project** → pick this repo.
2. Build command: *(leave empty)* · Publish directory: `.`
3. Deploy. Or drag-and-drop the project folder onto the Netlify dashboard.

### Option C — Vercel
1. [vercel.com](https://vercel.com) → **Add New → Project** → import this repo.
2. Framework preset: **Other**. Leave build command empty; output directory `.`.
3. Deploy.

### Option D — Any hosting / cPanel
Upload everything except `build/`, `README.md` and `package.json` (index.html, hi/, products/, tools/, guides/, assets/, the .js and .css files, sitemap.xml, robots.txt, 404.html) into `public_html/` using File Manager or FTP.

### Custom domain
Buy a domain (e.g. `.in` / `.com`), then add it in your host's **Domains** settings (GitHub Pages: Settings → Pages → *Custom domain*; Netlify/Vercel: Domains) and create the DNS records they show. HTTPS is enabled automatically. Afterwards rebuild with `--url https://yourdomain.in/` and commit the result.

---

## 7. After deploy checklist

- [ ] Tap the WhatsApp buttons on a phone — chat opens with the pre-filled message.
- [ ] Submit the quote form (WhatsApp and email buttons) and confirm the message arrives.
- [ ] Paste the URL into WhatsApp / [opengraph.xyz](https://www.opengraph.xyz) and check the preview image & title.
- [ ] Run Google [PageSpeed Insights](https://pagespeed.web.dev) / Lighthouse (mobile).
- [ ] Add the site to [Google Search Console](https://search.google.com/search-console) and create a **Google Business Profile** with the same address/phone — this helps local B2B search a lot.
- [ ] Open `/sitemap.xml` and `/robots.txt` on the live site and check they show your real domain, not `example.com`.
- [ ] Send yourself a test enquiry from the enquiry list, in English and in Hindi, and confirm both messages arrive in English.
- [ ] Open the site in Hindi on a phone and check the headings and buttons read well.

## Notes
- The quote form has no backend: it builds a message and opens WhatsApp (`wa.me`) or the visitor's email app. This keeps hosting free and gets leads straight to your phone.
- Keyboard accessible, text contrast checked against WCAG AA in both themes and both languages. Content is visible without JavaScript; the calculators, enquiry list, menu and form need JavaScript.
- Animations respect the visitor's "reduce motion" setting. Pointer effects (tilt, spotlight, magnetic buttons) only run on mouse / trackpad.
- Old links such as `index.html#/product/foam` and `#showcase` still work and are redirected to the new pages.
- Page-to-page fade-slide uses the browser's View Transitions (Chrome, Edge, Safari 18+); other browsers simply load the page.
