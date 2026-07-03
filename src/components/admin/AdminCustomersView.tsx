import React, { useState, useEffect } from "react";
import { 
  Users, 
  Award, 
  Mail, 
  MessageSquare, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  Send,
  UserCheck
} from "lucide-react";
import { User, SupportTicket, AdminRole } from "../../types";

interface AdminCustomersViewProps {
  users: User[];
  onRefreshUsers?: () => void;
}

export default function AdminCustomersView({
  users,
  onRefreshUsers
}: AdminCustomersViewProps) {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [isReplying, setIsReplying] = useState(false);

  // Fetch support tickets on load
  useEffect(() => {
    fetch("/api/admin/support-tickets")
      .then(res => res.json())
      .then(data => {
        if (data.tickets) {
          setTickets(data.tickets);
        }
      })
      .catch(err => console.error("Error loading tickets", err));
  }, [isReplying]);

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicketId || !replyMessage.trim()) return;

    setIsReplying(true);
    try {
      const res = await fetch(`/api/admin/support-tickets/${selectedTicketId}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reply: replyMessage })
      });
      const data = await res.json();
      if (data.success) {
        setReplyMessage("");
        setSelectedTicketId(null);
        alert("Reply successfully dispatched to customer. Ticket resolved.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsReplying(false);
    }
  };

  // Only render standard customers in directory list
  const customersList = users.filter(u => u.role === AdminRole.CUSTOMER) || [];

  return (
    <div className="space-y-6">
      {/* Upper Grid divided into Customer listings & Active Support Helpline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Customer Directory List on Left */}
        <div className="lg:col-span-1 bg-white border border-slate-100 p-6 rounded-3xl shadow-xs space-y-4">
          <h4 className="text-xs uppercase font-extrabold text-slate-500 tracking-wider flex items-center gap-1.5">
            <Users className="w-4 h-4 text-[#E53935]" /> Customer Accounts Directory ({customersList.length || 4})
          </h4>
          <p className="text-[10px] text-slate-450 leading-relaxed">
            These are active client accounts synced via Google Session Auth and standard email login mechanisms inside the marketplace.
          </p>

          <div className="space-y-3.5 max-h-[420px] overflow-y-auto pr-1">
            {users.map((c) => (
              <div key={c.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between gap-2.5">
                <div className="flex items-center gap-2.5">
                  <img src={c.profilePhoto} alt="" className="w-9 h-9 object-cover rounded-full border border-slate-200" />
                  <div>
                    <h5 className="text-xs font-bold text-slate-800 line-clamp-1">{c.name}</h5>
                    <p className="text-[10px] text-slate-400 font-mono">{c.email}</p>
                    <span className="text-[8.5px] uppercase font-bold text-[#E53935] bg-red-100/45 px-1.5 py-0.5 rounded-sm mt-0.5 inline-block">
                      {c.role}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">Loyalty Points</span>
                  <p className="text-xs font-black font-mono mt-0.5 text-emerald-600">★ {c.loyaltyPoints || 100} PTS</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Support Ticket Workspace on Right */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 p-6 shadow-xs space-y-4">
          <h4 className="text-xs uppercase font-extrabold text-slate-500 tracking-wider flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4 text-[#E53935]" /> Customer Helpdesk Support Tickets Inbox ({tickets.length || 2})
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Tickets Listing Table Grid */}
            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {tickets.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-2xl text-slate-400 text-xs text-medium">
                  Hurrah! Support queue empty. All tickets resolved.
                </div>
              ) : (
                tickets.map((t) => (
                  <div 
                    key={t.id}
                    onClick={() => setSelectedTicketId(t.id)}
                    className={`p-4 rounded-2xl border cursor-pointer text-xs transition-all ${
                      selectedTicketId === t.id 
                        ? "bg-[#1C1C1E] text-white border-slate-950" 
                        : "bg-slate-50 text-slate-700 border-slate-100 hover:bg-slate-100/50"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="font-mono text-[9px] font-bold text-slate-400">{t.id}</span>
                      <span className={`text-[8.5px] font-bold px-1.5 py-0.5 rounded ${
                        t.status === "OPEN" ? "bg-red-100 text-[#E53935]" : "bg-emerald-100 text-emerald-800"
                      }`}>
                        {t.status}
                      </span>
                    </div>
                    <h5 className="font-bold line-clamp-1">{t.subject}</h5>
                    <p className={`text-[10px] mt-1 line-clamp-2 ${selectedTicketId === t.id ? "text-slate-300" : "text-slate-500"}`}>
                      {t.message}
                    </p>
                    <span className="text-[9px] text-slate-400 block mt-2 font-mono">
                      By: {t.customerName}
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Ticket Responder Panel */}
            <div className="bg-slate-50/70 border border-slate-100 rounded-2xl p-4 text-xs">
              {selectedTicketId ? (
                (() => {
                  const activeTck = tickets.find(t => t.id === selectedTicketId);
                  if (!activeTck) return null;
                  return (
                    <form onSubmit={handleSendReply} className="space-y-4 h-full flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="border-b border-slate-200/50 pb-2">
                          <span className="text-[9px] uppercase font-bold text-slate-400 block">Active Ticket</span>
                          <h5 className="font-bold text-slate-800">{activeTck.subject}</h5>
                          <span className="text-[10px] text-slate-450 block font-mono mt-0.5">{activeTck.customerEmail}</span>
                        </div>
                        <div className="bg-white p-2.5 rounded-lg border border-slate-100 max-h-[140px] overflow-y-auto">
                          <p className="text-slate-600 leading-relaxed font-normal">{activeTck.message}</p>
                        </div>
                        {activeTck.reply && (
                          <div className="bg-emerald-50 text-emerald-800 p-2.5 rounded-lg border border-emerald-100">
                            <strong>Resolution dispatch:</strong> {activeTck.reply}
                          </div>
                        )}
                      </div>

                      {!activeTck.reply ? (
                        <div className="space-y-2.5 mt-3">
                          <label className="text-[10px] uppercase font-bold text-slate-400 block">Draft Resolution Response</label>
                          <textarea
                            required
                            value={replyMessage}
                            onChange={(e) => setReplyMessage(e.target.value)}
                            placeholder="Type resolution notes to send client..."
                            className="w-full bg-white border border-slate-200 rounded-xl p-2 px-3 text-xs outline-none focus:border-[#E53935] h-14 resize-none"
                          />
                          <button
                            type="submit"
                            disabled={isReplying}
                            className="w-full bg-[#E53935] hover:bg-red-700 text-white font-bold py-2 px-4 rounded-xl flex items-center justify-center gap-1.5"
                          >
                            <Send className="w-3.5 h-3.5" /> Dispatched response via Email
                          </button>
                        </div>
                      ) : (
                        <div className="text-center py-4 text-slate-400 italic font-mono text-[10px] mt-4">
                          ✓ Case Resolved and Archived
                        </div>
                      )}
                    </form>
                  );
                })()
              ) : (
                <div className="h-full flex flex-col justify-center items-center text-center p-6 text-slate-400">
                  <Mail className="w-8 h-8 text-slate-300 mb-2" />
                  <p className="font-semibold text-xs">Awaiting active ticket node select</p>
                  <p className="text-[9.5px] text-slate-450 mt-1 max-w-[200px]">Select any customer ticket on the left queue list to review and reply.</p>
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
