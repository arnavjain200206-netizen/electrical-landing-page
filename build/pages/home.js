const SITE = require('../site');
const L = require('../layout');
const Sheet = require('../../sheet-art');
const industries = require('../data/industries');
const { esc, jsonAttr } = require('../lib');

const ORDER = ['pvc-sheets', 'cut-to-size', 'stretch-film', 'bopp-tape', 'bubble-wrap', 'foam', 'strapping', 'edge-guard'];
const GROUPS = [{ key: 'insulation', slugs: ['pvc-sheets', 'cut-to-size'] }, { key: 'packaging', slugs: ['stretch-film', 'bopp-tape', 'bubble-wrap', 'foam', 'strapping', 'edge-guard'] }];
const TOOL_ICON = { weight: 'i-scale', fit: 'i-fit', thickness: 'i-ruler' };
const START_MM = 5;

const fmtKg = (n) => n.toFixed(1);

module.exports = function home(ctx) {
  const { t, lang, rel } = ctx;
  const wa = L.waUrl(t.raw('ui.waGreeting'));
  const hero = 'home.hero';
  const g = t.raw(hero + '.gauge');
  const forWord = t.raw(`${hero}.forWord`);
  const stop = lang === 'en' ? '.' : '';
  const productName = (s) => ctx.products[s].name;
  const fill = (s, n) => esc(s).replace('{n}', n);

  // ---- hero ----
  const h1 = [t.raw(hero + '.line1'), t.raw(hero + '.line2'), forWord, t.raw(hero + '.audience')].filter(Boolean).join(' ') + stop;
  const stdIdx = Sheet.STD.indexOf(START_MM);
  const quoteMsg = (n) => `Hi, I need a quote for ${n} mm rigid PVC sheet (1220 × 2440 mm).`;
  const addJson = (n) => jsonAttr({ slug: 'pvc-sheets', details: [['Thickness', n + ' mm'], ['Sheet size', '1220 × 2440 mm (4 × 8 ft)']] });
  const ticks = Sheet.STD.map((n, i) => `<button type="button" class="gauge__tick" data-i="${i}" aria-pressed="${i === stdIdx}" aria-label="${n} mm">${n}</button>`).join('');

  // ---- products index ----
  const row = (slug) => {
    const c = `home.products.cards.${slug}`;
    return `            <li class="prow" data-slug="${slug}" data-name="${esc(productName(slug))}" data-spec="${esc(t.raw(c + '.spec'))}">
              <img class="prow__thumb" src="${rel}assets/products/${slug}.svg" alt="" width="600" height="450" loading="lazy">
              <div class="prow__main">
                <h4 class="prow__title"><a href="${ctx.link('products/' + slug + '/')}">${t(c + '.title')}</a></h4>
                <p class="prow__text">${t(c + '.text')}</p>
                <p class="prow__spec">${t(c + '.spec')}</p>
              </div>
              <div class="prow__act">
                <span class="prow__more" aria-hidden="true">${t(c + '.more')}</span>
                <button class="prow__add" type="button" data-add="${jsonAttr({ slug, details: [] })}" aria-label="${t('ui.common.add')}: ${esc(productName(slug))}"><svg class="icon" aria-hidden="true"><use href="#i-plus"/></svg><span>${t('ui.common.add')}</span></button>
              </div>
            </li>`;
  };
  const groups = GROUPS.map((gr) => `          <section class="pgroup pgroup--${gr.key}" aria-labelledby="pg-${gr.key}">
            <h3 class="pgroup__h" id="pg-${gr.key}"><span class="pgroup__sw" aria-hidden="true"></span>${t('home.products.tag' + gr.key[0].toUpperCase() + gr.key.slice(1))}</h3>
            <ul class="pgroup__list">
${gr.slugs.map(row).join('\n')}
            </ul>
          </section>`).join('\n');
  const stageImgs = ORDER.map((s, i) => `<img src="${rel}assets/products/${s}.svg" alt="" width="600" height="450" data-pi="${s}"${i === 0 ? ' class="is-on"' : ' loading="lazy"'}>`).join('');

  const indCards = t.raw('home.industries.cards').map((c) => {
    const items = industries[c.id];
    const chips = items.map((it) => `<li><a href="${ctx.link('products/' + it.slug + '/')}">${esc(productName(it.slug))}</a></li>`).join('');
    return `          <article class="ind">
            <h3>${esc(c.title)}</h3>
            <p>${esc(c.text)}</p>
            <p class="ind__label">${t('home.industries.buys')}</p>
            <ul class="ind__chips">${chips}</ul>
            <button class="btn btn--outline btn--sm ind__add" type="button" data-add-many="${jsonAttr({ items, id: c.id })}" data-added="${t('home.industries.added')}"><svg class="icon" aria-hidden="true"><use href="#i-plus"/></svg> ${t('home.industries.addList')}</button>
          </article>`;
  }).join('\n');

  const toolRows = t.raw('home.toolsTeaser.cards').map((c) => `          <a class="trow" href="${ctx.link('tools/')}#${c.id}">
            <svg class="trow__icon icon" aria-hidden="true"><use href="#${TOOL_ICON[c.id]}"/></svg>
            <span class="trow__body"><strong>${esc(c.title)}</strong><span>${esc(c.text)}</span></span>
            <span class="trow__open">${t('home.toolsTeaser.open')}</span>
          </a>`).join('\n');

  const guideCards = Object.keys(ctx.guides).map((slug) => {
    const gd = ctx.guides[slug];
    return `          <a class="gcard" href="${ctx.link('guides/' + slug + '/')}">
            <h3>${esc(gd.h1)}</h3>
            <p>${esc(gd.excerpt)}</p>
            <span class="gcard__more">${t('ui.common.readGuide')}</span>
          </a>`;
  }).join('\n');

  const steps = t.raw('home.process.steps').map((s, i) => `<li><span class="steps__n" aria-hidden="true">${i + 1}</span><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></li>`).join('\n          ');
  const glance = t.raw('home.about.glance').map((x) => `<div><dt>${esc(x.label)}</dt><dd>${esc(x.value)}</dd></div>`).join('\n          ');
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
  const redirect = lang === 'en' && !ctx.single
    ? `\n  <script>try{if(localStorage.getItem('eii_lang')==='hi'&&!/[?&]lang=en/.test(location.search)&&location.pathname.slice(-3)!=='hi/')location.replace('hi/index.html'+location.hash)}catch(e){}</script>` : '';

  return `${L.head(ctx, { path: '', title: t.raw('home.title'), description: t.raw('home.description'), ogDescription: t.raw('home.ogDescription'), jsonld: titleLd, headExtra: redirect })}
<body data-page="home">
  ${L.header(ctx, { path: '', current: 'home' })}

  <main id="main">

    <!-- ===================== HERO ===================== -->
    <section class="hero" id="hero">
      <div class="container hero__grid">
        <div class="hero__copy">
          <h1>${esc(h1)}</h1>
          <p class="lead">${t(hero + '.lead')}</p>
          <div class="hero__actions">
            <a class="btn btn--wa btn--lg" href="${wa}" target="_blank" rel="noopener" data-track="whatsapp_click" data-track-where="hero">
              <svg class="icon" aria-hidden="true"><use href="#i-wa"/></svg> ${t(hero + '.ctaWa')}
            </a>
            <a class="btn btn--ghost btn--lg" href="tel:${SITE.phoneTel}" data-track="call_click" data-track-where="hero">
              <svg class="icon" aria-hidden="true"><use href="#i-phone"/></svg> ${t(hero + '.ctaCall')}
            </a>
          </div>

          <dl class="facts">
            <div><dt>${t('home.facts.sheet')}</dt><dd>1220 × 2440 mm</dd></div>
            <div><dt>${t('home.facts.thickness')}</dt><dd>1 ${t('home.facts.thicknessTo')} 20 mm</dd></div>
            <div><dt>${t('home.facts.dispatch')}</dt><dd>${t('home.facts.dispatchValue')}</dd></div>
            <div><dt>${t('home.facts.billing')}</dt><dd>${t('home.facts.billingValue')}</dd></div>
          </dl>
        </div>

        <div class="stage" id="stage" data-figure="${esc(t.raw(hero + '.gauge.figure'))}">
          <figure class="stage__fig">
            <div class="stage__art" id="stageArt">${Sheet.svg(START_MM, g.figure.replace('{n}', START_MM))}</div>
          </figure>

          <div class="gauge" id="gauge" data-gauge data-start="${stdIdx}" data-wa-tpl="${esc(quoteMsg('{n}'))}" data-wa-label="${esc(g.wa)}" data-add-label="${esc(g.add)}">
            <div class="gauge__head">
              <label class="gauge__label" for="gRange">${esc(g.label)}</label>
              <output class="gauge__val" id="gVal" for="gRange"><b id="gNum">${START_MM}</b> ${esc(g.unit)}</output>
            </div>
            <div class="gauge__ctl">
              <input class="gauge__range" id="gRange" type="range" min="0" max="${Sheet.STD.length - 1}" step="1" value="${stdIdx}" aria-label="${esc(g.slider)}" aria-valuetext="${START_MM} ${esc(g.unit)}">
              <div class="gauge__ticks" role="group" aria-label="${esc(g.presets)}">${ticks}</div>
            </div>
            <dl class="gauge__read">
              <div><dt>${esc(g.weight)}</dt><dd id="gKg">${fmtKg(Sheet.kg(START_MM))} kg</dd></div>
              <div><dt>${esc(g.perSqm)}</dt><dd id="gSqm">${(START_MM * Sheet.DENSITY).toFixed(2)} kg</dd></div>
            </dl>
            <div class="gauge__actions">
              <a class="btn btn--wa" id="gWa" href="${L.waUrl(quoteMsg(START_MM))}" target="_blank" rel="noopener" data-track="whatsapp_click" data-track-where="hero_gauge" data-track-item="pvc-sheets"><svg class="icon" aria-hidden="true"><use href="#i-wa"/></svg> <span id="gWaTxt">${fill(g.wa, START_MM)}</span></a>
              <button class="btn btn--outline" id="gAdd" type="button" data-add="${addJson(START_MM)}"><svg class="icon" aria-hidden="true"><use href="#i-plus"/></svg> <span id="gAddTxt">${fill(g.add, START_MM)}</span></button>
            </div>
            <p class="gauge__note">${esc(g.note)}</p>
          </div>
        </div>
      </div>

    </section>

    <!-- ===================== PRODUCTS ===================== -->
    <section class="section" id="products">
      <div class="container">
        <header class="section__head">
          <h2>${t('home.products.h2')}</h2>
          <p class="section__sub">${t('home.products.sub')}</p>
        </header>

        <div class="pindex">
          <div class="pindex__lists">
${groups}
          </div>
          <aside class="pindex__stage" aria-hidden="true">
            <div class="pindex__plate">${stageImgs}</div>
            <p class="pindex__cap"><strong id="piName">${esc(productName('pvc-sheets'))}</strong><span id="piSpec">${t('home.products.cards.pvc-sheets.spec')}</span></p>
          </aside>
        </div>

        <p class="products__note">${t('home.products.note')}</p>
      </div>
    </section>

    <!-- ===================== INDUSTRIES ===================== -->
    <section class="section section--panel" id="industries">
      <div class="container">
        <header class="section__head">
          <h2>${t('home.industries.h2')}</h2>
          <p class="section__sub">${t('home.industries.sub')}</p>
        </header>
        <div class="ind-grid">
${indCards}
        </div>
      </div>
    </section>

    <!-- ===================== TOOLS ===================== -->
    <section class="section" id="tools">
      <div class="container tools-split">
        <header class="section__head">
          <h2>${t('home.toolsTeaser.h2')}</h2>
          <p class="section__sub">${t('home.toolsTeaser.sub')}</p>
        </header>
        <div class="trows">
${toolRows}
        </div>
      </div>
    </section>

    <!-- ===================== PROCESS ===================== -->
    <section class="section section--panel" id="process">
      <div class="container">
        <header class="section__head">
          <h2>${t('home.process.h2')}</h2>
        </header>
        <ol class="steps">
          ${steps}
        </ol>
      </div>
    </section>

    <!-- ===================== ABOUT ===================== -->
    <section class="section" id="about">
      <div class="container about">
        <div class="about__copy">
          <h2>${t('home.about.h2')}</h2>
          ${t.raw('home.about.paras').map((p) => `<p>${esc(p)}</p>`).join('\n          ')}
        </div>
        <dl class="glance">
          ${glance}
        </dl>
      </div>
    </section>

    <!-- ===================== GUIDES ===================== -->
    <section class="section section--panel" id="guides">
      <div class="container">
        <header class="section__head">
          <h2>${t('home.guides.h2')}</h2>
          <p class="section__sub">${t('home.guides.sub')}</p>
        </header>
        <div class="gcards">
${guideCards}
        </div>
      </div>
    </section>

    <!-- ===================== FAQ ===================== -->
    <section class="section" id="faq">
      <div class="container faqwrap">
        <header class="section__head faqwrap__head">
          <h2>${t('home.faq.h2')}</h2>
          <p class="section__sub">${faqSub}</p>
        </header>
        <div class="faq">
${faq}
        </div>
      </div>
    </section>

    <!-- ===================== CONTACT ===================== -->
    <section class="section section--dark" id="contact">
      <div class="container contact">
        <div class="contact__info">
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

        <form class="form" id="quoteForm" novalidate>
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

  ${L.scripts(ctx, ['sheet-art.js'])}
</body>
</html>
`;
};
