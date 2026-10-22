/* Enquiry list: collect products from anywhere on the site, send one WhatsApp message. */
(function () {
  'use strict';
  var E = window.EII, S = E.strings.basket;
  var KEY = 'eii_basket_v1', BUYER = 'eii_buyer';
  var btn = document.getElementById('enqBtn'), badge = document.getElementById('enqCount');
  var root = document.getElementById('enq'), body = document.getElementById('enqBody'), foot = document.getElementById('enqFoot');
  var toast = document.getElementById('toast');
  if (!btn || !root) return;
  var panel = root.querySelector('.enq__panel');
  var items = load(), lastFocus = null, toastTimer = null;

  function load() {
    try { var s = JSON.parse(localStorage.getItem(KEY) || '[]'); if (Array.isArray(s)) return s; } catch (e) {}
    return [];
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(items)); } catch (e) {} }
  function buyer() { try { return JSON.parse(localStorage.getItem(BUYER) || '{}'); } catch (e) { return {}; } }
  function saveBuyer(b) { try { localStorage.setItem(BUYER, JSON.stringify(b)); } catch (e) {} }
  function uid() { return 'i' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function fmt(s, n) { return s.replace('{n}', n); }
  function nameOf(slug) { return (slug && E.names[slug]) || S.itemFallback; }
  function nameEn(slug) { return (slug && E.namesEn[slug]) || 'Custom item'; }
  function homeUrl() { return E.single ? '#/' : E.base + (E.lang === 'hi' ? 'hi/' : '') + 'index.html'; }

  function clean(details) {
    return (details || []).filter(function (d) { return d && d[0] && String(d[1]).trim() !== ''; }).map(function (d) { return [String(d[0]), String(d[1]).trim()]; });
  }
  function sig(it) { return (it.slug || '') + '|' + JSON.stringify(it.details); }

  function add(it, quiet) {
    var item = { id: uid(), slug: it.slug || '', details: clean(it.details), note: it.note || '' };
    var dup = items.filter(function (x) { return sig(x) === sig(item); })[0];
    if (!dup) items.push(item);
    save(); render();
    if (!quiet) { showToast(S.added); if (window.track) window.track('add_to_enquiry', { item: item.slug, where: E.page }); }
    return !dup;
  }
  function addMany(list, label) {
    var n = 0;
    list.forEach(function (it) { if (add(it, true)) n++; });
    showToast(fmt(S.addedMany, n || list.length));
    if (window.track) window.track('add_starter_list', { item: label || '', where: E.page });
  }

  function showToast(msg) {
    if (!toast) return;
    toast.innerHTML = '<span>' + esc(msg) + '</span><button type="button" class="toast__btn">' + esc(S.view) + '</button>';
    toast.hidden = false; toast.classList.add('is-in');
    toast.querySelector('button').addEventListener('click', openPanel);
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('is-in'); setTimeout(function () { toast.hidden = true; }, 300); }, 4200);
  }

  function message() {
    var b = buyer();
    var lines = ['Hi Electrical Insulation India,', 'I would like a price quotation for:', ''];
    items.forEach(function (it, i) {
      lines.push((i + 1) + '. *' + nameEn(it.slug) + '*');
      it.details.forEach(function (d) { lines.push('   • ' + d[0] + ': ' + d[1]); });
      if (it.note) lines.push('   • Note: ' + it.note);
    });
    lines.push('');
    if (b.name) lines.push('Name: ' + b.name);
    if (b.city) lines.push('Delivery city: ' + b.city);
    lines.push('Please share your best rate and delivery time. Thank you.');
    lines.push('(Sent from the website: /' + (E.path || '') + ')');
    return lines.join('\n');
  }

  function render() {
    var n = items.length;
    badge.textContent = n; badge.hidden = n === 0;
    btn.setAttribute('aria-label', (btn.getAttribute('data-base-label') || (btn.setAttribute('data-base-label', btn.getAttribute('aria-label')), btn.getAttribute('aria-label'))) + (n ? ' (' + n + ')' : ''));
    btn.classList.toggle('has-items', n > 0);

    if (!n) {
      body.innerHTML = '<div class="enq__empty"><svg class="icon" aria-hidden="true"><use href="#i-list"/></svg><p><strong>' + esc(S.empty) + '</strong></p><p>' + esc(S.emptyHint) + '</p><a class="btn btn--outline btn--sm" href="' + homeUrl() + '#products" data-enq-close>' + esc(S.browse) + '</a></div>';
      foot.innerHTML = '';
      return;
    }
    var b = buyer();
    body.innerHTML = '<ol class="enq__list">' + items.map(function (it) {
      var det = it.details.length ? '<ul class="enq__det">' + it.details.map(function (d) { return '<li><span>' + esc(d[0]) + '</span> ' + esc(d[1]) + '</li>'; }).join('') + '</ul>' : '';
      return '<li data-id="' + it.id + '"><div class="enq__top"><strong>' + esc(nameOf(it.slug)) + '</strong><button type="button" class="enq__rm" data-rm="' + it.id + '" aria-label="' + esc(S.remove + ': ' + nameOf(it.slug)) + '"><svg class="icon" aria-hidden="true"><use href="#i-trash"/></svg></button></div>' + det +
        '<input class="enq__note" type="text" data-note="' + it.id + '" value="' + esc(it.note) + '" placeholder="' + esc(S.notePh) + '" aria-label="' + esc(S.noteLabel) + '"></li>';
    }).join('') + '</ol>';
    foot.innerHTML =
      '<div class="enq__who"><label>' + esc(S.yourName) + '<input type="text" id="enqName" autocomplete="name" value="' + esc(b.name || '') + '" placeholder="' + esc(S.yourNamePh) + '"></label>' +
      '<label>' + esc(S.city) + '<input type="text" id="enqCity" value="' + esc(b.city || '') + '" placeholder="' + esc(S.cityPh) + '"></label></div>' +
      '<a class="btn btn--wa btn--lg" id="enqSend" href="#" target="_blank" rel="noopener" data-track="whatsapp_click" data-track-where="enquiry_list"><svg class="icon" aria-hidden="true"><use href="#i-wa"/></svg> ' + esc(S.send) + '</a>' +
      '<div class="enq__row"><a class="btn btn--outline btn--sm" id="enqMail" href="#" data-track="email_click" data-track-where="enquiry_list">' + esc(S.mail) + '</a><button type="button" class="btn btn--outline btn--sm" id="enqCopy">' + esc(S.copy) + '</button><button type="button" class="btn btn--outline btn--sm" id="enqClear">' + esc(S.clear) + '</button></div>' +
      '<p class="enq__status" id="enqStatus" role="status"></p>';
    syncLinks();
  }

  function syncLinks() {
    var send = document.getElementById('enqSend'), mail = document.getElementById('enqMail');
    if (!send) return;
    var msg = message();
    send.href = 'https://wa.me/' + E.wa + '?text=' + encodeURIComponent(msg);
    mail.href = 'mailto:' + E.email + '?subject=' + encodeURIComponent('Quote request') + '&body=' + encodeURIComponent(msg);
  }

  // ---- panel open / close, focus handling ----
  function focusables() { return panel.querySelectorAll('a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'); }
  function openPanel() {
    lastFocus = document.activeElement;
    if (toast) { toast.classList.remove('is-in'); toast.hidden = true; }
    root.hidden = false; document.documentElement.classList.add('enq-open');
    requestAnimationFrame(function () { root.classList.add('is-open'); panel.focus(); });
    if (window.track) window.track('enquiry_open', { where: E.page, item: String(items.length) });
  }
  function closePanel() {
    root.classList.remove('is-open'); document.documentElement.classList.remove('enq-open');
    setTimeout(function () { root.hidden = true; }, 250);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  btn.addEventListener('click', openPanel);
  root.addEventListener('click', function (e) {
    if (e.target.closest('[data-enq-close]')) closePanel();
    var rm = e.target.closest('[data-rm]');
    if (rm) { items = items.filter(function (x) { return x.id !== rm.getAttribute('data-rm'); }); save(); render(); }
    if (e.target.closest('#enqClear') && window.confirm(S.clearConfirm)) { items = []; save(); render(); }
    if (e.target.closest('#enqCopy')) {
      var msg = message(), st = document.getElementById('enqStatus'), ok = function () { if (st) st.textContent = S.copied; };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(msg).then(ok, function () {}); else ok();
    }
  });
  root.addEventListener('input', function (e) {
    var note = e.target.getAttribute && e.target.getAttribute('data-note');
    if (note) { items.forEach(function (x) { if (x.id === note) x.note = e.target.value; }); save(); syncLinks(); return; }
    if (e.target.id === 'enqName' || e.target.id === 'enqCity') {
      saveBuyer({ name: document.getElementById('enqName').value.trim(), city: document.getElementById('enqCity').value.trim() });
      syncLinks();
    }
  });
  document.addEventListener('keydown', function (e) {
    if (root.hidden) return;
    if (e.key === 'Escape') { closePanel(); return; }
    if (e.key === 'Tab') {
      var f = focusables(); if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === panel)) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  // ---- add buttons anywhere on the page ----
  document.addEventListener('click', function (e) {
    var one = e.target.closest('[data-add]');
    if (one) {
      try { add(JSON.parse(one.getAttribute('data-add'))); } catch (err) {}
      one.classList.add('is-added'); setTimeout(function () { one.classList.remove('is-added'); }, 1400);
      return;
    }
    var many = e.target.closest('[data-add-many]');
    if (many) {
      try { var d = JSON.parse(many.getAttribute('data-add-many')); addMany(d.items, d.id); } catch (err) {}
      many.classList.add('is-added'); setTimeout(function () { many.classList.remove('is-added'); }, 1400);
    }
  });
  window.addEventListener('storage', function (e) { if (e.key === KEY) { items = load(); render(); } });

  window.EIIBasket = { add: add, addMany: addMany, open: openPanel, count: function () { return items.length; }, setBuyer: function (b) { var c = buyer(); saveBuyer({ name: b.name || c.name || '', city: b.city || c.city || '' }); } };
  render();
})();
