"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck, Lock, ChevronLeft, Zap, CreditCard,
  AlertCircle, CheckCircle, ExternalLink, Minus, Plus
} from "lucide-react";
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

const MAX_QTY = 10;
const UNIT_PRICE = 25;

export default function PurchasePage() {
  const params  = useParams();
  const type    = (params.type as string).toUpperCase();
  const info    = VOUCHER_INFO[type] || VOUCHER_INFO["BECE"];

  const [name, setName]       = useState("");
  const [phone, setPhone]     = useState("");
  const [qty, setQty]         = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const total = qty * UNIT_PRICE;

  const changeQty = (delta: number) => {
    setQty(q => Math.min(MAX_QTY, Math.max(1, q + delta)));
    setError("");
  };

  const handlePurchase = async () => {
    if (!name.trim() || !phone.trim()) {
      setError("Please fill in your name and phone number.");
      return;
    }
    if (phone.replace(/\D/g, "").length < 10) {
      setError("Please enter a valid 10-digit MoMo number.");
      return;
    }
    setError(""); setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/voucher/purchase`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), phone: phone.trim(), type, qty }),
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
    <div className="min-h-screen bg-mesh">
      {/* sticky top bar */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-4 py-3 flex items-center gap-3">
        <Link href="/"
          className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors flex-shrink-0">
          <ChevronLeft size={18} className="text-slate-600" />
        </Link>
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-2xl leading-none">{info.icon}</span>
          <div className="min-w-0">
            <p className="font-black text-slate-900 text-sm leading-tight truncate">{info.name}</p>
            <p className="text-[11px] text-slate-400 font-medium truncate hidden sm:block">{info.desc}</p>
          </div>
        </div>
        <div className="flex-shrink-0 text-right">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total</p>
          <p className="font-black text-slate-900 text-lg leading-tight">₵{total}</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 md:py-12">
        <div className="flex flex-col md:grid md:grid-cols-5 gap-6 md:gap-8">

          {/* ── FORM (first on mobile) ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="order-first md:order-last md:col-span-3 glass rounded-3xl md:rounded-[2.5rem] p-6 md:p-10 shadow-xl"
          >
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mb-1">
                Complete Your Order
              </h1>
              <p className="text-slate-500 font-medium text-sm">
                Your MoMo number doubles as your voucher recovery key.
              </p>
            </div>

            <div className="space-y-4">
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-start gap-2.5 text-sm font-bold text-red-600 bg-red-50 p-4 rounded-2xl border border-red-100"
                  >
                    <AlertCircle size={17} className="flex-shrink-0 mt-0.5" /> {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Name */}
              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
                  Full Name (Recipient)
                </label>
                <input
                  value={name} onChange={e => setName(e.target.value)}
                  placeholder="e.g. Kofi Mensah"
                  disabled={loading}
                  className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl outline-none focus:border-amber-400 font-bold transition-all placeholder:font-medium placeholder:text-slate-300 disabled:opacity-50 text-base"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
                  MoMo Phone Number
                </label>
                <input
                  value={phone} onChange={e => setPhone(e.target.value)}
                  placeholder="024 XXXXXXX"
                  type="tel" inputMode="numeric"
                  disabled={loading}
                  className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl outline-none focus:border-amber-400 font-bold transition-all placeholder:font-medium placeholder:text-slate-300 disabled:opacity-50 text-base"
                />
                <p className="text-xs text-slate-400 font-medium mt-2 ml-1">
                  ⚠️ Use this same number to recover your PINs if you lose them
                </p>
              </div>

              {/* ── Quantity selector ── */}
              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
                  Number of Vouchers
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3 bg-slate-50 border-2 border-slate-100 rounded-2xl p-2 flex-shrink-0">
                    <button
                      onClick={() => changeQty(-1)}
                      disabled={qty <= 1 || loading}
                      className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center hover:border-amber-400 hover:text-amber-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all font-black"
                    >
                      <Minus size={16} />
                    </button>

                    <motion.span
                      key={qty}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-3xl font-black text-slate-900 w-10 text-center tabular-nums"
                    >
                      {qty}
                    </motion.span>

                    <button
                      onClick={() => changeQty(1)}
                      disabled={qty >= MAX_QTY || loading}
                      className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center hover:border-amber-400 hover:text-amber-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all font-black"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  {/* Quick-pick buttons */}
                  <div className="flex gap-2 flex-wrap">
                    {[1, 2, 3, 5].map(n => (
                      <button
                        key={n}
                        onClick={() => { setQty(n); setError(""); }}
                        disabled={loading}
                        className={`px-3 py-2 rounded-xl text-xs font-black border-2 transition-all disabled:opacity-40 ${
                          qty === n
                            ? "bg-amber-400 border-amber-400 text-slate-900"
                            : "border-slate-200 text-slate-500 hover:border-amber-300 bg-white"
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
                {qty > 1 && (
                  <p className="text-xs text-slate-400 font-medium mt-2 ml-1">
                    {qty} vouchers × ₵{UNIT_PRICE} = <span className="font-black text-slate-700">₵{total}</span>
                  </p>
                )}
              </div>

              {/* Order summary */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Order Summary</p>
                <div className="flex justify-between text-sm font-bold text-slate-700">
                  <span>{info.name} × {qty}</span>
                  <span>₵{total}.00</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-emerald-600">
                  <span>Processing fee</span>
                  <span>Free</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between font-black text-slate-900 text-base">
                  <span>Total</span>
                  <span>₵{total}.00</span>
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
                      className="w-5 h-5 border-[3px] border-slate-900/20 border-t-slate-900 rounded-full" />
                    Connecting to Paystack...
                  </>
                ) : (
                  <><CreditCard size={20} /> Pay ₵{total}.00 with Momo</>
                )}
              </motion.button>

              <p className="text-center text-xs text-slate-400 font-medium flex items-center justify-center gap-1.5">
                <Lock size={11} /> Redirects to Paystack's secure page
              </p>
            </div>
          </motion.div>

          {/* ── INFO PANEL (below form on mobile) ── */}
          <div className="order-last md:order-first md:col-span-2 space-y-4">
            <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
              className="glass p-5 md:p-8 rounded-3xl md:rounded-[2.5rem]"
            >
              <div className="hidden md:block text-5xl mb-4">{info.icon}</div>
              <h2 className="text-lg md:text-2xl font-black text-slate-900 mb-1">{info.name}</h2>
              <p className="text-sm text-slate-500 font-medium mb-4 hidden md:block">{info.desc}</p>
              <div className="space-y-2.5">
                {info.perks.map((perk, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-sm font-bold text-slate-700">
                    <CheckCircle size={15} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                    {perk}
                  </div>
                ))}
              </div>
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="font-bold text-slate-500 text-sm">Unit price</span>
                <span className="text-2xl md:text-3xl font-black text-slate-900">₵{UNIT_PRICE}.00</span>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}
              className="glass p-5 rounded-2xl md:rounded-[2rem]"
            >
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">After purchase, go to</p>
              <a href={info.portal} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm font-black text-slate-900 hover:text-amber-600 transition-colors"
              >
                <span className="text-xl">{info.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="truncate">{info.name.replace(" Checker", "")} Official Portal</p>
                  <p className="text-xs font-bold text-slate-400">{info.portalLabel}</p>
                </div>
                <ExternalLink size={14} className="text-slate-400 flex-shrink-0" />
              </a>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
              className="grid grid-cols-2 gap-2.5"
            >
              {[
                { icon: <Lock size={14} className="text-emerald-500" />,      label: "SSL Encrypted" },
                { icon: <ShieldCheck size={14} className="text-blue-500" />,  label: "Paystack Secured" },
                { icon: <Zap size={14} className="text-amber-500" />,         label: "Instant Delivery" },
                { icon: <CheckCircle size={14} className="text-violet-500" />, label: "100% Authentic" },
              ].map((b, i) => (
                <div key={i} className="glass p-3 rounded-2xl flex items-center gap-2 text-[11px] font-black text-slate-600">
                  {b.icon} {b.label}
                </div>
              ))}
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}
