import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { INITIAL_PRODUCTS } from "./src/data/products";
import { 
  Order, 
  OrderStatus, 
  ShippingOrigin, 
  Product, 
  ChatMessage, 
  TrackingStep, 
  AdminRole, 
  User, 
  Warehouse, 
  Supplier, 
  Coupon, 
  SupportTicket, 
  ActivityLog, 
  LoginHistory 
} from "./src/types";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
app.use(express.json());

const PORT = 3000;

// ====================================================
// RELATIONAL DATABASE SEED ARRAYS (IN-MEMORY PERSISTENCE)
// ====================================================

let tempProducts = [...INITIAL_PRODUCTS];
let orders: Record<string, Order> = {};

let db_users: User[] = [
  {
    id: "user-1",
    name: "Jamil Sagor (Super Admin)",
    email: "jmisagor079@gmail.com",
    profilePhoto: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100",
    role: AdminRole.SUPER_ADMIN,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    lastLogin: new Date().toISOString(),
    emailVerified: true,
    loyaltyPoints: 1250
  },
  {
    id: "user-2",
    name: "Misha Rahaman (QC Lead)",
    email: "misha@chinagiftshop.com",
    profilePhoto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100",
    role: AdminRole.ADMIN,
    createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    lastLogin: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    emailVerified: true,
    loyaltyPoints: 0
  },
  {
    id: "user-3",
    name: "Sajid Hasan (Fulfillment Desk)",
    email: "sajid@chinagiftshop.com",
    profilePhoto: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100",
    role: AdminRole.WAREHOUSE_STAFF,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    lastLogin: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    emailVerified: true,
    loyaltyPoints: 0
  },
  {
    id: "user-4",
    name: "Zariyah Ahmed (Helpdesk Agent)",
    email: "zariyah@chinagiftshop.com",
    profilePhoto: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100",
    role: AdminRole.CUSTOMER_SUPPORT,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    lastLogin: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    emailVerified: true,
    loyaltyPoints: 0
  }
];

let db_warehouses: Warehouse[] = [
  {
    id: "wh-bd-1",
    name: "Dhaka Central Warehouse",
    location: "Road 4, Dhanmondi, Dhaka",
    origin: ShippingOrigin.BANGLADESH,
    stockCount: 450,
    activeStaff: 12
  },
  {
    id: "wh-bd-2",
    name: "Chittagong Port Transit Depot",
    location: "Halishahar, Chittagong",
    origin: ShippingOrigin.BANGLADESH,
    stockCount: 220,
    activeStaff: 6
  },
  {
    id: "wh-cn-1",
    name: "Shenzhen Supplier Hub Depot",
    location: "Nanshan Science Park, Shenzhen, Guangdong, China",
    origin: ShippingOrigin.CHINA,
    stockCount: 1800,
    activeStaff: 45
  }
];

let db_suppliers: Supplier[] = [
  {
    id: "sup-cn-1",
    name: "Shenzhen Nebula Tech Sourcing Co.",
    country: "China",
    contact: "sales@nebulatech.cn | +86 755-88392",
    performanceScore: 4.9,
    activeOrdersCount: 24
  },
  {
    id: "sup-cn-2",
    name: "Guangzhou Artisan Novelties Factory",
    country: "China",
    contact: "artisan-gifts@gzwholesale.com | +86 20-39402",
    performanceScore: 4.7,
    activeOrdersCount: 15
  },
  {
    id: "sup-bd-1",
    name: "Dhaka Craft Express & Boxes Ltd.",
    country: "Bangladesh",
    contact: "boxes@dhakacrafts.com | +880 2-98302",
    performanceScore: 4.8,
    activeOrdersCount: 4
  }
];

let db_coupons: Coupon[] = [
  {
    code: "WELCOME2026",
    discountType: "PERCENTAGE",
    value: 20,
    minPurchase: 1000,
    active: true,
    usedCount: 142
  },
  {
    code: "FASTBD",
    discountType: "FIXED",
    value: 300,
    minPurchase: 1500,
    active: true,
    usedCount: 78
  },
  {
    code: "CHINAFREE",
    discountType: "FIXED",
    value: 150,
    minPurchase: 2000,
    active: true,
    usedCount: 61
  }
];

let db_support_tickets: SupportTicket[] = [
  {
    id: "TCK-1092",
    customerName: "Imran Khan",
    customerEmail: "imran@gmail.com",
    subject: "Customs Clearance Status Inquiry",
    message: "Hello, my order CG-CN-9943 is currently showing customs clearance status since yesterday. Is everything alright or do I need to pay any duties?",
    status: "OPEN",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "TCK-1088",
    customerName: "Faria Sultana",
    customerEmail: "fariasultana@hotmail.com",
    subject: "Return Request for Keyboard",
    message: "Hello! I bought the typewriter mechanical keyboard from local Dhaka stock. The escape key feels slightly stuck, so I would like to swap it under the 7-day local replacement guarantee.",
    status: "RESOLVED",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    reply: "Dear Faria, your replacement request is verified. A Pathao delivery rider has been scheduled to drop by your address, collect the defective keycap box, and deliver a pristine replacement box immediately."
  }
];

