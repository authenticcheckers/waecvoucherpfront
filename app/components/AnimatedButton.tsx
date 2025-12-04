"use client";
import { motion } from "framer-motion";
import React from "react";

export default function AnimatedButton({ children, onClick, className }: { children: React.ReactNode, onClick?: () => void, className?: string }) {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className={`px-5 py-2 rounded-full bg-yellow-400 text-black font-semibold shadow-lg ${className || ""}`}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
}
