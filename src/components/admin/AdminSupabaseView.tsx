import React, { useState } from "react";
import { Database, Copy, Check, Terminal, ExternalLink, ShieldCheck, Cpu, Code2, Sparkles, Phone } from "lucide-react";

export default function AdminSupabaseView() {
  const [copiedSql, setCopiedSql] = useState(false);
  const [copiedEnv, setCopiedEnv] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<"sql" | "setup">("sql");

  const sqlSchemaCode = `-- ====================================================================
-- 🇨🇳🎁 SUPABASE DATABASE SCHEMA FOR 1% OF CHINA (এক টুকরো চীন)
-- Created By Jamil (01307541441)
-- ====================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE (Linked with Supabase Auth)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone VARCHAR(20),
    delivery_address TEXT,
    role VARCHAR(20) DEFAULT 'customer',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. PRODUCTS TABLE
CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    original_price NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    discounted_price NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    rating NUMERIC(3, 2) DEFAULT 4.5,
    review_count INTEGER DEFAULT 0,
    image_url TEXT NOT NULL,
    gallery TEXT[] DEFAULT '{}',
    specs JSONB DEFAULT '{}'::jsonb,
    variants JSONB DEFAULT '[]'::jsonb,
    origin VARCHAR(50) NOT NULL DEFAULT 'Bangladesh Warehouse',
    delivery_time VARCHAR(100) NOT NULL DEFAULT '1-3 Days',
    stock_count INTEGER NOT NULL DEFAULT 10,
    shipping_cost NUMERIC(10, 2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. ORDERS TABLE
CREATE TABLE public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_address TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    total_amount NUMERIC(12, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL DEFAULT 'Cash on Delivery',
    payment_status VARCHAR(50) NOT NULL DEFAULT 'Pending',
    tracking_number VARCHAR(100) UNIQUE NOT NULL,
    current_status VARCHAR(100) NOT NULL DEFAULT 'Order Received',
    timeline JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);`;

  const envExample = `# Supabase Environment Variables
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-public-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-private-service-role-key-here`;

  const copyToClipboard = (text: string, setCopied: (v: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-6 space-y-6 shadow-sm">
      {/* Visual Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-[#E53935]/10 rounded-xl text-[#E53935]">
              <Database className="w-5 h-5" />
            </span>
            <h3 className="font-extrabold text-lg text-slate-800 tracking-tight flex items-center gap-1.5 uppercase font-display">
              Supabase PostgreSQL Console
              <span className="bg-emerald-55 bg-emerald-50 text-[#00C853] text-[9px] font-black tracking-widest px-2 py-0.5 rounded-lg border border-emerald-100">
                ACTIVE INTEGRATION READY
              </span>
            </h3>
          </div>
          <p className="text-xs text-slate-500 leading-normal">
            Secure cloud architecture blueprints customized for 1% of China (এক টুকরো চীন) e-commerce logic.
          </p>
        </div>

        {/* Developer Contact Ribbon Badge */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-2 px-3.5 flex items-center gap-2 shrink-0 shadow-3xs">
          <Phone className="w-3.5 h-3.5 text-[#E53935]" />
          <div className="text-[10px] leading-tight">
            <span className="text-slate-400 block font-bold uppercase tracking-wider">Lead Database Architect:</span>
            <strong className="text-slate-800 font-extrabold uppercase">JAMIL • 01307541441</strong>
          </div>
        </div>
      </div>

      {/* Subtab Navigation Row */}
      <div className="flex border-b border-slate-100 gap-1.5 p-1 bg-slate-50/75 rounded-2xl w-fit">
        <button
          onClick={() => setActiveSubTab("sql")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeSubTab === "sql"
              ? "bg-[#1C1C1E] text-white shadow-sm"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Code2 className="w-4 h-4" />
          <span>PostgreSQL DDL Schema Script</span>
        </button>
        <button
          onClick={() => setActiveSubTab("setup")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeSubTab === "setup"
              ? "bg-[#1C1C1E] text-white shadow-sm"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>Quick Connection Setup API</span>
        </button>
      </div>

      {/* WORKSPACE AREA */}
      {activeSubTab === "sql" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500 flex items-center gap-1.5 font-medium">
              <Terminal className="w-4 h-4 text-[#E53935]" />
              Run the following code directly inside your <strong>Supabase SQL Editor</strong>:
            </span>
            <button
              onClick={() => copyToClipboard(sqlSchemaCode, setCopiedSql)}
              className="flex items-center gap-1 bg-slate-50 hover:bg-slate-100 border text-slate-700 font-bold px-3 py-1.5 rounded-xl cursor-pointer transition-all active:scale-95 text-xs shadow-3xs"
            >
              {copiedSql ? (
                <>
                  <Check className="w-3.5 h-3.5 text-green-600" />
                  <span className="text-green-600">Copied Schema!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy SQL Code</span>
                </>
              )}
            </button>
          </div>

          <div className="relative">
            <pre className="bg-slate-900 text-slate-100 p-4 rounded-2xl text-[11px] font-mono leading-relaxed overflow-x-auto max-h-[400px] shadow-inner border border-slate-950">
              <code>{sqlSchemaCode}</code>
            </pre>
            <div className="absolute bottom-3 right-3 bg-slate-950/80 px-2.5 py-1 rounded-lg text-[9px] text-[#E53935] font-mono border border-slate-800 uppercase tracking-widest">
              JAMIL 01307541441
            </div>
          </div>
        </div>
      )}

      {activeSubTab === "setup" && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-slate-50 border rounded-2xl p-4.5 space-y-3">
              <span className="text-[10px] bg-red-100/60 text-[#E53935] font-black px-2.5 py-1 rounded-md uppercase tracking-wider">
                🔒 STEP 1: Environment Setup
              </span>
              <p className="text-xs text-slate-600 leading-normal">
                Establish these API endpoints inside your configuration file `.env` or development variables server config:
              </p>
              
              <div className="relative">
                <pre className="bg-slate-900 text-slate-100 p-3 rounded-xl text-[10.5px] font-mono leading-normal overflow-x-auto shadow-inner border border-slate-950">
                  <code>{envExample}</code>
                </pre>
                <button
                  onClick={() => copyToClipboard(envExample, setCopiedEnv)}
                  className="absolute top-2 right-2 bg-slate-800 hover:bg-slate-700 text-white p-1 rounded cursor-pointer border border-slate-700"
                  title="Copy variables"
                >
                  {copiedEnv ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            </div>

            <div className="bg-slate-50 border rounded-2xl p-4.5 space-y-3 flex flex-col justify-between">
              <div>
                <span className="text-[10px] bg-[#00C853]/15 text-[#00C853] font-black px-2.5 py-1 rounded-md uppercase tracking-wider">
                  🤝 STEP 2: Instantiation code
                </span>
                <p className="text-xs text-slate-600 leading-relaxed mt-2">
                  Create a new file at <code>src/lib/supabaseClient.ts</code> containing the global connection singleton:
                </p>
                <pre className="bg-slate-900 text-slate-100 p-3 rounded-xl text-[10px] font-mono mt-2 overflow-x-auto border border-slate-950 max-h-[160px]">
{`import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(url, key);`}
                </pre>
              </div>
            </div>
          </div>

          <div className="bg-red-50/50 border border-red-100 rounded-2xl p-4 flex gap-3 items-start">
            <ShieldCheck className="w-5 h-5 text-[#E53935] shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs">
              <strong className="text-slate-850 font-extrabold uppercase text-[#E53935]">Row Level Security (RLS) is pre-configured</strong>
              <p className="text-slate-600 leading-normal">
                To guarantee zero-data leaks, the SQL script automatically generates secure user partition schemas. Customers can only inspect or modify their own placed orders, while the master administrator has immediate universal control.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
