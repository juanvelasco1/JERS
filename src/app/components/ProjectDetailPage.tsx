import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, ArrowRight } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const CHESS_HERO = "https://images.unsplash.com/photo-1763461092888-4f69d1ebc492?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVzcyUyMHN0cmF0ZWd5JTIwZ2FtZSUyMGRhcmt8ZW58MXx8fHwxNzcyOTI0Mjk0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
const CHESS_BOARD = "https://images.unsplash.com/photo-1752697588989-8600ecfb47e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVzcyUyMHBpZWNlcyUyMGJvYXJkJTIwY2xvc2V1cHxlbnwxfHx8fDE3NzI5MjQyOTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
const MOBILE_APP = "https://images.unsplash.com/photo-1694878981905-b742a32f8121?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhcHAlMjBpbnRlcmZhY2UlMjBtb2NrdXB8ZW58MXx8fHwxNzcyODI2MjM4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

const faqs = [
  { q: "¿Qué necesito para empezar?", a: "Solo necesitas tener clara la idea de tu proyecto y contactarnos. Nosotros nos encargamos del análisis, diseño y desarrollo completo." },
  { q: "¿Qué tipo de personalización hay disponible?", a: "Ofrecemos personalización completa en diseño UI/UX, funcionalidades e integraciones." },
];

export function ProjectDetailPage() {
  return (
    <div className="pb-0">
      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-4 pt-12 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-3xl sm:text-4xl text-gray-900 mb-4" style={{ fontWeight: 700, lineHeight: 1.15 }}>
              Chess Manager – The strategy, in your hands
            </h1>
            <p className="text-[14px] text-gray-500 mb-6 leading-relaxed">
              Una aplicación web completa para gestionar torneos de ajedrez, analizar partidas y mejorar tu estrategia con herramientas avanzadas de IA.
            </p>
            <div className="flex gap-3">
              <button className="bg-blue-600 text-white px-5 py-2.5 rounded-full text-[13px] hover:bg-blue-700 transition-colors" style={{ fontWeight: 600 }}>
                Ver demo
              </button>
              <button className="border border-gray-200 text-gray-700 px-5 py-2.5 rounded-full text-[13px] hover:bg-gray-50 transition-colors" style={{ fontWeight: 500 }}>
                Caso de estudio
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <ImageWithFallback
                src={CHESS_HERO}
                alt="Chess Manager Hero"
                className="w-full h-[260px] sm:h-[320px] object-cover"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Large Banner Image */}
      <section className="max-w-5xl mx-auto px-4 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl overflow-hidden bg-[#0a1628] p-8 flex items-center justify-center"
        >
          <div className="text-center">
            <h2 className="text-white text-3xl sm:text-4xl tracking-wider mb-4" style={{ fontWeight: 800, letterSpacing: "0.15em" }}>
              CHESS MANAGER
            </h2>
            <ImageWithFallback
              src={CHESS_BOARD}
              alt="Chess Board"
              className="w-full max-w-lg mx-auto h-[200px] sm:h-[280px] object-cover rounded-xl"
            />
          </div>
        </motion.div>
      </section>

      {/* Mobile Screenshots */}
      <section className="max-w-5xl mx-auto px-4 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-[#0a1628] rounded-2xl p-8"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-xl overflow-hidden bg-gray-800">
                <ImageWithFallback
                  src={MOBILE_APP}
                  alt={`Mobile screen ${i}`}
                  className="w-full h-[300px] object-cover opacity-80"
                />
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* FAQ */}
      <section className="max-w-4xl mx-auto px-4 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-2xl text-gray-900"
            style={{ fontWeight: 700 }}
          >
            Preguntas
            <br />
            Frecuentes
          </motion.h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <FAQItem key={i} question={faq.q} answer={faq.a} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0a1628] py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-blue-600 text-white text-[11px] px-3 py-1 rounded-full mb-6"
            style={{ fontWeight: 600 }}
          >
            Contacto
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl text-white mb-4"
            style={{ fontWeight: 700 }}
          >
            ¿Listo para transformar
            <br />
            tu negocio digitalmente?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-[14px] text-gray-400 mb-8 max-w-md mx-auto"
          >
            Agenda una consulta gratuita y descubre cómo podemos ayudarte a crecer.
          </motion.p>
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="bg-blue-600 text-white px-6 py-3 rounded-full text-[14px] hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
            style={{ fontWeight: 600 }}
          >
            Hablar con un consultor
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
      </section>
    </div>
  );
}

function FAQItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="border border-gray-200 rounded-xl overflow-hidden"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="text-[13px] text-gray-800 pr-4" style={{ fontWeight: 500 }}>{question}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="px-4 pb-4 text-[12px] text-gray-500 leading-relaxed">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
