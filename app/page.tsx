"use client";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <>
      <Navbar />
      {/* spacer for fixed navbar */}
      <div className="h-16"></div>

      <section className="relative overflow-hidden py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-blue-900 to-black opacity-95" />
        <div className="container-max relative z-10 text-center text-white">
          <motion.h1 initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.9 }} className="text-5xl font-extrabold">
            Instant WAEC E-Vouchers — Secure & Fast
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }} className="mt-6 text-lg max-w-2xl mx-auto text-gray-200">
            Purchase WASSCE, BECE and School Placement checkers. Payment handled via Paystack — vouchers delivered automatically.
          </motion.p>

          <motion.div initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.45 }} className="mt-10 flex items-center justify-center gap-4">
            <a href="/purchase/wassce" className="px-8 py-3 rounded-full bg-yellow-400 text-black font-semibold shadow-lg">Buy WASSCE</a>
            <a href="/purchase/bece" className="px-6 py-3 rounded-full bg-white/10 text-white">Buy BECE</a>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container-max">
          <h2 className="text-3xl font-bold text-center mb-10">Voucher Types</h2>
          <div className="grid gap-8 grid-cols-1 md:grid-cols-3">
            {[
              { title: "WASSCE", desc: "Official WASSCE scratch cards", href: "/purchase/wassce" },
              { title: "BECE", desc: "BECE exam checker vouchers", href: "/purchase/bece" },
              { title: "School Placement", desc: "Placement checker for school placement", href: "/purchase/school-placement" }
            ].map((v, i) => (
              <motion.a key={v.title} href={v.href} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.12 }} className="glass p-6 rounded-2xl shadow-xl hover:-translate-y-2 transition">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold">{v.title}</h3>
                    <p className="text-sm text-gray-600 mt-2">{v.desc}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">₵25</div>
                    <div className="mt-3 px-3 py-1 bg-black text-white rounded-full">Purchase</div>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
