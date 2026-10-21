# Electrical Insulation India — Landing Page

Single-page landing site for a wholesale supplier of **PVC sheets (electrical insulation) and packaging material**.
Goal: visitors contact the business on **WhatsApp or email**.

Pure HTML + CSS + a little vanilla JavaScript — no framework, no build step.

```
index.html     page markup, SEO / Open Graph tags, JSON-LD
style.css      mobile-first styles (navy + safety-amber theme)
script.js      mobile menu, scroll reveal, quote form -> WhatsApp / email
assets/        logo, favicon, hero/about placeholder images, og-image.png
```

**Sections:** Navbar · Hero · Features (products) · About · Testimonials · FAQ · Contact (+ quote form) · Footer, plus a floating WhatsApp button.

---

## 1. Before you go live — replace the placeholders

| What | Placeholder | Where |
|---|---|---|
| WhatsApp number | `919999999999` (country code + number, no `+`) | `index.html`, `script.js` |
| Email | `info@example.com` | `index.html`, `script.js` |
| Phone shown on page | `+91 99999 99999` | `index.html` |
| Address / hours / GSTIN | "Your Shop / Godown Address…", "Mon–Sat 9:30–7", `GSTIN: 00XXXXX…` | `index.html` (Contact, Footer, JSON-LD) |
| Live site URL | `https://www.example.com/` | `index.html` (canonical, `og:url`, `og:image`, `twitter:image`, JSON-LD) |
| Stats (10+ years, 500+ buyers) | made-up sample numbers | `index.html` (Hero `.stats`) |
| **Testimonials** | **sample text, "Customer Name"** | `index.html` (`#testimonials`) |
| Images | SVG illustrations | `assets/hero.svg`, `assets/about.svg` → swap for real photos |

Quick find-and-replace for contact details (run from the repo root, edit values first):

```bash
sed -i 's/919999999999/91YOURNUMBER/g; s/info@example.com/you@yourdomain.com/g' index.html script.js
sed -i 's#https://www.example.com/#https://yourdomain.com/#g' index.html
```

> ⚠️ Do not publish the sample testimonials, stats or "10+ years" claims unless they are true for your business.
> Also check the product claims (thickness range, certificates, credit terms) match what you really offer.

### Branding
Theme colours are CSS variables at the top of `style.css` (`--navy-800`, `--amber`, …). Change them to re-theme the whole page.

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
Upload `index.html`, `style.css`, `script.js` and the `assets/` folder into `public_html/` using File Manager or FTP.

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
- Fully keyboard accessible, respects `prefers-reduced-motion`, and works without JavaScript (links still work; only the form and menu need JS).
