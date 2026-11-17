/*
  Beracah Impex product catalogue.
  Edit this file to add, remove or update products. Each product appears automatically
  on the home page, the products page, its own detail page and the quote basket.

  Specifications below are typical industry values used as a starting point.
  Replace them with Beracah Impex's confirmed specifications before launch.
*/
window.DIVISIONS = {
  food:  { name: "Food & bakery raw materials", short: "Food & bakery" },
  build: { name: "Construction & building materials", short: "Construction" },
  chem:  { name: "Industrial inputs & chemicals", short: "Industrial inputs" },
  auto:  { name: "Automotive & fleet supplies", short: "Automotive & fleet" }
};

window.PRODUCTS = [
  /* ---------------- Food & bakery ---------------- */
  {
    id: "alkalized-cocoa-powder", division: "food", sym: "Ac", hs: "1805.00",
    name: "Alkalized cocoa powder",
    summary: "Dark, rich cocoa powder for bakery, confectionery and chocolate drinks.",
    description: "Dutch-processed cocoa powder with a deep colour and smooth, rounded flavour. A staple for biscuit, cake and chocolate beverage manufacturers who need consistent colour from batch to batch.",
    origin: "Indonesia, India",
    packaging: "25 kg multi-wall paper bags with PE liner",
    moq: "1 × 20ft container",
    specs: { "Fat content": "10–12%", "pH": "7.0–8.2", "Colour": "Dark brown to reddish brown", "Fineness": "Min. 99% through 200 mesh", "Moisture": "Max. 5%" },
    uses: ["Biscuits & cakes", "Confectionery", "Chocolate drinks", "Ice cream"]
  },
  {
    id: "natural-cocoa-powder", division: "food", sym: "Nc", hs: "1805.00",
    name: "Natural cocoa powder",
    summary: "Light, fruity cocoa powder that works with baking soda leavening.",
    description: "Non-alkalized cocoa powder with a lighter colour and a brighter, slightly acidic chocolate taste. Preferred for recipes leavened with baking soda and for cost-sensitive bakery lines.",
    origin: "Indonesia",
    packaging: "25 kg multi-wall paper bags with PE liner",
    moq: "1 × 20ft container",
    specs: { "Fat content": "10–12%", "pH": "5.0–5.8", "Colour": "Light brown", "Fineness": "Min. 99% through 200 mesh", "Moisture": "Max. 5%" },
    uses: ["Cakes", "Biscuits", "Fillings", "Beverage blends"]
  },
  {
    id: "vegetable-shortening", division: "food", sym: "Vs", hs: "1517.90",
    name: "Vegetable shortening",
    summary: "Palm-based all-purpose shortening for bread, biscuits and frying.",
    description: "Refined, bleached and deodorized palm-based shortening with a neutral taste and good creaming properties. Suitable for bread, biscuits, pastries and deep frying.",
    origin: "Indonesia, India",
    packaging: "15 kg or 20 kg cartons",
    moq: "1 × 20ft container",
    specs: { "Base oil": "Refined palm oil and fractions", "Slip melting point": "38–42 °C", "Free fatty acid": "Max. 0.1%", "Flavour": "Neutral" },
    uses: ["Bread", "Biscuits", "Pastries", "Frying"]
  },
  {
    id: "specialty-bakery-fats", division: "food", sym: "Sf", hs: "1517.90",
    name: "Specialty bakery fats",
    summary: "Cake margarine, pastry fats and cocoa butter substitutes.",
    description: "Functional fats formulated for specific applications: cake margarine for volume and softness, laminating fats for puff pastry and croissants, and cocoa butter substitutes for compound chocolate and coatings.",
    origin: "Indonesia",
    packaging: "10–25 kg cartons",
    moq: "1 × 20ft container (mixed grades possible)",
    specs: { "Grades": "Cake margarine, puff pastry fat, CBS / CBE", "Base": "Palm and palm kernel fractions", "Storage": "Cool, dry place below 25 °C" },
    uses: ["Cakes", "Laminated dough", "Compound chocolate", "Cream fillings"]
  },
  {
    id: "desiccated-coconut", division: "food", sym: "Dc", hs: "0801.11",
    name: "Desiccated coconut",
    summary: "Fine and medium grade dried coconut for bakery and confectionery.",
    description: "Dried, shredded white coconut meat with a fresh, sweet flavour. Available in fine and medium cuts, in high-fat and low-fat grades.",
    origin: "Indonesia, India",
    packaging: "25 kg kraft paper bags with PE liner",
    moq: "1 × 20ft container",
    specs: { "Grades": "Fine, medium; high-fat or low-fat", "Fat content (high-fat)": "60–65%", "Moisture": "Max. 3%", "Colour": "Natural white" },
    uses: ["Biscuits", "Confectionery", "Toppings", "Fillings"]
  },
  {
    id: "industrial-food-flavours", division: "food", sym: "Ff", hs: "3302.10",
    name: "Industrial food flavours",
    summary: "Heat-stable flavours in liquid, powder and emulsion form.",
    description: "Food-grade flavours for bakery, dairy, beverage and confectionery production, including bake-stable grades that hold their profile through high oven temperatures.",
    origin: "India, China",
    packaging: "1 kg, 5 kg and 25 kg containers",
    moq: "Mixed pallet",
    specs: { "Forms": "Liquid, powder, emulsion", "Profiles": "Vanilla, butter, milk, chocolate, strawberry, citrus and more", "Grade": "Food grade, heat-stable options" },
    uses: ["Bakery", "Dairy", "Beverages", "Confectionery"]
  },
  {
    id: "vanilla-essentials", division: "food", sym: "Va", hs: "2912.41",
    name: "Vanilla essentials",
    summary: "Vanillin, ethyl vanillin and vanilla flavour preparations.",
    description: "The most widely used flavour in bakery, supplied as pure vanillin crystals, stronger ethyl vanillin, or ready-to-use vanilla flavour powders and liquids.",
    origin: "China, India",
    packaging: "25 kg fibre drums; 1 kg tins",
    moq: "Mixed pallet",
    specs: { "Products": "Vanillin, ethyl vanillin, vanilla powder, vanilla liquid", "Vanillin purity": "Min. 99.5%", "Appearance": "White to slightly yellow crystals" },
    uses: ["Cakes", "Biscuits", "Ice cream", "Beverages"]
  },
  {
    id: "food-colourants", division: "food", sym: "Fc", hs: "3204.19",
    name: "Food colourants",
    summary: "Water-soluble colours, lakes and natural colour options.",
    description: "Approved food colours for consistent, vibrant products, from synthetic water-soluble powders to lakes for fat-based systems and natural colour alternatives.",
    origin: "India, China",
    packaging: "1 kg, 5 kg and 25 kg packs",
    moq: "Mixed pallet",
    specs: { "Types": "Water-soluble powders, lake colours, natural colours", "Shades": "Yellow, orange, red, blue, green, brown, black", "Grade": "Food grade" },
    uses: ["Confectionery", "Beverages", "Bakery decoration", "Snacks"]
  },

  /* ---------------- Construction ---------------- */
  {
    id: "porcelain-tiles", division: "build", sym: "Pt", hs: "6907.21",
    name: "Porcelain tiles",
    summary: "Specification-grade porcelain tiles in large formats.",
    description: "Dense, low-absorption porcelain tiles for floors and walls in residential, commercial and institutional projects. Available in polished, matt and glazed finishes.",
    origin: "India, China",
    packaging: "Cartons on fumigated wooden pallets",
    moq: "1 × 20ft container",
    specs: { "Sizes": "60×60, 60×120, 80×80 cm", "Finishes": "Polished, matt, glazed", "Water absorption": "≤ 0.5%", "Thickness": "9–10 mm" },
    uses: ["Floors", "Walls", "Commercial projects", "Hotels"]
  },
  {
    id: "ceramic-tiles", division: "build", sym: "Ct", hs: "6907.22",
    name: "Ceramic wall and floor tiles",
    summary: "Glazed ceramic tiles for housing and commercial projects.",
    description: "Cost-effective glazed ceramic tiles for walls and floors, with a wide choice of designs for bathrooms, kitchens and general areas.",
    origin: "India, China",
    packaging: "Cartons on pallets",
    moq: "1 × 20ft container",
    specs: { "Sizes": "30×30, 30×60, 40×40 cm", "Finishes": "Glossy, matt, rustic", "Application": "Wall and floor" },
    uses: ["Housing projects", "Bathrooms", "Kitchens", "Offices"]
  },
  {
    id: "industrial-fasteners", division: "build", sym: "Fa", hs: "7318.15",
    name: "Industrial fasteners",
    summary: "Bolts, nuts, screws, anchors and washers to DIN and ISO standards.",
    description: "High-strength and general-purpose fasteners for construction, steel structures and machinery, with zinc-plated, hot-dip galvanized and stainless finishes.",
    origin: "China, India",
    packaging: "Cartons on pallets, or bulk bags",
    moq: "Mixed container",
    specs: { "Range": "Hex bolts, nuts, screws, anchors, washers, threaded rods", "Grades": "4.8, 8.8, 10.9; A2 / A4 stainless", "Finishes": "Zinc-plated, HDG, plain", "Standards": "DIN, ISO, ASTM" },
    uses: ["Steel structures", "Construction", "Machinery", "Maintenance"]
  },
  {
    id: "construction-hardware", division: "build", sym: "Hw", hs: "8302.41",
    name: "Construction hardware",
    summary: "Door and window hardware, tools, nails and wire products.",
    description: "Everyday building hardware for contractors and distributors: hinges, locks and handles, hand tools, nails, binding wire and wire mesh.",
    origin: "China",
    packaging: "Cartons on pallets",
    moq: "Mixed container",
    specs: { "Range": "Hinges, locks, handles, hand tools, nails, binding wire, mesh", "Finishes": "Various, to order" },
    uses: ["Contractors", "Hardware distributors", "Fit-out", "Maintenance"]
  },
  {
    id: "plumbing-civil-supplies", division: "build", sym: "Pl", hs: "3917.40",
    name: "Plumbing and civil supplies",
    summary: "PPR and uPVC pipes and fittings, valves, taps and drainage.",
    description: "Plumbing and civil engineering supplies for residential and infrastructure projects, from pressure pipes and fittings to valves, sanitary taps and drainage products.",
    origin: "China, India, UAE",
    packaging: "Bundles, cartons and pallets",
    moq: "Mixed container",
    specs: { "Range": "PPR, uPVC and HDPE pipes and fittings; valves; taps and mixers; GI fittings; drainage", "Sizes": "20–110 mm and above, to order", "Pressure ratings": "PN10–PN25" },
    uses: ["Housing", "Commercial buildings", "Water supply", "Drainage"]
  },

  /* ---------------- Industrial inputs ---------------- */
  {
    id: "extra-neutral-alcohol", division: "chem", sym: "En", hs: "2207.10",
    name: "Extra Neutral Alcohol (ENA 96%)",
    summary: "High-purity ethanol for licensed industrial and beverage producers.",
    description: "Extra Neutral Alcohol of at least 96% v/v, triple-distilled for purity. Supplied only to licensed buyers, with documentation prepared to the destination country's import regulations.",
    origin: "India",
    packaging: "Flexitanks, ISO tanks or 200 L drums",
    moq: "1 × 20ft flexitank",
    specs: { "Ethanol content": "Min. 96% v/v", "Grade": "Extra neutral", "Appearance": "Clear, colourless liquid", "Methanol": "Within international limits" },
    uses: ["Licensed beverage production", "Pharmaceuticals", "Cosmetics", "Flavour extraction"],
    note: "Supplied to licensed buyers only. Import permits are required in most destination countries."
  },
  {
    id: "industrial-solvents", division: "chem", sym: "Sv", hs: "2902.30",
    name: "Industrial solvents and raw materials",
    summary: "Aromatic and alcohol-based solvents for paints, inks and manufacturing.",
    description: "Industrial-grade chemical raw materials and solvents such as toluene, xylene and isopropyl alcohol, for paint, ink, adhesive and cleaning product manufacturers.",
    origin: "India, China, UAE",
    packaging: "Steel drums, IBCs or ISO tanks",
    moq: "1 × 20ft container",
    specs: { "Range": "Toluene, xylene, IPA and others on request", "Grade": "Industrial", "Documents": "COA and safety data sheet with every shipment" },
    uses: ["Paints & coatings", "Printing inks", "Adhesives", "Cleaning products"]
  },

  /* ---------------- Automotive ---------------- */
  {
    id: "truck-tyres", division: "auto", sym: "Tt", hs: "4011.20",
    name: "Heavy-duty truck tyres",
    summary: "Radial truck tyres for steer, drive and trailer positions.",
    description: "Truck and bus radial (TBR) tyres built for long-haul and regional transport on East African corridors, with steer, drive and trailer patterns.",
    origin: "China",
    packaging: "Loose-loaded in 40ft HQ containers",
    moq: "1 × 40ft HQ container (mixed sizes possible)",
    specs: { "Sizes": "295/80R22.5, 315/80R22.5, 12R22.5, 13R22.5, 1200R20", "Patterns": "Steer, drive, trailer, mixed service", "Construction": "All-steel radial, tubeless and tube-type" },
    uses: ["Long-haul trucking", "Regional distribution", "Construction fleets", "Trailers"]
  },
  {
    id: "bus-tyres", division: "auto", sym: "Bt", hs: "4011.20",
    name: "Bus tyres",
    summary: "Radial bus tyres for city and intercity service.",
    description: "Durable radial tyres for city buses and intercity coaches, selected for mileage, comfort and retreadability.",
    origin: "China",
    packaging: "Loose-loaded in 40ft HQ containers",
    moq: "1 × 40ft HQ container (mixed sizes possible)",
    specs: { "Sizes": "275/70R22.5, 295/80R22.5, 11R22.5, 1100R20", "Service": "City and intercity", "Construction": "All-steel radial" },
    uses: ["City buses", "Intercity coaches", "Staff transport", "School buses"]
  },
  {
    id: "replacement-components", division: "auto", sym: "Rc", hs: "8708.99",
    name: "Replacement components",
    summary: "Brake, filter, suspension and clutch parts for trucks and buses.",
    description: "Specialised replacement components for commercial trucks and buses, sourced against OEM part numbers to keep fleets on the road.",
    origin: "China, India, UAE",
    packaging: "Cartons on pallets",
    moq: "Mixed container",
    specs: { "Range": "Brake parts, filters, suspension, clutch, lighting, electrical", "Sourcing": "Matched to OEM part numbers", "Makes": "Major European and Asian truck and bus brands" },
    uses: ["Fleet maintenance", "Workshops", "Spare parts dealers", "Transport companies"]
  }
];
