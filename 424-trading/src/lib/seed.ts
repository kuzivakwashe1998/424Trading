// Bundled sample data. Used in demo mode (no Supabase configured) and by the
// admin "Seed database" tool. Demo mode uses readable slug IDs; Supabase gets
// deterministic UUIDs (see seedForSupabase) so seeding stays idempotent.

export interface SeedCategory {
  id: string;
  name: string;
  description: string;
  image_url: string;
  created_at: string;
}

export interface SeedProduct {
  id: string;
  category_id: string;
  name: string;
  description: string;
  price: number | null;
  image_url: string;
  stock: number;
  available: boolean;
  featured: boolean;
  subcategory: string;
  created_at: string;
}

const T = "2026-01-05T08:00:00.000Z";

export const seedCategories: SeedCategory[] = [
  {
    id: "cat-electrical",
    name: "Electrical Products",
    description:
      "VSD drives, electrical accessories and control gear for industrial and commercial installations.",
    image_url: "/media/cat-electrical.jpg",
    created_at: T,
  },
  {
    id: "cat-lighting",
    name: "Lighting Solutions",
    description:
      "LED lights, floodlights, street lights, bulbs, high bay lights, sockets and switches.",
    image_url: "/media/cat-lighting.jpg",
    created_at: T,
  },
  {
    id: "cat-automotive",
    name: "Automotive Products",
    description:
      "Quality tyres for commercial fleets, trucks, LDVs and passenger vehicles.",
    image_url: "/media/cat-automotive.jpg",
    created_at: T,
  },
  {
    id: "cat-marble",
    name: "Marble & Stone",
    description:
      "Black granite, marble, natural stone and slabs for kitchens, counters and construction.",
    image_url: "/media/cat-marble.jpg",
    created_at: T,
  },
  {
    id: "cat-fuel",
    name: "Fuel & Oil Lubricants",
    description:
      "Diesel, petrol, engine oils and industrial lubricants sourced to specification.",
    image_url: "/media/cat-fuel.jpg",
    created_at: T,
  },
];

