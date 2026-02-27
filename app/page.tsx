"use client";
import React, { useState } from 'react';
import { motion } from "framer-motion";
import { ShieldCheck, Zap, ArrowRight, Search, CheckCircle, Smartphone, Lock, HelpCircle } from "lucide-react";
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL || "https://waecevoucaherp.onrender.com";

export default function Home() {
  const [serial, setSerial] = useState("");
  const [retrievedVoucher, setRetrievedVoucher] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRetrieve = async () => {
    if (!serial) return;
    setError("");
    setRetrievedVoucher(null);
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/voucher/retrieve/${encodeURIComponent(serial)}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setRetrievedVoucher(data);
    } catch (err) {
      setError("Voucher not found. Double-check your serial.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-mesh min-h-screen">
      <nav className="fixed top-0 w-full z-[100] backdrop-blur-xl border-b border-slate-200/50 bg-white/60">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 font-black text-2xl text-slate-900 tracking-tighter">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
              <Zap size={22} fill="#fbbf24" className="text-amber-400" />
            </div>
            VoucherHub
          </div>
          <Link href="/dashboard" className="text-sm font-bold bg-slate-100 px-5 py-2.5 rounded-xl hover:bg-slate-200 transition-all">Admin</Link>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <header className="text-center mb-20">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm text-[10px] font-black uppercase tracking-widest text-slate-500 mb-8">
              <ShieldCheck size={14} className="text-emerald-500" /> Authorized WAEC Distributor
            </motion.div>
            <h1 className="text-6xl md:text-8xl font-[1000] text-slate-900 tracking-tight leading-[0.9] mb-8">
              Results <span className="text-amber-500 italic">Fast.</span><br />No Stress.
            </h1>
            <p className="text-slate-500 text-xl max-w-2xl mx-auto font-medium leading-relaxed">
              Ghana's most reliable platform for WASSCE, BECE, and Placement checkers. Delivered instantly via SMS.
            </p>
          </header>

          {/* Selection Grid */}
          <div id="buy" className="grid md:grid-cols-3 gap-8 mb-32">
            {[
              { id: 'wassce', name: 'WASSCE', price: '25', tag: 'Senior High' },
              { id: 'bece', name: 'BECE', price: '25', tag: 'Most Popular', popular: true },
              { id: 'schoolplacement', name: 'Placement', price: '25', tag: '2024/25 Session' }
            ].map((v) => (
              <Link href={`/purchase/${v.id}`} key={v.id} className="group">
                <motion.div whileHover={{ y: -8 }} className={`glass p-10 rounded-[3rem] h-full flex flex-col relative overflow-hidden transition-all ${v.popular ? 'ring-2 ring-amber-400' : 'hover:border-slate-300'}`}>
                  {v.popular && <div className="absolute top-6 right-6 bg-amber-400 text-slate-900 text-[10px] font-black px-3 py-1 rounded-full uppercase">Popular</div>}
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">{v.tag}</p>
                  <h3 className="text-3xl font-black text-slate-900 mb-6">{v.name}</h3>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-4xl font-black text-slate-900 tracking-tighter">₵{v.price}</span>
                    <div className="w-14 h-14 bg-slate-900 text-white rounded-[1.5rem] flex items-center justify-center group-hover:bg-amber-500 transition-colors">
                      <ArrowRight size={24} />
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>

          {/* Integrated Retrieval Tool */}
          <section className="max-w-4xl mx-auto bg-slate-900 rounded-[4rem] p-12 md:p-20 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 blur-[100px] rounded-full -mr-20 -mt-20" />
            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-black mb-6 leading-tight">Already bought a voucher?</h2>
                <p className="text-slate-400 font-medium mb-8">Enter your serial number to recover your details instantly. No need to pay twice if you lost your SMS.</p>
                <div className="flex flex-col gap-4 text-sm font-bold text-slate-500">
                  <div className="flex items-center gap-2"><CheckCircle size={16} className="text-emerald-500"/> Instant Recovery</div>
                  <div className="flex items-center gap-2"><Lock size={16} className="text-amber-500"/> Encrypted Storage</div>
                </div>
              </div>
              <div className="glass bg-white/5 border-white/10 p-2 rounded-[2.5rem]">
                <div className="flex flex-col gap-2 p-4">
                  <input value={serial} onChange={(e)=>setSerial(e.target.value)} placeholder="Enter Serial Number" className="bg-transparent text-white px-4 py-4 outline-none font-bold text-lg placeholder:text-slate-600" />
                  <button onClick={handleRetrieve} disabled={loading} className="w-full btn-premium py-5 rounded-3xl text-slate-900 font-black flex items-center justify-center gap-2">
                    {loading ? "Searching Database..." : "Retrieve Now"} <Search size={20} />
                  </button>
                </div>
                {error && <p className="p-4 text-red-400 text-center font-bold text-sm">{error}</p>}
                {retrievedVoucher && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="m-2 p-6 bg-white rounded-[2rem] text-slate-900">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Voucher Found</p>
                    <p className="font-black text-2xl text-amber-600 tracking-tight">PIN: {retrievedVoucher.pin}</p>
                    <p className="text-xs font-bold text-slate-400">Serial: {retrievedVoucher.serial_number}</p>
                  </motion.div>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
