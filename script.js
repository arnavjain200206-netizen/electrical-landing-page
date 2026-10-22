/* Electrical Insulation India — landing page behaviour (vanilla JS) */
(function () {
  'use strict';

  // ====== EDIT THESE ======
  var CONFIG = {
    whatsappNumber: '917982644262', // country code + number, digits only (no + or spaces)
    email: 'arnavjaincena@gmail.com'
  };
  // ========================

  // Footer year
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---------- Theme toggle (light / dark) ----------
  var themeBtn = document.getElementById('themeToggle');
  var themeMeta = document.querySelector('meta[name="theme-color"]');
  var root = document.documentElement;

  function currentTheme() { return root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'; }
  function reflectTheme(t) {
    if (themeBtn) {
      themeBtn.setAttribute('aria-label', t === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
      themeBtn.setAttribute('aria-pressed', String(t === 'dark'));
    }
    if (themeMeta) themeMeta.setAttribute('content', t === 'dark' ? '#0f161f' : '#f6f4ef');
  }
  function setTheme(t, save) {
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduce) { root.classList.add('theme-anim'); window.setTimeout(function () { root.classList.remove('theme-anim'); }, 450); }
    root.setAttribute('data-theme', t);
    reflectTheme(t);
    if (save) { try { localStorage.setItem('eii_theme', t); } catch (e) {} }
  }
  reflectTheme(currentTheme());
  if (themeBtn) themeBtn.addEventListener('click', function () { setTheme(currentTheme() === 'dark' ? 'light' : 'dark', true); });
  // follow the OS setting until the visitor picks a theme themselves
  var mq = window.matchMedia('(prefers-color-scheme: dark)');
  function onSystemChange(e) {
    var saved = null;
    try { saved = localStorage.getItem('eii_theme'); } catch (err) {}
    if (saved !== 'light' && saved !== 'dark') setTheme(e.matches ? 'dark' : 'light', false);
  }
  if (mq.addEventListener) mq.addEventListener('change', onSystemChange);

  // ---------- Mobile menu ----------
  var toggle = document.getElementById('navToggle');
  var menu = document.getElementById('menu');

  function setMenu(open) {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.classList.toggle('is-open', open);
  }

  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      setMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { setMenu(false); toggle.focus(); }
    });
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.nav__inner')) setMenu(false);
    });
    window.matchMedia('(min-width: 900px)').addEventListener('change', function () { setMenu(false); });
  }

  // ---------- Highlight the current section in the nav ----------
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav__menu ul a[href^="#"]'));
  var sections = links.map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); });
  function spy() {
    var home = document.getElementById('main');
    var y = window.scrollY + 120, current = -1;
    if (home && !home.hidden) {
      sections.forEach(function (sec, i) { if (sec && sec.offsetTop <= y) current = i; });
    }
    links.forEach(function (a, i) {
      if (i === current) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
    });
  }
  window.addEventListener('scroll', spy, { passive: true });
  window.addEventListener('hashchange', spy);
  spy();

  // ---------- Quote form -> WhatsApp / email ----------
  var form = document.getElementById('quoteForm');
  var errorEl = document.getElementById('formError');

  function showError(msg, field) {
    errorEl.textContent = msg;
    errorEl.hidden = false;
    form.querySelectorAll('.is-invalid').forEach(function (el) { el.classList.remove('is-invalid'); });
    if (field) { field.classList.add('is-invalid'); field.focus(); }
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var name = form.elements.name;
      var phone = form.elements.phone;
      var product = form.elements.product;
      var details = form.elements.details;

      if (!name.value.trim()) return showError('Please enter your name.', name);
      if (phone.value.replace(/\D/g, '').length < 10) return showError('Please enter a valid 10-digit phone number.', phone);
      if (!product.value) return showError('Please select a product.', product);

      errorEl.hidden = true;
      form.querySelectorAll('.is-invalid').forEach(function (el) { el.classList.remove('is-invalid'); });

      var lines = [
        'Hi, I would like a quote.',
        '',
        'Name: ' + name.value.trim(),
        'Phone: ' + phone.value.trim(),
        'Product: ' + product.value,
        'Details: ' + (details.value.trim() || '-')
      ];
      var text = lines.join('\n');

      var channel = e.submitter && e.submitter.dataset.channel;
      if (channel === 'mail') {
        window.location.href = 'mailto:' + CONFIG.email +
          '?subject=' + encodeURIComponent('Quote request - ' + product.value) +
          '&body=' + encodeURIComponent(text);
      } else {
        window.open('https://wa.me/' + CONFIG.whatsappNumber + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
      }
    });
  }
})();
