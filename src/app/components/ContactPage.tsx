import { useState } from "react";
import { motion } from "motion/react";

export function ContactPage() {
  const [form, setForm] = useState({ nombre: "", email: "", mensaje: "" });
  const [sent, setSent] = useState(false);

  const update = (field: string, value: string) => setForm({ ...form, [field]: value });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  const canSend = form.nombre.trim() && form.email.trim() && form.mensaje.trim();

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-start justify-center pt-16 pb-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        <h1 className="text-2xl sm:text-3xl text-gray-900 mb-2" style={{ fontWeight: 700 }}>
          Contactar
        </h1>
        <p className="text-[14px] text-gray-500 mb-8">
          Contanos sobre tu proyecto y te respondemos en menos de 24 horas.
        </p>

        {sent ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border border-gray-100 rounded-2xl p-8 text-center shadow-sm"
          >
            <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M5 13l4 4L19 7" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 className="text-[18px] text-gray-900 mb-2" style={{ fontWeight: 600 }}>Mensaje enviado</h2>
            <p className="text-[13px] text-gray-500">
              Gracias, {form.nombre}. Te contactaremos pronto a <span className="text-gray-700" style={{ fontWeight: 500 }}>{form.email}</span>.
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[13px] text-gray-700 mb-1.5" style={{ fontWeight: 500 }}>Nombre</label>
              <input
                type="text"
                value={form.nombre}
                onChange={(e) => update("nombre", e.target.value)}
                placeholder="Tu nombre"
                className="w-full bg-white border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-50 rounded-xl outline-none text-[14px] text-gray-900 px-4 py-3 transition-all placeholder:text-gray-300"
              />
            </div>
            <div>
              <label className="block text-[13px] text-gray-700 mb-1.5" style={{ fontWeight: 500 }}>Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="tu@email.com"
                className="w-full bg-white border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-50 rounded-xl outline-none text-[14px] text-gray-900 px-4 py-3 transition-all placeholder:text-gray-300"
              />
            </div>
            <div>
              <label className="block text-[13px] text-gray-700 mb-1.5" style={{ fontWeight: 500 }}>Mensaje</label>
              <textarea
                value={form.mensaje}
                onChange={(e) => update("mensaje", e.target.value)}
                placeholder="Contanos sobre tu proyecto..."
                rows={4}
                className="w-full bg-white border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-50 rounded-xl outline-none text-[14px] text-gray-900 px-4 py-3 transition-all placeholder:text-gray-300 resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={!canSend}
              className={`w-full py-3 rounded-xl text-[13px] transition-all duration-300 cursor-pointer ${
                canSend
                  ? "bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] text-white hover:shadow-[0_4px_20px_rgba(37,99,235,0.35)]"
                  : "bg-gray-100 text-gray-300 cursor-not-allowed"
              }`}
              style={{ fontWeight: 600 }}
            >
              Enviar mensaje
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
