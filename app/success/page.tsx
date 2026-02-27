"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Download, CheckCircle2, MessageCircle, AlertCircle, ArrowLeft, RefreshCw, ExternalLink, Copy, Star, Share2 } from "lucide-react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import Link from "next/link";

// Portal links by voucher type
const PORTAL_INFO: Record<string, { url: string; label: string; desc: string; icon: string; color: string; steps: string[] }> = {
  WASSCE: {
    url: "https://www.waecgh.org/",
    label: "Check WASSCE Results",
    desc: "Official WAEC Ghana Result Checker",
    icon: "🎓",
    color: "from-blue-500 to-blue-700",
    steps: ["Visit the WAEC portal", "Click 'Result Checker'", "Enter your serial number & PIN", "View your results"],
  },
  BECE: {
    url: "https://www.waecgh.org/",
    label: "Check BECE Results",
    desc: "Official WAEC Ghana Result Checker",
    icon: "📚",
    color: "from-amber-500 to-orange-600",
    steps: ["Visit the WAEC portal", "Click 'Result Checker'", "Enter your serial number & PIN", "View your results"],
  },
  SCHOOLPLACEMENT: {
    url: "https://cssps.gov.gh/",
    label: "Check School Placement",
    desc: "CSSPS Placement Portal",
    icon: "🏫",
    color: "from-violet-500 to-purple-700",
    steps: ["Visit the CSSPS portal", "Select 'Check Placement'", "Enter your serial number & PIN", "View your school placement"],
  },
};

const DEFAULT_PORTAL = PORTAL_INFO.BECE;

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-mesh flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="animate-spin text-amber-500 mx-auto mb-4" size={36} />
          <p className="text-slate-500 font-bold">Loading your voucher...</p>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}

