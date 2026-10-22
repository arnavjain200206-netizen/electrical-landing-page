const SITE = require('./site');
const { esc, jsonAttr } = require('./lib');

const ICONS = `
  <symbol id="i-moon" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5a8.5 8.5 0 1 0 10.7 10.7Z"/></symbol>
  <symbol id="i-sun" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M18.7 5.3l-1.6 1.6M6.9 17.1l-1.6 1.6"/></g></symbol>
  <symbol id="i-wa" viewBox="0 0 24 24"><path fill="currentColor" d="M12.04 2a9.9 9.9 0 0 0-8.47 15.02L2 22l5.1-1.34A9.9 9.9 0 1 0 12.04 2Zm0 1.8a8.1 8.1 0 0 1 6.9 12.3 8.1 8.1 0 0 1-11.2 2.5l-.3-.18-3 .8.8-2.93-.2-.3A8.1 8.1 0 0 1 12.04 3.8Zm-3.2 3.9c-.2 0-.5.07-.75.35-.26.28-1 1-1 2.44s1.03 2.83 1.17 3.02c.15.2 2 3.2 4.95 4.36 2.45.96 2.95.77 3.48.72.53-.05 1.7-.7 1.95-1.37.24-.68.24-1.26.17-1.38-.07-.12-.27-.2-.56-.34-.3-.15-1.7-.84-1.97-.94-.26-.1-.46-.15-.65.15-.2.3-.75.94-.92 1.13-.17.2-.34.22-.63.07-.3-.15-1.24-.46-2.37-1.46-.87-.78-1.46-1.74-1.63-2.04-.17-.3-.02-.45.13-.6.13-.13.3-.34.44-.51.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.65-1.6-.9-2.18-.23-.56-.47-.48-.65-.49h-.55Z"/></symbol>
  <symbol id="i-mail" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M3 6h18v12H3zM3 7l9 6 9-6"/></symbol>
  <symbol id="i-phone" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z"/></symbol>
  <symbol id="i-arrow" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M4 12h15M13 6l6 6-6 6"/></symbol>
  <symbol id="i-check" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="m5 12.5 4.5 4.5L19 7.5"/></symbol>
  <symbol id="i-list" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M9 3.5h6V7H9zM7 5H5.5A1.5 1.5 0 0 0 4 6.5v13A1.5 1.5 0 0 0 5.5 21h13a1.5 1.5 0 0 0 1.5-1.5v-13A1.5 1.5 0 0 0 18.5 5H17M8 12h8M8 16h5"/></symbol>
  <symbol id="i-plus" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" d="M12 5v14M5 12h14"/></symbol>
  <symbol id="i-x" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M6 6l12 12M18 6 6 18"/></symbol>
  <symbol id="i-trash" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></symbol>
  <symbol id="i-globe" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/></g></symbol>
  <symbol id="i-switch" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="3" width="14" height="18" rx="1.5"/><path d="M9 8h6M9 12h6M9 16h3"/><circle cx="15.5" cy="16" r="1.1"/></g></symbol>
  <symbol id="i-meter" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="18" rx="2"/><circle cx="12" cy="10.5" r="4"/><path d="m12 10.5 2-2M8 17.5h8"/></g></symbol>
  <symbol id="i-appliance" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="18" rx="2"/><circle cx="12" cy="13.5" r="4.5"/><path d="M7.5 6.5h2M12 10.5a3 3 0 0 1 3 3"/></g></symbol>
  <symbol id="i-truck" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M2 6h12v10H2zM14 9h4l3 3v4h-7"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></g></symbol>
  <symbol id="i-scale" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v16M6 20h12M4.5 7.5h15M4.5 7.5 2 13.5a3 3 0 0 0 5 0zM19.5 7.5 17 13.5a3 3 0 0 0 5 0z"/></g></symbol>
  <symbol id="i-fit" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="1.5"/><path d="M3 12h18M12 3v18M12 8h9"/></g></symbol>
  <symbol id="i-ruler" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17 17 3l4 4L7 21z"/><path d="m7 13 2 2M10 10l2 2M13 7l2 2"/></g></symbol>
  <symbol id="i-book" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4.5A1.5 1.5 0 0 1 6.5 3H19v15H6.5A1.5 1.5 0 0 0 5 19.5zM5 19.5v1A.5.5 0 0 0 5.5 21H19M9 7h6"/></g></symbol>`;

