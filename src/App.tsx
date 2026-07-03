import React, { useState, useEffect } from "react";
import { 
  ShoppingBag, 
  MapPin, 
  Heart, 
  User, 
  Search, 
  ChevronDown, 
  Clock, 
  ShieldCheck, 
  ShoppingCart, 
  HelpCircle, 
  Globe, 
  PhoneCall, 
  Star, 
  X, 
  Info, 
  CheckCircle, 
  AlertTriangle,
  Gift, 
  Cpu, 
  Home, 
  Sparkles,
  ArrowRight,
  Eye,
  Settings,
  DollarSign,
  Truck,
  Bell,
  Package,
  LayoutGrid
} from "lucide-react";
import { Product, CartItem, Order, OrderStatus, ShippingOrigin } from "./types";
import AiChat from "./components/AiChat";
import AdminPanel from "./components/AdminPanel";
import ProductDetailsPage from "./components/ProductDetailsPage";
const brandLogo = "/src/assets/images/one_percent_logo_1783105468778.jpg";

// Currency Configuration rates relative to BDT
const CURRENCIES = {
  BDT: { code: "BDT", symbol: "৳", rate: 1.0 },
  USD: { code: "USD", symbol: "$", rate: 0.0085 },
  CNY: { code: "CNY", symbol: "¥", rate: 0.061 }
} as const;

type CurrencyKey = keyof typeof CURRENCIES;

// Multilingual translations database
const TRANSLATIONS = {
  en: {
    announcement: "Fast Delivery from Bangladesh Warehouses | Direct Shipping from China",
    heroTitle: "All Your Favorites, One Gift Shop",
    heroSubtitle: "Thousands of high-quality premium gifts, gadgets, smart electronics and fashion accessories with fast local Bangladesh delivery or direct shipping from China suppliers.",
    shopBD: "Shop Bangladesh Warehouse",
    shopChina: "Shop Direct from China",
    trackingTitle: "Track Shipment",
    helpCenter: "Help Center",
    searchPlaceholder: "Search thousands of gifts, gadgets and electronics...",
    searchBtn: "SEARCH",
    categoriesTitle: "Product Categories",
    bestDeals: "Best Deals & Discounts",
    trending: "Trending Products",
    newArrivals: "New Arrivals",
    electronics: "Electronics & Gadgets",
    gifts: "Gifts & Decorations",
    homeKitchen: "Home Essentials",
    importedChina: "Imported Sourced from China",
    fastLocalTitle: "Fast Local Delivery (1-3 Days)",
    cartTitle: "Your Shopping Cart",
    checkoutTitle: "Secure Checkout Portal",
    trackOrderHeader: "Logistics Timeline Tracker",
    userAccount: "User Dashboard",
    adminControl: "Admin Control Console",
    comparTitle: "Fulfillment Model Comparison",
    viewDetail: "View Specifications & Gallery"
  },
  bn: {
    announcement: "বাংলাদেশ ওয়্যারহাউস থেকে দ্রুত ডেলিভারি | চীন থেকে সরাসরি শিপিং",
    heroTitle: "আপনার সব পছন্দের উপহার, একই শপে",
    heroSubtitle: "হাজার হাজার প্রিমিয়াম উপহার, আধুনিক গ্যাজেট এবং লাইফস্টাইল পণ্য। ১-৩ দিনে দ্রুত ডেলিভারি অথবা চীন থেকে সস্তা মূল্যে সরাসরি শিপিং।",
    shopBD: "বাংলাদেশ ওয়্যারহাউস কালেকশন",
    shopChina: "চীন ডিরেক্ট কালেকশন",
    trackingTitle: "অর্ডার ট্র্যাক করুন",
    helpCenter: "সাহায্য কেন্দ্র",
    searchPlaceholder: "হাজার হাজার উপহার এবং ইলেকট্রনিক্স খুঁজুন...",
    searchBtn: "সার্চ",
    categoriesTitle: "ক্যাটাগরি সমূহ",
    bestDeals: "সেরা ডিল এবং অফার",
    trending: "জনপ্রিয় পণ্যসমূহ",
    newArrivals: "নতুন কালেকশন",
    electronics: "ইলেকট্রনিক্স ও গ্যাজেট",
    gifts: "উপহার ও সাজসজ্জা",
    homeKitchen: "গৃহস্থালী সামগ্রী",
    importedChina: "চীন থেকে সরাসরি আমদানিকৃত",
    fastLocalTitle: "দ্রুত লোকাল ডেলিভারি (১-৩ দিন)",
    cartTitle: "আপনার শপিং কার্ট",
    checkoutTitle: "নিরাপদ চেকআউট পোর্টাল",
    trackOrderHeader: "শিপমেন্ট ট্র্যাকিং টাইমলাইন",
    userAccount: "ইউজার ড্যাশবোর্ড",
    adminControl: "অ্যাডমিন কন্ট্রোল সেন্টার",
    comparTitle: "শিপিং মডেল তুলনা বিবরণী",
    viewDetail: "ডিটেইলস ও গ্যালারি দেখুন"
  },
  zh: {
    announcement: "孟加拉国仓库快速发货 | 中国供货商直邮海外",
    heroTitle: "您最喜爱的一站式礼品屋",
    heroSubtitle: "数千款高品质精选礼品、智能电子产品及家居配件。提供快速的孟加拉当地仓储派送，或超值的中国原产地直接邮寄服务。",
    shopBD: "选购孟加拉本土仓储",
    shopChina: "选购中国厂家直邮",
    trackingTitle: "跟踪订单进度",
    helpCenter: "客户服务中心",
    searchPlaceholder: "搜索数千款礼品、新奇创意配件及智能设备...",
    searchBtn: "搜索",
    categoriesTitle: "全部分类",
    bestDeals: "限时秒杀折扣区",
    trending: "当季热卖人气推荐",
    newArrivals: "最新到货新品区",
    electronics: "数码电子 & 智能硬件",
    gifts: "精美礼品 & 中国结挂件",
    homeKitchen: "舒适家居百货",
    importedChina: "中国直邮精品",
    fastLocalTitle: "孟加拉闪电发货 (1-3天)",
    cartTitle: "购物车清单",
    checkoutTitle: "安全结账通道",
    trackOrderHeader: "物流进度实时追踪",
    userAccount: "个人中心仪表盘",
    adminControl: "商家后台管理控制台",
    comparTitle: "两种物流模式详解对比",
    viewDetail: "查看商品详情和画册"
  },
  ar: {
    announcement: "تسليم سريع من مستودعات بنغلاديش | شحن مباشر من الصين",
    heroTitle: "كل مفضلاتك في متجر هدايا واحد",
    heroSubtitle: "الآلاف من الهدايا المتميزة والأجهزة الذكية مع توصيل سريع في بنغلاديش أو شحن اقتصادي مباشر من الموردين في الصين.",
    shopBD: "تسوق من مستودع بنغلاديش",
    shopChina: "تسوق شحن مباشر من الصين",
    trackingTitle: "تتبع الشحنة",
    helpCenter: "مركز المساعدة",
    searchPlaceholder: "ابحث عن آلاف الهدايا والأجهزة...",
    searchBtn: "بحث",
    categoriesTitle: "تصنيفات المنتجات",
    bestDeals: "أفضل الصفقات والخصومات",
    trending: "المنتجات الأكثر رواجاً",
    newArrivals: "وصول حديث",
    electronics: "الأجهزة والإلكترونيات",
    gifts: "الهدايا والديكورات",
    homeKitchen: "المستلزمات المنزلية",
    importedChina: "مستورد مباشرة من الصين",
    fastLocalTitle: "توصيل محلي سريع (1-3 أيام)",
    cartTitle: "سلة المشتريات",
    checkoutTitle: "بوابة الدفع الآمنة",
    trackOrderHeader: "مخطط تتبع الشحنات",
    userAccount: "لوحة حساب المستخدم",
    adminControl: "콘ソール وحدة تحكم المشرف",
    comparTitle: "مقارنة نماذج الشحن والتلسيم",
    viewDetail: "عرض التفاصيل والمعرض"
  },
  hi: {
    announcement: "बांग्लादेश गोदामों से तेज़ डिलीवरी | चीन से सीधे शिपिंग",
    heroTitle: "आपकी सभी पसंदीदा चीज़ें, एक ही गिफ्ट शॉप पर",
    heroSubtitle: "हज़ार प्रीयम तोहफ़े, इलेक्ट्रॉनिक्स, गैजेट्स और लाइफस्टाइल प्रोडक्ट्स। बांग्लादेश लोकल डिलीवरी (1-3 दिन) या चीन सप्लायर से सीधे कम दामों में आयात।",
    shopBD: "बांग्लादेश गोदाम से खरीदें",
    shopChina: "सीधे चीन से मंगाए",
    trackingTitle: "ऑर्डर ट्रैक करें",
    helpCenter: "सहायता केंद्र",
    searchPlaceholder: "हजारों उपहार, टेक आइटम खोजें...",
    searchBtn: "खोजें",
    categoriesTitle: "श्रेणियाँ",
    bestDeals: "सर्वश्रेष्ठ डील्स और छूट",
    trending: "रुझान वाले उत्पाद",
    newArrivals: "नए प्रोडक्ट्स",
    electronics: "इलेक्ट्रॉनिक्स और गैजेट्स",
    gifts: "उपहार और सजावट",
    homeKitchen: "घरेलू उत्पाद",
    importedChina: "चीन से सीधे आयातित",
    fastLocalTitle: "तेज़ स्थानीय वितरण (1-3 दिन)",
    cartTitle: "आपकी कार्ट",
    checkoutTitle: "सुरक्षित पेमेंट गेटवे",
    trackOrderHeader: "लॉजिस्टिक्स ट्रैकिंग टाइमलाइन",
    userAccount: "ग्राहक डैशबोर्ड",
    adminControl: "एडमिन कंट्रोल पैनल",
    comparTitle: "शिपिंग मॉडल तुलना सारणी",
    viewDetail: "विवरण और गैलरी देखें"
  }
} as const;

type LanguageKey = keyof typeof TRANSLATIONS;

