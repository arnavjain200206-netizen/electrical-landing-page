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
  if (legacy && E.page === 'home') { location.replace(E.base + (E.lang === 'hi' ? 'hi/' : '') + 'products/' + legacy[1] + '/'); return; }
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
  var hero = document.getElementById('hero');
  var progress = document.getElementById('progress');
  var queued = false;
  function onScrollFx() {
    queued = false;
    var y = window.scrollY;
    if (nav && hero) nav.classList.toggle('is-top', y < 24);
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
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav__menu ul a[href^="#"]'));
  var sections = links.map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); });
  function spy() {
    var y = window.scrollY + 120, current = -1;
    sections.forEach(function (sec, i) { if (sec && sec.offsetTop <= y) current = i; });
    links.forEach(function (a, i) { if (i === current) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
  }
  if (links.length) { window.addEventListener('scroll', spy, { passive: true }); spy(); }

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

  // ---------- Count-up numbers (final value is already in the markup) ----------
  var counters = document.querySelectorAll('[data-count]');
  function countUp(el) {
    var target = parseInt(el.dataset.count, 10), t0 = null;
    function step(t) {
      if (t0 === null) t0 = t;
      var p = Math.min((t - t0) / 1500, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 4)));
      if (p < 1) window.requestAnimationFrame(step); else el.textContent = target;
    }
    el.textContent = '0';
    window.requestAnimationFrame(step);
  }
  if (!RM && 'IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { cio.unobserve(en.target); window.setTimeout(function () { countUp(en.target); }, 900); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { cio.observe(el); });
  }

  // ---------- Rotating word in the headline ----------
  var rot = document.getElementById('rot');
  if (rot && !RM) {
    var words = rot.dataset.words.split('|'), word = rot.querySelector('.rot__w'), wi = 0;
    word.textContent = words[0];
    window.setInterval(function () {
      if (document.hidden) return;
      word.classList.add('is-out');
      window.setTimeout(function () {
        wi = (wi + 1) % words.length;
        word.textContent = words[wi];
        word.classList.remove('is-out');
        word.classList.add('is-pre');
        void word.offsetWidth;
        word.classList.remove('is-pre');
      }, 450);
    }, 2600);
  }

  // ---------- Pointer effects (mouse / trackpad only) ----------
  if (FINE && !RM) {
    var art = hero && hero.querySelector('.hero__art');
    if (hero && art) {
      hero.addEventListener('pointerenter', function () { hero.classList.add('is-hover'); });
      hero.addEventListener('pointermove', function (e) {
        var r = hero.getBoundingClientRect();
        hero.style.setProperty('--sx', (e.clientX - r.left) + 'px');
        hero.style.setProperty('--sy', (e.clientY - r.top) + 'px');
        art.style.setProperty('--px', (((e.clientX - r.left) / r.width - 0.5) * -18).toFixed(1) + 'px');
        art.style.setProperty('--py', (((e.clientY - r.top) / r.height - 0.5) * -12).toFixed(1) + 'px');
      });
      hero.addEventListener('pointerleave', function () {
        hero.classList.remove('is-hover');
        art.style.setProperty('--px', '0px'); art.style.setProperty('--py', '0px');
      });
    }
    document.querySelectorAll('[data-tilt]').forEach(function (card) {
      var k = card.classList.contains('pcard--xl') ? 3 : 7;
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        card.style.setProperty('--mx', (x * 100).toFixed(1) + '%');
        card.style.setProperty('--my', (y * 100).toFixed(1) + '%');
        card.style.setProperty('--ry', ((x - 0.5) * k).toFixed(2) + 'deg');
        card.style.setProperty('--rx', ((0.5 - y) * k).toFixed(2) + 'deg');
      });
      card.addEventListener('pointerleave', function () { card.style.setProperty('--rx', '0deg'); card.style.setProperty('--ry', '0deg'); });
    });
    document.querySelectorAll('.magnetic').forEach(function (btn) {
      btn.addEventListener('pointermove', function (e) {
        var r = btn.getBoundingClientRect();
        btn.style.transform = 'translate(' + ((e.clientX - r.left - r.width / 2) * 0.16).toFixed(1) + 'px,' + ((e.clientY - r.top - r.height / 2) * 0.28).toFixed(1) + 'px)';
      });
      btn.addEventListener('pointerleave', function () { btn.style.transform = ''; });
    });
  }

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
})();
