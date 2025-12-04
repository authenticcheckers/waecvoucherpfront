"use client";
import { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import AnimatedButton from "../../components/AnimatedButton";

export default function SchoolPlacement() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const handlePurchase = async () => {
    setMessage("Processing...");
    try {
      const res = await fetch(`${API}/api/voucher/purchase`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, type: "SchoolPlacement" })
      });
      const data = await res.json();
      if (data.authorization_url) window.location.href = data.authorization_url;
      else setMessage(data.msg || "Error processing payment");
    } catch (err) {
      console.error(err);
      setMessage("Network error");
    }
  };

  return (
    <>
      <Navbar />
      <div className="h-16" />
      <div className="container-max max-w-lg mx-auto">
        <div className="glass p-8 rounded-2xl shadow-xl mt-10">
          <h2 className="text-2xl font-bold mb-4">Buy School Placement Checker — ₵25</h2>
          <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Full name" className="w-full border p-3 rounded mb-3"/>
          <input value={phone} onChange={(e)=>setPhone(e.target.value)} placeholder="Phone number" className="w-full border p-3 rounded mb-3"/>
          <div className="flex items-center justify-between gap-4">
            <AnimatedButton onClick={handlePurchase}>Pay with Paystack</AnimatedButton>
            <div className="text-sm text-gray-500">Secure checkout</div>
          </div>
          {message && <p className="mt-4 text-sm text-red-500">{message}</p>}
        </div>
      </div>

      <Footer />
    </>
  );
}
