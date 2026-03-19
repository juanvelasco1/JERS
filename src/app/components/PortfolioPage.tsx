import { useState } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, ArrowRight } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const CHESS_IMG = "https://images.unsplash.com/photo-1763461092888-4f69d1ebc492?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVzcyUyMHN0cmF0ZWd5JTIwZ2FtZSUyMGRhcmt8ZW58MXx8fHwxNzcyOTI0Mjk0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

const faqs = [
  { q: "¿Qué necesito para empezar?", a: "Solo necesitas tener clara la idea de tu proyecto y contactarnos. Nosotros nos encargamos del análisis, diseño y desarrollo completo de tu solución digital." },
  { q: "¿Qué tipo de personalización hay disponible?", a: "Ofrecemos personalización completa en diseño UI/UX, funcionalidades, integraciones con sistemas existentes y adaptaciones específicas para tu industria." },
  { q: "¿Qué tan rápido puedo tener algo listo? Información sobre los plazos de entrega de las soluciones.", a: "Dependiendo de la complejidad del proyecto, podemos entregar un MVP funcional en 4-8 semanas. Proyectos más complejos pueden tomar 3-6 meses." },
  { q: "¿Desarrollan e integran con IA para productos digitales?", a: "Sí, integramos soluciones de inteligencia artificial como chatbots, análisis predictivo, automatización de procesos y más, adaptados a las necesidades específicas de tu negocio." },
];

export function PortfolioPage() {
  return (
    <div className="pb-0">
      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 pt-12 pb-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 bg-blue-600 text-white text-[11px] px-3 py-1 rounded-full mb-6"
          style={{ fontWeight: 600 }}
        >
          Portafolio
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-4xl text-gray-900 mb-2"
          style={{ fontWeight: 700 }}
        >
          Revisa algunos de
          <br />
          <span className="text-blue-600">nuestros proyectos</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-[14px] text-gray-500 max-w-md mx-auto"
        >
          Conoce cómo hemos ayudado a diferentes negocios a transformarse digitalmente.
        </motion.p>
      </section>

      {/* Project Card */}
      <section className="max-w-4xl mx-auto px-4 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Link to="/portafolio/chess-manager" className="block group">
            <div className="relative rounded-2xl overflow-hidden shadow-lg">
              <ImageWithFallback
                src={CHESS_IMG}
                alt="Chess Manager"
                className="w-full h-[280px] sm:h-[360px] object-cover group-hover:scale-[1.02] transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-6 left-6">
                <span className="bg-blue-600 text-white text-[11px] px-2.5 py-1 rounded-md mb-2 inline-block" style={{ fontWeight: 500 }}>Web App</span>
                <h3 className="text-white text-xl" style={{ fontWeight: 700 }}>Chess Manager</h3>
              </div>
            </div>
          </Link>
        </motion.div>
      </section>

      {/* FAQ */}
      <section id="faq" className="max-w-4xl mx-auto px-4 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-2xl sm:text-3xl text-gray-900"
              style={{ fontWeight: 700 }}
            >
              Preguntas
              <br />
              Frecuentes
            </motion.h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <FAQItem key={i} question={faq.q} answer={faq.a} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
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
            Agenda una consulta gratuita y descubre cómo podemos ayudarte a crecer con soluciones digitales personalizadas.
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