export default function App() {
  // Navigation & view state management
  const [currentView, setCurrentView] = useState<"home" | "cart" | "checkout" | "track" | "dashboard" | "admin" | "help" | "product-details">("home");
  const [currentLang, setCurrentLang] = useState<LanguageKey>("en");
  const [currentCurrency, setCurrentCurrency] = useState<CurrencyKey>("BDT");
  
  // Products catalog dynamic state from Express server
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedOriginFilter, setSelectedOriginFilter] = useState<"all" | "BD" | "China">("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Product zoom state
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({});

  // Chat/Support Help trigger states
  const [newFAQQuestion, setNewFAQQuestion] = useState("");
  const [faqList, setFaqList] = useState([
    { question: "How safe is Cash on Delivery in Bangladesh?", answer: "Extremely secure. Our partnered local couriers bring the package directly to your doorstep. You inspect the product, then pay via cash or local mobile banking standard (bKash/Nagad)." },
    { question: "Are custom duties pre-calculated for items directly from Chinese Suppliers?", answer: "Yes, fully! 1% of China handles 100% of custom clearance fees, international taxation, and import cargo logistics. The price you pay in your checkout cart is final - zero hidden surcharges at delivery." },
    { question: "How can I request replacement for broken gifts?", answer: "For BD Stock warehouse items, we provide a 7-day hassle-free replacement framework. Open a ticket or live-chat with us, and our Dhaka collection team will swap the item." }
  ]);

  // Cart state management
  const [cart, setCart] = useState<CartItem[]>([]);
  const [promoCode, setPromoCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0); // in BDT
  const [couponStatus, setCouponStatus] = useState<string | null>(null);

  // Authentication & Google Session state handlers
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return !!localStorage.getItem("token");
  });
  const [loggedInUser, setLoggedInUser] = useState<any>(() => {
    try {
      const saved = localStorage.getItem("user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);
  const [authSuccessCallback, setAuthSuccessCallback] = useState<any>(null);

  // States for interactive custom auth popup
  const [emailForm, setEmailForm] = useState("");
  const [passwordForm, setPasswordForm] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);

  // Simulated 2FA authentication states for Super admin Email
  const [isOtpOverlayOpen, setIsOtpOverlayOpen] = useState(false);
  const [otpInput, setOtpInput] = useState("");
  const [pendingUserSessionToken, setPendingUserSessionToken] = useState("");
  const [pendingUserMeta, setPendingUserMeta] = useState<any>(null);

  // Buy Now item flow
  const [buyNowItem, setBuyNowItem] = useState<{
    product: Product;
    selectedVariant: any;
    quantity: number;
  } | null>(null);

  // User details & Simulation addresses (computed dynamically from logged-in user or guest details)
  const [userEmail, setUserEmail] = useState(() => {
    try {
      const saved = localStorage.getItem("user");
      return saved ? JSON.parse(saved).email : "guest@chinagiftshop.com";
    } catch {
      return "guest@chinagiftshop.com";
    }
  });

  const [userName, setUserName] = useState(() => {
    try {
      const saved = localStorage.getItem("user");
      return saved ? JSON.parse(saved).name : "Guest User";
    } catch {
      return "Guest User";
    }
  });

  const [userPhone, setUserPhone] = useState("+880 1712-345678");
  const [userAddress, setUserAddress] = useState("House 24, Road 4, Dhanmondi R/A, Dhaka 1209, Bangladesh");
  
  const [billingInput, setBillingInput] = useState({
    name: "Guest User",
    email: "guest@chinagiftshop.com",
    address: "House 24, Road 4, Dhanmondi R/A, Dhaka 1209, Bangladesh",
    phone: "+880 1712-345678",
    paymentMethod: "bKash"
  });

  // Keep billing input in sync with logged-in credentials!
  useEffect(() => {
    if (loggedInUser) {
      setUserEmail(loggedInUser.email);
      setUserName(loggedInUser.name);
      setBillingInput(prev => ({
        ...prev,
        name: loggedInUser.name,
        email: loggedInUser.email
      }));
    } else {
      setUserEmail("guest@chinagiftshop.com");
      setUserName("Guest User");
      setBillingInput(prev => ({
        ...prev,
        name: "Guest User",
        email: "guest@chinagiftshop.com"
      }));
    }
  }, [loggedInUser]);

  // Auth Guard helper utility
  const checkAuthOrOpenLogin = (onSuccess: () => void) => {
    if (localStorage.getItem("token")) {
      onSuccess();
    } else {
      setAuthSuccessCallback(() => onSuccess);
      setIsLoginPopupOpen(true);
    }
  };

  // Traditional email and password mock authentication client
  const handleEmailLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    try {
      const res = await fetch("/api/auth/email-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailForm, password: passwordForm })
      });
      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.error || "Login credentials verification error");
        return;
      }
      if (data.requireTwoFactor) {
        // We require 2FA, trigger Temp otp states
        setPendingUserSessionToken(data.pendingSession.token);
        setPendingUserMeta(data.pendingSession);
        setIsOtpOverlayOpen(true);
      } else {
        // Standard client logged in directly
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setIsLoggedIn(true);
        setLoggedInUser(data.user);
        setIsLoginPopupOpen(false);
        alert(`Successfully signed in as ${data.user.name}`);
        if (authSuccessCallback) {
          authSuccessCallback();
          setAuthSuccessCallback(null);
        }
      }
    } catch (err) {
      setAuthError("Server communication diagnostic error.");
    }
  };

  // Fast Google Sign-In identity syncer simulation
  const handleGoogleSignInSimulated = async () => {
    setAuthError(null);
    try {
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Jamil Sagor",
          email: "jmisagor079@gmail.com",
          profilePhoto: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100"
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.error || "Google Identity service handshake failed.");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setIsLoggedIn(true);
      setLoggedInUser(data.user);
      setIsLoginPopupOpen(false);

      alert(`Successfully synchronized Google profile as: ${data.user.name}`);

      if (authSuccessCallback) {
        authSuccessCallback();
        setAuthSuccessCallback(null);
      }
    } catch (err) {
      setAuthError("Google authentication servers unavailable.");
    }
  };

  // Submit 6 digit simulated verification code
  const handleVerify2FaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    try {
      const res = await fetch("/api/auth/verify-2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: pendingUserMeta?.email,
          code: otpInput,
          token: pendingUserSessionToken
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.error || "Simulated pass validation code mismatch. Try: 123456");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setIsLoggedIn(true);
      setLoggedInUser(data.user);
      setIsOtpOverlayOpen(false);
      setIsLoginPopupOpen(false);

      alert(`🎉 2FA Security Access Authenticated! Welcome Super Admin Jamil!`);

      if (authSuccessCallback) {
        authSuccessCallback();
        setAuthSuccessCallback(null);
      }
    } catch (err) {
      setAuthError("Identity verifier system failure.");
    }
  };

  // Tracking query
  const [searchTrackId, setSearchTrackId] = useState("");
  const [lookedUpOrder, setLookedUpOrder] = useState<Order | null>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);

  // Orders array directly loaded from Express backend
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  
  // Wishlist bookmark ids array
  const [wishlist, setWishlist] = useState<string[]>([]);

  // Category array definitions
  const CATEGORIES = [
    "All",
    "Barcode Scanners",
    "Document Scanners",
    "Wearable Scanners",
    "Handheld Scanners",
    "Industrial Scanners",
    "Label Printers"
  ];

  // Load products list on mount
  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, [selectedCategory, selectedOriginFilter, searchQuery, userEmail]);

  // Sync details from selected product variant automatically
  useEffect(() => {
    if (selectedProduct && selectedProduct.variants.length > 0) {
      setSelectedVariant(selectedProduct.variants[0]);
    } else {
      setSelectedVariant(null);
    }
    setActiveGalleryIndex(0);
  }, [selectedProduct]);

  const fetchProducts = async () => {
    try {
      let url = "/api/products?";
      if (selectedCategory !== "All") {
        url += `category=${encodeURIComponent(selectedCategory)}&`;
      }
      if (selectedOriginFilter === "BD") {
        url += "origin=BD&";
      } else if (selectedOriginFilter === "China") {
        url += "origin=China&";
      }
      if (searchQuery.trim() !== "") {
        url += `query=${encodeURIComponent(searchQuery)}&`;
      }

      const res = await fetch(url);
      const data = await res.json();
      if (data.products) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error("Error communicating with servers:", err);
    }
  };

  const fetchOrders = async () => {
    try {
      const activeMail = localStorage.getItem("user") 
        ? JSON.parse(localStorage.getItem("user")!).email 
        : userEmail;
      const res = await fetch(`/api/orders?email=${activeMail}`);
      const data = await res.json();
      if (data.orders) {
        setAllOrders(data.orders);
        // default default tracking search to newest order if active
        if (data.orders.length > 0 && !searchTrackId) {
          setSearchTrackId(data.orders[0].id);
          setLookedUpOrder(data.orders[0]);
        }
      }
    } catch (err) {
      console.error("Error reading orders data:", err);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
  };

  // Cart operations
  const handleBuyNow = (product: Product, variant = selectedVariant) => {
    setBuyNowItem({
      product,
      selectedVariant: variant || product.variants[0] || null,
      quantity: 1
    });
    // Skip cart, open checkout directly
    setCurrentView("checkout");
  };

  const handleAddToCart = (product: Product, customVar = selectedVariant) => {
    setCart((prevCart) => {
      const existingIdx = prevCart.findIndex(
        (item) => item.product.id === product.id && 
                  (!item.selectedVariant || (item.selectedVariant.id === customVar?.id))
      );
      if (existingIdx !== -1) {
        const next = [...prevCart];
        next[existingIdx].quantity += 1;
        return next;
      }
      return [...prevCart, { product, selectedVariant: customVar, quantity: 1 }];
    });
    // Visual flash confirmation feedback
    alert(`Successfully added "${product.name}"${customVar ? ` (${customVar.name})` : ""} to your shopping cart!`);
  };

  const handleUpdateCartQty = (idx: number, change: number) => {
    setCart((prevCart) => {
      const copy = [...prevCart];
      const newQty = copy[idx].quantity + change;
      if (newQty <= 0) {
        copy.splice(idx, 1);
      } else {
        copy[idx].quantity = newQty;
      }
      return copy;
    });
  };

  const getCartTotals = () => {
    if (buyNowItem) {
      const price = buyNowItem.product.discountedPrice + (buyNowItem.selectedVariant?.priceModifier || 0);
      const subtotal = price * buyNowItem.quantity;
      const shipping = buyNowItem.product.shippingCost;
      const tax = subtotal * 0.05; // 5% standard BDT tax
      const total = subtotal + shipping + tax - appliedDiscount;
      return { subtotal, shipping, tax, total };
    }

    let subtotal = 0;
    let shipping = 0;
    cart.forEach(item => {
      const price = item.product.discountedPrice + (item.selectedVariant?.priceModifier || 0);
      subtotal += price * item.quantity;
      shipping = Math.max(shipping, item.product.shippingCost); // calculate one absolute maximum shipping cost
    });
    const tax = subtotal * 0.05; // 5% standard BDT tax
    const total = subtotal + shipping + tax - appliedDiscount;
    return { subtotal, shipping, tax, total };
  };

  const handleApplyCoupon = () => {
    const code = promoCode.trim().toUpperCase();
    const { subtotal } = getCartTotals();
    
    if (code === "WELCOME2026") {
      setAppliedDiscount(Math.floor(subtotal * 0.2));
      setCouponStatus("SUCCESS: 20% WELCOME Promo discount applied!");
    } else if (code === "FASTBD" && cart.some(i => i.product.origin === ShippingOrigin.BANGLADESH)) {
      setAppliedDiscount(300);
      setCouponStatus("SUCCESS: Flat 300 BDT off applied on local stash items!");
    } else if (code === "CHINAFREE") {
      setAppliedDiscount(150);
      setCouponStatus("SUCCESS: 150 BDT direct-supplier handling refund applied!");
    } else {
      setCouponStatus("ERROR: Coupon code invalid or conditions unmet.");
      setAppliedDiscount(0);
    }
  };

  // Checkout submission
  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyNowItem && cart.length === 0) {
      alert("Please add items to your cart first.");
      return;
    }
    
    const { shipping } = getCartTotals();
    const itemsPayload = buyNowItem 
      ? [{ product: buyNowItem.product, selectedVariant: buyNowItem?.selectedVariant, quantity: buyNowItem.quantity }]
      : cart;

    try {
      const orderData = {
        customerName: billingInput.name,
        customerEmail: billingInput.email,
        customerAddress: billingInput.address,
        customerPhone: billingInput.phone,
        items: itemsPayload,
        paymentMethod: billingInput.paymentMethod,
        discount: appliedDiscount
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData)
      });

      if (!res.ok) throw new Error("Server checkout reject");
      const block = await res.json();
      
      if (block.success && block.order) {
        // Clear variables
        setCart([]);
        setBuyNowItem(null);
        setPromoCode("");
        setAppliedDiscount(0);
        setCouponStatus(null);
        
        // Push view directly to tracking details
        setSearchTrackId(block.order.id);
        setLookedUpOrder(block.order);
        setCurrentView("track");
        
        // Refresh local memory lists
        fetchProducts();
        fetchOrders();
        
        alert(`🎉 Awesome! Order Created Successfully. Thank you for your support!\nYour Tracking ID: ${block.order.id}`);
      }
    } catch (err) {
      alert("Checkout error. Please verify input fields or try cash on delivery.");
    }
  };

  // Search track timeline
  const handleTrackQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    setLookupError(null);
    if (!searchTrackId.trim()) return;

    try {
      const res = await fetch(`/api/orders/${searchTrackId.trim().toUpperCase()}`);
      if (!res.ok) {
        setLookupError("Verify order identification code. No records matching: " + searchTrackId);
        setLookedUpOrder(null);
        return;
      }
      const data = await res.json();
      if (data.order) {
        setLookedUpOrder(data.order);
      } else {
        setLookupError("Invalid Tracking credentials");
      }
    } catch (err) {
      setLookupError("Network diagnostic error. Could not query tracking states.");
    }
  };

  // Toggle user wishlist
  const toggleWishlist = (pid: string) => {
    setWishlist(prev => 
      prev.includes(pid) ? prev.filter(id => id !== pid) : [...prev, pid]
    );
  };

  // Admin operational wrappers
  const handleAddProductAdmin = async (prodData: any) => {
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prodData)
      });
      if (res.ok) {
        fetchProducts();
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  const handleEditProductAdmin = async (id: string, updatedData: any) => {
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData)
      });
      if (res.ok) {
        fetchProducts();
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  const handleDeleteProductAdmin = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return false;
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        fetchProducts();
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  const handleUpdateOrderStatusAdmin = async (orderId: string, status: OrderStatus, details?: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, stepDetails: details })
      });
      if (res.ok) {
        fetchOrders();
        // also dynamically update looked up tracking order page context instantly
        if (lookedUpOrder?.id === orderId) {
          const updatedRes = await fetch(`/api/orders/${orderId}`);
          const updatedJson = await updatedRes.json();
          setLookedUpOrder(updatedJson.order);
        }
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  const handleResetDatabaseAdmin = async () => {
    if (!confirm("Reset shop items to standard starting set?")) return;
    try {
      const res = await fetch("/api/admin/products/reset", { method: "POST" });
      if (res.ok) {
        fetchProducts();
        alert("Store catalogs reset to original beautiful configuration successfully!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Conversion rates math
  const t = TRANSLATIONS[currentLang];
  const activeCurConfig = CURRENCIES[currentCurrency];

  const convertPrice = (bdtPrice: number) => {
    const converted = bdtPrice * activeCurConfig.rate;
    return `${activeCurConfig.symbol}${converted.toLocaleString(undefined, { 
      maximumFractionDigits: activeCurConfig.code === "USD" ? 2 : 0 
    })}`;
  };

  // Filtered products list based on price inputs (inputs in USD)
  const displayedProducts = products.filter((p) => {
    // 0.0085 BDT rate to USD
    const priceInUsd = p.discountedPrice * 0.0085;
    if (minPrice && parseFloat(minPrice) > priceInUsd) return false;
    if (maxPrice && parseFloat(maxPrice) < priceInUsd) return false;
    return true;
  });

  // Dynamic zoom effect logic for detailed products gallery screen
  const handleMouseMoveZoom = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: "scale(2.2)"
    });
  };

  const handleMouseLeaveZoom = () => {
    setZoomStyle({ transform: "scale(1)" });
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#F8F9FA] text-[#212121]">
      
      {/* 💻 PC/DESKTOP VIEW WRAPPER (HIDDEN ON PHONE/MOBILE SCREENS) */}
      <div className="hidden md:flex flex-col min-h-screen">
        
        {/* 1. TOP ANNOUNCEMENT BAR */}
      <div className="bg-[#E53935] text-white text-[11px] font-semibold py-2 px-4 sm:px-8 flex flex-col md:flex-row justify-between items-center gap-2 tracking-wide font-display shadow-xs">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">🇧🇩 Fast Local Bangladesh Warehouses (1-3 Days)</span>
          <span className="text-white/40">|</span>
          <span className="flex items-center gap-1">🇨🇳 Sourced Direct from China (25-30 Days Shipping)</span>
        </div>
        
        {/* Languages Switcher & Currencies Switcher */}
        <div className="flex items-center gap-4 flex-wrap text-[10px] uppercase font-bold tracking-wider">
          <div className="flex items-center gap-1 text-white/90">
            <Globe className="w-3.5 h-3.5" />
            <span>Lang:</span>
            <select
              value={currentLang}
              onChange={(e) => setCurrentLang(e.target.value as LanguageKey)}
              className="bg-red-700 text-white rounded outline-none border-none py-0.5 px-1.5 cursor-pointer hover:bg-red-850"
            >
              <option value="en">English</option>
              <option value="bn">বাংলা (Bengali)</option>
              <option value="zh">简体中文 (Chinese)</option>
              <option value="ar">العربية (Arabic)</option>
              <option value="hi">हिन्दी (Hindi)</option>
            </select>
          </div>

          <div className="flex items-center gap-1 text-white/90">
            <span>Currency:</span>
            <select
              value={currentCurrency}
              onChange={(e) => setCurrentCurrency(e.target.value as CurrencyKey)}
              className="bg-red-700 text-white rounded outline-none border-none py-0.5 px-1.5 cursor-pointer hover:bg-red-850"
            >
              <option value="BDT">BDT (৳ BDT)</option>
              <option value="USD">USD ($ USD)</option>
              <option value="CNY">CNY (¥ CNY)</option>
            </select>
          </div>

          <button 
            onClick={() => setCurrentView("track")}
            className="hover:text-yellow-200 transition-colors uppercase cursor-pointer"
          >
            ✈️ {t.trackingTitle}
          </button>
          
          <button 
            onClick={() => setCurrentView("help")}
            className="hover:text-yellow-200 transition-colors uppercase cursor-pointer"
          >
            ❓ Help Desk
          </button>
        </div>
      </div>

      {/* 2. MAIN HEADER PLATFORMS */}
      <header className="sticky top-0 bg-white border-b border-gray-100 z-40 px-4 sm:px-8 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-4 justify-between">
          
          {/* Brand Logo & Slogan */}
          <div 
            onClick={() => {
              setCurrentView("home");
              setSelectedCategory("All");
              setSelectedOriginFilter("all");
            }} 
            className="flex items-center gap-3 cursor-pointer shrink-0"
          >
            <img 
              src={brandLogo} 
              alt="1% of China" 
              className="w-11 h-11 object-contain rounded-full shadow-md border border-slate-100" 
              referrerPolicy="no-referrer"
            />
            <div className="flex flex-col">
              <span className="text-xl font-black text-[#E53935] tracking-tight font-display flex items-center gap-1">
                1% <span className="text-[#212121]">OF CHINA</span>
              </span>
              <span className="text-[9px] font-bold text-slate-400 tracking-widest uppercase leading-none mt-0.5">
                Your Piece of China • এক টুকরো চীন
              </span>
            </div>
          </div>

          {/* Dynamic searching Input bar */}
          <form onSubmit={handleSearchSubmit} className="flex-1 w-full max-w-xl relative">
            <div className="flex items-center bg-[#F5F5F5] rounded-full border border-slate-200 overflow-hidden pr-1.5">
              
              {/* Warehouse source fast toggle dropdown filters inside header finder! */}
              <select
                value={selectedOriginFilter}
                onChange={(e) => {
                  setSelectedOriginFilter(e.target.value as any);
                }}
                className="bg-slate-100 text-[#212121] text-[10px] font-bold px-3 py-2.5 border-r border-slate-200 outline-none rounded-l-full uppercase shrink-0"
              >
                <option value="all">📦 All Hubs</option>
                <option value="BD">🇧🇩 BD Stock</option>
                <option value="China">🇨🇳 China Direct</option>
              </select>

              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none py-2 px-4 text-xs text-slate-800 focus:outline-none focus:ring-0 placeholder:text-slate-400"
              />
              <button
                type="submit"
                className="bg-[#E53935] hover:bg-red-700 text-white font-black text-[10px] tracking-widest py-2 px-5 rounded-full transition-all shrink-0"
              >
                {t.searchBtn}
              </button>
            </div>
          </form>

          {/* Icons Toolbar */}
          <div className="flex items-center gap-5 sm:gap-6 text-slate-700 shrink-0">
            {/* Quick dashboard trigger */}
            <button
              onClick={() => {
                checkAuthOrOpenLogin(() => {
                  setCurrentView("dashboard");
                });
              }}
              className={`flex flex-col items-center gap-0.5 group cursor-pointer ${currentView === 'dashboard' ? 'text-[#E53935]' : ''}`}
            >
              <User className="w-5 h-5 group-hover:text-[#E53935] transition-colors" />
              <span className="text-[9px] font-extrabold uppercase tracking-wide">
                {isLoggedIn ? "Account" : "Log In"}
              </span>
            </button>

            {/* Quick Admin Dashboard bypass link if logged in & is support/superuser role */}
            {isLoggedIn && (loggedInUser?.role === "SUPER_ADMIN" || loggedInUser?.role === "ADMIN") && (
              <button
                onClick={() => setCurrentView("admin")}
                className={`flex flex-col items-center gap-0.5 group cursor-pointer text-[#E53935] ${currentView === 'admin' ? 'border-b-2 border-[#E53935]' : ''}`}
              >
                <ShieldCheck className="w-5 h-5 text-[#E53935] animate-pulse" />
                <span className="text-[9px] font-black uppercase tracking-wide">Admin Panel</span>
              </button>
            )}

            {/* Quick Wishlist dashboard with count */}
            <button
              onClick={() => {
                checkAuthOrOpenLogin(() => {
                  setCurrentView("dashboard");
                  alert("Redirecting to your user bookmarks. Check your saved products!");
                });
              }}
              className="flex flex-col items-center gap-0.5 relative group cursor-pointer"
            >
              <Heart className="w-5 h-5 group-hover:text-[#E53935] transition-colors text-slate-700" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#E53935] text-white text-[9px] h-4 w-4 rounded-full flex items-center justify-center font-bold">
                  {wishlist.length}
                </span>
              )}
              <span className="text-[9px] font-extrabold uppercase tracking-wide">Wishlist</span>
            </button>

            {/* Cart with count badge */}
            <button
              onClick={() => setCurrentView("cart")}
              className={`flex flex-col items-center gap-0.5 relative group cursor-pointer ${currentView === 'cart' ? 'text-[#E53935]' : ''}`}
            >
              <ShoppingCart className="w-5 h-5 group-hover:text-[#E53935] transition-colors text-slate-900" />
              {cart.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#00C853] text-white text-[9px] h-4 w-4 rounded-full flex items-center justify-center font-bold animate-bounce">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
              <span className="text-[9px] font-extrabold uppercase tracking-wide">Cart</span>
            </button>

            {/* Admin Console shortcut button */}
            <button
              onClick={() => setCurrentView("admin")}
              className={`bg-slate-100 hover:bg-[#E53935] hover:text-white p-2 rounded-xl transition-all cursor-pointer border border-slate-200 text-slate-800 ${
                currentView === "admin" ? "bg-[#E53935] text-white" : ""
              }`}
              title="Admin Workstation console"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>

        </div>
      </header>

      {/* 3. CATEGORIES NAVIGATION MENUS */}
      <nav className="bg-[#212121] text-white text-[11px] font-bold uppercase tracking-wider overflow-x-auto whitespace-nowrap custom-scrollbar py-3 px-4 sm:px-8 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto flex gap-6 sm:gap-8 justify-between">
          <div className="flex gap-6 sm:gap-8">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setCurrentView("home");
                }}
                className={`transition-colors shrink-0 ${
                  selectedCategory === cat 
                    ? "text-[#E53935] underline underline-offset-4 decoration-2" 
                    : "text-zinc-200 hover:text-[#E53935]"
                }`}
              >
                {cat === "All" ? "🎁 All Boutique" : cat}
              </button>
            ))}
          </div>
          <div className="flex gap-4">
            <span className="text-[#00C853] animate-pulse">● FLASH SALES LIVE</span>
            <span className="text-[#E53935] cursor-pointer" onClick={() => {
              setSelectedCategory("All");
              setSearchQuery("");
              setSelectedOriginFilter("BD");
              setCurrentView("home");
            }}>
              🇧🇩 local express
            </span>
            <span className="text-sky-400 cursor-pointer" onClick={() => {
              setSelectedCategory("All");
              setSearchQuery("");
              setSelectedOriginFilter("China");
              setCurrentView("home");
            }}>
              🇨🇳 direct importer
            </span>
          </div>
        </div>
      </nav>

      {/* VIEW: MAIN HOME PAGE */}
      {currentView === "home" && (
        <main className="flex-1 pb-16">
          
          {/* HERO BANNER - SLEEK SECTION */}
          <div className="bg-[#212121] text-white py-12 px-6 sm:px-12 relative overflow-hidden">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              
              {/* Promo Banner Left column */}
              <div className="lg:col-span-7 space-y-6">
                <span className="bg-[#E53935] text-white text-[10px] font-display font-black tracking-widest uppercase px-3 py-1.5 rounded-md shadow-md inline-block">
                  AUTHENTIC SUPPLIER HUB 🇨🇳 ✈️ 🇧🇩
                </span>
                
                <h1 className="text-4xl sm:text-6xl font-black leading-none tracking-tighter text-white font-display">
                  {t.heroTitle.split(',')[0]}<span className="text-[#E53935]"><br />{t.heroTitle.split(',')[1] || "ONE GIFT SHOP."}</span>
                </h1>
                
                <p className="text-xs sm:text-sm text-zinc-300 max-w-lg leading-relaxed font-light">
                  {t.heroSubtitle}
                </p>

                {/* Banner buttons filters */}
                <div className="flex flex-wrap gap-3.5 pt-2">
                  <button
                    onClick={() => {
                      setSelectedOriginFilter("BD");
                      document.getElementById("catalog-showcase")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="bg-[#E53935] hover:bg-red-700 hover:scale-[1.02] active:scale-95 text-white font-bold text-xs uppercase px-7 py-3.5 rounded-xl transition-all shadow-lg flex items-center gap-2"
                  >
                     Shop Bangladesh Warehouse
                  </button>
                  <button
                    onClick={() => {
                      setSelectedOriginFilter("China");
                      document.getElementById("catalog-showcase")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="bg-white hover:bg-slate-100 hover:scale-[1.02] text-[#212121] font-bold text-xs uppercase px-7 py-3.5 rounded-xl transition-all shadow-md flex items-center gap-2"
                  >
                     Shop Direct from China
                  </button>
                </div>

                {/* Logistics Badges */}
                <div className="grid grid-cols-3 gap-4 pt-6 max-w-md border-t border-zinc-800">
                  <div>
                    <span className="text-[#00C853] text-sm font-bold block">1-3 Days</span>
                    <span className="text-[10px] text-zinc-400">Dhaka & Chittagong stocks</span>
                  </div>
                  <div>
                    <span className="text-sky-400 text-sm font-bold block">Duty Handled</span>
                    <span className="text-[10px] text-zinc-400">Tax & custom fully pre-paid</span>
                  </div>
                  <div>
                    <span className="text-yellow-400 text-sm font-bold block">COD Ready</span>
                    <span className="text-[10px] text-zinc-400">Cash-on-delivery locally</span>
                  </div>
                </div>
              </div>

              {/* Graphic logistics Illustration Right column */}
              <div className="lg:col-span-5 hidden lg:flex justify-center relative">
                <div className="bg-gradient-to-tr from-zinc-800 to-zinc-900 rounded-3xl p-6 border border-zinc-700 w-full max-w-sm shadow-2xl relative overflow-hidden">
                  <div className="absolute top-2 right-2 text-white/5 text-[140px] font-black leading-none pointer-events-none">
                    ✈️
                  </div>
                  <h3 className="font-bold text-sm tracking-tight text-white flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#00C853]"></span>
                    Fulfillment Channel Active
                  </h3>
                  <p className="text-[10px] text-zinc-400 mt-1">Direct air freight transit from Shenzhen supplier nodes to local Dhaka logistics sorting zones.</p>

                  <div className="mt-6 space-y-4">
                    <div className="flex justify-between items-center text-xs text-zinc-300">
                      <span>China Supplier Depot</span>
                      <span className="text-[#00C853] font-mono">Guangdong</span>
                    </div>
                    <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-[#E53935] h-1.5 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                    </div>
                    <div className="flex justify-between items-center text-xs text-zinc-300">
                      <span>Dhaka Warehouse Distribution</span>
                      <span className="text-amber-400 font-mono">Dhanmondi</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-zinc-800 flex justify-between items-center text-[10px] text-zinc-400">
                    <span>Active Freighters Count: <strong>14 Cargo</strong></span>
                    <span>Status: <strong>Normal</strong></span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-10 space-y-12">
            
            {/* 4. COMPARISON FEATURE CARDS SECTION */}
            <div className="space-y-4">
              <h2 className="text-lg font-black font-display text-slate-800 uppercase tracking-tight flex items-center gap-2">
                <Info className="w-5 h-5 text-[#E53935]" />
                {t.comparTitle}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Local Warehouse Card */}
                <div className="bg-white border border-emerald-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-all gap-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="bg-emerald-100 text-[#00C853] text-[9.5px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider">
                        FAST LOCAL DESPATCH
                      </span>
                      <h3 className="font-bold text-base text-slate-800 mt-2 font-display">Bangladesh Stock Warehouse</h3>
                    </div>
                    <span className="text-3xl">🇧🇩</span>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-600">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#00C853]"></div>
                      Delivery across Bangladesh: <strong>1 to 3 business days</strong>.
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#00C853]"></div>
                      <strong>Cash on Delivery (COD)</strong> supported via local couriers.
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#00C853]"></div>
                      7-day local return and quick swapping in case of manufacturing issues.
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#00C853]"></div>
                      Real-time live item inventory counts visible instantly.
                    </li>
                  </ul>
                  <button
                    onClick={() => {
                      setSelectedOriginFilter("BD");
                      document.getElementById("catalog-showcase")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="w-full bg-emerald-50 hover:bg-[#00C853] hover:text-white text-[#00C853] font-bold text-xs py-2.5 rounded-xl transition-all uppercase tracking-wider"
                  >
                    Filter Bangladesh Inventory
                  </button>
                </div>

                {/* China Supplier Card */}
                <div className="bg-white border border-purple-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-all gap-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="bg-purple-100 text-purple-700 text-[9.5px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider">
                        DIRECT FACTORY BULK IMPORT
                      </span>
                      <h3 className="font-bold text-base text-slate-800 mt-2 font-display">Direct Sourced from China</h3>
                    </div>
                    <span className="text-3xl">🇨🇳</span>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-600">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-600"></div>
                      Shipment arrival timeline: <strong>25 to 30 business days</strong>.
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-600"></div>
                      Super cheap factory-to-door pricing with zero agency layers.
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-600"></div>
                      All Bangladesh custom clearance taxes and import fees are fully managed by us.
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-600"></div>
                      Complete international tracking code handed instantly to check ocean freighter.
                    </li>
                  </ul>
                  <button
                    onClick={() => {
                      setSelectedOriginFilter("China");
                      document.getElementById("catalog-showcase")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="w-full bg-purple-50 hover:bg-purple-700 hover:text-white text-purple-700 font-bold text-xs py-2.5 rounded-xl transition-all uppercase tracking-wider"
                  >
                    Filter China Imported Selection
                  </button>
                </div>

              </div>
            </div>

            {/* 5. DYNAMIC CATALOGUE SHOWCASE GRID WITH SIDEBAR */}
            <div id="catalog-showcase" className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              
              {/* SIDEBAR FILTERS (Left column, desktop only) */}
              <div className="lg:col-span-1 hidden lg:block">
                <div className="bg-white rounded-3xl border border-slate-100 p-6 space-y-6 sticky top-24 shadow-xs">
                  <div className="flex justify-between items-center">
                    <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-800">Filters</h3>
                    <button 
                      onClick={() => {
                        setSelectedCategory("All");
                        setSelectedOriginFilter("all");
                        setSearchQuery("");
                        setMinPrice("");
                        setMaxPrice("");
                      }}
                      className="text-xs font-bold text-[#E53935] hover:text-red-700 cursor-pointer"
                    >
                      Clear all
                    </button>
                  </div>

                  {/* Category Selection Filter list */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Category</h4>
                    <div className="flex flex-col gap-1.5">
                      {CATEGORIES.map((cat) => {
                        const isSelected = selectedCategory === cat;
                        return (
                          <button
                            key={cat}
                            onClick={() => {
                              setSelectedCategory(cat);
                              document.getElementById("catalog-showcase")?.scrollIntoView({ behavior: "smooth" });
                            }}
                            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                              isSelected 
                                ? "bg-[#0b2b5c] text-white shadow-xs font-black" 
                                : "text-slate-600 hover:bg-slate-50 hover:text-slate-850"
                            }`}
                          >
                            {cat}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Price Range Filter (USD) */}
                  <div className="space-y-3 pt-4 border-t border-slate-100">
                    <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Price Range (USD)</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <input 
                        type="number" 
                        placeholder="Min" 
                        value={minPrice} 
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="w-full text-xs bg-white border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#0b2b5c] text-slate-700 font-medium"
                      />
                      <input 
                        type="number" 
                        placeholder="Max" 
                        value={maxPrice} 
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="w-full text-xs bg-white border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#0b2b5c] text-slate-700 font-medium"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* PRODUCTS LISTING AREA (Right columns) */}
              <div className="lg:col-span-3 space-y-6">
                
                {/* Toolbar Section & Filter Indicator */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-4">
                  <div>
                    <h2 className="text-lg font-extrabold font-display text-slate-800 uppercase tracking-tight flex items-center gap-2">
                      🛍️ Selected Showcase: {selectedCategory === "All" ? "Full Collection" : selectedCategory}
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Showing {displayedProducts.length} products in <strong className="text-slate-700 font-semibold">{selectedCategory}</strong>.
                    </p>
                  </div>

                  {/* Filter quick controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedOriginFilter("all");
                      }}
                      className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all uppercase ${
                        selectedOriginFilter === "all" ? "bg-[#212121] text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      All Items
                    </button>
                    <button
                      onClick={() => {
                        setSelectedOriginFilter("BD");
                      }}
                      className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all uppercase flex items-center gap-1 ${
                        selectedOriginFilter === "BD" ? "bg-emerald-600 text-white" : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                      }`}
                    >
                      🇧🇩 BD Warehouse
                    </button>
                    <button
                      onClick={() => {
                        setSelectedOriginFilter("China");
                      }}
                      className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all uppercase flex items-center gap-1 ${
                        selectedOriginFilter === "China" ? "bg-indigo-600 text-white" : "bg-indigo-50 text-indigo-800 hover:bg-indigo-100"
                      }`}
                    >
                      🇨🇳 China Import
                    </button>
                  </div>
                </div>

                {/* Products Rendering Grid */}
                {displayedProducts.length === 0 ? (
                  <div className="bg-white border border-slate-150 rounded-3xl p-12 text-center text-slate-500 space-y-3">
                    <p className="text-lg font-bold">No products found matching these criteria.</p>
                    <p className="text-xs max-w-md mx-auto">Try resetting filters, price ranges, or category selection to expand searching criteria parameters.</p>
                    <button
                      onClick={() => {
                        setSelectedCategory("All");
                        setSelectedOriginFilter("all");
                        setSearchQuery("");
                        setMinPrice("");
                        setMaxPrice("");
                      }}
                      className="bg-[#E53935] text-white text-xs font-bold py-2.5 px-6 rounded-full hover:bg-red-700 transition-all cursor-pointer"
                    >
                      Clear All Filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {displayedProducts.map((p) => {
                    const isWishlisted = wishlist.includes(p.id);
                    return (
                      <div
                        key={p.id}
                        onClick={() => {
                          setSelectedProduct(p);
                          setCurrentView("product-details");
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="bg-white rounded-3xl p-4 shadow-xs border border-transparent hover:border-[#E53935] cursor-pointer group flex flex-col justify-between transition-all"
                      >
                        <div>
                          {/* Image box and dynamic tags badges */}
                          <div className="aspect-square bg-slate-50 rounded-2xl mb-4 relative overflow-hidden flex items-center justify-center">
                            <img
                              src={p.image}
                              alt={p.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            
                            {/* Stock and origin custom tags badges */}
                            <div className="absolute top-2 left-2 flex flex-col gap-1.5">
                              {p.origin === ShippingOrigin.BANGLADESH ? (
                                <span className="bg-[#00C853] text-white text-[8px] font-black tracking-widest px-2 py-1 rounded-md shadow-sm uppercase">
                                  🇧🇩 local Stock (1-3 Days)
                                </span>
                              ) : (
                                <span className="bg-[#212121] text-white text-[8px] font-black tracking-widest px-2 py-1 rounded-md shadow-sm uppercase">
                                  🇨🇳 Direct Direct (25-30 Days)
                                </span>
                              )}

                              {p.isBestSeller && (
                                <span className="bg-[#E53935] text-white text-[8px] font-black tracking-widest px-2 py-0.5 rounded shadow-sm w-fit">
                                  BEST SELLER 🔥
                                </span>
                              )}
                            </div>

                            {/* Wishlist triggers floating corner element */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                checkAuthOrOpenLogin(() => toggleWishlist(p.id));
                              }}
                              className="absolute top-2 right-2 bg-white/90 hover:bg-white text-slate-800 p-1.5 rounded-full shadow-md hover:scale-110 active:scale-95 transition-all cursor-pointer"
                            >
                              <Heart className={`w-3.5 h-3.5 ${isWishlisted ? "fill-red-500 text-red-500" : "text-slate-600"}`} />
                            </button>
                          </div>

                          {/* Product Category and Name */}
                          <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400 block">{p.category}</span>
                          <h4 className="font-bold text-sm text-slate-800 group-hover:text-[#E53935] transition-colors mt-0.5 line-clamp-2">
                            {p.name}
                          </h4>

                          {/* Rating and review index count */}
                          <div className="flex items-center gap-1 sm:gap-1.5 mt-2">
                            <div className="flex text-yellow-500">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 ${
                                    i < Math.floor(p.rating) ? "fill-yellow-500 text-yellow-500" : "text-slate-200"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-[10px] text-slate-400 font-bold mt-0.5">({p.reviewCount})</span>
                          </div>

                          {/* Stock status indicator */}
                          <div className="mt-3 flex items-center justify-between text-[10px]">
                            {p.origin === ShippingOrigin.BANGLADESH ? (
                              <span className="text-[#00C853] font-bold flex items-center gap-1 uppercase">
                                <span className="h-1.5 w-1.5 rounded-full bg-[#00C853] animate-ping"></span>
                                In local stock: {p.stockCount} left
                              </span>
                            ) : (
                              <span className="text-sky-600 font-semibold flex items-center gap-1 uppercase">
                                <Globe className="w-3 h-3 text-sky-500" />
                                Custom Supplier: {p.stockCount}+
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Price bracket & Add to Cart / Buy Now buttons */}
                        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col gap-2">
                          <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                              <span className="text-[#E53935] font-black text-sm">{convertPrice(p.discountedPrice)}</span>
                              <span className="text-[10px] line-through text-slate-400">{convertPrice(p.originalPrice)}</span>
                            </div>

                            <div className="flex gap-1">
                              {/* Eye Preview quick modal trigger */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedProduct(p);
                                }}
                                className="bg-slate-100 hover:bg-[#E53935] hover:text-white text-slate-700 p-2 rounded-xl transition-all cursor-pointer"
                                title={t.viewDetail}
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAddToCart(p, p.variants[0] || null);
                                }}
                                className="bg-[#212121] text-white hover:bg-[#E53935] active:scale-95 transition-all text-[9.5px] font-bold uppercase tracking-wider px-3 py-2 rounded-xl"
                              >
                                Add Cart
                              </button>
                            </div>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              checkAuthOrOpenLogin(() => handleBuyNow(p, p.variants[0] || null));
                            }}
                            className="bg-[#E53935] text-white hover:bg-[#212121] active:scale-95 transition-all text-[9.5px] font-black uppercase tracking-widest py-2 rounded-xl w-full text-center"
                          >
                            Buy Now 🚀
                          </button>
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}
              </div>
            </div>

          </div>
        </main>
      )}

      {/* VIEW: PRODUCT DETAIL DEDICATED PAGE */}
      {currentView === "product-details" && selectedProduct && (
        <ProductDetailsPage
          selectedProduct={selectedProduct}
          onBack={() => {
            setCurrentView("home");
            setSelectedProduct(null);
          }}
          convertPrice={convertPrice}
          handleAddToCart={handleAddToCart}
          handleBuyNow={handleBuyNow}
          wishlist={wishlist}
          toggleWishlist={toggleWishlist}
          checkAuthOrOpenLogin={checkAuthOrOpenLogin}
          products={products}
          setSelectedProduct={setSelectedProduct}
        />
      )}

      {/* VIEW: PRODUCT DETAIL MODAL PAGE OVERLAY OVER THE MAIN INTERFACE */}
      {selectedProduct && currentView !== "product-details" && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative border border-slate-100 p-6 flex flex-col md:flex-row gap-8">
            
            {/* Close modal button shortcut */}
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-black p-2 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Left Side: Product Image Showcase with interactive Zoom & thumbnails */}
            <div className="md:w-5/12 space-y-4">
              <div 
                className="aspect-square bg-slate-50 border border-slate-100 rounded-3xl overflow-hidden relative"
                onMouseMove={handleMouseMoveZoom}
                onMouseLeave={handleMouseLeaveZoom}
              >
                <img
                  src={selectedProduct.gallery?.[activeGalleryIndex] || selectedProduct.image}
                  alt={selectedProduct.name}
                  style={zoomStyle}
                  className="w-full h-full object-cover transition-transform duration-100 cursor-zoom-in"
                />
                
                <div className="absolute top-3 left-3">
                  {selectedProduct.origin === ShippingOrigin.BANGLADESH ? (
                    <span className="bg-[#00C853] text-white text-[8px] font-black px-2 py-1 rounded shadow-md">
                      🇧🇩 Local Warehouse Fulfill
                    </span>
                  ) : (
                    <span className="bg-[#212121] text-white text-[8px] font-black px-2 py-1 rounded shadow-md">
                      🇨🇳 Direct Supplier Import
                    </span>
                  )}
                </div>
              </div>

              {/* Gallery loop list of thumbnails */}
              <div className="flex gap-2.5 overflow-x-auto py-1">
                {(selectedProduct.gallery || [selectedProduct.image]).map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveGalleryIndex(idx)}
                    className={`w-14 h-14 bg-slate-50 border rounded-xl overflow-hidden object-cover shrink-0 cursor-pointer ${
                      activeGalleryIndex === idx ? "border-[#E53935] ring-2 ring-red-100" : "border-slate-100"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

              {/* Expected Delivery Date Calculator */}
              <div className="bg-slate-50 border border-slate-150 rounded-2xl p-4 space-y-2 text-xs">
                <span className="font-bold text-slate-700 uppercase block tracking-wider text-[10px]">Expected Arrival Calculation:</span>
                <p className="text-slate-600">
                  Estimated Arrival:{" "}
                  <strong className="text-slate-900 font-semibold underline decoration-[#E53935]">
                    {selectedProduct.origin === ShippingOrigin.BANGLADESH 
                      ? "2 to 3 Days (Arrives soon!)" 
                      : "July 10, 2026 - July 15, 2026 (Customs prepaid)"}
                  </strong>
                </p>
                <p className="text-[10px] text-zinc-400">Calculated based on current standard cargo sea freighters departures schedules.</p>
              </div>
            </div>

            {/* Right Side: Informative specs, descriptions, checkout action and variants selection */}
            <div className="md:w-7/12 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#E53935]">
                  {selectedProduct.category} Catalog
                </span>
                
                <h3 className="font-bold font-display text-xl text-slate-900 mt-1">
                  {selectedProduct.name}
                </h3>

                {/* Star rating summaries */}
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < Math.floor(selectedProduct.rating) ? "fill-yellow-500 text-yellow-500" : "text-slate-200"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-slate-600">{selectedProduct.rating} Stars Rating • verified customer reviews</span>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed mt-3.5">{selectedProduct.description}</p>

                {/* High contrast technical logistics details specs */}
                <div className="grid grid-cols-2 gap-3 mt-4 bg-slate-50/50 border border-slate-100 rounded-2xl p-4 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase tracking-wider">Live Inventory Hub:</span>
                    <strong className="text-slate-700 font-bold">{selectedProduct.origin}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase tracking-wider font-semibold">Delivery timeframe:</span>
                    <strong className="text-slate-700 font-bold">{selectedProduct.deliveryTime} (Business Days)</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase tracking-wider">Tracking status:</span>
                    <strong className="text-[#00C853] font-bold">✓ Live Shipment GPS Tracking Available</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase tracking-wider">Domestic Shipping fee:</span>
                    <strong className="text-slate-700 font-bold">৳{selectedProduct.shippingCost} BDT flat Rate</strong>
                  </div>
                </div>

                {/* Interactive product variant choice selector */}
                {selectedProduct.variants && selectedProduct.variants.length > 0 && (
                  <div className="mt-5 space-y-2">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Choose Design Accent Style:</span>
                    <div className="flex flex-wrap gap-2.5">
                      {selectedProduct.variants.map((v) => (
                        <button
                          key={v.id}
                          onClick={() => setSelectedVariant(v)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                            selectedVariant?.id === v.id
                              ? "border-[#E53935] text-[#E53935] bg-red-50/50"
                              : "border-slate-200 text-slate-600 bg-white hover:border-slate-350"
                          }`}
                        >
                          {v.name} {v.priceModifier > 0 ? `(+৳${v.priceModifier})` : ""} {v.stock === 0 ? "(Out of stock)" : ""}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Product Specifications Grid dropdown */}
                <div className="mt-5 border-t border-slate-100 pt-3">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider mb-2">Technical Specifications:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-600">
                    {Object.entries(selectedProduct.specs || {}).map(([key, val]) => (
                      <div key={key} className="flex justify-between border-b border-dashed border-slate-100 py-1">
                        <span className="text-slate-400">{key}:</span>
                        <strong className="text-slate-700 font-medium">{val}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Buying CTA Footer area */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block font-semibold uppercase">Total Purchase Price BDT:</span>
                  <span className="text-[#E53935] font-black text-xl">
                    {convertPrice(selectedProduct.discountedPrice + (selectedVariant?.priceModifier || 0))}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => {
                      checkAuthOrOpenLogin(() => {
                        handleBuyNow(selectedProduct, selectedVariant);
                        setSelectedProduct(null);
                      });
                    }}
                    className="bg-indigo-600 text-white hover:bg-zinc-900 font-extrabold text-xs uppercase px-5 py-3 rounded-xl transition-all shadow-md cursor-pointer"
                  >
                    Buy Now 🚀
                  </button>
                  <button
                    onClick={() => {
                      handleAddToCart(selectedProduct, selectedVariant);
                      setSelectedProduct(null);
                    }}
                    className="bg-[#212121] text-white hover:bg-[#E53935] font-bold text-xs uppercase px-5 py-3 rounded-xl transition-all shadow-md cursor-pointer"
                  >
                    ADD CART INVENTORY
                  </button>
                  <button
                    onClick={() => {
                      checkAuthOrOpenLogin(() => {
                        toggleWishlist(selectedProduct.id);
                        alert("Successfully bookmarked inside wishlist directory!");
                      });
                    }}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-3 rounded-xl transition-all cursor-pointer"
                  >
                    <Heart className={`w-4 h-4 ${wishlist.includes(selectedProduct.id) ? "fill-red-500 text-red-500" : ""}`} />
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* VIEW: SHOPPING CART COMPREHENSIVE SHELF */}
      {currentView === "cart" && (
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-8 py-10">
          <h2 className="text-2xl font-black font-display text-slate-800 uppercase tracking-tight flex items-center gap-2 mb-6">
            <ShoppingBag className="w-6 h-6 text-[#E53935]" />
            Shopping Cart Cargo
          </h2>

          {cart.length === 0 ? (
            <div className="bg-white border border-slate-150 rounded-3xl p-12 text-center text-slate-400 space-y-4">
              <ShoppingCart className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-lg">Your cargo cart is currently empty.</p>
              <p className="text-xs max-w-md mx-auto">Explore our exclusive gifts and top-tier gadgets with local Bangladesh stock dispatch or China direct supplier wholesale discounts.</p>
              <button
                onClick={() => setCurrentView("home")}
                className="bg-[#E53935] hover:bg-red-700 text-white font-bold text-xs uppercase py-2.5 px-6 rounded-full inline-block transition-all"
              >
                Go Back Shopping
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Cart items list section divided by logistics origins */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* 1. Bangladesh Warehouse cargo lists */}
                {cart.some(item => item.product.origin === ShippingOrigin.BANGLADESH) && (
                  <div className="bg-white border border-emerald-100 rounded-3xl p-5 shadow-xs">
                    <h3 className="text-xs font-black uppercase tracking-wider text-[#00C853] flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
                      <span>🇧🇩</span> Bangladesh Warehouse Stock (Delivery within 1-3 Business Days)
                    </h3>
                    <div className="divide-y divide-slate-100">
                      {cart.map((item, idx) => {
                        if (item.product.origin !== ShippingOrigin.BANGLADESH) return null;
                        const itemPrice = item.product.discountedPrice + (item.selectedVariant?.priceModifier || 0);
                        return (
                          <div key={idx} className="flex gap-4 py-3.5 first:pt-0 last:pb-0">
                            <img src={item.product.image} alt="" className="w-16 h-16 object-cover rounded-xl" />
                            <div className="flex-1">
                              <h4 className="font-bold text-sm text-slate-800">{item.product.name}</h4>
                              <p className="text-[10px] text-slate-400 mt-0.5 uppercase">
                                Variant Style: <strong>{item.selectedVariant?.name || "Standard Accent"}</strong>
                              </p>
                              <div className="flex justify-between items-center mt-3">
                                <span className="text-[#E53935] font-black">{convertPrice(itemPrice)}</span>
                                <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateCartQty(idx, -1)}
                                    className="px-2.5 py-1 text-slate-400 hover:text-red-600 font-bold"
                                  >
                                    -
                                  </button>
                                  <span className="px-3 py-1 font-bold font-mono text-xs">{item.quantity}</span>
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateCartQty(idx, 1)}
                                    className="px-2.5 py-1 text-slate-400 hover:text-red-500 font-bold"
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 2. China Warehouse direct supplier cargoes lists */}
                {cart.some(item => item.product.origin === ShippingOrigin.CHINA) && (
                  <div className="bg-white border border-purple-100 rounded-3xl p-5 shadow-xs">
                    <h3 className="text-xs font-black uppercase tracking-wider text-purple-700 flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
                      <span>🇨🇳</span> China Supplier Direct Bulk Cargo (Delivery Transit 25-30 Business Days)
                    </h3>
                    <div className="divide-y divide-slate-100">
                      {cart.map((item, idx) => {
                        if (item.product.origin !== ShippingOrigin.CHINA) return null;
                        const itemPrice = item.product.discountedPrice + (item.selectedVariant?.priceModifier || 0);
                        return (
                          <div key={idx} className="flex gap-4 py-3.5 first:pt-0 last:pb-0">
                            <img src={item.product.image} alt="" className="w-16 h-16 object-cover rounded-xl" />
                            <div className="flex-1">
                              <h4 className="font-bold text-sm text-slate-800">{item.product.name}</h4>
                              <p className="text-[10px] text-slate-400 mt-0.5 uppercase">
                                Accent Type: <strong>{item.selectedVariant?.name || "Standard Accent"}</strong>
                              </p>
                              <div className="flex justify-between items-center mt-3">
                                <span className="text-[#E53935] font-black">{convertPrice(itemPrice)}</span>
                                <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateCartQty(idx, -1)}
                                    className="px-2.5 py-1 text-slate-400 hover:text-red-600 font-bold"
                                  >
                                    -
                                  </button>
                                  <span className="px-3 py-1 font-bold font-mono text-xs">{item.quantity}</span>
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateCartQty(idx, 1)}
                                    className="px-2.5 py-1 text-slate-400 hover:text-red-500 font-bold"
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

              </div>

              {/* Order bill checkout summary sidebar */}
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-5 space-y-4">
                  <h3 className="text-sm font-black uppercase text-slate-800 tracking-wider">Checkout Cart Bills</h3>
                  
                  <div className="space-y-2 text-xs text-slate-650">
                    <div className="flex justify-between">
                      <span>Selected Items Subtotal:</span>
                      <strong className="text-slate-900 font-semibold">{convertPrice(getCartTotals().subtotal)}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Fulfillment & Cargo Shipping:</span>
                      <strong className="text-slate-900 font-semibold">{convertPrice(getCartTotals().shipping)}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Local VAT Tax (5% standard BDT):</span>
                      <strong className="text-slate-900 font-semibold">{convertPrice(getCartTotals().tax)}</strong>
                    </div>
                    {appliedDiscount > 0 && (
                      <div className="flex justify-between text-[#00C853] font-bold">
                        <span>Wholesale coupon applied:</span>
                        <span>-{convertPrice(appliedDiscount)}</span>
                      </div>
                    )}
                    <div className="h-px bg-slate-100 my-2"></div>
                    <div className="flex justify-between text-base font-black text-slate-800">
                      <span>Aggregated total value:</span>
                      <span className="text-[#E53935]">{convertPrice(getCartTotals().total)}</span>
                    </div>
                  </div>

                  {/* Promo coupon form block */}
                  <div className="bg-slate-50 border border-slate-150 rounded-2xl p-3.5 space-y-2">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Wholesale Promo Code Finder:</span>
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        placeholder="WELCOME2026, FASTBD, CHINAFREE"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs w-full uppercase focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        className="bg-black hover:bg-[#E53935] text-white text-[10px] font-bold py-1.5 px-4 rounded-lg"
                      >
                        Apply
                      </button>
                    </div>
                    {couponStatus && (
                      <p className={`text-[9.5px] font-mono mt-1 ${couponStatus.startsWith('SUCCESS') ? 'text-[#00C853] font-bold' : 'text-red-500 font-medium'}`}>
                        {couponStatus}
                      </p>
                    )}
                  </div>

                  <div className="bg-yellow-50 text-amber-800 text-[10px] rounded-xl p-2.5 border border-yellow-200">
                    💡 <strong>Protip:</strong> Use coupon code <strong>WELCOME2026</strong> for a massive 20% discount on your entire shopping basket cart checkouts!
                  </div>

                  {/* Proceed trigger option */}
                  <button
                    onClick={() => {
                      checkAuthOrOpenLogin(() => {
                        setBillingInput((prev) => ({
                          ...prev,
                          name: userName,
                          email: userEmail,
                          address: userAddress,
                          phone: userPhone,
                        }));
                        setCurrentView("checkout");
                      });
                    }}
                    className="w-full bg-[#E53935] hover:bg-red-700 text-white font-bold text-xs uppercase py-3.5 rounded-xl transition-all shadow-md text-center block tracking-wider mt-2"
                  >
                     Proceed checkout Securely
                  </button>
                </div>
              </div>

            </div>
          )}
        </main>
      )}

      {/* VIEW: SECURE CHECKOUT INTERFACING */}
      {currentView === "checkout" && (
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-8 py-10">
          <h2 className="text-2xl font-black font-display text-slate-800 uppercase tracking-tight flex items-center gap-2 mb-6">
            <ShieldCheck className="w-6 h-6 text-[#00C853]" />
            {t.checkoutTitle}
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left side billing inputs */}
            <form onSubmit={handleCheckoutSubmit} className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-xl p-6 space-y-5">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-2.5">
                Delivery Coordinates & Shipping addresses
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Customer Full Name</label>
                  <input
                    type="text"
                    required
                    value={billingInput.name}
                    onChange={(e) => setBillingInput({ ...billingInput, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs focus:ring-1 focus:ring-[#E53935] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">E-mail address (For logisticians logs)</label>
                  <input
                    type="email"
                    required
                    value={billingInput.email}
                    onChange={(e) => setBillingInput({ ...billingInput, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs focus:ring-1 focus:ring-[#E53935] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Phone contacts</label>
                  <input
                    type="text"
                    required
                    value={billingInput.phone}
                    onChange={(e) => setBillingInput({ ...billingInput, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs focus:ring-1 focus:ring-[#E53935] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Detailed Physical Shipping address</label>
                  <input
                    type="text"
                    required
                    value={billingInput.address}
                    onChange={(e) => setBillingInput({ ...billingInput, address: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs focus:ring-1 focus:ring-[#E53935] outline-none"
                  />
                </div>
              </div>

              {/* Payment Methods selector with bKash/Nagad mock options & Visa */}
              <div className="space-y-3 pt-3">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  Choose Settlement Payment Hub:
                </span>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {/* bKash BD */}
                  <label className={`border-2 rounded-2xl p-3 flex flex-col items-center justify-center cursor-pointer transition-all ${
                    billingInput.paymentMethod === "bKash" ? "border-pink-500 bg-pink-50/50" : "border-slate-100 hover:border-slate-200"
                  }`}>
                    <input
                      type="radio"
                      name="payment_select"
                      value="bKash"
                      checked={billingInput.paymentMethod === "bKash"}
                      onChange={(e) => setBillingInput({ ...billingInput, paymentMethod: e.target.value })}
                      className="sr-only"
                    />
                    <span className="text-pink-600 font-extrabold text-[13px] font-display">bKash</span>
                    <span className="text-[8px] text-pink-400 font-bold mt-1 uppercase">Local Wallet</span>
                  </label>

                  {/* Nagad BD */}
                  <label className={`border-2 rounded-2xl p-3 flex flex-col items-center justify-center cursor-pointer transition-all ${
                    billingInput.paymentMethod === "Nagad" ? "border-orange-500 bg-orange-50/50" : "border-slate-100 hover:border-slate-200"
                  }`}>
                    <input
                      type="radio"
                      name="payment_select"
                      value="Nagad"
                      checked={billingInput.paymentMethod === "Nagad"}
                      onChange={(e) => setBillingInput({ ...billingInput, paymentMethod: e.target.value })}
                      className="sr-only"
                    />
                    <span className="text-orange-600 font-extrabold text-[13px] font-display">Nagad</span>
                    <span className="text-[8px] text-orange-400 font-bold mt-1 uppercase">Local Wallet</span>
                  </label>

                  {/* Cash on Delivery BD */}
                  <label className={`border-2 rounded-2xl p-3 flex flex-col items-center justify-center cursor-pointer text-center transition-all ${
                    billingInput.paymentMethod === "Cash on Delivery" ? "border-emerald-500 bg-emerald-50/50" : "border-slate-100 hover:border-slate-200"
                  }`}>
                    <input
                      type="radio"
                      name="payment_select"
                      value="Cash on Delivery"
                      checked={billingInput.paymentMethod === "Cash on Delivery"}
                      onChange={(e) => setBillingInput({ ...billingInput, paymentMethod: e.target.value })}
                      className="sr-only"
                    />
                    <span className="text-emerald-600 font-extrabold text-[12px] leading-tight font-display">Cash on Delivery</span>
                    <span className="text-[8px] text-emerald-400 font-bold mt-1 uppercase"> ढाका ও চট্টগ্রামে</span>
                  </label>

                  {/* International Visa/Mastercard */}
                  <label className={`border-2 rounded-2xl p-3 flex flex-col items-center justify-center cursor-pointer transition-all ${
                    billingInput.paymentMethod === "Visa Card" ? "border-indigo-500 bg-indigo-50/50" : "border-slate-100 hover:border-slate-200"
                  }`}>
                    <input
                      type="radio"
                      name="payment_select"
                      value="Visa Card"
                      checked={billingInput.paymentMethod === "Visa Card"}
                      onChange={(e) => setBillingInput({ ...billingInput, paymentMethod: e.target.value })}
                      className="sr-only"
                    />
                    <span className="text-indigo-600 font-extrabold text-[12px] font-display">Visa/PayPal</span>
                    <span className="text-[8px] text-indigo-400 font-bold mt-1 uppercase">Secure Gateway</span>
                  </label>
                </div>
              </div>

              {/* Secure mock validation disclaimer */}
              <div className="bg-slate-50 border border-slate-150 rounded-2xl p-4 text-[11px] text-slate-450 leading-relaxed flex items-start gap-3">
                <span className="text-base">🔒</span>
                <div>
                  <strong>SSL Secured Checkout Transaction:</strong> All custom credit card sequences and mobile banking credentials are fully encrypted using standard 256-bit AES protection. We monitor fraudulent actions to guarantee safe delivery clearances.
                </div>
              </div>

              <div className="flex justify-between items-center pt-4">
                <button
                  type="button"
                  onClick={() => setCurrentView("cart")}
                  className="text-slate-500 hover:text-slate-900 border border-slate-200 py-2.5 px-6 rounded-xl text-xs font-bold"
                >
                  Return to Cart
                </button>
                <button
                  type="submit"
                  className="bg-[#E53935] hover:bg-red-700 hover:scale-[1.01] text-white font-bold text-xs uppercase py-3.5 px-10 rounded-xl transition-all shadow-lg text-center"
                >
                  Authorized & Place order 
                </button>
              </div>

            </form>

            {/* Right side check outline card details summaries */}
            <div className="lg:col-span-1">
              <div className="bg-slate-900 text-white rounded-3xl p-5 space-y-4 shadow-xl">
                <h3 className="text-xs font-black uppercase tracking-widest text-[#E53935]">Your Order Details</h3>
                <div className="divide-y divide-zinc-800 text-xs">
                  {buyNowItem ? (
                    <div className="py-2.5 space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="pr-2 space-y-1">
                          <span className="font-extrabold block text-white text-xs leading-snug">{buyNowItem.product.name}</span>
                          <span className="text-[10px] text-zinc-300 block">Origin: <strong className="text-yellow-400 font-bold">{buyNowItem.product.origin}</strong></span>
                          <span className="text-[10px] text-zinc-350 block">Stock status: <strong className="text-[#00C853] font-bold">{buyNowItem.product.stockCount > 0 ? "✓ In Stock" : "Supplier Direct Ready"}</strong></span>
                          <span className="bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 text-[9px] px-2 py-0.5 rounded block w-fit font-bold mt-1">
                             Estimated Arrival: {buyNowItem.product.origin === ShippingOrigin.BANGLADESH ? "1-3 Business Days" : "25-30 Business Days"}
                          </span>
                        </div>
                        <span className="text-zinc-200 font-extrabold text-xs whitespace-nowrap">
                          {convertPrice((buyNowItem.product.discountedPrice + (buyNowItem.selectedVariant?.priceModifier || 0)) * buyNowItem.quantity)}
                        </span>
                      </div>

                      {/* Quantity Selector inside right column */}
                      <div className="flex items-center justify-between bg-zinc-950 p-2 rounded-xl mt-1 border border-zinc-800">
                        <span className="text-[10px] text-zinc-400 uppercase font-black">Adjust Quantity</span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              if (buyNowItem.quantity > 1) {
                                setBuyNowItem({ ...buyNowItem, quantity: buyNowItem.quantity - 1 });
                              }
                            }}
                            className="bg-zinc-800 hover:bg-zinc-700 text-white rounded h-6 w-6 font-bold flex items-center justify-center cursor-pointer"
                          >
                            -
                          </button>
                          <span className="text-xs font-bold text-white px-1.5">{buyNowItem.quantity}</span>
                          <button
                            type="button"
                            onClick={() => {
                              setBuyNowItem({ ...buyNowItem, quantity: buyNowItem.quantity + 1 });
                            }}
                            className="bg-zinc-800 hover:bg-zinc-700 text-white rounded h-6 w-6 font-bold flex items-center justify-center cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    cart.map((item, idx) => (
                      <div key={idx} className="flex justify-between py-2.5">
                        <div className="pr-2">
                          <span className="font-semibold block text-zinc-200">{item.product.name}</span>
                          <span className="text-[10px] text-zinc-400">Qty: {item.quantity} • {item.product.origin}</span>
                        </div>
                        <span className="text-zinc-200 font-semibold">{convertPrice((item.product.discountedPrice + (item.selectedVariant?.priceModifier || 0)) * item.quantity)}</span>
                      </div>
                    ))
                  )}
                </div>

                <div className="border-t border-zinc-800 pt-3 text-xs space-y-2 text-zinc-400">
                  <div className="flex justify-between">
                    <span>Shipping Handling:</span>
                    <span>{convertPrice(getCartTotals().shipping)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>{convertPrice(getCartTotals().tax)}</span>
                  </div>
                  <div className="flex justify-between text-white font-bold text-sm pt-2">
                    <span>Aggregate Amount:</span>
                    <span className="text-[#E53935]">{convertPrice(getCartTotals().total)}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </main>
      )}

      {/* VIEW: FRICIONLESS REAL-TIME TRACKING TIMELINE PORTAL */}
      {currentView === "track" && (
        <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-8 py-10 w-full">
          <h2 className="text-2xl font-black font-display text-slate-800 uppercase tracking-tight flex items-center gap-2 mb-6">
            <Clock className="w-6 h-6 text-[#E53935]" />
            {t.trackOrderHeader}
          </h2>

          {/* Core Searching Finder Box */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-lg p-5 mb-8">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider mb-2">Insert tracking registration parameter:</span>
            <form onSubmit={handleTrackQuery} className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                required
                placeholder="e.g. CG-BD-7821, CG-CN-9943"
                value={searchTrackId}
                onChange={(e) => setSearchTrackId(e.target.value)}
                className="bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl text-xs w-full uppercase font-mono font-bold focus:outline-none focus:ring-1 focus:ring-[#E53935]"
              />
              <button
                type="submit"
                className="bg-[#212121] hover:bg-[#E53935] text-white font-bold text-xs uppercase py-3 px-8 rounded-2xl transition-all shadow-md shrink-0"
              >
                Inspect Timeline status
              </button>
            </form>
            {lookupError && (
              <p className="text-xs text-red-500 font-mono mt-3.5 flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" /> {lookupError}
              </p>
            )}
          </div>

          {/* Timeline details representation if matched */}
          {lookedUpOrder ? (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-6 space-y-6">
              
              {/* Top Summary header card */}
              <div className="flex flex-col sm:flex-row justify-between sm:items-center bg-slate-50 p-4 rounded-2xl gap-3 text-xs border border-slate-100">
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">Unique order tracker ID:</span>
                  <strong className="text-base text-slate-800 font-mono">{lookedUpOrder.id}</strong>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">Logistics Courier Registry ID:</span>
                  <strong className="text-slate-700 font-mono">{lookedUpOrder.trackingNumber}</strong>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">Settlement Strategy:</span>
                  <span className="bg-slate-200 text-slate-900 px-2 py-0.5 rounded text-[9.5px] font-bold font-mono">
                    {lookedUpOrder.paymentMethod} • {lookedUpOrder.paymentStatus}
                  </span>
                </div>
              </div>

              {/* Order Fulfill detail */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs border-b border-slate-100 pb-4">
                <div>
                  <p className="text-slate-400 text-[10px] uppercase font-bold mb-1">Shipping Target Destination Address:</p>
                  <p className="text-slate-700 font-medium">{lookedUpOrder.customerAddress}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-[10px] uppercase font-bold mb-1">Purchased Products Items Checklist:</p>
                  <ul className="list-disc pl-4 space-y-1">
                    {lookedUpOrder.items.map((i, idx) => (
                      <li key={idx} className="text-slate-700 shrink-0">
                        {i.product.name} (Qty: {i.quantity}) {i.selectedVariant ? `[${i.selectedVariant.name}]` : ""}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Graphical Segmented Vertical Timeline steps list! */}
              <div className="space-y-6 relative pl-6 border-l-2 border-slate-100 ml-4 pt-1">
                {lookedUpOrder.timeline.map((item, idx) => {
                  return (
                    <div key={idx} className="relative group">
                      
                      {/* Circle dot checkpoint bullet */}
                      <span className={`absolute -left-[31px] top-1 h-4 w-4 rounded-full border-2 flex items-center justify-center transition-all ${
                        item.completed 
                          ? "bg-[#00C853] border-emerald-500 scale-110" 
                          : "bg-white border-slate-200"
                      }`}>
                        {item.completed && <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse"></span>}
                      </span>

                      {/* Timeline detail content text */}
                      <div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                          <h4 className={`text-xs uppercase tracking-wider font-extrabold ${
                            item.status === lookedUpOrder.currentStatus 
                              ? "text-[#E53935]" 
                              : item.completed ? "text-slate-800" : "text-slate-400"
                          }`}>
                            {item.status}
                          </h4>
                          {item.timestamp && (
                            <span className="text-[9px] text-zinc-400 font-mono">
                              {new Date(item.timestamp).toLocaleString(undefined, {
                                month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                              })}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 leading-normal mt-1">{item.description}</p>
                        
                        {/* Display custom hints based on status */}
                        {item.status === OrderStatus.CUSTOMS && !item.completed && (
                          <div className="bg-yellow-50 text-[10px] text-amber-800 border border-yellow-200 rounded-lg p-2 mt-1.5 max-w-md">
                            ⚠️ Note: Customs inspections clearance is handled fully by our central Dhaka shipping brokers. Average inspection takes 1-2 days inside green lanes.
                          </div>
                        )}
                      </div>

                    </div>
                  );
                })}
              </div>

              {/* Expected Delivery Date target countdown display */}
              <div className="bg-slate-50 border border-slate-150 rounded-2xl p-4 text-xs text-slate-550 leading-relaxed text-center">
                🚚 Logistics Distribution Hub Status: <strong className="text-slate-800">Operational</strong> • Estimated delivery to doorstep is finalized soon after customs dispatch. Check back in a few hours.
              </div>

            </div>
          ) : (
            <div className="bg-white border border-slate-150 rounded-3xl p-12 text-center text-slate-400 space-y-4">
              <Info className="w-10 h-10 text-slate-300 mx-auto animate-pulse" />
              <p className="text-sm">Please insert an order tracking ID to trace progress. You can easily test with pre-seeded order IDs like: <strong className="text-[#E53935] font-semibold underline">CG-BD-7821</strong> (Local cargo) or <strong className="text-[#E53935] font-semibold underline">CG-CN-9943</strong> (Direct China export).</p>
            </div>
          )}
        </main>
      )}

      {/* VIEW: USER PERSONAL ACCOUNT DASHBOARD */}
      {currentView === "dashboard" && (
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-8 py-10 w-full">
          <h2 className="text-2xl font-black font-display text-slate-800 uppercase tracking-tight flex items-center gap-2 mb-6">
            <User className="w-6 h-6 text-[#E53935]" />
            {t.userAccount}
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Left sidebar directory cards */}
            <div className="lg:col-span-1 bg-white border border-slate-100 rounded-3xl p-5 shadow-xs space-y-4 h-fit">
              <div className="text-center pb-4 border-b border-slate-100">
                <div className="w-16 h-16 bg-[#E53935] text-white font-extrabold flex items-center justify-center rounded-full text-xl mx-auto font-display shadow-md">
                  JS
                </div>
                <h3 className="font-bold text-base text-slate-800 mt-2">{userName}</h3>
                <span className="text-[10px] text-slate-400 font-mono">{userEmail}</span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-750">
                <p><strong>Primary Address:</strong></p>
                <p className="text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100 leading-normal">{userAddress}</p>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={() => alert("Credentials details edit feature is currently locked. Default address is preloaded.")}
                  className="w-full text-left font-bold text-xs text-slate-600 hover:text-[#E53935] transition-colors py-2 block border-t border-slate-100"
                >
                  ⚙️ Account Address Settings
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setWishlist([]);
                    alert("Wishlist deleted");
                  }}
                  className="w-full text-left font-bold text-xs text-red-600 transition-colors py-2 block"
                >
                  🗑️ Wipe Bookmarked Wishes
                </button>
              </div>
            </div>

            {/* Right side information folders tabs */}
            <div className="lg:col-span-3 space-y-6">
              
              {/* Order Histories list */}
              <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-xs">
                <h3 className="text-xs font-black uppercase text-slate-500 tracking-wider mb-4 border-b border-slate-100 pb-2">
                  My Active Orders History ({allOrders.length})
                </h3>

                {allOrders.length === 0 ? (
                  <p className="text-xs text-slate-400 py-6 text-center">No transactions registered. Add some products and checkout!</p>
                ) : (
                  <div className="space-y-4">
                    {allOrders.map((o) => (
                      <div key={o.id} className="border border-slate-150 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div>
                          <p className="font-mono text-xs font-bold text-slate-800">{o.id}</p>
                          <span className="text-[10px] text-zinc-400 block mt-0.5">Purchased {o.items.reduce((sum, i) => sum + i.quantity, 0)} items on {new Date(o.createdAt).toLocaleDateString()}</span>
                          <span className="bg-zinc-800 text-white font-mono text-[9px] font-bold px-2 py-0.5 rounded uppercase mt-2 inline-block">
                            LOGISTICS STATUS: {o.currentStatus}
                          </span>
                        </div>
                        <div className="flex sm:flex-col items-end gap-2 text-right">
                          <strong className="text-[#E53935] font-black text-sm block">{convertPrice(o.totalAmount)} BDT</strong>
                          <button
                            onClick={() => {
                              setSearchTrackId(o.id);
                              setLookedUpOrder(o);
                              setCurrentView("track");
                            }}
                            className="bg-slate-100 hover:bg-[#E53935] hover:text-white text-slate-700 text-[10px] font-bold py-1.5 px-3.5 rounded-xl transition-all"
                          >
                            Trace Timeline Order
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Wishlist Bookmarks folders */}
              <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-xs">
                <h3 className="text-xs font-black uppercase text-slate-500 tracking-wider mb-4 border-b border-slate-100 pb-2">
                  My Wishlist Bookmarks Folder ({wishlist.length})
                </h3>

                {wishlist.length === 0 ? (
                  <p className="text-xs text-slate-400 py-6 text-center">No item bookmarked currently. Click the 🤍 icon on product grids!</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {products.map((p) => {
                      if (!wishlist.includes(p.id)) return null;
                      return (
                        <div key={p.id} className="bg-slate-50/50 border border-slate-150 p-3 rounded-2xl flex items-center justify-between">
                          <div 
                            className="flex items-center gap-2 text-xs cursor-pointer hover:opacity-80 transition-opacity select-none"
                            onClick={() => setSelectedProduct(p)}
                          >
                            <img src={p.image} className="w-10 h-10 object-cover rounded-lg" alt="" />
                            <div>
                              <p className="font-semibold text-slate-800 line-clamp-1">{p.name}</p>
                              <strong className="text-[#E53935] mt-1 block">{convertPrice(p.discountedPrice)}</strong>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              handleAddToCart(p, p.variants[0] || null);
                              toggleWishlist(p.id);
                              alert("Moved to cart!");
                            }}
                            className="bg-black hover:bg-[#E53935] text-white text-[9px] font-bold py-1.5 px-3 rounded-xl uppercase shrink-0"
                          >
                            Move Cart
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Refund requests history console segment */}
              <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-xs">
                <h4 className="text-xs font-black uppercase text-slate-500 tracking-wider mb-2">Refund & Replacement Actions Desk</h4>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">Eligible for the 7-day local replacement guarantee on warehouse stock orders. No active replacement query is currently processing.</p>
                <button
                  onClick={() => alert("To raise a refund request, start chat support at help desk below or write order ID inside AI support assistant.")}
                  className="bg-[#212121] hover:bg-[#E53935] text-white text-[10px] font-bold py-2 px-5 rounded-xl uppercase tracking-wider transition-all"
                >
                  Raise Replacement Ticket
                </button>
              </div>

            </div>

          </div>
        </main>
      )}

      {/* VIEW: ADMIN CONTROL CONSOLE WORKSPACE */}
      {currentView === "admin" && (
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-8 py-10">
          <AdminPanel
            products={products}
            orders={allOrders}
            currency={activeCurConfig}
            onRefreshProducts={fetchProducts}
            onRefreshOrders={fetchOrders}
            onAddProduct={handleAddProductAdmin}
            onEditProduct={handleEditProductAdmin}
            onDeleteProduct={handleDeleteProductAdmin}
            onUpdateOrderStatus={handleUpdateOrderStatusAdmin}
            onResetDatabase={handleResetDatabaseAdmin}
          />
        </main>
      )}

      {/* VIEW: HELP CENTER & FAQ SUBMISSIONS */}
      {currentView === "help" && (
        <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-8 py-10">
          <h2 className="text-2xl font-black font-display text-slate-800 uppercase tracking-tight flex items-center gap-2 mb-6 border-b pb-3">
            <HelpCircle className="w-6 h-6 text-[#E53935]" />
            1% of China Help Center
          </h2>

          <div className="space-y-6">
            
            <div className="bg-red-50 text-slate-800 rounded-3xl p-6 border border-red-100 space-y-3 shadow-xs">
              <h3 className="font-bold text-base text-[#E53935]">📦 Quick Fulfillments Guide Summary</h3>
              <p className="text-xs leading-relaxed text-slate-650">
                1% of China merges local dispatch with imported wholesale direct suppliers. The <strong>Bangladesh Warehouses</strong> are located in major zones of Dhaka, so they provide rapid deliveries within 2-3 Days with Cash on Delivery options. 
                For the <strong>China suppliers direct imports</strong>, since products ship directly from Shenzhen to your destination address in Bangladesh, transit times range around 25-30 business days, however we handle 100% of the customs taxation, duties clearances and international vessel shipping!
              </p>
            </div>

            {/* FAQs List Loop */}
            <div className="space-y-4 pt-4">
              <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Frequently Asked Questions</h4>
              <div className="space-y-3 text-xs">
                {faqList.map((f, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-slate-100 p-4 shadow-2xs">
                    <strong className="text-slate-850 font-semibold block mb-1">Q: {f.question}</strong>
                    <p className="text-slate-500 leading-relaxed">A: {f.answer}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Q&A custom question submitter input */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-lg p-5">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider mb-2">Ask a Custom Question:</span>
              <div className="space-y-3">
                <textarea
                  placeholder="e.g. Can I pre-order customized corporate gifts?"
                  value={newFAQQuestion}
                  onChange={(e) => setNewFAQQuestion(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs focus:ring-1 focus:ring-[#E53935] outline-none"
                  rows={2}
                />
                <button
                  type="button"
                  onClick={() => {
                    if (!newFAQQuestion.trim()) return;
                    setFaqList([...faqList, { 
                      question: newFAQQuestion, 
                      answer: "Our system logged your inquiry! A support specialist from our Dhaka branch will email you within 2-3 hours with detailed quotes." 
                    }]);
                    setNewFAQQuestion("");
                    alert("Ticket Created Successfully. Thank you!");
                  }}
                  className="bg-[#212121] hover:bg-[#E53935] text-white text-xs font-bold py-2.5 px-6 rounded-xl transition-all font-display uppercase tracking-wider"
                >
                  Post Help ticket
                </button>
              </div>
            </div>

          </div>
        </main>
      )}

      {/* 4. FOOTER PAYMENT AND LOGISTICS BAR */}
      <footer className="bg-white border-t border-slate-150 py-5 px-4 sm:px-8 mt-auto text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 items-start sm:items-center text-[10px] uppercase font-bold tracker-wider">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#00C853] animate-pulse"></span>
              <span>Bangladesh Warehouses: Connected (1-3 Days Fulfill)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-indigo-505 bg-indigo-500 animate-pulse"></span>
              <span>Shenzhen suppliers nodes: operational (25-30 Days Shipping)</span>
            </div>
          </div>

          <div className="flex items-center gap-4 flex-wrap justify-center text-[10px] font-bold uppercase text-slate-400">
            <span>Secured Payments via:</span>
            <div className="flex gap-2.5 text-[10.5px] text-[#212121] bg-slate-100 px-3.5 py-1.5 rounded-lg border border-slate-150 font-mono">
              <span className="text-pink-600 font-extrabold font-display">bKash</span>
              <span>•</span>
              <span className="text-orange-600 font-extrabold font-display">Nagad</span>
              <span>•</span>
              <span className="text-indigo-600 font-bold">VISA / PayPal</span>
              <span>•</span>
              <span className="text-emerald-700 font-extrabold">COD Supported</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-4 pt-4 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center text-[10px] text-slate-400 gap-4">
          <div className="flex flex-col gap-1 items-center md:items-start text-center md:text-left">
            <span>&copy; 2026 1% of China, Ltd. All rights reserved. Registered importer trade certificate.</span>
            <span className="text-[9.5px] font-black tracking-widest text-slate-500 uppercase">
              🛠️ Developed by <span className="text-[#E53935]">Jamil (01307541441)</span> • Connected with Supabase Realtime DB
            </span>
          </div>
          <div className="flex gap-4 items-center">
            <span className="hover:text-red-500 cursor-pointer" onClick={() => setCurrentView("help")}>Terms of service</span>
            <span>•</span>
            <span className="hover:text-red-500 cursor-pointer" onClick={() => setCurrentView("help")}>Privacy Shield</span>
            <span>•</span>
            <span className="bg-[#E53935]/10 text-[#E53935] text-[9px] font-black px-3 py-1 rounded-lg uppercase tracking-wider border border-red-200/20 shadow-3xs animate-pulse">
              MADE BY JAMIL 01307541441
            </span>
          </div>
        </div>
      </footer>
      </div> {/* 💻 END OF PC/DESKTOP VIEW WRAPPER */}

      {/* 📱 PORTABLE/PHONE MOBILE-FIRST CUSTOM VIEW WRAPPER */}
      <div className="md:hidden flex flex-col min-h-screen bg-[#F5F5F7] pb-24">
        
        {/* Mobile Red Top Bar Header */}
        <div className="bg-[#E53935] text-white pt-4 pb-3 px-4 flex flex-col gap-3 relative shadow-md shrink-0">
          <div className="flex justify-between items-center">
            {/* Location Select pin */}
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-white/90" />
              <span className="text-[11px] font-black tracking-wide text-white">Dhaka, Bangladesh</span>
            </div>
            
            {/* Right Header Navigation Icons */}
            <div className="flex items-center gap-4">
              <select
                value={currentLang}
                onChange={(e) => setCurrentLang(e.target.value as LanguageKey)}
                className="bg-transparent text-white text-[10px] font-bold outline-none border-none cursor-pointer"
              >
                <option value="en" className="text-black">EN</option>
                <option value="bn" className="text-black">বাংলা</option>
                <option value="zh" className="text-black">中文</option>
              </select>

              <select
                value={currentCurrency}
                onChange={(e) => setCurrentCurrency(e.target.value as CurrencyKey)}
                className="bg-transparent text-white text-[10px] font-bold outline-none border-none cursor-pointer"
              >
                <option value="BDT" className="text-black">৳ BDT</option>
                <option value="USD" className="text-black">$ USD</option>
                <option value="CNY" className="text-black">¥ CNY</option>
              </select>

              <button 
                onClick={() => setCurrentView("cart")}
                className="relative text-white"
              >
                <ShoppingCart className="w-5 h-5 text-white" />
                {cart.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#00C853] text-white text-[9px] h-3.5 w-3.5 rounded-full flex items-center justify-center font-bold">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </button>

              <button 
                onClick={() => alert("Notification Hub: No new import notifications today!")}
                className="text-white"
              >
                <Bell className="w-5 h-5 text-white/95" />
              </button>
            </div>
          </div>

          {/* Brand Logo & Slogan Header row */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => {
            setCurrentView("home");
            setSelectedCategory("All");
            setSelectedOriginFilter("all");
          }}>
            <img 
              src={brandLogo} 
              alt="1% of China" 
              className="w-9 h-9 object-contain rounded-full bg-white p-0.5 shadow-sm" 
              referrerPolicy="no-referrer"
            />
            <div className="flex flex-col">
              <span className="text-base font-black text-white tracking-tight">1% of China</span>
              <span className="text-[8px] font-bold text-red-100 tracking-widest uppercase leading-none mt-0.5">Your Piece of China • এক টুকরো চীন</span>
            </div>
          </div>

          {/* Integrated Search Input bar */}
          <form onSubmit={handleSearchSubmit} className="relative mt-1">
            <div className="flex items-center bg-white rounded-2xl overflow-hidden pr-1 border border-slate-100 shadow-sm">
              <select
                value={selectedOriginFilter}
                onChange={(e) => setSelectedOriginFilter(e.target.value as any)}
                className="bg-slate-100 text-[#212121] text-[9.5px] font-black px-2.5 py-2.5 border-r border-slate-200 outline-none uppercase shrink-0"
              >
                <option value="all">📦 All Hubs</option>
                <option value="BD">🇧🇩 BD Stock</option>
                <option value="China">🇨🇳 China Direct</option>
              </select>
              <input
                type="text"
                placeholder="Search products, brands, category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none py-2 px-3 text-xs text-slate-800 focus:outline-none focus:ring-0 placeholder:text-slate-400"
              />
              <button
                type="submit"
                className="bg-[#E53935] hover:bg-red-700 text-white font-extrabold text-[10px] uppercase py-1.5 px-4 rounded-xl transition-all"
              >
                Search
              </button>
            </div>
          </form>
        </div>

        {/* Yellow Custom Ticker announcement banner scrolling */}
        <div className="bg-[#FFF9C4] text-[#795548] text-[10px] font-bold py-1.5 px-4 overflow-hidden whitespace-nowrap border-b border-yellow-250 flex items-center justify-between shrink-0">
          <span className="animate-marquee block">🚚 💫 Free delivery on orders above {convertPrice(999)} from BD warehouse!</span>
          <span className="text-[10px] font-black shrink-0 ml-1">★ PREMIUM</span>
        </div>

        {/* Mobile View Display Logic Switcher */}
        <main className="flex-1 overflow-y-auto min-h-0">
          
          {currentView === "product-details" && selectedProduct && (
            <ProductDetailsPage
              selectedProduct={selectedProduct}
              onBack={() => {
                setCurrentView("home");
                setSelectedProduct(null);
              }}
              convertPrice={convertPrice}
              handleAddToCart={handleAddToCart}
              handleBuyNow={handleBuyNow}
              wishlist={wishlist}
              toggleWishlist={toggleWishlist}
              checkAuthOrOpenLogin={checkAuthOrOpenLogin}
              products={products}
              setSelectedProduct={setSelectedProduct}
            />
          )}
          
          {currentView === "home" && (
            <div className="flex-1 space-y-4 pb-12">
              
              {/* Carousel Banner card */}
              <div className="px-4 pt-4">
                <div className="bg-gradient-to-r from-amber-400 via-orange-450 via-orange-500 to-[#E53935] rounded-3xl p-5 text-white relative overflow-hidden shadow-md">
                  <div className="absolute -bottom-8 -right-8 opacity-25 text-9xl">🎁</div>
                  
                  <div className="relative z-10 space-y-3.5 max-w-[70%]">
                    <span className="bg-white/20 backdrop-blur-xs text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full text-white border border-white/10">
                      🔥 Limited Time Offer
                    </span>
                    <div className="space-y-1">
                      <h4 className="text-[10px] uppercase font-black tracking-wider text-amber-100">Lowest Prices Guaranteed</h4>
                      <h3 className="text-xl sm:text-2xl font-black font-display tracking-tight leading-none text-white">
                        Direct from China
                      </h3>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedOriginFilter("China");
                        document.getElementById("catalog-showcase-mobile")?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="bg-white text-slate-900 hover:bg-slate-100 font-extrabold text-[10px] px-4 py-1.5 rounded-full flex items-center gap-1 shadow-sm transition-all cursor-pointer"
                    >
                      Browse <span className="font-extrabold">➔</span>
                    </button>
                  </div>

                  <div className="absolute bottom-4 right-4 flex items-center gap-1.5 z-10">
                    <span className="h-1.5 w-4 rounded-full bg-white transition-all"></span>
                    <span className="h-1.5 w-1.5 rounded-full bg-white/40"></span>
                    <span className="h-1.5 w-1.5 rounded-full bg-white/40"></span>
                  </div>
                </div>
              </div>

              {/* Warehouse Hub Selector buttons */}
              <div className="grid grid-cols-2 gap-3 px-4 pt-1">
                <button
                  onClick={() => {
                    setSelectedOriginFilter("BD");
                    setSelectedCategory("All");
                  }}
                  className={`p-3 rounded-2xl flex items-center gap-2 shadow-xs border text-left transition-all ${
                    selectedOriginFilter === "BD"
                      ? "bg-[#00C853] text-white border-transparent ring-2 ring-[#00C853]/20"
                      : "bg-white border-slate-150 text-slate-800 hover:bg-slate-50"
                  }`}
                >
                  <div className="bg-emerald-100/15 text-white rounded-xl p-1.5">
                    <Truck className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[10px] font-black uppercase tracking-wide truncate">BD Warehouse</span>
                    <span className="text-[9px] font-bold text-slate-500 opacity-90 leading-none mt-0.5 truncate">1-3 Day Delivery</span>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setSelectedOriginFilter("China");
                    setSelectedCategory("All");
                  }}
                  className={`p-3 rounded-2xl flex items-center gap-2 shadow-xs border text-left transition-all ${
                    selectedOriginFilter === "China"
                      ? "bg-[#FF5722] text-white border-transparent ring-2 ring-[#FF5722]/20"
                      : "bg-white border-slate-150 text-slate-800 hover:bg-slate-50"
                  }`}
                >
                  <div className="bg-orange-100/15 text-white rounded-xl p-1.5">
                    <Globe className="w-5 h-5 text-orange-500" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[10px] font-black uppercase tracking-wide truncate">Direct China</span>
                    <span className="text-[9px] font-bold text-slate-500 opacity-90 leading-none mt-0.5 truncate">25-30 Days</span>
                  </div>
                </button>
              </div>

              {/* Shop by Category carousel list row */}
              <div className="px-4 pt-1 space-y-2.5">
                <div className="flex justify-between items-center">
                  <h3 className="font-extrabold text-xs text-slate-850 uppercase tracking-widest">Shop by Category</h3>
                  <button 
                    onClick={() => {
                      setSelectedCategory("All");
                      setSelectedOriginFilter("all");
                    }}
                    className="text-[11px] font-black text-[#E53935] hover:underline"
                  >
                    All &gt;
                  </button>
                </div>

                <div className="flex items-center gap-3.5 overflow-x-auto pb-1 scrollbar-none">
                  {[
                    { key: "Barcode Scanners", name: "Barcode", bg: "bg-amber-50 text-amber-600", icon: "🏷️" },
                    { key: "Document Scanners", name: "Doc Scan", bg: "bg-blue-50 text-blue-600", icon: "📄" },
                    { key: "Wearable Scanners", name: "Wearable", bg: "bg-emerald-50 text-[#00C853]", icon: "💍" },
                    { key: "Handheld Scanners", name: "Handheld", bg: "bg-rose-50 text-[#E53935]", icon: "🔫" },
                    { key: "Industrial Scanners", name: "Industrial", bg: "bg-orange-50 text-orange-600", icon: "🏭" },
                    { key: "Label Printers", name: "Printers", bg: "bg-pink-50 text-pink-600", icon: "🖨️" }
                  ].map((catItem) => (
                    <button
                      key={catItem.key}
                      onClick={() => {
                        setSelectedCategory(catItem.key);
                      }}
                      className="flex flex-col items-center gap-1 focus:outline-none shrink-0"
                    >
                      <div className={`w-13 h-13 rounded-full flex items-center justify-center text-lg shadow-2xs transition-all border ${
                        selectedCategory === catItem.key 
                          ? "border-[#E53935] ring-2 ring-red-500/20 bg-white" 
                          : "border-slate-100 bg-white"
                      }`}>
                        <span>{catItem.icon}</span>
                      </div>
                      <span className={`text-[9.5px] font-bold tracking-tight ${
                        selectedCategory === catItem.key ? "text-[#E53935]" : "text-slate-500"
                      }`}>
                        {catItem.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Products Grid container */}
              <div id="catalog-showcase-mobile" className="px-4 pb-12 space-y-3.5">
                <div className="flex justify-between items-center pt-2">
                  <h3 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider">
                    {selectedCategory === "All" ? "Feature Products" : selectedCategory}
                  </h3>
                  <span className="text-[9.5px] text-slate-500 font-bold bg-white px-2.5 py-1 rounded-full shadow-2xs border">
                    {displayedProducts.length} Products
                  </span>
                </div>

                {displayedProducts.length === 0 ? (
                  <div className="bg-white border rounded-2xl p-8 text-center text-slate-400 text-xs shadow-sm">
                    No imported inventory matched the specific category hubs.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3 pb-8">
                    {displayedProducts.map((p) => {
                      const isWishlisted = wishlist.includes(p.id);
                      return (
                        <div 
                          key={p.id} 
                          className="bg-white rounded-2xl p-2.5 border border-transparent shadow-2xs hover:border-red-500 cursor-pointer flex flex-col justify-between transition-all" 
                          onClick={() => {
                            setSelectedProduct(p);
                            setCurrentView("product-details");
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                        >
                          <div>
                            <div className="aspect-square bg-slate-55 rounded-xl overflow-hidden relative flex items-center justify-center">
                              <img src={p.image} className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  checkAuthOrOpenLogin(() => toggleWishlist(p.id));
                                }}
                                className="absolute top-1.5 right-1.5 bg-white/80 p-1.5 rounded-full shadow-2xs"
                              >
                                <Heart className={`w-3 h-3 ${isWishlisted ? "fill-red-500 text-red-500" : "text-slate-500"}`} />
                              </button>
                            </div>
                            
                            <div className="mt-2 flex flex-col gap-1">
                              <div>
                                <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded ${
                                  p.origin === ShippingOrigin.BANGLADESH ? "bg-emerald-50 text-[#00C853]" : "bg-zinc-100 text-zinc-700"
                                }`}>
                                  {p.origin === ShippingOrigin.BANGLADESH ? "BD Stock" : "China direct"}
                                </span>
                              </div>

                              <h4 className="text-[11px] font-extrabold text-slate-800 line-clamp-2 min-h-[32px] leading-tight mt-0.5">
                                {p.name}
                              </h4>

                              <div className="flex items-center gap-0.5">
                                <span className="text-yellow-500 text-[9px]">★</span>
                                <span className="text-[9px] text-slate-450 font-bold">{p.rating.toFixed(1)} ({p.reviewCount})</span>
                              </div>
                            </div>
                          </div>

                          <div className="mt-2.5 pt-2 border-t border-slate-50 flex flex-col gap-2">
                            <div className="flex flex-col">
                              <span className="text-[#E53935] font-black text-xs">{convertPrice(p.discountedPrice)}</span>
                              <span className="text-[9px] line-through text-slate-400">{convertPrice(p.originalPrice)}</span>
                            </div>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                checkAuthOrOpenLogin(() => handleBuyNow(p, p.variants[0] || null));
                              }}
                              className="w-full bg-[#E53935] hover:bg-black text-white text-[9.5px] font-extrabold py-1.5 rounded-lg text-center uppercase tracking-wider"
                            >
                              Buy Now 🚀
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>
          )}

          {currentView === "cart" && (
            <div className="flex-1 p-4 pb-20 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <button onClick={() => setCurrentView("home")} className="text-slate-600 bg-white p-1.5 rounded-full border shadow-2xs text-xs">
                  ← Home
                </button>
                <h3 className="font-extrabold text-xs text-slate-800 uppercase tracking-widest">Shopping Cart</h3>
              </div>
              
              {cart.length === 0 ? (
                <div className="bg-white border rounded-2xl p-8 text-center text-slate-400 space-y-3 shadow-2xs">
                  <ShoppingCart className="w-10 h-10 text-slate-200 mx-auto" />
                  <p className="font-bold text-slate-650 text-xs">Your shopping cart is empty.</p>
                  <button onClick={() => setCurrentView("home")} className="bg-[#E53935] text-white font-bold text-[10px] uppercase py-2 px-6 rounded-lg">
                    Discover Products
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.some(item => item.product.origin === ShippingOrigin.BANGLADESH) && (
                    <div className="bg-white border border-emerald-100 rounded-2xl p-4 shadow-2xs">
                      <h4 className="text-[10px] font-black uppercase text-emerald-600 border-b pb-2 mb-3">🇧🇩 Bangladesh Warehouses (1-3 Days)</h4>
                      <div className="divide-y divide-slate-100 space-y-3">
                        {cart.map((item, idx) => {
                          if (item.product.origin !== ShippingOrigin.BANGLADESH) return null;
                          const itemPrice = item.product.discountedPrice + (item.selectedVariant?.priceModifier || 0);
                          return (
                            <div key={idx} className="flex gap-3 py-2 first:pt-0">
                              <img src={item.product.image} className="w-12 h-12 object-cover rounded-lg" />
                              <div className="flex-1 min-w-0">
                                <h5 className="font-bold text-xs text-slate-805 truncate">{item.product.name}</h5>
                                <span className="text-[9px] text-slate-400 block mt-0.5 uppercase">Accent: {item.selectedVariant?.name || "Standard Accent"}</span>
                                <div className="flex justify-between items-center mt-2 flex-wrap gap-1">
                                  <span className="text-[#E53935] font-black text-xs">{convertPrice(itemPrice * item.quantity)}</span>
                                  <div className="flex items-center border rounded-lg bg-slate-50 text-[10px]">
                                    <button onClick={() => handleUpdateCartQty(idx, -1)} className="px-2 py-0.5 font-bold text-slate-400">-</button>
                                    <span className="px-2">{item.quantity}</span>
                                    <button onClick={() => handleUpdateCartQty(idx, 1)} className="px-2 py-0.5 font-bold text-slate-400">+</button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {cart.some(item => item.product.origin === ShippingOrigin.CHINA) && (
                    <div className="bg-white border border-purple-100 rounded-2xl p-4 shadow-2xs">
                      <h4 className="text-[10px] font-black uppercase text-purple-700 border-b pb-2 mb-3">🇨🇳 China supplier direct (25-30 Days)</h4>
                      <div className="divide-y divide-slate-100 space-y-3">
                        {cart.map((item, idx) => {
                          if (item.product.origin !== ShippingOrigin.CHINA) return null;
                          const itemPrice = item.product.discountedPrice + (item.selectedVariant?.priceModifier || 0);
                          return (
                            <div key={idx} className="flex gap-3 py-2 first:pt-0">
                              <img src={item.product.image} className="w-12 h-12 object-cover rounded-lg" />
                              <div className="flex-1 min-w-0">
                                <h5 className="font-bold text-xs text-slate-805 truncate">{item.product.name}</h5>
                                <span className="text-[9px] text-slate-400 block mt-0.5 uppercase">Accent: {item.selectedVariant?.name || "Standard Accent"}</span>
                                <div className="flex justify-between items-center mt-5 flex-wrap gap-1">
                                  <span className="text-[#E53935] font-black text-xs">{convertPrice(itemPrice * item.quantity)}</span>
                                  <div className="flex items-center border rounded-lg bg-slate-50 text-[10px]">
                                    <button onClick={() => handleUpdateCartQty(idx, -1)} className="px-2 py-0.5 font-bold text-slate-400">-</button>
                                    <span className="px-2">{item.quantity}</span>
                                    <button onClick={() => handleUpdateCartQty(idx, 1)} className="px-2 py-0.5 font-bold text-slate-400">+</button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="bg-white border rounded-2xl p-4 space-y-3 shadow-2xs">
                    <div className="flex justify-between text-xs font-bold text-slate-655">
                      <span>Products Subtotal:</span>
                      <span>{convertPrice(cart.reduce((sum, item) => sum + (item.product.discountedPrice + (item.selectedVariant?.priceModifier || 0)) * item.quantity, 0))}</span>
                    </div>
                    <div className="flex justify-between text-xs font-bold text-slate-655">
                      <span>Shipping service fee:</span>
                      <span className="text-emerald-600">৳80 BDT flat</span>
                    </div>
                    <button
                      onClick={() => {
                        checkAuthOrOpenLogin(() => setCurrentView("checkout"));
                      }}
                      className="w-full bg-[#E53935] hover:bg-black text-white font-extrabold text-xs py-3 rounded-xl uppercase text-center tracking-wider block cursor-pointer"
                    >
                      Proceed to Checkout
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {currentView === "checkout" && (
            <div className="flex-1 p-4 pb-20 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <button onClick={() => setCurrentView("cart")} className="text-slate-600 bg-white p-1.5 rounded-full border shadow-2xs">
                  ← Cart
                </button>
                <h3 className="font-extrabold text-xs text-slate-800 uppercase tracking-widest">Cargo Checkout</h3>
              </div>

              <div className="bg-white border rounded-2xl p-4 space-y-4 shadow-2xs">
                <h4 className="text-[10px] font-black uppercase text-[#E53935]">Recipient Delivery Coordinates</h4>
                
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Full Delivery Name</label>
                    <input
                      type="text"
                      className="w-full bg-slate-50 border rounded-lg py-2 px-3 text-xs outline-none"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Recipient Phone Number</label>
                    <input
                      type="text"
                      className="w-full bg-slate-50 border rounded-lg py-2 px-3 text-xs outline-none"
                      value={userPhone}
                      onChange={(e) => setUserPhone(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Shipping Full Address</label>
                    <textarea
                      rows={2}
                      className="w-full bg-slate-50 border rounded-lg py-2 px-3 text-xs outline-none"
                      value={userAddress}
                      onChange={(e) => setUserAddress(e.target.value)}
                    />
                  </div>
                  
                  <div className="bg-slate-50 border p-3 rounded-xl space-y-1 text-[11px]">
                    <span className="font-bold text-slate-750 block">🔒 Guaranteed delivery safeguards:</span>
                    <p className="text-slate-500">Includes tracking GPS, fully prepaid import duties, and 7 days standard return policy.</p>
                  </div>

                  <button
                    onClick={(e) => handleCheckoutSubmit(e)}
                    className="w-full bg-[#E53935] hover:bg-[#212121] text-white font-black text-xs py-3 rounded-xl uppercase tracking-wider text-center cursor-pointer"
                  >
                    Confirm Import Order (৳{cart.reduce((sum, item) => sum + (item.product.discountedPrice + (item.selectedVariant?.priceModifier || 0)) * item.quantity, 80)} BDT) 🚀
                  </button>
                </div>
              </div>
            </div>
          )}

          {currentView === "track" && (
            <div className="flex-1 p-4 pb-20 space-y-4">
              <div className="bg-white border rounded-2xl p-4 space-y-4 shadow-2xs">
                <div className="text-center space-y-1 pb-2 border-b">
                  <span className="bg-red-50 text-[#E53935] font-black text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                     Tracking GPS Gateway
                  </span>
                  <h3 className="font-extrabold text-xs text-slate-800 uppercase tracking-widest mt-1">Cargo Freight Lookups</h3>
                </div>

                <div className="space-y-3.5 text-xs">
                  <label className="text-[10px] font-bold text-slate-405 block uppercase">Enter Order tracking ID</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. ORDER-1002"
                      value={searchTrackId}
                      onChange={(e) => setSearchTrackId(e.target.value)}
                      className="flex-1 bg-slate-50 border rounded-lg py-2 px-3 text-xs outline-none"
                    />
                    <button
                      onClick={(e) => handleTrackQuery(e)}
                      className="bg-[#212121] hover:bg-[#E53935] text-white font-extrabold px-4 py-2 rounded-lg uppercase text-[11px]"
                    >
                      Track
                    </button>
                  </div>
                </div>

                {lookedUpOrder ? (
                  <div className="bg-zinc-50 border rounded-xl p-3 space-y-3.5 text-xs">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-450">
                      <span>Order Code: #{lookedUpOrder.id}</span>
                      <span className="bg-[#E53935] text-white px-2 py-0.5 rounded text-[9px] uppercase">{lookedUpOrder.status}</span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[9.5px] font-bold text-slate-400 uppercase">Estimated Delivery arrival:</span>
                      <p className="font-bold text-slate-800">
                        {lookedUpOrder.shippingLabel || "Scheduled via Express freight"}
                      </p>
                    </div>

                    <div className="pt-2 border-t space-y-2">
                      <span className="text-[9.5px] font-black text-[#E53935] block uppercase">Logs Tracking Manifests:</span>
                      <div className="space-y-2.5 text-[10.5px]">
                        {lookedUpOrder.statusHistory?.map((hist, idx) => (
                          <div key={idx} className="flex gap-2 border-l-2 border-slate-200 pl-3 relative">
                            <div className="absolute -left-[5px] top-1.5 h-2 w-2 rounded-full bg-[#E53935]"></div>
                            <div>
                              <span className="font-mono text-[9px] text-slate-400 block">{hist.time || "2026-06-20"}</span>
                              <strong className="text-slate-805 font-bold block">{hist.status}</strong>
                              <p className="text-slate-500 text-[10px] leading-tight">{hist.details}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-50 rounded-xl p-4 text-center text-[9px] text-slate-400 uppercase font-black">
                     Insert your order tracking ID. Standard active code: ORDER-1002
                  </div>
                )}
              </div>
            </div>
          )}

          {currentView === "dashboard" && (
            <div className="flex-1 p-4 pb-20 space-y-4">
              <div className="bg-white border rounded-2xl p-4 shadow-2xs space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-[#E53935] text-white rounded-full flex items-center justify-center font-bold text-base">
                    {loggedInUser?.name?.[0] || "U"}
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-slate-800">{loggedInUser?.name || "Client User Profile"}</h3>
                    <span className="text-[9.5px] text-slate-400 font-mono block">{loggedInUser?.email}</span>
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    setIsLoggedIn(false);
                    setLoggedInUser(null);
                    setCurrentView("home");
                    alert("Logged out of session.");
                  }}
                  className="bg-red-50 text-[#E53935] text-[9.5px] font-bold py-1.5 px-3 rounded-lg border uppercase hover:bg-red-100 block cursor-pointer select-none"
                >
                  Logout Session
                </button>
              </div>

              {/* Saved wishlist/bookmarks */}
              <div className="bg-white border rounded-2xl p-4 shadow-2xs space-y-3">
                <h4 className="text-[9.5px] font-black uppercase text-[#E53935] tracking-widest border-b pb-1.5">Bookmarked Products List ({wishlist.length})</h4>
                {wishlist.length === 0 ? (
                  <p className="text-[10px] text-slate-400 uppercase text-center py-2 font-semibold">No saved bookmarks yet.</p>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {wishlist.map(wId => {
                      const prod = products.find(p => p.id === wId);
                      if (!prod) return null;
                      return (
                        <div 
                          key={wId} 
                          className="bg-slate-50 p-2 rounded-xl relative border cursor-pointer hover:border-[#E53935] hover:shadow-xs transition-all select-none" 
                          onClick={() => {
                            setSelectedProduct(prod);
                            setCurrentView("product-details");
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                        >
                          <img src={prod.image} className="w-full h-14 object-cover rounded-lg" />
                          <h5 className="font-bold text-[10px] text-slate-805 truncate mt-1">{prod.name}</h5>
                          <span className="text-[#E53935] font-black text-[9.5px] block">{convertPrice(prod.discountedPrice)}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {currentView === "admin" && (
            <div className="flex-1 p-4 pb-20 space-y-4">
              <div className="bg-white border rounded-2xl p-4 shadow-2xs space-y-3">
                <h3 className="font-black text-xs text-[#E53935] uppercase border-b pb-1.5">Admin Workstation Panel</h3>
                <p className="text-xs text-slate-500">Mobile admin workspace configuration is pending optimization. Please switch to a wide screen layout / desktop view device to access the database metrics, finance reports, and inventory management controls.</p>
              </div>
            </div>
          )}

          {currentView === "help" && (
            <div className="flex-1 p-4 pb-20 space-y-4">
              <div className="bg-white border rounded-2xl p-4 shadow-2xs space-y-3">
                <h3 className="font-black text-xs text-[#E53935] uppercase border-b pb-1.5 font-display">Frequently Asked Questions</h3>
                <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
                  {faqList.map((f, i) => (
                    <div key={i} className="bg-slate-50 p-3 rounded-lg border text-xs">
                      <strong className="text-slate-805 font-extrabold block">Q: {f.question}</strong>
                      <p className="text-slate-550 mt-1 leading-relaxed">A: {f.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Mobile Footer Block with Jamil Watermark */}
          <div className="px-4 py-8 mt-6 border-t border-slate-200 text-center space-y-3 pb-12 bg-white/40">
            <p className="text-[9.5px] text-slate-450 font-bold leading-normal">
              &copy; 2026 1% of China, Ltd. All rights reserved. Registered importer trade certificate.
            </p>
            <div className="flex justify-center gap-3 text-[9px] text-slate-450 font-semibold">
              <span className="hover:text-red-500 cursor-pointer" onClick={() => setCurrentView("help")}>Terms of service</span>
              <span>•</span>
              <span className="hover:text-red-500 cursor-pointer" onClick={() => setCurrentView("help")}>Privacy Shield</span>
            </div>
            <div className="pt-1.5">
              <span className="bg-[#E53935]/10 text-[#E53935] text-[8.5px] font-black px-3 py-1.5 rounded-lg uppercase tracking-wider inline-block border border-red-200/25">
                MADE BY JAMIL 01307541441
              </span>
            </div>
          </div>

        </main>

        {/* Mobile Sticky Bottom Navigation Menu Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-150 z-45 px-5 py-2.5 flex justify-between items-center shadow-[0_-4px_16px_rgba(0,0,0,0.06)] shrink-0">
          <button
            onClick={() => {
              setSelectedCategory("All");
              setSelectedOriginFilter("all");
              setSearchQuery("");
              setCurrentView("home");
            }}
            className={`flex flex-col items-center gap-0.5 w-14 cursor-pointer transition-colors ${
              currentView === "home" && selectedCategory === "All" && selectedOriginFilter === "all" ? "text-[#E53935]" : "text-slate-400 hover:text-slate-700"
            }`}
          >
            <Home className="w-5 h-5 animate-none" />
            <span className="text-[9px] font-black uppercase tracking-tight">Home</span>
          </button>

          <button
            onClick={() => {
              setSelectedOriginFilter("all");
              setSelectedCategory("All");
              setSearchQuery("");
              setCurrentView("home");
              setTimeout(() => {
                document.getElementById("catalog-showcase-mobile")?.scrollIntoView({ behavior: "smooth" });
              }, 60);
              alert("Scrolling catalog showcase boutique collection!");
            }}
            className={`flex flex-col items-center gap-0.5 w-14 cursor-pointer transition-colors ${
              currentView === "home" && selectedCategory === "All" && selectedOriginFilter === "all" ? "text-slate-400 hover:text-slate-700" : "text-slate-400 hover:text-slate-700"
            }`}
          >
            <LayoutGrid className="w-5 h-5" />
            <span className="text-[9px] font-black uppercase tracking-tight">Browse</span>
          </button>

          <button
            onClick={() => {
              setCurrentView("home");
              window.scrollTo({ top: 0, behavior: "smooth" });
              alert("Search active! Use the integrated upper input to search our full inventory.");
            }}
            className="flex flex-col items-center gap-0.5 w-14 cursor-pointer transition-colors text-slate-400 hover:text-slate-700"
          >
            <Search className="w-5 h-5" />
            <span className="text-[9px] font-black uppercase tracking-tight">Search</span>
          </button>

          <button
            onClick={() => {
              checkAuthOrOpenLogin(() => {
                setCurrentView("track");
              });
            }}
            className={`flex flex-col items-center gap-0.5 w-14 cursor-pointer transition-colors ${
              currentView === "track" ? "text-[#E53935]" : "text-slate-400 hover:text-slate-700"
            }`}
          >
            <Package className="w-5 h-5" />
            <span className="text-[9px] font-black uppercase tracking-tight">Orders</span>
          </button>

          <button
            onClick={() => {
              checkAuthOrOpenLogin(() => {
                setCurrentView("dashboard");
              });
            }}
            className={`flex flex-col items-center gap-0.5 w-14 cursor-pointer transition-colors ${
              currentView === "dashboard" ? "text-[#E53935]" : "text-slate-400"
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-[9px] font-black uppercase tracking-tight">
              {isLoggedIn ? "Account" : "Log In"}
            </span>
          </button>
        </div>

      </div> {/* 📱 END OF MOBILE PORTABLE WRAPPER */}

      {/* 5. AI CHAT ADVISOR CHATBOT WIDGET */}
      <AiChat 
        currency={activeCurConfig} 
        onSelectProduct={(p) => {
          setSelectedProduct(p);
          setCurrentView("home");
        }} 
        products={products} 
      />

      {/* 6. MODERN GOOGLE SIGN-IN & TRADITIONAL AUTHENTICATION POPUP */}
      {isLoginPopupOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative border border-slate-100 overflow-hidden">
            {/* Header branding backdrop */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-505 from-[#E53935] via-amber-500 to-indigo-600"></div>
            
            <button
              onClick={() => {
                setIsLoginPopupOpen(false);
                setAuthError(null);
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 bg-slate-50 p-1.5 rounded-full cursor-pointer transition-all"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center mt-3 mb-6">
              <span className="inline-block bg-red-50 text-[#E53935] font-extrabold text-sm px-3.5 py-1.5 rounded-full uppercase tracking-wider font-display mb-3">
                🇨🇳🎁 Identity Hub
              </span>
              <h3 className="text-lg font-black text-slate-800 tracking-tight">
                Welcome to 1% of China
              </h3>
              <p className="text-xs text-slate-500 mt-1 pb-1">
                Sign in to save your orders, wishlist and tracking information.
              </p>
            </div>

            {authError && (
              <div className="bg-red-50 text-red-650 border border-red-100 rounded-xl p-3 text-xs font-semibold mb-4 text-center">
                ⚠️ {authError}
              </div>
            )}

            {/* Simulated Google Sign-In Action Component */}
            <button
              onClick={handleGoogleSignInSimulated}
              className="w-full flex items-center justify-center gap-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs py-3 rounded-2xl transition-all shadow-sm cursor-pointer mb-5"
            >
              {/* SVG Google launcher icon */}
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.41 0-6.177-2.766-6.177-6.177s2.767-6.177 6.177-6.177c1.636 0 3.109.638 4.22 1.673l3.12-3.118C19.23 1.954 15.96 0 12.24 0 5.48 0 0 5.48 0 12.24s5.48 12.24 12.24 12.24c6.82 0 11.38-4.79 11.38-11.56 0-.71-.06-1.41-.18-2.09l-11.2 1.455z"
                ></path>
              </svg>
              Continue with Google (Auto Synced) 🚀
            </button>

            {/* Separator line */}
            <div className="flex items-center my-4 text-slate-300">
              <div className="flex-1 h-px bg-slate-150"></div>
              <span className="text-[10px] uppercase font-black px-3.5 tracking-wider text-slate-400">Or use Credentials</span>
              <div className="flex-1 h-px bg-slate-150"></div>
            </div>

            {/* Traditional standard credentials verification form */}
            <form onSubmit={handleEmailLoginSubmit} className="space-y-3">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Registration Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. customer@chinagiftshop.com"
                  value={emailForm}
                  onChange={(e) => setEmailForm(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs outline-none focus:ring-1 focus:ring-red-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1 flex justify-between">
                  <span>Secret Security Password</span>
                  <span className="text-[#E53935] font-bold hover:underline cursor-pointer normal-case" onClick={() => {
                    setEmailForm("jmisagor079@gmail.com");
                    setPasswordForm("JMIMAISHA91011!$#");
                  }}>Auto-fill Super Admin?</span>
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={passwordForm}
                  onChange={(e) => setPasswordForm(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs outline-none focus:ring-1 focus:ring-red-500 focus:bg-white"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#E53935] hover:bg-black text-white font-bold text-xs uppercase py-3 rounded-2xl transition-all shadow-md text-center block cursor-pointer mt-4"
              >
                Access Secure Gateway Account
              </button>
            </form>

            <span className="block text-[9.5px] text-center text-slate-400 mt-5 uppercase tracking-wide">
              🔒 SSL Encrypted Handshaking Safeguards
            </span>
          </div>
        </div>
      )}

      {/* 7. TWO-FACTOR SECURITY SECURITY OVERLAY MODAL */}
      {isOtpOverlayOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-55 p-4 animate-fade-in-quick">
          <div className="bg-slate-900 border border-zinc-800 text-zinc-100 rounded-3xl max-w-sm w-full p-6 shadow-2xl relative">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#E53935] to-indigo-600 animate-pulse"></div>
            
            <div className="text-center mt-2 mb-4">
              <span className="inline-block bg-zinc-800 border border-zinc-700 text-[#E53935] font-black text-[10px] px-3 py-1 rounded-full uppercase tracking-widest mb-3">
                🔐 Compliance Shield Active
              </span>
              <h4 className="text-base font-black uppercase text-white tracking-wider">Identity MFA Check</h4>
              <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                Super Admin authentication detected. For your security, please submit the 6-digit OTP code sent to your authenticator logs.
              </p>
            </div>

            {authError && (
              <div className="bg-red-500/15 text-red-400 border border-red-500/20 rounded-xl p-3 text-xs font-semibold mb-3 text-center">
                {authError}
              </div>
            )}

            <form onSubmit={handleVerify2FaSubmit} className="space-y-4">
              <div>
                <label className="block text-[9px] uppercase font-bold text-zinc-500 tracking-wider text-center mb-2">
                  OTP Code (Enter Standard Code: <strong className="text-yellow-400">123456</strong>)
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="e.g. 123456"
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  className="w-full text-center tracking-[0.4em] font-mono text-lg py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white outline-none focus:ring-1 focus:ring-[#E53935] placeholder:text-zinc-700"
                />
              </div>

              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setIsOtpOverlayOpen(false);
                    setAuthError(null);
                  }}
                  className="w-1/3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs py-2.5 rounded-xl text-center uppercase cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-2/3 bg-[#E53935] hover:bg-emerald-600 text-white font-extrabold text-xs py-2.5 rounded-xl text-center uppercase shadow-md cursor-pointer"
                >
                  Verify Access & Unlock 🔓
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
