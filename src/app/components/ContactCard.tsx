import { useState } from "react";
import { motion } from "motion/react";

interface ContactCardProps {
  onClose: () => void;
}

export function ContactCard({ onClose }: ContactCardProps) {
  const [form, setForm] = useState({ nombre: "", email: "", mensaje: "" });
  const [sent, setSent] = useState(false);

  const update = (field: string, value: string) => setForm({ ...form, [field]: value });
  const canSend = form.nombre.trim() && form.email.trim() && form.mensaje.trim();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Main split content */}
      <div className="flex-1 flex overflow-hidden min-h-0 h-full">
        {/* LEFT 65% */}
        <div className="flex-[65] flex flex-col min-h-0">
          {/* Top bar */}
          <div className="flex items-center justify-between px-6 sm:px-10 py-4">
            <button
              onClick={onClose}
              className="text-[13px] text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              style={{ fontWeight: 500 }}
            >
              ← Salir
            </button>
          </div>

          {/* Progress bar */}
          <div className="px-6 sm:px-10">
            <div className="h-[3px] bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-blue-600 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: sent ? "100%" : "50%" }}
                transition={{ duration: 0.4 }}
              />
            </div>
          </div>

          {/* Form content */}
          <div className="flex-1 overflow-y-auto px-6 sm:px-10 py-8 flex flex-col justify-center">
            {sent ? (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-sm"
              >
                <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center mb-4">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M5 13l4 4L19 7" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h2 className="text-[20px] text-gray-900 mb-2" style={{ fontWeight: 700 }}>
                  Mensaje enviado
                </h2>
                <p className="text-[13px] text-gray-500 mb-6 leading-relaxed">
                  Gracias, {form.nombre}. Te contactaremos pronto a{" "}
                  <span className="text-gray-700" style={{ fontWeight: 500 }}>{form.email}</span>.
                </p>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 text-[13px] text-white rounded-lg bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] hover:shadow-[0_4px_20px_rgba(37,99,235,0.35)] transition-all cursor-pointer"
                  style={{ fontWeight: 600 }}
                >
                  Volver al inicio
                </button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <h2 className="text-[20px] text-gray-900 mb-1" style={{ fontWeight: 700 }}>
                  Contanos sobre tu proyecto
                </h2>
                <p className="text-[13px] text-gray-400 mb-6">
                  Te respondemos en menos de 24 horas.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-[12px] text-gray-500 mb-1.5" style={{ fontWeight: 500 }}>Nombre</label>
                    <input
                      type="text"
                      value={form.nombre}
                      onChange={(e) => update("nombre", e.target.value)}
                      placeholder="Tu nombre"
                      className="w-full bg-white border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-50 rounded-xl outline-none text-[14px] text-gray-900 px-4 py-2.5 transition-all placeholder:text-gray-300"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] text-gray-500 mb-1.5" style={{ fontWeight: 500 }}>Email</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                      placeholder="tu@email.com"
                      className="w-full bg-white border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-50 rounded-xl outline-none text-[14px] text-gray-900 px-4 py-2.5 transition-all placeholder:text-gray-300"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] text-gray-500 mb-1.5" style={{ fontWeight: 500 }}>Mensaje</label>
                    <textarea
                      value={form.mensaje}
                      onChange={(e) => update("mensaje", e.target.value)}
                      placeholder="Contanos sobre tu proyecto..."
                      rows={4}
                      className="w-full bg-white border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-50 rounded-xl outline-none text-[14px] text-gray-900 px-4 py-2.5 transition-all placeholder:text-gray-300 resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!canSend}
                    className={`w-full py-2.5 rounded-xl text-[13px] transition-all duration-300 ${
                      canSend
                        ? "bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] text-white hover:shadow-[0_4px_20px_rgba(37,99,235,0.35)] cursor-pointer"
                        : "bg-gray-100 text-gray-300 cursor-not-allowed"
                    }`}
                    style={{ fontWeight: 600 }}
                  >
                    Enviar mensaje
                  </button>
                </form>
              </motion.div>
            )}
          </div>
        </div>

        {/* RIGHT 35% — Tips panel */}
        <div className="flex-[35] bg-[#FAFAF8] border-l border-gray-100 hidden md:flex flex-col justify-center px-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <svg width="100%" height="90" viewBox="0 0 280 90" fill="none" className="mx-auto max-w-[260px]">
              {/* Mail envelope */}
              <motion.rect x="90" y="20" width="100" height="60" rx="8" fill="#EFF6FF" stroke="#93C5FD" strokeWidth="1.5"
                initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.3, type: "spring" }}
              />
              <motion.path d="M90 30L140 55L190 30" stroke="#60A5FA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.5, duration: 0.5 }}
              />
              {/* Send arrow */}
              <motion.path d="M210 45L240 30L230 55Z" fill="#DBEAFE" stroke="#93C5FD" strokeWidth="1"
                initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.7, type: "spring" }}
              />
              {/* Dots decoration */}
              <motion.circle cx="60" cy="40" r="4" fill="#DBEAFE"
                initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.4 }}
              />
              <motion.circle cx="50" cy="55" r="3" fill="#EFF6FF" stroke="#BFDBFE" strokeWidth="1"
                initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 }}
              />
            </svg>
          </motion.div>

          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-[10px] text-blue-500 mb-1.5 block"
            style={{ fontWeight: 600, letterSpacing: "0.04em" }}
          >
            CONTACTO DIRECTO
          </motion.span>

          <motion.h3
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="text-[15px] text-gray-800 mb-4"
            style={{ fontWeight: 700, lineHeight: 1.3 }}
          >
            ¿Por qué escribirnos?
          </motion.h3>

          <div className="space-y-2.5 mb-5">
            {[
              "Respuesta personalizada en menos de 24h",
              "Sin compromiso ni costos ocultos",
              "Te orientamos según tu presupuesto real",
            ].map((tip, i) => (
              <motion.div
                key={tip}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.08 }}
                className="flex items-start gap-2"
              >
                <span className="w-1 h-1 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                <span className="text-[12px] text-gray-500 leading-relaxed">{tip}</span>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <p className="text-[22px] text-blue-600 mb-0.5" style={{ fontWeight: 700 }}>
              24h
            </p>
            <p className="text-[11px] text-gray-500 leading-snug">tiempo máximo de respuesta</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}