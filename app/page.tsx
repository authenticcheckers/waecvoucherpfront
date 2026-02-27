"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, Zap, ArrowRight, Search, CheckCircle, Lock, 
  Star, Users, Clock, TrendingUp, Award, ChevronDown, Bell
} from "lucide-react";
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL || "https://waecevoucaherp.onrender.com";

// Voucher data with portal links
const VOUCHERS = [
  { 
    id: 'wassce', name: 'WASSCE', price: '25', 
    tag: 'Senior High School', 
    desc: 'West Africa Senior School Certificate',
    color: 'from-blue-500 to-blue-700',
    accent: 'blue',
    portal: 'https://www.waecgh.org/',
    icon: '🎓',
  },
  { 
    id: 'bece', name: 'BECE', price: '25', 
    tag: '🔥 Most Popular', 
    desc: 'Basic Education Certificate Exam',
    color: 'from-amber-500 to-orange-600',
    accent: 'amber',
    portal: 'https://www.waecgh.org/',
    icon: '📚',
    popular: true,
  },
  { 
    id: 'schoolplacement', name: 'Placement', price: '25', 
    tag: 'SHS Placement', 
    desc: 'School Placement & Selection System',
    color: 'from-violet-500 to-purple-700',
    accent: 'violet',
    portal: 'https://cssps.gov.gh/',
    icon: '🏫',
  },
];

// Simulated recent buyer notifications
const RECENT_BUYERS = [
  { name: "Kwame A.", location: "Accra", type: "BECE", ago: "2 min ago" },
  { name: "Abena M.", location: "Kumasi", type: "WASSCE", ago: "5 min ago" },
  { name: "Kofi B.", location: "Takoradi", type: "BECE", ago: "8 min ago" },
  { name: "Ama S.", location: "Tamale", type: "Placement", ago: "11 min ago" },
  { name: "Yaw O.", location: "Cape Coast", type: "WASSCE", ago: "14 min ago" },
  { name: "Efua K.", location: "Sunyani", type: "BECE", ago: "17 min ago" },
  { name: "Kojo A.", location: "Ho", type: "Placement", ago: "21 min ago" },
];

const TESTIMONIALS = [
  { name: "Mrs. Amoah", role: "Parent, Accra", text: "Got my son's BECE pin in under 2 minutes. No stress at all!", stars: 5 },
  { name: "Teacher Mensah", role: "JHS Teacher, Kumasi", text: "I buy 10+ vouchers every results season for my students. Always instant.", stars: 5 },
  { name: "Adwoa B.", role: "SHS Student", text: "Paid and got my WASSCE results checker immediately. Super easy!", stars: 5 },
];

function LiveNotification() {
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setExiting(true);
      setTimeout(() => {
        setCurrent(c => (c + 1) % RECENT_BUYERS.length);
        setExiting(false);
        setVisible(true);
      }, 500);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const buyer = RECENT_BUYERS[current];
  return (
    <div className={`fixed bottom-6 left-6 z-50 ${exiting ? 'toast-exit' : 'toast-enter'}`}>
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 flex items-center gap-3 max-w-xs">
        <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 font-black text-lg flex-shrink-0">
          {buyer.name[0]}
        </div>
        <div>
          <p className="text-xs font-black text-slate-900">{buyer.name} from {buyer.location}</p>
          <p className="text-xs text-slate-500">just bought a <span className="text-amber-600 font-bold">{buyer.type}</span> voucher</p>
          <p className="text-[10px] text-slate-400 mt-0.5">🕐 {buyer.ago}</p>
        </div>
      </div>
    </div>
  );
}

