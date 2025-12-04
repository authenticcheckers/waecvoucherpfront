"use client";
import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AnimatedButton from "../components/AnimatedButton";

export default function Dashboard() {
  const [csv, setCsv] = useState("");
  const [sales, setSales] = useState<any[]>([]);
  const [msg, setMsg] = useState("");
  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const uploadVouchers = async () => {
    setMsg("Uploading...");
    try {
      const rows = csv.split("\n").map(r => r.trim()).filter(Boolean).map(r => {
        const [serial_number, pin, type] = r.split(",").map(c => c?.trim());
        return { serial_number, pin, type };
      });
      const res = await fetch(`${API}/api/admin/upload`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vouchers: rows })
      });
      const data = await res.json();
      setMsg(data.msg || "Uploaded");
    } catch (err) {
      console.error(err);
      setMsg("Upload failed");
    }
  };

  const fetchSales = async () => {
    try {
      const res = await fetch(`${API}/api/admin/sales`);
      const data = await res.json();
      setSales(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Navbar />
      <div className="h-16" />
      <div className="container-max max-w-4xl mx-auto py-8">
        <div className="glass p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>

          <label className="block text-sm font-semibold mb-1">Bulk upload (CSV: serial,pin,type)</label>
          <textarea value={csv} onChange={(e)=>setCsv(e.target.value)} rows={6} className="w-full border p-3 rounded mb-3" placeholder="12345,9876,WASSCE"></textarea>
          <div className="flex gap-3">
            <AnimatedButton onClick={uploadVouchers}>Upload</AnimatedButton>
            <AnimatedButton onClick={fetchSales}>Refresh Sales</AnimatedButton>
          </div>
          {msg && <p className="mt-3 text-sm text-green-500">{msg}</p>}

          <hr className="my-6" />

          <h3 className="text-lg font-semibold mb-3">Sales</h3>
          <div className="max-h-80 overflow-auto">
            <table className="w-full text-left text-sm">
              <thead><tr className="text-gray-500"><th>Time</th><th>Type</th><th>Serial</th><th>Phone</th><th>Name</th></tr></thead>
              <tbody>
                {sales.map(s => (
                  <tr key={s.id} className="border-t">
                    <td className="py-2">{new Date(s.purchased_at).toLocaleString()}</td>
                    <td>{s.type}</td>
                    <td className="font-mono">{s.serial_number}</td>
                    <td>{s.purchaser_phone}</td>
                    <td>{s.purchaser_name}</td>
                  </tr>
                ))}
                {sales.length === 0 && <tr><td colSpan={5} className="py-4 text-gray-500">No sales yet</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
