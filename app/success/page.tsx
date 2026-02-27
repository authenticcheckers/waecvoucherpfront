"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Download, CheckCircle2, MessageCircle, AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import Link from "next/link";

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-mesh flex items-center justify-center">
        <RefreshCw className="animate-spin text-amber-500" size={32} />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Paystack sends both trxref and reference; we need to catch either.
  const reference = searchParams.get("reference") || searchParams.get("trxref");
  
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!reference) {
      setLoading(false);
      setError(true);
      return;
    }

    const verifyPayment = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/vouchers?reference=${reference}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        
        // Handle both single object or array responses
        const voucherData = Array.isArray(data) ? data : [data];
        setVouchers(voucherData);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [reference]);

  const downloadPDF = async (v: any) => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([400, 250]);
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    
    page.drawRectangle({ x: 0, y: 0, width: 400, height: 250, color: rgb(0.97, 0.98, 1) });
    page.drawText("VOUCHERHUB GHANA", { x: 50, y: 200, size: 14, font, color: rgb(0.1, 0.1, 0.1) });
    page.drawText("OFFICIAL WAEC E-VOUCHER", { x: 50, y: 180, size: 10, font, color: rgb(0.4, 0.4, 0.4) });
    
    page.drawText(`SERIAL: ${v.serial_number || v.serial}`, { x: 50, y: 130, size: 12, font });
    page.drawText(`PIN: ${v.pin}`, { x: 50, y: 100, size: 22, font, color: rgb(0.85, 0.4, 0) });
    
    const pdfBytes = await pdfDoc.save();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" }));
    link.download = `Voucher-${v.serial_number || v.serial}.pdf`;
    link.click();
  };

  return (
    <main className="min-h-screen bg-mesh flex flex-col items-center justify-center p-6 selection:bg-emerald-100">
      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.95 }} 
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="max-w-xl w-full bg-white rounded-[3.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] overflow-hidden border border-slate-100"
      >
        {/* Header Section */}
        <div className={`p-12 text-center transition-colors duration-700 ${error ? 'bg-red-500' : 'bg-emerald-500'}`}>
          <motion.div 
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-md"
          >
            {error ? <AlertCircle size={40} className="text-white" /> : <CheckCircle2 size={40} className="text-white" />}
          </motion.div>
          <h1 className="text-4xl font-[1000] text-white tracking-tight">
            {loading ? "Verifying..." : error ? "Verification Failed" : "Payment Successful!"}
          </h1>
          <p className="text-white/80 font-bold mt-2">
            {loading ? "Checking payment status with Paystack" : error ? "We couldn't find a voucher for this reference." : "Your voucher details are ready below."}
          </p>
        </div>

        <div className="p-10">
          <AnimatePresence mode="wait">
            {loading ? (
              /* Shimmering Skeleton */
              <motion.div key="loader" exit={{ opacity: 0 }} className="space-y-6">
                <div className="h-48 w-full bg-slate-50 rounded-[2.5rem] animate-pulse border-2 border-dashed border-slate-200" />
                <div className="h-14 w-full bg-slate-100 rounded-2xl animate-pulse" />
              </motion.div>
            ) : error ? (
              <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-6">
                <p className="text-slate-500 font-medium mb-8">
                  If you were debited, please wait 2 minutes and check the retrieval tool using your serial number.
                </p>
                <button 
                  onClick={() => router.push('/')}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-slate-800 transition-all"
                >
                  <ArrowLeft size={18} /> Back to Home
                </button>
              </motion.div>
            ) : (
              <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                {vouchers.map((v, i) => (
                  <motion.div 
                    key={i}
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.1 + 0.3 }}
                    className="bg-slate-50 border-4 border-dashed border-slate-200 rounded-[3rem] p-8 text-center relative group hover:border-amber-400 transition-all duration-500"
                  >
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-4 text-[10px] font-[1000] text-slate-400 uppercase tracking-widest">
                      Digital Voucher Card
                    </div>
                    <p className="text-4xl font-black text-amber-600 mb-1 tracking-tighter">PIN: {v.pin}</p>
                    <p className="text-sm font-bold text-slate-400 mb-8 uppercase tracking-widest">Serial: {v.serial_number || v.serial}</p>
                    
                    <button 
                      onClick={() => downloadPDF(v)}
                      className="w-full py-4 bg-white border-2 border-slate-200 rounded-2xl font-black text-slate-900 flex items-center justify-center gap-2 hover:border-amber-400 hover:shadow-xl hover:shadow-amber-100 transition-all"
                    >
                      <Download size={20} className="text-amber-500" /> Download PDF
                    </button>
                  </motion.div>
                ))}

                <div className="pt-6">
                  <h3 className="text-xl font-black text-slate-900 text-center mb-6">Quick Share</h3>
                  <button 
                    onClick={() => window.open(`https://wa.me/?text=I just got my WAEC results checker instantly! Get yours here: ${window.location.origin}`)}
                    className="w-full bg-[#25D366] text-white py-6 rounded-[2.5rem] font-black flex items-center justify-center gap-3 shadow-xl shadow-green-200 hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    <MessageCircle size={24} /> Share on WhatsApp
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </main>
  );
}
