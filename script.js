/* Electrical Insulation India: site behaviour (vanilla JS, no libraries).
   Runs on every page; each part checks that its elements exist. */
(function () {
  'use strict';
  var E = window.EII || { lang: 'en', base: './', strings: { form: {} } };
  var RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root = document.documentElement;
  root.classList.add('js');

  // old shared links such as index.html#/product/foam now live on their own page
  var legacy = /^#\/product\/([a-z0-9-]+)\/?$/.exec(location.hash);
  if (legacy && E.page === 'home' && !E.single) { location.replace(E.base + (E.lang === 'hi' ? 'hi/' : '') + 'products/' + legacy[1] + '/index.html'); return; }
  if (location.hash === '#showcase' || location.hash === '#features') { location.replace('#products'); }

  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // remember an explicit language choice (used to send repeat visitors to the right home page)
  document.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('[data-lang]') : null;
    if (a) { try { localStorage.setItem('eii_lang', a.getAttribute('data-lang')); } catch (err) {} if (window.track) window.track('language_switch', { item: a.getAttribute('data-lang') }); }
  });

  // ---------- Theme toggle (light / dark) ----------
  var themeBtn = document.getElementById('themeToggle');
  var themeMeta = document.querySelector('meta[name="theme-color"]');
  function currentTheme() { return root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'; }
  function reflectTheme(t) {
    if (themeBtn) {
      themeBtn.setAttribute('aria-label', t === 'dark' ? themeBtn.getAttribute('data-label-light') : themeBtn.getAttribute('data-label-dark'));
      themeBtn.setAttribute('aria-pressed', String(t === 'dark'));
    }
    if (themeMeta) themeMeta.setAttribute('content', t === 'dark' ? '#12171c' : '#dde1df');
  }
  function setTheme(t, save) {
    if (!RM) { root.classList.add('theme-anim'); window.setTimeout(function () { root.classList.remove('theme-anim'); }, 450); }
    root.setAttribute('data-theme', t);
    reflectTheme(t);
    if (save) { try { localStorage.setItem('eii_theme', t); } catch (e) {} }
  }
  reflectTheme(currentTheme());
  if (themeBtn) themeBtn.addEventListener('click', function () { setTheme(currentTheme() === 'dark' ? 'light' : 'dark', true); });
  var mq = window.matchMedia('(prefers-color-scheme: dark)');
  if (mq.addEventListener) mq.addEventListener('change', function (e) {
    var saved = null;
    try { saved = localStorage.getItem('eii_theme'); } catch (err) {}
    if (saved !== 'light' && saved !== 'dark') setTheme(e.matches ? 'dark' : 'light', false);
  });

  // ---------- Mobile menu ----------
  var toggle = document.getElementById('navToggle');
  var menu = document.getElementById('menu');
  function setMenu(open) {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', toggle.getAttribute(open ? 'data-label-close' : 'data-label-open'));
    menu.classList.toggle('is-open', open);
  }
  if (toggle && menu) {
    toggle.addEventListener('click', function () { setMenu(toggle.getAttribute('aria-expanded') !== 'true'); });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { setMenu(false); toggle.focus(); }
    });
    document.addEventListener('click', function (e) { if (!e.target.closest('.nav__inner')) setMenu(false); });
    window.matchMedia('(min-width: 1100px)').addEventListener('change', function () { setMenu(false); });
  }

  // ---------- Scroll progress (the earth-wire stripe along the top) ----------
  var progress = document.getElementById('progress');
  var queued = false;
  function onScrollFx() {
    queued = false;
    root.classList.toggle('scrolled', window.scrollY > 420);   // the floating WhatsApp button waits until the hero has been passed
    if (progress) {
      var max = root.scrollHeight - window.innerHeight;
      progress.style.setProperty('--p', max > 0 ? Math.min(1, window.scrollY / max).toFixed(4) : '0');
    }
  }
  function queueScrollFx() { if (!queued) { queued = true; window.requestAnimationFrame(onScrollFx); } }
  window.addEventListener('scroll', queueScrollFx, { passive: true });
  window.addEventListener('resize', queueScrollFx);
  onScrollFx();

  // ---------- Highlight the current section in the nav (home page) ----------
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav__menu ul a[href*="#"]'));
  function spy() {
    var y = window.scrollY + 120, current = '';
    document.querySelectorAll('main section[id]').forEach(function (sec) { if (sec.offsetTop <= y && sec.closest('#hero, .pv') === null) current = sec.id; });
    links.forEach(function (a) { var h = a.getAttribute('href'); if (current && h.slice(h.lastIndexOf('#')) === '#' + current && (h.indexOf('#') === 0 || h.indexOf('#/#') === 0)) a.setAttribute('aria-current', 'true'); else if (a.getAttribute('aria-current') === 'true') a.removeAttribute('aria-current'); });
  }
  if (links.length) { window.addEventListener('scroll', spy, { passive: true }); spy(); window.addEventListener('hashchange', function () { window.setTimeout(spy, 50); }); }

  // =====================================================================
  // Everything below belongs to the current view and runs again whenever a view is shown
  // =====================================================================
  function mount() {

    // ---------- Hero: the sheet and its thickness gauge ----------
    (function gauge() {
      var g = document.getElementById('gauge'), stage = document.getElementById('stage'), art = document.getElementById('stageArt');
      var Sheet = window.EIISheet;
      if (!g || !stage || !art || !Sheet) return;
      var STD = Sheet.STD, range = document.getElementById('gRange'), ticks = g.querySelectorAll('.gauge__tick');
      var figure = stage.getAttribute('data-figure') || '', waTpl = g.getAttribute('data-wa-tpl'), waLabel = g.getAttribute('data-wa-label'), addLabel = g.getAttribute('data-add-label');
      var num = document.getElementById('gNum'), kg = document.getElementById('gKg'), sqm = document.getElementById('gSqm');
      var wa = document.getElementById('gWa'), waTxt = document.getElementById('gWaTxt'), add = document.getElementById('gAdd'), addTxt = document.getElementById('gAddTxt');
      var index = parseInt(g.getAttribute('data-start'), 10) || 0, shown = STD[index], raf = 0;

      function paint(t) { art.innerHTML = Sheet.svg(t, figure.replace('{n}', STD[index]), STD[index]); }
      function readouts() {
        var n = STD[index];
        num.textContent = n;
        kg.textContent = Sheet.kg(n).toFixed(1) + ' kg';
        sqm.textContent = (n * Sheet.DENSITY).toFixed(2) + ' kg';
        wa.href = 'https://wa.me/' + E.wa + '?text=' + encodeURIComponent(waTpl.replace('{n}', n));
        waTxt.textContent = waLabel.replace('{n}', n);
        addTxt.textContent = addLabel.replace('{n}', n);
        add.setAttribute('data-add', JSON.stringify({ slug: 'pvc-sheets', details: [['Thickness', n + ' mm'], ['Sheet size', '1220 × 2440 mm (4 × 8 ft)']] }));
        range.value = index;
        range.setAttribute('aria-valuetext', n + ' mm');
        range.style.setProperty('--fill', 'calc(12px + (100% - 24px) * ' + (index / (STD.length - 1)) + ')');
        ticks.forEach(function (b, i) { b.setAttribute('aria-pressed', String(i === index)); });
      }
      function go(i) {
        index = Math.max(0, Math.min(STD.length - 1, i));
        stage.setAttribute('data-live', '');               // the entrance is over: stop replaying it on redraw
        readouts();
        window.cancelAnimationFrame(raf);
        var target = STD[index];
        if (RM) { shown = target; paint(shown); return; }
        var from = shown, t0 = null;
        raf = window.requestAnimationFrame(function step(ts) {
          if (t0 === null) t0 = ts;
          var p = Math.min(1, (ts - t0) / 260), e = 1 - Math.pow(1 - p, 3);
          shown = from + (target - from) * e;
          paint(shown);
          if (p < 1) raf = window.requestAnimationFrame(step); else shown = target;
        });
      }
      readouts();
      range.addEventListener('input', function () { go(parseInt(range.value, 10)); });
      ticks.forEach(function (b) { b.addEventListener('click', function () { go(parseInt(b.getAttribute('data-i'), 10)); }); });
    })();

    // ---------- Products: the preview follows the row under the pointer or keyboard focus ----------
    (function preview() {
      var rows = document.querySelectorAll('.prow'), imgs = document.querySelectorAll('[data-pi]');
      var nameEl = document.getElementById('piName'), specEl = document.getElementById('piSpec');
      if (!rows.length || !imgs.length) return;
      function activate(row) {
        var slug = row.getAttribute('data-slug');
        rows.forEach(function (r) { r.classList.toggle('is-active', r === row); });
        imgs.forEach(function (im) { im.classList.toggle('is-on', im.getAttribute('data-pi') === slug); });
        if (nameEl) nameEl.textContent = row.getAttribute('data-name');
        if (specEl) specEl.textContent = row.getAttribute('data-spec');
      }
      rows.forEach(function (r) {
        r.addEventListener('pointerenter', function () { activate(r); });
        r.addEventListener('focusin', function () { activate(r); });
      });
      activate(rows[0]);
    })();

    // ---------- Contact form -> WhatsApp / email ----------
    var form = document.getElementById('quoteForm');
    var errorEl = document.getElementById('formError');
    var FS = (E.strings && E.strings.form) || {};
    function showError(msg, field) {
      errorEl.textContent = msg; errorEl.hidden = false;
      form.querySelectorAll('.is-invalid').forEach(function (el) { el.classList.remove('is-invalid'); });
      if (field) { field.classList.add('is-invalid'); field.focus(); }
    }
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var name = form.elements.name, phone = form.elements.phone, product = form.elements.product, details = form.elements.details;
        if (!name.value.trim()) return showError(FS.name, name);
        if (phone.value.replace(/\D/g, '').length < 10) return showError(FS.phone, phone);
        if (!product.value) return showError(FS.product, product);
        errorEl.hidden = true;
        form.querySelectorAll('.is-invalid').forEach(function (el) { el.classList.remove('is-invalid'); });
        var text = ['Hi, I would like a quote.', '', 'Name: ' + name.value.trim(), 'Phone: ' + phone.value.trim(), 'Product: ' + product.value, 'Details: ' + (details.value.trim() || '-'), '(Sent from the website: contact form)'].join('\n');
        var channel = e.submitter && e.submitter.dataset.channel;
        if (window.track) window.track('quote_form_submit', { item: channel === 'mail' ? 'email' : 'whatsapp', where: 'contact_form' });
        if (channel === 'mail') {
          window.location.href = 'mailto:' + E.email + '?subject=' + encodeURIComponent('Quote request - ' + product.value) + '&body=' + encodeURIComponent(text);
        } else {
          window.open('https://wa.me/' + E.wa + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
        }
      });
    }
  }
  window.EIIView.on(mount);
  window.EIIView.on(spy);
})();
