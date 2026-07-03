import { Product, ShippingOrigin } from "../types";

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "Luxury Rose Quartz Eternal Music Box",
    description: "An exquisite handmade musical jewelry box made with authentic crystal rose quartz accents and a 24k gold-plated mechanical clockwork wind-up engine. Plays a celestial melody.",
    category: "Gifts",
    originalPrice: 4200,
    discountedPrice: 2950,
    rating: 4.8,
    reviewCount: 34,
    image: "https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&q=80&w=400",
    gallery: [
      "https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=600"
    ],
    specs: {
      "Material": "Preserved Rose Quartz & Crystal Glass",
      "Tune": "Castle in the Sky",
      "Movement": "Sankyo 18-Note Mechanical Gold-Plated",
      "Dimensions": "12cm x 12cm x 10cm",
      "Weight": "450g"
    },
    variants: [
      { id: "v1-pink", name: "Soft Blossom Pink", priceModifier: 0, stock: 12 },
      { id: "v1-violet", name: "Amethyst Purple", priceModifier: 250, stock: 6 }
    ],
    reviews: [
      { id: "r1-1", userName: "Aisha Rahman", rating: 5, date: "2026-05-12", comment: "Absolutely breathtaking! Gifted this to my sister for her wedding anniversary and she cried of joy. Craftsmanship is top-notch." },
      { id: "r1-2", userName: "Tanvir Ahmed", rating: 4, date: "2026-05-24", comment: "Very beautiful. The sound is crystal clear. Took 2 days to deliver to Chittagong." }
    ],
    qa: [
      { id: "q1-1", question: "Can I customize the song selection?", answer: "Currently, this Rose Quartz edition strictly features the 'Castle in the Sky' mechanical movement. Other designs play different tunes." },
      { id: "q1-2", question: "Does it run on batteries?", answer: "No batteries are needed! It operates entirely using a high-quality wind-up mechanical clockwork engine." }
    ],
    origin: ShippingOrigin.BANGLADESH,
    deliveryTime: "1-3 Days",
    stockCount: 18,
    shippingCost: 80,
    trackingAvailable: true,
    isBestSeller: true,
    isNewArrival: false,
    isDeal: true,
    tags: ["rose", "music box", "crystal", "romantic", "handmade", "fast_delivery"]
  },
  {
    id: "prod-2",
    name: "Ultra HD Nebula Starry Sky Projector 2.0",
    description: "Transform your bedroom into a breathtaking cosmic galaxy. Includes smart app customization, rotating nebulae speed, voice commands with Google Home & Alexa, and dynamic starry visual synchronization.",
    category: "Smart Gadgets",
    originalPrice: 3500,
    discountedPrice: 1999,
    rating: 4.9,
    reviewCount: 128,
    image: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?auto=format&fit=crop&q=80&w=400",
    gallery: [
      "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1475274047050-1d0c0975c63e?auto=format&fit=crop&q=80&w=600"
    ],
    specs: {
      "Input Power": "USB Type-C (5V/2A)",
      "Projection Range": "500 sq ft",
      "Laser Wavelength": "523nm",
      "Control": "Smart Life App & Remote Control",
      "Music Sync": "Yes, built-in acoustic sensor"
    },
    variants: [
      { id: "v2-cosmic", name: "Cosmic Charcoal", priceModifier: 0, stock: 25 },
      { id: "v2-polar", name: "Polar Ice White", priceModifier: 0, stock: 40 }
    ],
    reviews: [
      { id: "r2-1", userName: "Siam Chowdhury", rating: 5, date: "2026-05-30", comment: "Its laser mapping is razor sharp! Kids absolutely adore it. Easily the coolest gadget on my desk." },
      { id: "r2-2", userName: "Mridula Sen", rating: 5, date: "2026-06-02", comment: "The galaxy speed controller and music sync works perfectly. Amazing product directly imported with fast local distribution." }
    ],
    qa: [
      { id: "q2-1", question: "Is this safe for pets and young kids?", answer: "Yes, the projection light is fully certified. For laser star diodes, do look away from direct lens exposure, as standard safety." }
    ],
    origin: ShippingOrigin.BANGLADESH,
    deliveryTime: "1-3 Days",
    stockCount: 65,
    shippingCost: 70,
    trackingAvailable: true,
    isBestSeller: true,
    isNewArrival: true,
    isDeal: true,
    tags: ["nebula", "galaxy", "projector", "smart", "led", "bedroom", "fast_delivery"]
  },
  {
    id: "prod-3",
    name: "Retro Steampunk Mechanical Keyboard",
    description: "A gorgeous retro typewriter-styled mechanical keyboard featuring vintage-inspired chrome circular keycaps, clicks-blue switches, and warm white LED backlighting in full-grain metal frame.",
    category: "Computer Accessories",
    originalPrice: 8500,
    discountedPrice: 4800,
    rating: 4.7,
    reviewCount: 42,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&q=80&w=400",
    gallery: [
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&q=80&w=600"
    ],
    specs: {
      "Switch Type": "Tactile Clicky Blue Switch (50M Keystrokes)",
      "Connection": "USB Type-C Wired & Bluetooth 5.0 Dual",
      "Layout": "84-Key Compact layout",
      "Shell Material": "Aluminum top plate with vintage rivets"
    },
    variants: [
      { id: "v3-rust", name: "Bronze Industrial Rust", priceModifier: 400, stock: 250 },
      { id: "v3-silver", name: "Mirror Silver Chrome", priceModifier: 0, stock: 400 }
    ],
    reviews: [
      { id: "r3-1", userName: "Sadman Sakib", rating: 5, date: "2025-11-18", comment: "Typing speed increased beautifully or at least it sounds so wonderful! Stunning vintage style." }
    ],
    qa: [
      { id: "q3-1", question: "Does it work with Mac and iPad OS?", answer: "Yes! There is a physical switch on the side to toggle between Mac/iOS layout and Windows/Android configurations." }
    ],
    origin: ShippingOrigin.CHINA,
    deliveryTime: "25-30 Days",
    stockCount: 650,
    shippingCost: 150,
    trackingAvailable: true,
    isBestSeller: false,
    isNewArrival: true,
    isDeal: false,
    tags: ["keyboard", "typewriter", "steampunk", "mechanical", "retro", "china_direct"]
  },
  {
    id: "prod-4",
    name: "Pure Wood Air-Humidifying Aroma Diffuser",
    description: "Ultra-quiet ultrasonic humidifying diffuser encased in genuine Canadian red spruce or walnut timber. Promotes structural air hydration and features ambient warm light halo.",
    category: "Home & Kitchen",
    originalPrice: 2800,
    discountedPrice: 1650,
    rating: 4.6,
    reviewCount: 89,
    image: "https://images.unsplash.com/photo-1602928321679-560bb453f190?auto=format&fit=crop&q=80&w=400",
    gallery: [
      "https://images.unsplash.com/photo-1602928321679-560bb453f190?auto=format&fit=crop&q=80&w=600"
    ],
    specs: {
      "Capacity": "400ml water tank",
      "Running Time": "Up to 10 hours auto-shutoff",
      "Noise Level": "<20dB whisper quiet",
      "Material": "Spruce Timber external & medical grade PP reservoir"
    },
    variants: [
      { id: "v4-walnut", name: "Smoked American Walnut", priceModifier: 200, stock: 8 },
      { id: "v4-spruce", name: "Bright Nordic Spruce", priceModifier: 0, stock: 15 }
    ],
    reviews: [
      { id: "r4-1", userName: "Laila Karim", rating: 4, date: "2026-04-15", comment: "Really peaceful and blends into the wooden home furniture. Keeps the air moist in winter." }
    ],
    qa: [],
    origin: ShippingOrigin.BANGLADESH,
    deliveryTime: "1-3 Days",
    stockCount: 23,
    shippingCost: 65,
    trackingAvailable: true,
    isBestSeller: false,
    isNewArrival: false,
    isDeal: true,
    tags: ["diffuser", "wood", "humidifier", "home", "aroma", "fast_delivery"]
  },
  {
    id: "prod-5",
    name: "Pocket Smart Inkless Thermal Printer",
    description: "Compact wireless thermal sticker printer that fits in your hand. Prints labels, notes, journal images, and custom doodles instantly without expensive ink cartridges.",
    category: "Electronics",
    originalPrice: 4000,
    discountedPrice: 2450,
    rating: 4.8,
    reviewCount: 95,
    image: "https://images.unsplash.com/photo-1612815154858-60aa4c59edd6?auto=format&fit=crop&q=80&w=400",
    specs: {
      "Technology": "Direct Thermal (Zero Ink)",
      "Resolution": "203 DPI high clarity",
      "Battery": "1200mAh Lithium Rechargeable",
      "Paper Size": "57mm thermal rolls",
      "App Link": "Android & iOS Bluetooth Connection"
    },
    variants: [
      { id: "v5-mint", name: "Mint Emerald", priceModifier: 0, stock: 4 },
      { id: "v5-pink", name: "Blush Unicorn", priceModifier: 0, stock: 11 }
    ],
    reviews: [
      { id: "r5-1", userName: "Mahi Hasan", rating: 5, date: "2026-03-29", comment: "The easiest thing to print checklist sticky notes. Excellent app software with pre-made templates." }
    ],
    qa: [],
    origin: ShippingOrigin.BANGLADESH,
    deliveryTime: "1-3 Days",
    stockCount: 15,
    shippingCost: 80,
    trackingAvailable: true,
    isBestSeller: true,
    isNewArrival: true,
    isDeal: false,
    tags: ["printer", "inkless", "thermal", "pocket", "mobile_accessories", "fast_delivery"]
  },
  {
    id: "prod-6",
    name: "Cyberpunk Transparent Bluetooth Speaker",
    description: "Retro-futuristic transparent mechanical casing with visible circuitry board, pulsing dual subwoofer magnetic bass diaphragms, and 9 variable neon multi-color glow sequences.",
    category: "Electronics",
    originalPrice: 3200,
    discountedPrice: 1780,
    rating: 4.5,
    reviewCount: 71,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&q=80&w=400",
    specs: {
      "Audio Output": "10W Dual Speaker + Passive Radiator",
      "Battery": "1800mAh (8 Hours Playtime)",
      "Bluetooth": "V5.3 High Dynamic Range",
      "Materials": "Exploded Acrylic Transparent Shell & Steel Grilles"
    },
    variants: [
      { id: "v6-neon", name: "Circuit Yellow Glow", priceModifier: 100, stock: 1500 },
      { id: "v6-ice", name: "Cyberpunk Cobalt Blue", priceModifier: 0, stock: 1200 }
    ],
    reviews: [],
    qa: [],
    origin: ShippingOrigin.CHINA,
    deliveryTime: "25-30 Days",
    stockCount: 2700,
    shippingCost: 50,
    trackingAvailable: true,
    isBestSeller: false,
    isNewArrival: true,
    isDeal: true,
    tags: ["speaker", "cyberpunk", "hologram", "transparent", "rgb", "china_direct"]
  },
  {
    id: "prod-7",
    name: "Classic Jade Pixiu Good Fortune Feng Shui Amulet",
    description: "Hand-carved premium grade Chinese natural green jade amulet designed featuring the Pixiu beast of infinite fortune, wealth, and spiritual balance. Fully polished with traditional silk string knotting.",
    category: "Gifts",
    originalPrice: 5200,
    discountedPrice: 3100,
    rating: 4.9,
    reviewCount: 46,
    image: "https://images.unsplash.com/photo-1626880242111-a83d1627c271?auto=format&fit=crop&q=80&w=400",
    specs: {
      "Jade Type": "Natural Nephrite Emerald-Grade Jade",
      "Pendant Size": "48mm x 28mm x 12mm",
      "Necklace Weight": "42g",
      "Chain": "Adjustable Hand-Braided Deep Red Silk"
    },
    variants: [
      { id: "v7-emerald", name: "Classic Jade Green", priceModifier: 0, stock: 80 },
      { id: "v7-cloud", name: "Mottled White/Gold Nephrite", priceModifier: 400, stock: 35 }
    ],
    reviews: [
      { id: "r7-1", userName: "Emily Zhang", rating: 5, date: "2026-05-18", comment: "The touch of the jade is surprisingly cold and serene. A very protective charm, elegantly carved." }
    ],
    qa: [],
    origin: ShippingOrigin.CHINA,
    deliveryTime: "25-30 Days",
    stockCount: 115,
    shippingCost: 110,
    trackingAvailable: true,
    isBestSeller: true,
    isNewArrival: false,
    isDeal: false,
    tags: ["jade", "pixiu", "charm", "china", "fortune", "traditional", "china_direct"]
  },
  {
    id: "prod-8",
    name: "Dynamic Smart Hydroponic Herb Garden",
    description: "Indoor smart bento-style planter with automated adjustable 25W full spectrum LED crop lights and intelligent water circulating pump. Grow garden greens anywhere in your home.",
    category: "Home & Kitchen",
    originalPrice: 12000,
    discountedPrice: 7500,
    rating: 4.8,
    reviewCount: 30,
    image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=400",
    specs: {
      "Slots": "12 plant pods",
      "Power": "12V low voltage secure plugin",
      "Height Adjustable": "Max 50cm tall space",
      "Modes": "Veg mode & Flower/Fruit dual spectrum selection"
    },
    variants: [
      { id: "v8-white", name: "Enamel Garden White", priceModifier: 0, stock: 50 },
      { id: "v8-black", name: "Modern Nordic Black", priceModifier: 0, stock: 45 }
    ],
    reviews: [],
    qa: [],
    origin: ShippingOrigin.CHINA,
    deliveryTime: "25-30 Days",
    stockCount: 95,
    shippingCost: 350,
    trackingAvailable: true,
    isBestSeller: false,
    isNewArrival: true,
    isDeal: false,
    tags: ["hydroponics", "planter", "garden", "smart", "home", "china_direct"]
  },
  {
    id: "prod-9",
    name: "Handmade Vintage Leather Travel Journal Set",
    description: "An incredible heirloom traveler package. Includes a hand-sewn genuine oiled cowhide leather cover, 3 notebooks (dotted, lined, blank) with acid-free craft paper, and a brass fountain calligraphy pen.",
    category: "Gifts",
    originalPrice: 3800,
    discountedPrice: 2200,
    rating: 4.7,
    reviewCount: 57,
    image: "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&q=80&w=400",
    specs: {
      "Leather Style": "Full Grain Crazy Horse Leather",
      "Paper Specs": "100 GSM Cream Archival-grade wood pulp",
      "Size": "A5 (21cm x 13cm)",
      "Pen Feed Size": "0.5mm Schmidt Golden Nib"
    },
    variants: [
      { id: "v9-tan", name: "Vintage Tan", priceModifier: 0, stock: 15 },
      { id: "v9-espresso", name: "Smoked Dark Espresso", priceModifier: 0, stock: 3 }
    ],
    reviews: [
      { id: "r9-1", userName: "Jamil Hossain", rating: 5, date: "2026-06-01", comment: "The smell of pure leather is great. This premium journal takes me back in time. Great presentation box." }
    ],
    qa: [],
    origin: ShippingOrigin.BANGLADESH,
    deliveryTime: "1-3 Days",
    stockCount: 18,
    shippingCost: 80,
    trackingAvailable: true,
    isBestSeller: true,
    isNewArrival: false,
    isDeal: false,
    tags: ["journal", "leather", "gift", "writing", "vintage", "fast_delivery"]
  },
  {
    id: "prod-10",
    name: "Smart Watch Sports Active Pro",
    description: "Professional grade multi-sensor fitness activity tracker with AMOLED curved edge glass, continuous arterial oxygen tracking, global GPS route sync, and water-resistance up to 50 meters.",
    category: "Smart Gadgets",
    originalPrice: 6500,
    discountedPrice: 3850,
    rating: 4.7,
    reviewCount: 220,
    image: "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&q=80&w=400",
    specs: {
      "Screen": "1.47-inch High Contrast AMOLED (450 nits)",
      "Battery Lifetime": "Up to 14 days normal usage",
      "Sensors": "6-axis Accelerometer, ECG Heart Rate, SpO2 sensor",
      "Materials": "Surgical Steel, fluoroelastomer smart clasp band"
    },
    variants: [
      { id: "v10-black", name: "Midnight Obsidian", priceModifier: 0, stock: 50 },
      { id: "v10-orange", name: "Adventure Lava Orange", priceModifier: 150, stock: 30 }
    ],
    reviews: [],
    qa: [],
    origin: ShippingOrigin.BANGLADESH,
    deliveryTime: "1-3 Days",
    stockCount: 80,
    shippingCost: 80,
    trackingAvailable: true,
    isBestSeller: true,
    isNewArrival: false,
    isDeal: true,
    tags: ["smartwatch", "fitness", "gps", "amoled", "gadget", "fast_delivery"]
  },
  {
    id: "prod-11",
    name: "Luxury Silk Embroidery Oriental Shawl",
    description: "Magnificent luxurious mulberry silk double-faced shawl handembroidered by master craftsmen of the Suzhou traditional guilds. Intricate plum blossom motifs with delicate hand-knotted fringe edges.",
    category: "Fashion",
    originalPrice: 15000,
    discountedPrice: 8900,
    rating: 4.9,
    reviewCount: 18,
    image: "https://images.unsplash.com/photo-1615486511487-12f377ccb058?auto=format&fit=crop&q=80&w=400",
    specs: {
      "Material": "100% Top Grade Natural Mulberry Silk",
      "Craftsmanship": "Double-sided hand tapestry needlepoint",
      "Dimensions": "180cm x 55cm",
      "Care Guide": "Dry Clean strictly"
    },
    variants: [
      { id: "v11-red", name: "Royal Emperor Crimson", priceModifier: 0, stock: 30 },
      { id: "v11-jade", name: "Imperial Silk Jade", priceModifier: 500, stock: 15 }
    ],
    reviews: [],
    qa: [],
    origin: ShippingOrigin.CHINA,
    deliveryTime: "25-30 Days",
    stockCount: 45,
    shippingCost: 200,
    trackingAvailable: true,
    isBestSeller: false,
    isNewArrival: true,
    isDeal: false,
    tags: ["silk", "shawl", "embroidery", "luxury", "traditional", "scarf", "china_direct"]
  },
  {
    id: "prod-12",
    name: "Gentleman Leather Clutch and RFID Cardholder",
    description: "Premium split dry-milled buffalo leather clutch wallet combo with military-grade dynamic electromagnetic guard block that keeps standard smart bank cards safe from scanning hackers.",
    category: "Fashion",
    originalPrice: 3200,
    discountedPrice: 1800,
    rating: 4.6,
    reviewCount: 41,
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=400",
    specs: {
      "Material": "Waterproof full-grain calfskin leather",
      "Clasp": "Heavy-Duty YKK Zinc Zipper",
      "RFID Block": "Dual-layer nickel-copper lining (13.56MHz tested)",
      "Card Capacity": "Up to 12 slots + central pocket divider"
    },
    variants: [
      { id: "v12-tan", name: "Smooth Cognac Tan", priceModifier: 0, stock: 22 },
      { id: "v12-black", name: "Matte Pitch Black", priceModifier: 0, stock: 18 }
    ],
    reviews: [],
    qa: [],
    origin: ShippingOrigin.BANGLADESH,
    deliveryTime: "1-3 Days",
    stockCount: 40,
    shippingCost: 80,
    trackingAvailable: true,
    isBestSeller: false,
    isNewArrival: false,
    isDeal: true,
    tags: ["wallet", "leather", "rfid", "gift", "clutch", "fast_delivery"]
  }
];
