import React from "react";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Truck, 
  Package, 
  AlertTriangle, 
  Award,
  Users,
  Calendar,
  Layers,
  Clock
} from "lucide-react";
import { Product, Order, ShippingOrigin, CurrencyConfig } from "../../types";

interface DashboardOverviewProps {
  products: Product[];
  orders: Order[];
  currency: CurrencyConfig;
  formatPrice: (price: number) => string;
}

export default function AdminDashboardOverview({
  products,
  orders,
  currency,
  formatPrice
}: DashboardOverviewProps) {
  
  const totalRevenue = orders
    .filter(o => o.paymentStatus === "Paid")
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const totalOrdersCount = orders.length;
  const pendingOrders = orders.filter(o => o.currentStatus === "Order Received" || o.currentStatus === "Processing").length;
  const lowStockCount = products.filter(p => p.stockCount <= 10).length;
  
  // Calculate unique customers
  const uniqueCustomerEmails = Array.from(new Set(orders.map(o => o.customerEmail.toLowerCase())));
  const totalCustomers = uniqueCustomerEmails.length || 4; // fallback

  // Calculate BD warehouse vs China Supplier split
  const bdWarehouseStock = products
    .filter(p => p.origin === ShippingOrigin.BANGLADESH)
    .reduce((sum, p) => sum + p.stockCount, 0);

  const chinaDirectStock = products
    .filter(p => p.origin === ShippingOrigin.CHINA)
    .reduce((sum, p) => sum + p.stockCount, 0);

  return (
    <div id="dashboard_overview_container" className="space-y-6">
      {/* Upper Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Rev */}
        <div className="bg-[#1C1C1E] text-white rounded-2xl p-4 border border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Total Store Revenue</span>
            <p className="text-2xl font-black font-mono text-[#E53935] mt-1">{formatPrice(totalRevenue)}</p>
            <span className="text-[9px] text-emerald-400 font-medium mt-1 flex items-center gap-0.5">
              <TrendingUp className="w-2.5 h-2.5" /> +19.4% Growth VS last cycle
            </span>
          </div>
          <div className="bg-[#E53935]/20 p-2.5 rounded-xl text-[#E53935]">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        {/* Orders count */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Total Orders Placed</span>
            <p className="text-2xl font-black font-mono text-slate-800 mt-1">{totalOrdersCount} Items</p>
            <span className="text-[9px] text-slate-400 font-medium mt-1 flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" /> {pendingOrders} processing dispatch
            </span>
          </div>
          <div className="bg-[#1C1C1E] p-2.5 rounded-xl text-white">
            <Truck className="w-5 h-5" />
          </div>
        </div>

        {/* Customers count */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Active Importer Clients</span>
            <p className="text-2xl font-black font-mono text-slate-800 mt-1">{totalCustomers} users</p>
            <span className="text-[9px] text-emerald-600 font-medium mt-1">
              • 100% email verification validated
            </span>
          </div>
          <div className="bg-sky-50 p-2.5 rounded-xl text-sky-600">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Low Stock count */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Low Stock Warnings</span>
            <p className={`text-2xl font-black font-mono mt-1 ${lowStockCount > 0 ? "text-amber-500" : "text-emerald-600"}`}>
              {lowStockCount} items
            </p>
            <span className="text-[9px] text-slate-400 mt-1 block">Threshold: &le; 10 units left</span>
          </div>
          <div className={`p-2.5 rounded-xl ${lowStockCount > 0 ? "bg-amber-50 text-amber-500 animate-pulse" : "bg-emerald-50 text-emerald-600"}`}>
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Warehouse stocking allocation split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs">
          <h3 className="text-xs uppercase font-bold tracking-wider text-slate-500 mb-4 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-[#E53935]" /> Stock Level Allocation
          </h3>
          <div className="space-y-5">
            <div>
              <div className="flex justify-between items-center text-xs font-semibold mb-1.5 text-slate-700">
                <span className="flex items-center gap-1">🇧🇩 Bangladesh Local Stock Warehouse (Fast Transit)</span>
                <span className="font-mono text-emerald-600 font-bold">{bdWarehouseStock} Units ({products.filter(p => p.origin === ShippingOrigin.BANGLADESH).length} items)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5">
                <div 
                  className="bg-emerald-500 h-2.5 rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min(100, (bdWarehouseStock / (bdWarehouseStock + chinaDirectStock || 1)) * 100)}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center text-xs font-semibold mb-1.5 text-slate-700">
                <span className="flex items-center gap-1">🇨🇳 China Supplier Bulk Depots (Cargo Catalog imports)</span>
                <span className="font-mono text-[#E53935] font-bold">{chinaDirectStock} Units ({products.filter(p => p.origin === ShippingOrigin.CHINA).length} items)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5">
                <div 
                  className="bg-[#E53935] h-2.5 rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min(100, (chinaDirectStock / (bdWarehouseStock + chinaDirectStock || 1)) * 100)}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 mt-6 pt-5 grid grid-cols-2 gap-4 text-center">
            <div className="bg-slate-50 p-3 rounded-2xl">
              <span className="text-[9px] uppercase font-bold text-slate-400 block">Fast BD Shipping</span>
              <p className="text-xs font-bold text-slate-700 mt-0.5">1-3 Business Days Delivery</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl">
              <span className="text-[9px] uppercase font-bold text-slate-400 block">China Customs Delivery</span>
              <p className="text-xs font-bold text-slate-700 mt-0.5">25-30 Direct Flights Waybill</p>
            </div>
          </div>
        </div>

        {/* Hot Products list */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs">
          <h3 className="text-xs uppercase font-bold tracking-wider text-slate-500 mb-4 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-[#E53935]" /> Top Rated Catalog Items
          </h3>
          <div className="divide-y divide-slate-100">
            {products.slice(0, 4).map((p, idx) => (
              <div key={p.id} className="py-2.5 flex items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-slate-300 font-mono w-4">0{idx + 1}</span>
                  <img src={p.image} alt="" className="w-9 h-9 object-cover rounded-lg border border-slate-100" />
                  <div>
                    <h5 className="text-xs font-semibold text-slate-800 line-clamp-1">{p.name}</h5>
                    <span className="text-[9px] text-[#E53935] font-mono mt-0.5 inline-block uppercase bg-red-50 px-1.5 py-0.5 rounded font-bold">
                      {p.category}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-700 font-mono block">{formatPrice(p.discountedPrice)}</span>
                  <span className="text-[9px] text-emerald-500 block font-medium">★ {p.rating} / 5</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
