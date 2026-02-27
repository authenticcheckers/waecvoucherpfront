"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap, UploadCloud, RefreshCw, Database, ChevronLeft,
  CheckCircle2, AlertCircle, TrendingUp, CreditCard, Plus,
  Search, Download, Trash2, Eye, EyeOff, LogOut, Lock,
  FileText, Package, BarChart3, Users, Filter, X, ChevronDown,
  ArrowUpRight, Inbox, Shield
} from "lucide-react";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_URL || "https://waecevoucaherp.onrender.com";

const TYPE_STYLES: Record<string, string> = {
  WASSCE:          "bg-blue-100 text-blue-700 border-blue-200",
  BECE:            "bg-amber-100 text-amber-700 border-amber-200",
  SCHOOLPLACEMENT: "bg-violet-100 text-violet-700 border-violet-200",
};

const VOUCHER_TYPES = ["WASSCE", "BECE", "SCHOOLPLACEMENT"];

// ── helper ──────────────────────────────────────────────────
function fmt(d: string) {
  if (!d) return "—";
  return new Date(d).toLocaleString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}
function fmtDate(d: string) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

// ──────────────────────────────────────────────────────────────
//  LOGIN SCREEN
// ──────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: (key: string) => void }) {
  const [key, setKey] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  const handleLogin = async () => {
    if (!key.trim()) { setError("Enter your admin key."); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch(`${API}/api/admin/stats`, {
        headers: { "x-admin-key": key.trim() }
      });
      if (res.status === 401) throw new Error("Incorrect admin key.");
      if (!res.ok) throw new Error("Server error — check that your backend is running.");
      onLogin(key.trim());
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      {/* bg pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: 'radial-gradient(circle, #fbbf24 1px, transparent 1px)', backgroundSize: '32px 32px'}} />

      <motion.div initial={{ opacity: 0, y: 20, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-2xl shadow-amber-400/30">
            <Shield size={28} className="text-slate-900" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Admin Access</h1>
          <p className="text-slate-500 text-sm font-medium mt-1">VoucherHubGH Dashboard</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-4">
          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Admin Secret Key</label>
            <div className="relative">
              <input
                type={show ? "text" : "password"}
                value={key} onChange={e => setKey(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
                placeholder="sk_admin_••••••••••"
                className="w-full bg-slate-800 border border-slate-700 text-white px-4 py-3.5 rounded-2xl outline-none focus:border-amber-400/60 font-mono text-sm pr-12 transition-colors placeholder:text-slate-600"
              />
              <button onClick={() => setShow(s => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors p-1">
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-2 text-xs font-bold text-red-400 bg-red-900/20 border border-red-800/40 px-4 py-3 rounded-xl"
              >
                <AlertCircle size={14} /> {error}
              </motion.div>
            )}
          </AnimatePresence>

          <button onClick={handleLogin} disabled={loading}
            className="w-full btn-premium py-4 rounded-2xl text-slate-900 font-black flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? <><RefreshCw size={16} className="animate-spin" /> Verifying...</> : <><Lock size={16} /> Enter Dashboard</>}
          </button>
        </div>

        <p className="text-center text-xs text-slate-600 mt-6 font-medium">
          Set in your backend <code className="bg-slate-900 px-1.5 py-0.5 rounded text-slate-400">.env</code> as <code className="bg-slate-900 px-1.5 py-0.5 rounded text-slate-400">ADMIN_SECRET</code>
        </p>
      </motion.div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
//  STAT CARD
// ──────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, icon, accent }: any) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      className="glass p-6 rounded-2xl flex items-start gap-4"
    >
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${accent}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-2xl font-black text-slate-900 leading-none">{value}</p>
        {sub && <p className="text-xs text-slate-400 font-medium mt-1">{sub}</p>}
      </div>
    </motion.div>
  );
}

// ──────────────────────────────────────────────────────────────
//  TOAST
// ──────────────────────────────────────────────────────────────
function Toast({ msg, onClose }: { msg: { text: string; type: string } | null; onClose: () => void }) {
  useEffect(() => {
    if (!msg) return;
    const t = setTimeout(onClose, 5000);
    return () => clearTimeout(t);
  }, [msg, onClose]);

  return (
    <AnimatePresence>
      {msg && (
        <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl text-sm font-bold max-w-sm ${
            msg.type === "success"
              ? "bg-emerald-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          {msg.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span className="flex-1">{msg.text}</span>
          <button onClick={onClose} className="opacity-70 hover:opacity-100"><X size={16} /></button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ──────────────────────────────────────────────────────────────
//  MAIN DASHBOARD
// ──────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [adminKey, setAdminKey] = useState<string | null>(null);
  const [tab, setTab] = useState<"overview" | "upload" | "sales" | "stock">("overview");
  const [toast, setToast] = useState<{ text: string; type: string } | null>(null);

  // Data
  const [stats, setStats] = useState<any>(null);
  const [sales, setSales] = useState<any[]>([]);
  const [loadingStats, setLoadingStats] = useState(false);
  const [loadingSales, setLoadingSales] = useState(false);

  // Upload — CSV file
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvPreview, setCsvPreview] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Upload — manual single voucher
  const [manualSerial, setManualSerial] = useState("");
  const [manualPin, setManualPin] = useState("");
  const [manualType, setManualType] = useState("BECE");
  const [manualLoading, setManualLoading] = useState(false);

  // Sales filters
  const [salesSearch, setSalesSearch] = useState("");
  const [salesTypeFilter, setSalesTypeFilter] = useState("ALL");

  const notify = (text: string, type: "success" | "error") => setToast({ text, type });

  const headers = useCallback(() => ({
    "Content-Type": "application/json",
    "x-admin-key": adminKey || "",
  }), [adminKey]);

  // ── fetch data ──
  const fetchStats = useCallback(async () => {
    setLoadingStats(true);
    try {
      const res = await fetch(`${API}/api/admin/stats`, { headers: { "x-admin-key": adminKey || "" } });
      if (!res.ok) throw new Error();
      setStats(await res.json());
    } catch { notify("Failed to load stats.", "error"); }
    finally { setLoadingStats(false); }
  }, [adminKey]);

  const fetchSales = useCallback(async () => {
    setLoadingSales(true);
    try {
      const res = await fetch(`${API}/api/admin/sales`, { headers: { "x-admin-key": adminKey || "" } });
      if (!res.ok) throw new Error();
      setSales(await res.json());
    } catch { notify("Failed to load sales.", "error"); }
    finally { setLoadingSales(false); }
  }, [adminKey]);

  useEffect(() => {
    if (!adminKey) return;
    fetchStats();
    fetchSales();
  }, [adminKey, fetchStats, fetchSales]);

  // ── CSV file parsing ──
  const handleCSVFile = (file: File) => {
    setCsvFile(file);
    const reader = new FileReader();
    reader.onload = e => {
      const text = e.target?.result as string;
      const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
      // Skip header if first line looks like a header
      const start = lines[0]?.toLowerCase().includes("serial") ? 1 : 0;
      const parsed = lines.slice(start).map(line => {
        const parts = line.split(",").map(p => p.trim().replace(/^["']|["']$/g, ""));
        return { serial_number: parts[0], pin: parts[1], type: parts[2]?.toUpperCase() };
      }).filter(v => v.serial_number && v.pin && v.type);
      setCsvPreview(parsed);
    };
    reader.readAsText(file);
  };

  const uploadCSV = async () => {
    if (!csvPreview.length) { notify("No valid vouchers parsed from CSV.", "error"); return; }
    setUploading(true);
    try {
      const res = await fetch(`${API}/api/admin/upload`, {
        method: "POST",
        headers: headers(),
        body: JSON.stringify({ vouchers: csvPreview }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      notify(data.message || "Vouchers uploaded.", "success");
      setCsvFile(null); setCsvPreview([]);
      fetchStats();
    } catch (err: any) {
      notify(err.message || "Upload failed.", "error");
    } finally { setUploading(false); }
  };

  const uploadManual = async () => {
    if (!manualSerial.trim() || !manualPin.trim()) {
      notify("Serial number and PIN are required.", "error"); return;
    }
    setManualLoading(true);
    try {
      const res = await fetch(`${API}/api/admin/upload`, {
        method: "POST",
        headers: headers(),
        body: JSON.stringify({ vouchers: [{ serial_number: manualSerial.trim(), pin: manualPin.trim(), type: manualType }] }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      notify(`Voucher added: ${manualSerial}`, "success");
      setManualSerial(""); setManualPin("");
      fetchStats();
    } catch (err: any) {
      notify(err.message || "Failed to add voucher.", "error");
    } finally { setManualLoading(false); }
  };

  // ── Export sales to CSV ──
  const exportSales = () => {
    const header = "ID,Serial Number,Type,Purchaser Name,Phone,Paystack Reference,Date,Amount (GHS)";
    const rows = sales.map(s =>
      [s.id, s.serial_number, s.type, `"${s.purchaser_name}"`, s.purchaser_phone, s.paystack_reference, fmtDate(s.purchased_at), "25.00"].join(",")
    );
    const blob = new Blob([[header, ...rows].join("\n")], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
    a.download = `VoucherHubGH-Sales-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  // ── Filtered sales ──
  const filteredSales = sales.filter(s => {
    const matchType = salesTypeFilter === "ALL" || s.type === salesTypeFilter;
    const q = salesSearch.toLowerCase();
    const matchSearch = !q || s.purchaser_name?.toLowerCase().includes(q)
      || s.purchaser_phone?.includes(q) || s.serial_number?.toLowerCase().includes(q)
      || s.paystack_reference?.toLowerCase().includes(q);
    return matchType && matchSearch;
  });

  // ── Login gate ──
  if (!adminKey) return <LoginScreen onLogin={setAdminKey} />;

  // ── Derived stats ──
  const totalSold    = stats?.revenue?.total_sold || 0;
  const totalRevenue = stats?.revenue?.total_revenue_ghs || 0;
  const stockRows    = stats?.stock || [];
  const totalStock   = stockRows.reduce((a: number, r: any) => a + parseInt(r.total), 0);
  const totalAvail   = stockRows.reduce((a: number, r: any) => a + parseInt(r.available), 0);

  const TABS = [
    { id: "overview", label: "Overview",  icon: <BarChart3 size={16} /> },
    { id: "upload",   label: "Upload",    icon: <UploadCloud size={16} /> },
    { id: "sales",    label: "Sales",     icon: <TrendingUp size={16} /> },
    { id: "stock",    label: "Inventory", icon: <Package size={16} /> },
  ];

  return (
    <div className="bg-mesh min-h-screen">
      <Toast msg={toast} onClose={() => setToast(null)} />

      {/* ── NAV ── */}
      <nav className="fixed top-0 w-full z-[100] backdrop-blur-xl border-b border-slate-200/50 bg-white/70">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5 font-black text-xl text-slate-900 tracking-tighter">
            <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center">
              <Database size={16} className="text-amber-400" />
            </div>
            Admin<span className="text-amber-500">Hub</span>
          </div>

          {/* Tabs */}
          <div className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-2xl">
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id as any)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition-all ${
                  tab === t.id ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => { fetchStats(); fetchSales(); }}
              className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all" title="Refresh">
              <RefreshCw size={16} className={loadingStats || loadingSales ? "animate-spin" : ""} />
            </button>
            <button onClick={() => setAdminKey(null)}
              className="flex items-center gap-1.5 text-xs font-black text-slate-400 hover:text-red-500 hover:bg-red-50 px-3 py-2 rounded-xl transition-all">
              <LogOut size={14} /> Sign out
            </button>
            <Link href="/" className="text-xs font-black bg-slate-900 text-white px-4 py-2 rounded-xl hover:bg-slate-700 transition-all flex items-center gap-1.5">
              <ChevronLeft size={14} /> Store
            </Link>
          </div>
        </div>

        {/* Mobile tabs */}
        <div className="md:hidden flex gap-1 px-4 pb-3 overflow-x-auto">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id as any)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition-all flex-shrink-0 ${
                tab === t.id ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-500"
              }`}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </nav>

      <main className="pt-24 pb-20 px-6">
        <div className="max-w-7xl mx-auto">

          {/* ══════════════ OVERVIEW TAB ══════════════ */}
          {tab === "overview" && (
            <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Overview</h1>
                <p className="text-slate-400 font-medium text-sm mt-1">Live snapshot of your voucher business.</p>
              </div>

              {/* Stat cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Total Revenue" value={`₵${Number(totalRevenue).toLocaleString()}`} sub={`${totalSold} vouchers sold`}
                  icon={<CreditCard size={20} className="text-emerald-600" />} accent="bg-emerald-50" />
                <StatCard label="Total Sold" value={totalSold} sub="all time"
                  icon={<TrendingUp size={20} className="text-blue-600" />} accent="bg-blue-50" />
                <StatCard label="In Stock" value={totalAvail} sub={`of ${totalStock} total`}
                  icon={<Package size={20} className="text-amber-600" />} accent="bg-amber-50" />
                <StatCard label="Voucher Types" value={stockRows.length} sub="active categories"
                  icon={<Database size={20} className="text-violet-600" />} accent="bg-violet-50" />
              </div>

              {/* Stock breakdown */}
              <div className="glass rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                  <h2 className="font-black text-slate-900">Stock by Type</h2>
                  <button onClick={() => setTab("upload")}
                    className="text-xs font-black text-amber-600 hover:text-amber-700 flex items-center gap-1">
                    Add Vouchers <ArrowUpRight size={12} />
                  </button>
                </div>
                <div className="divide-y divide-slate-50">
                  {loadingStats ? (
                    Array(3).fill(0).map((_, i) => (
                      <div key={i} className="px-6 py-5 flex items-center gap-4 animate-pulse">
                        <div className="w-20 h-6 bg-slate-100 rounded-full" />
                        <div className="flex-1 h-2 bg-slate-100 rounded-full" />
                        <div className="w-16 h-4 bg-slate-100 rounded-full" />
                      </div>
                    ))
                  ) : stockRows.length === 0 ? (
                    <div className="px-6 py-12 text-center text-slate-400">
                      <Package size={32} className="mx-auto mb-3 opacity-30" />
                      <p className="font-bold text-sm">No vouchers in database yet.</p>
                    </div>
                  ) : (
                    stockRows.map((row: any) => {
                      const pct = row.total > 0 ? Math.round((row.available / row.total) * 100) : 0;
                      return (
                        <div key={row.type} className="px-6 py-5 flex items-center gap-4">
                          <span className={`text-[11px] font-black px-3 py-1 rounded-full border ${TYPE_STYLES[row.type] || "bg-slate-100 text-slate-600 border-slate-200"} flex-shrink-0 w-36 text-center`}>
                            {row.type}
                          </span>
                          <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div className={`h-full rounded-full transition-all ${pct < 20 ? "bg-red-500" : pct < 50 ? "bg-amber-500" : "bg-emerald-500"}`}
                              style={{ width: `${pct}%` }} />
                          </div>
                          <div className="text-right flex-shrink-0 w-28">
                            <span className="text-sm font-black text-slate-900">{row.available} left</span>
                            <span className="text-xs text-slate-400 font-medium"> / {row.total} total</span>
                          </div>
                          <span className="text-sm font-black text-emerald-600 flex-shrink-0 w-16 text-right">
                            {row.sold_count} sold
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Recent sales mini-table */}
              <div className="glass rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                  <h2 className="font-black text-slate-900">Recent Sales</h2>
                  <button onClick={() => setTab("sales")}
                    className="text-xs font-black text-amber-600 hover:text-amber-700 flex items-center gap-1">
                    View All <ArrowUpRight size={12} />
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50">
                      <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <th className="text-left px-6 py-3">Time</th>
                        <th className="text-left px-4 py-3">Type</th>
                        <th className="text-left px-4 py-3">Customer</th>
                        <th className="text-left px-4 py-3">Serial</th>
                        <th className="text-right px-6 py-3">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {sales.slice(0, 8).map((s, i) => (
                        <tr key={i} className="hover:bg-slate-50/60 transition-colors">
                          <td className="px-6 py-3 text-xs text-slate-500 font-medium whitespace-nowrap">{fmt(s.purchased_at)}</td>
                          <td className="px-4 py-3">
                            <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border ${TYPE_STYLES[s.type] || "bg-slate-100 text-slate-600 border-slate-200"}`}>
                              {s.type === "SCHOOLPLACEMENT" ? "PLACEMENT" : s.type}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <p className="font-bold text-slate-900 text-xs">{s.purchaser_name || "—"}</p>
                            <p className="text-[10px] text-slate-400">{s.purchaser_phone}</p>
                          </td>
                          <td className="px-4 py-3 font-mono text-xs text-slate-600">{s.serial_number}</td>
                          <td className="px-6 py-3 text-right font-black text-emerald-600 text-sm">₵25</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {sales.length === 0 && !loadingSales && (
                    <div className="py-12 text-center text-slate-400">
                      <Inbox size={32} className="mx-auto mb-3 opacity-30" />
                      <p className="font-bold text-sm">No sales yet.</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* ══════════════ UPLOAD TAB ══════════════ */}
          {tab === "upload" && (
            <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Upload Vouchers</h1>
                <p className="text-slate-400 font-medium text-sm mt-1">Add vouchers via CSV file or enter them one at a time.</p>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                {/* ── CSV Upload ── */}
                <div className="glass rounded-2xl overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-100">
                    <h2 className="font-black text-slate-900 flex items-center gap-2">
                      <FileText size={18} className="text-amber-500" /> CSV File Upload
                    </h2>
                    <p className="text-xs text-slate-400 font-medium mt-1">
                      Columns: <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono">serial_number, pin, type</code>. Header row is optional and will be skipped.
                    </p>
                  </div>

                  <div className="p-6 space-y-5">
                    {/* Drop zone */}
                    <div
                      onClick={() => fileRef.current?.click()}
                      onDragOver={e => e.preventDefault()}
                      onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleCSVFile(f); }}
                      className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                        csvFile ? "border-emerald-400 bg-emerald-50" : "border-slate-200 hover:border-amber-400 hover:bg-amber-50/30"
                      }`}
                    >
                      <input ref={fileRef} type="file" accept=".csv,.txt" className="hidden"
                        onChange={e => { const f = e.target.files?.[0]; if (f) handleCSVFile(f); }} />
                      {csvFile ? (
                        <>
                          <CheckCircle2 size={32} className="text-emerald-500 mx-auto mb-2" />
                          <p className="font-black text-slate-900 text-sm">{csvFile.name}</p>
                          <p className="text-xs text-emerald-600 font-bold mt-1">{csvPreview.length} valid vouchers parsed</p>
                        </>
                      ) : (
                        <>
                          <UploadCloud size={32} className="text-slate-300 mx-auto mb-2" />
                          <p className="font-black text-slate-600 text-sm">Drop CSV here or click to browse</p>
                          <p className="text-xs text-slate-400 font-medium mt-1">.csv or .txt files</p>
                        </>
                      )}
                    </div>

                    {/* Preview table */}
                    {csvPreview.length > 0 && (
                      <div className="border border-slate-100 rounded-xl overflow-hidden">
                        <div className="bg-slate-50 px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest flex gap-4">
                          <span className="flex-1">Serial</span><span className="w-20">PIN</span><span className="w-28">Type</span>
                        </div>
                        <div className="max-h-48 overflow-y-auto divide-y divide-slate-50">
                          {csvPreview.slice(0, 50).map((v, i) => (
                            <div key={i} className={`px-4 py-2.5 flex gap-4 text-xs ${
                              !VOUCHER_TYPES.includes(v.type) ? "bg-red-50" : i % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                            }`}>
                              <span className="flex-1 font-mono text-slate-700 truncate">{v.serial_number}</span>
                              <span className="w-20 font-mono text-slate-500">{v.pin}</span>
                              <span className={`w-28 font-black text-[10px] ${
                                !VOUCHER_TYPES.includes(v.type) ? "text-red-500" : "text-slate-700"
                              }`}>
                                {v.type || "INVALID"}
                              </span>
                            </div>
                          ))}
                          {csvPreview.length > 50 && (
                            <div className="px-4 py-2 text-xs text-slate-400 font-medium text-center">
                              + {csvPreview.length - 50} more rows
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-3">
                      {csvFile && (
                        <button onClick={() => { setCsvFile(null); setCsvPreview([]); if (fileRef.current) fileRef.current.value = ""; }}
                          className="flex items-center gap-1.5 px-4 py-3 bg-slate-100 text-slate-600 rounded-xl font-black text-sm hover:bg-slate-200 transition-all">
                          <X size={14} /> Clear
                        </button>
                      )}
                      <button onClick={uploadCSV} disabled={uploading || !csvPreview.length}
                        className="flex-1 btn-premium py-3.5 rounded-xl text-slate-900 font-black flex items-center justify-center gap-2 disabled:opacity-50 text-sm">
                        {uploading
                          ? <><RefreshCw size={15} className="animate-spin" /> Uploading {csvPreview.length} vouchers...</>
                          : <><UploadCloud size={15} /> Upload {csvPreview.length > 0 ? `${csvPreview.length} Vouchers` : "CSV"}</>
                        }
                      </button>
                    </div>

                    {/* Format guide */}
                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Example CSV format</p>
                      <pre className="text-xs font-mono text-slate-600 leading-relaxed">{`serial_number,pin,type
