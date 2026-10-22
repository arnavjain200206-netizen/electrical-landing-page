const SITE = require('../site');
const L = require('../layout');
const { esc } = require('../lib');

const THICK = [1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 20];
const fmt = (n, d) => n.toFixed(d);

function weightsTable(ctx) {
  const { t } = ctx;
  const rows = THICK.map((m) => `<tr><th scope="row">${m} mm</th><td>${fmt(1.22 * 2.44 * m * 1.35, 1)} kg</td><td>${fmt(m * 1.35, 2)} kg</td></tr>`).join('');
  return `<div class="ptable"><table><thead><tr><th scope="col">${t('guides.weights.thickness')}</th><th scope="col">${t('guides.weights.perSheet')}</th><th scope="col">${t('guides.weights.perSqm')}</th></tr></thead><tbody>${rows}</tbody></table></div><p class="pnote">${t('guides.weights.note')}</p>`;
}

function index(ctx) {
  const { t } = ctx;
  const path = 'guides/';
  const cards = Object.keys(ctx.guides).map((slug) => {
    const g = ctx.guides[slug];
    return `<a class="gcard" href="${ctx.link('guides/' + slug + '/')}"><svg class="gcard__icon icon" aria-hidden="true"><use href="#i-book"/></svg><h2>${esc(g.h1)}</h2><p>${esc(g.excerpt)}</p><span class="tcard__more">${t('guides.readMore')} <svg class="icon" aria-hidden="true"><use href="#i-arrow"/></svg></span></a>`;
  }).join('\n        ');
  const ld = [L.breadcrumbLd(ctx, [[t.raw('ui.common.home'), ctx.abs('', ctx.lang)], [t.raw('ui.common.guides'), ctx.abs(path, ctx.lang)]])];
  return `${L.head(ctx, { path, title: t.raw('guides.indexTitle'), description: t.raw('guides.indexDescription'), jsonld: ld })}
<body data-page="guides">
  ${L.header(ctx, { path, current: 'guides' })}
  <main id="main" class="pv">
    <div class="container">
      <nav class="crumbs" aria-label="${t('product.crumbNav')}"><a href="${ctx.link('')}">${t('ui.common.home')}</a><span>/</span><span aria-current="page">${t('ui.common.guides')}</span></nav>
      <header class="pagehead"><p class="kicker">${t('guides.kicker')}</p><h1>${t('guides.h1')}</h1><p class="lead">${t('guides.lead')}</p></header>
      <div class="gcards gcards--page">
        ${cards}
      </div>
    </div>
  </main>
  ${L.footer(ctx)}
  ${L.scripts(ctx, [])}
</body>
</html>
`;
}

function article(ctx, slug) {
  const { t } = ctx;
  const g = ctx.guides[slug];
  const path = 'guides/' + slug + '/';
  const toc = g.sections.map((s) => `<li><a href="#${s.id}">${esc(s.h2)}</a></li>`).join('') + `<li><a href="#faq">${t('guides.faqTitle')}</a></li>`;
  const body = g.sections.map((s) => {
    let h = `<section class="art__sec" id="${s.id}"><h2>${esc(s.h2)}</h2>`;
    (s.p || []).forEach((p) => { h += `<p>${esc(p)}</p>`; });
    if (s.table) h += `<div class="ptable"><table><thead><tr>${s.table.head.map((x) => `<th scope="col">${esc(x)}</th>`).join('')}</tr></thead><tbody>${s.table.rows.map((r) => `<tr>${r.map((c, i) => (i === 0 ? `<th scope="row">${esc(c)}</th>` : `<td>${esc(c)}</td>`)).join('')}</tr>`).join('')}</tbody></table></div>`;
    if (s.ul) h += `<ul class="ticks">${s.ul.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>`;
    if (s.weights) h += weightsTable(ctx);
    return h + '</section>';
  }).join('\n');
  const faq = g.faqs.map((f) => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('');
  const relatedProd = slug.startsWith('pvc') ? ['pvc-sheets', 'cut-to-size'] : ['stretch-film', 'edge-guard'];
  const rel = ctx.rel;
  const relCards = relatedProd.map((s) => `<a class="rel" href="${ctx.link('products/' + s + '/')}"><img src="${rel}assets/products/${s}.svg" alt="" width="600" height="450" loading="lazy"><span><strong>${esc(ctx.products[s].name)}</strong><em>${t('product.viewDetails')}</em></span></a>`).join('');
  const ld = [
    L.breadcrumbLd(ctx, [[t.raw('ui.common.home'), ctx.abs('', ctx.lang)], [t.raw('ui.common.guides'), ctx.abs('guides/', ctx.lang)], [g.h1, ctx.abs(path, ctx.lang)]]),
    L.faqLd(g.faqs),
    { '@context': 'https://schema.org', '@type': 'Article', headline: g.title, description: g.description, datePublished: SITE.guidesPublished, dateModified: SITE.guidesPublished, inLanguage: ctx.lang === 'hi' ? 'hi-IN' : 'en-IN', mainEntityOfPage: ctx.abs(path, ctx.lang), image: SITE.url + 'assets/og-image.png', author: { '@type': 'Organization', name: SITE.name }, publisher: { '@type': 'Organization', name: SITE.name } }
  ];
  return `${L.head(ctx, { path, title: g.seoTitle + ' | Electrical Insulation India', description: g.description, ogType: 'article', jsonld: ld })}
<body data-page="guide" data-slug="${slug}">
  ${L.header(ctx, { path, current: 'guides' })}
  <main id="main" class="pv">
    <div class="container">
      <nav class="crumbs" aria-label="${t('product.crumbNav')}"><a href="${ctx.link('')}">${t('ui.common.home')}</a><span>/</span><a href="${ctx.link('guides/')}">${t('ui.common.guides')}</a><span>/</span><span aria-current="page">${esc(g.h1)}</span></nav>
      <div class="art">
        <article class="art__main">
          <header class="pagehead"><p class="kicker">${t('guides.kicker')}</p><h1>${esc(g.h1)}</h1><p class="art__meta mono">${t('guides.published')}: <time datetime="${SITE.guidesPublished}">${SITE.guidesPublished}</time></p><p class="lead">${esc(g.intro)}</p></header>
          ${body}
          <section class="art__sec" id="faq"><h2>${t('guides.faqTitle')}</h2><div class="faq">${faq}</div></section>
          <section class="art__cta">
            <h2>${t('guides.ctaTitle')}</h2>
            <p>${t('guides.ctaText')}</p>
            <div class="art__ctaRow">
              <a class="btn btn--wa" href="${L.waUrl('Hi, I read your guide: ' + ctx.guidesEn[slug].h1 + '. I need help choosing.')}" target="_blank" rel="noopener" data-track="whatsapp_click" data-track-where="guide" data-track-item="${slug}"><svg class="icon" aria-hidden="true"><use href="#i-wa"/></svg> ${t('ui.common.whatsappCta')}</a>
              <a class="btn btn--outline" href="${ctx.link('tools/')}">${t('guides.ctaTools')}</a>
            </div>
            <div class="relgrid relgrid--2">${relCards}</div>
          </section>
        </article>
        <aside class="art__toc" aria-label="${t('guides.onThisPage')}"><p class="mono">${t('guides.onThisPage')}</p><ol>${toc}</ol></aside>
      </div>
    </div>
  </main>
  ${L.footer(ctx)}
  ${L.scripts(ctx, [])}
</body>
</html>
`;
}

module.exports = { index, article, THICK };
