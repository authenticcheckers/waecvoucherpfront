"use client";
import { useState } from "react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import VoucherCard from "@/app/components/VoucherCard";
import AnimatedButton from "@/app/components/AnimatedButton";

export default function Retrieve() {
  const [serial, setSerial] = useState("");
  const [voucher, setVoucher] = useState<any>(null);
  const [error, setError] = useState("");
  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const handleRetrieve = async () => {
    setError("");
    setVoucher(null);
    try {
      const res = await fetch(`${API}/api/voucher/retrieve/${encodeURIComponent(serial)}`);
      if (!res.ok) {
        setError("Voucher not found");
        return;
      }
      const data = await res.json();
      setVoucher(data);
    } catch (err) {
      console.error(err);
      setError("Network error");
    }
  };

  return (
    <>
      <Navbar />
      <div className="h-16" />
      <div className="container-max max-w-md mx-auto">
        <div className="glass p-6 rounded-lg shadow mt-8">
          <h2 className="text-xl font-bold mb-3">Retrieve Voucher</h2>
          <input value={serial} onChange={(e)=>setSerial(e.target.value)} placeholder="Enter serial number" className="w-full border p-3 rounded mb-3"/>
          <AnimatedButton onClick={handleRetrieve}>Retrieve</AnimatedButton>
          {error && <p className="text-red-500 mt-3">{error}</p>}
          {voucher && <div className="mt-4"><VoucherCard serial={voucher.serial_number} pin={voucher.pin} /></div>}
        </div>
      </div>
      <Footer />
    </>
  );
}