function CountdownTimer() {
  const [time, setTime] = useState({ h: 3, m: 47, s: 22 });
  useEffect(() => {
    const t = setInterval(() => {
      setTime(prev => {
        let { h, m, s } = prev;
        s--;
        if (s < 0) { s = 59; m--; }
        if (m < 0) { m = 59; h--; }
        if (h < 0) { h = 5; m = 59; s = 59; }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="flex items-center gap-1.5 text-xs font-black">
      {[
        { v: time.h, label: 'hr' },
        { v: time.m, label: 'min' },
        { v: time.s, label: 'sec' },
      ].map(({ v, label }, i) => (
        <React.Fragment key={label}>
          <div className="bg-slate-900 text-amber-400 px-2 py-1 rounded-lg min-w-[36px] text-center">
            {String(v).padStart(2, '0')}
            <div className="text-[8px] text-slate-500 font-bold">{label}</div>
          </div>
          {i < 2 && <span className="text-slate-400">:</span>}
        </React.Fragment>
      ))}
    </div>
  );
}

export default function Home() {
  const [serial, setSerial] = useState("");
  const [retrievedVoucher, setRetrievedVoucher] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [stock, setStock] = useState<any>({});
  const [soldToday] = useState(Math.floor(Math.random() * 30) + 85); // 85-115
  const buyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch stock info for scarcity indicators
    fetch(`${API}/api/voucher/stock`)
      .then(r => r.json())
      .then(setStock)
      .catch(() => {});
  }, []);

  const handleRetrieve = async () => {
    if (!serial) return;
    setError(""); setRetrievedVoucher(null); setLoading(true);
    try {
      const res = await fetch(`${API}/api/voucher/retrieve/${encodeURIComponent(serial)}`);
      if (!res.ok) throw new Error();
      setRetrievedVoucher(await res.json());
    } catch {
      setError("Voucher not found. Double-check your serial number.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-mesh min-h-screen">
      <LiveNotification />

      {/* ── NAV ── */}
      <nav className="fixed top-0 w-full z-[100] backdrop-blur-xl border-b border-slate-200/50 bg-white/70">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between py-4">
          <div className="flex items-center gap-2.5 font-black text-2xl text-slate-900 tracking-tighter">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg">
              <Zap size={20} fill="#fbbf24" className="text-amber-400" />
            </div>
            VoucherHub<span className="text-amber-500">GH</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
              <span className="w-2 h-2 bg-emerald-500 rounded-full pulse-green inline-block" />
              {soldToday} sold today
            </div>
            <Link href="/dashboard" className="text-sm font-bold bg-slate-100 px-5 py-2.5 rounded-xl hover:bg-slate-200 transition-all">
              Admin
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-28 pb-20 px-6">
        <div className="max-w-7xl mx-auto">

          {/* ── HERO ── */}
          <header className="text-center mb-8">
            <motion.div 
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-amber-200 shadow-md text-[11px] font-black uppercase tracking-widest text-amber-700 mb-8"
            >
              <ShieldCheck size={14} className="text-emerald-500" /> Official WAEC & CSSPS Authorized Distributor
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="text-6xl md:text-8xl font-black text-slate-900 tracking-tight leading-[0.9] mb-6"
            >
              Your Results,<br />
              <span className="text-gradient italic">Right Now.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
              className="text-slate-500 text-xl max-w-xl mx-auto font-medium leading-relaxed mb-10"
            >
              Ghana's fastest WAEC e-voucher platform. Get your WASSCE, BECE, or Placement checker in under <strong className="text-slate-900">60 seconds</strong>.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="flex flex-wrap items-center justify-center gap-4 mb-4"
            >
              <div className="flex items-center gap-1.5 text-sm font-bold text-slate-500">
                <CheckCircle size={16} className="text-emerald-500" /> Instant Delivery
              </div>
              <div className="w-1 h-1 bg-slate-300 rounded-full" />
              <div className="flex items-center gap-1.5 text-sm font-bold text-slate-500">
                <Lock size={16} className="text-blue-500" /> Secure Payment
              </div>
              <div className="w-1 h-1 bg-slate-300 rounded-full" />
              <div className="flex items-center gap-1.5 text-sm font-bold text-slate-500">
                <Award size={16} className="text-amber-500" /> 100% Authentic Vouchers
              </div>
            </motion.div>

            {/* Urgency Banner */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
              className="inline-flex items-center gap-3 bg-red-50 border border-red-200 px-5 py-3 rounded-2xl text-sm font-bold text-red-700 mt-4"
            >
              <Clock size={16} className="text-red-500 flex-shrink-0" />
              <span>Results season is LIVE — vouchers selling fast!</span>
              <CountdownTimer />
            </motion.div>
          </header>

          {/* ── VOUCHER CARDS ── */}
          <div ref={buyRef} id="buy" className="grid md:grid-cols-3 gap-6 mb-16 mt-12">
            {VOUCHERS.map((v, i) => {
              const availableCount = stock[v.id.toUpperCase()] || stock[v.name] || '—';
              const isLow = typeof availableCount === 'number' && availableCount < 20;
              return (
                <motion.div
                  key={v.id}
                  initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i + 0.5 }}
                >
                  <Link href={`/purchase/${v.id}`} className="group block h-full">
                    <div className={`glass card-hover p-8 rounded-[2.5rem] h-full flex flex-col relative overflow-hidden transition-all duration-500 ${v.popular ? 'ring-2 ring-amber-400 ring-offset-2' : ''}`}>
                      {/* Gradient orb */}
                      <div className={`absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br ${v.color} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity duration-500`} />
                      
                      {v.popular && (
                        <div className="absolute top-5 right-5 bg-amber-400 text-slate-900 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-wide shadow-lg">
                          🔥 Most Popular
                        </div>
                      )}

                      <div className="text-4xl mb-4">{v.icon}</div>
                      <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">{v.tag}</p>
                      <h3 className="text-3xl font-black text-slate-900 mb-2">{v.name}</h3>
                      <p className="text-sm text-slate-500 font-medium mb-6">{v.desc}</p>

                      {/* Scarcity indicator */}
                      {isLow && (
                        <div className="flex items-center gap-1.5 text-xs font-black text-red-500 bg-red-50 px-3 py-1.5 rounded-xl mb-4 border border-red-100">
                          <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                          Only {availableCount} left — grab yours!
                        </div>
                      )}

                      <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100">
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Price</p>
                          <span className="text-4xl font-black text-slate-900 tracking-tighter">₵{v.price}</span>
                        </div>
                        <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center group-hover:bg-amber-500 group-hover:scale-110 transition-all duration-300 shadow-lg">
                          <ArrowRight size={24} />
                        </div>
                      </div>

                      <p className="text-[11px] font-bold text-slate-400 mt-3 flex items-center gap-1">
                        <CheckCircle size={11} className="text-emerald-500" /> Delivered instantly after payment
                      </p>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* ── SOCIAL PROOF STRIP ── */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
            className="mb-16 overflow-hidden bg-slate-900 rounded-[2rem] py-6 px-4"
          >
            <div className="ticker-track flex gap-8 w-max">
              {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
                <div key={i} className="flex items-center gap-4 bg-white/5 px-6 py-4 rounded-2xl min-w-[300px]">
                  <div className="w-10 h-10 bg-amber-400 rounded-xl flex items-center justify-center font-black text-slate-900 flex-shrink-0">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="flex gap-0.5 mb-1">
                      {[...Array(t.stars)].map((_, si) => <Star key={si} size={10} fill="#fbbf24" className="text-amber-400" />)}
                    </div>
                    <p className="text-white text-xs font-bold">"{t.text}"</p>
                    <p className="text-slate-500 text-[10px] mt-0.5">{t.name} · {t.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── STATS ── */}
          <div className="grid grid-cols-3 gap-4 mb-16">
            {[
              { icon: <Users size={20} />, value: '12,000+', label: 'Students Served', color: 'text-blue-500' },
              { icon: <TrendingUp size={20} />, value: '99.9%', label: 'Success Rate', color: 'text-emerald-500' },
              { icon: <Clock size={20} />, value: '<60s', label: 'Avg Delivery', color: 'text-amber-500' },
            ].map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 * i + 1 }}
                className="glass p-6 rounded-2xl text-center">
                <div className={`${s.color} flex justify-center mb-2`}>{s.icon}</div>
                <p className="text-2xl font-black text-slate-900">{s.value}</p>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">{s.label}</p>
              </motion.div>
            ))}
          </div>

          {/* ── RETRIEVAL TOOL ── */}
          <section className="max-w-4xl mx-auto bg-slate-900 rounded-[3rem] p-12 md:p-16 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 blur-[100px] rounded-full -mr-20 -mt-20" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-500/10 blur-[80px] rounded-full -ml-10 -mb-10" />
            
            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-black text-amber-400 bg-amber-400/10 px-3 py-1.5 rounded-full mb-6">
                  <Search size={12} /> Voucher Recovery
                </div>
                <h2 className="text-3xl font-black mb-4 leading-tight">Lost your voucher details?</h2>
                <p className="text-slate-400 font-medium mb-8 text-sm leading-relaxed">
                  Enter your serial number to recover your PIN instantly. We store all purchases securely — you'll never lose your voucher.
                </p>
                <div className="flex flex-col gap-3 text-sm font-bold text-slate-400">
                  <div className="flex items-center gap-2"><CheckCircle size={15} className="text-emerald-400"/> Instant PIN recovery</div>
                  <div className="flex items-center gap-2"><Lock size={15} className="text-amber-400"/> Encrypted & secure</div>
                  <div className="flex items-center gap-2"><Clock size={15} className="text-blue-400"/> Available 24/7</div>
                </div>
              </div>
              <div className="glass bg-white/5 border-white/10 p-2 rounded-[2rem]">
                <div className="flex flex-col gap-3 p-4">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Serial Number</label>
                  <input 
                    value={serial} onChange={(e) => setSerial(e.target.value)} 
                    onKeyDown={(e) => e.key === 'Enter' && handleRetrieve()}
                    placeholder="e.g. GH-WAEC-123456" 
                    className="bg-white/10 text-white px-5 py-4 rounded-2xl outline-none font-bold placeholder:text-slate-600 border border-white/10 focus:border-amber-400/50 transition-colors" 
                  />
                  <button 
                    onClick={handleRetrieve} disabled={loading || !serial}
                    className="w-full btn-premium py-4 rounded-2xl text-slate-900 font-black flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? "Searching..." : "Retrieve My Voucher"} <Search size={18} />
                  </button>
                </div>
                {error && <p className="px-6 pb-4 text-red-400 text-center font-bold text-sm">{error}</p>}
                <AnimatePresence>
                  {retrievedVoucher && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="m-2 p-6 bg-white rounded-[1.5rem] text-slate-900"
                    >
                      <p className="text-[10px] font-black text-emerald-600 uppercase mb-2 flex items-center gap-1">
                        <CheckCircle size={12} /> Voucher Found
                      </p>
                      <p className="font-black text-2xl text-amber-600 tracking-tight">PIN: {retrievedVoucher.pin}</p>
                      <p className="text-xs font-bold text-slate-400 mt-1">Serial: {retrievedVoucher.serial_number}</p>
                      <p className="text-xs font-bold text-slate-400">Type: {retrievedVoucher.type}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </section>

        </div>
      </main>

      {/* ── FOOTER ── */}
      <footer className="border-t border-slate-200 bg-white/50 backdrop-blur-sm py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-black text-xl text-slate-900 tracking-tighter">
            <div className="w-8 h-8 bg-slate-900 rounded-xl flex items-center justify-center">
              <Zap size={16} fill="#fbbf24" className="text-amber-400" />
            </div>
            VoucherHubGH
          </div>
          <p className="text-xs text-slate-400 font-medium text-center">
            Authorized distributor of WAEC e-Vouchers & CSSPS Placement Checkers · Ghana<br/>
            Payments secured by Paystack · SSL encrypted
          </p>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
            <ShieldCheck size={14} className="text-emerald-500" /> Trusted & Verified
          </div>
        </div>
      </footer>
    </div>
  );
}