const themeInit = `(function(){var t=null;try{t=localStorage.getItem('eii_theme')}catch(e){}if(t!=='light'&&t!=='dark')t=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';document.documentElement.setAttribute('data-theme',t);var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute('content',t==='dark'?'#0f161f':'#f6f4ef')})();`;

function waUrl(text) { return 'https://wa.me/' + SITE.whatsapp + '?text=' + encodeURIComponent(text); }

function head(ctx, o) {
  const { t, lang, rel } = ctx;
  const canonical = ctx.abs(o.path, lang);
  const alt = (l) => ctx.abs(o.path, l);
  const img = SITE.url + 'assets/og-image.png';
  const ld = (o.jsonld || []).map((j) => `  <script type="application/ld+json">${JSON.stringify(j).replace(/</g, '\\u003c')}</script>`).join('\n');
  return `<!DOCTYPE html>
<html lang="${t.raw('htmlLang')}" data-lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(o.title)}</title>
  <meta name="description" content="${esc(o.description)}">
  <meta name="color-scheme" content="light dark">
  <meta name="theme-color" content="#f6f4ef">
  <script>${themeInit}</script>${o.headExtra || ''}
  <meta name="robots" content="${o.noindex || ctx.single ? 'noindex, follow' : 'index, follow'}">
  <!-- TODO: the address below comes from build/site.js (run: node build/build.js --url https://yourdomain.in/) -->
  <link rel="canonical" href="${canonical}">
  <link rel="alternate" hreflang="en-IN" href="${alt('en')}">
  <link rel="alternate" hreflang="hi-IN" href="${alt('hi')}">
  <link rel="alternate" hreflang="x-default" href="${alt('en')}">
  <meta property="og:type" content="${o.ogType || 'website'}">
  <meta property="og:site_name" content="${esc(SITE.name)}">
  <meta property="og:locale" content="${t.raw('ogLocale')}">
  <meta property="og:title" content="${esc(o.title)}">
  <meta property="og:description" content="${esc(o.ogDescription || o.description)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${img}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${esc(SITE.name)} — ${esc(SITE.address.locality)}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(o.title)}">
  <meta name="twitter:description" content="${esc(o.ogDescription || o.description)}">
  <meta name="twitter:image" content="${img}">
  <link rel="icon" type="image/svg+xml" href="${rel}assets/favicon.svg">
  <link rel="apple-touch-icon" href="${rel}assets/apple-touch-icon.png">
${o.preload || ''}  <script>if(/^https?:/.test(location.protocol)){['IBMPlexSansCondensed-700','IBMPlexSans-var'${lang === 'hi' ? ",'NotoSansDevanagari-var'" : ''}].forEach(function(f){var l=document.createElement('link');l.rel='preload';l.as='font';l.type='font/woff2';l.crossOrigin='';l.href='${rel}assets/fonts/'+f+'.woff2';document.head.appendChild(l)})}</script>
  <link rel="stylesheet" href="${rel}style.css">
${ld}
</head>`;
}

function localBusinessLd(ctx) {
  const { t } = ctx;
  const j = {
    '@context': 'https://schema.org', '@type': 'LocalBusiness', name: SITE.name,
    description: t.raw('home.description'), url: ctx.abs('', ctx.lang), telephone: SITE.phoneTel, email: SITE.email,
    image: SITE.url + 'assets/og-image.png', inLanguage: ctx.lang === 'hi' ? 'hi-IN' : 'en-IN',
    address: { '@type': 'PostalAddress', streetAddress: SITE.address.street, addressLocality: SITE.address.locality, addressRegion: SITE.address.region, postalCode: SITE.address.postal, addressCountry: SITE.address.country },
    openingHoursSpecification: { '@type': 'OpeningHoursSpecification', dayOfWeek: SITE.hours.days, opens: SITE.hours.opens, closes: SITE.hours.closes },
    areaServed: 'IN'
  };
  const same = [SITE.googleBusinessUrl].filter(Boolean);
  if (same.length) j.sameAs = same;
  return j;
}

function breadcrumbLd(ctx, items) {
  return { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it[0], item: it[1] })) };
}

function faqLd(items) {
  return { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: items.map((q) => ({ '@type': 'Question', name: q.q, acceptedAnswer: { '@type': 'Answer', text: q.a } })) };
}