let db_activity_logs: ActivityLog[] = [
  {
    id: "log-1",
    userEmail: "jmisagor079@gmail.com",
    role: "Super Admin",
    action: "DATABASE_RESET",
    details: "Reset store products and pre-seeded metadata to factory configurations.",
    ip: "103.145.74.22",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "log-2",
    userEmail: "misha@chinagiftshop.com",
    role: "Admin",
    action: "SHIPMENT_RELEASE",
    details: "Changed status of Order #CG-BD-7821 to DELIVERED. Digital recipient signature registered.",
    ip: "203.82.190.41",
    timestamp: new Date(Date.now() - 2.5 * 24 * 60 * 60 * 1000).toISOString()
  }
];

let db_login_history: LoginHistory[] = [
  {
    id: "login-1",
    userEmail: "jmisagor079@gmail.com",
    ip: "103.145.74.22",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    twoFactorPassed: true
  },
  {
    id: "login-2",
    userEmail: "zariyah@chinagiftshop.com",
    ip: "103.102.134.19",
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    twoFactorPassed: true
  }
];


// Helper: Get or initialize Gemini AI Client with lazy safety
let aiClient: any = null;
function getGeminiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      logInfo("GEMINI_API_KEY environment variable not available. Utilizing rule-based fallback assistant.");
      return null;
    }
    try {
      aiClient = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
      logInfo("Google GenAI client successfully initialized.");
    } catch (err) {
      logError("Failed to initialize Google GenAI SDK: " + err);
      return null;
    }
  }
  return aiClient;
}

function logInfo(msg: string) {
  console.log(`[China Gift Shop Server] [INFO] ${msg}`);
}

function logError(msg: string) {
  console.error(`[China Gift Shop Server] [ERROR] ${msg}`);
}

// Generate some initial seed orders for demo purposes so dashboard is populated
function seedOrders() {
  const baseProduct1 = INITIAL_PRODUCTS[1]; // Nebula projector (BD warehouse)
  const baseProduct2 = INITIAL_PRODUCTS[2]; // Typewriter keyboard (China Supplier)

  const order1: Order = {
    id: "CG-BD-7821",
    customerName: "Jamil Sagor",
    customerEmail: "jmisagor079@gmail.com",
    customerAddress: "House 24, Road 4, Dhanmondi R/A, Dhaka 1209, Bangladesh",
    customerPhone: "+880 1712-345678",
    items: [
      {
        product: baseProduct1,
        selectedVariant: baseProduct1.variants[0],
        quantity: 1
      }
    ],
    totalAmount: baseProduct1.discountedPrice + baseProduct1.shippingCost,
    paymentMethod: "bKash",
    paymentStatus: "Paid",
    shippingCost: baseProduct1.shippingCost,
    discount: 0,
    trackingNumber: "TR-BD-710492",
    currentStatus: OrderStatus.DELIVERED,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    timeline: [
      { status: OrderStatus.RECEIVED, timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), description: "We have received your payment and order.", completed: true },
      { status: OrderStatus.PROCESSING, timestamp: new Date(Date.now() - 2.8 * 24 * 60 * 60 * 1000).toISOString(), description: "Item verified and gathered at Bangladesh local warehouse.", completed: true },
      { status: OrderStatus.PACKED, timestamp: new Date(Date.now() - 2.5 * 24 * 60 * 60 * 1000).toISOString(), description: "Securely packed for local delivery.", completed: true },
      { status: OrderStatus.SHIPPED, timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), description: "Handed over to local courier service (Pathao / Paperfly).", completed: true },
      { status: OrderStatus.OUT_FOR_DELIVERY, timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), description: "Courier agent is on their way with your package.", completed: true },
      { status: OrderStatus.DELIVERED, timestamp: new Date(Date.now() - 0.9 * 24 * 60 * 60 * 1000).toISOString(), description: "Delivered successfully. Receipt signed and cash collected.", completed: true }
    ]
  };

  const order2: Order = {
    id: "CG-CN-9943",
    customerName: "Jamil Sagor",
    customerEmail: "jmisagor079@gmail.com",
    customerAddress: "Block E, Banani National Avenue, Dhaka, Bangladesh",
    customerPhone: "+880 1785-555666",
    items: [
      {
        product: baseProduct2,
        selectedVariant: baseProduct2.variants[0],
        quantity: 1
      }
    ],
    totalAmount: baseProduct2.discountedPrice + baseProduct2.shippingCost,
    paymentMethod: "Visa Card",
    paymentStatus: "Paid",
    shippingCost: baseProduct2.shippingCost,
    discount: 0,
    trackingNumber: "TR-CN-8801944",
    currentStatus: OrderStatus.IN_TRANSIT,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    timeline: [
      { status: OrderStatus.RECEIVED, timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), description: "Order received. Processing direct payment clearance.", completed: true },
      { status: OrderStatus.PROCESSING, timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), description: "Order approved by Chinese Supplier. Transmitted to sorting center.", completed: true },
      { status: OrderStatus.PACKED, timestamp: new Date(Date.now() - 3.5 * 24 * 60 * 60 * 1000).toISOString(), description: "Packed in specialized international transit container.", completed: true },
      { status: OrderStatus.SHIPPED, timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), description: "Export clearance completed at Shenzhen warehouse, loaded onto freighter.", completed: true },
      { status: OrderStatus.IN_TRANSIT, timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), description: "In transit. Vessel departed port towards Chittagong Harbor.", completed: true },
      { status: OrderStatus.CUSTOMS, timestamp: "", description: "Awaiting customs clearance & standard tax inspection at Dhaka Air Cargo/Chittagong.", completed: false },
      { status: OrderStatus.OUT_FOR_DELIVERY, timestamp: "", description: "Pending customs release.", completed: false },
      { status: OrderStatus.DELIVERED, timestamp: "", description: "Pending handover.", completed: false }
    ]
  };

  orders[order1.id] = order1;
  orders[order2.id] = order2;
}

