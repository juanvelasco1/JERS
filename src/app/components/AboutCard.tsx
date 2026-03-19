import { motion } from "motion/react";

const reasons = [
  { label: "Trabajamos con negocios reales", detail: "Panaderías, ferreterías, consultorios, tiendas — entendemos cómo funcionan porque trabajamos con ellos todos los días." },
  { label: "Tú no tienes que saber de tecnología", detail: "Nosotros nos encargamos de todo lo técnico. Solo necesitamos que nos cuentes sobre tu negocio." },
  { label: "Precios justos y transparentes", detail: "Sin letra pequeña ni cobros sorpresa. Sabes exactamente cuánto pagas y qué recibes desde el primer día." },
  { label: "Diagnóstico gratuito con inteligencia artificial", detail: "Antes de cualquier compromiso, analizamos tu caso gratis y te decimos qué necesitas realmente." },
];

export function AboutCard({ onClose }: { onClose: () => void }) {
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-6 sm:px-8 py-4 flex items-center shrink-0">
        <button
          onClick={onClose}
          className="text-[14px] text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
          style={{ fontWeight: 500 }}
        >
          ← Salir
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center py-5 sm:py-6 px-[40px] pt-[24px] pb-[64px]">
        {/* Intro */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-5 sm:mb-6"
        >
          <h2 className="text-xl sm:text-2xl text-gray-900 mb-2" style={{ fontWeight: 700 }}>
            Creamos <span className="text-blue-600">páginas web</span> para tu negocio
          </h2>
          <p className="text-[15px] sm:text-[16px] text-gray-500 leading-relaxed max-w-2xl">
            Somos un equipo especializado en ayudar a negocios, emprendedores y empresas familiares a tener su propia página web profesional. Nos encargamos de todo el proceso: desde entender lo que necesitas, hasta que tu página esté publicada y funcionando en internet.
          </p>
        </motion.div>

        {/* Why us */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
        >
          <p className="text-[13px] text-gray-400 mb-3" style={{ fontWeight: 600 }}>POR QUÉ ELEGIRNOS</p>
          <div className="space-y-3">
            {reasons.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.3 + i * 0.08 }}
                className="flex gap-3 items-start"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                <div>
                  <span className="text-[14px] text-gray-900 block" style={{ fontWeight: 600 }}>{item.label}</span>
                  <span className="text-[13px] text-gray-500 block mt-0.5 leading-relaxed">{item.detail}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Free diagnostic CTA */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          className="mt-5 sm:mt-6 border-l-3 border-blue-500 pl-4"
        >
          <p className="text-[14px] text-gray-800" style={{ fontWeight: 600 }}>
            El diagnóstico es 100% gratis
          </p>
          <p className="text-[13px] text-gray-500 mt-0.5 leading-relaxed">
            Analizamos tu caso con inteligencia artificial y te decimos qué necesitas. Sin costo, sin compromiso.
          </p>
        </motion.div>
      </div>
    </div>
  );
}