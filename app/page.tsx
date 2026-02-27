"use client";
import React, { useState } from 'react';
import { motion } from "framer-motion";
import { ShieldCheck, Zap, ArrowRight, Search, CheckCircle, Smartphone } from "lucide-react";
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL || "https://waecevoucherp.onrender.com";

export default function Home() {
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
      <nav className="fixed top-0 w-full z-[100] backdrop-blur-md border-b border-slate-200/50 bg-white/70">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 font-black text-xl text-slate-900 tracking-tighter">
            <div className="w-9 h-9 bg-amber-400 rounded-xl flex items-center justify-center shadow-lg shadow-amber-200">
              <Zap size={20} fill="currentColor" className="text-white" />
            </div>
            VoucherHub
          </div>
          <div className="flex items-center gap-6 text-sm font-bold">
            <Link href="/dashboard" className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-all">Admin</Link>
          </div>
        </div>
      </nav>

      <section className="pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest mb-6 border border-emerald-100"
          >
            <ShieldCheck size={14} /> Official WAEC Partner
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-[1000] text-slate-900 tracking-tight leading-[1.1] mb-8">
            Your Results, <span className="text-amber-500">Delivered Instantly.</span>
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto mb-10 font-medium">
            Fast, secure, and automatic delivery of all WAEC result checkers via SMS and Email.
          </p>
        </div>
      </section>

      <section id="buy" className="py-10 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
          {[
            { id: 'wassce', name: 'WASSCE', price: '25', desc: 'Result Checker Card' },
            { id: 'bece', name: 'BECE', price: '25', desc: 'Junior High Results', popular: true },
            { id: 'schoolplacement', name: 'Placement', price: '25', desc: 'CSSPS Placement' }
          ].map((v) => (
            <Link href={`/purchase/${v.id}`} key={v.id}>
              <motion.div whileHover={{ y: -5 }} className={`glass p-8 rounded-[2rem] border-2 transition-all cursor-pointer h-full flex flex-col ${v.popular ? 'border-amber-400' : 'border-transparent'}`}>
                {v.popular && <span className="text-[10px] font-black text-amber-600 uppercase mb-4">Most Popular</span>}
                <h3 className="text-2xl font-black text-slate-900 mb-1">{v.name}</h3>
                <p className="text-slate-500 text-sm mb-6 font-medium">{v.desc}</p>
                <div className="mt-auto pt-6 flex items-baseline justify-between">
                  <span className="text-3xl font-black text-slate-900">₵{v.price}</span>
                  <div className="w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center"><ArrowRight size={18} /></div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      <section className="py-24 px-6 bg-slate-900 text-white rounded-[4rem] mx-4 mb-20">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-black mb-4">Retrieve Lost Voucher</h2>
          <p className="text-slate-400 font-medium mb-10">Enter your serial number to recover your PIN instantly.</p>
          <div className="flex flex-col md:flex-row gap-3 p-2 bg-white/5 rounded-3xl border border-white/10">
            <input value={serial} onChange={(e)=>setSerial(e.target.value)} placeholder="Serial Number" className="flex-grow bg-transparent px-6 py-4 outline-none font-bold" />
            <button onClick={handleRetrieve} className="px-8 py-4 bg-amber-400 text-slate-900 rounded-2xl font-black hover:bg-amber-300 transition-all flex items-center justify-center gap-2">
              {loading ? "Searching..." : "Retrieve"} <Search size={18} />
            </button>
          </div>
          {error && <p className="mt-4 text-red-400 font-bold">{error}</p>}
          {retrievedVoucher && (
            <div className="mt-8 p-6 bg-white rounded-3xl text-slate-900 text-left flex justify-between items-center">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase">Success</p>
                <p className="font-black text-xl">PIN: <span className="text-amber-600">{retrievedVoucher.pin}</span></p>
              </div>
              <CheckCircle className="text-emerald-500" size={32} />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
