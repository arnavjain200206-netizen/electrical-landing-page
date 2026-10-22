/* Starts the page. In the single-page build this is also the router:
   #/tools  #/guides  #/guides/<slug>  #/products/<slug>  #/#faq (home, scrolled to a section) */
(function () {
  'use strict';
  var E = window.EII;
  if (!E.single) { window.EIIView.mount(); return; }

  var view = document.getElementById('view'), main = document.getElementById('main');
  var data = JSON.parse(document.getElementById('eii-views').textContent);
  var home = { title: document.title, page: 'home', path: '', html: view.innerHTML };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var current = null;
  main.setAttribute('tabindex', '-1');

  function parse() {
    var h = location.hash, m = /^#\/([^#]*)(?:#(.*))?$/.exec(h), key = '', anchor = '', plain = false;
    if (m) {
      key = m[1].replace(/\/+$/, ''); anchor = m[2] ? decodeURIComponent(m[2]) : '';
      var legacy = /^product\/(.+)$/.exec(key); if (legacy) key = 'products/' + legacy[1];
      if (key && !data[key]) key = '';
    } else if (h.length > 1) { anchor = decodeURIComponent(h.slice(1)); plain = true; }
    return { key: key, anchor: anchor, plain: plain };
  }
  function chrome(key, v) {
    var a = document.querySelector('.nav__menu a[data-nav="tools"]'), g = document.querySelector('.nav__menu a[data-nav="guides"]');
    if (a) { if (key === 'tools') a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); }
    if (g) { if (key.indexOf('guides') === 0) g.setAttribute('aria-current', 'page'); else g.removeAttribute('aria-current'); }
    var other = E.lang === 'hi' ? 'index.html' : 'hi.html';
    document.querySelectorAll('.lang-switch').forEach(function (l) { l.setAttribute('href', other + (key ? '#/' + key : '')); });
    document.title = v.title; document.body.setAttribute('data-page', v.page); E.page = v.page; E.path = v.path;
  }
  function swap(key) {
    var v = key ? data[key] : home;
    view.innerHTML = v.html; chrome(key, v); current = key;
    window.EIIView.mount();
  }
  function scrollAfter(r, changed) {
    var el = r.anchor && document.getElementById(r.anchor);
    if (el) el.scrollIntoView({ block: 'start' });
    else if (changed) window.scrollTo({ top: 0, behavior: 'instant' });
    if (changed) { try { main.focus({ preventScroll: true }); } catch (e) {} }
  }
  function go() {
    var r = parse();
    // a plain #anchor that exists in the current view (e.g. a guide's table of contents) just scrolls
    if (r.plain && current !== null && document.getElementById(r.anchor)) { scrollAfter(r, false); return; }
    var changed = r.key !== current;
    var apply = function () { if (changed) swap(r.key); scrollAfter(r, changed); };
    if (changed && current !== null && !reduce && document.startViewTransition) document.startViewTransition(apply); else apply();
  }
  window.addEventListener('hashchange', go);
  go();
})();
