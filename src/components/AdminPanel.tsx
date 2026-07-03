import React, { useState, useEffect } from "react";
import { 
  Settings, 
  RotateCcw, 
  RefreshCw, 
  ShieldAlert, 
  BarChart2, 
  Package, 
  Warehouse, 
  Truck, 
  Users, 
  Globe, 
  Gift, 
  DollarSign, 
  Lock, 
  Cog,
  ChevronRight,
  Menu,
  Database
} from "lucide-react";
import { Product, Order, OrderStatus, CurrencyConfig, User } from "../types";

// Import modular subviews
import AdminDashboardOverview from "./admin/AdminDashboardOverview";
import AdminProductsView from "./admin/AdminProductsView";
import AdminInventoryView from "./admin/AdminInventoryView";
import AdminOrdersView from "./admin/AdminOrdersView";
import AdminCustomersView from "./admin/AdminCustomersView";
import AdminMarketingView from "./admin/AdminMarketingView";
import AdminFinanceView from "./admin/AdminFinanceView";
import AdminUserMgmtView from "./admin/AdminUserMgmtView";
import AdminSettingsView from "./admin/AdminSettingsView";
import AdminSupabaseView from "./admin/AdminSupabaseView";

interface AdminPanelProps {
  products: Product[];
  orders: Order[];
  currency: CurrencyConfig;
  onRefreshProducts: () => void;
  onRefreshOrders: () => void;
  onAddProduct: (prodData: any) => Promise<boolean>;
  onEditProduct: (id: string, updatedData: any) => Promise<boolean>;
  onDeleteProduct: (id: string) => Promise<boolean>;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus, details?: string) => Promise<boolean>;
  onResetDatabase: () => Promise<void>;
}

type AdminTab = 
  | "dashboard" 
  | "products" 
  | "inventory" 
  | "orders" 
  | "customers" 
  | "marketing" 
  | "finance" 
  | "security" 
  | "supabase" 
  | "settings";

