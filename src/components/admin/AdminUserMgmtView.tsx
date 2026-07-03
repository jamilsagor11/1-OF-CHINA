import React, { useState, useEffect } from "react";
import { 
  Shield, 
  UserX, 
  UserCheck, 
  ShieldAlert, 
  RefreshCw, 
  PlusCircle, 
  Trash2,
  Lock,
  Activity,
  History,
  Key
} from "lucide-react";
import { User, ActivityLog, LoginHistory, AdminRole } from "../../types";

interface AdminUserMgmtViewProps {
  users: User[];
  onRefreshUsers?: () => void;
}

export default function AdminUserMgmtView({
  users,
  onRefreshUsers
}: AdminUserMgmtViewProps) {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loginHistory, setLoginHistory] = useState<LoginHistory[]>([]);
  const [activeSubTab, setActiveSubTab] = useState<"roles" | "audit" | "login">("roles");

  // Form states to create admin
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<AdminRole>(AdminRole.ADMIN);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSecurityData = () => {
    // Activity audits
    fetch("/api/admin/logs")
      .then(res => res.json())
      .then(data => {
        if (data.logs) setLogs(data.logs);
      })
      .catch(err => console.error(err));

    // Login tracks
    fetch("/api/admin/login-history")
      .then(res => res.json())
      .then(data => {
        if (data.loginHistory) setLoginHistory(data.loginHistory);
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchSecurityData();
  }, [isLoading]);

  const handleRegisterUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, role })
      });
      const data = await res.json();
      if (data.success) {
        setName("");
        setEmail("");
        setRole(AdminRole.ADMIN);
        alert(`Account created successfully for ${data.user.name}. Role set to ${data.user.role}.`);
        if (onRefreshUsers) onRefreshUsers();
        fetchSecurityData();
      } else {
        alert(data.error || "Creation failed");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateRole = async (userId: string, newRole: AdminRole) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole })
      });
      const data = await res.json();
      if (data.success) {
        alert(`Role successfully changed to ${newRole}.`);
        if (onRefreshUsers) onRefreshUsers();
        fetchSecurityData();
      } else {
        alert(data.error || "Role modification failed");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Confirm complete decommissioning of this staff account access credentials?")) return;

    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        alert(data.message);
        if (onRefreshUsers) onRefreshUsers();
        fetchSecurityData();
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Sub tabs navigation */}
      <div className="flex border-b border-slate-200 gap-2 mb-4">
        <button
          onClick={() => setActiveSubTab("roles")}
          className={`pb-2.5 px-4 text-xs font-bold uppercase tracking-wider relative ${
            activeSubTab === "roles" ? "text-[#E53935]" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          {activeSubTab === "roles" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E53935]"></div>}
          <div className="flex items-center gap-1.5">
            <Shield className="w-4 h-4" /> staff registry ({users.length})
          </div>
        </button>
        <button
          onClick={() => setActiveSubTab("audit")}
          className={`pb-2.5 px-4 text-xs font-bold uppercase tracking-wider relative ${
            activeSubTab === "audit" ? "text-[#E53935]" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          {activeSubTab === "audit" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E53935]"></div>}
          <div className="flex items-center gap-1.5">
            <Activity className="w-4 h-4" /> Admin Action audit Ledger
          </div>
        </button>
        <button
          onClick={() => setActiveSubTab("login")}
          className={`pb-2.5 px-4 text-xs font-bold uppercase tracking-wider relative ${
            activeSubTab === "login" ? "text-[#E53935]" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          {activeSubTab === "login" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E53935]"></div>}
          <div className="flex items-center gap-1.5">
            <History className="w-4 h-4" /> Login Session Tracker
          </div>
        </button>
      </div>

      {activeSubTab === "roles" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick-add staff on Left */}
          <form onSubmit={handleRegisterUser} className="lg:col-span-1 bg-white border border-slate-100 p-6 rounded-3xl shadow-xs space-y-4">
            <h4 className="text-xs uppercase font-extrabold tracking-wider text-slate-500 flex items-center gap-1.5">
              <PlusCircle className="w-4 h-4 text-[#E53935]" /> Register Staff Associate
            </h4>
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Associate Full Name</label>
                <input 
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Sajid Hasan"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-[#E53935]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Staff Email Coordinate</label>
                <input 
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="e.g. sajid@chinagiftshop.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-[#E53935]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Allocated Authority Role</label>
                <select
                  value={role}
                  onChange={e => setRole(e.target.value as AdminRole)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs outline-none"
                >
                  <option value={AdminRole.ADMIN}>Admin (Logistics)</option>
                  <option value={AdminRole.MANAGER}>Store Manager</option>
                  <option value={AdminRole.WAREHOUSE_STAFF}>Warehouse Operator</option>
                  <option value={AdminRole.CUSTOMER_SUPPORT}>Customer Helpline Helpdesk</option>
                  <option value={AdminRole.MARKETING_STAFF}>Marketing Executive</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#1C1C1E] hover:bg-[#E53935] text-white text-xs font-bold py-3 px-4 rounded-xl text-center transition-colors"
              >
                Provision Staff Access
              </button>
            </div>
          </form>

          {/* Core Staff listed matrix on right */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 p-6 shadow-xs space-y-4">
            <h4 className="text-xs uppercase font-extrabold tracking-wider text-slate-500">System Authorities & Roles Matrix</h4>
            
            <div className="overflow-x-auto rounded-2xl border border-slate-100">
              <table className="w-full text-left font-sans text-xs">
                <thead className="bg-[#1C1C1E] text-white text-[10px] uppercase font-mono">
                  <tr>
                    <th className="py-2.5 px-3">Associate Details</th>
                    <th className="py-2.5 px-3">Active Authority Role</th>
                    <th className="py-2.5 px-3 text-center">Decom</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white text-slate-600">
                  {users.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/20">
                      <td className="py-3 px-3 flex items-center gap-2.5">
                        <img src={item.profilePhoto} alt="" className="w-8 h-8 object-cover rounded-full border border-slate-200" />
                        <div>
                          <p className="font-bold text-slate-800 leading-none">{item.name}</p>
                          <span className="text-[10px] text-slate-400 font-mono mt-1 block">{item.email}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        {item.email.toLowerCase() === "jmisagor079@gmail.com" ? (
                          <span className="bg-red-100 text-[#E53935] text-[9.5px] font-black px-2.5 py-0.5 rounded uppercase font-mono tracking-wide">
                            👑 PERMANENT SUPER ADMIN
                          </span>
                        ) : (
                          <select
                            value={item.role}
                            onChange={(e) => handleUpdateRole(item.id, e.target.value as AdminRole)}
                            className="bg-slate-50 border border-slate-200 text-[10.5px] font-bold py-1 px-2.5 rounded-lg outline-none"
                          >
                            <option value={AdminRole.SUPER_ADMIN}>Super Admin</option>
                            <option value={AdminRole.ADMIN}>Admin</option>
                            <option value={AdminRole.MANAGER}>Manager</option>
                            <option value={AdminRole.WAREHOUSE_STAFF}>Warehouse Staff</option>
                            <option value={AdminRole.CUSTOMER_SUPPORT}>Customer Support</option>
                            <option value={AdminRole.MARKETING_STAFF}>Marketing Staff</option>
                            <option value={AdminRole.CUSTOMER}>Customer Client</option>
                          </select>
                        )}
                      </td>
                      <td className="py-3 px-3 text-center">
                        {item.email.toLowerCase() !== "jmisagor079@gmail.com" ? (
                          <button
                            onClick={() => handleDeleteUser(item.id)}
                            className="p-1 hover:bg-red-50 hover:text-red-650 text-slate-400 rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === "audit" && (
        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-xs uppercase font-extrabold tracking-wider text-slate-500 flex items-center gap-1.5 font-mono">
              <Key className="w-4 h-4 text-[#E53935]" /> Security Audit Trail Audit Ledger
            </h4>
            <button
              onClick={fetchSecurityData}
              className="bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs py-1.5 px-3 rounded-lg flex items-center gap-1 font-semibold"
            >
              <RefreshCw className="w-3 h-3 anim-spin" /> refresh logs
            </button>
          </div>

          <p className="text-[10px] text-slate-450">
            Secure, un-resizable double-entry audit log capturing all product edits, administrative actions, role overrides, and database configurations.
          </p>

          <div className="overflow-x-auto rounded-2xl border border-slate-100">
            <table className="w-full text-left font-sans text-xs">
              <thead className="bg-[#1C1C1E] text-white text-[10px] uppercase font-mono">
                <tr>
                  <th className="py-2.5 px-3">Audit action node</th>
                  <th className="py-2.5 px-3">User Email Coordinates</th>
                  <th className="py-2.5 px-3">Active Authority</th>
                  <th className="py-2.5 px-3">Details Parameters Spec</th>
                  <th className="py-2.5 px-3">Ip Target</th>
                  <th className="py-2.5 px-3 text-right">Waybill Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white text-slate-600 font-medium">
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400 italic">No activity logs recorded.</td>
                  </tr>
                ) : (
                  logs.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/15">
                      <td className="py-3 px-3">
                        <span className="bg-[#E53935]/15 text-[#E53935] text-[9px] font-mono px-2 py-0.5 rounded font-black uppercase">
                          {item.action}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-800 font-mono font-bold">{item.userEmail}</td>
                      <td className="py-3 px-3 uppercase text-[10px] text-slate-500">{item.role}</td>
                      <td className="py-3 px-3 text-slate-500 max-w-xs truncate" title={item.details}>{item.details}</td>
                      <td className="py-3 px-3 text-slate-400 font-mono">{item.ip}</td>
                      <td className="py-3 px-3 text-right text-slate-400 font-mono">{new Date(item.timestamp).toLocaleTimeString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeSubTab === "login" && (
        <div className="bg-white rounded-3xl border border-[#E53935]/20 p-6 shadow-xs space-y-4">
          <h4 className="text-xs uppercase font-extrabold tracking-wider text-slate-500 flex items-center gap-1.5 font-mono">
            <Lock className="w-4 h-4 text-[#E53935]" /> User Login Session History (with Two-Factor verification indices)
          </h4>

          <div className="overflow-x-auto rounded-2xl border border-slate-100">
            <table className="w-full text-left font-sans text-xs">
              <thead className="bg-[#1C1C1E] text-white text-[10px] uppercase font-mono">
                <tr>
                  <th className="py-2.5 px-3">Session Log ID</th>
                  <th className="py-2.5 px-3">E-Mail Coordinate</th>
                  <th className="py-2.5 px-3">Ip Address client</th>
                  <th className="py-2.5 px-3">TFA / OTP Status Map</th>
                  <th className="py-2.5 px-3 text-right">Login Session Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white text-slate-600">
                {loginHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/20">
                    <td className="py-3 px-3 font-mono text-[9.5px] font-bold">{item.id}</td>
                    <td className="py-3 px-3 font-semibold text-slate-800">{item.userEmail}</td>
                    <td className="py-3 px-3 text-slate-400 font-mono">{item.ip}</td>
                    <td className="py-3 px-3">
                      {item.twoFactorPassed ? (
                        <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                          ● PASS (Identity Verified)
                        </span>
                      ) : (
                        <span className="bg-red-100 text-[#E53935] text-[9px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1 animate-pulse">
                          ● FAILS / AWAITING OTP
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right text-slate-400 font-mono">{new Date(item.timestamp).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
