/* Tiny helper so page scripts can (re)initialise whenever a view is shown.
   Multi-page build: mounted once. Single-page build: mounted again after every in-page navigation. */
(function () {
  'use strict';
  var fns = [];
  window.EIIView = {
    on: function (f) { fns.push(f); },
    mount: function () { fns.forEach(function (f) { try { f(); } catch (e) { if (window.console) console.error(e); } }); }
  };
})();
