/* Buyer tools: PVC weight & cost, cut-to-size fit checker, thickness guide. Plain JS, no libraries. */
(function () {
  'use strict';
  var E = window.EII, T = E.strings.tools, M = T.js;
  var nfCache = {};
  function f(n, d) {
    d = d == null ? 2 : d;
    var k = d; nfCache[k] = nfCache[k] || new Intl.NumberFormat('en-IN', { maximumFractionDigits: d, minimumFractionDigits: 0 });
    return nfCache[k].format(n);
  }
  function $(id) { return document.getElementById(id); }
  function num(id) { var v = parseFloat($(id).value); return isFinite(v) ? v : NaN; }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function res(label, value, cls) { return '<div class="res' + (cls ? ' ' + cls : '') + '"><span>' + esc(label) + '</span><strong>' + value + '</strong></div>'; }
  function err(msg) { return '<p class="tool__err" role="alert">' + esc(msg) + '</p>'; }
  function waHref(text) { return 'https://wa.me/' + E.wa + '?text=' + encodeURIComponent(text); }
  var used = {};
  function firstUse(name) { if (!used[name]) { used[name] = true; if (window.track) window.track('tool_use', { item: name, where: 'tools' }); } }
  function addToBasket(item, btn) {
    if (window.EIIBasket) window.EIIBasket.add(item);
    if (btn) { btn.classList.add('is-added'); setTimeout(function () { btn.classList.remove('is-added'); }, 1400); }
  }
  function lines(details) { return details.map(function (d) { return '• ' + d[0] + ': ' + d[1]; }).join('\n'); }
  function parseSize(v) { var p = v.split('x'); return [parseInt(p[0], 10), parseInt(p[1], 10)]; }

  /* ============================ 1. Weight & cost ============================ */
  function initWeight() {
    var W = T.weight, out = $('wOut'), acts = $('wActions'), cur = null; if (!out) return;
    var ids = ['wThk', 'wSize', 'wLen', 'wWid', 'wQty', 'wRate', 'wGst', 'wDen'];
    function fail(msg) { out.innerHTML = err(msg); acts.hidden = true; cur = null; }
    function run() {
      var custom = $('wSize').value === 'custom';
      $('wCustom').hidden = !custom;
      var thk = num('wThk'), qty = Math.floor(num('wQty')), den = num('wDen'), rate = num('wRate'), gst = num('wGst'), L, Wd;
      if (custom) { L = num('wLen'); Wd = num('wWid'); } else { var s = parseSize($('wSize').value); L = s[1]; Wd = s[0]; }
      if (!(thk >= 0.5 && thk <= 50)) { fail(W.errThickness); return; }
      if (!(L >= 50 && L <= 3000 && Wd >= 50 && Wd <= 3000)) { fail(W.errSize); return; }
      if (!(qty >= 1)) { fail(W.errQty); return; }
      if (!(den >= 1 && den <= 1.6)) den = 1.35;
      var per = (L * Wd * thk / 1e9) * den * 1000, total = per * qty, area = L * Wd / 1e6 * qty;
      var h = '<div class="res-grid">' + res(W.outPerSheet, f(per, 2) + ' ' + W.kg) + res(W.outTotal, f(total, 1) + ' ' + W.kg, 'res--big') +
        res(W.outTonnes, f(total / 1000, 3) + ' ' + W.t) + res(W.outArea, f(area, 2) + ' ' + W.sqm);
      if (rate > 0) {
        var mat = total * rate, g = isFinite(gst) && gst > 0 ? mat * gst / 100 : 0, grand = mat + g;
        h += res(W.outMaterial, '₹ ' + f(mat, 0)) + res(W.outGst + (g ? ' (' + f(gst, 1) + '%)' : ''), '₹ ' + f(g, 0)) + res(W.outGrand, '₹ ' + f(grand, 0), 'res--big') + res(W.outPerSheetCost, '₹ ' + f(grand / qty, 0));
      }
      h += '</div><p class="pnote">' + esc(W.note) + '</p>';
      out.innerHTML = h;
      var details = [['Thickness', f(thk, 1) + ' mm'], ['Sheet size', L + ' × ' + Wd + ' mm'], ['Quantity', qty + ' sheets'], ['Estimated weight', f(total, 1) + ' kg']];
      if (rate > 0) details.push(['Rate discussed', '₹ ' + f(rate, 1) + ' per kg']);
      cur = details; acts.hidden = false;
      $('wWa').href = waHref(M.waWeight + '\n*' + E.namesEn['pvc-sheets'] + '*\n' + lines(details));
    }
    // the buttons are never re-rendered, so a click that starts after typing is not lost
    $('wAdd').addEventListener('click', function () { if (cur) addToBasket({ slug: 'pvc-sheets', details: cur }, this); });
    ids.forEach(function (id) { $(id).addEventListener('input', function () { firstUse('weight'); run(); }); $(id).addEventListener('change', run); });
    run();
  }

  /* ============================ 2. Cut-to-size fit ============================ */
  function initFit() {
    var F = T.fit, out = $('fOut'), acts = $('fActions'), cur = null; if (!out) return;
    var ids = ['fSize', 'fSL', 'fSW', 'fPL', 'fPW', 'fKerf', 'fQty', 'fRot'];

    function patterns(dims, limit) {
      var seen = { 0: 1 }, arr = [0], i, j;
      for (i = 0; i < arr.length; i++) for (j = 0; j < dims.length; j++) { var s = arr[i] + dims[j]; if (s <= limit && !seen[s]) { seen[s] = 1; arr.push(s); } }
      return arr.sort(function (a, b) { return a - b; });
    }
    function floorTo(arr, v) { var lo = 0, hi = arr.length - 1; while (lo < hi) { var mid = (lo + hi + 1) >> 1; if (arr[mid] <= v) lo = mid; else hi = mid - 1; } return arr[lo]; }

    // Guillotine cutting, one panel type. Kerf is folded into the sizes (sheet+kerf, panel+kerf).
    function solve(L, Wd, pl, pw, kerf, rotate) {
      var X = L + kerf, Y = Wd + kerf, a = pl + kerf, b = pw + kerf;
      var pieces = rotate && a !== b ? [[a, b, 0], [b, a, 1]] : [[a, b, 0]];
      var dx = rotate ? (a === b ? [a] : [a, b]) : [a], dy = rotate ? (a === b ? [a] : [a, b]) : [b];
      var px = patterns(dx, X), py = patterns(dy, Y);
      var rects = [], n = 0;
      if (px.length * py.length * (px.length + py.length) <= 3e7) {
        var memo = new Map();
        var best = function (x, y) {
          x = floorTo(px, x); y = floorTo(py, y);
          if (x === 0 || y === 0) return 0;
          var key = x * 8192 + y, m = memo.get(key); if (m) return m[0];
          var cnt = 0, ch = null, i, c, v;
          for (i = 0; i < pieces.length; i++) if (pieces[i][0] <= x && pieces[i][1] <= y) { cnt = 1; ch = [0, i]; break; }
          for (i = 1; i < px.length && px[i] * 2 <= x; i++) { c = px[i]; v = best(c, y) + best(x - c, y); if (v > cnt) { cnt = v; ch = [1, c]; } }
          for (i = 1; i < py.length && py[i] * 2 <= y; i++) { c = py[i]; v = best(x, c) + best(x, y - c); if (v > cnt) { cnt = v; ch = [2, c]; } }
          memo.set(key, [cnt, ch]); return cnt;
        };
        n = best(X, Y);
        var place = function (x, y, ox, oy) {
          x = floorTo(px, x); y = floorTo(py, y); if (!x || !y) return;
          var m = memo.get(x * 8192 + y); if (!m || !m[0]) return;
          var ch = m[1];
          if (ch[0] === 0) { var p = pieces[ch[1]]; rects.push([ox, oy, p[0], p[1], p[2]]); }
          else if (ch[0] === 1) { place(ch[1], y, ox, oy); place(x - ch[1], y, ox + ch[1], oy); }
          else { place(x, ch[1], ox, oy); place(x, y - ch[1], ox, oy + ch[1]); }
        };
        place(X, Y, 0, 0);
      } else { // very small panels: fall back to simple grids (plus a mixed layout)
        var bestR = [];
        [[a, b, 0], [b, a, 1]].forEach(function (o, idx) {
          if (idx === 1 && !rotate) return;
          var nx = Math.floor(X / o[0]), ny = Math.floor(Y / o[1]), r = [], i, j;
          for (i = 0; i < nx; i++) for (j = 0; j < ny; j++) r.push([i * o[0], j * o[1], o[0], o[1], o[2]]);
          if (r.length > bestR.length) bestR = r;
        });
        rects = bestR; n = rects.length;
      }
      return { n: n, rects: rects, kerf: kerf };
    }

    function svg(L, Wd, r) {
      var pad = Math.max(L, Wd) * 0.02, fs = Math.max(L, Wd) / 46, many = r.rects.length > 400;
      var s = '<svg class="fit__svg" viewBox="' + (-pad) + ' ' + (-pad) + ' ' + (L + pad * 2) + ' ' + (Wd + pad * 2) + '" role="img" aria-label="' + esc(F.svgLabel) + '" preserveAspectRatio="xMidYMid meet">';
      s += '<rect class="fit__sheet" x="0" y="0" width="' + L + '" height="' + Wd + '"/>';
      r.rects.forEach(function (q, i) {
        var w = q[2] - r.kerf, h = q[3] - r.kerf;
        s += '<rect class="fit__p' + (q[4] ? ' fit__p--rot' : '') + '" style="animation-delay:' + Math.min(i * 10, 900) + 'ms" x="' + q[0] + '" y="' + q[1] + '" width="' + w + '" height="' + h + '"' + (many ? '' : ' rx="' + Math.min(w, h) * 0.04 + '"') + '/>';
        if (!many && w > fs * 5.5 && h > fs * 1.8) s += '<text class="fit__t" x="' + (q[0] + w / 2) + '" y="' + (q[1] + h / 2) + '" font-size="' + fs + '" text-anchor="middle" dominant-baseline="central">' + f(w, 1) + '×' + f(h, 1) + '</text>';
      });
      return s + '</svg>';
    }

    function fail(msg) { out.innerHTML = err(msg); acts.hidden = true; cur = null; }
    function run() {
      var custom = $('fSize').value === 'custom'; $('fCustom').hidden = !custom;
      var L, Wd; if (custom) { L = num('fSL'); Wd = num('fSW'); } else { var s = parseSize($('fSize').value); L = s[1]; Wd = s[0]; }
      var pl = num('fPL'), pw = num('fPW'), kerf = num('fKerf'), qty = Math.floor(num('fQty')), rot = $('fRot').checked;
      if (!(L >= 100 && L <= 3000 && Wd >= 100 && Wd <= 3000)) { fail(F.errSheet); return; }
      if (!(pl >= 20 && pw >= 20)) { fail(F.errPanel); return; }
      if (!(kerf >= 0 && kerf <= 20)) { fail(F.errKerf); return; }
      if (!(qty >= 1)) qty = 1;
      var fits = (pl <= L && pw <= Wd) || (rot && pw <= L && pl <= Wd);
      if (!fits) { fail(F.errTooBig); return; }
      var r = solve(L, Wd, pl, pw, kerf, rot);
      if (!r.n) { fail(F.zero); return; }
      var sheets = Math.ceil(qty / r.n), usedPct = Math.min(100, r.n * pl * pw / (L * Wd) * 100), spare = sheets * r.n - qty;
      out.innerHTML = '<div class="fit__view">' + svg(L, Wd, r) + '<p class="fit__legend">' + esc(F.legend) + ' <span class="mono">' + L + ' × ' + Wd + ' mm</span></p></div>' +
        '<div class="res-grid">' + res(F.outPerSheet, r.n, 'res--big') + res(F.outSheets, sheets, 'res--big') + res(F.outUse, f(usedPct, 1) + '%') + res(F.outWaste, f(100 - usedPct, 1) + '%') + (spare > 0 ? res(F.outLeft, spare) : '') + '</div>' +
        '<p class="pnote">' + esc(F.note) + '</p>';
      var details = [['Sheet size', L + ' × ' + Wd + ' mm'], ['Cut size 1 (L × W mm)', f(pl, 1) + ' × ' + f(pw, 1) + ' mm — ' + qty + ' pcs'], ['Notes', 'Fit checker: ' + r.n + ' per sheet, about ' + sheets + ' sheets, saw cut ' + f(kerf, 1) + ' mm' + (rot ? ', panels may be turned' : '')]];
      cur = details; acts.hidden = false;
      $('fWa').href = waHref(M.waFit + '\n*' + E.namesEn['cut-to-size'] + '*\n' + lines(details));
    }
    $('fAdd').addEventListener('click', function () { if (cur) addToBasket({ slug: 'cut-to-size', details: cur }, this); });
    var timer = null;
    ids.forEach(function (id) { $(id).addEventListener('input', function () { firstUse('fit'); clearTimeout(timer); timer = setTimeout(run, 120); }); $(id).addEventListener('change', run); });
    run();
    window.EIITools = window.EIITools || {}; window.EIITools.solveFit = solve; // exposed for testing
  }

  /* ============================ 3. Which thickness ============================ */
  function initThickness() {
    var K = T.thickness, EN = T.en, form = $('thkForm'), out = $('thkOut'); if (!form) return;
    var STD = [1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 20];
    var RANGE = { panel: [3, 6], spacer: [2, 5], meter: [3, 5], guard: [4, 8], tank: [5, 12], sign: [2, 5] };
    var BUMP = { s: 0, m: 0, l: 1, xl: 2 };
    var steps = form.querySelectorAll('fieldset[data-step]'), back = $('thkBack'), next = $('thkNext'), lab = $('thkStep'), errEl = $('thkErr');
    var cur = 0;
    form.classList.add('is-js');
    function show(i) {
      cur = i;
      steps.forEach(function (s, k) { s.hidden = k !== i; });
      back.hidden = i === 0;
      next.textContent = i === steps.length - 1 ? K.calc : K.next;
      lab.textContent = K.stepOf.replace('{n}', i + 1).replace('{total}', steps.length);
      errEl.hidden = true;
    }
    function value(name) { var c = form.querySelector('input[name="' + name + '"]:checked'); return c ? c.value : ''; }
    function idxAtLeast(v) { for (var i = 0; i < STD.length; i++) if (STD[i] >= v) return i; return STD.length - 1; }
    function idxAtMost(v) { for (var i = STD.length - 1; i >= 0; i--) if (STD[i] <= v) return i; return 0; }

    function result() {
      var app = value('app'), size = value('size'), sup = value('support'), live = value('live');
      var base = RANGE[app], bump = BUMP[size] + (sup === 'edge' ? 1 : 0);
      var ia = Math.min(STD.length - 1, idxAtLeast(base[0]) + bump), ib = Math.min(STD.length - 1, idxAtMost(base[1]) + bump);
      if (ib < ia) ib = ia;
      var a = STD[ia], b = STD[ib], mid = STD[Math.round((ia + ib) / 2)];
      var why = ['<li>' + esc(K.reasonApp.replace('{a}', base[0]).replace('{b}', base[1])) + '</li>'];
      if (BUMP[size] > 0) why.push('<li>' + esc(K.reasonSize) + '</li>');
      if (sup === 'edge') why.push('<li>' + esc(K.reasonSupport) + '</li>');
      if (live === 'yes') why.push('<li class="why--warn">' + esc(K.reasonLive) + '</li>');
      var chips = STD.map(function (v, i) { return '<span class="chip' + (i >= ia && i <= ib ? ' is-on' : '') + (v === mid ? ' is-mid' : '') + '">' + v + '</span>'; }).join('');
      out.innerHTML = '<div class="thk"><p class="thk__label mono">' + esc(K.resultTitle) + '</p><p class="thk__range">' + esc(K.resultRange.replace('{a}', a).replace('{b}', b)) + '</p>' +
        '<p class="thk__start">' + esc(K.start.replace('{n}', mid)) + '</p><div class="thk__chips" aria-hidden="true">' + chips + '<span class="thk__unit">mm</span></div>' +
        '<h3>' + esc(K.why) + '</h3><ul class="ticks">' + why.join('') + '</ul><p class="pnote">' + esc(K.disclaimer) + '</p>' +
        '<div class="tool__actions"><button type="button" class="btn btn--primary btn--sm" id="thkAdd"><svg class="icon" aria-hidden="true"><use href="#i-plus"/></svg> ' + esc(K.add.replace('{n}', mid)) + '</button>' +
        '<a class="btn btn--wa btn--sm" id="thkWa" target="_blank" rel="noopener" data-track="whatsapp_click" data-track-where="tool_thickness" href="#"><svg class="icon" aria-hidden="true"><use href="#i-wa"/></svg> ' + esc(K.wa) + '</a>' +
        '<button type="button" class="btn btn--outline btn--sm" id="thkReset">' + esc(K.reset) + '</button></div></div>';
      var answers = [['Use', EN.apps[app]], ['Largest piece', EN.sizes[size]], ['Support', EN.support[sup]], ['Near live parts', EN.live[live]], ['Suggested thickness', a + ' to ' + b + ' mm']];
      $('thkWa').href = waHref(M.waThick + '\n' + lines(answers));
      $('thkAdd').onclick = function () { addToBasket({ slug: 'pvc-sheets', details: [['Thickness', mid + ' mm'], ['Use / application', EN.apps[app]]] }, this); };
      $('thkReset').onclick = function () { form.reset(); out.innerHTML = ''; show(0); form.scrollIntoView({ behavior: 'smooth', block: 'center' }); };
      firstUse('thickness');
      out.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var names = ['app', 'size', 'support', 'live'];
      if (!value(names[cur])) { errEl.textContent = K.required; errEl.hidden = false; return; }
      if (cur < steps.length - 1) show(cur + 1); else result();
    });
    form.addEventListener('change', function (e) {
      if (e.target.type === 'radio' && cur < steps.length - 1) { errEl.hidden = true; setTimeout(function () { if (value(['app', 'size', 'support', 'live'][cur])) show(cur + 1); }, 260); }
    });
    back.addEventListener('click', function () { if (cur > 0) show(cur - 1); });
    show(0);
  }
  window.EIIView.on(function () { initWeight(); initFit(); initThickness(); });
})();
