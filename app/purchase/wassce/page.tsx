"use client";
import { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import AnimatedButton from "../../components/AnimatedButton";

export default function WASSCE() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const handlePurchase = async () => {
    const res = await fetch("http://localhost:5000/api/voucher/purchase", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, type: "WASSCE" }),
    });
    const data = await res.json();
    if (data.authorization_url) {
      window.location.href = data.authorization_url;
    } else {
      setMessage(data.msg || "Error processing payment");
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-md mx-auto mt-20 bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Purchase WASSCE Voucher (25 Cedis)</h2>
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded w-full mb-4"
        />
        <input
          type="text"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="border p-2 rounded w-full mb-4"
        />
        <AnimatedButton onClick={handlePurchase}>Pay Now</AnimatedButton>
        {message && <p className="text-red-500 mt-2">{message}</p>}
      </div>
      <Footer />
    </>
  );
}
