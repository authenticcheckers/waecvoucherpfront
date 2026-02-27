"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck, Zap, ArrowRight, Search, CheckCircle, Lock,
  Clock, Award, ExternalLink, AlertTriangle, Phone, ChevronDown
} from "lucide-react";
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL || "https://waecevoucaherp.onrender.com";

const VOUCHERS = [
  {
    id: 'wassce', name: 'WASSCE', price: '25',
    tag: 'Senior High School',
    desc: 'West Africa Senior School Certificate',
    color: 'from-blue-500 to-blue-700',
    icon: '🎓',
  },
  {
    id: 'bece', name: 'BECE', price: '25',
    tag: 'High Demand',
    desc: 'Basic Education Certificate Exam',
    color: 'from-amber-500 to-orange-600',
    icon: '📚',
    popular: true,
  },
  {
    id: 'schoolplacement', name: 'Placement', price: '25',
    tag: 'SHS Placement',
    desc: 'School Placement & Selection System',
    color: 'from-violet-500 to-purple-700',
    icon: '🏫',
  },
];

const TRUST_POINTS = [
  {
    icon: <ShieldCheck size={22} className="text-emerald-500" />,
    title: "Direct from WAEC & CSSPS",
    body: "All vouchers are sourced directly from official WAEC Ghana and CSSPS distribution channels — the same ones used by schools.",
  },
  {
    icon: <Zap size={22} className="text-amber-500" />,
    title: "PIN shown on screen instantly",
    body: "Once your Paystack payment clears, your serial number and PIN appear immediately — no waiting, no SMS that may never arrive.",
  },
  {
    icon: <Lock size={22} className="text-blue-500" />,
    title: "Secured by Paystack",
    body: "Payments are handled entirely by Paystack. We never see or store your card or MoMo details.",
  },
  {
    icon: <Clock size={22} className="text-violet-500" />,
    title: "Recover your PIN anytime",
    body: "Closed the page too fast? Enter your MoMo number below to retrieve all vouchers purchased with that number — free, always.",
  },
];

function StockBadge({ type, stock }: { type: string; stock: Record<string, number> }) {
  const count = stock[type.toUpperCase()];
  if (count === undefined) return null;
  if (count === 0) return (
    <div className="text-xs font-black text-red-600 bg-red-50 border border-red-200 px-3 py-1.5 rounded-xl">
      Out of stock — check back soon
    </div>
  );
  if (count < 30) return (
    <div className="flex items-center gap-1.5 text-xs font-black text-orange-600 bg-orange-50 border border-orange-100 px-3 py-1.5 rounded-xl">
      <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse inline-block" />
      {count} remaining in stock
    </div>
  );
  return (
    <div className="flex items-center gap-1.5 text-xs font-black text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-xl">
      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block" />
      {count} available
    </div>
  );
}

