/* Electrical Insulation India — product catalogue (English source data, read by build/build.js)
   Specs are indicative (compiled from Indian trade listings / manufacturer sheets);
   edit freely to match your actual stock. */
module.exports = (function () {
  // approx weight of a 1220 x 2440 mm PVC sheet at ~1.35 g/cm3
  function pvcWeight(t) { return (1.22 * 2.44 * t * 1.35).toFixed(1) + ' kg'; }
  var pvcThick = [1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 20];

  var PRODUCTS = {
    'pvc-sheets': {
      name: 'Rigid PVC Sheet',
      image: 'pvc-sheets',
      tagline: 'Solid grey PVC sheets for electrical insulation, panels, linings and fabrication.',
      highlights: ['1–20 mm thickness', '1220 × 2440 mm', 'Test certificate on request'],
      overview: [
        'Rigid (unplasticised) PVC sheet is a tough, flat, easy-to-fabricate board widely used by panel makers, electrical contractors and OEMs. It is a good electrical insulator, resists many chemicals and does not rust.',
        'We stock the common thicknesses in the standard 4 × 8 ft sheet and can cut to your size, so you receive material ready for the shop floor.'
      ],
      specs: [
        ['Material', 'Rigid (unplasticised) PVC, solid sheet'],
        ['Thickness', '1 mm to 20 mm (other thickness on request)'],
        ['Standard sheet size', '1220 × 2440 mm (4 × 8 ft); 1000 × 2000 mm and cut sizes on request'],
        ['Colour', 'Grey (standard); white / black on request'],
        ['Density', 'approx. 1.25 – 1.40 g/cm³ (grade dependent)'],
        ['Fabrication', 'Cut, drill, machine, bend (heated) and solvent / weld joint'],
        ['Electrical', 'Good insulator — share voltage / standard (IS / IEC) and we confirm the grade'],
        ['Service temperature', 'General indoor use, up to about 60 °C']
      ],
      sizesTitle: 'Thickness & approximate sheet weight',
      sizesHead: ['Thickness', 'Standard sheet', 'Approx. weight / sheet*'],
      sizes: pvcThick.map(function (t) { return [t + ' mm', '1220 × 2440 mm', pvcWeight(t)]; }),
      sizesNote: '*Approximate, calculated at 1.35 g/cm³. Actual weight varies by grade.',
      applications: ['Switch panels & control panel barriers', 'Meter boxes and spacer plates', 'Insulation gaskets & packing plates', 'Machine guards and covers', 'Chemical tank linings & fabrication', 'Signage, partitions and displays'],
      features: ['Good electrical insulation', 'Chemical & moisture resistant', 'Easy to cut, drill and machine', 'Smooth, uniform surface', 'Light compared with metal; no rusting'],
      packing: ['Sheets stacked and wrapped; edge-protected for transit', 'Dispatch by road transport across India', 'GST invoice and LR copy with every order'],
      faqs: [
        ['Which thickness should I choose for an insulation panel?', 'It depends on voltage, load and mounting. Common panel barriers use 3–10 mm. Tell us the application and we will suggest the thickness.'],
        ['Can you give a test certificate?', 'Test certificate / material details can be arranged on request. Mention it in your enquiry.']
      ],
      fields: [
        { id: 'Thickness', type: 'select', options: ['1 mm', '2 mm', '3 mm', '4 mm', '5 mm', '6 mm', '8 mm', '10 mm', '12 mm', '15 mm', '20 mm', 'Other (write in notes)'] },
        { id: 'Sheet size', type: 'select', options: ['1220 × 2440 mm (4 × 8 ft)', '1000 × 2000 mm', 'Cut-to-size (write sizes in notes)'] },
        { id: 'Colour', type: 'select', options: ['Grey', 'White', 'Black', 'Other'] },
        { id: 'Quantity', type: 'text', placeholder: 'e.g. 50 sheets' },
        { id: 'Use / application', type: 'text', placeholder: 'e.g. switch panel insulation' }
      ],
      related: ['cut-to-size', 'edge-guard', 'stretch-film']
    },

    'cut-to-size': {
      name: 'Cut-to-Size PVC Panels',
      image: 'cut-to-size',
      tagline: 'PVC sheets cut exactly to your drawing — less wastage, ready to fit.',
      highlights: ['Cut as per drawing', 'Less wastage', 'Bulk & small orders'],
      overview: [
        'Instead of buying full sheets and cutting in-house, send us your sizes or drawing. We cut the PVC to your dimensions so panels arrive ready to drill and assemble.',
        'Ideal for switchgear fabricators, panel builders and OEMs who reorder the same parts regularly.'
      ],
      specs: [
        ['Material', 'Rigid PVC sheet, 1 – 20 mm'],
        ['Input we need', 'Drawing / sketch / photo with dimensions, thickness and quantity'],
        ['Sizes', 'Any size within the 1220 × 2440 mm sheet'],
        ['Holes & cut-outs', 'Ask us — feasibility depends on the drawing'],
        ['Repeat orders', 'We keep your part sizes on file for quick re-quotes'],
        ['Tolerance', 'Share your requirement; we confirm before cutting']
      ],
      sizesTitle: 'How cut-to-size works',
      sizesHead: ['Step', 'What you do', 'What we do'],
      sizes: [
        ['1', 'Send sizes / drawing on WhatsApp', 'Check feasibility and thickness'],
        ['2', 'Confirm quantity & city', 'Share price, freight and timeline'],
        ['3', 'Approve the quote', 'Cut, pack and label'],
        ['4', 'Receive the material', 'Dispatch with GST invoice & LR']
      ],
      sizesNote: '',
      applications: ['Panel insulation plates', 'Spacer and packing plates', 'Machine guards and covers', 'Gaskets and shims', 'Fixture and jig plates'],
      features: ['Saves wastage and shop-floor time', 'Consistent sizes on repeat orders', 'Single invoice with other materials', 'Quick WhatsApp quoting'],
      packing: ['Cut pieces stacked, protected and labelled', 'Road dispatch across India', 'GST invoice and LR copy'],
      faqs: [
        ['What is the minimum quantity for cut sizes?', 'We accept both small and bulk orders. Send your list and we will quote.'],
        ['Can I send a hand sketch?', 'Yes — a clear sketch or photo with dimensions is enough to start.']
      ],
      fields: [
        { id: 'Thickness', type: 'select', options: ['1 mm', '2 mm', '3 mm', '4 mm', '5 mm', '6 mm', '8 mm', '10 mm', '12 mm', '15 mm', '20 mm'] },
        { id: 'Cut size 1 (L × W mm)', type: 'text', placeholder: 'e.g. 600 × 400 mm — 20 pcs' },
        { id: 'Cut size 2 (L × W mm)', type: 'text', placeholder: 'optional' },
        { id: 'Holes / cut-outs', type: 'select', options: ['No', 'Yes (will send drawing)'] },
        { id: 'Colour', type: 'select', options: ['Grey', 'White', 'Black', 'Other'] }
      ],
      related: ['pvc-sheets', 'edge-guard', 'foam']
    },

    'stretch-film': {
      name: 'Stretch Film',
      image: 'stretch-film',
      tagline: 'Hand and machine grade stretch wrap for pallets, cartons and bundles.',
      highlights: ['Hand & machine grade', '3 inch (76 mm) core', 'Clear & black'],
      overview: [
        'Stretch film holds pallets and cartons together and protects them from dust and moisture during storage and transit. We supply both hand-wrap rolls and machine-grade rolls for pallet wrappers.',
        'Bulk orders are priced per kg, so you pay for film — not for guesswork. Tell us the width, micron and quantity.'
      ],
      specs: [
        ['Material', 'LLDPE cast stretch film'],
        ['Grades', 'Hand grade (approx. 300–450 mm wide) and machine grade (approx. 500 mm wide)'],
        ['Thickness', 'Roughly 17 – 30 micron (ask for the exact micron in stock)'],
        ['Core', '3 inch (76 mm) paper core'],
        ['Colour', 'Clear (standard) and black'],
        ['Roll weight', 'Hand rolls approx. 2 – 5 kg; machine rolls approx. 13 – 15 kg gross'],
        ['Pricing', 'Per kg for bulk orders']
      ],
      sizesTitle: 'Common sizes',
      sizesHead: ['Type', 'Width', 'Core', 'Used for'],
      sizes: [
        ['Hand grade', '300 – 450 mm (12 – 18 in)', '76 mm', 'Manual wrapping of cartons & pallets'],
        ['Machine grade', '500 mm (20 in)', '76 mm', 'Pallet wrapping machines'],
        ['Custom width', '150 – 1000 mm', '76 mm', 'On request']
      ],
      sizesNote: 'Exact micron and roll length depend on stock — message us your requirement.',
      applications: ['Pallet wrapping for dispatch', 'Bundling cartons and sheets', 'Dust and moisture protection', 'Furniture and appliance wrapping', 'Securing loose items'],
      features: ['Good cling and puncture resistance', 'Transparent for easy identification', 'Available in clear and black', 'Machine and hand options'],
      packing: ['Rolls shrink-wrapped / boxed in bulk', 'Dispatch by road across India', 'GST invoice and LR copy'],
      faqs: [
        ['What is the difference between hand and machine grade?', 'Hand-grade rolls are narrower and lighter for manual wrapping. Machine-grade rolls are wider with more film for pallet wrapping machines.'],
        ['How much film do I need per pallet?', 'It depends on load and number of wraps — tell us your pallet size and we will estimate the rolls required.']
      ],
      fields: [
        { id: 'Grade', type: 'select', options: ['Hand grade', 'Machine grade', 'Not sure'] },
        { id: 'Width', type: 'select', options: ['300 mm', '450 mm', '500 mm', 'Other (write in notes)'] },
        { id: 'Micron', type: 'select', options: ['17', '20', '23', '25', '29', 'Suggest for me'] },
        { id: 'Colour', type: 'select', options: ['Clear', 'Black'] },
        { id: 'Quantity', type: 'text', placeholder: 'e.g. 200 kg / 50 rolls' }
      ],
      related: ['bopp-tape', 'strapping', 'bubble-wrap']
    },

    'bopp-tape': {
      name: 'BOPP Packing Tape',
      image: 'bopp-tape',
      tagline: 'Strong-adhesion carton sealing tape — clear, brown or printed with your logo.',
      highlights: ['24 / 36 / 48 / 72 mm', '50 & 65 m rolls', 'Custom print available'],
      overview: [
        'BOPP (biaxially oriented polypropylene) tape with acrylic adhesive seals cartons quickly and holds in warehouse conditions. We supply plain clear and brown tape, and custom-printed tape for branding.',
        'Buy by the dozen or by the master carton.'
      ],
      specs: [
        ['Material', 'BOPP film with acrylic adhesive'],
        ['Widths', '24 mm (1 in), 36 mm, 48 mm (2 in), 72 mm (3 in); other widths on request'],
        ['Roll length', '50 m and 65 m common; long jumbo rolls on request'],
        ['Thickness', 'Typically 40 – 50 micron (total)'],
        ['Core', '3 inch core'],
        ['Colours', 'Clear, brown; coloured / printed on request'],
        ['Carton pack', 'Roughly 36 – 72 rolls per carton depending on width']
      ],
      sizesTitle: 'Popular tape sizes',
      sizesHead: ['Width', 'Length', 'Colour', 'Use'],
      sizes: [
        ['24 mm (1 in)', '50 / 65 m', 'Clear, brown', 'Light cartons, labels'],
        ['36 mm', '50 / 65 m', 'Clear, brown', 'Small boxes'],
        ['48 mm (2 in)', '50 / 65 m', 'Clear, brown, printed', 'Standard carton sealing'],
        ['72 mm (3 in)', '50 / 65 m', 'Clear, brown, printed', 'Heavy cartons'],
        ['Jumbo', 'up to 650 m', 'Clear, brown', 'Machine taping']
      ],
      sizesNote: 'Availability varies — confirm width, length and micron when you enquire.',
      applications: ['Carton sealing', 'E-commerce and courier packing', 'Warehouse dispatch', 'Branded packaging', 'Masking and bundling'],
      features: ['Strong, quiet unwind', 'Good adhesion on cartons', 'Moisture resistant', 'Logo printing for bulk orders'],
      packing: ['Rolls shrink-wrapped, packed in cartons', 'Master-carton and dozen pricing', 'Dispatch by road; GST invoice and LR copy'],
      faqs: [
        ['Can you print my logo on tape?', 'Yes. Share your artwork — we will confirm minimum quantity and lead time.'],
        ['Which width should I buy for normal cartons?', '48 mm (2 inch) is the most common. Use 72 mm (3 inch) for heavy boxes.']
      ],
      fields: [
        { id: 'Width', type: 'select', options: ['24 mm', '36 mm', '48 mm (2 in)', '72 mm (3 in)', 'Other (write in notes)'] },
        { id: 'Length', type: 'select', options: ['50 m', '65 m', 'Jumbo (specify in notes)'] },
        { id: 'Colour', type: 'select', options: ['Clear', 'Brown', 'Printed (logo)', 'Other colour'] },
        { id: 'Quantity', type: 'text', placeholder: 'e.g. 5 cartons / 360 rolls' }
      ],
      related: ['stretch-film', 'strapping', 'bubble-wrap']
    },

    'bubble-wrap': {
      name: 'Air Bubble Wrap',
      image: 'bubble-wrap',
      tagline: 'Cushioning bubble rolls for fragile electricals, glass and appliances.',
      highlights: ['1 – 1.5 m width', '50 & 100 m rolls', '30 – 50 GSM'],
      overview: [
        'Air bubble film absorbs shock and prevents scratches on fragile goods during handling and transport. It is light, clean and quick to wrap.',
        'Choose the width, GSM and bubble size for your product — we also cut rolls on request.'
      ],
      specs: [
        ['Material', 'Polyethylene air bubble film'],
        ['Widths', '1 m, 1.2 m, 1.5 m (cut rolls on request)'],
        ['Roll length', '50 m and 100 m'],
        ['Weight (GSM)', 'About 30 – 50 GSM'],
        ['Bubble size', '6 mm, 8 mm or 10 mm'],
        ['Layers', 'Single and double layer on request'],
        ['Colour', 'Transparent']
      ],
      sizesTitle: 'Common roll sizes',
      sizesHead: ['Width', 'Length', 'GSM', 'Bubble'],
      sizes: [
        ['1.0 m', '50 m / 100 m', '30 – 40', '6 – 10 mm'],
        ['1.2 m', '50 m / 100 m', '30 – 50', '6 – 10 mm'],
        ['1.5 m', '100 m', '40 – 50', '6 – 10 mm']
      ],
      sizesNote: 'Heavier GSM and larger bubbles give more cushioning for heavy items.',
      applications: ['Electrical items & instruments', 'Glassware and ceramics', 'Appliances and furniture', 'Courier & e-commerce packing', 'Wrapping sheets and panels'],
      features: ['Lightweight cushioning', 'Reduces scratches and shocks', 'Easy to cut and wrap', 'Moisture resistant'],
      packing: ['Rolls wrapped in plastic bags', 'Cut rolls available', 'Dispatch by road; GST invoice and LR copy'],
      faqs: [
        ['Single or double layer?', 'Single layer suits light items. Double layer or higher GSM is better for heavy or very fragile goods.'],
        ['Can I buy a part roll?', 'Yes, cut rolls are available — tell us the length and width.']
      ],
      fields: [
        { id: 'Width', type: 'select', options: ['1 m', '1.2 m', '1.5 m'] },
        { id: 'Length', type: 'select', options: ['50 m', '100 m', 'Cut roll (write in notes)'] },
        { id: 'GSM', type: 'select', options: ['30', '40', '50', 'Suggest for me'] },
        { id: 'Bubble size', type: 'select', options: ['6 mm', '8 mm', '10 mm', 'Suggest for me'] },
        { id: 'Quantity', type: 'text', placeholder: 'e.g. 20 rolls' }
      ],
      related: ['foam', 'edge-guard', 'stretch-film']
    },

    'strapping': {
      name: 'PP Strapping & Accessories',
      image: 'strapping',
      tagline: 'PP strapping rolls, clips and sealers to finish the pack securely.',
      highlights: ['9 – 19 mm widths', 'Machine & semi-auto', 'Clips & sealers'],
      overview: [
        'Polypropylene strapping bundles cartons, sheets and pallets securely and is much lighter and safer to handle than steel strap. We supply rolls in different widths and colours, plus the clips and sealers to fasten them.',
        'Tell us your load and strapping method (machine, semi-automatic or hand tool) and we will recommend the width and thickness.'
      ],
      specs: [
        ['Material', 'Polypropylene (PP) strap'],
        ['Widths', '9 mm, 12 mm, 15 mm, 19 mm'],
        ['Thickness', 'About 0.5 – 1.0 mm (0.6 – 0.8 mm typical)'],
        ['Colours', 'White, black, red, blue, green and others'],
        ['Roll length', 'Typically 1000 – 2000 m'],
        ['Break strength', 'Roughly 80 – 190 kg depending on width and thickness — confirm for your load'],
        ['Grades', 'Machine grade, semi-automatic grade'],
        ['Accessories', 'Metal / plastic clips, sealers, tensioners, edge guards']
      ],
      sizesTitle: 'Which width to use',
      sizesHead: ['Width', 'Typical use'],
      sizes: [
        ['9 mm', 'Light cartons and small bundles'],
        ['12 mm', 'General carton strapping (machine / semi-auto)'],
        ['15 mm', 'Heavier cartons and bundles'],
        ['19 mm', 'Heavy bundles and pallet strapping']
      ],
      sizesNote: 'Exact break strength and roll weight vary by make — ask us for the current stock.',
      applications: ['Carton and bale strapping', 'Pallet unitising', 'Sheet and pipe bundling', 'Newspaper & textile bundles', 'Dispatch packing'],
      features: ['Strong and flexible', 'Safer than steel strap', 'Suits machines and hand tools', 'Colour-coding for identification'],
      packing: ['Rolls supplied on cores', 'Clips and sealers by the box', 'Dispatch by road; GST invoice and LR copy'],
      faqs: [
        ['Do you supply the clips and tools too?', 'Clips and sealers are available. Tell us your strapping method and we will suggest the right set.'],
        ['PP or PET strap?', 'PP is economical for carton and bundle strapping. For heavier loads ask us about stronger options.']
      ],
      fields: [
        { id: 'Width', type: 'select', options: ['9 mm', '12 mm', '15 mm', '19 mm', 'Other (write in notes)'] },
        { id: 'Method', type: 'select', options: ['Machine', 'Semi-automatic', 'Hand tool', 'Not sure'] },
        { id: 'Colour', type: 'select', options: ['White', 'Black', 'Red', 'Blue', 'Green', 'Any'] },
        { id: 'Accessories', type: 'select', options: ['None', 'Clips', 'Sealers', 'Clips + sealers'] },
        { id: 'Quantity', type: 'text', placeholder: 'e.g. 20 rolls / 500 kg' }
      ],
      related: ['bopp-tape', 'edge-guard', 'stretch-film']
    },

    'foam': {
      name: 'EPE Foam Sheets & Rolls',
      image: 'foam',
      tagline: 'Expanded polyethylene foam for protective packaging and surface protection.',
      highlights: ['1 – 50 mm thickness', 'Rolls & sheets', 'Cut to size'],
      overview: [
        'EPE (expanded polyethylene) foam is a soft, light, shock-absorbing material used to protect products from scratches and impact. It is clean, non-abrasive and easy to cut and shape.',
        'Thin foam comes in rolls; thicker foam in sheets. We can supply cut pieces for inserts and corners.'
      ],
      specs: [
        ['Material', 'Expanded polyethylene (EPE) foam'],
        ['Thickness', 'About 1 mm to 50 mm (rolls up to roughly 12 mm; thicker as sheets)'],
        ['Density', 'Typically 25 – 50 kg/m³ (other densities on request)'],
        ['Width', 'Around 1000 – 1500 mm'],
        ['Roll length', 'Up to about 100 m; custom lengths on request'],
        ['Colour', 'White (standard); pink / black on request'],
        ['Form', 'Rolls, sheets, cut pieces']
      ],
      sizesTitle: 'Forms & thickness',
      sizesHead: ['Form', 'Thickness', 'Width', 'Length'],
      sizes: [
        ['Roll', '1 – 12 mm', '1000 – 1500 mm', 'up to ~100 m'],
        ['Sheet', '12 – 50 mm', '1000 – 1200 mm', 'about 2 m'],
        ['Cut pieces', 'As required', 'As required', 'As required']
      ],
      applications: ['Wrapping electrical & electronic items', 'Surface and glass protection', 'Furniture and appliance corners', 'Box inserts and liners', 'Cushioning for fragile goods'],
      features: ['Excellent shock absorption', 'Very light', 'Water and chemical resistant', 'Soft, non-scratch surface'],
      packing: ['Rolls wrapped in poly bags', 'Sheets bundled', 'Dispatch by road; GST invoice and LR copy'],
      faqs: [
        ['What thickness is right for my product?', 'Thin (1–5 mm) for surface protection; thicker (10 mm+) for impact cushioning. Share the product and we will suggest.'],
        ['Can you cut foam to inserts?', 'Cut pieces are available — send the sizes and quantity.']
      ],
      fields: [
        { id: 'Form', type: 'select', options: ['Roll', 'Sheet', 'Cut pieces'] },
        { id: 'Thickness', type: 'text', placeholder: 'e.g. 5 mm' },
        { id: 'Width', type: 'select', options: ['1000 mm', '1200 mm', '1500 mm', 'Other (write in notes)'] },
        { id: 'Density', type: 'select', options: ['25 kg/m³', '30 kg/m³', '35–50 kg/m³', 'Suggest for me'] },
        { id: 'Quantity', type: 'text', placeholder: 'e.g. 10 rolls / 50 sheets' }
      ],
      related: ['bubble-wrap', 'edge-guard', 'stretch-film']
    },

    'edge-guard': {
      name: 'Edge & Corner Guards',
      image: 'edge-guard',
      tagline: 'L-shaped protectors that guard edges and corners of cartons, panels and pallets.',
      highlights: ['Corner protection', 'Length as required', 'Use with strapping'],
      overview: [
        'Edge and corner guards stop strapping from cutting into cartons and protect sharp corners of panels, furniture and pallet loads during transit.',
        'Available lengths and thickness depend on your load — tell us what you are packing and we will advise.'
      ],
      specs: [
        ['Type', 'L-shaped edge / angle protectors'],
        ['Material', 'Board / paper-based and plastic options — tell us your need'],
        ['Size & length', 'As per requirement (indicative; ask for current stock)'],
        ['Use with', 'PP strapping, stretch film and BOPP tape'],
        ['Order', 'Small and bulk quantities']
      ],
      sizesTitle: 'How to choose',
      sizesHead: ['Load', 'Suggested protection'],
      sizes: [
        ['Cartons / light boxes', 'Light edge guards with 12 mm strap'],
        ['Heavy cartons / bundles', 'Stronger edge guards with 15 – 19 mm strap'],
        ['Pallet loads', 'Corner guards on all four edges plus stretch film']
      ],
      sizesNote: 'Sizes are indicative — message us your requirement for exact options.',
      applications: ['Pallet corner protection', 'Carton strapping', 'Furniture and panel transport', 'Glass and sheet packing'],
      features: ['Prevents strap cut-in', 'Protects sharp edges', 'Spreads strapping pressure', 'Light and easy to use'],
      packing: ['Bundled by quantity', 'Dispatch by road; GST invoice and LR copy'],
      faqs: [
        ['Can you supply with strapping and film?', 'Yes — everything on one invoice and one delivery.']
      ],
      fields: [
        { id: 'Material', type: 'select', options: ['Board / paper', 'Plastic', 'Suggest for me'] },
        { id: 'Size / length', type: 'text', placeholder: 'e.g. 35 × 35 × 3 mm, 1 m long' },
        { id: 'Quantity', type: 'text', placeholder: 'e.g. 500 pcs' },
        { id: 'Use', type: 'text', placeholder: 'e.g. pallet corners' }
      ],
      related: ['strapping', 'foam', 'stretch-film']
    }
  };
  return PRODUCTS;
})();