seedOrders();

// ----------------------------------------------------
// API ROUTES
// ----------------------------------------------------

// 1. Fetch products catalog
app.get("/api/products", (req, res) => {
  const { category, origin, query, tag } = req.query;
  let results = [...tempProducts];

  if (category) {
    results = results.filter(p => p.category.toLowerCase() === String(category).toLowerCase());
  }

  if (origin) {
    results = results.filter(p => p.origin === (origin === "BD" ? ShippingOrigin.BANGLADESH : ShippingOrigin.CHINA));
  }

  if (tag) {
    results = results.filter(p => p.tags.includes(String(tag)));
  }

  if (query) {
    const searchStr = String(query).toLowerCase();
    results = results.filter(p => 
      p.name.toLowerCase().includes(searchStr) || 
      p.description.toLowerCase().includes(searchStr) ||
      p.category.toLowerCase().includes(searchStr) ||
      p.tags.some(t => t.toLowerCase().includes(searchStr))
    );
  }

  res.json({ products: results });
});

// 2. Clear & Reset store products
app.post("/api/admin/products/reset", (req, res) => {
  tempProducts = [...INITIAL_PRODUCTS];
  res.json({ success: true, message: "Products state successfully reset to defaults.", products: tempProducts });
});

// 3. Edit product (Admin and stock system edit)
app.put("/api/admin/products/:id", (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  
  const index = tempProducts.findIndex(p => p.id === id);
  if (index !== -1) {
    tempProducts[index] = { ...tempProducts[index], ...updatedData };
    
    const adminEmail = (req as any).user?.email || "admin@chinagiftshop.com";
    const adminRole = (req as any).user?.role || "Admin";
    logActivity(adminEmail, adminRole, "PRODUCT_UPDATE", `Updated catalog product ${id}: ${tempProducts[index].name}`);
    
    res.json({ success: true, product: tempProducts[index] });
  } else {
    res.status(404).json({ error: "Product not found" });
  }
});

// 4. Create single product
app.post("/api/admin/products", (req, res) => {
  const newProduct: Product = {
    id: `prod-${Date.now()}`,
    name: req.body.name || "Custom Chinese Gift Accent",
    description: req.body.description || "A gorgeous bespoke item directly from our catalog.",
    category: req.body.category || "Gifts",
    originalPrice: parseFloat(req.body.originalPrice) || 1200,
    discountedPrice: parseFloat(req.body.discountedPrice) || 950,
    rating: 4.5,
    reviewCount: 1,
    image: req.body.image || "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=400",
    gallery: [req.body.image || "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=400"],
    specs: req.body.specs || { "Fulfillment": "Standard Export Quality" },
    variants: req.body.variants || [{ id: `var-${Date.now()}`, name: "Standard", priceModifier: 0, stock: 100 }],
    reviews: [],
    qa: [],
    origin: req.body.origin === "China" ? ShippingOrigin.CHINA : ShippingOrigin.BANGLADESH,
    deliveryTime: req.body.origin === "China" ? "25-30 Days" : "1-3 Days",
    stockCount: parseInt(req.body.stockCount) || 50,
    shippingCost: parseInt(req.body.shippingCost) || 80,
    trackingAvailable: true,
    tags: req.body.tags || ["gift", "new"]
  };

  tempProducts.unshift(newProduct);
  
  const adminEmail = (req as any).user?.email || "admin@chinagiftshop.com";
  const adminRole = (req as any).user?.role || "Admin";
  logActivity(adminEmail, adminRole, "PRODUCT_CREATE", `Created new catalog product: ${newProduct.name}`);

  res.json({ success: true, product: newProduct });
});

// 5. Delete product
app.delete("/api/admin/products/:id", (req, res) => {
  const { id } = req.params;
  const index = tempProducts.findIndex(p => p.id === id);
  if (index !== -1) {
    const deletedName = tempProducts[index].name;
    tempProducts.splice(index, 1);
    
    const adminEmail = (req as any).user?.email || "admin@chinagiftshop.com";
    const adminRole = (req as any).user?.role || "Admin";
    logActivity(adminEmail, adminRole, "PRODUCT_DELETE", `Purged catalog product: ${id} (${deletedName})`);

    res.json({ success: true, message: "Product successfully deleted." });
  } else {
    res.status(404).json({ error: "Product not found" });
  }
});

// 6. Fetch user orders
app.get("/api/orders", (req, res) => {
  const { email } = req.query;
  let list = Object.values(orders);
  if (email) {
    list = list.filter(o => o.customerEmail.toLowerCase() === String(email).toLowerCase());
  }
  // Sort by newest
  list.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  res.json({ orders: list });
});

// 7. Fetch single order tracking details
app.get("/api/orders/:id", (req, res) => {
  const { id } = req.params;
  const order = orders[id];
  if (order) {
    res.json({ order });
  } else {
    res.status(404).json({ error: "Order not found" });
  }
});

