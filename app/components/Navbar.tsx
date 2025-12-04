"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Navbar() {
  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed w-full z-50 bg-gradient-to-b from-black/30 to-transparent backdrop-blur-md border-b border-white/5"
    >
      <div className="container-max flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-400 to-yellow-200 shadow-lg flex items-center justify-center text-black font-bold">
            WV
          </div>
          <div className="text-white font-semibold">WAEC e-Vouchers Hub</div>
        </Link>

        <nav className="flex items-center gap-6">
          <Link href="/purchase/wassce" className="text-white hover:text-yellow-300">Buy WASSCE</Link>
          <Link href="/purchase/bece" className="text-white hover:text-yellow-300">Buy BECE</Link>
          <Link href="/purchase/school-placement" className="text-white hover:text-yellow-300">Placement</Link>
          <Link href="/retrieve" className="text-white/90 hover:text-white">Retrieve</Link>
          <Link href="/dashboard" className="ml-4 px-3 py-1 bg-white/10 rounded-lg text-white">Admin</Link>
        </nav>
      </div>
    </motion.header>
  );
}
