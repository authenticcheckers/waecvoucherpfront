"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Lock, Smartphone, ChevronLeft, Zap, CreditCard, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function PurchasePage() {
  const params = useParams();
  const type = (params.type as string).toUpperCase();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const handlePurchase = async () => {
    if (!name || !phone) {
      setError("Please fill in all details.");
      return;
    }
    setError("");
    setLoading(true);
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/voucher/purchase`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name, 
          phone, 
          type,
          // Send the callback URL so your backend can pass it to Paystack!
          callbackUrl: `${origin}/success` 
        })
      });
      const data = await res.json();
      
      if (data.authorization_url) {
        window.location.href = data.authorization_url; // Redirects to Paystack
      } else {
        throw new Error(data.message || "Failed to initialize payment");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-mesh">
      <Link href="/" className="mb-12 flex items-center gap-2 text-slate-500 font-bold hover:text-slate-900 transition-all group">
        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center group-hover:shadow-md transition-all">
          <ChevronLeft size={18} />
        </div>
        Return to Hub
      </Link>
      
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full glass p-12 rounded-[3.5rem] relative shadow-xl">
        <div className="text-center mb-10">
          <motion.div 
            animate={{ rotate: [0, -10, 10, -10, 0] }} 
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-20 h-20 bg-amber-100 text-amber-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6"
          >
             <Zap size={36} fill="currentColor" />
          </motion.div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Buy {type}</h1>
          <p className="text-slate-500 font-medium mt-2">Voucher Unit Price: <span className="text-slate-900 font-black">₵25.00</span></p>
        </div>

        <div className="space-y-4">
          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="flex items-center gap-2 text-sm font-bold text-red-500 bg-red-50 p-4 rounded-2xl border border-red-100 mb-4">
                <AlertCircle size={18} /> {error}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-4 tracking-widest">Full Recipient Name</label>
            <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="E.g. Kofi Mensah" disabled={loading} className="w-full bg-white/60 border-2 border-slate-100 p-5 rounded-2xl outline-none focus:border-amber-400 font-bold transition-all disabled:opacity-50" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-4 tracking-widest">Phone Number (Momo)</label>
            <input value={phone} onChange={(e)=>setPhone(e.target.value)} placeholder="024 XXX XXXX" disabled={loading} className="w-full bg-white/60 border-2 border-slate-100 p-5 rounded-2xl outline-none focus:border-amber-400 font-bold transition-all disabled:opacity-50" />
          </div>
          
          <div className="pt-6">
            <motion.button 
              whileHover={!loading ? { scale: 1.02, y: -2 } : {}}
              whileTap={!loading ? { scale: 0.98 } : {}}
              onClick={handlePurchase} 
              disabled={loading} 
              className="w-full btn-premium py-6 rounded-2xl text-slate-900 font-black text-xl flex items-center justify-center gap-3 relative overflow-hidden"
            >
              {loading ? (
                <>
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-6 h-6 border-4 border-slate-900/20 border-t-slate-900 rounded-full" />
                  <span className="opacity-80">Connecting to Paystack...</span>
                </>
              ) : (
                <>Pay with Momo <CreditCard size={22} /></>
              )}
            </motion.button>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-slate-100/50 flex justify-center gap-8">
          <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase"><Lock size={14} className="text-emerald-500"/> Secure SSL</div>
          <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase"><Smartphone size={14} className="text-blue-500"/> Paystack</div>
        </div>
      </motion.div>
    </div>
  );
}
