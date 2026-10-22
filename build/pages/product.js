const SITE = require('../site');
const L = require('../layout');
const { esc } = require('../lib');

module.exports = function product(ctx, slug) {
  const { t, rel } = ctx;
  const p = ctx.products[slug], pe = ctx.productsEn[slug];
  const dict = (group, key) => { const g = ctx.dict.ui[group]; return Object.prototype.hasOwnProperty.call(g, key) ? g[key] : key; };
  const pagePath = 'products/' + slug + '/';
  const quickMsg = `Hi, I would like the price for ${pe.name}. Please share details.`;

  const list = (items, cls) => `<ul class="${cls}">${items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>`;
  const table = (head, rows) => `<div class="ptable"><table><thead><tr>${head.map((h) => `<th scope="col">${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c, i) => (i === 0 ? `<th scope="row">${esc(c)}</th>` : `<td>${esc(c)}</td>`)).join('')}</tr>`).join('')}</tbody></table></div>`;

  const fields = pe.fields.map((f, i) => {
    const id = 'qf' + i;
    const label = esc(dict('fieldLabels', f.id));
    const ctl = f.type === 'select'
      ? `<select id="${id}" data-field="${esc(f.id)}"><option value="">${t('product.qb.select')}</option>${f.options.map((o) => `<option value="${esc(o)}">${esc(dict('options', o))}</option>`).join('')}</select>`
      : `<input id="${id}" type="text" data-field="${esc(f.id)}" placeholder="${esc(dict('placeholders', f.placeholder || ''))}">`;
    return `<label for="${id}">${label}${ctl}</label>`;
  }).join('\n              ');

  const faqs = p.faqs.map((f) => `<details><summary>${esc(f[0])}</summary><p>${esc(f[1])}</p></details>`).join('');
  const related = (pe.related || []).map((s) => `<a class="rel" href="${ctx.link('products/' + s + '/')}"><img src="${rel}assets/products/${s}.svg" alt="" width="600" height="450" loading="lazy"><span><strong>${esc(ctx.products[s].name)}</strong><em>${t('product.viewDetails')}</em></span></a>`).join('');

  const title = `${p.name} – ${t.raw('product.titleSuffix')}`;
  const description = `${p.tagline} ${t.raw('product.metaTail')}`;
  const ld = [
    L.breadcrumbLd(ctx, [[t.raw('ui.common.home'), ctx.abs('', ctx.lang)], [t.raw('ui.common.products'), ctx.abs('', ctx.lang) + '#products'], [p.name, ctx.abs(pagePath, ctx.lang)]]),
    L.faqLd(p.faqs.map((f) => ({ q: f[0], a: f[1] })))
  ];

  return `${L.head(ctx, { path: pagePath, title, description, jsonld: ld })}
<body data-page="product" data-slug="${slug}">
  ${L.header(ctx, { path: pagePath, current: 'products' })}

  <main id="main" class="pv">
    <div class="container">
      <nav class="crumbs" aria-label="${t('product.crumbNav')}"><a href="${ctx.link('')}">${t('ui.common.home')}</a><span>/</span><a href="${ctx.link('')}#products">${t('ui.common.products')}</a><span>/</span><span aria-current="page">${esc(p.name)}</span></nav>
      <section class="phero">
        <div class="phero__media"><img src="${rel}assets/products/${slug}.svg" alt="${esc(p.name)}" width="600" height="450" fetchpriority="high"></div>
        <div class="phero__copy">
          <p class="kicker">${t('product.kicker')}</p>
          <h1 id="pvTitle">${esc(p.name)}</h1>
          <p class="phero__tag">${esc(p.tagline)}</p>
          <ul class="pchips">${p.highlights.map((h) => `<li><svg class="icon" aria-hidden="true"><use href="#i-check"/></svg>${esc(h)}</li>`).join('')}</ul>
          <div class="pricebox"><strong>${t('product.priceTitle')}</strong><span>${t('product.priceText')}</span></div>
          <div class="phero__actions">
            <a class="btn btn--wa btn--lg" href="#quote" data-jump="quote"><svg class="icon" aria-hidden="true"><use href="#i-wa"/></svg> ${t('product.buildQuote')}</a>
            <a class="btn btn--outline btn--lg" href="${L.waUrl(quickMsg)}" target="_blank" rel="noopener" data-track="whatsapp_click" data-track-where="product_quick" data-track-item="${slug}">${t('product.quick')}</a>
          </div>
        </div>
      </section>

      <div class="pgrid">
        <div class="pmain">
          <section class="pblock"><h2>${t('product.overview')}</h2>${p.overview.map((x) => `<p>${esc(x)}</p>`).join('')}</section>
          <section class="pblock"><h2>${t('product.specs')}</h2><dl class="pspecs">${p.specs.map((s) => `<div><dt>${esc(s[0])}</dt><dd>${esc(s[1])}</dd></div>`).join('')}</dl></section>
          <section class="pblock"><h2>${esc(p.sizesTitle)}</h2>${table(p.sizesHead, p.sizes)}${p.sizesNote ? `<p class="pnote">${esc(p.sizesNote)}</p>` : ''}</section>
          <section class="pblock pblock--cols"><div><h2>${t('product.applications')}</h2>${list(p.applications, 'ticks')}</div><div><h2>${t('product.features')}</h2>${list(p.features, 'ticks')}</div></section>
          <section class="pblock"><h2>${t('product.packing')}</h2>${list(p.packing, 'ticks')}</section>
          <section class="pblock"><h2>${t('product.faqs')}</h2><div class="faq">${faqs}</div></section>
        </div>

        <aside class="pside" id="quote" aria-labelledby="quoteTitle">
          <form class="qb" id="quoteBuilder" data-slug="${slug}" novalidate>
            <h2 id="quoteTitle"><svg class="icon" aria-hidden="true"><use href="#i-wa"/></svg> ${t('product.qb.title')}</h2>
            <p class="qb__hint">${t('product.qb.hint')}</p>
            ${fields}
            <label>${t('product.qb.city')}<input type="text" data-field="Delivery city" placeholder="${t('product.qb.cityPh')}"></label>
            <label>${t('product.qb.yourName')}<input type="text" data-field="__name" placeholder="${t('product.qb.yourNamePh')}" autocomplete="name"></label>
            <fieldset class="qb__extras"><legend>${t('product.qb.also')}</legend>
              <label class="chk"><input type="checkbox" value="GST invoice"> ${t('product.qb.gst')}</label>
              <label class="chk"><input type="checkbox" value="Sample"> ${t('product.qb.sample')}</label>
              <label class="chk"><input type="checkbox" value="Freight / delivery charges"> ${t('product.qb.freight')}</label>
            </fieldset>
            <label>${t('product.qb.notes')}<input type="text" data-field="Notes" placeholder="${t('product.qb.notesPh')}"></label>
            <label for="qbMsg">${t('product.qb.msgLabel')}</label>
            <textarea id="qbMsg" rows="9"></textarea>
            <div class="qb__actions">
              <a class="btn btn--wa btn--lg" id="qbSend" href="#" target="_blank" rel="noopener" data-track="whatsapp_click" data-track-where="product_builder" data-track-item="${slug}"><svg class="icon" aria-hidden="true"><use href="#i-wa"/></svg> ${t('product.qb.send')}</a>
              <button type="button" class="btn btn--outline btn--sm" id="qbAdd"><svg class="icon" aria-hidden="true"><use href="#i-plus"/></svg> ${t('product.qb.addList')}</button>
              <button type="button" class="btn btn--outline btn--sm" id="qbCopy">${t('product.qb.copy')}</button>
              <button type="button" class="btn btn--outline btn--sm" id="qbReset">${t('product.qb.reset')}</button>
            </div>
            <p class="qb__status" id="qbStatus" role="status"></p>
            <p class="qb__contact">${t('product.qb.preferCall')} <a href="tel:${SITE.phoneTel}" data-track="call_click" data-track-where="product_builder">${esc(SITE.phoneDisplay)}</a> · <a href="mailto:${SITE.email}" data-track="email_click" data-track-where="product_builder">${esc(SITE.email)}</a></p>
          </form>
        </aside>
      </div>

      <section class="pblock prelated"><h2>${t('product.related')}</h2><div class="relgrid">${related}</div>
        <p><a class="btn btn--outline" href="${ctx.link('')}#products">${t('product.back')}</a></p></section>
    </div>
  </main>

  ${L.footer(ctx)}

  ${L.scripts(ctx, ['quote-builder.js'])}
</body>
</html>
`;
};
