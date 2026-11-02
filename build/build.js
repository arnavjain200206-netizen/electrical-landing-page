#!/usr/bin/env node
/* Static site generator. No dependencies.
     node build/build.js [--url https://yourdomain.in/] [--ga4 G-XXXX] [--plausible yourdomain.in]
                         [--config site-config.json] [--out <folder>]
   Reads the content in build/ and the switches in site-config.json (which products, sections, tools, guides
   and extras are shown) and writes the finished site into the repo root:
     index.html, tools/, guides/, products/<slug>/, and the same under hi/ for Hindi,
     plus sitemap.xml, robots.txt and 404.html.
   Pages of anything switched off are removed, so nothing stale is left behind. */
const fs = require('fs');
const path = require('path');
const SITE = require('./site');
const CFG = require('./config');
const CAT = require('./catalog');
const { makeT, compareShape } = require('./lib');
const en0 = require('./i18n/en');
const hi0 = require('./i18n/hi');
const productsEn0 = require('./data/products.en');
const productsHiOverrides = require('./data/products.hi');
const industryData = require('./data/industries');

const argv = (n) => { const i = process.argv.indexOf('--' + n); return i > -1 ? process.argv[i + 1] : undefined; };
const ROOT = path.resolve(__dirname, '..');
const OUT = path.resolve(argv('out') || ROOT);
const DRY = process.argv.includes('--dry');          // work out what would change, write nothing
const CONFIG_FILE = path.resolve(argv('config') || path.join(ROOT, 'site-config.json'));
const MANIFEST = OUT === ROOT ? path.join(ROOT, 'build', '.manifest.json') : path.join(OUT, '.build-manifest.json');

const fail = (title, list) => { console.error(`Build stopped. ${title}\n  ` + list.join('\n  ')); process.exit(1); };

// ---- 1. the switches ----
const allSlugs = Object.keys(productsEn0);
const info = { products: allSlugs, guides: Object.keys(en0.guides.articles), faqCount: en0.home.faq.items.length, industryData, names: {} };
allSlugs.forEach((s) => { info.names[s] = productsEn0[s].name; });
{
  const bad = [];
  CAT.productOrder.forEach((s) => { if (!allSlugs.includes(s)) bad.push(`catalog.productOrder lists "${s}" which has no product data`); });
  allSlugs.forEach((s) => { if (!CAT.productOrder.includes(s)) bad.push(`product "${s}" is missing from catalog.productOrder`); });
  if (bad.length) fail('build/catalog.js does not match the products:', bad);
}
const loaded = CFG.load(CONFIG_FILE, info);
if (loaded.errors.length) fail(`${path.relative(process.cwd(), CONFIG_FILE) || 'site-config.json'} has problems:`, loaded.errors);
const cfg = CFG.resolve(loaded.cfg, info);
const LANGS = cfg.langs;