GH-BECE-001,123456,BECE
GH-WASSCE-001,234567,WASSCE
GH-PLACE-001,345678,SCHOOLPLACEMENT`}</pre>
                    </div>
                  </div>
                </div>

                {/* ── Manual Single Entry ── */}
                <div className="glass rounded-2xl overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-100">
                    <h2 className="font-black text-slate-900 flex items-center gap-2">
                      <Plus size={18} className="text-blue-500" /> Add Single Voucher
                    </h2>
                    <p className="text-xs text-slate-400 font-medium mt-1">Manually enter one voucher at a time.</p>
                  </div>

                  <div className="p-6 space-y-4">
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Voucher Type</label>
                      <div className="grid grid-cols-3 gap-2">
                        {VOUCHER_TYPES.map(t => (
                          <button key={t} onClick={() => setManualType(t)}
                            className={`py-3 px-2 rounded-xl text-xs font-black border-2 transition-all ${
                              manualType === t
                                ? `${TYPE_STYLES[t]} scale-[1.02] shadow-sm`
                                : "border-slate-100 text-slate-400 hover:border-slate-300"
                            }`}>
                            {t === "SCHOOLPLACEMENT" ? "PLACEMENT" : t}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Serial Number</label>
                      <input value={manualSerial} onChange={e => setManualSerial(e.target.value)}
                        placeholder="e.g. GH-BECE-2024-001"
                        className="w-full bg-slate-50 border-2 border-slate-100 p-3.5 rounded-xl font-mono text-sm outline-none focus:border-amber-400 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">PIN</label>
                      <input value={manualPin} onChange={e => setManualPin(e.target.value)}
                        placeholder="e.g. 123456"
                        className="w-full bg-slate-50 border-2 border-slate-100 p-3.5 rounded-xl font-mono text-sm outline-none focus:border-amber-400 transition-colors"
                      />
                    </div>

                    {/* Preview */}
                    {(manualSerial || manualPin) && (
                      <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Preview</p>
                        <div className="flex gap-3 text-xs font-mono">
                          <span className={`font-black text-[10px] px-2 py-0.5 rounded border ${TYPE_STYLES[manualType]}`}>{manualType}</span>
                          <span className="text-slate-700">{manualSerial || "—"}</span>
                          <span className="text-amber-600 font-black">{manualPin || "—"}</span>
                        </div>
                      </div>
                    )}

                    <button onClick={uploadManual} disabled={manualLoading || !manualSerial.trim() || !manualPin.trim()}
                      className="w-full btn-premium py-4 rounded-xl text-slate-900 font-black flex items-center justify-center gap-2 disabled:opacity-50 text-sm">
                      {manualLoading
                        ? <><RefreshCw size={15} className="animate-spin" /> Adding...</>
                        : <><Plus size={15} /> Add Voucher</>
                      }
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ══════════════ SALES TAB ══════════════ */}
          {tab === "sales" && (
            <motion.div key="sales" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h1 className="text-3xl font-black text-slate-900 tracking-tight">Sales History</h1>
                  <p className="text-slate-400 font-medium text-sm mt-1">
                    {filteredSales.length} records · ₵{(filteredSales.length * 25).toLocaleString()} revenue
                  </p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => fetchSales()}
                    className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 text-slate-600 rounded-xl font-black text-xs hover:bg-slate-200 transition-all">
                    <RefreshCw size={14} className={loadingSales ? "animate-spin" : ""} /> Refresh
                  </button>
                  <button onClick={exportSales} disabled={sales.length === 0}
                    className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 text-white rounded-xl font-black text-xs hover:bg-emerald-700 transition-all disabled:opacity-40">
                    <Download size={14} /> Export CSV
                  </button>
                </div>
              </div>

              {/* Filters */}
              <div className="flex gap-3 flex-wrap">
                <div className="relative flex-1 min-w-48">
                  <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input value={salesSearch} onChange={e => setSalesSearch(e.target.value)}
                    placeholder="Search name, phone, serial, reference..."
                    className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-amber-400 transition-colors"
                  />
                </div>
                <div className="flex gap-2">
                  {["ALL", ...VOUCHER_TYPES].map(t => (
                    <button key={t} onClick={() => setSalesTypeFilter(t)}
                      className={`px-3 py-2 rounded-xl text-xs font-black border-2 transition-all ${
                        salesTypeFilter === t
                          ? t === "ALL" ? "bg-slate-900 text-white border-slate-900" : `${TYPE_STYLES[t]} scale-[1.02]`
                          : "border-slate-200 text-slate-400 hover:border-slate-400 bg-white"
                      }`}>
                      {t === "SCHOOLPLACEMENT" ? "PLACEMENT" : t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Table */}
              <div className="glass rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 border-b border-slate-100">
                      <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <th className="text-left px-6 py-3">Date & Time</th>
                        <th className="text-left px-4 py-3">Type</th>
                        <th className="text-left px-4 py-3">Customer</th>
                        <th className="text-left px-4 py-3">Phone</th>
                        <th className="text-left px-4 py-3">Serial</th>
                        <th className="text-left px-4 py-3">Reference</th>
                        <th className="text-right px-6 py-3">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {loadingSales
                        ? Array(8).fill(0).map((_, i) => (
                          <tr key={i} className="animate-pulse">
                            {Array(7).fill(0).map((_, j) => (
                              <td key={j} className="px-4 py-4"><div className="h-3 bg-slate-100 rounded-full w-3/4" /></td>
                            ))}
                          </tr>
                        ))
                        : filteredSales.length === 0
                        ? (
                          <tr><td colSpan={7} className="py-16 text-center">
                            <Inbox size={36} className="mx-auto mb-3 text-slate-200" />
                            <p className="text-slate-400 font-bold text-sm">No sales found.</p>
                          </td></tr>
                        )
                        : filteredSales.map((s, i) => (
                          <tr key={s.id || i} className="hover:bg-slate-50/60 transition-colors">
                            <td className="px-6 py-3.5 text-xs text-slate-500 font-medium whitespace-nowrap">{fmt(s.purchased_at)}</td>
                            <td className="px-4 py-3.5">
                              <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border ${TYPE_STYLES[s.type] || "bg-slate-100 text-slate-600 border-slate-200"}`}>
                                {s.type === "SCHOOLPLACEMENT" ? "PLACEMENT" : s.type}
                              </span>
                            </td>
                            <td className="px-4 py-3.5 font-bold text-slate-900 text-xs">{s.purchaser_name || "—"}</td>
                            <td className="px-4 py-3.5 text-xs text-slate-500 font-mono">{s.purchaser_phone || "—"}</td>
                            <td className="px-4 py-3.5 font-mono text-xs text-slate-600">{s.serial_number}</td>
                            <td className="px-4 py-3.5 font-mono text-[10px] text-slate-400 max-w-[120px] truncate">{s.paystack_reference || "—"}</td>
                            <td className="px-6 py-3.5 text-right font-black text-emerald-600">₵25</td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* ══════════════ STOCK / INVENTORY TAB ══════════════ */}
          {tab === "stock" && (
            <motion.div key="stock" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-black text-slate-900 tracking-tight">Inventory</h1>
                  <p className="text-slate-400 font-medium text-sm mt-1">Stock levels across all voucher types.</p>
                </div>
                <button onClick={() => setTab("upload")}
                  className="btn-premium px-5 py-3 rounded-xl text-slate-900 font-black text-sm flex items-center gap-2">
                  <Plus size={15} /> Add Stock
                </button>
              </div>

              <div className="grid md:grid-cols-3 gap-5">
                {loadingStats
                  ? Array(3).fill(0).map((_, i) => (
                    <div key={i} className="glass rounded-2xl p-6 animate-pulse space-y-4">
                      <div className="h-6 bg-slate-100 rounded-full w-24" />
                      <div className="h-10 bg-slate-100 rounded-full w-16" />
                      <div className="h-2 bg-slate-100 rounded-full" />
                    </div>
                  ))
                  : stockRows.length === 0 ? (
                    <div className="col-span-3 py-16 text-center glass rounded-2xl">
                      <Package size={40} className="mx-auto mb-4 text-slate-200" />
                      <p className="text-slate-400 font-bold">No vouchers uploaded yet.</p>
                      <button onClick={() => setTab("upload")} className="mt-4 text-sm font-black text-amber-600 hover:underline">
                        Upload your first batch →
                      </button>
                    </div>
                  ) : stockRows.map((row: any) => {
                    const pct = row.total > 0 ? Math.round((row.available / row.total) * 100) : 0;
                    const isLow = pct < 20;
                    return (
                      <motion.div key={row.type} initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
                        className={`glass rounded-2xl p-6 ${isLow ? "ring-2 ring-red-300" : ""}`}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <span className={`text-[11px] font-black px-3 py-1.5 rounded-full border ${TYPE_STYLES[row.type] || "bg-slate-100 text-slate-600 border-slate-200"}`}>
                            {row.type === "SCHOOLPLACEMENT" ? "PLACEMENT" : row.type}
                          </span>
                          {isLow && (
                            <span className="text-[10px] font-black text-red-500 bg-red-50 border border-red-200 px-2 py-1 rounded-lg flex items-center gap-1">
                              <AlertCircle size={10} /> LOW STOCK
                            </span>
                          )}
                        </div>

                        <p className="text-4xl font-black text-slate-900 mb-1">{row.available}</p>
                        <p className="text-xs text-slate-400 font-medium mb-5">available out of {row.total} total</p>

                        <div className="bg-slate-100 rounded-full h-2.5 overflow-hidden mb-3">
                          <div className={`h-full rounded-full transition-all ${isLow ? "bg-red-500" : pct < 50 ? "bg-amber-500" : "bg-emerald-500"}`}
                            style={{ width: `${pct}%` }} />
                        </div>

                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-emerald-600">{row.sold_count} sold</span>
                          <span className="text-slate-400">{pct}% remaining</span>
                        </div>
                      </motion.div>
                    );
                  })
                }
              </div>

              {/* Daily revenue table */}
              {stats?.daily?.length > 0 && (
                <div className="glass rounded-2xl overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-100">
                    <h2 className="font-black text-slate-900">Daily Sales Breakdown</h2>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">Last 30 days</p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50">
                        <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          <th className="text-left px-6 py-3">Date</th>
                          <th className="text-left px-4 py-3">Type</th>
                          <th className="text-right px-4 py-3">Vouchers</th>
                          <th className="text-right px-6 py-3">Revenue</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {stats.daily.map((d: any, i: number) => (
                          <tr key={i} className="hover:bg-slate-50/60 transition-colors">
                            <td className="px-6 py-3 text-xs font-bold text-slate-700">{fmtDate(d.sale_date)}</td>
                            <td className="px-4 py-3">
                              <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border ${TYPE_STYLES[d.type] || "bg-slate-100 text-slate-600 border-slate-200"}`}>
                                {d.type === "SCHOOLPLACEMENT" ? "PLACEMENT" : d.type}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right font-black text-slate-900">{d.vouchers_sold}</td>
                            <td className="px-6 py-3 text-right font-black text-emerald-600">₵{Number(d.revenue_ghs).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </motion.div>
          )}

        </div>
      </main>
    </div>
  );
}