export default function Home() {
  const [phone, setPhone] = useState("");
  const [retrievedVouchers, setRetrievedVouchers] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [stock, setStock] = useState<Record<string, number>>({});
  const [stockLoaded, setStockLoaded] = useState(false);

  useEffect(() => {
    fetch(`${API}/api/voucher/stock`)
      .then(r => r.json())
      .then(data => { setStock(data); setStockLoaded(true); })
      .catch(() => setStockLoaded(true));
  }, []);

  const handleRetrieve = async () => {
    const cleaned = phone.replace(/\s+/g, '');
    if (!cleaned) return;
    setError(""); setRetrievedVouchers([]); setLoading(true);
    try {
      const res = await fetch(`${API}/api/voucher/retrieve/phone/${encodeURIComponent(cleaned)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setRetrievedVouchers(Array.isArray(data) ? data : [data]);
    } catch (err: any) {
      setError(err.message || "No vouchers found for this number.");
    } finally {
      setLoading(false);
    }
  };

  const PORTALS = [
    { name: "WASSCE Results", url: "https://ghana.waecdirect.org/", icon: "🎓", label: "ghana.waecdirect.org" },
    { name: "BECE Results",   url: "https://ghana.waecdirect.org/", icon: "📚", label: "ghana.waecdirect.org" },
    { name: "SHS Placement",  url: "https://cssps.gov.gh/",         icon: "🏫", label: "cssps.gov.gh" },
  ];

  return (
    <div className="bg-mesh min-h-screen">

      {/* NAV */}
      <nav className="fixed top-0 w-full z-[100] backdrop-blur-xl border-b border-slate-200/50 bg-white/70">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5 font-black text-2xl text-slate-900 tracking-tighter">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg">
              <Zap size={20} fill="#fbbf24" className="text-amber-400" />
            </div>
            VoucherHub<span className="text-amber-500">GH</span>
          </div>
          <Link href="/dashboard" className="text-sm font-bold bg-slate-100 px-5 py-2.5 rounded-xl hover:bg-slate-200 transition-all">
            Admin
          </Link>
        </div>
      </nav>

      <main className="pt-28 pb-24 px-6">
        <div className="max-w-7xl mx-auto">

          {/* HERO */}
          <header className="text-center mb-16">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-amber-200 shadow-sm text-[11px] font-black uppercase tracking-widest text-amber-700 mb-8"
            >
              <ShieldCheck size={13} className="text-emerald-500" /> Authorized WAEC & CSSPS Distributor
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="text-6xl md:text-8xl font-black text-slate-900 tracking-tight leading-[0.9] mb-6"
            >
              Your Results,<br />
              <span className="text-gradient italic">Right Now.</span>
            </motion.h1>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
              className="text-slate-500 text-xl max-w-xl mx-auto font-medium leading-relaxed mb-10"
            >
              Buy your official WAEC or CSSPS e-voucher securely. Get your PIN instantly on screen after payment — no queues, no agents, no delays.
            </motion.p>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
              className="flex flex-wrap items-center justify-center gap-5 text-sm font-bold text-slate-500"
            >
              <span className="flex items-center gap-1.5"><CheckCircle size={15} className="text-emerald-500" /> Instant PIN on screen</span>
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              <span className="flex items-center gap-1.5"><Lock size={15} className="text-blue-500" /> Paystack secured</span>
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              <span className="flex items-center gap-1.5"><Award size={15} className="text-amber-500" /> 100% authentic vouchers</span>
            </motion.div>
          </header>

          {/* VOUCHER CARDS */}
          <div id="buy" className="grid md:grid-cols-3 gap-6 mb-20">
            {VOUCHERS.map((v, i) => (
              <motion.div key={v.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i + 0.4 }}>
                <Link href={`/purchase/${v.id}`} className="group block h-full">
                  <div className={`glass card-hover p-8 rounded-[2.5rem] h-full flex flex-col relative overflow-hidden transition-all duration-500 ${v.popular ? 'ring-2 ring-amber-400 ring-offset-2' : ''}`}>
                    <div className={`absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br ${v.color} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`} />
                    {v.popular && (
                      <div className="absolute top-5 right-5 bg-amber-400 text-slate-900 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-wide shadow-md">
                        High Demand
                      </div>
                    )}
                    <div className="text-4xl mb-4">{v.icon}</div>
                    <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">{v.tag}</p>
                    <h3 className="text-3xl font-black text-slate-900 mb-2">{v.name}</h3>
                    <p className="text-sm text-slate-500 font-medium mb-5">{v.desc}</p>
                    {stockLoaded && <div className="mb-4"><StockBadge type={v.id} stock={stock} /></div>}
                    <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Price</p>
                        <span className="text-4xl font-black text-slate-900 tracking-tighter">₵{v.price}</span>
                      </div>
                      <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center group-hover:bg-amber-500 group-hover:scale-110 transition-all duration-300 shadow-lg">
                        <ArrowRight size={24} />
                      </div>
                    </div>
                    <p className="text-[11px] font-bold text-slate-400 mt-3 flex items-center gap-1">
                      <CheckCircle size={11} className="text-emerald-500" /> PIN shown instantly after payment
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* WHY TRUST US */}
          <section className="mb-20">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-black text-slate-900">Why buy here?</h2>
              <p className="text-slate-500 font-medium mt-2">Simple, honest reasons.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              {TRUST_POINTS.map((p, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 + 0.6 }}
                  className="glass p-7 rounded-[2rem] flex gap-4"
                >
                  <div className="flex-shrink-0 w-11 h-11 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100">
                    {p.icon}
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 mb-1">{p.title}</h3>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed">{p.body}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* OFFICIAL PORTALS */}
          <section className="mb-20 bg-slate-900 rounded-[3rem] p-10 md:p-14 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 blur-[80px] rounded-full -mr-10 -mt-10" />
            <div className="relative z-10">
              <p className="text-xs font-black text-amber-400 uppercase tracking-widest mb-3">Official Portals</p>
              <h2 className="text-3xl font-black mb-2">Where to use your voucher</h2>
              <p className="text-slate-400 font-medium mb-10 text-sm">After purchase, go directly to the official portal for your exam type.</p>
              <div className="grid md:grid-cols-3 gap-4">
                {PORTALS.map((p, i) => (
                  <a key={i} href={p.url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-between bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-400/40 px-5 py-4 rounded-2xl transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{p.icon}</span>
                      <div>
                        <p className="font-black text-white text-sm">{p.name}</p>
                        <p className="text-xs text-slate-500">{p.label}</p>
                      </div>
                    </div>
                    <ExternalLink size={14} className="text-slate-600 group-hover:text-amber-400 transition-colors" />
                  </a>
                ))}
              </div>
            </div>
          </section>

          {/* LIVE STOCK (only renders when real data available) */}
          {stockLoaded && Object.keys(stock).length > 0 && (
            <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="mb-20 bg-amber-50 border-2 border-amber-200 rounded-[2.5rem] p-8 md:p-12"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <AlertTriangle size={22} className="text-amber-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-black text-slate-900 text-xl mb-1">Live stock levels</h3>
                  <p className="text-sm text-slate-500 font-medium mb-6">Vouchers are allocated in batches. When a type runs out, you'll need to wait for the next batch.</p>
                  <div className="flex flex-wrap gap-4">
                    {Object.entries(stock).map(([type, count]) => (
                      <div key={type} className={`px-5 py-3 rounded-2xl border-2 font-black text-sm ${
                        count === 0 ? 'bg-red-50 border-red-200 text-red-700' :
                        count < 20  ? 'bg-orange-50 border-orange-300 text-orange-700' :
                                      'bg-white border-emerald-200 text-emerald-700'
                      }`}>
                        {type}: {count === 0 ? 'Out of stock' : `${count} left`}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.section>
          )}

          {/* PHONE-BASED RETRIEVAL */}
          <section className="max-w-4xl mx-auto bg-slate-900 rounded-[3rem] p-12 md:p-16 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-72 h-72 bg-violet-500/10 blur-[80px] rounded-full -mr-10 -mt-10" />
            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-black text-amber-400 bg-amber-400/10 px-3 py-1.5 rounded-full mb-5">
                  <Phone size={12} /> Voucher Recovery
                </div>
                <h2 className="text-3xl font-black mb-4 leading-tight">Already bought? Recover your PIN.</h2>
                <p className="text-slate-400 font-medium text-sm mb-6 leading-relaxed">
                  Enter the MoMo number you used during purchase. We'll pull up every voucher linked to that number — PIN and serial — instantly.
                </p>
                <div className="flex flex-col gap-2.5 text-sm font-bold text-slate-400">
                  <div className="flex items-center gap-2"><CheckCircle size={14} className="text-emerald-400" /> Works 24/7, no charge</div>
                  <div className="flex items-center gap-2"><Lock size={14} className="text-blue-400" /> Only shows your own vouchers</div>
                </div>
              </div>

              <div className="glass bg-white/5 border-white/10 p-2 rounded-[2rem]">
                <div className="flex flex-col gap-3 p-4">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">MoMo Phone Number Used at Purchase</label>
                  <input
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleRetrieve()}
                    placeholder="024 XXXXXXX"
                    type="tel"
                    className="bg-white/10 text-white px-5 py-4 rounded-2xl outline-none font-bold placeholder:text-slate-600 border border-white/10 focus:border-amber-400/50 transition-colors"
                  />
                  <button onClick={handleRetrieve} disabled={loading || !phone.trim()}
                    className="w-full btn-premium py-4 rounded-2xl text-slate-900 font-black flex items-center justify-center gap-2 disabled:opacity-50">
                    {loading ? "Searching..." : "Retrieve My Vouchers"}
                    <Search size={18} />
                  </button>
                </div>

                {error && <p className="px-6 pb-4 text-red-400 text-center font-bold text-sm">{error}</p>}

                <AnimatePresence>
                  {retrievedVouchers.length > 0 && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="m-2 space-y-2"
                    >
                      {retrievedVouchers.map((v, i) => (
                        <div key={i} className="p-5 bg-white rounded-[1.5rem] text-slate-900">
                          <p className="text-[10px] font-black text-emerald-600 uppercase mb-1 flex items-center gap-1">
                            <CheckCircle size={11} /> {v.type} Voucher
                          </p>
                          <p className="font-black text-2xl text-amber-600 tracking-tight">PIN: {v.pin}</p>
                          <p className="text-xs font-bold text-slate-400 mt-0.5">Serial: {v.serial_number}</p>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </section>

        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white/60 backdrop-blur-sm py-8 px-6 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-black text-xl text-slate-900 tracking-tighter">
            <div className="w-8 h-8 bg-slate-900 rounded-xl flex items-center justify-center">
              <Zap size={16} fill="#fbbf24" className="text-amber-400" />
            </div>
            VoucherHubGH
          </div>
          <p className="text-xs text-slate-400 font-medium text-center">
            Authorized distributor · WAEC Ghana & CSSPS e-Vouchers<br />
            Payments secured by Paystack · All vouchers are 100% authentic
          </p>
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
            <ShieldCheck size={13} className="text-emerald-500" /> Verified Platform
          </div>
        </div>
      </footer>
    </div>
  );
}
