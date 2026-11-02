/* Electrical Insulation India: site behaviour (vanilla JS, no libraries).
   Runs on every page; each part checks that its elements exist. */
(function () {
  'use strict';
  var E = window.EII || { lang: 'en', base: './', strings: { form: {} } };
  var RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var FINE = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
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
    if (themeMeta) themeMeta.setAttribute('content', t === 'dark' ? '#0f161f' : '#f6f4ef');
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
    window.matchMedia('(min-width: 900px)').addEventListener('change', function () { setMenu(false); });
  }

  // ---------- Nav over the hero, scroll progress ----------
  var nav = document.getElementById('top');
  var progress = document.getElementById('progress');
  var queued = false;
  function onScrollFx() {
    queued = false;
    var y = window.scrollY;
    if (nav) nav.classList.toggle('is-top', !!document.getElementById('hero') && y < 24);
    if (progress) {
      var max = root.scrollHeight - window.innerHeight;
      progress.style.setProperty('--p', max > 0 ? Math.min(1, y / max).toFixed(4) : '0');
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

  // ---------- 3D product models ----------
  // The flat illustration is the fallback. After the page has loaded, and only if the browser has WebGL and
  // the visitor is not saving data, assets/models3d.js is fetched and swaps the illustrations for 3D models.
  var m3d = { state: 'idle', queue: [] };
  function hasWebGL() {
    try {
      var c = document.createElement('canvas'), gl = c.getContext('webgl2') || c.getContext('webgl');
      if (!gl) return false;
      // a software renderer (no graphics card) would make the page slow: keep the illustrations and skip the download
      var info = gl.getExtension('WEBGL_debug_renderer_info');
      var gpu = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : '';
      var lose = gl.getExtension('WEBGL_lose_context'); if (lose) lose.loseContext();
      if (!window.EII3D_FORCE && /swiftshader|llvmpipe|softpipe|software|basic render/i.test(gpu)) return false;
      return true;
    } catch (e) { return false; }
  }
  function load3d(cb) {
    if (window.EII3D) { cb(window.EII3D); return; }
    if (m3d.state === 'failed') return;
    m3d.queue.push(cb);
    if (m3d.state === 'loading') return;
    var conn = navigator.connection, gl = hasWebGL();
    // skip: no WebGL, data saver, and weak devices (little memory or few CPU cores)
    var weak = (navigator.deviceMemory && navigator.deviceMemory < 4) || (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4);
    if (!gl || (!window.EII3D_FORCE && ((conn && conn.saveData) || weak))) { m3d.state = 'failed'; return; }
    m3d.state = 'loading';
    function inject() {
      var s = document.createElement('script');
      s.src = E.base + 'assets/models3d.js';
      s.onload = function () { m3d.state = 'ready'; m3d.queue.splice(0).forEach(function (f) { f(window.EII3D); }); };
      s.onerror = function () { m3d.state = 'failed'; };
      document.head.appendChild(s);
    }
    function start() { (window.requestIdleCallback || function (f) { window.setTimeout(f, 300); })(inject, { timeout: 2500 }); }
    if (document.readyState === 'complete') start(); else window.addEventListener('load', start);
  }

  // =====================================================================
  // Everything below belongs to the current view and runs again whenever a view is shown
  // =====================================================================
  function mount() {
  var models = document.querySelectorAll('[data-model]');
  if (models.length) load3d(function (api) { api.mount(models); });

  // ---------- Scroll reveal ----------
  document.querySelectorAll('[data-stagger]').forEach(function (group) {
    Array.prototype.forEach.call(group.children, function (child, i) {
      child.setAttribute('data-reveal', '');
      child.style.setProperty('--d', (i * 70) + 'ms');
    });
  });
  var revealEls = document.querySelectorAll('[data-reveal]');
  if (!RM && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  }

  // ---------- Contact form -> WhatsApp / email ----------
  var form = document.getElementById('quoteForm');
  var errorEl = document.getElementById('formError');
  var FS = (E.strings && E.strings.form) || {};
  function clearErrors() {
    form.querySelectorAll('.is-invalid').forEach(function (el) { el.classList.remove('is-invalid'); el.removeAttribute('aria-invalid'); el.removeAttribute('aria-describedby'); });
    form.querySelectorAll('.field__err').forEach(function (el) { el.remove(); });
    errorEl.hidden = true;
  }
  function showError(msg, field) {          // the message sits right under the field, and in the summary line for screen readers
    clearErrors();
    var note = document.createElement('span');
    note.className = 'field__err'; note.id = 'err-' + field.name; note.textContent = msg;
    field.insertAdjacentElement('afterend', note);
    field.classList.add('is-invalid'); field.setAttribute('aria-invalid', 'true'); field.setAttribute('aria-describedby', note.id);
    errorEl.textContent = msg; errorEl.hidden = false;
    field.focus();
  }
  function showSent(kind, href) {           // popup blockers and missing mail apps happen: always give a link as well
    var box = document.getElementById('formSent');
    if (!box) { box = document.createElement('p'); box.id = 'formSent'; box.className = 'form__sent'; box.setAttribute('role', 'status'); form.appendChild(box); }
    var mail = kind === 'mail';
    box.innerHTML = '';
    box.appendChild(document.createTextNode((mail ? FS.sentMail : FS.sent) + ' '));
    var a = document.createElement('a'); a.href = href; a.textContent = mail ? FS.sentMailFallback : FS.sentFallback;
    if (!mail) { a.target = '_blank'; a.rel = 'noopener'; }
    box.appendChild(a);
  }
  if (form) {
    form.addEventListener('input', function (e) { if (e.target.classList && e.target.classList.contains('is-invalid')) clearErrors(); });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = form.elements.name, phone = form.elements.phone, product = form.elements.product, details = form.elements.details;
      if (!name.value.trim()) return showError(FS.name, name);
      if (phone.value.replace(/\D/g, '').length < 10) return showError(FS.phone, phone);
      if (!product.value) return showError(FS.product, product);
      clearErrors();
      var text = ['Hi, I would like a quote.', '', 'Name: ' + name.value.trim(), 'Phone: ' + phone.value.trim(), 'Product: ' + product.value, 'Details: ' + (details.value.trim() || '-'), '(Sent from the website: contact form)'].join('\n');
      var channel = e.submitter && e.submitter.dataset.channel;
      if (window.track) window.track('quote_form_submit', { item: channel === 'mail' ? 'email' : 'whatsapp', where: 'contact_form' });
      var href = channel === 'mail'
        ? 'mailto:' + E.email + '?subject=' + encodeURIComponent('Quote request - ' + product.value) + '&body=' + encodeURIComponent(text)
        : 'https://wa.me/' + E.wa + '?text=' + encodeURIComponent(text);
      showSent(channel === 'mail' ? 'mail' : 'wa', href);
      if (channel === 'mail') window.location.href = href;
      else window.open(href, '_blank', 'noopener');
    });
  }
  }
  window.EIIView.on(mount);
  window.EIIView.on(spy);
})();
