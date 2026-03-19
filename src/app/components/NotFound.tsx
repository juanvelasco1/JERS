import { Link } from "react-router";
import { motion } from "motion/react";

export function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-6xl text-gray-900 mb-4" style={{ fontWeight: 700 }}>404</h1>
        <p className="text-[16px] text-gray-500 mb-6">Página no encontrada</p>
        <Link
          to="/"
          className="bg-blue-600 text-white px-6 py-2.5 rounded-full text-[14px] hover:bg-blue-700 transition-colors"
          style={{ fontWeight: 600 }}
        >
          Volver al inicio
        </Link>
      </motion.div>
    </div>
  );
}