// 8. Submit checkout order & decrement stock (Smart Inventory)
app.post("/api/orders", (req, res) => {
  const { customerName, customerEmail, customerAddress, customerPhone, items, paymentMethod, discount } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ error: "Cannot checkout helper with empty cart items." });
  }

  const orderId = `CG-${items[0].product.origin === ShippingOrigin.CHINA ? "CN" : "BD"}-${Math.floor(1000 + Math.random() * 9000)}`;
  const trackingNumber = `TR-${items[0].product.origin === ShippingOrigin.CHINA ? "CN" : "BD"}-${Math.floor(1000000 + Math.random() * 9000000)}`;

  let calculatedTotal = 0;
  let totalShipping = 0;

  // Decrease stock & calculate costs
  items.forEach((item: any) => {
    const storeItem = tempProducts.find(p => p.id === item.product.id);
    if (storeItem) {
      if (storeItem.stockCount >= item.quantity) {
        storeItem.stockCount -= item.quantity;
      } else {
        storeItem.stockCount = 0; // fallback safety
      }
    }
    const itemPrice = item.product.discountedPrice + (item.selectedVariant?.priceModifier || 0);
    calculatedTotal += itemPrice * item.quantity;
    totalShipping = Math.max(totalShipping, item.product.shippingCost); // charge highest shipping
  });

  const finalAmount = calculatedTotal + totalShipping - (discount || 0);

  // Design standard tracking steps
  const isChina = items[0].product.origin === ShippingOrigin.CHINA;
  const timeline: TrackingStep[] = [
    { status: OrderStatus.RECEIVED, timestamp: new Date().toISOString(), description: "Payment verified. Order received and mapped to fulfillments.", completed: true },
    { status: OrderStatus.PROCESSING, timestamp: "", description: isChina ? "Order allocated to China Supply Hub. Quality checks active." : "Allocated to Dhaka central warehouse. Sorting items.", completed: false },
    { status: OrderStatus.PACKED, timestamp: "", description: "Packed in weather-resistant shipping packets.", completed: false },
    { status: OrderStatus.SHIPPED, timestamp: "", description: isChina ? "Export customs clearance. Embarked on aircraft/cargo coaster." : "Handed to Pathao local courier logisticians.", completed: false }
  ];

  if (isChina) {
    timeline.push(
      { status: OrderStatus.IN_TRANSIT, timestamp: "", description: "Ocean Freighter departed Shenzhen bay boundary.", completed: false },
      { status: OrderStatus.CUSTOMS, timestamp: "", description: "Customs inspect and tax validation in Chittagong port / Dhaka Air Cargo.", completed: false }
    );
  }

  timeline.push(
    { status: OrderStatus.OUT_FOR_DELIVERY, timestamp: "", description: "Local driver dispatched with delivery confirmation checklist.", completed: false },
    { status: OrderStatus.DELIVERED, timestamp: "", description: "Signatures recorded. Fulfillment complete.", completed: false }
  );

  const newOrder: Order = {
    id: orderId,
    customerName: customerName || "Guest User",
    customerEmail: customerEmail || "jmisagor079@gmail.com",
    customerAddress: customerAddress || "Dhaka, Bangladesh",
    customerPhone: customerPhone || "01700000000",
    items,
    totalAmount: finalAmount,
    paymentMethod: paymentMethod || "Cash on Delivery",
    paymentStatus: paymentMethod === "Cash on Delivery" ? "Pending" : "Paid",
    shippingCost: totalShipping,
    discount: discount || 0,
    trackingNumber,
    currentStatus: OrderStatus.RECEIVED,
    timeline,
    createdAt: new Date().toISOString()
  };

  orders[orderId] = newOrder;

  res.json({ success: true, order: newOrder });
});

// 9. Update Order status (Admin action)
app.patch("/api/admin/orders/:id", (req, res) => {
  const { id } = req.params;
  const { status, stepDetails } = req.body;
  const order = orders[id];

  if (order) {
    order.currentStatus = status;
    const nowStr = new Date().toISOString();
    
    // update timeline step
    const stepIdx = order.timeline.findIndex(t => t.status === status);
    if (stepIdx !== -1) {
      order.timeline[stepIdx].completed = true;
      order.timeline[stepIdx].timestamp = nowStr;
      if (stepDetails) {
        order.timeline[stepIdx].description = stepDetails;
      }
    }

    // Auto-mark previous steps as completed
    for (let i = 0; i < stepIdx; i++) {
      if (!order.timeline[i].completed) {
        order.timeline[i].completed = true;
        order.timeline[i].timestamp = nowStr;
      }
    }

    const adminEmail = (req as any).user?.email || "admin@chinagiftshop.com";
    const adminRole = (req as any).user?.role || "Admin";
    logActivity(adminEmail, adminRole, "ORDER_STATUS_UPDATE", `Advanced status for Order ${id} to [${status}]`);

    res.json({ success: true, order });
  } else {
    res.status(404).json({ error: "Order not found" });
  }
});


// ==========================================
// SECURITY & AUDIT UTILITIES
// ==========================================

function logActivity(email: string, role: string, action: string, details: string, ip = "127.0.0.1") {
  const newLog: ActivityLog = {
    id: `log-${Date.now()}`,
    userEmail: email,
    role,
    action,
    details,
    ip,
    timestamp: new Date().toISOString()
  };
  db_activity_logs.unshift(newLog);
}

