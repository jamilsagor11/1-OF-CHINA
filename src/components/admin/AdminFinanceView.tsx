import React, { useState } from "react";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  CreditCard, 
  PieChart, 
  PlusCircle, 
  Trash2,
  BookOpen
} from "lucide-react";
import { Order, CurrencyConfig } from "../../types";

interface AdminFinanceViewProps {
  orders: Order[];
  currency: CurrencyConfig;
  formatPrice: (price: number) => string;
}

export default function AdminFinanceView({
  orders,
  currency,
  formatPrice
}: AdminFinanceViewProps) {
  const [expenseTitle, setExpenseTitle] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenses, setExpenses] = useState([
    { id: 1, name: "Sino-BD Air Cargo Cargo Shipping", cost: 14500, date: "2026-06-12" },
    { id: 2, name: "Dhanmondi office electricity and desk bills", cost: 3400, date: "2026-06-08" },
    { id: 3, name: "Pathao logistics local delivery parcels", cost: 1200, date: "2026-06-02" }
  ]);

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseTitle.trim() || !expenseAmount) return;

    const newExpense = {
      id: Date.now(),
      name: expenseTitle,
      cost: parseFloat(expenseAmount),
      date: new Date().toISOString().split("T")[0]
    };

    setExpenses(prev => [newExpense, ...prev]);
    setExpenseTitle("");
    setExpenseAmount("");
  };

  const handleDeleteExpense = (id: number) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  // Calculations
  const grossSales = orders
    .filter(o => o.paymentStatus === "Paid")
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const totalExpenseCosts = expenses.reduce((sum, e) => sum + e.cost, 0);
  const netProfit = grossSales - totalExpenseCosts;

  return (
    <div id="finance_ledger_v" className="space-y-6">
      {/* Financial metrics snapshot */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-xs">
          <span className="text-[9.5px] uppercase font-bold text-slate-400 block tracking-wider">Gross Sourcing Sales</span>
          <p className="text-2xl font-black font-mono text-slate-800 mt-1">{formatPrice(grossSales)}</p>
          <span className="text-[9px] text-[#00C853] mt-1 block">Paid and locked escrow capital</span>
        </div>

        <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-xs">
          <span className="text-[9.5px] uppercase font-bold text-slate-400 block tracking-wider">Operational Expense Ledger</span>
          <p className="text-2xl font-black font-mono text-slate-850 mt-1">{formatPrice(totalExpenseCosts)}</p>
          <span className="text-[9px] text-red-500 mt-1 block">- {expenses.length} distinct bills registered</span>
        </div>

        <div className="bg-[#1C1C1E] text-white p-5 rounded-3xl border border-slate-900 shadow-md">
          <span className="text-[9.5px] uppercase font-bold text-slate-400 block tracking-wider">Computed Net Profited Margin</span>
          <p className={`text-2xl font-black font-mono mt-1 ${netProfit >= 0 ? "text-emerald-405 text-[#00C853]" : "text-[#E53935]"}`}>
            {formatPrice(netProfit)}
          </p>
          <span className="text-[9px] text-slate-300 mt-1 block">Adjusts live as expense statements are logged</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Expenses Logger log on Left */}
        <form onSubmit={handleAddExpense} className="lg:col-span-1 bg-white border border-slate-100 p-5 rounded-3xl shadow-xs space-y-4">
          <h4 className="text-xs uppercase font-extrabold tracking-wider text-slate-500 flex items-center gap-1.5 animate-pulse">
            <PlusCircle className="w-4 h-4 text-[#E53935]" /> Log General Expense Document
          </h4>
          <p className="text-[10px] text-slate-450 leading-relaxed">
            Record office operating costs, bulk airway freight taxes, customs processing fees, or staff salaries inside the audit ledger.
          </p>

          <div className="space-y-3.5">
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Expense Statement Name</label>
              <input 
                type="text"
                required
                value={expenseTitle}
                onChange={e => setExpenseTitle(e.target.value)}
                placeholder="e.g. Shenzhen Airport flight tax"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-[#E53935]"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Cost value (BDT)</label>
              <input 
                type="number"
                required
                value={expenseAmount}
                onChange={e => setExpenseAmount(e.target.value)}
                placeholder="e.g. 1500"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-[#E53935]"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-[#E53935] text-white text-xs font-bold py-3 px-4 rounded-xl transition-all text-center"
            >
              Log Bill Entry
            </button>
          </div>
        </form>

        {/* Expenses statement list table on right */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 p-5 shadow-xs space-y-4">
          <h4 className="text-xs uppercase font-extrabold tracking-wider text-slate-500 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-[#E53935]" /> Double-Entry Operational Statement Ledger
          </h4>

          <div className="overflow-x-auto rounded-2xl border border-slate-100">
            <table className="w-full text-left font-sans text-xs">
              <thead className="bg-[#1C1C1E] text-white text-[10px] uppercase font-mono">
                <tr>
                  <th className="py-2.5 px-3">Statement Name</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3 text-right">Debit Cost</th>
                  <th className="py-2.5 px-3 text-center">Rescind</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600 bg-white">
                {expenses.map((e) => (
                  <tr key={e.id} className="hover:bg-slate-55/20 hover:bg-slate-50/20">
                    <td className="py-3 px-3 font-semibold text-slate-800">{e.name}</td>
                    <td className="py-3 px-3 text-slate-400 font-mono">{e.date}</td>
                    <td className="py-3 px-3 text-right font-black font-mono text-red-650 text-red-600">- {formatPrice(e.cost)}</td>
                    <td className="py-3 px-3 text-center">
                      <button 
                        onClick={() => handleDeleteExpense(e.id)}
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

      </div>
    </div>
  );
}
