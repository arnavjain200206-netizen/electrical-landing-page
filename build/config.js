/* Reads site-config.json (the on / off switches), checks it, and works out what the site should really show.
   Everything that decides "is this shown?" lives here, so the page templates only ask questions like
   cfg.has('foam') or cfg.sections.tools, and a hidden product can never leave a dead link behind. */
const fs = require('fs');
const C = require('./catalog');

const bool = (keys, v) => keys.reduce((o, k) => { o[k] = v; return o; }, {});

function defaults(info) {
  return {
    version: 1,
    products: bool(info.products, true),
    order: C.productOrder.filter((s) => info.products.includes(s)),
    sections: bool(C.sections, true),
    industries: bool(C.industries, true),
    tools: bool(Object.keys(C.tools), true),
    guides: bool(info.guides, true),
    faq: { hidden: [] },
    features: Object.assign(bool(C.features, true), { ticker: false }),   // the scrolling strip is off unless asked for
    announcement: { enabled: false, en: '', hi: '' },
    texts: { en: {}, hi: {} },
    siteUrl: '', analytics: { ga4: '', plausible: '' }, googleReviewUrl: '', googleBusinessUrl: ''
  };
}

const isObj = (v) => v && typeof v === 'object' && !Array.isArray(v);

/* Fill in anything missing, complain clearly about anything wrong. */
function normalize(raw, info) {
  const errors = [], cfg = defaults(info);
  if (raw == null) return { cfg, errors };
  if (!isObj(raw)) return { cfg, errors: ['site-config.json must be a JSON object.'] };

  const flagGroup = (name, keys, label) => {
    const g = raw[name];
    if (g === undefined) return;
    if (!isObj(g)) { errors.push(`"${name}" must be an object of true / false values.`); return; }
    Object.keys(g).forEach((k) => {
      if (k.startsWith('_')) return;
      if (!keys.includes(k)) errors.push(`"${name}.${k}" is not a known ${label}. Known: ${keys.join(', ')}.`);
      else if (typeof g[k] !== 'boolean') errors.push(`"${name}.${k}" must be true or false (not ${JSON.stringify(g[k])}).`);
      else cfg[name][k] = g[k];
    });
  };
  flagGroup('products', info.products, 'product');
  if (raw.order !== undefined) {
    const o = raw.order;
    if (!Array.isArray(o)) errors.push('"order" must be a list of product names, e.g. ["pvc-sheets", "foam"].');
    else {
      const seen = [];
      o.forEach((s) => {
        if (!info.products.includes(s)) errors.push(`"order" has "${s}", which is not a known product. Known: ${info.products.join(', ')}.`);
        else if (seen.includes(s)) errors.push(`"order" lists "${s}" twice.`);
        else seen.push(s);
      });
      // products left out of the list follow in their usual order
      cfg.order = seen.concat(C.productOrder.filter((s) => info.products.includes(s) && !seen.includes(s)));
    }
  }
  flagGroup('sections', C.sections, 'section');
  flagGroup('industries', C.industries, 'industry');
  flagGroup('tools', Object.keys(C.tools), 'tool');
  flagGroup('guides', info.guides, 'guide');
  flagGroup('features', C.features, 'feature');

  if (raw.faq !== undefined) {
    if (!isObj(raw.faq) || (raw.faq.hidden !== undefined && !Array.isArray(raw.faq.hidden))) errors.push('"faq.hidden" must be a list of question numbers, e.g. [3, 5].');
    else (raw.faq.hidden || []).forEach((n) => {
      if (!Number.isInteger(n) || n < 0 || n >= info.faqCount) errors.push(`"faq.hidden" has ${JSON.stringify(n)}, but questions are numbered 0 to ${info.faqCount - 1}.`);
      else if (!cfg.faq.hidden.includes(n)) cfg.faq.hidden.push(n);
    });
  }
  if (raw.announcement !== undefined) {
    const a = raw.announcement;
    if (!isObj(a)) errors.push('"announcement" must be an object: { "enabled": true, "en": "...", "hi": "..." }.');
    else {
      if (a.enabled !== undefined) { if (typeof a.enabled !== 'boolean') errors.push('"announcement.enabled" must be true or false.'); else cfg.announcement.enabled = a.enabled; }
      ['en', 'hi'].forEach((l) => { if (a[l] !== undefined) { if (typeof a[l] !== 'string') errors.push(`"announcement.${l}" must be text.`); else cfg.announcement[l] = a[l].trim().slice(0, 240); } });
    }
  }
  if (raw.texts !== undefined) {
    if (!isObj(raw.texts)) errors.push('"texts" must be { "en": { "key": "text" }, "hi": { ... } }.');
    else ['en', 'hi'].forEach((l) => {
      const o = raw.texts[l]; if (o === undefined) return;
      if (!isObj(o)) { errors.push(`"texts.${l}" must be an object.`); return; }
      Object.keys(o).forEach((k) => { if (!k.startsWith('_')) cfg.texts[l][k] = o[k]; });
    });
  }
  // publishing details: kept here so a rebuild never loses them
  const urlOk = (v) => v === '' || /^https?:\/\/[^\s]+$/.test(v);
  if (raw.siteUrl !== undefined) { if (typeof raw.siteUrl !== 'string' || !urlOk(raw.siteUrl.trim())) errors.push('"siteUrl" must be the full website address, e.g. https://www.yourname.in/'); else cfg.siteUrl = raw.siteUrl.trim(); }
  ['googleReviewUrl', 'googleBusinessUrl'].forEach((k) => { if (raw[k] !== undefined) { if (typeof raw[k] !== 'string' || !urlOk(raw[k].trim())) errors.push(`"${k}" must be a full link starting with https://`); else cfg[k] = raw[k].trim(); } });
  if (raw.analytics !== undefined) {
    if (!isObj(raw.analytics)) errors.push('"analytics" must be { "ga4": "G-XXXX", "plausible": "yourdomain.in" }.');
    else {
      if (raw.analytics.ga4 !== undefined) { if (typeof raw.analytics.ga4 !== 'string' || !/^(G-[A-Z0-9]+)?$/.test(raw.analytics.ga4.trim())) errors.push('"analytics.ga4" must look like G-ABC123XYZ (or be empty).'); else cfg.analytics.ga4 = raw.analytics.ga4.trim(); }
      if (raw.analytics.plausible !== undefined) { if (typeof raw.analytics.plausible !== 'string' || !/^([a-z0-9.-]+)?$/i.test(raw.analytics.plausible.trim())) errors.push('"analytics.plausible" must be a domain like yourdomain.in (or be empty).'); else cfg.analytics.plausible = raw.analytics.plausible.trim(); }
    }
  }
  Object.keys(raw).forEach((k) => { if (!k.startsWith('_') && !['version', 'products', 'order', 'sections', 'industries', 'tools', 'guides', 'faq', 'features', 'announcement', 'texts', 'siteUrl', 'analytics', 'googleReviewUrl', 'googleBusinessUrl'].includes(k)) errors.push(`Unknown setting "${k}".`); });

  if (!info.products.some((s) => cfg.products[s])) errors.push('At least one product must stay shown.');
  return { cfg, errors };
}