function header(ctx, o) {
  const { t, lang, rel, page } = ctx;
  const onHome = page === 'home';
  const hh = (hash) => (onHome && !ctx.single ? '#' + hash : ctx.link('') + '#' + hash);
  const cur = (key) => (o.current === key ? ' aria-current="page"' : '');
  const other = lang === 'en' ? 'hi' : 'en';
  const switchHref = ctx.link(o.path, other) + (other === 'en' ? '' : '');
  const langA = (cls) => `<a class="${cls}" href="${switchHref}" hreflang="${t.raw('switchTo.hreflang')}" lang="${t.raw('switchTo.hreflang')}" data-lang="${other}" aria-label="${t('switchTo.aria')}" title="${t('switchTo.aria')}"><svg class="icon" aria-hidden="true"><use href="#i-globe"/></svg><span>${t('switchTo.label')}</span></a>`;
  return `<a class="skip-link" href="#main">${t('ui.skip')}</a>
  <div class="progress" id="progress" aria-hidden="true"></div>

  <div class="topbar">
    <div class="container topbar__inner">
      <span>${t('ui.topbarAddress')}</span>
      <span class="topbar__right">${t('ui.topbarHours')} <span aria-hidden="true">·</span> <a href="tel:${SITE.phoneTel}" data-track="call_click" data-track-where="topbar">${esc(SITE.phoneDisplay)}</a></span>
    </div>
  </div>

  <header class="nav${onHome ? ' is-top' : ''}" id="top">
    <div class="container nav__inner">
      <a class="brand" href="${ctx.link('')}" aria-label="${t('ui.brandHome')}">
        <svg class="brand__mark" viewBox="0 0 40 40" aria-hidden="true"><rect width="40" height="40" rx="6"/><path d="M23 6 9 23h9l-2 11 15-18h-9z"/></svg>
        <span class="brand__name">Electrical Insulation<small>${t('ui.brandSub')}</small></span>
      </a>

      <nav id="menu" class="nav__menu" aria-label="${t('ui.nav.label')}">
        <ul>
          <li><a href="${hh('products')}"${o.current === 'home' ? '' : ''}>${t('ui.nav.products')}</a></li>
          <li><a href="${hh('industries')}">${t('ui.nav.industries')}</a></li>
          <li><a href="${ctx.link('tools/')}" data-nav="tools"${cur('tools')}>${t('ui.nav.tools')}</a></li>
          <li><a href="${ctx.link('guides/')}" data-nav="guides"${cur('guides')}>${t('ui.nav.guides')}</a></li>
          <li><a href="${hh('faq')}">${t('ui.nav.faq')}</a></li>
          <li><a href="${hh('contact')}">${t('ui.nav.contact')}</a></li>
          <li class="nav__lang-li">${langA('lang-switch lang-switch--menu')}</li>
        </ul>
        <a class="btn btn--wa btn--sm nav__cta" href="${waUrl(t.raw('ui.waGreeting'))}" target="_blank" rel="noopener" data-track="whatsapp_click" data-track-where="nav">
          <svg class="icon" aria-hidden="true"><use href="#i-wa"/></svg> ${t('ui.nav.whatsapp')}
        </a>
      </nav>

      ${langA('lang-switch lang-switch--bar')}

      <button class="enq-btn" id="enqBtn" type="button" aria-haspopup="dialog" aria-controls="enq" aria-label="${t('ui.nav.enquiryOpen')}" title="${t('ui.nav.enquiry')}">
        <svg class="icon" aria-hidden="true"><use href="#i-list"/></svg><span class="enq-btn__count" id="enqCount" hidden>0</span>
      </button>

      <button class="theme-toggle" id="themeToggle" type="button" aria-label="${t('ui.nav.themeToDark')}" title="${t('ui.nav.themeTitle')}" data-label-dark="${t('ui.nav.themeToDark')}" data-label-light="${t('ui.nav.themeToLight')}">
        <svg class="icon i-moon" aria-hidden="true"><use href="#i-moon"/></svg>
        <svg class="icon i-sun" aria-hidden="true"><use href="#i-sun"/></svg>
      </button>

      <button class="nav__toggle" id="navToggle" type="button" aria-expanded="false" aria-controls="menu" aria-label="${t('ui.nav.menuOpen')}" data-label-open="${t('ui.nav.menuOpen')}" data-label-close="${t('ui.nav.menuClose')}">
        <span></span><span></span><span></span>
      </button>
    </div>
  </header>`;
}

