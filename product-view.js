/* Electrical Insulation India — product detail pages (hash router, same page)
   URL pattern:  index.html#/product/<slug>
   Data lives in products.js. */
(function () {
  'use strict';

  var SITE = window.SITE, PRODUCTS = window.PRODUCTS;
  var home = document.getElementById('main');
  var view = document.getElementById('productView');
  var metaDesc = document.querySelector('meta[name="description"]');
  var HOME_TITLE = document.title;
  var HOME_DESC = metaDesc ? metaDesc.getAttribute('content') : '';
  if (!home || !view || !PRODUCTS) return;

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function waLink(text) { return 'https://wa.me/' + SITE.whatsapp + '?text=' + encodeURIComponent(text); }
  var ICON = function (id) { return '<svg class="icon" aria-hidden="true"><use href="#' + id + '"/></svg>'; };

  // ---------- render ----------
  function list(items, cls) {
    return '<ul class="' + cls + '">' + items.map(function (i) { return '<li>' + esc(i) + '</li>'; }).join('') + '</ul>';
  }

  function table(head, rows) {
    return '<div class="ptable"><table><thead><tr>' + head.map(function (h) { return '<th scope="col">' + esc(h) + '</th>'; }).join('') +
      '</tr></thead><tbody>' + rows.map(function (r) {
        return '<tr>' + r.map(function (c, i) { return (i === 0 ? '<th scope="row">' : '<td>') + esc(c) + (i === 0 ? '</th>' : '</td>'); }).join('') + '</tr>';
      }).join('') + '</tbody></table></div>';
  }

  function fieldHtml(f, i) {
    var id = 'qf' + i;
    var control = f.type === 'select'
      ? '<select id="' + id + '" data-field="' + esc(f.id) + '"><option value="">Select…</option>' +
        f.options.map(function (o) { return '<option>' + esc(o) + '</option>'; }).join('') + '</select>'
      : '<input id="' + id + '" type="text" data-field="' + esc(f.id) + '" placeholder="' + esc(f.placeholder || '') + '">';
    return '<label for="' + id + '">' + esc(f.id) + control + '</label>';
  }

  function relatedCard(slug) {
    var p = PRODUCTS[slug];
    if (!p) return '';
    return '<a class="rel" href="#/product/' + slug + '"><img src="assets/products/' + p.image + '.svg" alt="" width="600" height="450" loading="lazy">' +
      '<span><strong>' + esc(p.name) + '</strong><em>View details →</em></span></a>';
  }

  function render(slug) {
    var p = PRODUCTS[slug];
    var quickMsg = 'Hi, I would like the price for ' + p.name + '. Please share details.';
    view.innerHTML =
      '<div class="container">' +
        '<nav class="crumbs" aria-label="Breadcrumb"><a href="#top">Home</a><span>/</span><a href="#features">Products</a><span>/</span><span aria-current="page">' + esc(p.name) + '</span></nav>' +
        '<section class="phero">' +
          '<div class="phero__media"><img src="assets/products/' + p.image + '.svg" alt="' + esc(p.name) + '" width="600" height="450" fetchpriority="high"></div>' +
          '<div class="phero__copy">' +
            '<p class="eyebrow eyebrow--dark">Product details</p>' +
            '<h1 id="pvTitle" tabindex="-1">' + esc(p.name) + '</h1>' +
            '<p class="phero__tag">' + esc(p.tagline) + '</p>' +
            '<ul class="pchips">' + p.highlights.map(function (h) { return '<li>' + ICON('i-check') + esc(h) + '</li>'; }).join('') + '</ul>' +
            '<div class="pricebox"><strong>Price on request</strong><span>Rates change with size, quantity and city. Get the best bulk quotation on WhatsApp — usually the same business day.</span></div>' +
            '<div class="phero__actions">' +
              '<a class="btn btn--wa btn--lg" href="#quote" data-jump="quote">' + ICON('i-wa') + ' Build your quote</a>' +
              '<a class="btn btn--ghost btn--lg" href="' + waLink(quickMsg) + '" target="_blank" rel="noopener">Quick enquiry</a>' +
            '</div>' +
          '</div>' +
        '</section>' +

        '<div class="pgrid">' +
          '<div class="pmain">' +
            '<section class="pblock"><h2>Overview</h2>' + p.overview.map(function (t) { return '<p>' + esc(t) + '</p>'; }).join('') + '</section>' +
            '<section class="pblock"><h2>Specifications</h2><dl class="pspecs">' +
              p.specs.map(function (s) { return '<div><dt>' + esc(s[0]) + '</dt><dd>' + esc(s[1]) + '</dd></div>'; }).join('') + '</dl></section>' +
            '<section class="pblock"><h2>' + esc(p.sizesTitle) + '</h2>' + table(p.sizesHead, p.sizes) +
              (p.sizesNote ? '<p class="pnote">' + esc(p.sizesNote) + '</p>' : '') + '</section>' +
            '<section class="pblock pblock--cols"><div><h2>Applications</h2>' + list(p.applications, 'ticks') + '</div>' +
              '<div><h2>Key features</h2>' + list(p.features, 'ticks') + '</div></section>' +
            '<section class="pblock"><h2>Packing &amp; dispatch</h2>' + list(p.packing, 'ticks') + '</section>' +
            '<section class="pblock"><h2>Common questions</h2><div class="faq">' +
              p.faqs.map(function (f) { return '<details><summary>' + esc(f[0]) + '</summary><p>' + esc(f[1]) + '</p></details>'; }).join('') + '</div></section>' +
          '</div>' +

          '<aside class="pside" id="quote" aria-labelledby="quoteTitle">' +
            '<form class="qb" id="quoteBuilder" novalidate>' +
              '<h2 id="quoteTitle">' + ICON('i-wa') + ' Get your quote on WhatsApp</h2>' +
              '<p class="qb__hint">Choose your requirement — the message below is written for you. Edit it any way you like, then send.</p>' +
              p.fields.map(fieldHtml).join('') +
              '<label>Delivery city / pincode<input type="text" data-field="Delivery city" placeholder="e.g. Jaipur 302001"></label>' +
              '<label>Your name<input type="text" data-field="__name" placeholder="Your name" autocomplete="name"></label>' +
              '<fieldset class="qb__extras"><legend>Also include</legend>' +
                '<label class="chk"><input type="checkbox" value="GST invoice"> GST invoice</label>' +
                '<label class="chk"><input type="checkbox" value="Sample"> Sample</label>' +
                '<label class="chk"><input type="checkbox" value="Freight / delivery charges"> Freight quote</label>' +
              '</fieldset>' +
              '<label>Extra notes<input type="text" data-field="Notes" placeholder="Anything else we should know"></label>' +
              '<label for="qbMsg">WhatsApp message (editable)</label>' +
              '<textarea id="qbMsg" rows="9"></textarea>' +
              '<div class="qb__actions">' +
                '<a class="btn btn--wa btn--lg" id="qbSend" href="#" target="_blank" rel="noopener">' + ICON('i-wa') + ' Send on WhatsApp</a>' +
                '<button type="button" class="btn btn--ghost btn--sm" id="qbCopy">Copy</button>' +
                '<button type="button" class="btn btn--ghost btn--sm" id="qbReset">Reset</button>' +
              '</div>' +
              '<p class="qb__status" id="qbStatus" role="status"></p>' +
              '<p class="qb__contact">Prefer a call? <a href="tel:+' + SITE.whatsapp + '">' + esc(SITE.phoneDisplay) + '</a> · <a href="mailto:' + SITE.email + '">' + esc(SITE.email) + '</a></p>' +
            '</form>' +
          '</aside>' +
        '</div>' +

        '<section class="pblock prelated"><h2>You may also need</h2><div class="relgrid">' + (p.related || []).map(relatedCard).join('') + '</div>' +
          '<p><a class="btn btn--ghost" href="#showcase">← Back to all products</a></p></section>' +
      '</div>';

    initBuilder(p);
  }

  // ---------- WhatsApp template builder ----------
  function initBuilder(p) {
    var form = document.getElementById('quoteBuilder');
    var msg = document.getElementById('qbMsg');
    var send = document.getElementById('qbSend');
    var status = document.getElementById('qbStatus');
    var dirty = false;
    var saved = {};
    try { saved = JSON.parse(localStorage.getItem('eii_buyer') || '{}'); } catch (e) {}

    var name = form.querySelector('[data-field="__name"]');
    var city = form.querySelector('[data-field="Delivery city"]');
    if (saved.name) name.value = saved.name;
    if (saved.city) city.value = saved.city;

    function build() {
      var lines = ['Hi Electrical Insulation India,', 'I would like a price quotation for:', '', '*' + p.name + '*'];
      form.querySelectorAll('[data-field]').forEach(function (el) {
        var key = el.dataset.field, val = el.value.trim();
        if (key === '__name' || !val) return;
        lines.push('• ' + key + ': ' + val);
      });
      var extras = Array.prototype.map.call(form.querySelectorAll('.qb__extras input:checked'), function (c) { return c.value; });
      if (extras.length) lines.push('• Also need: ' + extras.join(', '));
      lines.push('');
      if (name.value.trim()) lines.push('Name: ' + name.value.trim());
      lines.push('Please share your best rate and delivery time. Thank you.');
      return lines.join('\n');
    }

    function sync() { send.href = waLink(msg.value); }
    function regenerate() { msg.value = build(); dirty = false; sync(); }

    form.addEventListener('input', function (e) {
      if (e.target === msg) { dirty = true; sync(); return; }
      if (!dirty) regenerate();
      else status.textContent = 'You edited the message — press Reset to refresh it from the form.';
      try { localStorage.setItem('eii_buyer', JSON.stringify({ name: name.value.trim(), city: city.value.trim() })); } catch (err) {}
    });
    form.addEventListener('change', function (e) { if (e.target !== msg && !dirty) regenerate(); });
    form.addEventListener('submit', function (e) { e.preventDefault(); });

    document.getElementById('qbReset').addEventListener('click', function () { regenerate(); status.textContent = 'Message reset from the form.'; });
    document.getElementById('qbCopy').addEventListener('click', function () {
      function ok() { status.textContent = 'Message copied.'; }
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(msg.value).then(ok, function () { msg.select(); });
      else { msg.select(); try { document.execCommand('copy'); ok(); } catch (err) {} }
    });
    send.addEventListener('click', function () { sync(); });

    regenerate();
  }

  // ---------- router ----------
  var ROUTE = /^#\/product\/([a-z0-9-]+)\/?$/;

  function showHome(hash) {
    view.hidden = true; home.hidden = false;
    document.title = HOME_TITLE;
    if (metaDesc) metaDesc.setAttribute('content', HOME_DESC);
    var id = hash && hash.length > 1 ? decodeURIComponent(hash.slice(1)) : '';
    var target = id && document.getElementById(id);
    if (target) target.scrollIntoView(); else window.scrollTo(0, 0);
  }

  function route() {
    var m = ROUTE.exec(location.hash);
    if (m && PRODUCTS[m[1]]) {
      var p = PRODUCTS[m[1]];
      render(m[1]);
      home.hidden = true; view.hidden = false;
      document.title = p.name + ' – sizes, specs & price on WhatsApp | Electrical Insulation India';
      if (metaDesc) metaDesc.setAttribute('content', p.tagline + ' Sizes, specifications and WhatsApp quotation. Wholesale supplier, Daryaganj, New Delhi.');
      window.scrollTo(0, 0);
      var h = document.getElementById('pvTitle'); if (h) h.focus({ preventScroll: true });
    } else if (m) {
      location.replace('#showcase');
    } else {
      showHome(location.hash);
    }
  }

  // "Build your quote" jump (hash #quote would be treated as home)
  view.addEventListener('click', function (e) {
    var a = e.target.closest('[data-jump]');
    if (!a) return;
    e.preventDefault();
    var t = document.getElementById(a.dataset.jump);
    if (t) { t.scrollIntoView({ behavior: 'smooth', block: 'start' }); var f = t.querySelector('select, input'); if (f) setTimeout(function () { f.focus({ preventScroll: true }); }, 400); }
  });

  window.addEventListener('hashchange', route);
  route();
})();