export default function AdminPanel({
  products,
  orders,
  currency,
  onRefreshProducts,
  onRefreshOrders,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  onUpdateOrderStatus,
  onResetDatabase
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [users, setUsers] = useState<User[]>([]);
  const [warehouses, setWarehouses] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const fetchUsersList = () => {
    fetch("/api/admin/users")
      .then(res => res.json())
      .then(data => {
        if (data.users) setUsers(data.users);
      })
      .catch(err => console.error("Error fetching admin users", err));
  };

  const fetchWarehousesList = () => {
    fetch("/api/admin/warehouses")
      .then(res => res.json())
      .then(data => {
        if (data.warehouses) setWarehouses(data.warehouses);
      })
      .catch(err => console.error("Error loading warehouses", err));
  };

  useEffect(() => {
    fetchUsersList();
    fetchWarehousesList();
  }, [products, orders]);

  const formatPrice = (bdtPrice: number) => {
    return `${currency.symbol}${(bdtPrice * currency.rate).toLocaleString(undefined, { maximumFractionDigits: 1 })}`;
  };

  // Nav categories mapped to corresponding icons & details
  const navItems = [
    { id: "dashboard", label: "Dashboard Hub", desc: "Overview & Analytics", icon: BarChart2 },
    { id: "products", label: "Product Catalog", desc: "Manage Sku Inventory", icon: Package },
    { id: "inventory", label: "Warehouse Stock", desc: "BD / China Depots", icon: Warehouse },
    { id: "orders", label: "Logistics Orders", desc: "Delivery Timelines", icon: Truck },
    { id: "customers", label: "Helpline & Clients", desc: "Tickets & Loyalty", icon: Users },
    { id: "marketing", label: "Coupons Promos", desc: "Discounts & Broadcasts", icon: Gift },
    { id: "finance", label: "Finance Ledger", desc: "Gross Rev & Outflows", icon: DollarSign },
    { id: "security", label: "Auth Security", desc: "RBAC & Audit Trail Logs", icon: Lock },
    { id: "supabase", label: "Supabase SQL", desc: "PostgreSQL Database Schema", icon: Database },
    { id: "settings", label: "Configs Settings", desc: "Vat Taxes & Localize", icon: Settings }
  ] as const;

  return (
    <div id="china_gift_shop_admin_frame" className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* Top Banner Control Panel */}
      <div className="bg-white border-b border-slate-150 px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-black font-display tracking-tight text-slate-900 flex items-center gap-2">
            <span className="p-1.5 bg-[#E53935]/10 rounded-lg text-[#E53935]">
              <Cog className="w-5 h-5 animate-spin" />
            </span>
            1% of China Corporate Console
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Stateless corporate resource planning database (Stateless CRM/ERP simulator)
          </p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={async () => {
              if (confirm("Confirm database seeding restoration? This reverts stocks and orders details.")) {
                await onResetDatabase();
                fetchUsersList();
                fetchWarehousesList();
                alert("Database reset completed successfully.");
              }
            }}
            className="flex-1 md:flex-none border border-slate-200 bg-white hover:bg-slate-55 hover:bg-slate-50 text-slate-700 text-xs font-bold py-2 px-3.5 rounded-xl transition-all flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset DB Seed
          </button>
          
          <button
            onClick={() => {
              onRefreshProducts();
              onRefreshOrders();
              fetchUsersList();
              fetchWarehousesList();
              alert("Real-time operational databases synchronized.");
            }}
            className="flex-1 md:flex-none bg-[#E53935]/10 hover:bg-[#E53935]/20 text-[#E53935] text-xs font-bold py-2 px-3.5 rounded-xl transition-all flex items-center justify-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Force Sync
          </button>

          {/* Mobile sidebar toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden border border-slate-200 p-2 rounded-xl text-slate-600 bg-white"
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Panel Grid */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-6 p-6">
        
        {/* Navigation Sidebar (Hidden on mobile unless toggled) */}
        <div className={`col-span-1 flex flex-col bg-white border border-slate-100 rounded-3xl p-4 h-fit gap-1 space-y-1 shadow-xs md:flex ${
          isMobileMenuOpen ? "flex" : "hidden"
        }`}>
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-3.5 pb-2 block">
            Navigation Console
          </span>

          {navItems.map((item) => {
            const IconComp = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`flex items-center justify-between text-left p-2.5 px-3.5 rounded-2xl transition-all ${
                  isActive 
                    ? "bg-[#1C1C1E] text-white shadow-sm" 
                    : "text-slate-650 hover:bg-slate-100/60 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center gap-3">
                  <IconComp className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? "text-[#E53935]" : "text-slate-400"
                  }`} />
                  <div>
                    <span className="text-xs font-bold block">{item.label}</span>
                    <span className={`text-[9.5px] block ${isActive ? "text-slate-400" : "text-slate-400"}`}>
                      {item.desc}
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-55" />
              </button>
            );
          })}
        </div>

        {/* Dynamic Tab Workspace on Right */}
        <div className="md:col-span-3 flex flex-col gap-6">
          {activeTab === "dashboard" && (
            <AdminDashboardOverview 
              products={products}
              orders={orders}
              currency={currency}
              formatPrice={formatPrice}
            />
          )}

          {activeTab === "products" && (
            <AdminProductsView 
              products={products}
              currency={currency}
              formatPrice={formatPrice}
              onAddProduct={onAddProduct}
              onEditProduct={onEditProduct}
              onDeleteProduct={onDeleteProduct}
            />
          )}

          {activeTab === "inventory" && (
            <AdminInventoryView 
              products={products}
              warehouses={warehouses}
            />
          )}

          {activeTab === "orders" && (
            <AdminOrdersView 
              orders={orders}
              currency={currency}
              formatPrice={formatPrice}
              onUpdateOrderStatus={onUpdateOrderStatus}
            />
          )}

          {activeTab === "customers" && (
            <AdminCustomersView 
              users={users}
              onRefreshUsers={fetchUsersList}
            />
          )}

          {activeTab === "marketing" && (
            <AdminMarketingView />
          )}

          {activeTab === "finance" && (
            <AdminFinanceView 
              orders={orders}
              currency={currency}
              formatPrice={formatPrice}
            />
          )}

          {activeTab === "security" && (
            <AdminUserMgmtView 
              users={users}
              onRefreshUsers={fetchUsersList}
            />
          )}

          {activeTab === "supabase" && (
            <AdminSupabaseView />
          )}

          {activeTab === "settings" && (
            <AdminSettingsView />
          )}
        </div>

      </div>
    </div>
  );
}
