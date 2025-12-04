"use client";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      className="mt-28 bg-gradient-to-t from-slate-900 to-slate-800 text-gray-300"
    >
      <div className="container-max py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-white font-bold text-lg mb-2">WAEC e-Vouchers Hub</h3>
          <p className="text-sm">Fast, secure WAEC vouchers — delivered automatically after payment.</p>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-2">Quick links</h4>
          <ul className="text-sm space-y-2">
            <li><a href="/" className="hover:text-white">Home</a></li>
            <li><a href="/retrieve" className="hover:text-white">Retrieve Voucher</a></li>
            <li><a href="/dashboard" className="hover:text-white">Admin Dashboard</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-2">Support</h4>
          <p className="text-sm">Email: support@waecevouchers.com</p>
          <p className="text-sm mt-2">Phone: +233 000 000 000</p>
        </div>
      </div>

      <div className="text-center text-sm py-4 border-t border-white/5">
        © {new Date().getFullYear()} WAEC e-Vouchers Hub — All rights reserved
      </div>
    </motion.footer>
  );
}
