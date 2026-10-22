#!/usr/bin/env node
/* Static site generator. No dependencies.
     node build/build.js [--url https://yourdomain.in/] [--ga4 G-XXXX] [--plausible yourdomain.in]
   Reads the content in build/ and writes the finished site into the repo root:
     index.html, tools/, guides/, products/<slug>/, and the same under hi/ for Hindi,
     plus sitemap.xml, robots.txt and 404.html. */
const fs = require('fs');
const path = require('path');
const SITE = require('./site');
const { makeT, compareShape } = require('./lib');
const en = require('./i18n/en');
const hi = require('./i18n/hi');
const productsEn = require('./data/products.en');
const productsHiOverrides = require('./data/products.hi');

const ROOT = path.resolve(__dirname, '..');
const LANGS = ['en', 'hi'];
const DICT = { en, hi };

// ---- 1. make sure both languages are complete ----
const errors = [];
compareShape(en, hi, 'i18n', errors);
Object.keys(productsEn).forEach((slug) => {
  if (!productsHiOverrides[slug]) { errors.push(`products.hi: missing ${slug}`); return; }
  const e = productsEn[slug], h = productsHiOverrides[slug];
  ['name', 'tagline', 'highlights', 'overview', 'specs', 'sizesTitle', 'sizesHead', 'applications', 'features', 'packing', 'faqs'].forEach((k) => {
    if (!(k in h)) errors.push(`products.hi.${slug}.${k}: missing`);
  });
  if (h.specs && e.specs.length !== h.specs.length) errors.push(`products.hi.${slug}.specs: length ${e.specs.length} vs ${h.specs.length}`);
  if (h.faqs && e.faqs.length !== h.faqs.length) errors.push(`products.hi.${slug}.faqs: length mismatch`);
  if (h.highlights && e.highlights.length !== h.highlights.length) errors.push(`products.hi.${slug}.highlights: length mismatch`);
  if (h.applications && e.applications.length !== h.applications.length) errors.push(`products.hi.${slug}.applications: length mismatch`);
  if (h.sizes && e.sizes.length !== h.sizes.length) errors.push(`products.hi.${slug}.sizes: rows ${e.sizes.length} vs ${h.sizes.length}`);
  if (h.sizesHead && e.sizesHead.length !== h.sizesHead.length) errors.push(`products.hi.${slug}.sizesHead: length mismatch`);
});
if (errors.length) { console.error('Build stopped. Translation problems:\n  ' + errors.join('\n  ')); process.exit(1); }

// ---- 2. data per language ----
const mergeProduct = (lang, slug) => {
  const e = productsEn[slug];
  if (lang === 'en') return e;
  return Object.assign({}, e, productsHiOverrides[slug], { sizes: productsHiOverrides[slug].sizes || e.sizes });
};
const products = { en: {}, hi: {} };
Object.keys(productsEn).forEach((slug) => LANGS.forEach((l) => { products[l][slug] = mergeProduct(l, slug); }));

const guidesFor = (lang) => DICT[lang].guides.articles;

// ---- 3. page registry ----
const pages = [{ path: '', page: 'home' }, { path: 'tools/', page: 'tools' }, { path: 'guides/', page: 'guides' }];
Object.keys(en.guides.articles).forEach((s) => pages.push({ path: 'guides/' + s + '/', page: 'guide', slug: s }));
Object.keys(productsEn).forEach((s) => pages.push({ path: 'products/' + s + '/', page: 'product', slug: s }));

const templates = {
  home: require('./pages/home'),
  tools: require('./pages/tools'),
  guides: (ctx) => require('./pages/guides').index(ctx),
  guide: (ctx, slug) => require('./pages/guides').article(ctx, slug),
  product: require('./pages/product')
};

function makeCtx(lang, pg, single) {
  const depth = single ? 1 : pg.path.split('/').filter(Boolean).length + (lang === 'hi' ? 1 : 0);
  const rel = depth ? '../'.repeat(depth) : '';
  const dict = DICT[lang];
  const ctx = {
    lang, dict, t: makeT(dict, lang), rel, page: pg.page, path: pg.path,
    products: products[lang], productsEn: products.en, guides: guidesFor(lang), guidesEn: guidesFor('en'),
    // links name index.html explicitly so the site also works when opened straight from a folder (file://)
    single: !!single,
    link: single
      // single-page build: pages are in-page views, e.g. products/foam/ -> #/products/foam, other language -> its own file
      ? (p, l) => ((l || lang) === lang ? '' : (l === 'hi' ? 'hi.html' : 'index.html')) + '#/' + p.replace(/\/$/, '')
      : (p, l) => (rel || './') + ((l || lang) === 'hi' ? 'hi/' : '') + p + (p === '' || p.endsWith('/') ? 'index.html' : ''),
    abs: (p, l) => SITE.url + ((l || lang) === 'hi' ? 'hi/' : '') + p
  };
  return ctx;
}

