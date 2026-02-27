"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Download, CheckCircle2, MessageCircle, Share2 } from "lucide-react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-black">Finalizing Receipt...</div>}>
      <SuccessContent />
    </Suspense>
  );
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference") || "";
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (reference) {
      fetch(`https://waecevoucherp.onrender.com/api/vouchers?reference=${reference}`)
        .then(res => res.json())
        .then(data => { setVouchers(data); setLoading(false); })
        .catch(() => setLoading(false));
    }
  }, [reference]);

  const downloadPDF = async (v: any) => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([400, 250]);
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    page.drawText("WAEC OFFICIAL VOUCHER", { x: 50, y: 200, size: 18, font });
    page.drawText(`Serial: ${v.serial}`, { x: 50, y: 150, size: 14, font });
    page.drawText(`PIN: ${v.pin}`, { x: 50, y: 120, size: 18, font, color: rgb(0.96, 0.45, 0.05) });
    const pdfBytes = await pdfDoc.save();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" }));
    link.download = `Voucher-${v.serial}.pdf`;
    link.click();
  };

  return (
    <main className="min-h-screen bg-mesh flex flex-col items-center justify-center p-6">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-xl w-full bg-white rounded-[4rem] shadow-2xl overflow-hidden border border-slate-100">
        <div className="bg-emerald-500 p-12 text-white text-center">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={44} />
          </div>
          <h1 className="text-4xl font-[1000] tracking-tight">Got it!</h1>
          <p className="opacity-90 font-bold mt-2">Voucher has been sent to your phone via SMS.</p>
        </div>

        <div className="p-12">
          {loading ? <p className="text-center font-black animate-pulse">Retrieving your codes...</p> : (
            <div className="space-y-8">
              {vouchers.map((v) => (
                <div key={v.serial} className="bg-slate-50 border-4 border-dashed border-slate-200 rounded-[2.5rem] p-8 text-center relative">
                   <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Official Card</div>
                  <p className="text-3xl font-black text-amber-600 mb-2 tracking-tighter">PIN: {v.pin}</p>
                  <p className="text-sm font-bold text-slate-400 mb-6 tracking-wide">SERIAL: {v.serial}</p>
                  <button onClick={() => downloadPDF(v)} className="inline-flex items-center gap-2 text-sm font-black text-slate-900 bg-white border border-slate-200 px-6 py-3 rounded-2xl hover:shadow-md transition-all">
                    <Download size={18} /> Save PDF Receipt
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="mt-16 text-center">
            <h3 className="text-2xl font-black text-slate-900 mb-4">Don't keep it to yourself!</h3>
            <p className="text-slate-500 text-sm font-medium mb-10 leading-relaxed">Let your classmates know where to get their result checkers fast. Help them save time!</p>
            <button 
              onClick={() => window.open(`https://wa.me/?text=I just got my WAEC voucher instantly on VoucherHub! If you're looking for your result checker, try them here: ${window.location.origin}`)}
              className="w-full bg-[#25D366] text-white py-6 rounded-[2rem] font-black flex items-center justify-center gap-3 shadow-xl shadow-green-200 hover:scale-[1.02] transition-all"
            >
              <MessageCircle size={26} /> Share Hub on WhatsApp
            </button>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
