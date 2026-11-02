/* Product page: builds the WhatsApp message from the form, can add the result to the enquiry list. */
(function () {
  'use strict';
  var E = window.EII, S = E.strings.qb;
  // "Build your quote" button scrolls to and focuses the form (registered once)
  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-jump]'); if (!a) return;
    e.preventDefault();
    var t = document.getElementById(a.getAttribute('data-jump'));
    if (t) { t.scrollIntoView({ behavior: 'smooth', block: 'start' }); var f = t.querySelector('select, input'); if (f) setTimeout(function () { f.focus({ preventScroll: true }); }, 450); }
  });

  function mount() {
  var form = document.getElementById('quoteBuilder');
  if (!form) return;
  var slug = form.getAttribute('data-slug');
  var msg = document.getElementById('qbMsg'), send = document.getElementById('qbSend'), status = document.getElementById('qbStatus');
  var name = form.querySelector('[data-field="__name"]'), city = form.querySelector('[data-field="Delivery city"]');
  var dirty = false;
  var saved = {};
  try { saved = JSON.parse(localStorage.getItem('eii_buyer') || '{}'); } catch (e) {}
  if (saved.name) name.value = saved.name;
  if (saved.city) city.value = saved.city;

  function details() {
    var out = [];
    form.querySelectorAll('[data-field]').forEach(function (el) {
      var k = el.getAttribute('data-field'), v = el.value.trim();
      if (k === '__name' || k === 'Delivery city' || k === 'Notes' || !v) return;
      out.push([k, v]);
    });
    var extras = Array.prototype.map.call(form.querySelectorAll('.qb__extras input:checked'), function (c) { return c.value; });
    if (extras.length) out.push(['Also need', extras.join(', ')]);
    return out;
  }
  function field(k) { var el = form.querySelector('[data-field="' + k + '"]'); return el ? el.value.trim() : ''; }

  function build() {
    var lines = ['Hi Electrical Insulation India,', 'I would like a price quotation for:', '', '*' + E.namesEn[slug] + '*'];
    details().forEach(function (d) { lines.push('• ' + d[0] + ': ' + d[1]); });
    if (field('Delivery city')) lines.push('• Delivery city: ' + field('Delivery city'));
    if (field('Notes')) lines.push('• Notes: ' + field('Notes'));
    lines.push('');
    if (name.value.trim()) lines.push('Name: ' + name.value.trim());
    lines.push('Please share your best rate and delivery time. Thank you.');
    lines.push('(Sent from the website: /' + E.path + ')');
    return lines.join('\n');
  }
  function sync() { send.href = 'https://wa.me/' + E.wa + '?text=' + encodeURIComponent(msg.value); }
  function regenerate() { msg.value = build(); dirty = false; sync(); }
  function remember() { try { localStorage.setItem('eii_buyer', JSON.stringify({ name: name.value.trim(), city: city.value.trim() })); } catch (e) {} }

  form.addEventListener('input', function (e) {
    if (e.target === msg) { dirty = true; sync(); return; }
    if (!dirty) regenerate(); else status.textContent = S.edited;
    remember();
  });
  form.addEventListener('change', function (e) { if (e.target !== msg && !dirty) regenerate(); });
  form.addEventListener('submit', function (e) { e.preventDefault(); });

  document.getElementById('qbReset').addEventListener('click', function () { regenerate(); status.textContent = S.reset; });
  document.getElementById('qbCopy').addEventListener('click', function () {
    function ok() { status.textContent = S.copied; }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(msg.value).then(ok, function () { msg.select(); });
    else { msg.select(); try { document.execCommand('copy'); ok(); } catch (err) {} }
  });
  document.getElementById('qbAdd').addEventListener('click', function () {
    if (!window.EIIBasket) return;
    window.EIIBasket.setBuyer({ name: name.value.trim(), city: city.value.trim() });
    var d = details();
    window.EIIBasket.add({ slug: slug, details: d, note: field('Notes') });
    status.textContent = S.added;
  });
  send.addEventListener('click', sync);

  regenerate();

  // ---- phones: a bar at the bottom with the first question and the WhatsApp button, always in step with the form ----
  var bar = document.getElementById('qbar');
  if (bar) {
    var barField = document.getElementById('qbarField'), barSend = document.getElementById('qbarSend');
    var first = form.querySelector('[data-field]');
    var barLink = function () { barSend.href = send.href; };
    var fire = function (el) { el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true })); };
    barField.addEventListener('change', function () { first.value = barField.value; fire(first); });
    barField.addEventListener('input', function () { if (barField.tagName !== 'SELECT') { first.value = barField.value; fire(first); } });
    var follow = function () { barField.value = first.value; barLink(); };
    form.addEventListener('input', follow);
    form.addEventListener('change', follow);
    msg.addEventListener('input', barLink);
    document.getElementById('qbReset').addEventListener('click', barLink);
    barLink();
    var quote = document.getElementById('quote');
    if (quote && 'IntersectionObserver' in window) {
      new IntersectionObserver(function (en) { bar.classList.toggle('is-hidden', en[0].isIntersecting); }, { threshold: 0.12 }).observe(quote);
    }
  }

  // ---- PVC / cut-to-size: thickness slider and colour chips drive the 3D model, the weight and the form ----
  var cfg = document.getElementById('cfg');
  if (cfg) {
    var STD = JSON.parse(cfg.getAttribute('data-std')), withKg = cfg.getAttribute('data-weight') === '1';
    var rng = document.getElementById('cfgT'), tv = document.getElementById('cfgTv'), kgEl = document.getElementById('cfgKg');
    var media = document.querySelector('.phero__media');
    var fT = form.querySelector('[data-field="Thickness"]'), fC = form.querySelector('[data-field="Colour"]');
    var COLOURS = ['Grey', 'White', 'Black'];
    var st = { i: parseInt(cfg.getAttribute('data-start'), 10) || 0, colour: 'Grey' };
    var fire2 = function (el) { el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true })); };
    cfg.classList.add('is-ready');
    var show = function () {
      var n = STD[st.i];
      tv.textContent = n + ' mm'; rng.value = st.i; rng.setAttribute('aria-valuetext', n + ' mm');
      if (withKg && kgEl) kgEl.textContent = (1.22 * 2.44 * n * 1.35).toFixed(1) + ' kg';
      var opts = { thickness: n, color: st.colour };
      if (media) { media.__eiiOpts = opts; if (window.EII3D && window.EII3D.setOptions) window.EII3D.setOptions(media, opts); }
    };
    var toForm = function () {
      var vT = STD[st.i] + ' mm';
      if (fT && fT.value !== vT) { fT.value = vT; fire2(fT); }
      if (fC && fC.value !== st.colour) { fC.value = st.colour; fire2(fC); }
    };
    rng.addEventListener('input', function () { st.i = parseInt(rng.value, 10); show(); toForm(); });
    cfg.querySelectorAll('input[name="cfgColour"]').forEach(function (r) { r.addEventListener('change', function () { st.colour = r.value; show(); toForm(); }); });
    // the form can be used directly as well: the picture follows it
    if (fT) fT.addEventListener('change', function () { var m = /^(\d+) mm$/.exec(fT.value), i = m ? STD.indexOf(parseInt(m[1], 10)) : -1; if (i > -1 && i !== st.i) { st.i = i; show(); } });
    if (fC) fC.addEventListener('change', function () {
      if (COLOURS.indexOf(fC.value) > -1 && fC.value !== st.colour) { st.colour = fC.value; var r = cfg.querySelector('input[name="cfgColour"][value="' + fC.value + '"]'); if (r) r.checked = true; show(); }
    });
    show();
  }
  }
  window.EIIView.on(mount);
})();
