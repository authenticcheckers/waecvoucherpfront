"use client";
import Link from "next/link";

export default function VoucherCard({ serial, pin }: { serial: string, pin: string }) {
  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  return (
    <div className="glass p-4 rounded-lg shadow-lg">
      <h3 className="font-bold mb-2">Your Voucher</h3>
      <p className="text-sm">Serial: <span className="font-mono">{serial}</span></p>
      <p className="text-sm">PIN: <span className="font-mono">{pin}</span></p>
      <div className="mt-3">
        <a href={`${API.replace(/\/$/, "")}/pdfs/${encodeURIComponent(serial)}.pdf`} target="_blank" rel="noreferrer"
           className="inline-block mt-2 underline text-sm text-blue-600">Download PDF</a>
      </div>
    </div>
  );
}

