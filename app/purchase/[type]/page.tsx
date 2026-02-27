"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ShieldCheck, Lock, Smartphone, ChevronLeft, Zap } from "lucide-react";
import Link from "next/link";

export default function PurchasePage() {
  const params = useParams();
  const type = params.type as string;
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePurchase = async () => {
    if (!name || !phone) return setError("Please fill in your details.");
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://waecevoucherp.onrender.com"}/api/voucher/purchase`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, type: type.toUpperCase() })
      });
      const data = await res.json();
      if (data.authorization_url) window.location.href = data.authorization_url;
      else setError("Service error. Try again later.");
    } catch (err) {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <Link href="/" className="mb-8 flex items-center gap-2 text-slate-500 font-bold hover:text-slate-900">
        <ChevronLeft size={20} /> Back to Hub
      </Link>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full glass p-10 rounded-[3rem]">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-3xl flex items-center justify-center mx-auto mb-4">
             <Zap size={32} fill="currentColor" />
          </div>
          <h1 className="text-3xl font-black text-slate-900">Buy {type.toUpperCase()}</h1>
          <p className="text-slate-500 font-medium">Official Result Checker (₵25)</p>
        </div>
        <div className="space-y-4">
          <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Full Name" className="w-full bg-white border border-slate-200 p-5 rounded-2xl outline-none focus:ring-2 focus:ring-amber-400 font-bold transition-all" />
          <input value={phone} onChange={(e)=>setPhone(e.target.value)} placeholder="Phone Number" className="w-full bg-white border border-slate-200 p-5 rounded-2xl outline-none focus:ring-2 focus:ring-amber-400 font-bold transition-all" />
          <button onClick={handlePurchase} disabled={loading} className="w-full btn-premium py-5 rounded-2xl text-slate-900 font-black text-lg disabled:opacity-50">
            {loading ? "Processing..." : "Pay with Paystack"}
          </button>
          {error && <p className="text-center text-red-500 text-sm font-bold">{error}</p>}
        </div>
      </motion.div>
    </div>
  );
}