// Simple Base64 mock JWT generator/validator for complete sandboxed stateless safety
function generateSessionToken(payload: any): string {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64");
  const body = Buffer.from(JSON.stringify(payload)).toString("base64");
  const signature = Buffer.from("china_gift_shop_antigravity_core_secret").toString("base64");
  return `${header}.${body}.${signature}`;
}

// Middleware: Authenticate & Retrieve active user context from simulated JWT token
function authenticateSession(req: any, res: any, next: any) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    req.user = null;
    return next();
  }
  
  const token = authHeader.split(" ")[1];
  try {
    const parts = token.split(".");
    if (parts.length === 3) {
      const payloadDecoded = JSON.parse(Buffer.from(parts[1], "base64").toString());
      req.user = payloadDecoded;
    }
  } catch (err) {
    req.user = null;
  }
  next();
}

app.use(authenticateSession);


// ==========================================
// AUTHENTICATION FLOWS (FEATURE 2, 3, 4, 7)
// ==========================================

// A. Google Sign-In Exchange Endpoint
app.post("/api/auth/google", (req, res) => {
  const { name, email, profilePhoto, ipAddress } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Google account verification requires email coordinates." });
  }

  const clientIP = ipAddress || req.ip || "103.45.192.11";
  
  // Auto account lookup or provision
  let currentUser = db_users.find(u => u.email.toLowerCase() === email.toLowerCase());
  let isCreated = false;

  const isSuperAdminEmail = email.toLowerCase() === "jmisagor079@gmail.com";

  if (!currentUser) {
    currentUser = {
      id: `user-${Date.now()}`,
      name: name || (isSuperAdminEmail ? "Jamil Sagor (Super Admin)" : "New Importer Customer"),
      email: email.toLowerCase(),
      profilePhoto: profilePhoto || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100",
      role: isSuperAdminEmail ? AdminRole.SUPER_ADMIN : AdminRole.CUSTOMER,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      emailVerified: true,
      loyaltyPoints: 100 // Seed signup loyalty points!
    };
    db_users.push(currentUser);
    isCreated = true;
  } else {
    // Sync profile picture & name
    currentUser.lastLogin = new Date().toISOString();
    if (name) currentUser.name = name;
    if (profilePhoto) currentUser.profilePhoto = profilePhoto;
    // Unrestricted super admin bypass safety check
    if (isSuperAdminEmail && currentUser.role !== AdminRole.SUPER_ADMIN) {
      currentUser.role = AdminRole.SUPER_ADMIN;
    }
  }

  // Generate Session Token
  const token = generateSessionToken({
    id: currentUser.id,
    name: currentUser.name,
    email: currentUser.email,
    role: currentUser.role
  });

  // Log successful login session
  db_login_history.unshift({
    id: `login-${Date.now()}`,
    userEmail: currentUser.email,
    ip: clientIP,
    timestamp: new Date().toISOString(),
    twoFactorPassed: true // Auth passed
  });

  logActivity(currentUser.email, currentUser.role, isCreated ? "USER_SIGNUP" : "USER_LOGIN_GOOGLE", `Successful Google Authentication session. IP: ${clientIP}`, clientIP);

  res.json({
    success: true,
    user: currentUser,
    token,
    message: isSuperAdminEmail ? `${currentUser.name} signed in successfully via Google (Developer Super Admin Clearance Granted)` : `Successfully authenticated with Google as ${currentUser.name}`
  });
});

// B. Traditional Email & Password Authentication
app.post("/api/auth/email-login", (req, res) => {
  const { email, password, ipAddress } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Verify input credentials." });
  }

  const clientIP = ipAddress || req.ip || "103.45.192.11";
  
  // SUPER_ADMIN account bypass
  const isSuperAdminCredentials = 
    email.toLowerCase() === "jmisagor079@gmail.com" && 
    password === "JMIMAISHA91011!$#";

  let currentUser = db_users.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (isSuperAdminCredentials) {
    if (!currentUser) {
      currentUser = {
        id: "user-1",
        name: "Jamil Sagor (Super Admin)",
        email: "jmisagor079@gmail.com",
        profilePhoto: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100",
        role: AdminRole.SUPER_ADMIN,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        emailVerified: true,
        loyaltyPoints: 1250
      };
      db_users.push(currentUser);
    } else {
      currentUser.role = AdminRole.SUPER_ADMIN;
      currentUser.lastLogin = new Date().toISOString();
    }
  } else {
    // Normal client login simulation block
    if (!currentUser) {
      currentUser = {
        id: `user-${Date.now()}`,
        name: "Standard Client Importer",
        email: email.toLowerCase(),
        profilePhoto: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100",
        role: AdminRole.CUSTOMER,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        emailVerified: true,
        loyaltyPoints: 50
      };
      db_users.push(currentUser);
    } else {
      currentUser.lastLogin = new Date().toISOString();
    }
  }

  // Check if admin/staff roles: require 2FA OTP simulation prompt for security compliance!
  const isAdminSession = currentUser.role !== AdminRole.CUSTOMER;

  const resultPayload = {
    id: currentUser.id,
    name: currentUser.name,
    email: currentUser.email,
    role: currentUser.role
  };

  const token = generateSessionToken(resultPayload);

  if (isAdminSession) {
    // Prompt 2FA flow
    db_login_history.unshift({
      id: `login-${Date.now()}`,
      userEmail: currentUser.email,
      ip: clientIP,
      timestamp: new Date().toISOString(),
      twoFactorPassed: false // Awaiting OTP validation step
    });

    logActivity(currentUser.email, currentUser.role, "ADMIN_LOGIN_TFA_PENDING", `Credentials approved, initiating simulated two-factor OTP session. IP: ${clientIP}`, clientIP);

    return res.json({
      success: true,
      requireTwoFactor: true,
      pendingSession: {
        email: currentUser.email,
        role: currentUser.role,
        token
      },
      message: "🔐 Admin Security Checklist: Two-Factor authentication OTP code dispatched to verification log."
    });
  }

  // Client logs in directly
  db_login_history.unshift({
    id: `login-${Date.now()}`,
    userEmail: currentUser.email,
    ip: clientIP,
    timestamp: new Date().toISOString(),
    twoFactorPassed: true
  });

  logActivity(currentUser.email, currentUser.role, "USER_LOGIN_EMAIL", `Successful traditional email session. IP: ${clientIP}`, clientIP);

  res.json({
    success: true,
    user: currentUser,
    token,
    message: `Sign-in complete as ${currentUser.name}`
  });
});

