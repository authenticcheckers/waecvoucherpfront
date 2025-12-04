"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { motion } from "framer-motion";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

interface Voucher {
  serial: string;
  pin: string;
}

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference") || "";
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch vouchers from backend
  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const res = await fetch(
          `https://your-backend-url.com/api/vouchers?reference=${reference}`
        );
        if (!res.ok) throw new Error("Voucher not found");
        const data = await res.json();
        setVouchers(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (reference) fetchVouchers();
  }, [reference]);

  // Function to download PDF
 // Function to download PDF
const downloadPDF = async (voucher: Voucher) => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([400, 200]);
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  page.drawText("WAEC E-Voucher", { x: 20, y: 150, size: 20, font, color: rgb(0, 0, 0) });
  page.drawText(`Serial: ${voucher.serial}`, { x: 20, y: 120, size: 16, font });
  page.drawText(`PIN: ${voucher.pin}`, { x: 20, y: 90, size: 16, font });

  const pdfBytes = await pdfDoc.save(); // Uint8Array

  // Convert to a plain ArrayBuffer
  const arrayBuffer =
    pdfBytes instanceof Uint8Array
      ? pdfBytes.buffer.slice(pdfBytes.byteOffset, pdfBytes.byteOffset + pdfBytes.byteLength)
      : pdfBytes instanceof ArrayBuffer
      ? pdfBytes
      : new Uint8Array(pdfBytes).buffer;

  const blob = new Blob([arrayBuffer], { type: "application/pdf" }); // ✅ TypeScript safe
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `voucher-${voucher.serial}.pdf`;
  link.click();
};

  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto text-center mt-20 px-4">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-4xl font-bold mb-6 text-green-600"
        >
          Payment Successful!
        </motion.h1>
        <p className="text-lg mb-4">
          Thank you for your purchase. Your transaction reference is:
        </p>
        <p className="font-mono text-xl mb-6">{reference}</p>

        {loading ? (
          <p>Loading your voucher...</p>
        ) : vouchers.length === 0 ? (
          <p className="text-red-500">No vouchers found for this transaction.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {vouchers.map((v) => (
              <motion.div
                key={v.serial}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="border rounded-lg p-4 shadow-lg flex flex-col items-center bg-white"
              >
                <p className="text-lg font-semibold">Serial: {v.serial}</p>
                <p className="text-lg font-semibold">PIN: {v.pin}</p>
                <button
                  onClick={() => downloadPDF(v)}
                  className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  Download PDF
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