export const seedProducts: SeedProduct[] = [
  // ---- Electrical Products ----
  {
    id: "p-vsd-22",
    category_id: "cat-electrical",
    name: "VSD Drive 2.2kW Single Phase",
    description:
      "Variable speed drive for single-phase input and three-phase motor output. Ideal for pumps, fans and small machinery. Built-in keypad, potentiometer and Modbus communication.",
    price: null,
    image_url: "/media/prod-vsd.jpg",
    stock: 14,
    available: true,
    featured: true,
    subcategory: "VSD Drives",
    created_at: T,
  },
  {
    id: "p-vsd-55",
    category_id: "cat-electrical",
    name: "VSD Drive 5.5kW Three Phase",
    description:
      "Heavy-duty 5.5kW variable speed drive with vector control, overload protection and IP20 enclosure. Suited to compressors, conveyors and industrial motors.",
    price: null,
    image_url: "/media/prod-vsd.jpg",
    stock: 8,
    available: true,
    featured: false,
    subcategory: "VSD Drives",
    created_at: T,
  },
  {
    id: "p-vsd-110",
    category_id: "cat-electrical",
    name: "VSD Drive 11kW Industrial",
    description:
      "11kW industrial variable speed drive with built-in EMC filter and braking unit. Request a quote for current pricing and availability.",
    price: null,
    image_url: "/media/prod-vsd.jpg",
    stock: 5,
    available: true,
    featured: false,
    subcategory: "VSD Drives",
    created_at: T,
  },
  {
    id: "p-mcb",
    category_id: "cat-electrical",
    name: "MCB Circuit Breaker 63A",
    description:
      "63A miniature circuit breaker, 6kA breaking capacity, DIN-rail mounted. Available in single, double and triple pole — enquire for configurations.",
    price: null,
    image_url: "/media/cat-electrical.jpg",
    stock: 120,
    available: true,
    featured: false,
    subcategory: "Electrical Accessories",
    created_at: T,
  },
  {
    id: "p-contactor",
    category_id: "cat-electrical",
    name: "AC Contactor 3-Pole 40A",
    description:
      "3-pole 40A AC contactor with 230V coil for motor control and switching applications. Pair with a thermal overload relay for complete motor protection.",
    price: null,
    image_url: "/media/cat-electrical.jpg",
    stock: 45,
    available: true,
    featured: false,
    subcategory: "Electrical Accessories",
    created_at: T,
  },
  {
    id: "p-cable",
    category_id: "cat-electrical",
    name: "Armoured Cable 4-Core (per metre)",
    description:
      "Steel-wire armoured copper cable for underground and outdoor distribution. Sold per metre — pricing depends on cross-section (16mm² to 95mm²). Request a quote.",
    price: null,
    image_url: "/media/cat-electrical.jpg",
    stock: 500,
    available: true,
    featured: false,
    subcategory: "Electrical Accessories",
    created_at: T,
  },

  // ---- Lighting Solutions ----
  {
    id: "p-led-panel",
    category_id: "cat-lighting",
    name: "LED Panel Light 40W 600x600",
    description:
      "Slim 40W LED panel for offices and commercial ceilings. 6000K cool white, flicker-free driver included, 30,000 hour lifespan.",
    price: null,
    image_url: "/media/cat-lighting.jpg",
    stock: 200,
    available: true,
    featured: true,
    subcategory: "LED Lights",
    created_at: T,
  },
  {
    id: "p-flood-100",
    category_id: "cat-lighting",
    name: "LED Floodlight 100W IP66",
    description:
      "100W IP66-rated LED floodlight for yards, warehouses and perimeter security. Die-cast aluminium body with toughened glass lens.",
    price: null,
    image_url: "/media/cat-lighting.jpg",
    stock: 80,
    available: true,
    featured: true,
    subcategory: "Floodlights",
    created_at: T,
  },
  {
    id: "p-flood-200",
    category_id: "cat-lighting",
    name: "LED Floodlight 200W IP66",
    description:
      "High-output 200W floodlight for large outdoor areas, sports grounds and loading bays. Wide beam angle and surge protection.",
    price: null,
    image_url: "/media/cat-lighting.jpg",
    stock: 40,
    available: true,
    featured: false,
    subcategory: "Floodlights",
    created_at: T,
  },
  {
    id: "p-street-100",
    category_id: "cat-lighting",
    name: "Solar Street Light 100W",
    description:
      "All-in-one solar street light with integrated panel, lithium battery and motion sensor. Ideal for estates, farms and municipal projects.",
    price: null,
    image_url: "/media/prod-street.jpg",
    stock: 60,
    available: true,
    featured: true,
    subcategory: "Street Lights",
    created_at: T,
  },
  {
    id: "p-bulb-9",
    category_id: "cat-lighting",
    name: "LED Bulb 9W B22 (Box of 20)",
    description:
      "Energy-saving 9W LED bulbs in B22 bayonet fitting. Box of 20 — ideal for retail and household resale.",
    price: null,
    image_url: "/media/prod-bulbs.jpg",
    stock: 150,
    available: true,
    featured: false,
    subcategory: "Bulbs",
    created_at: T,
  },
  {
    id: "p-highbay-150",
    category_id: "cat-lighting",
    name: "LED High Bay Light 150W",
    description:
      "150W UFO high bay for factories, warehouses and workshops. 140 lm/W efficacy with hook or bracket mounting.",
    price: null,
    image_url: "/media/products/led-high-bay.jpg",
    stock: 35,
    available: true,
    featured: true,
    subcategory: "High Bay Lights",
    created_at: T,
  },
  {
    id: "p-switch",
    category_id: "cat-lighting",
    name: "Wall Switch & Socket Set",
    description:
      "Designer white wall switches and 13A sockets, complete with mounting boxes. Bulk pricing available on request.",
    price: null,
    image_url: "/media/prod-switches.jpg",
    stock: 300,
    available: true,
    featured: false,
    subcategory: "Sockets & Switches",
    created_at: T,
  },

  // ---- Automotive Products ----
  {
    id: "p-tyre-215",
    category_id: "cat-automotive",
    name: "Passenger Tyre 215/60 R16",
    description:
      "All-season radial tyre for sedans and SUVs. Low noise tread with long mileage warranty. Fitting available on request.",
    price: null,
    image_url: "/media/cat-automotive.jpg",
    stock: 48,
    available: true,
    featured: true,
    subcategory: "Tyres",
    created_at: T,
  },
  {
    id: "p-tyre-315",
    category_id: "cat-automotive",
    name: "Truck Tyre 315/80 R22.5",
    description:
      "Heavy-duty drive-axle truck tyre for long-haul and regional transport. Request a quote for fleet quantities.",
    price: null,
    image_url: "/media/products/truck-tyres-yard.jpg",
    stock: 24,
    available: true,
    featured: false,
    subcategory: "Tyres",
    created_at: T,
  },
  {
    id: "p-tyre-ldv",
    category_id: "cat-automotive",
    name: "LDV Tyre 195R15C",
    description:
      "Reinforced commercial tyre for light delivery vehicles and kombis. Strong sidewall for heavy loads.",
    price: null,
    image_url: "/media/cat-automotive.jpg",
    stock: 36,
    available: true,
    featured: false,
    subcategory: "Tyres",
    created_at: T,
  },

  // ---- Marble & Stone ----
  {
    id: "p-granite-blk",
    category_id: "cat-marble",
    name: "Black Granite Countertop (per m²)",
    description:
      "Polished absolute black granite for kitchens, vanities and reception counters. Cut and installed to measure — request a quote.",
    price: null,
    image_url: "/media/cat-marble.jpg",
    stock: 100,
    available: true,
    featured: true,
    subcategory: "Black Granite",
    created_at: T,
  },
  {
    id: "p-marble-white",
    category_id: "cat-marble",
    name: "White Marble Slab 20mm",
    description:
      "Premium white marble with soft grey veining. 20mm polished slabs for feature walls, tables and interiors.",
    price: null,
    image_url: "/media/cat-marble.jpg",
    stock: 22,
    available: true,
    featured: true,
    subcategory: "Marble",
    created_at: T,
  },
  {
    id: "p-stone-paver",
    category_id: "cat-marble",
    name: "Natural Stone Pavers",
    description:
      "Hard-wearing natural stone pavers for driveways, walkways and landscaping. Various finishes available.",
    price: null,
    image_url: "/media/prod-pavers.jpg",
    stock: 400,
    available: true,
    featured: false,
    subcategory: "Natural Stone",
    created_at: T,
  },
  {
    id: "p-slab-granite",
    category_id: "cat-marble",
    name: "Granite Slab 30mm (per slab)",
    description:
      "30mm granite slabs for heavy-duty counters, cladding and monuments. Priced per slab — request a quote for current stock.",
    price: null,
    image_url: "/media/cat-marble.jpg",
    stock: 18,
    available: true,
    featured: false,
    subcategory: "Stone Slabs",
    created_at: T,
  },

  // ---- Fuel & Oil Lubricants ----
  {
    id: "p-diesel",
    category_id: "cat-fuel",
    name: "Diesel 50ppm (per litre, bulk)",
    description:
      "Bulk diesel supply for generators, fleets and sites. Delivered by tanker — request a quote for volume pricing.",
    price: null,
    image_url: "/media/prod-fuel.jpg",
    stock: 10000,
    available: true,
    featured: false,
    subcategory: "Diesel",
    created_at: T,
  },
  {
    id: "p-petrol",
    category_id: "cat-fuel",
    name: "Petrol ULP93 (per litre, bulk)",
    description:
      "Unleaded petrol 93 for bulk delivery. Request a quote for current pricing and minimum volumes.",
    price: null,
    image_url: "/media/prod-fuel.jpg",
    stock: 10000,
    available: true,
    featured: false,
    subcategory: "Petrol",
    created_at: T,
  },
  {
    id: "p-oil-15w40",
    category_id: "cat-fuel",
    name: "Castrol GTX Diesel 15W-40 (5L)",
    description:
      "Castrol GTX Diesel mineral multigrade engine oil, API CI-4/SL. Protection to help extend diesel engine life. 5 litre pack.",
    price: null,
    image_url: "/media/products/castrol-gtx-diesel-15w40-5l.jpg",
    stock: 90,
    available: true,
    featured: true,
    subcategory: "Oils",
    created_at: T,
  },
  {
    id: "p-hydro-68",
    category_id: "cat-fuel",
    name: "Hydraulic Oil ISO 68 (20L)",
    description:
      "Anti-wear hydraulic oil for presses, tip-trucks and industrial equipment. 20 litre pail.",
    price: null,
    image_url: "/media/cat-fuel.jpg",
    stock: 40,
    available: true,
    featured: false,
    subcategory: "Lubricants",
    created_at: T,
  },
  {
    id: "p-grease",
    category_id: "cat-fuel",
    name: "Multi-Purpose Grease EP2 (500g)",
    description:
      "Lithium-complex EP2 grease for chassis, bearings and general lubrication. 500g cartridge or tub.",
    price: null,
    image_url: "/media/cat-fuel.jpg",
    stock: 160,
    available: true,
    featured: false,
    subcategory: "Lubricants",
    created_at: T,
  },

  // ------------------------------------------------------------------
  // Real product photography (all priced on request)
  // ------------------------------------------------------------------

  // ---- Lighting Solutions ----
  {
    id: "p-midea-solar-200",
    category_id: "cat-lighting",
    name: "Midea LED Solar Flood Light 200W",
    description:
      "Midea 200W LED solar floodlight — 2700 lm, 6500K cool daylight, 25,000 hrs lifespan. Complete with solar panel and remote control. 2-year warranty.",
    price: null,
    image_url: "/media/products/midea-solar-floodlight-200w.jpg",
    stock: 25,
    available: true,
    featured: true,
    subcategory: "Floodlights",
    created_at: T,
  },
  {
    id: "p-downlight",
    category_id: "cat-lighting",
    name: "Recessed LED Downlight",
    description:
      "Slim recessed LED downlight with spring-clip mounting for offices, shops and homes. Even, glare-free illumination with low energy draw.",
    price: null,
    image_url: "/media/products/led-downlight.jpg",
    stock: 120,
    available: true,
    featured: false,
    subcategory: "LED Lights",
    created_at: T,
  },
  {
    id: "p-flood-50",
    category_id: "cat-lighting",
    name: "LED Floodlight 50W IP66",
    description:
      "Compact 50W IP66 LED floodlight with toughened glass, wall bracket and flex lead. Ideal for perimeter and security lighting.",
    price: null,
    image_url: "/media/products/led-floodlight-50w.jpg",
    stock: 60,
    available: true,
    featured: false,
    subcategory: "Floodlights",
    created_at: T,
  },

  // ---- Fuel & Oil Lubricants ----
  {
    id: "p-gtx-5w30",
    category_id: "cat-fuel",
    name: "Castrol GTX 5W-30 Synthetic (5L)",
    description:
      "Castrol GTX synthetic engine oil 5W-30, petrol engines. 3X cleaner engine protection. 5 litre pack.",
    price: null,
    image_url: "/media/products/castrol-gtx-5w30-5l.jpg",
    stock: 40,
    available: true,
    featured: false,
    subcategory: "Oils",
    created_at: T,
  },
  {
    id: "p-delo-6300",
    category_id: "cat-fuel",
    name: "Caltex Delo 6300 15W-40 (5L)",
    description:
      "Caltex Delo 6300 heavy-duty diesel engine oil, SAE 15W-40, API CH-4 multigrade. 5 litre pack.",
    price: null,
    image_url: "/media/products/caltex-delo-6300-15w40-5l.jpg",
    stock: 40,
    available: true,
    featured: true,
    subcategory: "Oils",
    created_at: T,
  },
  {
    id: "p-atf-dex2",
    category_id: "cat-fuel",
    name: "Castrol ATF Dex II Multivehicle (1L)",
    description:
      "Castrol automatic transmission fluid, Dexron II-D specification. Protection over a wide temperature range. 1 litre.",
    price: null,
    image_url: "/media/products/castrol-atf-dex2-1l.jpg",
    stock: 80,
    available: true,
    featured: false,
    subcategory: "Lubricants",
    created_at: T,
  },
  {
    id: "p-gtx-20w50-1",
    category_id: "cat-fuel",
    name: "Castrol GTX 20W-50 (1L)",
    description:
      "Castrol GTX 20W-50 for petrol and diesel engines. Superior sludge protection for high-mileage vehicles. 1 litre.",
    price: null,
    image_url: "/media/products/castrol-gtx-20w50-1l.jpg",
    stock: 100,
    available: true,
    featured: false,
    subcategory: "Oils",
    created_at: T,
  },
  {
    id: "p-gtx-20w50-5",
    category_id: "cat-fuel",
    name: "Castrol GTX 20W-50 (5L)",
    description:
      "Castrol GTX 20W-50 mineral multigrade for high-mileage petrol and diesel engines. 5 litre pack.",
    price: null,
    image_url: "/media/products/castrol-gtx-20w50-5l.jpg",
    stock: 30,
    available: true,
    featured: false,
    subcategory: "Oils",
    created_at: T,
  },
  {
    id: "p-gtx-10w40",
    category_id: "cat-fuel",
    name: "Castrol GTX 10W-40 Synthetic (5L)",
    description:
      "Castrol GTX synthetic 10W-40 petrol engine oil. Helps extend engine life. 5 litre pack.",
    price: null,
    image_url: "/media/products/castrol-gtx-10w40-5l.jpg",
    stock: 30,
    available: true,
    featured: false,
    subcategory: "Oils",
    created_at: T,
  },
  {
    id: "p-edge-5w40",
    category_id: "cat-fuel",
    name: "Castrol EDGE 5W-40 Full Synthetic (1L)",
    description:
      "Castrol EDGE Professional advanced full synthetic 5W-40, A3/B4, petrol and diesel. Unlock the very edge of performance. 1 litre.",
    price: null,
    image_url: "/media/products/castrol-edge-5w40-1l.jpg",
    stock: 90,
    available: true,
    featured: false,
    subcategory: "Oils",
    created_at: T,
  },

  // ---- Marble & Stone: Pavers & Kerbs ----
  {
    id: "p-paver-zigzag",
    category_id: "cat-marble",
    name: "Concrete Pavers — Zigzag (Coloured)",
    description:
      "Interlocking zigzag paving bricks in grey, terracotta, red and charcoal. High-strength machine-pressed concrete for driveways, walkways and yards.",
    price: null,
    image_url: "/media/products/pavers-zigzag-colours.jpg",
    stock: 5000,
    available: true,
    featured: true,
    subcategory: "Pavers & Kerbs",
    created_at: T,
  },
  {
    id: "p-paver-herring",
    category_id: "cat-marble",
    name: "Concrete Pavers — Herringbone (Grey & Charcoal)",
    description:
      "Rectangular concrete pavers for classic herringbone layouts. Available in light grey and charcoal tones.",
    price: null,
    image_url: "/media/products/pavers-herringbone.jpg",
    stock: 5000,
    available: true,
    featured: false,
    subcategory: "Pavers & Kerbs",
    created_at: T,
  },
  {
    id: "p-paver-bulk",
    category_id: "cat-marble",
    name: "Concrete Pavers (Bulk Pack)",
    description:
      "Palletised bulk supply of concrete paving bricks for contractors and project work. Volume pricing on request.",
    price: null,
    image_url: "/media/products/pavers-bulk-pack.jpg",
    stock: 1000,
    available: true,
    featured: false,
    subcategory: "Pavers & Kerbs",
    created_at: T,
  },
  {
    id: "p-paver-laid",
    category_id: "cat-marble",
    name: "Paving Supply & Pattern Lay (per m²)",
    description:
      "Supply of pavers laid in alternating colour patterns for driveways, parking bays and pedestrian areas. Quoted per square metre.",
    price: null,
    image_url: "/media/products/paving-installed.jpg",
    stock: 1000,
    available: true,
    featured: false,
    subcategory: "Pavers & Kerbs",
    created_at: T,
  },
  {
    id: "p-kerb-std",
    category_id: "cat-marble",
    name: "Concrete Kerbstone — Standard",
    description:
      "Machine-pressed concrete kerbstone for roads, driveways and flower beds. Durable high-strength mix.",
    price: null,
    image_url: "/media/products/kerbstone-standard.jpg",
    stock: 300,
    available: true,
    featured: false,
    subcategory: "Pavers & Kerbs",
    created_at: T,
  },
  {
    id: "p-kerb-bev",
    category_id: "cat-marble",
    name: "Concrete Kerbstone — Bevelled",
    description:
      "Bevelled-profile concrete kerbstone for clean driveway and pathway edging.",
    price: null,
    image_url: "/media/products/kerbstone-bevelled.jpg",
    stock: 300,
    available: true,
    featured: false,
    subcategory: "Pavers & Kerbs",
    created_at: T,
  },
  {
    id: "p-coping",
    category_id: "cat-marble",
    name: "Concrete Coping Stone",
    description:
      "Rounded concrete coping stone for wall capping and edge finishing.",
    price: null,
    image_url: "/media/products/coping-stone.jpg",
    stock: 150,
    available: true,
    featured: false,
    subcategory: "Pavers & Kerbs",
    created_at: T,
  },
  {
    id: "p-pillar-cap",
    category_id: "cat-marble",
    name: "Concrete Pillar Cap",
    description:
      "Square pyramid-top concrete pillar cap for gate posts and boundary walls.",
    price: null,
    image_url: "/media/products/pillar-cap.jpg",
    stock: 150,
    available: true,
    featured: false,
    subcategory: "Pavers & Kerbs",
    created_at: T,
  },
  {
    id: "p-machine",
    category_id: "cat-marble",
    name: "Paver Block Making Machine (Hydraulic)",
    description:
      "Hydraulic concrete block and paver making machine with 350L pan mixer and conveyor — on-site production capability. Supplied on request.",
    price: null,
    image_url: "/media/products/paver-making-machine.jpg",
    stock: 1,
    available: true,
    featured: false,
    subcategory: "Pavers & Kerbs",
    created_at: T,
  },
];

// ---------------------------------------------------------------------------
// Supabase-compatible copy with deterministic UUID primary keys.
// ---------------------------------------------------------------------------

const uuid = (n: number) =>
  `42400000-0000-4000-8000-${String(n).padStart(12, "0")}`;

export function seedForSupabase(): {
  categories: SeedCategory[];
  products: SeedProduct[];
} {
  const catId = new Map(seedCategories.map((c, i) => [c.id, uuid(i + 1)]));
  return {
    categories: seedCategories.map((c, i) => ({ ...c, id: uuid(i + 1) })),
    products: seedProducts.map((p, i) => ({
      ...p,
      id: uuid(1000 + i),
      category_id: catId.get(p.category_id) ?? p.category_id,
    })),
  };
}
