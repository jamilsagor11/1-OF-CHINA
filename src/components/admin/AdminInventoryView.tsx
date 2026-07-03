import React, { useState } from "react";
import { 
  Database, 
  MapPin, 
  ArrowRight, 
  Check, 
  PlusCircle, 
  Warehouse as WHIcon,
  HelpCircle,
  TrendingDown
} from "lucide-react";
import { Product, ShippingOrigin, Warehouse } from "../../types";

interface AdminInventoryViewProps {
  products: Product[];
  warehouses: Warehouse[];
}

export default function AdminInventoryView({
  products,
  warehouses
}: AdminInventoryViewProps) {
  const [activeWhId, setActiveWhId] = useState<string>("wh-bd-1");
  const [transferFrom, setTransferFrom] = useState("wh-cn-1");
  const [transferTo, setTransferTo] = useState("wh-bd-1");
  const [transferQty, setTransferQty] = useState("25");
  const [transferMsg, setTransferMsg] = useState<string | null>(null);

  const targetWhList = warehouses;

  const executeTransferSim = (e: React.FormEvent) => {
    e.preventDefault();
    setTransferMsg(`Initiating customs-certified cargo dispatch of ${transferQty} items from Shenzhen Warehouse to Dhaka Central Depository...`);
    setTimeout(() => {
      setTransferMsg(`✅ Cargo transit logged successfully. Air cargo waybill issued. Transferred ${transferQty} units of stock.`);
      setTimeout(() => setTransferMsg(null), 5000);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Upper Grid - Warehouse Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {targetWhList.map((wh) => (
          <div 
            key={wh.id}
            onClick={() => setActiveWhId(wh.id)}
            className={`p-5 rounded-3xl cursor-pointer border transition-all ${
              activeWhId === wh.id 
                ? "bg-[#1C1C1E] text-white border-slate-950 shadow-md" 
                : "bg-white text-slate-700 border-slate-100 hover:bg-slate-50/50 shadow-xs"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 font-mono">{wh.id}</span>
              <WHIcon className={`w-4 h-4 ${activeWhId === wh.id ? "text-[#E53935]" : "text-slate-400"}`} />
            </div>
            <h4 className="text-sm font-semibold mb-1">{wh.name}</h4>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span className="line-clamp-1">{wh.location}</span>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100/10 flex justify-between items-end">
              <div>
                <span className="text-[9px] text-slate-400 uppercase block">Active Depot Staff</span>
                <span className="text-xs font-bold">{wh.activeStaff} specialists</span>
              </div>
              <div className="text-right">
                <span className="text-[9px] text-slate-400 uppercase block">Monitored Stock</span>
                <span className="text-sm font-black font-mono">{wh.stockCount} Items</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Specific Stocking breakdown for active warehouse */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 p-6 shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-xs uppercase font-extrabold tracking-wider text-slate-500">
              Active stock status: {targetWhList.find(w => w.id === activeWhId)?.name}
            </h4>
            <span className="bg-[#E53935]/15 text-[#E53935] text-[9.5px] px-2.5 py-1 rounded-full font-mono font-bold">
              REAL-TIME SYNC
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[10px] uppercase text-slate-400 border-b border-slate-100">
                  <th className="py-2.5 px-3">Catalog Item</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3 text-right">Fulfillment</th>
                  <th className="py-2.5 px-3 text-right">Dispatched</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products
                  .filter(p => {
                    const activeWH = targetWhList.find(w => w.id === activeWhId);
                    if (!activeWH) return true;
                    // Sort by origin
                    return p.origin === activeWH.origin;
                  })
                  .map(p => (
                    <tr key={p.id} className="hover:bg-slate-50/20">
                      <td className="py-3 px-3 flex items-center gap-3">
                        <img src={p.image} alt="" className="w-8 h-8 object-cover rounded-lg border border-slate-100" />
                        <span className="font-semibold text-slate-800 line-clamp-1">{p.name}</span>
                      </td>
                      <td className="py-3 px-3 text-slate-500 font-medium">{p.category}</td>
                      <td className="py-3 px-3 text-right font-semibold">
                        {p.origin === ShippingOrigin.CHINA ? "🇨🇳 China Sourced" : "🇧🇩 Local BD Warehousing"}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-slate-800">
                        {p.stockCount} left
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Transfer Stock action form */}
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-6 shadow-xs h-fit space-y-4">
          <h4 className="text-xs uppercase font-extrabold tracking-wider text-slate-500">Inter-Warehouse Freight Link</h4>
          <p className="text-[10px] text-slate-450 leading-relaxed">
            Record stock allocations dispatched as bulk freight from China supply hubs directly to Dhaka warehouse channels. Auto-registers custom import manifests.
          </p>

          <form onSubmit={executeTransferSim} className="space-y-3.5">
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Source Depot</label>
              <select 
                value={transferFrom}
                onChange={e => setTransferFrom(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs outline-none"
              >
                <option value="wh-cn-1">Shenzhen Supplier Depot Hub (China)</option>
                <option value="wh-bd-1">Dhaka Central Warehouse (BD)</option>
              </select>
            </div>

            <div className="flex justify-center">
              <Check className="w-4 h-4 text-emerald-500 rotate-90" />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Target Depot</label>
              <select 
                value={transferTo}
                onChange={e => setTransferTo(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs outline-none"
              >
                <option value="wh-bd-1">Dhaka Central Warehouse (BD)</option>
                <option value="wh-bd-2">Chittagong Port Transit Depot (BD)</option>
                <option value="wh-cn-1">Shenzhen Supplier Depot Hub (China)</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Quantity of Units</label>
              <input 
                type="number"
                value={transferQty}
                onChange={e => setTransferQty(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-[#E53935]"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#1C1C1E] hover:bg-[#E53935] text-white text-xs font-bold py-3 px-4 rounded-xl transition-colors text-center"
            >
              Issue Freight Waybill
            </button>
          </form>

          {transferMsg && (
            <div className="bg-sky-50 border border-sky-100 rounded-xl p-3 text-xs text-sky-800 font-medium leading-relaxed">
              {transferMsg}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
