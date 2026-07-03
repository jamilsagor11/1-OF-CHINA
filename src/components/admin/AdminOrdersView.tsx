import React, { useState } from "react";
import { 
  CheckCircle, 
  Truck, 
  User, 
  Clock, 
  RefreshCw, 
  ShieldAlert, 
  Search, 
  FileText,
  DollarSign,
  Undo2
} from "lucide-react";
import { Order, OrderStatus, ShippingOrigin, CurrencyConfig } from "../../types";

interface AdminOrdersViewProps {
  orders: Order[];
  currency: CurrencyConfig;
  formatPrice: (price: number) => string;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus, details?: string) => Promise<boolean>;
}

export default function AdminOrdersView({
  orders,
  currency,
  formatPrice,
  onUpdateOrderStatus
}: AdminOrdersViewProps) {
  const [orderQuery, setOrderQuery] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(OrderStatus.PROCESSING);
  const [customTrackDetails, setCustomTrackDetails] = useState("");
  const [orderFilter, setOrderFilter] = useState<"all" | "pending" | "processing" | "shipped" | "customs" | "refunds">("all");

  const [refundLogs, setRefundLogs] = useState([
    { id: "REF-9921", orderId: "CG-BD-7821", amount: 2400, reason: "Defective packaging on arrival", status: "PENDING", date: "2026-06-13" },
    { id: "REF-9801", orderId: "CG-CN-9943", amount: 15300, reason: "Product specifications mismatch", status: "APPROVED", date: "2026-06-11" }
  ]);

  const handleUpdateStatus = async () => {
    if (!selectedOrderId) return;
    const success = await onUpdateOrderStatus(selectedOrderId, selectedStatus, customTrackDetails);
    if (success) {
      setCustomTrackDetails("");
      alert(` Fulfillments timeline updated for order ${selectedOrderId}.`);
    }
  };

  const handleDeclineRefund = (id: string) => {
    setRefundLogs(prev => prev.map(r => r.id === id ? { ...r, status: "DECLINED" } : r));
    alert("Refund request marked as declined. Client has been notified.");
  };

  const handleApproveRefund = (id: string) => {
    setRefundLogs(prev => prev.map(r => r.id === id ? { ...r, status: "APPROVED" } : r));
    alert("Refund request approved successfully. Funds returned to credit gateway wallet.");
  };

  // Filtering orders logic
  const filteredOrders = orders.filter(o => {
    const matchesQuery = o.id.toLowerCase().includes(orderQuery.toLowerCase()) || 
                          o.customerName.toLowerCase().includes(orderQuery.toLowerCase()) ||
                          o.customerEmail.toLowerCase().includes(orderQuery.toLowerCase());

    if (!matchesQuery) return false;

    if (orderFilter === "pending") return o.currentStatus === OrderStatus.RECEIVED;
    if (orderFilter === "processing") return o.currentStatus === OrderStatus.PROCESSING || o.currentStatus === OrderStatus.PACKED;
    if (orderFilter === "shipped") return o.currentStatus === OrderStatus.SHIPPED || o.currentStatus === OrderStatus.IN_TRANSIT;
    if (orderFilter === "customs") return o.currentStatus === OrderStatus.CUSTOMS;

    return true;
  });

  return (
    <div id="orders_panel_view" className="space-y-6">
      {/* Alert banner for timeline demonstration */}
      <div className="bg-amber-50 text-amber-800 border border-amber-200/50 p-4 rounded-2xl text-xs flex items-start gap-2.5 shadow-xs">
        <span>📦</span>
        <div>
          <strong className="font-bold">Logistics State Machine Sandbox:</strong> Keep track of China Direct flights or fast local dispatch. Pushing state revisions updates user portals instantly, demonstrating standard custom compliance and cross-border transport nodes.
        </div>
      </div>

      {/* Control filters bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3 w-4 h-4 text-slate-400 top-2.5" />
          <input
            type="text"
            placeholder="Search orders, clients, or emails..."
            value={orderQuery}
            onChange={(e) => setOrderQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 text-xs border border-slate-200 rounded-xl outline-none focus:ring-1 focus:ring-[#E53935]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1 w-full md:w-auto">
          {["all", "pending", "processing", "shipped", "customs", "refunds"].map((f) => (
            <button
              key={f}
              onClick={() => setOrderFilter(f as any)}
              className={`py-1.5 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors ${
                orderFilter === f 
                  ? "bg-[#E53935] text-white" 
                  : "bg-slate-50 hover:bg-slate-100 text-slate-500"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {orderFilter === "refunds" ? (
        /* Refund requests sub-table view */
        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs uppercase font-extrabold tracking-wider text-slate-500 flex items-center gap-1.5">
              <Undo2 className="w-4 h-4 text-[#E53935]" /> Returns & Refunds Requests Docket
            </h4>
            <span className="text-[10px] bg-red-100 text-[#E53935] font-bold py-1 px-2.5 rounded-full font-mono">
              SECURE ESCROW PAYMENTS
            </span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-100">
            <table className="w-full text-left font-sans text-xs">
              <thead className="bg-[#1C1C1E] text-white text-[10px] uppercase font-mono border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Refund ID</th>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4 text-right">Refund Value</th>
                  <th className="py-3 px-4">Return Claim Motive</th>
                  <th className="py-3 px-4">Log Status</th>
                  <th className="py-3 px-4 text-center">Resolve Case</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600 bg-white">
                {refundLogs.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/20">
                    <td className="py-3.5 px-4 font-bold font-mono text-slate-850">{item.id}</td>
                    <td className="py-3.5 px-4 font-semibold text-sky-650">{item.orderId}</td>
                    <td className="py-3.5 px-4 text-right font-black font-mono text-[#E53935]">{formatPrice(item.amount)}</td>
                    <td className="py-3.5 px-4 text-slate-500 line-clamp-1 max-w-xs pt-4">{item.reason}</td>
                    <td className="py-3.5 px-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.status === "PENDING" ? "bg-amber-100 text-amber-800" :
                        item.status === "APPROVED" ? "bg-emerald-100 text-emerald-800" :
                        "bg-red-100 text-red-800"
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {item.status === "PENDING" ? (
                        <div className="flex justify-center gap-1.5">
                          <button
                            onClick={() => handleApproveRefund(item.id)}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-bold py-1 px-2 rounded-lg"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleDeclineRefund(item.id)}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-bold py-1 px-2 rounded-lg"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-mono italic">Archived</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Standard Orders dispatch grid and timeline management form */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Timeline Management Action Form on Left */}
          <div className="lg:col-span-1 bg-white border border-slate-100 p-5 rounded-3xl shadow-xs space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Logistics Timeline Revisions</h4>
            <div>
              <label className="block text-[10px] font-semibold text-slate-400 mb-1 leading-none uppercase">Select Order</label>
              <select
                value={selectedOrderId}
                onChange={(e) => {
                  setSelectedOrderId(e.target.value);
                  const activeOrder = orders.find(o => o.id === e.target.value);
                  if (activeOrder) setSelectedStatus(activeOrder.currentStatus);
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs outline-none"
              >
                <option value="">-- Choose Order ID --</option>
                {orders.map(o => (
                  <option key={o.id} value={o.id}>
                    {o.id} ({o.customerName})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-slate-400 mb-1 leading-none uppercase">New Node Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as OrderStatus)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs outline-none"
              >
                {Object.values(OrderStatus).map(st => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-slate-400 mb-1 leading-none uppercase">Waybill Dispatch note (Optional)</label>
              <input
                type="text"
                value={customTrackDetails}
                onChange={(e) => setCustomTrackDetails(e.target.value)}
                placeholder="e.g. Flight CX-782 departed port towards DAC"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-[#E53935]"
              />
            </div>

            <button
              onClick={handleUpdateStatus}
              disabled={!selectedOrderId}
              className="w-full bg-slate-900 hover:bg-[#E53935] text-white text-xs font-bold py-3 px-4 rounded-xl transition-all disabled:bg-slate-100 disabled:text-slate-400 text-center"
            >
              Push Status Update
            </button>
          </div>

          {/* Orders table on Right */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left font-sans text-xs">
                <thead className="bg-[#1C1C1E] text-white text-[10px] uppercase font-mono">
                  <tr>
                    <th className="py-3 px-4">Order ID & Client</th>
                    <th className="py-3 px-4">Fulfillment Channel</th>
                    <th className="py-3 px-4">Escrow Wallet</th>
                    <th className="py-3 px-4 text-right">Total Amount</th>
                    <th className="py-3 px-4 text-center">Active Node</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-400 font-medium">
                        No orders recorded matching selection.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map(o => (
                      <tr 
                        key={o.id}
                        onClick={() => setSelectedOrderId(o.id)}
                        className={`hover:bg-slate-50/50 cursor-pointer transition-colors ${selectedOrderId === o.id ? "bg-red-50/40" : ""}`}
                      >
                        <td className="py-3.5 px-4">
                          <p className="font-bold text-slate-850 font-mono">{o.id}</p>
                          <span className="text-[10px] text-slate-550 block font-semibold mt-0.5">{o.customerName}</span>
                          <span className="text-[9.5px] text-slate-400 block font-mono">{o.customerEmail}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          {o.items[0]?.product.origin === ShippingOrigin.CHINA ? (
                            <span className="bg-purple-50 text-purple-700 text-[9px] font-extrabold px-1.5 py-0.5 rounded border border-purple-100/40">
                              🇨🇳 China Supplier
                            </span>
                          ) : (
                            <span className="bg-emerald-50 text-emerald-700 text-[9px] font-extrabold px-1.5 py-0.5 rounded border border-emerald-100/40">
                              🇧🇩 BD Stock
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`text-[10px] font-bold py-0.5 px-2 rounded-full font-sans ${
                            o.paymentStatus === "Paid" 
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-100" 
                              : "bg-amber-50 text-amber-800 border border-amber-100"
                          }`}>
                            {o.paymentMethod} • {o.paymentStatus}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right font-black font-mono text-slate-855">
                          {formatPrice(o.totalAmount)}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="bg-[#1C1C1E] text-white text-[9px] font-mono px-2 py-0.5 rounded font-black uppercase">
                            {o.currentStatus}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
