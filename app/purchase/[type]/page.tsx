"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Lock, ChevronLeft, Zap, CreditCard, AlertCircle, CheckCircle } from "lucide-react";
import Link from "next/link";

const VOUCHER_INFO: Record<string, {
  name: string; desc: string; icon: string;
  portal: string; portalLabel: string; perks: string[];
}> = {
  WASSCE: {
    name: "WASSCE Checker",
    desc: "West Africa Senior School Certificate Examination",
    icon: "🎓",
    portal: "https://ghana.waecdirect.org/",
    portalLabel: "ghana.waecdirect.org",
    perks: [
      "PIN shown on screen immediately after payment",
      "Valid for the current WASSCE results season",
      "Use on the official WAEC Ghana result checker",
      "Recoverable anytime via your MoMo number",
    ],
  },
  BECE: {
    name: "BECE Checker",
    desc: "Basic Education Certificate Examination",
    icon: "📚",
    portal: "https://ghana.waecdirect.org/",
    portalLabel: "ghana.waecdirect.org",
    perks: [
      "PIN shown on screen immediately after payment",
      "Valid for the current BECE results season",
      "Use on the official WAEC Ghana result checker",
      "Recoverable anytime via your MoMo number",
    ],
  },
  SCHOOLPLACEMENT: {
    name: "Placement Checker",
    desc: "SHS School Placement & Selection System",
    icon: "🏫",
    portal: "https://cssps.gov.gh/",
    portalLabel: "cssps.gov.gh",
    perks: [
      "PIN shown on screen immediately after payment",
      "Valid for the current placement season",
      "Use on the official CSSPS portal",
      "Recoverable anytime via your MoMo number",
    ],
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

  const handlePurchase = async () => {
    if (!name.trim() || !phone.trim()) {
      setError("Please fill in your name and phone number.");
      return;
    }
    if (phone.replace(/\D/g, '').length < 10) {
      setError("Please enter a valid 10-digit MoMo number.");
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
          <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center group-hover:border-slate-400 shadow-sm transition-all">
            <ChevronLeft size={16} />
          </div>
          Back to Hub
        </Link>

        <div className="grid md:grid-cols-5 gap-8">

          {/* LEFT: Voucher info */}
          <div className="md:col-span-2 space-y-5">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              className="glass p-8 rounded-[2.5rem]"
            >
              <div className="text-5xl mb-4">{info.icon}</div>
              <h2 className="text-2xl font-black text-slate-900 mb-1">{info.name}</h2>
              <p className="text-sm text-slate-500 font-medium mb-6">{info.desc}</p>

              <div className="space-y-3 mb-6">
                {info.perks.map((perk, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-sm font-bold text-slate-700">
                    <CheckCircle size={15} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                    {perk}
                  </div>
                ))}
              </div>

              <div className="pt-5 border-t border-slate-100 flex items-center justify-between">
                <span className="font-bold text-slate-500 text-sm">Price</span>
                <span className="text-3xl font-black text-slate-900">₵25.00</span>
              </div>
            </motion.div>

            {/* Where to use it */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
              className="glass p-6 rounded-[2rem]"
            >
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">After purchase, go to</p>
              <a href={info.portal} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm font-black text-slate-900 hover:text-amber-600 transition-colors"
              >
                <span className="text-2xl">{info.icon}</span>
                <div>
                  <p>{info.name.replace(" Checker", "")} Official Portal</p>
                  <p className="text-xs font-bold text-slate-400">{info.portalLabel}</p>
                </div>
              </a>
            </motion.div>

            {/* Trust badges */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}
              className="grid grid-cols-2 gap-3"
            >
              {[
                { icon: <Lock size={15} className="text-emerald-500" />, label: "SSL Encrypted" },
                { icon: <ShieldCheck size={15} className="text-blue-500" />, label: "Paystack Secured" },
                { icon: <Zap size={15} className="text-amber-500" />, label: "Instant Delivery" },
                { icon: <CheckCircle size={15} className="text-violet-500" />, label: "100% Authentic" },
              ].map((b, i) => (
                <div key={i} className="glass p-3 rounded-2xl flex items-center gap-2 text-[11px] font-black text-slate-600">
                  {b.icon} {b.label}
                </div>
              ))}
            </motion.div>
          </div>

          {/* RIGHT: Payment form */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="md:col-span-3 glass p-10 rounded-[2.5rem] shadow-2xl"
          >
            <div className="mb-8">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-1">Complete Your Order</h1>
              <p className="text-slate-500 font-medium text-sm">Your MoMo number is also used to recover your voucher later if needed.</p>
            </div>

            <div className="space-y-5">
              <AnimatePresence>
                {error && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                    className="flex items-start gap-2.5 text-sm font-bold text-red-600 bg-red-50 p-4 rounded-2xl border border-red-100"
                  >
                    <AlertCircle size={17} className="flex-shrink-0 mt-0.5" /> {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Full Name (Recipient)</label>
                <input
                  value={name} onChange={e => setName(e.target.value)}
                  placeholder="e.g. Kofi Mensah"
                  disabled={loading}
                  className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl outline-none focus:border-amber-400 font-bold transition-all placeholder:font-medium placeholder:text-slate-300 disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">MoMo Phone Number</label>
                <input
                  value={phone} onChange={e => setPhone(e.target.value)}
                  placeholder="024 XXXXXXX"
                  type="tel"
                  disabled={loading}
                  className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl outline-none focus:border-amber-400 font-bold transition-all placeholder:font-medium placeholder:text-slate-300 disabled:opacity-50"
                />
                <p className="text-xs text-slate-400 font-medium mt-2 ml-1">
                  ⚠️ Use this same number to recover your PIN later if you lose it
                </p>
              </div>

              {/* Order summary */}
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
                      className="w-5 h-5 border-[3px] border-slate-900/20 border-t-slate-900 rounded-full"
                    />
                    Connecting to Paystack...
                  </>
                ) : (
                  <><CreditCard size={20} /> Pay ₵25.00 with Momo</>
                )}
              </motion.button>

              <p className="text-center text-xs text-slate-400 font-medium flex items-center justify-center gap-1.5">
                <Lock size={11} /> You'll be redirected to Paystack's secure page
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
