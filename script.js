/* Electrical Insulation India — landing page behaviour (vanilla JS) */
(function () {
  'use strict';

  // ====== EDIT THESE ======
  var CONFIG = {
    whatsappNumber: '919999999999', // country code + number, digits only (no + or spaces)
    email: 'info@example.com'
  };
  // ========================

  document.documentElement.classList.add('js');

  // Footer year
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---------- Mobile menu ----------
  var toggle = document.getElementById('navToggle');
  var menu = document.getElementById('menu');

  function setMenu(open) {
    toggle.setAttribute('aria-expanded', String(open));
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
      if (e.key === 'Escape') setMenu(false);
    });
    window.matchMedia('(min-width: 900px)').addEventListener('change', function () { setMenu(false); });
  }

  // ---------- Scroll reveal ----------
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

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
