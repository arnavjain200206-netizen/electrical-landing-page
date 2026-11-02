/* Site-wide settings. Edit here, then run:  node build/build.js
   The live address can also be passed on the command line:
     node build/build.js --url https://yourdomain.in/                      */
const arg = (n) => { const i = process.argv.indexOf('--' + n); return i > -1 ? process.argv[i + 1] : undefined; };
// publishing details saved in site-config.json (the admin panel writes them); command-line options win over them
let saved = {};
try { saved = JSON.parse(require('fs').readFileSync(arg('config') ? require('path').resolve(arg('config')) : require('path').join(__dirname, '..', 'site-config.json'), 'utf8')); } catch (e) { /* no file yet */ }
const savedAnalytics = saved.analytics || {};

module.exports = {
  // TODO: replace with the live address (include the sub-folder on GitHub Pages)
  url: (arg('url') || process.env.SITE_URL || saved.siteUrl || 'https://www.example.com/').replace(/\/?$/, '/'),
  name: 'Electrical Insulation India',
  whatsapp: '917982644262',
  phoneDisplay: '+91 79826 44262',
  phoneTel: '+917982644262',
  email: 'arnavjaincena@gmail.com',
  address: { street: '20, Ansari Road, Daryaganj', locality: 'New Delhi', region: 'Delhi', postal: '110002', country: 'IN' },
  mapQuery: '20 Ansari Road Daryaganj New Delhi',
  hours: { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], opens: '09:30', closes: '19:00' },

  // Click tracking. Leave empty to switch tracking off. See README "Analytics".
  analytics: {
    ga4: arg('ga4') || savedAnalytics.ga4 || '',            // e.g. 'G-ABC123XYZ'
    plausibleDomain: arg('plausible') || savedAnalytics.plausible || '' // e.g. 'yourdomain.in'
  },

  // Google Business Profile. Paste the review link from your profile ("Get more reviews").
  googleReviewUrl: arg('review') || saved.googleReviewUrl || '',
  googleBusinessUrl: arg('gbp') || saved.googleBusinessUrl || '',

  guidesPublished: '2026-10-22'
};
