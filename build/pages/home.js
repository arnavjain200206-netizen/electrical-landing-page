const SITE = require('../site');
const L = require('../layout');
const industries = require('../data/industries');
const { esc, jsonAttr } = require('../lib');

const ORDER = ['pvc-sheets', 'cut-to-size', 'stretch-film', 'bopp-tape', 'bubble-wrap', 'foam', 'strapping', 'edge-guard'];
const ICON = { switchgear: 'i-switch', meter: 'i-meter', appliance: 'i-appliance', traders: 'i-truck' };
const TOOL_ICON = { weight: 'i-scale', fit: 'i-fit', thickness: 'i-ruler' };

module.exports = function home(ctx) {
  const { t, lang, rel } = ctx;
  const wa = L.waUrl(t.raw('ui.waGreeting'));
  const hero = 'home.hero';
  const words = t.raw(`${hero}.words`).join('|');
  const forWord = t.raw(`${hero}.forWord`);
  const stop = lang === 'en' ? '.' : '';
  const productName = (s) => ctx.products[s].name;

  const cards = ORDER.map((slug, i) => {
    const c = `home.products.cards.${slug}`;
    const cls = slug === 'pvc-sheets' ? ' pcard--xl' : slug === 'cut-to-size' ? ' pcard--wide' : '';
    const tag = i < 2 ? t('home.products.tagInsulation') : t('home.products.tagPackaging');
    return `          <article class="pcard${cls}" data-tilt>
            <div class="pcard__img"><img src="${rel}assets/products/${slug}.svg" alt="" width="600" height="450" loading="lazy"><span class="pcard__tag">${tag}</span></div>
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

  const indCards = t.raw('home.industries.cards').map((c, i) => {
    const items = industries[c.id];
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

  const toolCards = t.raw('home.toolsTeaser.cards').map((c) => `          <a class="tcard" href="${ctx.link('tools/')}#${c.id}">
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

  const glance = t.raw('home.about.glance').map((g) => `<div><dt>${esc(g.label)}</dt><dd>${esc(g.value)}</dd></div>`).join('\n          ');
  const faqItems = t.raw('home.faq.items');
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

  const titleLd = [L.localBusinessLd(ctx), L.faqLd(faqItems)];
  const redirect = lang === 'en'
    ? `\n  <script>try{if(localStorage.getItem('eii_lang')==='hi'&&!/[?&]lang=en/.test(location.search)&&location.pathname.slice(-3)!=='hi/')location.replace('hi/index.html'+location.hash)}catch(e){}</script>` : '';

  return `${L.head(ctx, { path: '', title: t.raw('home.title'), description: t.raw('home.description'), ogDescription: t.raw('home.ogDescription'), jsonld: titleLd, headExtra: redirect, preload: `  <link rel="preload" href="${rel}assets/hero-stack.svg" as="image" type="image/svg+xml">\n` })}
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
          <g class="circuit__flow">
            <path pathLength="500" style="--t:7s;--o:0s" d="M-10 520H180L240 460H520L560 420H760"/>
            <path pathLength="500" style="--t:8s;--o:-2s" d="M1450 140H1260L1200 200H1000L960 240H860"/>
            <path pathLength="500" style="--t:6.5s;--o:-4s" d="M-10 120H140L200 180H360V300H460"/>
            <path pathLength="500" style="--t:9s;--o:-1s" d="M1450 560H1240L1180 500H1040V380H940"/>
            <path pathLength="500" style="--t:7.5s;--o:-5s" d="M300 -10V90H420L470 140H640"/>
            <path pathLength="500" style="--t:8.5s;--o:-3s" d="M1100 650V560H980L940 520H820"/>
          </g>
        </g>
        <g class="circuit__nodes">
          <circle cx="760" cy="420" r="5"/><circle cx="860" cy="240" r="5"/><circle cx="460" cy="300" r="5"/>
          <circle cx="940" cy="380" r="5"/><circle cx="640" cy="140" r="5"/><circle cx="820" cy="520" r="5"/>
        </g>
      </svg>
      <div class="hero__spot" aria-hidden="true"></div>

      <div class="container hero__grid">
        <div class="hero__copy">
          <p class="kicker hero__in" style="--d:.05s">${t(hero + '.kicker')}</p>
          <h1>
            <span class="sr-only">${t(hero + '.srH1')}</span>
            <span aria-hidden="true">
              <span class="ln"><span style="--d:.15s">${t(hero + '.line1')}</span></span>
              <span class="ln"><span style="--d:.27s">${t(hero + '.line2')}</span></span>
              <span class="ln"><span style="--d:.39s">${forWord ? esc(forWord) + ' ' : ''}<span class="rot" id="rot" data-words="${esc(words)}"><span class="rot__w">${t(hero + '.audience')}</span></span>${stop}</span></span>
            </span>
          </h1>
          <p class="lead hero__in" style="--d:.55s">${t(hero + '.lead')}</p>

          <div class="hero__actions hero__in" style="--d:.68s">
            <a class="btn btn--wa btn--lg magnetic" href="${wa}" target="_blank" rel="noopener" data-track="whatsapp_click" data-track-where="hero">
              <svg class="icon" aria-hidden="true"><use href="#i-wa"/></svg> ${t(hero + '.ctaWa')}
            </a>
            <a class="btn btn--outline btn--lg magnetic" href="tel:${SITE.phoneTel}" data-track="call_click" data-track-where="hero">
              <svg class="icon" aria-hidden="true"><use href="#i-phone"/></svg> ${t(hero + '.ctaCall')}
            </a>
          </div>
        </div>

        <div class="hero__art">
          <img class="hero__stack" src="${rel}assets/hero-stack.svg" alt="${t(hero + '.stackAlt')}" width="600" height="610" fetchpriority="high">
          <a class="hero__chip" href="${ctx.link('products/pvc-sheets/')}">
            <span><strong>${t(hero + '.chipTitle')}</strong><span class="mono">${t(hero + '.chipSpec')}</span></span>
            <svg class="icon" aria-hidden="true"><use href="#i-arrow"/></svg>
          </a>
        </div>
      </div>

      <div class="container">
        <dl class="facts hero__in" style="--d:.85s">
          <div><dt>${t('home.facts.sheet')}</dt><dd><span data-count="1220">1220</span> × <span data-count="2440">2440</span> mm</dd></div>
          <div><dt>${t('home.facts.thickness')}</dt><dd>1 ${t('home.facts.thicknessTo')} <span data-count="20">20</span> mm</dd></div>
          <div><dt>${t('home.facts.dispatch')}</dt><dd>${t('home.facts.dispatchValue')}</dd></div>
          <div><dt>${t('home.facts.billing')}</dt><dd>${t('home.facts.billingValue')}</dd></div>
        </dl>
      </div>
    </section>

    <!-- Ticker (decorative) -->
    <div class="ticker" aria-hidden="true">
      <div class="ticker__track">
        ${t.raw('home.ticker').concat(t.raw('home.ticker')).map((x) => `<span>${esc(x)}</span>`).join('')}
      </div>
    </div>

    <!-- ===================== PRODUCTS ===================== -->
    <section class="section" id="products">
      <div class="container">
        <header class="section__head" data-reveal>
          <p class="kicker">${t('home.products.kicker')}</p>
          <h2>${t('home.products.h2')}</h2>
          <p class="section__sub">${t('home.products.sub')}</p>
        </header>

        <div class="bento" data-stagger>
${cards}
        </div>

        <p class="products__note" data-reveal>${t('home.products.note')}</p>
      </div>
    </section>

    <!-- ===================== INDUSTRIES ===================== -->
    <section class="section section--tint" id="industries">
      <div class="container">
        <header class="section__head" data-reveal>
          <p class="kicker">${t('home.industries.kicker')}</p>
          <h2>${t('home.industries.h2')}</h2>
          <p class="section__sub">${t('home.industries.sub')}</p>
        </header>
        <div class="ind-grid" data-stagger>
${indCards}
        </div>
      </div>
    </section>

    <!-- ===================== TOOLS ===================== -->
    <section class="section" id="tools">
      <div class="container">
        <header class="section__head" data-reveal>
          <p class="kicker">${t('home.toolsTeaser.kicker')}</p>
          <h2>${t('home.toolsTeaser.h2')}</h2>
          <p class="section__sub">${t('home.toolsTeaser.sub')}</p>
        </header>
        <div class="tgrid" data-stagger>
${toolCards}
        </div>
      </div>
    </section>

    <!-- ===================== PROCESS ===================== -->
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

    <!-- ===================== ABOUT ===================== -->
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

    <!-- ===================== GUIDES ===================== -->
    <section class="section section--tint" id="guides">
      <div class="container">
        <header class="section__head" data-reveal>
          <p class="kicker">${t('home.guides.kicker')}</p>
          <h2>${t('home.guides.h2')}</h2>
          <p class="section__sub">${t('home.guides.sub')}</p>
        </header>
        <div class="gcards" data-stagger>
${guideCards}
        </div>
      </div>
    </section>

    <!-- ===================== FAQ ===================== -->
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

          <div class="map">
            <iframe title="${t('home.contact.mapTitle')}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://maps.google.com/maps?q=${encodeURIComponent(SITE.mapQuery)}&amp;output=embed"></iframe>
          </div>
        </div>

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
