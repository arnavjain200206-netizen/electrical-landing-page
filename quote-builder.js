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
  }
  window.EIIView.on(mount);
})();