// C. Verify 2FA OTP Authentication Code
app.post("/api/auth/verify-2fa", (req, res) => {
  const { email, code, token } = req.body;
  
  if (!email || !code) {
    return res.status(400).json({ error: "OTP value required." });
  }

  // Allow any 6-digit pin or standard "123456" simulator
  if (code.length < 6) {
    return res.status(400).json({ error: "Invalid OTP format. OTP must be a 6-digit verification code." });
  }

  const currentUser = db_users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!currentUser) {
    return res.status(404).json({ error: "Security session matching email not discovered." });
  }

  // Update most recent login history log to show passed 2FA
  const recentHistory = db_login_history.find(h => h.userEmail.toLowerCase() === email.toLowerCase());
  if (recentHistory) {
    recentHistory.twoFactorPassed = true;
  }

  logActivity(currentUser.email, currentUser.role, "ADMIN_LOGIN_TFA_COMPLETE", "Simulated two-factor token confirmed.", req.ip || "127.0.0.1");

  res.json({
    success: true,
    user: currentUser,
    token,
    message: `🔐 Identity verified. Operational admin console unlocked as ${currentUser.role}`
  });
});


// ==========================================
// OPERATIONAL DATABASE APIs (FEATURE 5 & 8)
// ==========================================

// 1. Users Listing & Management (RUA Roles & Auth)
app.get("/api/admin/users", (req: any, res) => {
  // Check authorization in actual production: (only list if logged-in is super admin/admin)
  res.json({ users: db_users });
});

app.post("/api/admin/users", (req: any, res) => {
  const { name, email, role } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: "Verify user details before creating registry record." });
  }

  const userExists = db_users.some(u => u.email.toLowerCase() === email.toLowerCase());
  if (userExists) {
    return res.status(400).json({ error: "A user registry matching this email address is already active." });
  }

  const newUser: User = {
    id: `user-${Date.now()}`,
    name,
    email: email.toLowerCase(),
    profilePhoto: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100",
    role: role || AdminRole.CUSTOMER,
    createdAt: new Date().toISOString(),
    lastLogin: "-",
    emailVerified: true,
    loyaltyPoints: 0
  };

  db_users.push(newUser);
  logActivity("admin@chinagiftshop.com", "Admin", "USER_CREATE", `Provisioned new user account: ${email} with role: ${role}`);
  res.json({ success: true, user: newUser });
});

// Update User (Role-based CRUD setup)
app.put("/api/admin/users/:id", (req: any, res) => {
  const { id } = req.params;
  const { name, role, emailVerified, loyaltyPoints } = req.body;

  const userIdx = db_users.findIndex(u => u.id === id);
  if (userIdx === -1) {
    return res.status(404).json({ error: "User record not found." });
  }

  // Protect the Super Admin account from edits by normal admins
  if (db_users[userIdx].email.toLowerCase() === "jmisagor079@gmail.com") {
    // Unrestricted bypass, but refuse downgrade
    if (role && role !== AdminRole.SUPER_ADMIN) {
      return res.status(403).json({ error: "Developer Permanent Super Admin cannot be downgraded or mutated." });
    }
  }

  db_users[userIdx] = {
    ...db_users[userIdx],
    ...(name && { name }),
    ...(role && { role }),
    ...(emailVerified !== undefined && { emailVerified }),
    ...(loyaltyPoints !== undefined && { loyaltyPoints: parseInt(loyaltyPoints) })
  };

  logActivity("admin@chinagiftshop.com", "Admin", "USER_UPDATE", `Mutated properties for user record ID: ${id}`);
  res.json({ success: true, user: db_users[userIdx] });
});

// Delete user record from registry
app.delete("/api/admin/users/:id", (req: any, res) => {
  const { id } = req.params;
  const userIdx = db_users.findIndex(u => u.id === id);

  if (userIdx === -1) {
    return res.status(404).json({ error: "User is absent." });
  }

  if (db_users[userIdx].email.toLowerCase() === "jmisagor079@gmail.com") {
    return res.status(403).json({ error: "Fatal error: The permanent Super Admin account 'jmisagor079@gmail.com' is fully protected from removal." });
  }

  const deletedEmail = db_users[userIdx].email;
  db_users.splice(userIdx, 1);
  logActivity("admin@chinagiftshop.com", "Admin", "USER_DELETE", `Purged user account matching: ${deletedEmail}`);
  res.json({ success: true, message: `Successfully removed user coordinate ${deletedEmail}` });
});