function ConfettiPiece({ delay }: { delay: number }) {
  const colors = ['#fbbf24', '#34d399', '#60a5fa', '#f472b6', '#a78bfa'];
  const color = colors[Math.floor(Math.random() * colors.length)];
  const left = `${Math.random() * 100}%`;
  return (
    <motion.div
      initial={{ opacity: 1, y: 0, x: 0, rotate: 0, scale: 1 }}
      animate={{ opacity: 0, y: -200, x: (Math.random() - 0.5) * 200, rotate: 720, scale: 0 }}
      transition={{ duration: 2, delay, ease: "easeOut" }}
      style={{ position: 'absolute', left, top: '60%', width: 12, height: 12, background: color, borderRadius: Math.random() > 0.5 ? '50%' : '2px', pointerEvents: 'none' }}
    />
  );
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const reference = searchParams.get("reference") || searchParams.get("trxref");

  const [voucher, setVoucher] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (!reference) {
      setError("No payment reference found. If you just paid, please wait and try refreshing.");
      setLoading(false);
      return;
    }

    const verify = async () => {
      try {
        // Calls the /verify endpoint — backend must be deployed with the updated routes/voucher.js
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/voucher/verify?reference=${encodeURIComponent(reference)}`
        );

        // Guard against HTML error pages (e.g. 404 from old backend)
        const contentType = res.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) {
          throw new Error("The server returned an unexpected response. If you were debited, go to the home page and recover your voucher using your MoMo number.");
        }

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Verification failed.");
        }

        // Normalise: new API returns { vouchers: [...] }, old returned a single object
        const voucherList = data.vouchers
          ? data.vouchers.map((v: any) => ({ ...v, type: data.type }))
          : [{ serial_number: data.serial_number, pin: data.pin, type: data.type }];
        setVoucher({ ...data, vouchers: voucherList, quantity: voucherList.length });
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      } catch (err: any) {
        setError(err.message || "We couldn't verify your payment.");
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [reference]);

  const copyToClipboard = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const downloadPDF = async () => {
    if (!voucher) return;
    const pdfDoc = await PDFDocument.create();
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const vType = voucher.type || "VOUCHER";

    for (const v of voucher.vouchers) {
      const page = pdfDoc.addPage([480, 300]);
      page.drawRectangle({ x: 0, y: 0, width: 480, height: 300, color: rgb(0.97, 0.98, 1) });
      page.drawRectangle({ x: 0, y: 240, width: 480, height: 60, color: rgb(0.06, 0.09, 0.18) });
      page.drawRectangle({ x: 0, y: 237, width: 480, height: 4, color: rgb(0.96, 0.62, 0.04) });
      page.drawText("VOUCHERHUB GHANA", { x: 24, y: 266, size: 14, font: boldFont, color: rgb(1, 1, 1) });
      page.drawText("Official WAEC E-Voucher Receipt", { x: 24, y: 250, size: 9, font, color: rgb(0.6, 0.6, 0.7) });
      page.drawText(`${vType} Results Checker`, { x: 24, y: 210, size: 11, font: boldFont, color: rgb(0.4, 0.4, 0.5) });
      page.drawText("SERIAL NUMBER", { x: 24, y: 180, size: 8, font: boldFont, color: rgb(0.6, 0.6, 0.6) });
      page.drawText(v.serial_number || "", { x: 24, y: 162, size: 13, font: boldFont, color: rgb(0.1, 0.1, 0.2) });
      page.drawText("YOUR PIN", { x: 24, y: 135, size: 8, font: boldFont, color: rgb(0.6, 0.6, 0.6) });
      page.drawText(v.pin || "", { x: 24, y: 108, size: 36, font: boldFont, color: rgb(0.85, 0.4, 0) });
      if (voucher.purchaser_name) {
        page.drawText(`Purchased by: ${voucher.purchaser_name}`, { x: 24, y: 60, size: 9, font, color: rgb(0.5, 0.5, 0.6) });
      }
      page.drawText("Keep this document safe. Do not share your PIN with anyone.", { x: 24, y: 40, size: 8, font, color: rgb(0.7, 0.3, 0.3) });
      page.drawText("voucherhubgh.com", { x: 24, y: 24, size: 8, font, color: rgb(0.7, 0.7, 0.8) });
    }

    const pdfBytes = await pdfDoc.save();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" }));
    link.download = `VoucherHub-${vType}-${voucher.vouchers.length}vouchers.pdf`;
    link.click();
  };

  const portal = voucher?.type ? (PORTAL_INFO[voucher.type] || DEFAULT_PORTAL) : DEFAULT_PORTAL;

  return (
    <main className="min-h-screen bg-mesh flex flex-col items-center justify-center p-6 py-16">
      {/* Confetti */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
          {[...Array(30)].map((_, i) => <ConfettiPiece key={i} delay={i * 0.05} />)}
        </div>
      )}

      <div className="w-full max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="bg-white rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] overflow-hidden border border-slate-100"
        >
          {/* ── Header ── */}
          <div className={`p-10 text-center relative overflow-hidden transition-colors duration-700 ${
            loading ? 'bg-slate-700' : error ? 'bg-red-500' : 'bg-emerald-500'
          }`}>
            <div className="absolute inset-0 opacity-10">
              {!error && !loading && [...Array(8)].map((_, i) => (
                <div key={i} className="absolute w-24 h-24 rounded-full border-2 border-white" 
                  style={{ top: `${Math.random()*100}%`, left: `${Math.random()*100}%`, opacity: 0.3 }} />
              ))}
            </div>

            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="w-20 h-20 bg-white/25 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-5"
            >
              {loading ? (
                <RefreshCw size={36} className="text-white animate-spin" />
              ) : error ? (
                <AlertCircle size={36} className="text-white" />
              ) : (
                <CheckCircle2 size={36} className="text-white" />
              )}
            </motion.div>

            <h1 className="text-4xl font-black text-white tracking-tight">
              {loading ? "Verifying Payment..." : error ? "Something Went Wrong" : "Payment Successful! 🎉"}
            </h1>
            <p className="text-white/80 font-bold mt-2 text-sm">
              {loading
                ? "Please wait while we confirm your payment with Paystack"
                : error
                ? "We couldn't retrieve your voucher"
                : `Your ${voucher?.type || ""} voucher is ready — check your results now`}
            </p>
          </div>

          {/* ── Body ── */}
          <div className="p-8 md:p-10">
            <AnimatePresence mode="wait">
              {loading && (
                <motion.div key="loader" exit={{ opacity: 0 }} className="space-y-4">
                  <div className="h-40 w-full bg-slate-50 rounded-[2rem] shimmer border-2 border-dashed border-slate-200" />
                  <div className="h-14 w-full bg-slate-100 rounded-2xl shimmer" />
                  <div className="h-14 w-full bg-slate-100 rounded-2xl shimmer" />
                </motion.div>
              )}

              {error && !loading && (
                <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-4">
                  <div className="bg-red-50 border border-red-100 rounded-2xl p-6 mb-8">
                    <p className="text-red-700 font-bold text-sm leading-relaxed">{error}</p>
                    {reference && (
                      <p className="text-slate-500 text-xs mt-3 font-medium">
                        Reference: <code className="bg-red-100 px-2 py-0.5 rounded font-mono">{reference}</code>
                      </p>
                    )}
                  </div>
                  <p className="text-slate-500 font-medium text-sm mb-8">
                    If you were debited, your voucher is safe. Go to the <strong>home page</strong> and enter your MoMo number in the recovery tool to retrieve your PIN instantly.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button onClick={() => router.push('/')}
                      className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-slate-800 transition-all">
                      <ArrowLeft size={16} /> Back to Home
                    </button>
                    <button onClick={() => window.location.reload()}
                      className="inline-flex items-center gap-2 px-8 py-4 bg-slate-100 text-slate-900 rounded-2xl font-black hover:bg-slate-200 transition-all">
                      <RefreshCw size={16} /> Try Again
                    </button>
                  </div>
                </motion.div>
              )}

              {voucher && !loading && !error && (
                <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  
                  {/* ── Voucher Card(s) ── */}
                  {voucher.quantity > 1 && (
                    <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3">
                      <CheckCircle2 size={16} className="text-amber-600 flex-shrink-0" />
                      <p className="text-sm font-black text-amber-800">
                        {voucher.quantity} vouchers purchased — all PINs are below.
                      </p>
                    </div>
                  )}
                  {voucher.vouchers.map((v: any, idx: number) => (
                    <motion.div key={idx}
                      initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 150, delay: 0.2 + idx * 0.08 }}
                      className="relative bg-slate-900 rounded-3xl p-5 sm:p-7 text-white"
                      style={{ WebkitTransform: 'translateZ(0)' }}
                    >
                      {/* header row */}
                      <div className="flex justify-between items-center mb-5">
                        <div>
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">VoucherHub Ghana</p>
                          <p className="text-xs font-bold text-slate-400 mt-0.5">{portal.desc}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {voucher.quantity > 1 && (
                            <span className="text-[10px] font-black bg-white/10 px-2.5 py-1 rounded-full text-slate-400">
                              {idx + 1} of {voucher.quantity}
                            </span>
                          )}
                          <span className="text-2xl">{portal.icon}</span>
                        </div>
                      </div>

                      {/* Serial */}
                      <div className="bg-white/10 rounded-2xl p-4 mb-3">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Serial Number</p>
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-base font-black text-white font-mono break-all leading-snug">{v.serial_number}</p>
                          <button
                            onClick={() => copyToClipboard(v.serial_number, `serial-${idx}`)}
                            className="flex-shrink-0 w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center hover:bg-white/20 active:scale-95 transition-all"
                          >
                            {copied === `serial-${idx}`
                              ? <CheckCircle2 size={15} className="text-emerald-400" />
                              : <Copy size={15} className="text-slate-300" />}
                          </button>
                        </div>
                      </div>

                      {/* PIN — high contrast box */}
                      <div className="bg-amber-400 rounded-2xl p-4">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-[10px] font-black text-amber-900 uppercase tracking-widest">Your PIN</p>
                          <button
                            onClick={() => copyToClipboard(v.pin, `pin-${idx}`)}
                            className="flex-shrink-0 flex items-center gap-1.5 bg-black/10 hover:bg-black/20 active:scale-95 transition-all px-3 py-1.5 rounded-xl text-[11px] font-black text-slate-900"
                          >
                            {copied === `pin-${idx}`
                              ? <><CheckCircle2 size={13} /> Copied!</>
                              : <><Copy size={13} /> Copy</>}
                          </button>
                        </div>
                        <p className="text-5xl font-black text-slate-900 font-mono tracking-widest leading-tight w-full">
                          {v.pin}
                        </p>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-wider">{voucher.type} Checker</p>
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => <Star key={i} size={10} fill="#fbbf24" className="text-amber-400" />)}
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {/* ── Warning ── */}
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3">
                    <AlertCircle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
                    <div className="text-xs font-bold text-amber-800">
                      <strong>Save your PIN now.</strong> Screenshot this page or download the PDF. Do not share your PIN with anyone — VoucherHub staff will never ask for it.
                    </div>
                  </div>

                  {/* ── ACTION: Go Check Results ── */}
                  <div className="bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-[2rem] p-6">
                    <p className="text-xs font-black text-emerald-700 uppercase tracking-widest mb-1">Step 2 — Check Your Results</p>
                    <h3 className="text-lg font-black text-slate-900 mb-1">{portal.desc}</h3>
                    <p className="text-sm text-slate-500 font-medium mb-5">Use your serial number and PIN above on the official portal.</p>
                    
                    {/* Steps */}
                    <div className="grid grid-cols-2 gap-2 mb-5">
                      {portal.steps.map((step, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs font-bold text-slate-700">
                          <div className="w-5 h-5 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-black flex-shrink-0 text-[10px]">
                            {i + 1}
                          </div>
                          {step}
                        </div>
                      ))}
                    </div>

                    <a href={portal.url} target="_blank" rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2.5 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl transition-all shadow-lg shadow-emerald-200 hover:shadow-emerald-300 hover:scale-[1.01] active:scale-[0.99]">
                      {portal.icon} {portal.label}
                      <ExternalLink size={16} />
                    </a>
                  </div>

                  {/* ── Download PDF ── */}
                  <button onClick={downloadPDF}
                    className="w-full py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl font-black text-slate-900 flex items-center justify-center gap-2 hover:border-amber-400 hover:bg-amber-50 hover:shadow-lg hover:shadow-amber-100 transition-all">
                    <Download size={20} className="text-amber-500" /> Download PDF Receipt
                  </button>

                  {/* ── Share ── */}
                  <div className="pt-2">
                    <p className="text-center text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Help a friend — share VoucherHub</p>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`I just got my ${voucher.type} results checker instantly on VoucherHub! 🎓 No queues, no stress — get yours at: ${window.location.origin}`)}`)}
                        className="bg-[#25D366] text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-green-200"
                      >
                        <MessageCircle size={18} /> WhatsApp
                      </button>
                      <button
                        onClick={() => {
                          if (navigator.share) {
                            navigator.share({ title: 'VoucherHub Ghana', text: 'Get your WAEC vouchers instantly!', url: window.location.origin });
                          } else {
                            copyToClipboard(window.location.origin, 'link');
                          }
                        }}
                        className="bg-slate-100 text-slate-900 py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-slate-200 active:scale-95 transition-all"
                      >
                        <Share2 size={18} /> Share Link
                      </button>
                    </div>
                  </div>

                  {/* ── Back Link ── */}
                  <div className="text-center pt-2">
                    <Link href="/" className="text-sm font-bold text-slate-400 hover:text-slate-700 transition-colors inline-flex items-center gap-1.5">
                      <ArrowLeft size={14} /> Buy another voucher
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
