/* What depends on what. This is how hiding one thing keeps the rest of the site consistent:
   a tool, guide or FAQ answer that is about a product disappears on its own when that product is hidden.
   "requires" means: at least ONE of these products must be shown, otherwise the item is hidden too. */
module.exports = {
  productOrder: ['pvc-sheets', 'cut-to-size', 'stretch-film', 'bopp-tape', 'bubble-wrap', 'foam', 'strapping', 'edge-guard'],
  productGroup: { 'pvc-sheets': 'insulation', 'cut-to-size': 'insulation', 'stretch-film': 'packaging', 'bopp-tape': 'packaging', 'bubble-wrap': 'packaging', 'foam': 'packaging', 'strapping': 'packaging', 'edge-guard': 'packaging' },

  // home page sections that can be switched off (the product catalogue and the contact block always stay)
  sections: ['industries', 'tools', 'process', 'about', 'guides', 'faq', 'contactMap'],
  industries: ['switchgear', 'meter', 'appliance', 'traders'],

  tools: { weight: ['pvc-sheets'], fit: ['cut-to-size'], thickness: ['pvc-sheets'] },

  guides: {
    'pvc-sheet-thickness-guide': { requires: ['pvc-sheets', 'cut-to-size'], related: ['pvc-sheets', 'cut-to-size'] },
    'stretch-film-micron-guide': { requires: ['stretch-film'], related: ['stretch-film', 'edge-guard'] }
  },

  // home FAQ answers that are about one product (index in home.faq.items)
  faqRequires: { 0: ['pvc-sheets'], 1: ['pvc-sheets'], 8: ['bopp-tape'], 9: ['cut-to-size'] },

  features: ['hindi', 'threeD', 'floatingWhatsApp', 'ticker', 'themeSwitch'],

  // Texts that mention PVC / products and are worth a look when products are hidden (shown in the admin panel)
  homeTexts: [
    { key: 'home.hero.line1', label: 'Heading, line 1' },
    { key: 'home.hero.line2', label: 'Heading, line 2' },
    { key: 'home.hero.audience', label: 'Heading, last words' },
    { key: 'home.hero.lead', label: 'Intro paragraph' },
    { key: 'home.title', label: 'Browser / Google title' },
    { key: 'home.description', label: 'Google description' },
    { key: 'ui.footer.tagline', label: 'Footer line' }
  ]
};
