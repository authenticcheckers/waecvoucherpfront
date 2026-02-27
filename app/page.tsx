"use client";
import React, { useState } from 'react';
import { motion } from "framer-motion";
import { ShieldCheck, Zap, ArrowRight, Search, Download, CheckCircle, Lock, Smartphone } from "lucide-react";
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL || "https://waecevoucherp.onrender.com";

export default function Home() {
  // Retrieval State
  const [serial, setSerial] = useState("");
  const [retrievedVoucher, setRetrievedVoucher] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRetrieve = async () => {
    setError("");
    setRetrievedVoucher(null);
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/voucher/retrieve/${encodeURIComponent(serial)}`);
      if (!res.ok) throw new Error("Voucher not found");
      const data = await res.json();
      setRetrievedVoucher(data);
    } catch (err) {
      setError("Voucher not found. Please check your serial number.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-[100] backdrop-blur-md border-b border-slate-200/50 bg-white/70">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 font-black text-xl text-slate-900 tracking-tighter">
            <div className="w-9 h-9 bg-amber-400 rounded-xl flex items-center justify-center shadow-lg shadow-amber-200">
              <Zap size={20} fill="currentColor" className="text-white" />
            </div>
            VoucherHub
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-500">
            <a href="#buy" className="hover:text-amber-500 transition-colors">Buy Vouchers</a>
            <a href="#retrieve" className="hover:text-amber-500 transition-colors">Retrieve Lost</a>
            <Link href="/dashboard" className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-all">Admin</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section: Authority & Trust */}
      <section className="pt-40 pb-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest mb-6 border border-emerald-100"
          >
            <ShieldCheck size={14} /> Official WAEC Partner Platform
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-[1000] text-slate-900 tracking-tight leading-[1.1] mb-8"
          >
            Get Your Results <br /><span className="text-amber-500">Without The Wait.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-medium"
          >
            Instant SMS delivery for all WAEC vouchers. Trusted by over 10,000 students across Ghana for secure, official result checkers.
          </motion.p>
        </div>
      </section>

      {/* Purchase Grid: Anchoring & Selection */}
      <section id="buy" className="py-20 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
          {[
            { id: 'wassce', name: 'WASSCE', price: '25', desc: 'School & Private Candidates' },
            { id: 'bece', name: 'BECE', price: '25', desc: 'Junior High Results', popular: true },
            { id: 'placement', name: 'Placement', price: '25', desc: 'CSSPS School Placement' }
          ].map((v) => (
            <Link href={`/purchase/${v.id}`} key={v.id}>
              <motion.div whileHover={{ y: -5 }} className={`glass p-8 rounded-[2rem] border-2 transition-all cursor-pointer h-full flex flex-col ${v.popular ? 'border-amber-400' : 'border-transparent'}`}>
                {v.popular && <span className="text-[10px] font-black text-amber-600 uppercase mb-4">Most Requested</span>}
                <h3 className="text-2xl font-black text-slate-900 mb-1">{v.name}</h3>
                <p className="text-slate-500 text-sm mb-6 font-medium">{v.desc}</p>
                <div className="mt-auto pt-6 flex items-baseline justify-between">
                  <span className="text-3xl font-black text-slate-900">₵{v.price}</span>
                  <div className="w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center">
                    <ArrowRight size={18} />
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* Integrated Retrieval: Reducing Friction */}
      <section id="retrieve" className="py-24 px-6 bg-slate-900 text-white rounded-[4rem] mx-4 mb-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 blur-[100px] rounded-full" />
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-black mb-4">Lost your voucher?</h2>
          <p className="text-slate-400 font-medium mb-10 px-4">Don't pay twice. Enter your serial number below to retrieve your PIN and Serial instantly.</p>
          
          <div className="flex flex-col md:flex-row gap-3 p-2 bg-white/5 rounded-3xl border border-white/10">
            <input 
              value={serial} onChange={(e)=>setSerial(e.target.value)}
              placeholder="Enter Serial Number" 
              className="flex-grow bg-transparent px-6 py-4 outline-none font-bold text-white placeholder:text-slate-600"
            />
            <button 
              onClick={handleRetrieve} disabled={loading}
              className="px-8 py-4 bg-amber-400 text-slate-900 rounded-2xl font-black hover:bg-amber-300 transition-all flex items-center justify-center gap-2"
            >
              {loading ? "Searching..." : "Retrieve"} <Search size={18} />
            </button>
          </div>

          {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 text-red-400 font-bold">{error}</motion.p>}

          {retrievedVoucher && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mt-8 p-6 bg-white rounded-3xl text-slate-900 text-left flex justify-between items-center">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Voucher Found</p>
                <p className="font-black text-xl">PIN: <span className="text-amber-600">{retrievedVoucher.pin}</span></p>
                <p className="text-xs font-bold text-slate-500">Serial: {retrievedVoucher.serial_number}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                <CheckCircle size={24} />
              </div>
            </motion.div>
          )}
        </div>
      </section>

      <footer className="py-20 px-6 border-t border-slate-200 text-center">
         <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.3em]">© 2024 VoucherHub Ghana. Secure & Reliable.</p>
      </footer>
    </div>
  );
}