// ---- 2. text edits from site-config.json ("texts"), then make sure both languages are complete ----
const clone = (o) => JSON.parse(JSON.stringify(o));
const DICT = { en: clone(en0), hi: clone(hi0) };
const errors = [];
['en', 'hi'].forEach((l) => {
  Object.keys(cfg.texts[l] || {}).forEach((key) => {
    const parts = key.split('.'); let cur = DICT[l];
    for (let i = 0; i < parts.length - 1; i++) { cur = cur && cur[parts[i]]; }
    const last = parts[parts.length - 1], old = cur && cur[last], val = cfg.texts[l][key];
    if (old === undefined) { errors.push(`texts.${l}."${key}": no such text on the site`); return; }
    if (typeof old === 'string' && typeof val !== 'string') { errors.push(`texts.${l}."${key}": must be text`); return; }
    if (Array.isArray(old) && !(Array.isArray(val) && val.every((x) => typeof x === 'string'))) { errors.push(`texts.${l}."${key}": must be a list of text`); return; }
    if (typeof old === 'object' && !Array.isArray(old)) { errors.push(`texts.${l}."${key}": that is a group, point at a single text inside it`); return; }
    cur[last] = val;
  });
});
const en = DICT.en, hi = DICT.hi;
compareShape(en, hi, 'i18n', errors);
allSlugs.forEach((slug) => {
  if (!productsHiOverrides[slug]) { errors.push(`products.hi: missing ${slug}`); return; }
  const e = productsEn0[slug], h = productsHiOverrides[slug];
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
if (errors.length) fail('Text / translation problems:', errors);

// ---- 3. data per language: only what is switched on ----
const mergeProduct = (lang, slug) => {
  const e = productsEn0[slug];
  if (lang === 'en') return e;
  return Object.assign({}, e, productsHiOverrides[slug], { sizes: productsHiOverrides[slug].sizes || e.sizes });
};
const products = { en: {}, hi: {} };
cfg.productsOn.forEach((slug) => LANGS.forEach((l) => { products[l][slug] = mergeProduct(l, slug); }));
// a product's "related" list may only point at products that are shown
Object.keys(products).forEach((l) => Object.keys(products[l]).forEach((s) => {
  products[l][s] = Object.assign({}, products[l][s], { related: (products[l][s].related || []).filter(cfg.has) });
}));

const guidesFor = (lang) => {
  const all = DICT[lang].guides.articles, out = {};
  Object.keys(all).forEach((s) => { if (cfg.guides[s]) out[s] = all[s]; });
  return out;
};

// ---- 4. page registry ----
const pages = [{ path: '', page: 'home' }];
if (cfg.toolsAny) pages.push({ path: 'tools/', page: 'tools' });
if (cfg.guidesAny) {
  pages.push({ path: 'guides/', page: 'guides' });
  Object.keys(en.guides.articles).forEach((s) => { if (cfg.guides[s]) pages.push({ path: 'guides/' + s + '/', page: 'guide', slug: s }); });
}
cfg.productsOn.forEach((s) => pages.push({ path: 'products/' + s + '/', page: 'product', slug: s }));

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
    lang, langs: LANGS, cfg, dict, t: makeT(dict, lang), rel, page: pg.page, path: pg.path,
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

// ---- 5. write ----
let count = 0;
const written = new Set();
function write(rel, content) {
  if (DRY) { written.add(rel); count++; return; }
  const file = path.join(OUT, rel);
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
const alternates = (pg) => LANGS.map((l) => `    <xhtml:link rel="alternate" hreflang="${l === 'hi' ? 'hi-IN' : 'en-IN'}" href="${url(pg.path, l)}"/>`).join('\n') + `\n    <xhtml:link rel="alternate" hreflang="x-default" href="${url(pg.path, 'en')}"/>`;
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${pages.map((pg) => LANGS.map((lang) => `  <url>
    <loc>${url(pg.path, lang)}</loc>
${alternates(pg)}
    <priority>${prio(pg)}</priority>
  </url>`).join('\n')).join('\n')}
</urlset>
`;
write('sitemap.xml', sitemap);
write('robots.txt', `User-agent: *\nAllow: /\nDisallow: /admin/\n\nSitemap: ${SITE.url}sitemap.xml\n`);

// 404 (GitHub Pages / Netlify serve this for unknown addresses). Absolute-from-root links via <base> are not
// possible on sub-folder hosting, so it links relative to the site url.
write('404.html', `<!DOCTYPE html><html lang="en-IN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><title>Page not found | Electrical Insulation India</title>
<style>body{margin:0;min-height:100vh;display:grid;place-items:center;font-family:system-ui,sans-serif;background:#f6f4ef;color:#18222d;text-align:center;padding:24px}h1{font-size:2rem;margin:0 0 8px}p{margin:0 0 20px;color:#566170}a{display:inline-block;margin:4px;padding:12px 20px;border-radius:6px;background:#12263f;color:#fff;text-decoration:none;font-weight:600}a.o{background:none;color:#12263f;border:1.5px solid #12263f}</style></head>
<body><main><h1>Page not found${LANGS.includes('hi') ? ' / पेज नहीं मिला' : ''}</h1><p>The page you were looking for is not here.${LANGS.includes('hi') ? ' · आप जो पेज ढूंढ रहे थे वो यहां नहीं है।' : ''}</p>
<a href="${SITE.url}">Home</a>${LANGS.includes('hi') ? `<a class="o" href="${SITE.url}hi/">होम (हिन्दी)</a>` : ''}
<p style="margin:26px 0 6px;font-weight:600">${LANGS.includes('hi') ? 'Products / प्रोडक्ट' : 'Products'}</p>
${cfg.productsOn.map((s2) => `<a class="o" href="${SITE.url}products/${s2}/">${products.en[s2].name}</a>`).join('')}
<p style="margin-top:26px">${LANGS.includes('hi') ? 'Need help? / मदद चाहिए? ' : 'Need help? '}<a class="o" href="https://wa.me/${SITE.whatsapp}">WhatsApp</a></p></main></body></html>
`);

if (DRY) {
  let before = []; try { before = JSON.parse(fs.readFileSync(MANIFEST, 'utf8')); } catch (e) { /* first build */ }
  const added = [...written].filter((f) => !before.includes(f)).sort(), gone = before.filter((f) => !written.has(f)).sort();
  console.log('@@summary ' + JSON.stringify({ dry: true, files: count, pages: pages.length, langs: LANGS, shown: cfg.productsOn, auto: cfg.auto, warnings: cfg.warnings, added, removed: gone, written: [...written].sort() }));
  process.exit(0);
}

// ---- 6. remove what an earlier build wrote and this one did not (pages of things now switched off) ----
let removed = [];
try { removed = JSON.parse(fs.readFileSync(MANIFEST, 'utf8')).filter((f) => !written.has(f)); } catch (e) { /* first build: nothing to remove */ }
removed.forEach((rel) => {
  const file = path.join(OUT, rel);
  if (!file.startsWith(OUT + path.sep)) return;
  try { fs.unlinkSync(file); } catch (e) { return; }
  for (let d = path.dirname(file); d !== OUT && d.startsWith(OUT + path.sep); d = path.dirname(d)) {
    try { if (fs.readdirSync(d).length) break; fs.rmdirSync(d); } catch (e) { break; }
  }
});
fs.mkdirSync(path.dirname(MANIFEST), { recursive: true });
fs.writeFileSync(MANIFEST, JSON.stringify([...written].sort(), null, 1) + '\n');

// ---- 7. say what happened ----
const hiddenByYou = allSlugs.filter((s) => !loaded.cfg.products[s]);
console.log(`Built ${count} files for ${SITE.url} (${pages.length} pages x ${LANGS.length} language${LANGS.length > 1 ? 's' : ''}).`);
console.log(`Products shown ${cfg.productsOn.length}/${allSlugs.length}: ${cfg.productsOn.join(', ')}`);
if (hiddenByYou.length) console.log(`Hidden by you: ${hiddenByYou.join(', ')}`);
if (cfg.auto.length) console.log('Hidden automatically (they need a product that is hidden):\n  ' + cfg.auto.map((a) => `${a.kind} ${a.id} (${a.reason})`).join('\n  '));
if (removed.length) console.log(`Removed ${removed.length} old file${removed.length > 1 ? 's' : ''} that are no longer part of the site.`);
cfg.warnings.forEach((w) => console.log('Check: ' + w));
if (/example\.com/.test(SITE.url)) console.log('Note: site url is still the placeholder. Run with --url https://yourdomain.in/ before publishing.');
console.log('@@summary ' + JSON.stringify({ files: count, pages: pages.length, langs: LANGS, shown: cfg.productsOn, hiddenByYou, auto: cfg.auto, removed: removed.length, warnings: cfg.warnings }));
