# Electrical Insulation India: website

Static website for a wholesale supplier of **PVC sheets (electrical insulation) and packaging material**, in **English and Hindi**.
Goal: visitors contact the business on **WhatsApp, phone or email**.

HTML, CSS and a little vanilla JavaScript. No framework and no runtime dependencies (the 3D models are one pre-built file, `assets/models3d.js`). The pages are generated from one set of content files by a small Node script, and the generated pages are committed, so **hosting needs no build step**.

## Two ways to look at it

| | Open this | What it is |
|---|---|---|
| **Main site (multi-page)** | `index.html` (English), `hi/index.html` (Hindi) | Every product, tool and guide is its own page with its own address. This is the one to publish: it is what search engines index. |
| **Single-page copy (for checking)** | `single/index.html` (English), `single/hi.html` (Hindi) | The same site inside **one page**: products, tools and guides open in place, the address bar only changes after the `#`. Easy to click through everything. It is marked *noindex* and is not in the sitemap, so it never competes with the main site. |

Both are generated from the same content (`node build/build.js`), so they always match. Both work by double-clicking the file; no web server needed.

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
site-config.json  the on / off switches (which products, sections, tools ... are shown)
admin/            the control panel (npm run admin): server.js + index.html
build/config.js catalog.js  check the switches / what depends on what
style.css         all styles (tokens at the top, light + dark theme, Hindi type)
models3d/         source of the 3D product models (three.js); built into assets/models3d.js
build/build-3d.js bundles models3d/ into assets/models3d.js (only when you change a model)
view.js start.js  small helpers: re-run page scripts on each view; in-page router for the single-page copy
script.js         menu, theme, nav, scroll effects, contact form
basket.js         enquiry list
quote-builder.js  WhatsApp message builder on product pages
tools.js          calculators, fit checker, thickness guide
analytics.js      click tracking (off until you add an ID)
assets/           favicon, og-image.png, fonts (IBM Plex + Noto Sans Devanagari), animated product art, models3d.js (the 3D models, built file)
index.html, hi/, products/, tools/, guides/, single/, sitemap.xml, robots.txt, 404.html   <- generated, do not edit by hand
```

## The home page and product pages

* **Hero:** a fixed two-line heading, chips for who you supply, a big WhatsApp button and the phone number as a plain link. Directly under it is **one strip with the ordering facts** (standard sheet, GST invoice + LR copy, dispatch, samples). The facts come from `home.trust` in `build/i18n/`; the sheet size is hidden automatically if no PVC product is shown.
* **Calm motion:** the rotating headline word, scrolling strip, card tilt, magnetic buttons and moving circuit lines are gone. What moves: the hero 3D stack (with the spark), and a product card's 3D model while you point at it (it holds still otherwise, which also saves battery).
* **Phones:** product cards sit two across (short, with a small "+" button); on a product page a bar at the bottom holds the product's first question and the WhatsApp button and stays in step with the quote form; it slides away while the full form is on screen.
* **PVC sheet and Cut-to-size pages:** a thickness slider and colour chips (grey, white, black) change the 3D model, show the weight per sheet (PVC) and fill in the quote form and WhatsApp message. Using the form directly moves the slider too.
* **Forms:** a problem is shown right under the field it belongs to; after sending, a note says WhatsApp / the email app should open, with a link in case a popup blocker stopped it. The 404 page lists your products.
* **3D follows the theme:** a cooler light and an edge light on dark backgrounds, softer on light.

## Choose what the website shows (control panel)

You decide which products, sections, tools, guides and extras are on the website. Switch something off and the **whole site is rebuilt to match**: nothing is left behind and nothing points at a page that is gone.

```bash
npm run admin        # opens the control panel in your browser (needs Node; nothing else to install)
```

Tick or untick, check the **What will change** box, press **Save and rebuild website**.

* **Preview my changes** opens the website with your current ticks, saved or not, in a window (computer or phone size, any page, English or Hindi). Nothing is changed on disk until you save.
* **Order:** drag a product card, or use its ▲ ▼ buttons, to choose which product comes first on the home page and in the contact form. (The big PVC card is used only while PVC is first and Cut-to-size second; otherwise all cards are the same size, so there is never a gap.)
* **Go back to previous settings** undoes your last save. **Reset to standard settings** puts every switch and the order back.
* **Publish now** saves the change in git and sends it to GitHub, like `git add -A`, `git commit`, `git push`. It shows the branch and the files and asks you to confirm first, and only works when everything is saved. If it cannot send (no internet or GitHub login), it says so and keeps the change safe in git. Not using git? Upload the changed files by hand.

The panel runs only on your computer (127.0.0.1); it is not part of the published site.

| You can switch off | What happens automatically |
|---|---|
| **A product** (8) | Its page (English and Hindi), home card, hero picture / chip, ticker word, related-product links on other pages, contact-form entry, starter lists and sitemap entry go. Tools, guides and FAQ answers that are only about it hide themselves (the panel tells you which, and why). Old enquiry lists in visitors' browsers drop it. If PVC is hidden, the hero shows the first product that is left. The catalogue layout adapts to any number of products (never a gap). At least one product must stay. |
| **Sections** | Industries, Tools, How to order, About, Guides, FAQ, the map. Switching off Tools or Guides also removes their pages, menu and footer links. |
| **Single industries, tools, guides, FAQ answers** | Each has its own switch. |
| **Extras** | Hindi version (the whole `/hi/` site, language button and hreflang tags go), 3D models, floating WhatsApp button, scrolling product strip (off by default), light/dark switch. |
| **Announcement bar** | A strip above the menu (for example "Closed on Diwali"), English and Hindi. |

Also in the panel: **Home page text** (the heading, intro and Google title; change them when you hide a product so they stop mentioning it) and **Publishing details** (website address, Google Analytics ID, review link). These are saved in `site-config.json`, so a rebuild never loses them.

Everything is stored in **`site-config.json`** (including `order`, the list of products in the order you want them shown). You can edit it by hand instead and run `node build/build.js`; a wrong value stops the build with a plain message. `node build/build.js --dry` shows what would change without writing anything. Which tool / guide / FAQ answer belongs to which product is listed in `build/catalog.js`.

Not in the panel (still in `build/site.js` and `build/i18n/`): phone number, email, address and opening hours, and all other wording.

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
| **Product photos.** The pictures in `assets/products/` are animated illustrations. These are the fallback shown before / without the 3D models. To show real photos instead, remove the `data-model=...` attributes in `build/pages/home.js` and `build/pages/product.js`, replace each file with a photo of your stock (same name, 4:3, plain light background), and rebuild. To use `.jpg`, replace `.svg` with `.jpg` in `build/pages/*.js`. | `assets/products/` |
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

**Easiest:** download or clone the repo and double-click `index.html`. Every page link names its `index.html`, so the whole site (Hindi, products, tools, guides, enquiry list) works straight from the folder, with no server.

Or serve it like a real host would:

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
Upload everything except `build/`, `admin/`, `models3d/`, `node_modules/`, `site-config.json`, `README.md`, `package.json` and (optionally) `single/` (index.html, hi/, products/, tools/, guides/, assets/, the .js and .css files, sitemap.xml, robots.txt, 404.html) into `public_html/` using File Manager or FTP.

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
- **3D product models.** The product pictures (home page cards, hero stack, each product page) are real-time 3D models of PVC sheets, cut-to-size panels, stretch film, BOPP tape, bubble wrap, EPE foam, PP strapping and edge guards. They turn slowly, can be dragged to rotate, and each has its own movement (sheets lift, panels separate, film and tape tails wave, foam squashes; a spark is stopped by the PVC stack in the hero). They are built in code, so there are no model files. `assets/models3d.js` (about 520 KB, 130 KB compressed) loads only after the page has finished loading, and only if the browser supports WebGL and the visitor is not saving data. It is also skipped on weak devices (under 4 GB of memory or fewer than 4 CPU cores) and on browsers with no graphics card (software rendering), and it switches itself off, back to the illustrations, if frames turn out to be slow. Until it is ready, and wherever it cannot run, the flat illustration in `assets/products/` is shown, so nothing is ever missing. With "reduce motion" on, the models stay still (they can still be dragged). To change a model: edit `models3d/models.js`, run `npm install` once, then `npm run build:3d`, and commit `assets/models3d.js`. three.js is MIT licensed.
- Animations respect the visitor's "reduce motion" setting. Pointer effects (tilt, spotlight, magnetic buttons) only run on mouse / trackpad.
- Internal links point at `.../index.html` (for example `tools/index.html`) so they also work from a downloaded folder. Search engines are told the clean address through each page's canonical link and the sitemap.
- Old links such as `index.html#/product/foam` and `#showcase` still work and are redirected to the new pages.
- Page-to-page fade-slide uses the browser's View Transitions (Chrome, Edge, Safari 18+); other browsers simply load the page.
