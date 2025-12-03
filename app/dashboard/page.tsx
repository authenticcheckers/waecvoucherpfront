"use client";
import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AnimatedButton from "../components/AnimatedButton";

export default function Dashboard() {
  const [vouchersCSV, setVouchersCSV] = useState("");
  const [sales, setSales] = useState([]);

  const uploadVouchers = async () => {
    try {
      const rows = vouchersCSV.split("\n").map((row) => {
        const [serial_number, pin, type] = row.split(",");
        return { serial_number, pin, type };
      });
      const res = await fetch("http://localhost:5000/api/admin/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vouchers: rows }),
      });
      const data = await res.json();
      alert(data.msg);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSales = async () => {
    const res = await fetch("http://localhost:5000/api/admin/sales");
    const data = await res.json();
    setSales(data);
  };

  return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto mt-10 bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>

        <textarea
          placeholder="serial,pin,type\n..."
          rows={6}
          value={vouchersCSV}
          onChange={(e) => setVouchersCSV(e.target.value)}
          className="border p-2 rounded w-full mb-4"
        />
        <AnimatedButton onClick={uploadVouchers}>Upload Vouchers</AnimatedButton>

        <hr className="my-6" />

        <AnimatedButton onClick={fetchSales}>View Sales</AnimatedButton>
        <ul className="mt-4">
          {sales.map((s: any) => (
            <li key={s.id}>
              {s.purchaser_name} ({s.purchaser_phone}) bought {s.type} voucher {s.serial_number}
            </li>
          ))}
        </ul>
      </div>
      <Footer />
    </>
  );
}
