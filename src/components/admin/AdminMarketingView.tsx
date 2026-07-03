import React, { useState, useEffect } from "react";
import { 
  PlusCircle, 
  Trash2, 
  Tag as CouponIcon, 
  HelpCircle,
  Clock,
  Sparkles,
  Zap
} from "lucide-react";
import { Coupon } from "../../types";

interface AdminMarketingViewProps {
  onRefreshMarkers?: () => void;
}

export default function AdminMarketingView({
}: AdminMarketingViewProps) {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState<"PERCENTAGE" | "FIXED">("PERCENTAGE");
  const [value, setValue] = useState("");
  const [minPurchase, setMinPurchase] = useState("1000");
  const [isLoading, setIsLoading] = useState(false);

  const fetchPromoCoupons = () => {
    fetch("/api/admin/coupons")
      .then(res => res.json())
      .then(data => {
        if (data.coupons) {
          setCoupons(data.coupons);
        }
      })
      .catch(err => console.error("Error fetching coupons", err));
  };

  useEffect(() => {
    fetchPromoCoupons();
  }, [isLoading]);

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !value) return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: code.trim(),
          discountType,
          value,
          minPurchase
        })
      });
      const data = await res.json();
      if (data.success) {
        setCode("");
        setValue("");
        setMinPurchase("1000");
        alert(`Promo Coupon '${data.coupon.code}' issued successfully in store state database.`);
        fetchPromoCoupons();
      } else {
        alert(data.error || "Coupon creation failed.");
      }
    } catch(err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCoupon = async (tgtCode: string) => {
    if (!confirm(`Are you absolutely sure you want to retire code: ${tgtCode}?`)) return;

    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/coupons/${tgtCode}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        alert("Coupon code successfully deactivated.");
        fetchPromoCoupons();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="marketing_tab_container" className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Coupon creation form on left */}
        <form onSubmit={handleCreateCoupon} className="lg:col-span-1 bg-white border border-slate-100 p-6 rounded-3xl shadow-xs space-y-4">
          <h4 className="text-xs uppercase font-extrabold tracking-wider text-slate-500 flex items-center gap-1.5">
            <PlusCircle className="w-4 h-4 text-[#E53935]" /> Create Discount Coupon
          </h4>
          <p className="text-[10px] text-slate-450 leading-relaxed">
            Configure global discount coupons redeemable during user checkout for immediate wholesale deductions.
          </p>

          <div className="space-y-3">
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Coupon Suffix/Code</label>
              <input 
                type="text"
                required
                value={code}
                onChange={e => setCode(e.target.value)}
                placeholder="e.g. MONSOON20"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-mono uppercase focus:border-[#E53935] outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Deduction Method</label>
              <select
                value={discountType}
                onChange={e => setDiscountType(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs outline-none"
              >
                <option value="PERCENTAGE">Percentage discount (%)</option>
                <option value="FIXED">Flat Currency deduction (BDT)</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Discount Amount Value</label>
              <input 
                type="number"
                required
                value={value}
                onChange={e => setValue(e.target.value)}
                placeholder={discountType === "PERCENTAGE" ? "e.g. 15 (%)" : "e.g. 200 (BDT)"}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-[#E53935]"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Minimum Cart purchase threshold</label>
              <input 
                type="number"
                required
                value={minPurchase}
                onChange={e => setMinPurchase(e.target.value)}
                placeholder="e.g. 1500 (BDT)"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-[#E53935]"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#1C1C1E] hover:bg-[#E53935] text-white text-xs font-bold py-3 px-4 rounded-xl transition-colors text-center"
            >
              Issue Promotion Code
            </button>
          </div>
        </form>

        {/* Coupons active table and flash scheduler on right */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs space-y-4">
            <h4 className="text-xs uppercase font-extrabold tracking-wider text-slate-500 flex items-center gap-1.5">
              <CouponIcon className="w-4 h-4 text-[#E53935]" /> Active Store Coupons Listings ({coupons.length})
            </h4>

            <div className="overflow-x-auto rounded-2xl border border-slate-100">
              <table className="w-full text-left font-sans text-xs">
                <thead className="bg-[#1C1C1E] text-white text-[10px] uppercase border-b border-slate-200 font-mono">
                  <tr>
                    <th className="py-2.5 px-3">Promo Code</th>
                    <th className="py-2.5 px-3">Deduction Method</th>
                    <th className="py-2.5 px-3 text-right">Deduction Value</th>
                    <th className="py-2.5 px-3 text-right">Min Cart required</th>
                    <th className="py-2.5 px-3 text-center">Tally Redeemed</th>
                    <th className="py-2.5 px-3 text-center">Decline</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white text-slate-600">
                  {coupons.map((item) => (
                    <tr key={item.code} className="hover:bg-slate-50/20">
                      <td className="py-3 px-3 font-bold font-mono text-slate-800 tracking-wide">{item.code}</td>
                      <td className="py-3 px-3 text-slate-500">{item.discountType === "PERCENTAGE" ? "PERCENTAGE (%)" : "FLAT BDT"}</td>
                      <td className="py-3 px-3 text-right font-black font-mono text-slate-800">
                        {item.value}{item.discountType === "PERCENTAGE" ? "%" : " BDT"}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-slate-550">{item.minPurchase} BDT</td>
                      <td className="py-3 px-3 text-center font-bold font-mono text-[#E53935]">{item.usedCount} times</td>
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => handleDeleteCoupon(item.code)}
                          className="hover:text-red-600 p-1 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Flash Sales Section */}
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Zap className="w-10 h-10 text-amber-500 fill-amber-300 animate-bounce" />
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Hourly Flash Sales scheduler</h4>
                <p className="text-[10px] text-slate-500 mt-0.5">Dispatches 15-minute global alerts to active users featuring 30% discounts. Sourced live from China direct hubs.</p>
              </div>
            </div>
            <div>
              <button 
                onClick={() => alert("Flash session successfully broadcasted. Real-time client countdown initialized!")}
                className="bg-[#1C1C1E] hover:bg-[#E53935] text-white text-[10.5px] font-bold py-2.5 px-4 rounded-xl transition-all"
              >
                Broadcast 15M Flash Now
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