function footer(ctx) {
  const { t } = ctx;
  const onHome = ctx.page === 'home';
  const hh = (hash) => (onHome && !ctx.single ? '#' + hash : ctx.link('') + '#' + hash);
  const review = SITE.googleReviewUrl
    ? `\n        <li><a href="${esc(SITE.googleReviewUrl)}" target="_blank" rel="noopener" data-track="review_click" data-track-where="footer">${t('ui.footer.review')}</a></li>` : '';
  return `<footer class="footer">
    <div class="container footer__inner">
      <div class="footer__brand">
        <strong>Electrical Insulation India</strong>
        <p>${t('ui.footer.tagline')}</p>
        <p>${t('ui.topbarAddress')}</p>
        <p><a href="tel:${SITE.phoneTel}" data-track="call_click" data-track-where="footer">${esc(SITE.phoneDisplay)}</a> · <a href="mailto:${SITE.email}" data-track="email_click" data-track-where="footer">${esc(SITE.email)}</a></p>
      </div>
      <nav aria-label="${t('ui.footer.navLabel')}">
        <ul class="footer__links">
          <li><a href="${hh('products')}">${t('ui.footer.links.products')}</a></li>
          <li><a href="${ctx.link('tools/')}">${t('ui.footer.links.tools')}</a></li>
          <li><a href="${ctx.link('guides/')}">${t('ui.footer.links.guides')}</a></li>
          <li><a href="${hh('about')}">${t('ui.footer.links.about')}</a></li>
          <li><a href="${hh('faq')}">${t('ui.footer.links.faq')}</a></li>
          <li><a href="${hh('contact')}">${t('ui.footer.links.contact')}</a></li>${review}
        </ul>
      </nav>
      <p class="footer__copy">© <span id="year">2026</span> Electrical Insulation India. ${t('ui.footer.rights')}</p>
    </div>
  </footer>

  <a class="fab" href="${waUrl(t.raw('ui.waGreeting'))}" target="_blank" rel="noopener" aria-label="${t('ui.fab')}" data-track="whatsapp_click" data-track-where="float">
    <svg class="icon" aria-hidden="true"><use href="#i-wa"/></svg><span class="fab__label" aria-hidden="true">${t('ui.fab')}</span>
  </a>

  <div class="enq" id="enq" hidden>
    <div class="enq__backdrop" data-enq-close></div>
    <aside class="enq__panel" role="dialog" aria-modal="true" aria-labelledby="enqTitle" tabindex="-1">
      <header class="enq__head"><h2 id="enqTitle">${t('js.basket.title')}</h2><button class="enq__x" type="button" data-enq-close aria-label="${t('js.basket.close')}"><svg class="icon" aria-hidden="true"><use href="#i-x"/></svg></button></header>
      <div class="enq__body" id="enqBody"></div>
      <div class="enq__foot" id="enqFoot"></div>
    </aside>
  </div>
  <div class="toast" id="toast" role="status" aria-live="polite" hidden></div>

  <svg xmlns="http://www.w3.org/2000/svg" style="display:none" aria-hidden="true">${ICONS}
  </svg>`;
}

// window.EII: everything the browser scripts need
function clientConfig(ctx, extra) {
  const names = {}, namesEn = {};
  Object.keys(ctx.products).forEach((s) => { names[s] = ctx.products[s].name; namesEn[s] = ctx.productsEn[s].name; });
  const cfg = {
    lang: ctx.lang, base: ctx.rel || './', page: ctx.page, path: ctx.path, single: !!ctx.single,
    wa: SITE.whatsapp, email: SITE.email, ga4: SITE.analytics.ga4, plausible: SITE.analytics.plausibleDomain,
    names, namesEn, strings: { basket: ctx.t.raw('js.basket'), form: ctx.t.raw('js.form'), qb: ctx.t.raw('js.qb') }
  };
  Object.assign(cfg.strings, extra || {});
  return `<script>window.EII=${JSON.stringify(cfg).replace(/</g, '\\u003c')};</script>`;
}

function scripts(ctx, list, extraStrings) {
  // the single-page build can show any page, so it always carries the product and tool scripts
  let extra = extraStrings, pageScripts = list || [];
  if (ctx.single) {
    extra = { tools: Object.assign({}, ctx.dict.tools, { js: ctx.dict.js.tools, en: require('./i18n/en').tools.thickness }) };
    pageScripts = ['quote-builder.js', 'tools.js'];
  }
  const all = ['view.js', 'analytics.js', 'basket.js', 'script.js'].concat(pageScripts, ['start.js']);
  return clientConfig(ctx, extra) + '\n  ' + all.map((s) => `<script src="${ctx.rel}${s}" defer></script>`).join('\n  ');
}

module.exports = { head, header, footer, scripts, waUrl, localBusinessLd, breadcrumbLd, faqLd, ICONS, esc, jsonAttr };
