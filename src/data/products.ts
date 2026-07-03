import { Product, ShippingOrigin } from "../types";

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "SianLab Pro 2D Wireless Barcode Scanner",
    description: "Professional-grade 2D cordless scanner with integrated Android terminal PDA, ultra-rugged drop-proof casing, and dual fast-charge dock station. Engineered for modern high-speed warehouse logistics, retail inventory, and enterprise supply chain management.",
    category: "Barcode Scanners",
    originalPrice: 15290,
    discountedPrice: 10580,
    rating: 4.8,
    reviewCount: 423,
    image: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=400",
    gallery: [
      "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=600"
    ],
    specs: {
      "Scan Engine": "CMOS 2D Area Imager",
      "Wireless Range": "Up to 150 meters (open air)",
      "OS Compatibility": "Android 11, Windows, macOS, Linux",
      "Drop Spec": "Withstands multiple 2.0m drops to concrete",
      "Battery Life": "Up to 24 hours active scanning"
    },
    variants: [
      { id: "v1-standard", name: "Standard Scanner Unit", priceModifier: 0, stock: 180 },
      { id: "v1-pda", name: "PDA Terminal Edition (+Dock)", priceModifier: 3450, stock: 65 }
    ],
    reviews: [
      { id: "r1-1", userName: "Jamil Chowdhury", rating: 5, date: "2026-06-15", comment: "Outstanding durability and range. Best scanner we have ever used in our Dhaka sorting center. Connected instantly to our custom inventory system." },
      { id: "r1-2", userName: "Aisha Rahman", rating: 4, date: "2026-06-20", comment: "Really fast scanning and has amazing barcode decoding capability even with torn barcodes. Recommended!" }
    ],
    qa: [
      { id: "q1-1", question: "Does it scan directly from mobile and monitor screens?", answer: "Yes, fully! The advanced CMOS area imager can easily decode 1D/2D QR codes and barcodes off backlit digital screens." },
      { id: "q1-2", question: "Is the battery rechargeable?", answer: "Yes! It comes with a 4500mAh heavy-duty rechargeable battery and charging dock included." }
    ],
    origin: ShippingOrigin.BANGLADESH,
    deliveryTime: "1-3 Days",
    stockCount: 245,
    shippingCost: 80,
    trackingAvailable: true,
    isBestSeller: true,
    isNewArrival: false,
    isDeal: true,
    tags: ["barcode", "scanner", "wireless", "pda", "warehouse", "fast_delivery"]
  },
  {
    id: "prod-2",
    name: "OptiScan Omni-Directional 2D Desktop Scanner",
    description: "Hands-free presentation desktop barcode scanner. Features high-speed omni-directional motion tolerance, smart automatic infra-red sensor trigger, and soft blue target laser helper.",
    category: "Barcode Scanners",
    originalPrice: 9500,
    discountedPrice: 6800,
    rating: 4.7,
    reviewCount: 89,
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=400",
    gallery: [
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=600"
    ],
    specs: {
      "Interface": "USB Keyboard Wedge / USB Virtual COM",
      "Sensor": "Linear Imager with Automatic Sleep",
      "Motion Tolerance": "Up to 2.5 meters/second",
      "Indicators": "Adjustable tone speaker & LED"
    },
    variants: [
      { id: "v2-white", name: "Classic Pearl White", priceModifier: 0, stock: 50 },
      { id: "v2-black", name: "Matte Stealth Black", priceModifier: 0, stock: 60 }
    ],
    reviews: [
      { id: "r2-1", userName: "Tanvir Ahmed", rating: 5, date: "2026-06-02", comment: "Saves a lot of cashier speed in our supermarket. Super accurate." }
    ],
    qa: [],
    origin: ShippingOrigin.BANGLADESH,
    deliveryTime: "1-3 Days",
    stockCount: 110,
    shippingCost: 70,
    trackingAvailable: true,
    isBestSeller: false,
    isNewArrival: true,
    isDeal: true,
    tags: ["barcode", "handsfree", "desktop", "omni", "retail", "fast_delivery"]
  },
  {
    id: "prod-3",
    name: "DocuScan Ultra-Speed A4 Flatbed Scanner",
    description: "Double-sided professional document scanner with automatic sheet feeder (ADF). Intelligent ultrasonic double-feed detection prevents pages from being skipped.",
    category: "Document Scanners",
    originalPrice: 38000,
    discountedPrice: 26500,
    rating: 4.8,
    reviewCount: 156,
    image: "https://images.unsplash.com/photo-1594913785162-e6785b49eed9?auto=format&fit=crop&q=80&w=400",
    gallery: [
      "https://images.unsplash.com/photo-1594913785162-e6785b49eed9?auto=format&fit=crop&q=80&w=600"
    ],
    specs: {
      "Scan Speed": "60 pages per minute / 120 images per minute",
      "ADF Capacity": "100 sheets A4 size",
      "Optical Resolution": "1200 DPI clear scan",
      "Daily Duty Cycle": "6,000 pages per day"
    },
    variants: [
      { id: "v3-standard", name: "Standard ADF Scanner", priceModifier: 0, stock: 35 },
      { id: "v3-pro", name: "Pro Flatbed Bundle (+Adf)", priceModifier: 6500, stock: 10 }
    ],
    reviews: [
      { id: "r3-1", userName: "Laila Karim", rating: 5, date: "2026-05-18", comment: "Unbelievable scanning speed. Perfect for digitizing old archive folders." }
    ],
    qa: [],
    origin: ShippingOrigin.CHINA,
    deliveryTime: "25-30 Days",
    stockCount: 45,
    shippingCost: 350,
    trackingAvailable: true,
    isBestSeller: true,
    isNewArrival: false,
    isDeal: false,
    tags: ["document", "scanner", "flatbed", "adf", "china_direct"]
  },
  {
    id: "prod-4",
    name: "BookScan Elite HD Overhead Book Scanner",
    description: "Intelligent professional overhead scanner with patented flattening curve laser technology. Eliminates binding shadows and page distortions from physical books.",
    category: "Document Scanners",
    originalPrice: 48000,
    discountedPrice: 35000,
    rating: 4.9,
    reviewCount: 67,
    image: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?auto=format&fit=crop&q=80&w=400",
    gallery: [
      "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?auto=format&fit=crop&q=80&w=600"
    ],
    specs: {
      "Camera Sensor": "24 Megapixels Sony HD Lens",
      "Format Size": "Supports up to A3 dimensions",
      "Software features": "Auto crop, background removal, voice command trigger",
      "OCR Tech": "Over 180 languages support"
    },
    variants: [
      { id: "v4-classic", name: "Classic BookScan Console", priceModifier: 0, stock: 30 }
    ],
    reviews: [],
    qa: [],
    origin: ShippingOrigin.CHINA,
    deliveryTime: "25-30 Days",
    stockCount: 30,
    shippingCost: 400,
    trackingAvailable: true,
    isBestSeller: false,
    isNewArrival: true,
    isDeal: false,
    tags: ["book", "overhead", "scanner", "ocr", "china_direct"]
  },
  {
    id: "prod-5",
    name: "RingScan 2D Wearable Bluetooth Finger Scanner",
    description: "Extremely lightweight smart ring-style scanner. Wearable on a single finger with a 360-degree rotation head and soft tactile button triggers.",
    category: "Wearable Scanners",
    originalPrice: 11500,
    discountedPrice: 7900,
    rating: 4.6,
    reviewCount: 88,
    image: "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&q=80&w=400",
    gallery: [
      "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&q=80&w=600"
    ],
    specs: {
      "Weight": "Only 28 grams",
      "Battery Capacity": "550mAh (12,000 continuous scans)",
      "Wireless": "Bluetooth 5.0 Low Energy + 2.4G Dongle",
      "Alerts": "LED, Vibration, and audio buzzer"
    },
    variants: [
      { id: "v5-one", name: "Universal Finger Fit", priceModifier: 0, stock: 72 }
    ],
    reviews: [],
    qa: [],
    origin: ShippingOrigin.BANGLADESH,
    deliveryTime: "1-3 Days",
    stockCount: 72,
    shippingCost: 80,
    trackingAvailable: true,
    isBestSeller: false,
    isNewArrival: false,
    isDeal: true,
    tags: ["wearable", "ring", "finger", "barcode", "fast_delivery"]
  },
  {
    id: "prod-6",
    name: "GloveScan Smart Industrial Inventory Glove",
    description: "Industrial heavy-duty scanning glove with integrated laser module on the knuckle and triggering push buttons on index finger.",
    category: "Wearable Scanners",
    originalPrice: 24000,
    discountedPrice: 18500,
    rating: 4.7,
    reviewCount: 42,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&q=80&w=400",
    gallery: [
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&q=80&w=600"
    ],
    specs: {
      "Glove Material": "Breathable high-durability synthetic knit with anti-static threads",
      "Battery": "1000mAh dual battery swap system",
      "Display": "0.91 inch real-time OLED monitor statistics display"
    },
    variants: [
      { id: "v6-left", name: "Left Hand Edition (Medium)", priceModifier: 0, stock: 80 },
      { id: "v6-right", name: "Right Hand Edition (Medium)", priceModifier: 0, stock: 70 }
    ],
    reviews: [],
    qa: [],
    origin: ShippingOrigin.CHINA,
    deliveryTime: "25-30 Days",
    stockCount: 150,
    shippingCost: 150,
    trackingAvailable: true,
    isBestSeller: false,
    isNewArrival: true,
    isDeal: false,
    tags: ["wearable", "glove", "barcode", "industrial", "china_direct"]
  },
  {
    id: "prod-7",
    name: "SwiftScan Rugged Cordless Laser Scanner",
    description: "Industrial-grade heavy duty handheld scanner with reinforced shock-absorbing rubber armor casing. Offers unparalleled drop protection.",
    category: "Handheld Scanners",
    originalPrice: 7800,
    discountedPrice: 5200,
    rating: 4.9,
    reviewCount: 215,
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=400",
    gallery: [
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600"
    ],
    specs: {
      "Laser Grade": "Class II High Intensity Red Laser",
      "Scan Rate": "500 decodes per second",
      "Protection Standard": "IP67 dust and water certified waterproof",
      "Drop rating": "Withstands 3.0 meter drops to asphalt"
    },
    variants: [
      { id: "v7-cordless", name: "Cordless Bluetooth Edition", priceModifier: 1200, stock: 120 },
      { id: "v7-wired", name: "Wired USB Standard Edition", priceModifier: 0, stock: 60 }
    ],
    reviews: [
      { id: "r7-1", userName: "Aisha Begum", rating: 5, date: "2026-06-11", comment: "We dropped it from the third rack and it works perfectly without a scratch! Absolutely recommended for industrial warehouses." }
    ],
    qa: [],
    origin: ShippingOrigin.BANGLADESH,
    deliveryTime: "1-3 Days",
    stockCount: 180,
    shippingCost: 80,
    trackingAvailable: true,
    isBestSeller: true,
    isNewArrival: false,
    isDeal: false,
    tags: ["handheld", "rugged", "laser", "cordless", "waterproof", "fast_delivery"]
  },
  {
    id: "prod-8",
    name: "LiteScan Compact USB Plug-and-Play Scanner",
    description: "Comfortable and light ergonomic wired scanner for retail checkout counters. Works instantly with all POS systems, Excel sheets, and web registers.",
    category: "Handheld Scanners",
    originalPrice: 3500,
    discountedPrice: 2200,
    rating: 4.5,
    reviewCount: 310,
    image: "https://images.unsplash.com/photo-1602928321679-560bb453f190?auto=format&fit=crop&q=80&w=400",
    gallery: [
      "https://images.unsplash.com/photo-1602928321679-560bb453f190?auto=format&fit=crop&q=80&w=600"
    ],
    specs: {
      "Interface": "USB Wired (1.8m coil cable)",
      "Trigger Mode": "Manual press trigger or Continuous scan mode",
      "Weight": "110g ultra-lightweight design",
      "Compatibility": "No drivers needed"
    },
    variants: [
      { id: "v8-one", name: "Standard Retail Bundle", priceModifier: 0, stock: 350 }
    ],
    reviews: [],
    qa: [],
    origin: ShippingOrigin.BANGLADESH,
    deliveryTime: "1-3 Days",
    stockCount: 350,
    shippingCost: 65,
    trackingAvailable: true,
    isBestSeller: false,
    isNewArrival: false,
    isDeal: true,
    tags: ["handheld", "retail", "wired", "cheap", "fast_delivery"]
  },
  {
    id: "prod-9",
    name: "OmniShield Fixed Mount Heavy Industrial Scanner",
    description: "Highly automated fixed position high-resolution camera scanner designed for rapid logistics sorter lines, conveyers, and sorting operations.",
    category: "Industrial Scanners",
    originalPrice: 68000,
    discountedPrice: 49000,
    rating: 4.8,
    reviewCount: 74,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=400",
    gallery: [
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600"
    ],
    specs: {
      "Camera Sensor": "5 Megapixels CMOS Area Sensor",
      "Speed Capacity": "Captures parcels moving up to 5 meters/sec",
      "Housing": "Heavy industrial cast-aluminum casing",
      "Connectivity": "Ethernet TCP/IP, RS232 Serial, USB"
    },
    variants: [
      { id: "v9-industrial", name: "OmniShield Core Unit", priceModifier: 0, stock: 25 }
    ],
    reviews: [],
    qa: [],
    origin: ShippingOrigin.CHINA,
    deliveryTime: "25-30 Days",
    stockCount: 25,
    shippingCost: 350,
    trackingAvailable: true,
    isBestSeller: false,
    isNewArrival: true,
    isDeal: false,
    tags: ["industrial", "fixed", "camera", "highspeed", "china_direct"]
  },
  {
    id: "prod-10",
    name: "IntelliScan 3D Structured Surface Profiler",
    description: "Metrology-grade 3D structured light scan sensor. Generates millions of 3D point-cloud coordinate vectors instantly for reverse engineering.",
    category: "Industrial Scanners",
    originalPrice: 180000,
    discountedPrice: 135000,
    rating: 4.9,
    reviewCount: 18,
    image: "https://images.unsplash.com/photo-1615486511487-12f377ccb058?auto=format&fit=crop&q=80&w=400",
    gallery: [
      "https://images.unsplash.com/photo-1615486511487-12f377ccb058?auto=format&fit=crop&q=80&w=600"
    ],
    specs: {
      "Accuracy": "Up to 0.02 mm ultra-precision",
      "Source": "Structured Blue LED light projection array",
      "Output Formats": "STL, OBJ, PLY, ASC standard point files",
      "Operating System": "Windows 10/11 Pro (64-bit)"
    },
    variants: [
      { id: "v10-standard", name: "Metrology Pro Package", priceModifier: 0, stock: 10 }
    ],
    reviews: [],
    qa: [],
    origin: ShippingOrigin.CHINA,
    deliveryTime: "25-30 Days",
    stockCount: 10,
    shippingCost: 500,
    trackingAvailable: true,
    isBestSeller: false,
    isNewArrival: true,
    isDeal: false,
    tags: ["industrial", "3d", "laser", "metrology", "china_direct"]
  },
  {
    id: "prod-11",
    name: "PristinePrint Thermal High-Speed Label Printer",
    description: "Heavy-duty thermal shipping label printer designed specifically for printing standard 4x6 labels with zero ink. Perfect for logistics sorting and shop inventory.",
    category: "Label Printers",
    originalPrice: 14500,
    discountedPrice: 9800,
    rating: 4.7,
    reviewCount: 112,
    image: "https://images.unsplash.com/photo-1612815154858-60aa4c59edd6?auto=format&fit=crop&q=80&w=400",
    gallery: [
      "https://images.unsplash.com/photo-1612815154858-60aa4c59edd6?auto=format&fit=crop&q=80&w=600"
    ],
    specs: {
      "Printing Tech": "Direct Thermal (No ribbons, No ink needed)",
      "Print Speed": "150 mm / second high-velocity printing",
      "Resolution": "203 DPI crystal clear text",
      "Paper Width": "Supports widths from 40mm up to 110mm"
    },
    variants: [
      { id: "v11-bluetooth", name: "Wireless Bluetooth + USB Model", priceModifier: 1500, stock: 45 },
      { id: "v11-usb", name: "Standard USB Wired Model", priceModifier: 0, stock: 50 }
    ],
    reviews: [
      { id: "r11-1", userName: "Mohammad Sakib", rating: 5, date: "2026-04-29", comment: "Essential for printing courier labels in Dhaka. Printing is incredibly sharp and fast." }
    ],
    qa: [],
    origin: ShippingOrigin.BANGLADESH,
    deliveryTime: "1-3 Days",
    stockCount: 95,
    shippingCost: 80,
    trackingAvailable: true,
    isBestSeller: true,
    isNewArrival: true,
    isDeal: false,
    tags: ["printer", "label", "thermal", "shipping", "fast_delivery"]
  },
  {
    id: "prod-12",
    name: "PocketLabeler Handheld Smart Bluetooth Labeler",
    description: "Compact wireless rechargeable label printer. Pairs instantly with your smartphone app to customize barcoding tags, prices, and cataloging codes.",
    category: "Label Printers",
    originalPrice: 3800,
    discountedPrice: 2450,
    rating: 4.8,
    reviewCount: 195,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&q=80&w=400",
    gallery: [
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&q=80&w=600"
    ],
    specs: {
      "Power Source": "1200mAh Lithium Rechargeable battery",
      "Tape Width": "15 mm max tape width",
      "App Customization": "Rich library of symbols, fonts, and template frames",
      "Weight": "160g pocketable design"
    },
    variants: [
      { id: "v12-mint", name: "Mint Emerald Gloss", priceModifier: 0, stock: 65 },
      { id: "v12-white", name: "Chalk Matte White", priceModifier: 0, stock: 75 }
    ],
    reviews: [],
    qa: [],
    origin: ShippingOrigin.BANGLADESH,
    deliveryTime: "1-3 Days",
    stockCount: 140,
    shippingCost: 80,
    trackingAvailable: true,
    isBestSeller: false,
    isNewArrival: false,
    isDeal: true,
    tags: ["printer", "label", "portable", "mini", "bluetooth", "fast_delivery"]
  }
];
