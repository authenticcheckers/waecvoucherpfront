"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Zap, 
  UploadCloud, 
  RefreshCw, 
  Database, 
  ChevronLeft, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  CreditCard
} from "lucide-react";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_URL || "https://waecevoucaherp.onrender.com";

export default function Dashboard() {
  const [csv, setCsv] = useState("");
  const [sales, setSales] = useState<any[]>([]);
  const [msg, setMsg] = useState({ text: "", type: "" });
  const [uploading, setUploading] = useState(false);
  const [loadingSales, setLoadingSales] = useState(true);

  // Fetch sales on load
  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    setLoadingSales(true);
    try {
      const res = await fetch(`${API}/api/admin/sales`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setSales(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSales(false);
    }
  };

  const uploadVouchers = async () => {
    if (!csv.trim()) {
      setMsg({ text: "Please enter CSV data first.", type: "error" });
      return;
    }
    setUploading(true);
    setMsg({ text: "", type: "" });
    
    try {
      const rows = csv.split("\n").map(r => r.trim()).filter(Boolean).map(r => {
        const [serial_number, pin, type] = r.split(",").map(c => c?.trim());
        return { serial_number, pin, type };
      });
      
      const res = await fetch(`${API}/api/admin/upload`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vouchers: rows })
      });
      
      const data = await res.json();
      setMsg({ text: data.msg || "Vouchers securely uploaded.", type: "success" });
      setCsv("");
      fetchSales(); // Refresh table automatically
    } catch (err) {
      console.error(err);
      setMsg({ text: "Upload failed. Check format (serial,pin,type).", type: "error" });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-mesh min-h-screen flex flex-col">
      {/* Sleek Integrated Navbar */}
      <nav className="fixed top-0 w-full z-[100] backdrop-blur-xl border-b border-slate-200/50 bg-white/60">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 font-black text-2xl text-slate-900 tracking-tighter">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
              <Database size={20} className="text-amber-400" />
            </div>
            Admin<span className="text-slate-400">Hub</span>
          </div>
          <Link href="/" className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">
            <ChevronLeft size={16} /> Back to Store
          </Link>
        </div>
      </nav>

      <main className="flex-1 pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          
          <header className="mb-12">
            <h1 className="text-4xl md:text-5xl font-[1000] text-slate-900 tracking-tight leading-tight">
              System <span className="text-amber-500 italic">Overview.</span>
            </h1>
            <p className="text-slate-500 font-medium mt-2">Manage voucher inventory and track real-time sales.</p>
          </header>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column: Upload Panel */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="lg:col-span-1 space-y-6"
            >
              <div className="glass p-8 rounded-[2.5rem] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/10 blur-[50px] rounded-full -mr-10 -mt-10" />
                
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center">
                      <UploadCloud size={24} />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900">Bulk Upload</h2>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2 block">
                        CSV Format: serial,pin,type
                      </label>
                      <textarea 
                        value={csv} 
                        onChange={(e)=>setCsv(e.target.value)} 
                        rows={6} 
                        className="w-full bg-white/50 border-2 border-slate-200 p-5 rounded-3xl outline-none focus:border-amber-400 focus:bg-white font-mono text-sm transition-all resize-none placeholder:text-slate-300 shadow-inner" 
                        placeholder="12345,9876,WASSCE&#10;12346,9877,BECE"
                      />
                    </div>

                    <button 
                      onClick={uploadVouchers} 
                      disabled={uploading} 
                      className="w-full btn-premium py-5 rounded-2xl text-slate-900 font-black flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
                    >
                      {uploading ? "Encrypting & Uploading..." : "Upload Securely"} <Zap size={18} />
                    </button>

                    {/* Status Messages */}
                    {msg.text && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }} 
                        animate={{ opacity: 1, scale: 1 }} 
                        className={`p-4 rounded-2xl flex items-start gap-3 text-sm font-bold ${msg.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'}`}
                      >
                        {msg.type === 'success' ? <CheckCircle2 size={18} className="shrink-0 mt-0.5" /> : <AlertCircle size={18} className="shrink-0 mt-0.5" />}
                        {msg.text}
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Sales History */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.1 }}
              className="lg:col-span-2"
            >
              <div className="glass p-8 rounded-[2.5rem] h-full flex flex-col">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-slate-100 text-slate-900 rounded-2xl flex items-center justify-center">
                      <TrendingUp size={24} />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900">Recent Sales</h2>
                  </div>
                  <button 
                    onClick={fetchSales}
                    disabled={loadingSales}
                    className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors px-4 py-2 bg-slate-100 rounded-full hover:bg-slate-200"
                  >
                    <RefreshCw size={14} className={loadingSales ? "animate-spin" : ""} /> Refresh
                  </button>
                </div>

                <div className="flex-1 bg-white rounded-3xl border border-slate-100 overflow-hidden flex flex-col">
                  {/* Table Header */}
                  <div className="grid grid-cols-12 gap-4 p-5 bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <div className="col-span-3">Time</div>
                    <div className="col-span-2">Type</div>
                    <div className="col-span-3">Serial</div>
                    <div className="col-span-4">Customer</div>
                  </div>

                  {/* Table Body */}
                  <div className="overflow-y-auto max-h-[500px] flex-1 p-2">
                    {loadingSales ? (
                      // Skeleton Loaders
                      Array(5).fill(0).map((_, i) => (
                        <div key={i} className="grid grid-cols-12 gap-4 p-3 mb-2 animate-pulse items-center">
                          <div className="col-span-3 h-4 bg-slate-100 rounded-full w-3/4"></div>
                          <div className="col-span-2 h-6 bg-slate-100 rounded-full w-16"></div>
                          <div className="col-span-3 h-4 bg-slate-100 rounded-full w-full"></div>
                          <div className="col-span-4 flex items-center gap-2">
                            <div className="h-8 w-8 bg-slate-100 rounded-full"></div>
                            <div className="h-4 bg-slate-100 rounded-full w-1/2"></div>
                          </div>
                        </div>
                      ))
                    ) : sales.length === 0 ? (
                      // Empty State
                      <div className="flex flex-col items-center justify-center h-48 text-slate-400">
                        <CreditCard size={40} className="mb-4 opacity-20" />
                        <p className="font-bold text-sm">No sales recorded yet.</p>
                      </div>
                    ) : (
                      // Actual Data
                      sales.map((s, index) => (
                        <motion.div 
                          initial={{ opacity: 0 }} 
                          animate={{ opacity: 1 }} 
                          transition={{ delay: index * 0.05 }}
                          key={s.id || index} 
                          className="grid grid-cols-12 gap-4 p-3 items-center hover:bg-slate-50 rounded-2xl transition-colors mb-1"
                        >
                          <div className="col-span-3 text-xs font-bold text-slate-500">
                            {new Date(s.purchased_at).toLocaleString('en-GB', { 
                              day: '2-digit', month: 'short', hour: '2-digit', minute:'2-digit' 
                            })}
                          </div>
                          <div className="col-span-2">
                            <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${
                              s.type === 'WASSCE' ? 'bg-amber-100 text-amber-700' : 
                              s.type === 'BECE' ? 'bg-blue-100 text-blue-700' : 
                              'bg-purple-100 text-purple-700'
                            }`}>
                              {s.type}
                            </span>
                          </div>
                          <div className="col-span-3 font-mono text-xs font-bold text-slate-700">
                            {s.serial_number}
                          </div>
                          <div className="col-span-4 text-xs font-bold text-slate-900 truncate flex flex-col">
                            <span>{s.purchaser_name}</span>
                            <span className="text-[10px] text-slate-400 font-medium">{s.purchaser_phone}</span>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
