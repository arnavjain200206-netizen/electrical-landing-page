const SITE = require('../site');
const L = require('../layout');
const { esc, jsonAttr } = require('../lib');

// the order the ticker texts were written in (one text per product)
const ORDER_ALL = ['pvc-sheets', 'cut-to-size', 'stretch-film', 'bopp-tape', 'bubble-wrap', 'foam', 'strapping', 'edge-guard'];
const GROUP = { 'pvc-sheets': 'Insulation', 'cut-to-size': 'Insulation' };

/* Which cards get the big layouts. Only when they fill the 4-column grid exactly, so hiding products never leaves a hole. */
function bentoLayout(on) {
  const n = on.length;
  // the big card must be first and the wide one second, otherwise grid auto-placement would leave holes
  if (on[0] === 'pvc-sheets') {
    if (on[1] === 'cut-to-size' && n >= 4) return { xl: 'pvc-sheets', wide: 'cut-to-size', n };
    if (n >= 5) return { xl: 'pvc-sheets', wide: null, n };
  }
  return { xl: null, wide: null, n };
}
const ICON = { switchgear: 'i-switch', meter: 'i-meter', appliance: 'i-appliance', traders: 'i-truck' };
const TOOL_ICON = { weight: 'i-scale', fit: 'i-fit', thickness: 'i-ruler' };

