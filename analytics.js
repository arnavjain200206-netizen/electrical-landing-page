/* Click tracking for WhatsApp / call / email / map / review buttons and the enquiry list.
   Nothing is sent unless an ID is set in build/site.js (GA4) or a Plausible domain is set.
   Events appear in GA4 under Reports > Engagement > Events (and in Realtime). */
(function () {
  'use strict';
  var E = window.EII || {};
  var debug = /[?&]debug_analytics/.test(location.search);

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }

  function loadScript(src, attrs) {
    var s = document.createElement('script');
    s.async = true; s.src = src;
    Object.keys(attrs || {}).forEach(function (k) { s.setAttribute(k, attrs[k]); });
    document.head.appendChild(s);
  }
  if (E.ga4) {
    loadScript('https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(E.ga4));
    gtag('js', new Date());
    gtag('config', E.ga4, { anonymize_ip: true });
  }
  if (E.plausible) {
    window.plausible = window.plausible || function () { (window.plausible.q = window.plausible.q || []).push(arguments); };
    loadScript('https://plausible.io/js/script.js', { 'data-domain': E.plausible, defer: '' });
  }

  window.track = function (name, params) {
    params = params || {};
    params.language = E.lang || '';
    params.page_type = E.page || '';
    if (E.ga4) gtag('event', name, params);
    if (E.plausible && window.plausible) window.plausible(name, { props: params });
    if (debug && window.console) console.log('[track]', name, params);
    try { // short log for the owner to check while testing
      var log = JSON.parse(sessionStorage.getItem('eii_events') || '[]');
      log.push([name, params.where || '', Date.now()]);
      sessionStorage.setItem('eii_events', JSON.stringify(log.slice(-50)));
    } catch (e) {}
  };

  function infer(a) {
    var href = a.getAttribute('href') || '';
    if (href.indexOf('https://wa.me') === 0 || href.indexOf('wa.me/') > -1) return 'whatsapp_click';
    if (href.indexOf('tel:') === 0) return 'call_click';
    if (href.indexOf('mailto:') === 0) return 'email_click';
    return '';
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('a, button') : null;
    if (!a) return;
    var name = a.getAttribute('data-track') || (a.tagName === 'A' ? infer(a) : '');
    if (!name) return;
    var where = a.getAttribute('data-track-where');
    if (!where) { var sec = a.closest('section[id], header, footer'); where = sec ? (sec.id || sec.tagName.toLowerCase()) : ''; }
    window.track(name, { where: where, item: a.getAttribute('data-track-item') || '' });
  }, true);
})();
