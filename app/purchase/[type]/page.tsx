"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ShieldCheck, Lock, Smartphone, ChevronLeft, Zap, CreditCard } from "lucide-react";
import Link from "next/link";

export default function PurchasePage() {
  const params = useParams();
  const type = params.type as string;
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePurchase = async () => {
    if (!name || !phone) return;
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/voucher/purchase`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, type: type.toUpperCase() })
      });
      const data = await res.json();
      if (data.authorization_url) window.location.href = data.authorization_url;
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 bg-mesh">
      <Link href="/" className="mb-12 flex items-center gap-2 text-slate-500 font-bold hover:text-slate-900 transition-all group">
        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center group-hover:shadow-md transition-all">
          <ChevronLeft size={18} />
        </div>
        Return to Hub
      </Link>
      
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full glass p-12 rounded-[3.5rem] relative">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
             <Zap size={36} fill="currentColor" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Buy {type.toUpperCase()}</h1>
          <p className="text-slate-500 font-medium mt-2">Voucher Unit Price: <span className="text-slate-900 font-black">₵25.00</span></p>
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-4">Full Recipient Name</label>
            <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="E.g. Kofi Mensah" className="w-full bg-white border-2 border-slate-100 p-5 rounded-2xl outline-none focus:border-amber-400 font-bold transition-all" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-4">Phone Number (Momo)</label>
            <input value={phone} onChange={(e)=>setPhone(e.target.value)} placeholder="024 XXX XXXX" className="w-full bg-white border-2 border-slate-100 p-5 rounded-2xl outline-none focus:border-amber-400 font-bold transition-all" />
          </div>
          
          <div className="pt-6">
            <button onClick={handlePurchase} disabled={loading} className="w-full btn-premium py-6 rounded-2xl text-slate-900 font-black text-xl flex items-center justify-center gap-3">
              {loading ? "Creating Order..." : "Pay with Momo"} <CreditCard size={22} />
            </button>
          </div>
        </div>

        <div className="mt-10 pt-10 border-t border-slate-100 flex justify-center gap-6">
          <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase"><Lock size={14}/> Secure SSL</div>
          <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase"><Smartphone size={14}/> Paystack</div>
        </div>
      </motion.div>
    </div>
  );
}