module.exports = function home(ctx) {
  const { t, lang, rel, cfg } = ctx;
  const ORDER = cfg.productsOn;
  const layout = bentoLayout(ORDER);
  const dm = (slug, motion) => (cfg.features.threeD ? ` data-model="${slug}"${motion ? ` data-motion="${motion}"` : ''}` : '');
  const wa = L.waUrl(t.raw('ui.waGreeting'));
  const hero = 'home.hero';
  const heroWords = t.raw(`${hero}.words`);
  const forWord = t.raw(`${hero}.forWord`);
  const stop = lang === 'en' ? '.' : '';
  const productName = (s) => ctx.products[s].name;

  const cards = ORDER.map((slug, i) => {
    const c = `home.products.cards.${slug}`;
    const cls = slug === layout.xl ? ' pcard--xl' : slug === layout.wide ? ' pcard--wide' : '';
    const tag = GROUP[slug] ? t('home.products.tagInsulation') : t('home.products.tagPackaging');
    return `          <article class="pcard${cls}">
            <div class="pcard__img"${dm(slug, 'hover')}><img src="${rel}assets/products/${slug}.svg" alt="" width="600" height="450" loading="lazy"><span class="pcard__tag">${tag}</span></div>
            <div class="pcard__body">
              <h3 class="pcard__title"><a href="${ctx.link('products/' + slug + '/')}">${t(c + '.title')}</a></h3>
              <p>${t(c + '.text')}</p>
              <p class="pcard__spec mono">${t(c + '.spec')}</p>
              <div class="pcard__row">
                <span class="pcard__more">${t(c + '.more')} <svg class="icon" aria-hidden="true"><use href="#i-arrow"/></svg></span>
                <button class="pcard__add" type="button" data-add="${jsonAttr({ slug, details: [] })}" aria-label="${t('ui.common.add')}: ${esc(productName(slug))}"><svg class="icon" aria-hidden="true"><use href="#i-plus"/></svg><span>${t('ui.common.add')}</span></button>
              </div>
            </div>
          </article>`;
  }).join('\n');

  const indCards = t.raw('home.industries.cards').filter((c) => cfg.industries.includes(c.id)).map((c) => {
    const items = cfg.industryItems(c.id);
    const chips = items.map((it) => `<li><a href="${ctx.link('products/' + it.slug + '/')}">${esc(productName(it.slug))}</a></li>`).join('');
    return `          <article class="ind">
            <svg class="ind__icon icon" aria-hidden="true"><use href="#${ICON[c.id]}"/></svg>
            <h3>${esc(c.title)}</h3>
            <p>${esc(c.text)}</p>
            <p class="ind__label mono">${t('home.industries.buys')}</p>
            <ul class="ind__chips">${chips}</ul>
            <button class="btn btn--outline btn--sm ind__add" type="button" data-add-many="${jsonAttr({ items, id: c.id })}" data-added="${t('home.industries.added')}"><svg class="icon" aria-hidden="true"><use href="#i-plus"/></svg> ${t('home.industries.addList')}</button>
          </article>`;
  }).join('\n');

  const indCount = t.raw('home.industries.cards').filter((c) => cfg.industries.includes(c.id)).length;
  const toolsShown = t.raw('home.toolsTeaser.cards').filter((c) => cfg.tools[c.id]);
  const toolCards = toolsShown.map((c) => `          <a class="tcard" href="${ctx.link('tools/')}#${c.id}">
            <svg class="tcard__icon icon" aria-hidden="true"><use href="#${TOOL_ICON[c.id]}"/></svg>
            <h3>${esc(c.title)}</h3>
            <p>${esc(c.text)}</p>
            <span class="tcard__more">${t('home.toolsTeaser.open')} <svg class="icon" aria-hidden="true"><use href="#i-arrow"/></svg></span>
          </a>`).join('\n');

  const guideCards = Object.keys(ctx.guides).map((slug) => {
    const g = ctx.guides[slug];
    return `          <a class="gcard" href="${ctx.link('guides/' + slug + '/')}">
            <svg class="gcard__icon icon" aria-hidden="true"><use href="#i-book"/></svg>
            <h3>${esc(g.h1)}</h3>
            <p>${esc(g.excerpt)}</p>
            <span class="tcard__more">${t('ui.common.readGuide')} <svg class="icon" aria-hidden="true"><use href="#i-arrow"/></svg></span>
          </a>`;
  }).join('\n');

  const steps = t.raw('home.process.steps').map((s) => `<li><span class="steps__n mono">0</span><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></li>`)
    .map((h, i) => h.replace('>0<', `>0${i + 1}<`)).join('\n          ');

  // when something is hidden, the first row lists the products that are shown, so it is always right
  const glance = t.raw('home.about.glance').map((g, i) => `<div><dt>${esc(g.label)}</dt><dd>${esc(i === 0 && ORDER.length < ORDER_ALL.length ? ORDER.map(productName).join(', ') : g.value)}</dd></div>`).join('\n          ');
  const faqItems = t.raw('home.faq.items').filter((f, i) => cfg.faq.includes(i));
  const faq = faqItems.map((f) => `          <details>
            <summary>${esc(f.q)}</summary>
            <p>${esc(f.a)}</p>
          </details>`).join('\n');
  const faqSub = t.fmt('home.faq.sub', {
    wa: `<a href="https://wa.me/${SITE.whatsapp}" target="_blank" rel="noopener" data-track="whatsapp_click" data-track-where="faq">WhatsApp</a>`,
    tel: `<a href="tel:${SITE.phoneTel}" data-track="call_click" data-track-where="faq">${esc(SITE.phoneDisplay)}</a>`
  });
  const prodOptions = ORDER.map((s) => `<option value="${esc(ctx.productsEn[s].name)}">${esc(productName(s))}</option>`).join('\n              ');
  const reviewRow = SITE.googleReviewUrl
    ? `\n            <div><dt>Google</dt><dd><a href="${esc(SITE.googleReviewUrl)}" target="_blank" rel="noopener" data-track="review_click" data-track-where="contact">${t('ui.footer.review')}</a></dd></div>` : '';

  // the hero picture: the PVC stack, or the first product that is shown when PVC is hidden
  const hs = cfg.heroSlug, heroPvc = hs === 'pvc-sheets';
  const chipTitle = heroPvc ? t(hero + '.chipTitle') : t(`home.products.cards.${hs}.title`);
  const chipSpec = heroPvc ? t(hero + '.chipSpec') : t(`home.products.cards.${hs}.spec`);
  const heroArt = `          <div class="hero__model"${dm(heroPvc ? 'pvc-stack' : hs)}><img class="hero__stack" src="${rel}assets/${heroPvc ? 'hero-stack.svg' : 'products/' + hs + '.svg'}" alt="${heroPvc ? t(hero + '.stackAlt') : esc(productName(hs))}" width="600" height="${heroPvc ? 610 : 450}" fetchpriority="high"></div>
          <a class="hero__chip" href="${ctx.link('products/' + hs + '/')}">
            <span><strong>${chipTitle}</strong><span class="mono">${chipSpec}</span></span>
            <svg class="icon" aria-hidden="true"><use href="#i-arrow"/></svg>
          </a>`;
  // one place for the ordering facts. The sheet size only matters while a PVC product is shown.
  const TRUST_ICON = ['i-fit', 'i-doc', 'i-truck', 'i-box'];
  const trustItems = t.raw('home.trust.items').map((it, i) => ({ it, i })).filter(({ i }) => i !== 0 || cfg.insulation)
    .map(({ it, i }) => `<li><svg class="icon" aria-hidden="true"><use href="#${TRUST_ICON[i]}"/></svg><span><strong>${esc(it.label)}</strong><span>${esc(it.value)}</span></span></li>`);
  const heroSr = [t.raw(hero + '.line1'), t.raw(hero + '.line2'), forWord, t.raw(hero + '.audience')].filter(Boolean).join(' ') + stop;
  const tickerItems = ORDER.map((s) => t.raw('home.ticker')[ORDER_ALL.indexOf(s)]);
  const titleLd = [L.localBusinessLd(ctx), L.faqLd(faqItems)];
  const redirect = lang === 'en' && !ctx.single && ctx.langs.includes('hi')
    ? `\n  <script>try{if(localStorage.getItem('eii_lang')==='hi'&&!/[?&]lang=en/.test(location.search)&&location.pathname.slice(-3)!=='hi/')location.replace('hi/index.html'+location.hash)}catch(e){}</script>` : '';

  return `${L.head(ctx, { path: '', title: t.raw('home.title'), description: t.raw('home.description'), ogDescription: t.raw('home.ogDescription'), jsonld: titleLd, headExtra: redirect, preload: cfg.heroSlug === 'pvc-sheets' ? `  <link rel="preload" href="${rel}assets/hero-stack.svg" as="image" type="image/svg+xml">\n` : '' })}
<body data-page="home">
  ${L.header(ctx, { path: '', current: 'home' })}

  <main id="main">

    <!-- ===================== HERO ===================== -->
    <section class="hero" id="hero">
      <svg class="circuit" viewBox="0 0 1440 640" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
        <g fill="none" stroke-linecap="round" stroke-linejoin="round">
          <g class="circuit__base">
            <path pathLength="500" d="M-10 520H180L240 460H520L560 420H760"/>
            <path pathLength="500" d="M1450 140H1260L1200 200H1000L960 240H860"/>
            <path pathLength="500" d="M-10 120H140L200 180H360V300H460"/>
            <path pathLength="500" d="M1450 560H1240L1180 500H1040V380H940"/>
            <path pathLength="500" d="M300 -10V90H420L470 140H640"/>
            <path pathLength="500" d="M1100 650V560H980L940 520H820"/>
          </g>
        </g>
      </svg>

      <div class="container hero__grid">
        <div class="hero__copy">
          <p class="kicker hero__in" style="--d:.05s">${t(hero + '.kicker')}</p>
          <h1>
            <span class="sr-only">${esc(heroSr)}</span>
            <span aria-hidden="true">
              <span class="ln"><span style="--d:.15s">${t(hero + '.line1')}</span></span>
              <span class="ln"><span style="--d:.27s">${t(hero + '.line2')}</span></span>
            </span>
          </h1>
          <ul class="hero__chips hero__in" style="--d:.4s" aria-label="${t(hero + '.chipsLabel')}">${heroWords.map((w) => `<li>${esc(w)}</li>`).join('')}</ul>
          <p class="lead hero__in" style="--d:.55s">${t(hero + '.lead')}</p>

          <div class="hero__actions hero__in" style="--d:.68s">
            <a class="btn btn--wa btn--lg" href="${wa}" target="_blank" rel="noopener" data-track="whatsapp_click" data-track-where="hero">
              <svg class="icon" aria-hidden="true"><use href="#i-wa"/></svg> ${t(hero + '.ctaWa')}
            </a>
            <a class="hero__call" href="tel:${SITE.phoneTel}" data-track="call_click" data-track-where="hero">
              <svg class="icon" aria-hidden="true"><use href="#i-phone"/></svg> ${t(hero + '.ctaCall')}
            </a>
          </div>
        </div>

        <div class="hero__art">
${heroArt}
        </div>
      </div>

    </section>

    <!-- Ordering facts, in one place -->
    <section class="trust" aria-label="${t('home.trust.label')}">
      <div class="container">
        <ul class="trust__list" data-n="${trustItems.length}">
          ${trustItems.join('\n          ')}
        </ul>
      </div>
    </section>

${cfg.features.ticker ? `    <!-- Ticker (decorative) -->
    <div class="ticker" aria-hidden="true">
      <div class="ticker__track">
        ${tickerItems.concat(tickerItems).map((x) => `<span>${esc(x)}</span>`).join('')}
      </div>
    </div>
` : ''}
    <!-- ===================== PRODUCTS ===================== -->
    <section class="section" id="products">
      <div class="container">
        <header class="section__head" data-reveal>
          <p class="kicker">${t('home.products.kicker')}</p>
          <h2>${t('home.products.h2')}</h2>
          <p class="section__sub">${t('home.products.sub')}</p>
        </header>

        <div class="bento" data-stagger data-n="${layout.n}">
${cards}
        </div>

        <p class="products__note" data-reveal>${t('home.products.note')}</p>
      </div>
    </section>

${cfg.sections.industries ? `    <!-- ===================== INDUSTRIES ===================== -->
    <section class="section section--tint" id="industries">
      <div class="container">
        <header class="section__head" data-reveal>
          <p class="kicker">${t('home.industries.kicker')}</p>
          <h2>${t('home.industries.h2')}</h2>
          <p class="section__sub">${t('home.industries.sub')}</p>
        </header>
        <div class="ind-grid" data-stagger data-n="${indCount}">
${indCards}
        </div>
      </div>
    </section>
` : ''}

${cfg.sections.tools ? `    <!-- ===================== TOOLS ===================== -->
    <section class="section" id="tools">
      <div class="container">
        <header class="section__head" data-reveal>
          <p class="kicker">${t('home.toolsTeaser.kicker')}</p>
          <h2>${t('home.toolsTeaser.h2')}</h2>
          <p class="section__sub">${t('home.toolsTeaser.sub')}</p>
        </header>
        <div class="tgrid" data-stagger data-n="${toolsShown.length}">
${toolCards}
        </div>
      </div>
    </section>
` : ''}

${cfg.sections.process ? `    <!-- ===================== PROCESS ===================== -->
    <section class="section section--tint" id="process">
      <div class="container">
        <header class="section__head" data-reveal>
          <p class="kicker">${t('home.process.kicker')}</p>
          <h2>${t('home.process.h2')}</h2>
        </header>
        <ol class="steps" data-stagger>
          ${steps}
        </ol>
      </div>
    </section>
` : ''}

${cfg.sections.about ? `    <!-- ===================== ABOUT ===================== -->
    <section class="section" id="about">
      <div class="container about">
        <div class="about__copy" data-reveal>
          <p class="kicker">${t('home.about.kicker')}</p>
          <h2>${t('home.about.h2')}</h2>
          ${t.raw('home.about.paras').map((p) => `<p>${esc(p)}</p>`).join('\n          ')}
        </div>

        <dl class="glance" data-reveal>
          ${glance}
        </dl>
      </div>
    </section>
` : ''}

${cfg.sections.guides ? `    <!-- ===================== GUIDES ===================== -->
    <section class="section section--tint" id="guides">
      <div class="container">
        <header class="section__head" data-reveal>
          <p class="kicker">${t('home.guides.kicker')}</p>
          <h2>${t('home.guides.h2')}</h2>
          <p class="section__sub">${t('home.guides.sub')}</p>
        </header>
        <div class="gcards" data-stagger data-n="${Object.keys(ctx.guides).length}">
${guideCards}
        </div>
      </div>
    </section>
` : ''}

${cfg.sections.faq ? `    <!-- ===================== FAQ ===================== -->
    <section class="section" id="faq">
      <div class="container faqwrap">
        <header class="section__head faqwrap__head" data-reveal>
          <p class="kicker">${t('home.faq.kicker')}</p>
          <h2>${t('home.faq.h2')}</h2>
          <p class="section__sub">${faqSub}</p>
        </header>

        <div class="faq" data-reveal>
${faq}
        </div>
      </div>
    </section>
` : ''}

    <!-- ===================== CONTACT ===================== -->
    <section class="section section--dark" id="contact">
      <div class="container contact">
        <div class="contact__info" data-reveal>
          <p class="kicker">${t('home.contact.kicker')}</p>
          <h2>${t('home.contact.h2')}</h2>
          <p class="lead">${t('home.contact.lead')}</p>

          <div class="contact__buttons">
            <a class="btn btn--wa btn--lg" href="${wa}" target="_blank" rel="noopener" data-track="whatsapp_click" data-track-where="contact">
              <svg class="icon" aria-hidden="true"><use href="#i-wa"/></svg> ${t('home.contact.ctaWa')}
            </a>
          </div>

          <dl class="contact__list">
            <div><dt>${t('home.contact.labels.phone')}</dt><dd><a href="tel:${SITE.phoneTel}" data-track="call_click" data-track-where="contact">${esc(SITE.phoneDisplay)}</a></dd></div>
            <div><dt>${t('home.contact.labels.email')}</dt><dd><a href="mailto:${SITE.email}" data-track="email_click" data-track-where="contact">${esc(SITE.email)}</a></dd></div>
            <div><dt>${t('home.contact.labels.address')}</dt><dd><a href="https://maps.google.com/?q=${encodeURIComponent(SITE.mapQuery)}" target="_blank" rel="noopener" data-track="map_click" data-track-where="contact">${t('ui.topbarAddress')}</a></dd></div>
            <div><dt>${t('home.contact.labels.hours')}</dt><dd>${t('home.contact.hours')}</dd></div>${reviewRow}
          </dl>

${cfg.sections.contactMap ? `          <div class="map">
            <iframe title="${t('home.contact.mapTitle')}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://maps.google.com/maps?q=${encodeURIComponent(SITE.mapQuery)}&amp;output=embed"></iframe>
          </div>
` : ''}        </div>

        <form class="form" id="quoteForm" data-reveal novalidate>
          <h3>${t('home.contact.form.title')}</h3>
          <p class="form__hint">${t('home.contact.form.hint')}</p>

          <label>${t('home.contact.form.name')}
            <input type="text" name="name" autocomplete="name" required placeholder="${t('home.contact.form.namePh')}">
          </label>
          <label>${t('home.contact.form.phone')}
            <input type="tel" name="phone" autocomplete="tel" inputmode="tel" required placeholder="${t('home.contact.form.phonePh')}">
          </label>
          <label>${t('home.contact.form.product')}
            <select name="product" required>
              <option value="">${t('home.contact.form.productPh')}</option>
              ${prodOptions}
              <option value="Multiple items">${t('home.contact.form.multiple')}</option>
            </select>
          </label>
          <label>${t('home.contact.form.details')}
            <textarea name="details" rows="3" placeholder="${t('home.contact.form.detailsPh')}"></textarea>
          </label>

          <p class="form__error" id="formError" role="alert" hidden></p>

          <div class="form__actions">
            <button type="submit" class="btn btn--wa" data-channel="wa">
              <svg class="icon" aria-hidden="true"><use href="#i-wa"/></svg> ${t('home.contact.form.sendWa')}
            </button>
            <button type="submit" class="btn btn--outline" data-channel="mail">
              <svg class="icon" aria-hidden="true"><use href="#i-mail"/></svg> ${t('home.contact.form.sendMail')}
            </button>
          </div>
        </form>
      </div>
    </section>
  </main>

  ${L.footer(ctx)}

  ${L.scripts(ctx, [])}
</body>
</html>
`;
};
