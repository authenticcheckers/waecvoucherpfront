"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Download, Share2, CheckCircle2, MessageCircle } from "lucide-react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-bold">Validating Transaction...</div>}>
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
    const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `WAEC-Voucher-${v.serial}.pdf`;
    link.click();
  };

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-xl w-full bg-white rounded-[3rem] shadow-2xl overflow-hidden">
        <div className="bg-emerald-500 p-10 text-white text-center">
          <CheckCircle2 size={50} className="mx-auto mb-4" />
          <h1 className="text-3xl font-black">Payment Confirmed!</h1>
          <p className="opacity-80 font-medium">Your vouchers are ready below</p>
        </div>

        <div className="p-10">
          {loading ? <p className="text-center font-bold">Fetching your codes...</p> : (
            <div className="space-y-6">
              {vouchers.map((v) => (
                <div key={v.serial} className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-6 text-center">
                  <p className="text-2xl font-black text-amber-600 mb-1 tracking-tighter">PIN: {v.pin}</p>
                  <p className="text-sm font-bold text-slate-400 mb-4">Serial: {v.serial}</p>
                  <button onClick={() => downloadPDF(v)} className="inline-flex items-center gap-2 text-xs font-black text-slate-800 bg-white border border-slate-200 px-4 py-2 rounded-xl hover:bg-slate-50 transition shadow-sm">
                    <Download size={14} /> Download PDF Receipt
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="mt-12 pt-8 border-t border-slate-100 text-center">
            <h3 className="font-black text-slate-900 mb-2">Help your classmates!</h3>
            <p className="text-slate-500 text-sm font-medium mb-8">Got your results checker fast? Let your friends know so they can avoid the queues.</p>
            <button 
              onClick={() => window.open(`https://wa.me/?text=I just got my WAEC voucher instantly on VoucherHub! Check your results here: ${window.location.origin}`)}
              className="w-full bg-[#25D366] text-white py-5 rounded-2xl font-black flex items-center justify-center gap-3 hover:brightness-105 transition-all shadow-xl shadow-green-200"
            >
              <MessageCircle size={22} /> Share Hub on WhatsApp
            </button>
          </div>
        </div>
      </motion.div>
      <Link href="/" className="mt-10 font-black text-slate-400 hover:text-slate-900 transition">Return to Home</Link>
    </main>
  );
}
