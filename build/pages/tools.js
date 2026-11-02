const L = require('../layout');
const { esc } = require('../lib');

module.exports = function tools(ctx) {
  const { t } = ctx;
  const path = 'tools/';
  const num = (id, label, attrs, help) => `<label for="${id}">${label}<input id="${id}" type="number" inputmode="decimal" ${attrs}>${help ? `<small class="help">${help}</small>` : ''}</label>`;
  const sizeSel = (id, k) => `<label for="${id}">${t(k + '.' + (k === 'tools.weight' ? 'size' : 'sheet'))}<select id="${id}"><option value="1220x2440" selected>1220 × 2440 mm</option><option value="1000x2000">1000 × 2000 mm</option><option value="custom">${t(k + '.custom')}</option></select></label>`;
  const radio = (name, items) => `<div class="opts">${items.map(([v, txt]) => `<label class="opt"><input type="radio" name="${name}" value="${v}"><span>${esc(txt)}</span></label>`).join('')}</div>`;
  const apps = ['panel', 'spacer', 'meter', 'guard', 'tank', 'sign'].map((k) => [k, t.raw('tools.thickness.apps.' + k)]);
  const sizes = ['s', 'm', 'l', 'xl'].map((k) => [k, t.raw('tools.thickness.sizes.' + k)]);
  const support = ['full', 'edge'].map((k) => [k, t.raw('tools.thickness.support.' + k)]);
  const live = ['no', 'yes'].map((k) => [k, t.raw('tools.thickness.live.' + k)]);

  const ld = [L.breadcrumbLd(ctx, [[t.raw('ui.common.home'), ctx.abs('', ctx.lang)], [t.raw('ui.common.tools'), ctx.abs(path, ctx.lang)]])];
  const extra = { tools: Object.assign({}, ctx.dict.tools, { js: ctx.dict.js.tools, en: require('../i18n/en').tools.thickness }) };

  return `${L.head(ctx, { path, title: t.raw('tools.title'), description: t.raw('tools.description'), jsonld: ld })}
<body data-page="tools">
  ${L.header(ctx, { path, current: 'tools' })}
  <main id="main" class="pv">
    <div class="container">
      <nav class="crumbs" aria-label="${t('product.crumbNav')}"><a href="${ctx.link('')}">${t('ui.common.home')}</a><span>/</span><span aria-current="page">${t('ui.common.tools')}</span></nav>
      <header class="pagehead">
        <p class="kicker">${t('tools.kicker')}</p>
        <h1>${t('tools.h1')}</h1>
        <p class="lead">${t('tools.lead')}</p>
        <nav class="jump" aria-label="${t('ui.common.tools')}">
          <a href="#weight"><svg class="icon" aria-hidden="true"><use href="#i-scale"/></svg>${t('tools.jump.weight')}</a>
          <a href="#fit"><svg class="icon" aria-hidden="true"><use href="#i-fit"/></svg>${t('tools.jump.fit')}</a>
          <a href="#thickness"><svg class="icon" aria-hidden="true"><use href="#i-ruler"/></svg>${t('tools.jump.thickness')}</a>
        </nav>
      </header>

      <!-- ============ Weight & cost ============ -->
      <section class="tool" id="weight" data-tool="weight">
        <header class="tool__head"><svg class="icon" aria-hidden="true"><use href="#i-scale"/></svg><div><h2>${t('tools.weight.title')}</h2><p>${t('tools.weight.intro')}</p></div></header>
        <div class="tool__grid">
          <form class="tool__form" id="wForm" novalidate>
            ${num('wThk', t('tools.weight.thickness'), 'value="5" min="0.5" max="50" step="0.5" list="thkList"')}
            <datalist id="thkList"><option value="1"><option value="2"><option value="3"><option value="4"><option value="5"><option value="6"><option value="8"><option value="10"><option value="12"><option value="15"><option value="20"></datalist>
            ${sizeSel('wSize', 'tools.weight')}
            <div class="tool__two" id="wCustom" hidden>${num('wLen', t('tools.weight.length'), 'value="2440" min="50" max="3000" step="1"')}${num('wWid', t('tools.weight.width'), 'value="1220" min="50" max="3000" step="1"')}</div>
            ${num('wQty', t('tools.weight.qty'), 'value="10" min="1" max="100000" step="1"')}
            ${num('wRate', t('tools.weight.rate'), 'min="0" step="0.5" placeholder="0"', t('tools.weight.rateHelp'))}
            <div class="tool__two">${num('wGst', t('tools.weight.gst'), 'value="18" min="0" max="40" step="0.5"', t('tools.weight.gstHelp'))}${num('wDen', t('tools.weight.density'), 'value="1.35" min="1" max="1.6" step="0.01"', t('tools.weight.densityHelp'))}</div>
          </form>
          <div class="tool__result"><div class="tool__out" id="wOut" role="status" aria-live="polite"></div><div class="tool__actions" id="wActions" hidden><button type="button" class="btn btn--primary btn--sm" id="wAdd"><svg class="icon" aria-hidden="true"><use href="#i-plus"/></svg> ${t('tools.weight.add')}</button><a class="btn btn--wa btn--sm" id="wWa" target="_blank" rel="noopener" data-track="whatsapp_click" data-track-where="tool_weight" href="#"><svg class="icon" aria-hidden="true"><use href="#i-wa"/></svg> ${t('tools.weight.wa')}</a></div></div>
        </div>
      </section>

      <!-- ============ Fit checker ============ -->
      <section class="tool" id="fit" data-tool="fit">
        <header class="tool__head"><svg class="icon" aria-hidden="true"><use href="#i-fit"/></svg><div><h2>${t('tools.fit.title')}</h2><p>${t('tools.fit.intro')}</p></div></header>
        <div class="tool__grid">
          <form class="tool__form" id="fForm" novalidate>
            ${sizeSel('fSize', 'tools.fit')}
            <div class="tool__two" id="fCustom" hidden>${num('fSL', t('tools.fit.sheetLength'), 'value="2440" min="100" max="3000" step="1"')}${num('fSW', t('tools.fit.sheetWidth'), 'value="1220" min="100" max="3000" step="1"')}</div>
            <div class="tool__two">${num('fPL', t('tools.fit.panelLength'), 'value="600" min="20" max="3000" step="1"')}${num('fPW', t('tools.fit.panelWidth'), 'value="400" min="20" max="3000" step="1"')}</div>
            <div class="tool__two">${num('fKerf', t('tools.fit.kerf'), 'value="3" min="0" max="20" step="0.5"', t('tools.fit.kerfHelp'))}${num('fQty', t('tools.fit.qty'), 'value="20" min="1" max="100000" step="1"')}</div>
            <label class="chk chk--row"><input type="checkbox" id="fRot" checked> <span>${t('tools.fit.rotate')}<small class="help">${t('tools.fit.rotateHelp')}</small></span></label>
          </form>
          <div class="tool__result"><div class="tool__out" id="fOut" role="status" aria-live="polite"></div><div class="tool__actions" id="fActions" hidden><button type="button" class="btn btn--primary btn--sm" id="fAdd"><svg class="icon" aria-hidden="true"><use href="#i-plus"/></svg> ${t('tools.fit.add')}</button><a class="btn btn--wa btn--sm" id="fWa" target="_blank" rel="noopener" data-track="whatsapp_click" data-track-where="tool_fit" href="#"><svg class="icon" aria-hidden="true"><use href="#i-wa"/></svg> ${t('tools.fit.wa')}</a></div></div>
        </div>
      </section>

      <!-- ============ Which thickness ============ -->
      <section class="tool" id="thickness" data-tool="thickness">
        <header class="tool__head"><svg class="icon" aria-hidden="true"><use href="#i-ruler"/></svg><div><h2>${t('tools.thickness.title')}</h2><p>${t('tools.thickness.intro')}</p></div></header>
        <div class="tool__grid tool__grid--wiz">
          <form class="wiz" id="thkForm" novalidate>
            <fieldset data-step="1"><legend>${t('tools.thickness.q1')}</legend>${radio('app', apps)}</fieldset>
            <fieldset data-step="2"><legend>${t('tools.thickness.q2')}</legend>${radio('size', sizes)}</fieldset>
            <fieldset data-step="3"><legend>${t('tools.thickness.q3')}</legend>${radio('support', support)}</fieldset>
            <fieldset data-step="4"><legend>${t('tools.thickness.q4')}</legend>${radio('live', live)}</fieldset>
            <p class="wiz__err" id="thkErr" role="alert" hidden></p>
            <div class="wiz__nav"><button class="btn btn--outline btn--sm" type="button" id="thkBack" hidden>${t('tools.thickness.back')}</button><span class="wiz__step mono" id="thkStep"></span><button class="btn btn--primary btn--sm" type="submit" id="thkNext">${t('tools.thickness.calc')}</button></div>
          </form>
          <div class="tool__out" id="thkOut" role="status" aria-live="polite"></div>
        </div>
      </section>

      <p class="tools__help"><svg class="icon" aria-hidden="true"><use href="#i-wa"/></svg> <a href="${L.waUrl(t.raw('ui.waGreeting'))}" target="_blank" rel="noopener" data-track="whatsapp_click" data-track-where="tools_help">${t('ui.common.needHelp')}</a></p>
    </div>
  </main>
  ${L.footer(ctx)}
  ${L.scripts(ctx, ['tools.js'], extra)}
</body>
</html>
`;
};