// 2. Warehouses Listing
app.get("/api/admin/warehouses", (req, res) => {
  res.json({ warehouses: db_warehouses });
});

// 3. Suppliers Managing
app.get("/api/admin/suppliers", (req, res) => {
  res.json({ suppliers: db_suppliers });
});

// 4. Coupons Database REST API
app.get("/api/admin/coupons", (req, res) => {
  res.json({ coupons: db_coupons });
});

app.post("/api/admin/coupons", (req, res) => {
  const { code, discountType, value, minPurchase } = req.body;
  if (!code || !value) {
    return res.status(400).json({ error: "All coupon coordinates require validation values." });
  }

  const exists = db_coupons.some(c => c.code.toUpperCase() === code.trim().toUpperCase());
  if (exists) {
    return res.status(400).json({ error: "Coupon with this code is already active in database database." });
  }

  const newCoupon: Coupon = {
    code: code.trim().toUpperCase(),
    discountType: discountType || "PERCENTAGE",
    value: parseFloat(value),
    minPurchase: parseFloat(minPurchase) || 0,
    active: true,
    usedCount: 0
  };

  db_coupons.push(newCoupon);
  logActivity("admin@chinagiftshop.com", "Admin", "COUPON_CREATE", `Created new store discount coupon: ${newCoupon.code}`);
  res.json({ success: true, coupon: newCoupon });
});

app.delete("/api/admin/coupons/:code", (req, res) => {
  const { code } = req.params;
  const idx = db_coupons.findIndex(c => c.code.toUpperCase() === code.toUpperCase());
  if (idx !== -1) {
    db_coupons.splice(idx, 1);
    logActivity("admin@chinagiftshop.com", "Admin", "COUPON_DELETE", `Purged coupon: ${code}`);
    res.json({ success: true, message: "Coupon code retired successfully." });
  } else {
    res.status(404).json({ error: "Coupon does not exist." });
  }
});

// 5. Activity Ledger and Login Audit Tracks
app.get("/api/admin/logs", (req, res) => {
  res.json({ logs: db_activity_logs });
});

app.get("/api/admin/login-history", (req, res) => {
  res.json({ loginHistory: db_login_history });
});

// 6. Support Tickets Console Operations
app.get("/api/admin/support-tickets", (req, res) => {
  res.json({ tickets: db_support_tickets });
});

app.post("/api/admin/support-tickets/:id/reply", (req, res) => {
  const { id } = req.params;
  const { reply } = req.body;

  const ticket = db_support_tickets.find(t => t.id === id);
  if (ticket) {
    ticket.reply = reply;
    ticket.status = "RESOLVED";
    logActivity("admin@chinagiftshop.com", "Admin", "SUPPORT_TICKET_REPLY", `Dispatched resolution response log to Ticket ID: ${id}`);
    res.json({ success: true, ticket });
  } else {
    res.status(404).json({ error: "Ticket not found" });
  }
});

// Add user query support tickets trigger
app.post("/api/support-tickets", (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!email || !message) {
    return res.status(400).json({ error: "Missing coordinates." });
  }

  const newTicket: SupportTicket = {
    id: `TCK-${Math.floor(1000 + Math.random() * 9000)}`,
    customerName: name || "Anonymous client",
    customerEmail: email,
    subject: subject || "General Inquiry",
    message,
    status: "OPEN",
    createdAt: new Date().toISOString()
  };

  db_support_tickets.push(newTicket);
  res.json({ success: true, ticket: newTicket });
});


// 10. AI Smart Product Advisor and Customer Support Chatbot
app.post("/api/chat", async (req, res) => {
  const { message, chatHistory } = req.body;
  
  if (!message) {
    return res.status(400).json({ error: "Message content cannot be blank." });
  }

  const client = getGeminiClient();

  // Construct a background system directive detailing products list & shipping modes
  const productSummary = tempProducts.map(p => 
    `- [ID: ${p.id}] ${p.name}: ${p.discountedPrice} BDT (Original: ${p.originalPrice} BDT). Fulfillment Origin: ${p.origin} (Delivery in ${p.deliveryTime}). Stock level: ${p.stockCount} left.`
  ).join("\n");

  const chatbotSystemInstruction = `You are a professional and friendly e-commerce support AI named "China Gift Shop Assistant". We sell authentic gifts, premium tech gadgets, lifestyle home essentials, and fashion accessories.
Important business structure coordinates to answer customers with:
- Bangladesh Warehouse model: 1-3 business days fast local transit, COD (Cash on Delivery) is fully supported, easy local replacements here in Bangladesh.
- Direct from China model: Ships from Chinese factories, arrives in 25-30 days to Bangladesh, offers lower prices and a larger imported variety with complete international shipment tracking and border customs handled by China Gift Shop itself.
We support payment methods such as: bKash, Nagad, Rocket, Visa/Mastercard for local items, or standard International credit/debit cards & PayPal.
Current Available Store Inventory catalog to recommend:
${productSummary}

Your goals:
1. Promote and search the appropriate products. Recommend konkrét items using their exact name, prices (in BDT) and highlight their stock source clearly (either "Bangladesh Warehouse" with fast shipping, or "China Supplier" with massive discount).
2. Answer about order status, international custom security clearance or fast local delivery.
3. Be friendly and highly responsive to help customers. Keep replies elegantly formatted with bullet points for readability.`;

  if (client) {
    try {
      const formattedHistory = (chatHistory || []).map((h: ChatMessage) => ({
        role: h.sender === "user" ? "user" : "model",
        parts: [{ text: h.text }]
      }));

      // Append user's new message
      formattedHistory.push({
        role: "user",
        parts: [{ text: message }]
      });

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: formattedHistory,
        config: {
          systemInstruction: chatbotSystemInstruction,
          temperature: 0.7
        }
      });

      const aiText = response.text || "I apologize, but I am processing a lot of customer catalog data right now. Could you please repeat that?";
      res.json({ text: aiText });
    } catch (err) {
      logError("Gemini generation fails: " + err);
      res.json({ text: getRuleBasedResponse(message) });
    }
  } else {
    // Run rule-based smart advisor fallback if key is missing
    const fallbackMessage = getRuleBasedResponse(message);
    res.json({ text: fallbackMessage });
  }
});

