import { motion } from "framer-motion";

export default function AnimatedButton({ children, onClick }: any) {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold shadow-lg"
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
}
