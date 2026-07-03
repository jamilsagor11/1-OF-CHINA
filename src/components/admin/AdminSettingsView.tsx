import React, { useState } from "react";
import { 
  Settings, 
  Globe, 
  Percent, 
  CreditCard, 
  Sparkles, 
  Search,
  Save,
  CheckCircle2
} from "lucide-react";

export default function AdminSettingsView() {
  const [siteName, setSiteName] = useState("1% of China");
  const [siteSlogan, setSiteSlogan] = useState("Your Gateway to Premium Wholesale Imports");
  const [supportEmail, setSupportEmail] = useState("support@onepercentchina.com");
  const [taxRate, setTaxRate] = useState("5");
  const [isSaving, setIsSaving] = useState(false);

  const saveSettingsSim = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert("Settings parameters locked in database state successfully.");
    }, 1000);
  };

  return (
    <div id="settings_panel_layout" className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs space-y-6">
      
      <div className="flex justify-between items-center border-b border-slate-100 pb-3">
        <div>
          <h4 className="text-xs uppercase font-extrabold tracking-wider text-slate-500">Global Website Configuration and Taxes</h4>
          <p className="text-[10px] text-slate-450 mt-0.5">Define metadata tags, payment client gateway keys, and VAT thresholds.</p>
        </div>
        <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2.5 py-1 rounded-full font-mono">
          VERSION 1.4.2
        </span>
      </div>

      <form onSubmit={saveSettingsSim} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* General Metadata */}
          <div className="space-y-4">
            <h5 className="text-[11px] uppercase font-bold text-slate-400 border-b border-slate-200/50 pb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#E53935]" /> SEO & Platform Branding
            </h5>

            <div className="text-xs space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1">Company Suffix Name</label>
                <input 
                  type="text"
                  value={siteName}
                  onChange={e => setSiteName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1">Branding Tagline</label>
                <input 
                  type="text"
                  value={siteSlogan}
                  onChange={e => setSiteSlogan(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1">Support Contact Email</label>
                <input 
                  type="email"
                  value={supportEmail}
                  onChange={e => setSupportEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Finance Adjustments */}
          <div className="space-y-4">
            <h5 className="text-[11px] uppercase font-bold text-slate-400 border-b border-slate-200/50 pb-1 flex items-center gap-1.5">
              <Percent className="w-3.5 h-3.5 text-[#E53935]" /> Taxes, Gateways & Languages
            </h5>

            <div className="text-xs space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1">Default Import Tax Threshold (%)</label>
                <input 
                  type="number"
                  value={taxRate}
                  onChange={e => setTaxRate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1">Active Gateway Keys</label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none">
                  <option>bKash Merchant Pay Portal V3</option>
                  <option>Nagad Auto-Escrow Link API</option>
                  <option>SSL Commerz local Aggregator Gateways</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1">Language Suffix Config</label>
                <div className="flex gap-2">
                  {["English (US)", "বাংলা (BD)", "Chinese (ZH)"].map((lang) => (
                    <span key={lang} className="text-[10px] bg-slate-100 border border-slate-200 rounded-lg px-2 py-1 font-bold font-mono">
                      ✓ {lang}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>

        <div className="border-t border-slate-100 pt-4 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="bg-[#1C1C1E] hover:bg-[#E53935] text-white text-xs font-bold py-2.5 px-6 rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <Save className="w-4 h-4" /> {isSaving ? "Saving site parameters..." : "Save Config Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
