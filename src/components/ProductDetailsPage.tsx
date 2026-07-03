import React, { useState, useEffect, useRef } from "react";
import { Product, ProductVariant, ShippingOrigin } from "../types";
import { 
  Heart, 
  ShoppingCart, 
  Star, 
  X, 
  ArrowLeft, 
  Clock, 
  Globe, 
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Award
} from "lucide-react";

interface ProductDetailsPageProps {
  selectedProduct: Product;
  onBack: () => void;
  convertPrice: (bdtPrice: number) => string;
  handleAddToCart: (product: Product, variant: ProductVariant | null) => void;
  handleBuyNow: (product: Product, variant: ProductVariant | null) => void;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  checkAuthOrOpenLogin: (callback: () => void) => void;
  products: Product[];
  setSelectedProduct: (product: Product) => void;
}

export default function ProductDetailsPage({
  selectedProduct,
  onBack,
  convertPrice,
  handleAddToCart,
  handleBuyNow,
  wishlist,
  toggleWishlist,
  checkAuthOrOpenLogin,
  products,
  setSelectedProduct
}: ProductDetailsPageProps) {
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({});
  const topRef = useRef<HTMLDivElement>(null);

  // Initialize selected variant and gallery index whenever selected product changes
  useEffect(() => {
    if (selectedProduct) {
      setActiveGalleryIndex(0);
      setSelectedVariant(selectedProduct.variants?.[0] || null);
      topRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedProduct]);

  // Dynamic zoom effect logic for product image showcase
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

  // Get similar products
  const getSimilarProducts = () => {
    let list = products.filter((p) => p.category === selectedProduct.category && p.id !== selectedProduct.id);
    if (list.length < 4) {
      const fallback = products.filter((p) => p.id !== selectedProduct.id && p.category !== selectedProduct.category);
      list = [...list, ...fallback];
    }
    // Remove duplicates if any
    const uniqueList: Product[] = [];
    const seenIds = new Set<string>();
    for (const p of list) {
      if (!seenIds.has(p.id)) {
        seenIds.add(p.id);
        uniqueList.push(p);
      }
    }
    return uniqueList.slice(0, 4);
  };

  const similarProducts = getSimilarProducts();
  const isWishlisted = wishlist.includes(selectedProduct.id);

  return (
    <div ref={topRef} className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-6 space-y-10">
      
      {/* Breadcrumbs Navigation Row */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <button 
            onClick={onBack} 
            className="hover:text-[#E53935] flex items-center gap-1 transition-colors font-bold font-display uppercase tracking-wider"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Store
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="text-slate-450 uppercase">{selectedProduct.category}</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300 hidden sm:inline" />
          <span className="text-slate-800 font-bold truncate max-w-[200px] hidden sm:inline">{selectedProduct.name}</span>
        </div>

        <button
          onClick={() => {
            checkAuthOrOpenLogin(() => {
              toggleWishlist(selectedProduct.id);
            });
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-150 text-xs font-bold text-slate-600 hover:text-[#E53935] hover:border-red-200 transition-colors bg-white shadow-2xs cursor-pointer"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? "fill-red-500 text-red-500 border-none" : ""}`} />
          <span>{isWishlisted ? "Bookmarked" : "Save Gift"}</span>
        </button>
      </div>

      {/* Main Grid: Left Image, Right Details */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start bg-white rounded-3xl border border-slate-100 p-4 sm:p-8 shadow-sm">
        
        {/* Left column: Image showcase */}
        <div className="md:col-span-5 space-y-4">
          <div 
            className="aspect-square bg-slate-50 border border-slate-100 rounded-2xl overflow-hidden relative"
            onMouseMove={handleMouseMoveZoom}
            onMouseLeave={handleMouseLeaveZoom}
          >
            <img
              src={selectedProduct.gallery?.[activeGalleryIndex] || selectedProduct.image}
              alt={selectedProduct.name}
              style={zoomStyle}
              className="w-full h-full object-cover transition-transform duration-100 cursor-zoom-in"
              referrerPolicy="no-referrer"
            />
            
            <div className="absolute top-3 left-3">
              {selectedProduct.origin === ShippingOrigin.BANGLADESH ? (
                <span className="bg-[#00C853] text-white text-[9px] font-black px-2.5 py-1.5 rounded-lg shadow-md uppercase tracking-wider">
                  🇧🇩 Local Stock
                </span>
              ) : (
                <span className="bg-[#212121] text-white text-[9px] font-black px-2.5 py-1.5 rounded-lg shadow-md uppercase tracking-wider">
                  🇨🇳 Sourced China
                </span>
              )}
            </div>
          </div>

          {/* Gallery thumbnails */}
          <div className="flex gap-2 overflow-x-auto py-1">
            {(selectedProduct.gallery || [selectedProduct.image]).map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveGalleryIndex(idx)}
                className={`w-14 h-14 bg-slate-50 border rounded-xl overflow-hidden shrink-0 cursor-pointer transition-all ${
                  activeGalleryIndex === idx ? "border-[#E53935] ring-2 ring-red-100" : "border-slate-200"
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
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
            <p className="text-[10px] text-slate-400 leading-tight">Calculated based on current standard cargo sea freighters departures schedules.</p>
          </div>
        </div>

        {/* Right column: Informative details */}
        <div className="md:col-span-7 flex flex-col justify-between h-full space-y-6">
          <div>
            <span className="bg-red-50 text-[#E53935] text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-md">
              {selectedProduct.category} Catalog
            </span>
            
            <h1 className="font-bold font-display text-2xl sm:text-3xl text-slate-900 mt-3 tracking-tight">
              {selectedProduct.name}
            </h1>

            {/* Star ratings */}
            <div className="flex items-center gap-2 mt-2.5">
              <div className="flex text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(selectedProduct.rating) ? "fill-yellow-500 text-yellow-500" : "text-slate-200"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-slate-600">
                {selectedProduct.rating} Stars Rating • ({selectedProduct.reviewCount} customer reviews)
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-550 leading-relaxed mt-4 bg-slate-50/40 p-4 rounded-2xl border border-slate-100">
              {selectedProduct.description}
            </p>

            {/* Logistics Specifications */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5 bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs">
              <div>
                <span className="text-slate-400 block text-[9px] uppercase tracking-wider font-semibold">Live Inventory Hub:</span>
                <strong className="text-slate-700 font-bold">{selectedProduct.origin}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px] uppercase tracking-wider font-semibold">Delivery timeframe:</span>
                <strong className="text-slate-700 font-bold">{selectedProduct.deliveryTime}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px] uppercase tracking-wider font-semibold">Tracking status:</span>
                <strong className="text-emerald-600 font-bold">✓ Live Shipment GPS Tracking Active</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px] uppercase tracking-wider font-semibold">Domestic Shipping fee:</span>
                <strong className="text-slate-700 font-bold">৳{selectedProduct.shippingCost} BDT flat Rate</strong>
              </div>
            </div>

            {/* Interactive variants chooser */}
            {selectedProduct.variants && selectedProduct.variants.length > 0 && (
              <div className="mt-5 space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Choose Design Accent Style:</span>
                <div className="flex flex-wrap gap-2">
                  {selectedProduct.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                        selectedVariant?.id === v.id
                          ? "border-[#E53935] text-[#E53935] bg-red-50/55 ring-1 ring-red-100"
                          : "border-slate-200 text-slate-600 bg-white hover:border-slate-450"
                      }`}
                    >
                      {v.name} {v.priceModifier > 0 ? `(+৳${v.priceModifier})` : ""} {v.stock === 0 ? "(Out of stock)" : ""}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Product Specifications */}
            <div className="mt-6 border-t border-slate-100 pt-4">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider mb-2">Technical Specifications:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs text-slate-600">
                {Object.entries(selectedProduct.specs || {}).map(([key, val]) => (
                  <div key={key} className="flex justify-between border-b border-dashed border-slate-100 py-1">
                    <span className="text-slate-400 font-medium">{key}:</span>
                    <strong className="text-slate-800 font-semibold">{val}</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTAs and checkout actions bottom drawer */}
          <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs text-slate-400 block font-semibold uppercase">Total Purchase Price BDT:</span>
              <span className="text-[#E53935] font-black text-2xl tracking-tight">
                {convertPrice(selectedProduct.discountedPrice + (selectedVariant?.priceModifier || 0))}
              </span>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
              <button
                onClick={() => {
                  checkAuthOrOpenLogin(() => {
                    handleBuyNow(selectedProduct, selectedVariant);
                  });
                }}
                className="flex-1 sm:flex-none bg-[#E53935] text-white hover:bg-zinc-950 font-black text-xs uppercase px-6 py-3.5 rounded-xl transition-all shadow-md cursor-pointer tracking-wider text-center"
              >
                Buy Now 🚀
              </button>
              <button
                onClick={() => {
                  handleAddToCart(selectedProduct, selectedVariant);
                }}
                className="flex-1 sm:flex-none bg-[#212121] text-white hover:bg-[#E53935] font-black text-xs uppercase px-6 py-3.5 rounded-xl transition-all shadow-md cursor-pointer tracking-wider text-center"
              >
                Add To Cart
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Suggested Similar Products Section */}
      <div className="space-y-6 pt-4">
        <div className="flex items-center justify-between border-b border-slate-150 pb-3">
          <div className="space-y-1">
            <h2 className="text-base sm:text-lg font-black font-display text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#E53935] animate-pulse" />
              Suggested Similar Products
            </h2>
            <p className="text-[11px] text-slate-450 font-medium">Handpicked premium items matched for your taste</p>
          </div>
          
          <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase bg-slate-50 border rounded-xl px-3 py-1.5">
            Matching {selectedProduct.category}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {similarProducts.map((p) => {
            const isSgWishlisted = wishlist.includes(p.id);
            return (
              <div
                key={p.id}
                onClick={() => {
                  setSelectedProduct(p);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="bg-white rounded-2xl p-3 shadow-2xs border border-transparent hover:border-[#E53935] hover:shadow-xs cursor-pointer group flex flex-col justify-between transition-all"
              >
                <div>
                  <div className="aspect-square bg-slate-50 rounded-xl overflow-hidden relative flex items-center justify-center">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    
                    <div className="absolute top-1.5 left-1.5">
                      {p.origin === ShippingOrigin.BANGLADESH ? (
                        <span className="bg-[#00C853] text-white text-[7.5px] font-black tracking-widest px-1.5 py-0.5 rounded shadow-2xs uppercase">
                          🇧🇩 BD
                        </span>
                      ) : (
                        <span className="bg-[#212121] text-white text-[7.5px] font-black tracking-widest px-1.5 py-0.5 rounded shadow-2xs uppercase">
                          🇨🇳 CN
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        checkAuthOrOpenLogin(() => toggleWishlist(p.id));
                      }}
                      className="absolute top-1.5 right-1.5 bg-white/90 hover:bg-white text-slate-800 p-1 rounded-full shadow-md transition-all cursor-pointer"
                    >
                      <Heart className={`w-3 h-3 ${isSgWishlisted ? "fill-red-500 text-red-500 text-none" : "text-slate-600"}`} />
                    </button>
                  </div>

                  <span className="text-[8.5px] uppercase font-bold tracking-wider text-slate-400 block mt-2">{p.category}</span>
                  <h4 className="font-bold text-xs text-slate-805 group-hover:text-[#E53935] transition-colors mt-0.5 line-clamp-2 min-h-[32px] leading-snug">
                    {p.name}
                  </h4>

                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-yellow-500 text-xs">★</span>
                    <span className="text-[10px] text-slate-500 font-bold">{p.rating}</span>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-50 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[#E53935] font-black text-xs">{convertPrice(p.discountedPrice)}</span>
                    <span className="text-[9px] line-through text-slate-400 leading-none mt-0.5">{convertPrice(p.originalPrice)}</span>
                  </div>
                  
                  <span className="bg-slate-50 text-slate-700 text-[9px] font-extrabold uppercase px-2 py-1 rounded-lg border group-hover:bg-[#E53935] group-hover:text-white group-hover:border-transparent transition-all">
                    View
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
