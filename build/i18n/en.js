/* English strings. build/i18n/hi.js must have exactly the same shape
   (build.js refuses to build if a key is missing in either language).
   Plain text only; the templates escape it. {wa} {tel} {name} etc. are placeholders. */
module.exports = {
  htmlLang: 'en-IN',
  ogLocale: 'en_IN',
  switchTo: { label: 'हिन्दी', aria: 'हिन्दी में देखें', hreflang: 'hi' },

  ui: {
    skip: 'Skip to content',
    topbarAddress: '20, Ansari Road, Daryaganj, New Delhi – 110002',
    topbarHours: 'Mon–Sat, 9:30 am – 7:00 pm',
    brandSub: 'India',
    brandHome: 'Electrical Insulation India — home',
    waGreeting: 'Hi, I need a quote for PVC sheets / packaging material.',
    nav: {
      label: 'Main', products: 'Products', industries: 'Industries', tools: 'Tools', guides: 'Guides', faq: 'FAQ', contact: 'Contact',
      whatsapp: 'WhatsApp', menuOpen: 'Open menu', menuClose: 'Close menu',
      themeToDark: 'Switch to dark theme', themeToLight: 'Switch to light theme', themeTitle: 'Switch theme',
      enquiry: 'Enquiry list', enquiryOpen: 'Open enquiry list'
    },
    footer: {
      tagline: 'Wholesale PVC sheets and packaging material.', rights: 'All rights reserved.', navLabel: 'Footer',
      links: { products: 'Products', tools: 'Tools', guides: 'Guides', about: 'About', faq: 'FAQ', contact: 'Contact' },
      review: 'Review us on Google'
    },
    fab: 'Chat on WhatsApp',
    common: {
      call: 'Call', sizesDetails: 'Sizes & details', details: 'Details', howItWorks: 'How it works',
      add: 'Add to enquiry', home: 'Home', products: 'Products', guides: 'Guides', tools: 'Tools', readGuide: 'Read the guide',
      openTool: 'Open the tool', backAll: 'Back to all products', whatsappCta: 'Ask on WhatsApp', needHelp: 'Not sure? Ask us on WhatsApp.'
    },
    fieldLabels: {
      'Thickness': 'Thickness', 'Sheet size': 'Sheet size', 'Colour': 'Colour', 'Quantity': 'Quantity', 'Use / application': 'Use / application',
      'Cut size 1 (L × W mm)': 'Cut size 1 (L × W mm)', 'Cut size 2 (L × W mm)': 'Cut size 2 (L × W mm)', 'Holes / cut-outs': 'Holes / cut-outs',
      'Grade': 'Grade', 'Width': 'Width', 'Micron': 'Micron', 'Length': 'Length', 'GSM': 'GSM', 'Bubble size': 'Bubble size',
      'Method': 'Method', 'Accessories': 'Accessories', 'Form': 'Form', 'Density': 'Density', 'Material': 'Material',
      'Size / length': 'Size / length', 'Use': 'Use'
    },
    placeholders: {
      'e.g. 50 sheets': 'e.g. 50 sheets', 'e.g. switch panel insulation': 'e.g. switch panel insulation',
      'e.g. 600 × 400 mm — 20 pcs': 'e.g. 600 × 400 mm — 20 pcs', 'optional': 'optional', 'e.g. 200 kg / 50 rolls': 'e.g. 200 kg / 50 rolls',
      'e.g. 5 cartons / 360 rolls': 'e.g. 5 cartons / 360 rolls', 'e.g. 20 rolls': 'e.g. 20 rolls', 'e.g. 20 rolls / 500 kg': 'e.g. 20 rolls / 500 kg',
      'e.g. 5 mm': 'e.g. 5 mm', 'e.g. 10 rolls / 50 sheets': 'e.g. 10 rolls / 50 sheets', 'e.g. 35 × 35 × 3 mm, 1 m long': 'e.g. 35 × 35 × 3 mm, 1 m long',
      'e.g. 500 pcs': 'e.g. 500 pcs', 'e.g. pallet corners': 'e.g. pallet corners'
    },
    options: {
      'Suggest for me': 'Suggest for me', 'Other (write in notes)': 'Other (write in notes)', 'Other': 'Other', 'Not sure': 'Not sure',
      'Grey': 'Grey', 'White': 'White', 'Black': 'Black', 'Clear': 'Clear', 'Brown': 'Brown', 'Printed (logo)': 'Printed (logo)', 'Other colour': 'Other colour',
      'Hand grade': 'Hand grade', 'Machine grade': 'Machine grade', 'Machine': 'Machine', 'Semi-automatic': 'Semi-automatic', 'Hand tool': 'Hand tool',
      'Any': 'Any', 'None': 'None', 'Clips': 'Clips', 'Sealers': 'Sealers', 'Clips + sealers': 'Clips + sealers', 'Roll': 'Roll', 'Sheet': 'Sheet',
      'Cut pieces': 'Cut pieces', 'Yes (will send drawing)': 'Yes (will send drawing)', 'No': 'No', 'Cut-to-size (write sizes in notes)': 'Cut-to-size (write sizes in notes)',
      'Cut roll (write in notes)': 'Cut roll (write in notes)', 'Jumbo (specify in notes)': 'Jumbo (specify in notes)', 'Board / paper': 'Board / paper',
      'Plastic': 'Plastic', 'Red': 'Red', 'Blue': 'Blue', 'Green': 'Green'
    }
  },

  home: {
    title: 'PVC Sheet & Packaging Wholesaler, Delhi | Electrical Insulation India',
    description: 'Wholesale rigid PVC sheets for electrical insulation and packaging material from Daryaganj, New Delhi. Cut-to-size, GST invoice, dispatch across India.',
    ogDescription: 'Rigid PVC sheets for electrical insulation and packaging material. Cut-to-size, GST invoice, dispatch across India.',
    hero: {
      kicker: 'Wholesale supplier · Daryaganj, New Delhi',
      line1: 'PVC sheets and', line2: 'packaging material', forWord: 'for',
      audience: 'factories, panel makers and traders',
      words: ['factories', 'panel makers', 'traders', 'fabricators', 'OEMs'],
      srH1: 'PVC sheets and packaging material for factories, panel makers and traders.',
      lead: 'Rigid PVC sheet for electrical insulation, plus the stretch film, tape, bubble wrap and strapping you pack and ship with. Send us the product, size and quantity on WhatsApp and we will quote, usually the same business day.',
      ctaWa: 'Get a quote on WhatsApp', ctaCall: 'Call +91 79826 44262',
      stackAlt: 'Stack of PVC insulation sheets stopping an electric spark',
      chipTitle: 'Rigid PVC sheet', chipSpec: '1–20 mm · 1220 × 2440 mm'
    },
    facts: {
      sheet: 'Standard sheet', thickness: 'Thickness', thicknessTo: 'to', dispatch: 'Delhi-NCR dispatch', dispatchValue: '1–2 working days',
      billing: 'Billing', billingValue: 'GST invoice + LR copy'
    },
    ticker: ['PVC sheets', 'Cut-to-size panels', 'Stretch film', 'BOPP tape', 'Bubble wrap', 'EPE foam', 'PP strapping', 'Edge guards'],
    products: {
      kicker: 'Products', h2: 'What we stock',
      sub: 'Insulation sheet and packaging material on one invoice and one delivery. Open any product for sizes, specifications and a ready-made WhatsApp enquiry.',
      note: "Don't see what you need? Ask us on WhatsApp. We can often arrange other sizes, colours and grades.",
      tagInsulation: 'Insulation', tagPackaging: 'Packaging',
      cards: {
        'pvc-sheets': { title: 'Rigid PVC sheet', text: 'Solid grey sheet for insulation panels, barriers, meter boxes, linings and machine guards. Other colours and thicknesses on request.', spec: '1–20 mm · 1220 × 2440 mm', more: 'Sizes & details' },
        'cut-to-size': { title: 'Cut-to-size PVC panels', text: 'Send a drawing, a sketch or a list of sizes. We cut the sheet and you get panels ready to drill and fit, with less wastage on your side.', spec: 'As per drawing · small & bulk orders', more: 'How it works' },
        'stretch-film': { title: 'Stretch film', text: 'Hand and machine grade rolls for wrapping pallets and cartons.', spec: 'Clear & black · 76 mm core', more: 'Sizes & details' },
        'bopp-tape': { title: 'BOPP packing tape', text: 'Carton sealing tape in clear and brown, or printed with your logo.', spec: '24–72 mm · 50 & 65 m rolls', more: 'Sizes & details' },
        'bubble-wrap': { title: 'Air bubble wrap', text: 'Cushioning rolls for fragile electricals, glass and appliances.', spec: '1–1.5 m wide · 50 & 100 m rolls', more: 'Sizes & details' },
        'foam': { title: 'EPE foam sheets & rolls', text: 'Expanded polyethylene foam for protective packaging and surface protection.', spec: '1–50 mm · rolls, sheets, cut pieces', more: 'Sizes & details' },
        'strapping': { title: 'PP strapping & clips', text: 'Strap rolls, clips and sealers to close the pack securely.', spec: '9–19 mm · machine & semi-auto', more: 'Sizes & details' },
        'edge-guard': { title: 'Edge & corner guards', text: 'L-shaped guards that stop strap cut-in and protect corners of cartons and pallets.', spec: 'Length as required', more: 'Details' }
      }
    },
    industries: {
      kicker: 'Industries', h2: 'Who we supply, and what they usually buy',
      sub: 'Tap "Add starter list" and we put the usual items in your enquiry list. Change sizes and quantities there, then send it on WhatsApp.',
      buys: 'Usually buys', addList: 'Add starter list to enquiry', added: 'Starter list added',
      cards: [
        { id: 'switchgear', title: 'Switchgear & panel makers', text: 'Barriers, insulation plates and spacers cut to your drawing, delivered ready to assemble.' },
        { id: 'meter', title: 'Meter box makers & electrical contractors', text: 'Sheet for meter boxes, spacer plates and cable-entry barriers, with protective wrap for site delivery.' },
        { id: 'appliance', title: 'Appliance & equipment manufacturers', text: 'Insulating plates for assemblies, plus foam, bubble wrap and tape to ship finished units safely.' },
        { id: 'traders', title: 'Traders, e-commerce & shippers', text: 'Everything to pack and dispatch: tape, film, strapping and corner protection on one invoice.' }
      ]
    },
    toolsTeaser: {
      kicker: 'Free tools', h2: 'Work it out before you ask',
      sub: 'Quick calculators for buyers. Use the result in your enquiry with one tap.',
      cards: [
        { id: 'weight', title: 'PVC sheet weight & cost', text: 'Thickness, size and quantity in; weight, tonnage and estimated cost (with GST) out.' },
        { id: 'fit', title: 'Cut-to-size fit checker', text: 'See how many panels fit on a 1220 × 2440 mm sheet, the cutting layout and the waste.' },
        { id: 'thickness', title: 'Which thickness?', text: 'Answer four short questions and get a sensible thickness range for your job.' }
      ],
      open: 'Open tool'
    },
    process: {
      kicker: 'How to order', h2: 'From enquiry to delivery',
      steps: [
        { title: 'Send your requirement', text: 'WhatsApp us the product, size or thickness, quantity and delivery city. Or build an enquiry list on this site.' },
        { title: 'Receive the quote', text: 'We reply with the bulk rate, freight and delivery time, usually the same business day.' },
        { title: 'We cut and pack', text: 'Sheets are cut to your drawing and everything is packed for transit.' },
        { title: 'Dispatch', text: 'Goods leave by road transport with a GST invoice and LR copy.' }
      ]
    },
    about: {
      kicker: 'About us', h2: 'A supplier that understands the shop floor and the dispatch desk',
      paras: [
        'Electrical Insulation India supplies PVC sheet and packaging material to panel makers, fabricators, manufacturers and traders from our shop in Daryaganj, Delhi.',
        'We keep the sizes people reorder in stock, so repeat orders are quick. Tell us the thickness, size and quantity. We will quote, cut accurately and dispatch on schedule, with a proper GST invoice.',
        'If you are not sure which grade or thickness suits your application, ask. We would rather help you pick the right one than sell you the wrong one.'
      ],
      glance: [
        { label: 'Products', value: 'Rigid PVC sheet, cut-to-size panels, packaging material' },
        { label: 'Address', value: '20, Ansari Road, Daryaganj, New Delhi – 110002' },
        { label: 'Hours', value: 'Monday to Saturday, 9:30 am – 7:00 pm' },
        { label: 'Payment', value: 'Advance for new buyers. Credit terms for regular buyers after approval.' },
        { label: 'Dispatch', value: 'By road across India, with GST invoice and LR copy' },
        { label: 'Samples', value: 'On request. Courier charges may apply.' }
      ]
    },
    guides: {
      kicker: 'Guides', h2: 'Buying guides', sub: 'Plain-language help for choosing the right material.', all: 'All guides'
    },
    faq: {
      kicker: 'FAQ', h2: 'Common questions',
      sub: "Can't find your answer? Message us on {wa} or call {tel}.",
      items: [
        { q: 'What thicknesses and sizes of PVC sheet do you supply?', a: 'Rigid grey PVC sheets are commonly available from 1 mm to 20 mm in a standard 1220 × 2440 mm size. Other thicknesses, colours and cut sizes can be arranged. Send us your requirement.' },
        { q: 'Is PVC sheet suitable for electrical insulation?', a: 'Rigid PVC is an electrical insulator and is widely used for insulation panels, barriers and meter boxes. For safety-critical use, tell us your voltage, flame rating and standard (IS / IEC) and we will confirm the right grade and share the test certificate.' },
        { q: 'What is the minimum order quantity?', a: 'We serve both small and bulk buyers. Wholesale rates apply from bulk quantities. Message us your requirement and we will share the best price.' },
        { q: 'Do you deliver across India?', a: 'Yes. We dispatch by road transport across India. Freight is quoted along with the material, and you receive a GST invoice and LR copy.' },
        { q: 'Can I get a sample before ordering?', a: 'Yes, samples of PVC sheet and packaging material can be arranged on request. Courier charges may apply.' },
        { q: 'How do I get a quote quickly?', a: 'The fastest way is WhatsApp. Send the product, thickness or size, quantity and delivery city. You can also build an enquiry list on this site, use the form below or email us.' },
        { q: 'What are your payment terms?', a: 'New buyers pay in advance (UPI, NEFT / RTGS or bank transfer). Regular buyers can request credit terms, which are offered after approval.' },
        { q: 'How long does delivery take?', a: 'Delhi-NCR orders are usually dispatched within 1–2 working days. For other cities, transit takes about 3–7 days depending on the route. Cut-to-size orders may need an extra day.' },
        { q: 'Can you print my logo on BOPP tape?', a: 'Yes, custom-printed BOPP tape with your brand name or logo is available in bulk quantities. Share your artwork and we will confirm the minimum quantity and lead time.' },
        { q: 'Can you cut PVC sheets to my drawing or size?', a: 'Yes. Send us your drawing or dimensions and we will cut the sheets to size, so you save on wastage and fabrication time.' },
        { q: 'Where are you located, and can I visit?', a: 'We are at 20, Ansari Road, Daryaganj, New Delhi. You are welcome to visit during working hours (Mon–Sat, 9:30 am – 7:00 pm). Please call or WhatsApp us on +91 79826 44262 before coming.' }
      ]
    },
    contact: {
      kicker: 'Contact', h2: 'Tell us what you need',
      lead: 'Message us the product, size and quantity. We reply on WhatsApp, usually the same business day.',
      ctaWa: 'Chat on WhatsApp',
      labels: { phone: 'Phone', email: 'Email', address: 'Address', hours: 'Hours' },
      hours: 'Mon–Sat, 9:30 am – 7:00 pm',
      mapTitle: 'Map: 20 Ansari Road, Daryaganj, New Delhi',
      form: {
        title: 'Request a quote', hint: 'Fill this in and we will open WhatsApp (or your email app) with the details ready to send.',
        name: 'Your name', namePh: 'e.g. Rajesh Sharma', phone: 'Phone / WhatsApp', phonePh: 'e.g. 98765 43210',
        product: 'Product', productPh: 'Select a product', multiple: 'Multiple items',
        details: 'Size / thickness and quantity', detailsPh: 'e.g. 5 mm grey PVC, 1220 × 2440, 50 sheets, delivery to Pune',
        sendWa: 'Send on WhatsApp', sendMail: 'Send by email'
      }
    }
  },

  product: {
    titleSuffix: 'Sizes & Price | Electrical Insulation India',
    metaTail: 'Sizes, specifications and WhatsApp quotation. Wholesale supplier, Daryaganj, New Delhi.',
    kicker: 'Product details', crumbNav: 'Breadcrumb',
    priceTitle: 'Price on request',
    priceText: 'Rates change with size, quantity and city. Get the best bulk quotation on WhatsApp, usually the same business day.',
    buildQuote: 'Build your quote', quick: 'Quick enquiry',
    overview: 'Overview', specs: 'Specifications', applications: 'Applications', features: 'Key features', packing: 'Packing & dispatch',
    faqs: 'Common questions', related: 'You may also need', viewDetails: 'View details', back: 'Back to all products',
    qb: {
      title: 'Get your quote on WhatsApp',
      hint: 'Choose your requirement. The message below is written for you. Edit it any way you like, then send.',
      select: 'Select…', city: 'Delivery city / pincode', cityPh: 'e.g. Jaipur 302001', yourName: 'Your name', yourNamePh: 'Your name',
      also: 'Also include', gst: 'GST invoice', sample: 'Sample', freight: 'Freight quote',
      notes: 'Extra notes', notesPh: 'Anything else we should know', msgLabel: 'WhatsApp message (editable)',
      send: 'Send on WhatsApp', copy: 'Copy', reset: 'Reset', addList: 'Add to enquiry list',
      preferCall: 'Prefer a call?'
    }
  },

  tools: {
    title: 'Free PVC Sheet Calculators & Tools | Electrical Insulation India',
    description: 'PVC sheet weight and cost calculator, cut-to-size fit checker and a thickness guide. Free tools from a Delhi PVC sheet wholesaler.',
    kicker: 'Free tools', h1: 'Tools for buyers',
    lead: 'Work out weight, cost, cutting layout and thickness before you send your enquiry. Estimates are indicative: we confirm final figures in the quotation.',
    jump: { weight: 'Weight & cost', fit: 'Fit checker', thickness: 'Which thickness?' },
    weight: {
      title: 'PVC sheet weight & cost calculator',
      intro: 'Weight = length × width × thickness × density. Add the rate you were quoted to estimate the material cost.',
      thickness: 'Thickness (mm)', size: 'Sheet size', custom: 'Custom size', length: 'Length (mm)', width: 'Width (mm)',
      qty: 'Number of sheets', density: 'Density (g/cm³)', densityHelp: 'Typical rigid PVC: 1.25–1.40. We use 1.35.',
      rate: 'Rate (₹ per kg)', rateHelp: 'Optional. Enter the rate you were quoted.', gst: 'GST (%)', gstHelp: 'Check the current rate for your invoice.',
      outPerSheet: 'Weight per sheet', outTotal: 'Total weight', outTonnes: 'In tonnes', outArea: 'Total area',
      outMaterial: 'Material cost', outGst: 'GST', outGrand: 'Estimated total', outPerSheetCost: 'Cost per sheet',
      note: 'Indicative only. Actual weight varies with grade, density and thickness tolerance.',
      add: 'Add to enquiry', wa: 'Send on WhatsApp', kg: 'kg', sqm: 'm²', t: 't',
      errThickness: 'Enter a thickness between 0.5 and 50 mm.', errSize: 'Enter a length and width between 50 and 3000 mm.', errQty: 'Enter at least 1 sheet.'
    },
    fit: {
      title: 'Cut-to-size fit checker',
      intro: 'Enter the panel you need and see how many fit on one sheet, the cutting layout and the waste. Layouts use straight edge-to-edge cuts, the way a panel saw works.',
      sheet: 'Sheet size', custom: 'Custom size', sheetLength: 'Sheet length (mm)', sheetWidth: 'Sheet width (mm)',
      panelLength: 'Panel length (mm)', panelWidth: 'Panel width (mm)', kerf: 'Saw cut width (mm)', kerfHelp: 'Material lost in each cut. 3 mm is typical.',
      qty: 'Panels needed', rotate: 'Allow turning panels 90°', rotateHelp: 'Only tick this if the panel has no grain or direction.',
      outPerSheet: 'Panels per sheet', outSheets: 'Sheets needed', outUse: 'Sheet used', outWaste: 'Waste', outLeft: 'Spare panels',
      legend: 'Each rectangle is one panel. Grey is waste.', note: 'The checker finds a good layout, not always the single best one. For complex jobs send us your drawing.',
      add: 'Add to enquiry', wa: 'Send on WhatsApp', panels: 'panels', sheets: 'sheets',
      errPanel: 'Enter a panel length and width of at least 20 mm.', errTooBig: 'That panel is bigger than the sheet.', errSheet: 'Enter a sheet length and width between 100 and 3000 mm.',
      errKerf: 'Saw cut width must be between 0 and 20 mm.', zero: 'No panel of this size fits on the sheet.', svgLabel: 'Cutting layout of the sheet'
    },
    thickness: {
      title: 'Which thickness do I need?',
      intro: 'Four short questions give you a sensible starting range. It is guidance for ordinary jobs, not an engineering design.',
      q1: 'What will you use it for?', q2: 'How big is the largest piece?', q3: 'How is it supported?', q4: 'Is it near live electrical parts?',
      apps: {
        panel: 'Panel barrier / insulation plate', spacer: 'Spacer or packing plate', meter: 'Meter box / small enclosure',
        guard: 'Machine guard / cover', tank: 'Tank lining / welded fabrication', sign: 'Signage / partition / display'
      },
      sizes: { s: 'Up to 300 mm', m: '300–600 mm', l: '600–1000 mm', xl: 'Over 1000 mm' },
      support: { full: 'Fixed on all sides or fully backed', edge: 'Only supported on two sides or at corners' },
      live: { yes: 'Yes, near live parts', no: 'No' },
      calc: 'Show my thickness',
      resultTitle: 'Suggested thickness', resultRange: '{a} to {b} mm', start: 'Good starting point: {n} mm',
      why: 'Why this range',
      reasonApp: 'For this use, jobs like yours commonly use {a}–{b} mm.',
      reasonSize: 'A piece this large usually needs more stiffness, so we moved the range up.',
      reasonSupport: 'With support only at the edges, thicker sheet resists sagging.',
      reasonLive: 'Near live parts the sheet is part of your safety design. Tell us the voltage and the standard (IS / IEC) and we will confirm the grade and share the test certificate.',
      disclaimer: 'Indicative guidance only. Final thickness must follow your drawing, load and the applicable standard.',
      add: 'Add {n} mm sheet to enquiry', wa: 'Ask an expert on WhatsApp', reset: 'Start again', stepOf: 'Question {n} of {total}', next: 'Next', back: 'Back',
      required: 'Please choose an option.'
    }
  },

  guides: {
    indexTitle: 'Buying Guides: PVC Sheet & Packaging | Electrical Insulation India',
    indexDescription: 'Plain-language buying guides: how to choose PVC sheet thickness and stretch film micron, with weights, sizes and common mistakes.',
    kicker: 'Guides', h1: 'Buying guides', lead: 'Short, practical guides from the counter at Daryaganj. Use them to choose the right material before you order.',
    readMore: 'Read the guide', onThisPage: 'In this guide', published: 'Published', faqTitle: 'Common questions', ctaTitle: 'Need help choosing?',
    ctaText: 'Tell us what you are making or packing. We will suggest the right material and quote the same business day.',
    ctaTools: 'Try the free tools',
    weights: { thickness: 'Thickness', perSheet: 'Weight per sheet', perSqm: 'Weight per m²', note: 'Sheet 1220 × 2440 mm, calculated at 1.35 g/cm³. Approximate.' },
    articles: {
      'pvc-sheet-thickness-guide': {
        title: 'PVC Sheet Thickness Guide: Which Thickness for Panels, Barriers and Fabrication',
        seoTitle: 'PVC Sheet Thickness Guide',
        h1: 'PVC sheet thickness guide',
        description: 'How to choose rigid PVC sheet thickness for insulation panels, meter boxes, machine guards and fabrication, with sheet weights and common mistakes.',
        excerpt: 'Quick reference by application, what decides the thickness, standard sheet weights and mistakes to avoid.',
        intro: 'Choosing PVC sheet thickness is a balance between stiffness, weight, cost and how you will fabricate it. This guide gives practical starting points used in panel and fabrication work. It is not a design standard. For safety-critical insulation, follow your drawing or the relevant IS / IEC requirement and tell us the voltage so we can confirm the grade.',
        sections: [
          { id: 'quick', h2: 'Quick reference by application',
            table: { head: ['Application', 'Typical thickness', 'Notes'], rows: [
              ['Panel barriers and insulation plates', '3–6 mm', 'Use 6–10 mm for large plates that are not fully supported.'],
              ['Spacer and packing plates', '2–5 mm', 'Choose by the gap you need to fill.'],
              ['Meter boxes and small enclosures', '3–5 mm', 'Go thicker for large or heavily loaded boxes.'],
              ['Machine guards and covers', '4–8 mm', 'Go thicker for larger spans.'],
              ['Tank linings and welded fabrication', '5–12 mm', 'Thicker where joints carry load.'],
              ['Signage, partitions and displays', '2–5 mm', 'Use thicker sheet or stiffeners for tall panels.'],
              ['Gaskets and shims', '1–3 mm', 'Match the thickness to the joint.']
            ] } },
          { id: 'decides', h2: 'What decides the thickness',
            ul: [
              'Span and support: a sheet fixed on all edges can be thinner than one held at only two sides.',
              'Size of the piece: bigger pieces sag and flex more, so they need more thickness.',
              'Mechanical load and impact: heavy fittings, knocks and vibration call for thicker sheet.',
              'Electrical requirement: sheet thickness is only one factor. Voltage, grade and your standard decide the rest.',
              'Fabrication: bending (with heat), welding and machining all work better with enough thickness.',
              'Temperature: general indoor use is fine; PVC softens as it gets hot, so keep it away from heat sources.',
              'Weight and cost: if thickness doubles, weight and material cost roughly double.'
            ] },
          { id: 'weights', h2: 'Standard sheet weights', p: ['Use this table to plan handling and freight. The weight of a sheet grows in direct proportion to its thickness.'], weights: true },
          { id: 'mistakes', h2: 'Common mistakes',
            ul: [
              'Ordering too thin for a large piece that is only supported at the edges.',
              'Assuming the nominal thickness is exact. Tolerance varies, so tell us if a thickness is critical.',
              'Ignoring wastage. Cut-to-size panels often cost less overall than full sheets you cut yourself.',
              'Forgetting that PVC expands and contracts with temperature. Leave a small clearance on long runs.'
            ] }
        ],
        faqs: [
          { q: 'Is thicker PVC always better insulation?', a: 'Thicker sheet adds mechanical strength and some electrical margin, but the right choice depends on voltage, grade and your standard. Share your requirement and we will confirm.' },
          { q: 'What is the thickness tolerance of PVC sheet?', a: 'It varies by manufacturer and thickness. Ask us for the current tolerance, and for critical parts tell us the tolerance you need before you order.' },
          { q: 'Can I get a sample to check the thickness first?', a: 'Yes, samples can be arranged on request. Courier charges may apply.' }
        ]
      },
      'stretch-film-micron-guide': {
        title: 'Stretch Film Micron Guide: Which Micron for Hand and Machine Wrapping',
        seoTitle: 'Stretch Film Micron Guide',
        h1: 'Stretch film micron guide',
        description: 'How to choose stretch film micron, width and grade for hand and machine pallet wrapping, how long a roll is, and mistakes to avoid when comparing prices.',
        excerpt: 'Hand vs machine film, micron by load, how long a roll is and how to compare prices properly.',
        intro: 'Micron is the thickness of the film, in millionths of a metre. A higher micron is stronger, but it is not always the better buy. The right film depends on your load, how you wrap and how many wraps you use. These are practical starting points; confirm what is in stock when you enquire.',
        sections: [
          { id: 'types', h2: 'Hand grade and machine grade',
            table: { head: ['Type', 'Typical micron', 'Typical width', 'Used for'], rows: [
              ['Hand grade', '17–25', '250–500 mm', 'Cartons, bundles and small pallets wrapped by hand'],
              ['Machine grade', '20–30', 'About 500 mm', 'Pallet wrapping machines']
            ] } },
          { id: 'load', h2: 'Which micron for which load',
            ul: [
              'Light cartons and bundles: 17–20 micron by hand is usually enough.',
              'Medium loads and standard pallets: 20–25 micron.',
              'Heavy or sharp-edged loads: 25–30 micron, or more wraps, ideally with a machine.',
              'Add edge guards at the corners of heavy loads so the film does not cut through.'
            ] },
          { id: 'length', h2: 'How long is a roll?',
            p: ['Length in metres = weight (kg) × 1,000,000 ÷ (width in m × micron × 920). Stretch film is about 920 kg per cubic metre.',
                'Example: a 2.5 kg net roll of 500 mm, 20 micron film holds about 270 m. The same weight of 17 micron film gives about 320 m, because thinner film means more metres per kg.'] },
          { id: 'compare', h2: 'How to compare prices properly',
            ul: [
              'Do not compare only the price per kg. Thinner film costs less per kg but gives more metres.',
              'Compare the cost per roll or per metre at the same width and micron.',
              'Check the net weight of the film, not the gross weight with the core.',
              'Black film hides the contents and blocks light. Clear film makes labels easy to scan.'
            ] },
          { id: 'tips', h2: 'Wrapping tips',
            ul: [
              'Start the film on the base of the pallet so it grips the load.',
              'Overlap each turn by about half, and wrap the top to lock the load.',
              'Tell us your pallet size and we will estimate how many rolls you need.'
            ] }
        ],
        faqs: [
          { q: 'What is the difference between 17 and 23 micron film?', a: 'Thicker film is stronger and more puncture resistant, but each kg gives fewer metres. 17 micron suits light cartons. Use 23 micron or more for heavy or sharp loads.' },
          { q: 'Can I use hand film on a machine?', a: 'Machine film is made for the speed and stretch of the machine. Use machine grade there, and hand grade for manual wrapping.' },
          { q: 'Do you supply film in a custom width?', a: 'Yes, custom widths are available on request. Tell us the width, micron and quantity.' }
        ]
      }
    }
  },

  js: {
    form: { name: 'Please enter your name.', phone: 'Please enter a valid 10-digit phone number.', product: 'Please select a product.' },
    basket: {
      title: 'Enquiry list', empty: 'Your list is empty.', emptyHint: 'Add products from the catalogue, tools or product pages, then send everything in one WhatsApp message.',
      browse: 'Browse products', remove: 'Remove', close: 'Close', clear: 'Clear list', clearConfirm: 'Remove all items from your enquiry list?',
      yourName: 'Your name', yourNamePh: 'Your name', city: 'Delivery city / pincode', cityPh: 'e.g. Jaipur 302001',
      noteLabel: 'Note for this item', notePh: 'Quantity, size or anything else',
      send: 'Send on WhatsApp', mail: 'Send by email', copy: 'Copy message', copied: 'Message copied.',
      added: 'Added to enquiry list', addedMany: 'Added {n} items to enquiry list', view: 'View list', items: '{n} items', item: '1 item',
      itemFallback: 'Custom item', status: 'Items in your enquiry list: {n}', emptySend: 'Add at least one item first.'
    },
    qb: { edited: 'You edited the message. Press Reset to refresh it from the form.', reset: 'Message reset from the form.', copied: 'Message copied.', added: 'Added to your enquiry list.' },
    tools: { waWeight: 'Hi, I would like a quote. I used the weight calculator:', waFit: 'Hi, I would like a quote. I used the cut-to-size checker:', waThick: 'Hi, I need advice on PVC sheet thickness for this job:', copied: 'Copied.' }
  }
};
