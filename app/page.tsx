import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto text-center mt-20">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-4xl font-bold mb-6"
        >
          Welcome to Waec e-Vouchers Hub
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-lg"
        >
          Purchase WASSCE, BECE, and School Placement vouchers instantly.
        </motion.p>
      </main>
      <Footer />
    </>
  );
}