// Smart Rule-based AI model text simulator
function getRuleBasedResponse(userQuery: string): string {
  const q = userQuery.toLowerCase();
  
  if (q.includes("delivery") || q.includes("shipping") || q.includes("time") || q.includes("how long")) {
    return `📦 **Shipping & Delivery Framework:**
• **Local Stocks (Bangladesh Warehouses):** Takes **1 to 3 business days** to arrive across Bangladesh. Fully compatible with **Cash on Delivery (COD)**, Nagad, Rocket, and bKash.
• **China Direct Imports:** Ships directly from Chinese suppliers, taking **25 to 30 days**. We manage all import customs duties and logistics. Full international tracking is included! 
How can I help you choose the best shipping option for your gifts?`;
  }
  
  if (q.includes("payment") || q.includes("cod") || q.includes("bkash") || q.includes("nagad")) {
    return `💳 **Payment Options Available:**
• **For Bangladesh Warehouse items:** Cash on Delivery (COD), bKash, Nagad, Rocket, and local debit/credit cards.
• **For China Direct items:** Standard online prepayment through Visa, Mastercard, American Express, or PayPal to initiate the supplier packing sequence.
All checkouts are fully SSL secured for absolute buyer safety!`;
  }

  if (q.includes("best seller") || q.includes("bestseller") || q.includes("top") || q.includes("recommend")) {
    const bestSeller = INITIAL_PRODUCTS.find(p => p.isBestSeller);
    return `🔥 **Top Store Recommendations:**
I highly recommend checking out some of our current bestsellers:
1. **${bestSeller?.name}**: ${bestSeller?.discountedPrice} BDT (Fulfillled from: *${bestSeller?.origin}* with 1-3 day arrival time).
2. **Retro Steampunk Mechanical Keyboard**: 4,800 BDT (Imported from: *China Supplier*, savings over 40% with premium typing click response!).
Would you like me to help you add any of these items to your cart?`;
  }

  if (q.includes("gift") || q.includes("decor") || q.includes("rose") || q.includes("quartz")) {
    return `🎁 **Gifts & Novelties Catalog Features:**
We have majestic gift tokens stocked inside Dhaka warehouses:
• **Rose Quartz Eternal Music Box** (2,950 BDT) - Features mechanical windup crystal chime.
• **Vintage Leather Journal Writing Kit** (2,200 BDT) - Made of heavy bovine crazy horse leather & brass quill.
Would you like me to guide your selection for a birthday or anniversary present?`;
  }

  if (q.includes("electronic") || q.includes("gadget") || q.includes("smart") || q.includes("watch") || q.includes("projector")) {
    return `⚡ **Gadgets & Electronics Catalog:**
• **Nebula Starry Sky Projector 2.0** (1,999 BDT) - Stocked locally in Dhaka warehouse. Excellent for sensory bedrooms!
• **Sports Active Pro Smart Watch** (3,850 BDT) - Certified AMOLED health fitness metric calculator.
• **Cyberpunk Transparent BT Speaker** (1,780 BDT) - Superb exposed hardware with multi-sequence rgb subwoofers.
Would you like to explore any tech specifications in detail?`;
  }

  if (q.includes("customs") || q.includes("tax") || q.includes("border")) {
    return `🛂 **China Import Customs Handling:**
No tax worries! For all **Direct from China** products, **China Gift Shop completely absorbs import duties**, Customs Clearance processes, and value-added taxes inside Bangladesh. The checkout pricing listed is absolute and fully inclusive!`;
  }

  return `👋 **Welcome to China Gift Shop Assistant!**
I can help you browse our exclusive gift shop, locate specific tech accessories or beauty imports, calculate shipping, and trace your active orders!

**Quick Commands you can ask me:**
• *How long does shipping take from China vs Bangladesh?*
• *What are your best-selling gifts?*
• *Are custom duties and taxes handled dynamically for imports?*
• *Which gadgets are eligible for Cash on Delivery?*

Let me know what you are looking for today!`;
}

// ----------------------------------------------------
// BOOTSTRAP VITE MIDDLEWARE OR STATIC SERVER
// ----------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    logInfo("Starting Vite in developers integration middleware mode...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    // Mount Vite dev server middlewares
    app.use(vite.middlewares);
  } else {
    logInfo("Serving pre-compiled client assets in production mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    logInfo(`Server operational at http://localhost:${PORT}`);
  });
}

startServer();