// ---- 4. write ----
let count = 0;
const written = new Set();
function write(rel, content) {
  const file = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  written.add(rel); count++;
}
pages.forEach((pg) => LANGS.forEach((lang) => {
  const ctx = makeCtx(lang, pg);
  const html = templates[pg.page](ctx, pg.slug);
  write((lang === 'hi' ? 'hi/' : '') + pg.path + 'index.html', html);
}));

// ---- single-page copy (single/index.html, single/hi.html): every page is a view inside one document ----
// For checking the whole site in one place. Not indexed by search engines (noindex) and not in the sitemap.
LANGS.forEach((lang) => {
  const render = (pg) => templates[pg.page](makeCtx(lang, pg, true), pg.slug);
  const mainRe = /<main id="main"[^>]*>([\s\S]*?)<\/main>/;
  const views = {};
  pages.filter((pg) => pg.page !== 'home').forEach((pg) => {
    const doc = render(pg);
    views[pg.path.replace(/\/$/, '')] = {
      title: (doc.match(/<title>([^<]*)<\/title>/) || [])[1].replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"'),
      page: pg.page, path: pg.path, html: '<div class="pv">' + doc.match(mainRe)[1] + '</div>'
    };
  });
  let doc = render(pages[0]);
  doc = doc.replace(mainRe, (m, inner) => '<main id="main"><div id="view">' + inner + '</div></main>\n  <script type="application/json" id="eii-views">' + JSON.stringify(views).replace(/</g, '\\u003c') + '</script>');
  write('single/' + (lang === 'hi' ? 'hi.html' : 'index.html'), doc);
});

// sitemap (with language alternates) and robots
const url = (p, l) => SITE.url + (l === 'hi' ? 'hi/' : '') + p;
const prio = (pg) => (pg.page === 'home' ? '1.0' : pg.page === 'product' ? '0.8' : '0.7');
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${pages.map((pg) => LANGS.map((lang) => `  <url>
    <loc>${url(pg.path, lang)}</loc>
    <xhtml:link rel="alternate" hreflang="en-IN" href="${url(pg.path, 'en')}"/>
    <xhtml:link rel="alternate" hreflang="hi-IN" href="${url(pg.path, 'hi')}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${url(pg.path, 'en')}"/>
    <priority>${prio(pg)}</priority>
  </url>`).join('\n')).join('\n')}
</urlset>
`;
write('sitemap.xml', sitemap);
write('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${SITE.url}sitemap.xml\n`);

// 404 (GitHub Pages / Netlify serve this for unknown addresses). Absolute-from-root links via <base> are not
// possible on sub-folder hosting, so it links relative to the site url.
write('404.html', `<!DOCTYPE html><html lang="en-IN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><title>Page not found | Electrical Insulation India</title>
<style>body{margin:0;min-height:100vh;display:grid;place-items:center;font-family:system-ui,sans-serif;background:#f6f4ef;color:#18222d;text-align:center;padding:24px}h1{font-size:2rem;margin:0 0 8px}p{margin:0 0 20px;color:#566170}a{display:inline-block;margin:4px;padding:12px 20px;border-radius:6px;background:#12263f;color:#fff;text-decoration:none;font-weight:600}a.o{background:none;color:#12263f;border:1.5px solid #12263f}</style></head>
<body><main><h1>Page not found / पेज नहीं मिला</h1><p>The page you were looking for is not here. · आप जो पेज ढूंढ रहे थे वो यहां नहीं है।</p>
<a href="${SITE.url}">Home</a><a class="o" href="${SITE.url}hi/">होम (हिन्दी)</a><a class="o" href="${SITE.url}products/pvc-sheets/">Rigid PVC sheet</a></main></body></html>
`);

console.log(`Built ${count} files for ${SITE.url} (${pages.length} pages x ${LANGS.length} languages).`);
if (/example\.com/.test(SITE.url)) console.log('Note: site url is still the placeholder. Run with --url https://yourdomain.in/ before publishing.');
