/* Starter lists for the Industries cards. Each item becomes an entry in the
   visitor's enquiry list. Detail keys are the English field labels. */
module.exports = {
  switchgear: [
    { slug: 'pvc-sheets', details: [['Thickness', '5 mm'], ['Sheet size', '1220 × 2440 mm (4 × 8 ft)']] },
    { slug: 'cut-to-size', details: [['Thickness', '5 mm']] },
    { slug: 'bubble-wrap', details: [] },
    { slug: 'stretch-film', details: [['Grade', 'Machine grade']] }
  ],
  meter: [
    { slug: 'pvc-sheets', details: [['Thickness', '3 mm'], ['Sheet size', '1220 × 2440 mm (4 × 8 ft)']] },
    { slug: 'cut-to-size', details: [['Thickness', '3 mm']] },
    { slug: 'bubble-wrap', details: [] },
    { slug: 'bopp-tape', details: [['Width', '48 mm (2 in)'], ['Colour', 'Clear']] }
  ],
  appliance: [
    { slug: 'pvc-sheets', details: [['Thickness', '2 mm']] },
    { slug: 'foam', details: [] },
    { slug: 'bubble-wrap', details: [] },
    { slug: 'bopp-tape', details: [['Colour', 'Printed (logo)']] }
  ],
  traders: [
    { slug: 'bopp-tape', details: [['Width', '48 mm (2 in)'], ['Colour', 'Clear']] },
    { slug: 'stretch-film', details: [] },
    { slug: 'strapping', details: [] },
    { slug: 'edge-guard', details: [] },
    { slug: 'bubble-wrap', details: [] }
  ]
};