/* What the site will really show, with the reason for everything that is hidden. */
function resolve(cfg, info) {
  const auto = [];                                   // things hidden because something they need is hidden
  const on = cfg.order.filter((s) => info.products.includes(s) && cfg.products[s]);
  const has = (s) => on.includes(s);
  const anyOf = (list) => list.some(has);
  const needs = (list) => list.map((s) => info.names ? info.names[s] || s : s).join(' or ');

  const tools = {};
  Object.keys(C.tools).forEach((id) => {
    tools[id] = cfg.tools[id] && anyOf(C.tools[id]);
    if (cfg.tools[id] && !tools[id]) auto.push({ kind: 'tool', id, reason: `needs ${needs(C.tools[id])}` });
  });
  const guides = {};
  info.guides.forEach((g) => {
    const req = (C.guides[g] || {}).requires || [];
    guides[g] = cfg.guides[g] && (!req.length || anyOf(req));
    if (cfg.guides[g] && !guides[g]) auto.push({ kind: 'guide', id: g, reason: `needs ${needs(req)}` });
  });
  const faq = [];
  for (let i = 0; i < info.faqCount; i++) {
    const req = C.faqRequires[i];
    if (cfg.faq.hidden.includes(i)) continue;
    if (req && !anyOf(req)) { auto.push({ kind: 'faq', id: String(i), reason: `needs ${needs(req)}` }); continue; }
    faq.push(i);
  }
  const industryItems = (id) => (info.industryData[id] || []).filter((it) => has(it.slug));
  const industries = C.industries.filter((id) => {
    if (!cfg.industries[id]) return false;
    if (!industryItems(id).length) { auto.push({ kind: 'industry', id, reason: 'none of its products are shown' }); return false; }
    return true;
  });

  // switching the whole "tools" / "guides" section off removes their pages and links as well, not just the home cards
  const toolsAny = cfg.sections.tools && Object.keys(tools).some((k) => tools[k]);
  const guidesAny = cfg.sections.guides && Object.keys(guides).some((k) => guides[k]);
  const sections = {
    industries: cfg.sections.industries && industries.length > 0,
    tools: toolsAny,
    process: cfg.sections.process,
    about: cfg.sections.about,
    guides: guidesAny,
    faq: cfg.sections.faq && faq.length > 0,
    contactMap: cfg.sections.contactMap
  };
  if (cfg.sections.tools && !sections.tools) auto.push({ kind: 'section', id: 'tools', reason: 'no tool is available' });
  if (cfg.sections.guides && !sections.guides) auto.push({ kind: 'section', id: 'guides', reason: 'no guide is available' });
  if (cfg.sections.industries && !sections.industries) auto.push({ kind: 'section', id: 'industries', reason: 'no industry card is left' });

  const insulation = has('pvc-sheets') || has('cut-to-size');
  const warnings = [];
  if (!insulation) warnings.push('PVC sheets and Cut-to-size are both hidden, but the home heading, intro, Google title and footer still talk about PVC. Change them under "Home page text".');
  else if (!has('pvc-sheets')) warnings.push('"Rigid PVC sheet" is hidden. The home heading and intro still start with PVC sheets: check "Home page text".');
  if (on.length < 4) warnings.push(`Only ${on.length} product${on.length === 1 ? '' : 's'} shown: the catalogue will use a simpler layout.`);

  return {
    productsOn: on, has, tools, toolsAny, guides, guidesAny, faq, industries, industryItems, sections,
    features: Object.assign({}, cfg.features), announcement: cfg.announcement, texts: cfg.texts,
    langs: cfg.features.hindi ? ['en', 'hi'] : ['en'],
    heroSlug: has('pvc-sheets') ? 'pvc-sheets' : on[0],
    insulation, auto, warnings
  };
}

function load(file, info) {
  let raw = null;
  if (fs.existsSync(file)) {
    try { raw = JSON.parse(fs.readFileSync(file, 'utf8')); }
    catch (e) { return { cfg: defaults(info), errors: [`site-config.json is not valid JSON: ${e.message}`] }; }
  }
  return normalize(raw, info);
}

/* Everything the admin panel needs to know about the site's content (names, questions, industries ...). */
function buildInfo() {
  const en = require('./i18n/en'), productsEn = require('./data/products.en');
  const info = { products: Object.keys(productsEn), guides: Object.keys(en.guides.articles), faqCount: en.home.faq.items.length, industryData: require('./data/industries'), names: {} };
  info.products.forEach((s) => { info.names[s] = productsEn[s].name; });
  return info;
}

module.exports = { defaults, normalize, resolve, load, buildInfo };
