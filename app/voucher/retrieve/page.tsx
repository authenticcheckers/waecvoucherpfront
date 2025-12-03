"use client";
import { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import VoucherCard from "../../components/VoucherCard";
import AnimatedButton from "../../components/AnimatedButton";

export default function RetrieveVoucher() {
  const [serial, setSerial] = useState("");
  const [voucher, setVoucher] = useState(null);
  const [error, setError] = useState("");

  const handleRetrieve = async () => {
    const res = await fetch(`http://localhost:5000/api/voucher/retrieve/${serial}`);
    if(res.ok) {
      const data = await res.json();
      setVoucher(data);
      setError("");
    } else {
      setVoucher(null);
      setError("Voucher not found");
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-md mx-auto mt-20 bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Retrieve Your Voucher</h2>
        <input
          type="text"
          placeholder="Enter Serial Number"
          value={serial}
          onChange={(e) => setSerial(e.target.value)}
          className="border p-2 rounded w-full mb-4"
        />
        <AnimatedButton onClick={handleRetrieve}>Retrieve</AnimatedButton>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        {voucher && <VoucherCard serial={voucher.serial_number} pin={voucher.pin} />}
      </div>
      <Footer />
    </>
  );
}
