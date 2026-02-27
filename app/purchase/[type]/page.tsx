"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Lock, Smartphone, ChevronLeft, Zap, CreditCard, AlertCircle, CheckCircle, Star, Clock, Users } from "lucide-react";
import Link from "next/link";

const VOUCHER_INFO: Record<string, {
  name: string; desc: string; icon: string; color: string; bgColor: string;
  portal: string; perks: string[]; totalBuyers: number;
}> = {
  WASSCE: {
    name: "WASSCE Checker",
    desc: "West Africa Senior School Certificate Examination",
    icon: "🎓",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    portal: "https://www.waecgh.org/",
    perks: ["Instant PIN delivery", "Check results anytime", "Valid for 2024/25 season", "Official WAEC portal access"],
    totalBuyers: 4821,
  },
  BECE: {
    name: "BECE Checker",
    desc: "Basic Education Certificate Examination",
    icon: "📚",
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    portal: "https://www.waecgh.org/",
    perks: ["Instant PIN delivery", "JHS result access", "Valid for 2024/25 season", "Official WAEC portal access"],
    totalBuyers: 7234,
  },
  SCHOOLPLACEMENT: {
    name: "Placement Checker",
    desc: "SHS School Placement & Selection System",
    icon: "🏫",
    color: "text-violet-600",
    bgColor: "bg-violet-50",
    portal: "https://cssps.gov.gh/",
    perks: ["Instant PIN delivery", "Check SHS placement", "Valid for 2024/25 season", "CSSPS portal access"],
    totalBuyers: 3102,
  },
};

export default function PurchasePage() {
  const params = useParams();
  const type = (params.type as string).toUpperCase();
  const info = VOUCHER_INFO[type] || VOUCHER_INFO['BECE'];

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [origin, setOrigin] = useState("");
  const [viewingCount] = useState(Math.floor(Math.random() * 12) + 5);

  useEffect(() => { setOrigin(window.location.origin); }, []);

  const handlePurchase = async () => {
    if (!name.trim() || !phone.trim()) {
      setError("Please fill in your name and phone number.");
      return;
    }
    if (phone.replace(/\D/g, '').length < 10) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }
    setError(""); setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/voucher/purchase`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), phone: phone.trim(), type })
      });
      const data = await res.json();

      if (data.authorization_url) {
        window.location.href = data.authorization_url;
      } else {
        throw new Error(data.message || "Payment initialization failed.");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-mesh flex flex-col items-center justify-center p-6 py-16">
      <div className="w-full max-w-5xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-500 font-bold hover:text-slate-900 transition-all mb-10 group">
          <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center group-hover:border-slate-400 transition-all shadow-sm">
            <ChevronLeft size={16} />
          </div>
          Back to Hub
        </Link>

        <div className="grid md:grid-cols-5 gap-8">
          
          {/* ── LEFT: Info Panel ── */}
          <div className="md:col-span-2 space-y-6">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              className="glass p-8 rounded-[2.5rem]"
            >
              <div className="text-5xl mb-4">{info.icon}</div>
              <h2 className="text-2xl font-black text-slate-900 mb-1">{info.name}</h2>
              <p className="text-sm text-slate-500 font-medium mb-6">{info.desc}</p>
              
              <div className="space-y-3 mb-6">
                {info.perks.map((perk, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm font-bold text-slate-700">
                    <CheckCircle size={16} className="text-emerald-500 flex-shrink-0" />
                    {perk}
                  </div>
                ))}
              </div>

              <div className="pt-5 border-t border-slate-100">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-bold text-slate-500">Total price</span>
                  <span className="text-3xl font-black text-slate-900">₵25.00</span>
                </div>
              </div>
            </motion.div>

            {/* Social proof */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
              className="glass p-6 rounded-[2rem] space-y-4"
            >
              <div className="flex items-center gap-2 text-sm font-black text-slate-700">
                <Users size={16} className="text-blue-500" />
                <span>{info.totalBuyers.toLocaleString()} students bought this</span>
              </div>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="#fbbf24" className="text-amber-400" />)}
                <span className="text-xs font-bold text-slate-500 ml-2">4.9/5 rating</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-orange-600 bg-orange-50 px-3 py-2 rounded-xl border border-orange-100">
                <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse inline-block" />
                {viewingCount} people viewing this right now
              </div>
            </motion.div>

            {/* Trust badges */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
              className="grid grid-cols-2 gap-3"
            >
              {[
                { icon: <Lock size={16} className="text-emerald-500" />, label: "SSL Encrypted" },
                { icon: <ShieldCheck size={16} className="text-blue-500" />, label: "Verified Platform" },
                { icon: <Zap size={16} className="text-amber-500" />, label: "Instant Delivery" },
                { icon: <Clock size={16} className="text-violet-500" />, label: "24/7 Support" },
              ].map((b, i) => (
                <div key={i} className="glass p-3 rounded-2xl flex items-center gap-2 text-[11px] font-black text-slate-600">
                  {b.icon} {b.label}
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── RIGHT: Payment Form ── */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="md:col-span-3 glass p-10 rounded-[2.5rem] shadow-2xl"
          >
            <div className="mb-8">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-1">Complete Your Order</h1>
              <p className="text-slate-500 font-medium">Enter your details to proceed to secure payment</p>
            </div>

            <div className="space-y-5">
              <AnimatePresence>
                {error && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                    className="flex items-start gap-2.5 text-sm font-bold text-red-600 bg-red-50 p-4 rounded-2xl border border-red-100"
                  >
                    <AlertCircle size={18} className="flex-shrink-0 mt-0.5" /> {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Full Name (Recipient)</label>
                <input 
                  value={name} onChange={(e) => setName(e.target.value)} 
                  placeholder="e.g. Kofi Mensah"
                  disabled={loading}
                  className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl outline-none focus:border-amber-400 font-bold transition-all placeholder:font-medium placeholder:text-slate-300 disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Mobile Money Number</label>
                <input 
                  value={phone} onChange={(e) => setPhone(e.target.value)} 
                  placeholder="024 XXXXXXX"
                  type="tel"
                  disabled={loading}
                  className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl outline-none focus:border-amber-400 font-bold transition-all placeholder:font-medium placeholder:text-slate-300 disabled:opacity-50"
                />
                <p className="text-xs text-slate-400 font-medium mt-2 ml-1">This is for Momo payment only — we don't store it beyond what's needed</p>
              </div>

              {/* Order Summary */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 space-y-2">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Order Summary</p>
                <div className="flex justify-between text-sm font-bold text-slate-700">
                  <span>{info.name}</span>
                  <span>₵25.00</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-emerald-600">
                  <span>Processing fee</span>
                  <span>Free</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between font-black text-slate-900">
                  <span>Total</span>
                  <span>₵25.00</span>
                </div>
              </div>

              <motion.button
                whileHover={!loading ? { scale: 1.02, y: -2 } : {}}
                whileTap={!loading ? { scale: 0.98 } : {}}
                onClick={handlePurchase}
                disabled={loading}
                className="w-full btn-premium py-5 rounded-2xl text-slate-900 font-black text-lg flex items-center justify-center gap-3 disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      className="w-5 h-5 border-3 border-slate-900/20 border-t-slate-900 rounded-full border-[3px]"
                    />
                    Connecting to Paystack...
                  </>
                ) : (
                  <>
                    <CreditCard size={20} /> Pay ₵25.00 with Momo
                  </>
                )}
              </motion.button>

              <p className="text-center text-xs text-slate-400 font-medium flex items-center justify-center gap-1.5">
                <Lock size={11} /> You'll be redirected to Paystack's secure payment page
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
