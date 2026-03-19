import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, CheckCircle, Loader2 } from "lucide-react";

const steps = [
  {
    title: "Completa el formulario",
    description: "Describe tu empresa, industria y el problema que enfrentas. Solo te tomará menos de 5 minutos.",
  },
  {
    title: "IA analiza tu caso",
    description: "Nuestra inteligencia artificial procesa tu información y genera un diagnóstico personalizado.",
  },
  {
    title: "IA genera resultados",
    description: "Obtén un brief detallado, diagrama de flujo y visualizaciones de tu solución tecnológica.",
  },
];

export function DiagnosticoPage() {
  const [formStep, setFormStep] = useState(0); // 0=form, 1=processing, 2=results
  const [formData, setFormData] = useState({
    empresa: "",
    industria: "",
    problema: "",
    tamaño: "",
    presupuesto: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStep(1);
    setTimeout(() => setFormStep(2), 3000);
  };

  return (
    <div className="pb-20">
      {/* Hero */}
      <section className="bg-gradient-to-b from-gray-50 to-[#FCFAF5] pt-12 pb-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 bg-blue-600 text-white text-[11px] px-3 py-1 rounded-full mb-6"
            style={{ fontWeight: 600 }}
          >
            <span>24/7</span>
            <span>Diagnóstico impulsado por IA</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-[44px] text-gray-900 mb-4"
            style={{ fontWeight: 700, lineHeight: 1.15 }}
          >
            Transforma tu negocio
            <br />
            <span className="text-blue-600">con nuevas tecnologías</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-[14px] text-gray-500 mb-8 max-w-lg mx-auto"
          >
            Identifica problemas y descubre soluciones tecnológicas de clase mundial para tu empresa en minutos.
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            onClick={() => document.getElementById("diagnostico-form")?.scrollIntoView({ behavior: "smooth" })}
            className="bg-blue-600 text-white px-6 py-3 rounded-full text-[14px] hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
            style={{ fontWeight: 600 }}
          >
            Iniciar diagnóstico gratuito
          </motion.button>
        </div>
      </section>

      {/* Process Steps */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl text-gray-900 mb-1" style={{ fontWeight: 700 }}>¿Cómo funciona?</h2>
          <p className="text-blue-600 text-xl" style={{ fontWeight: 600 }}>un proceso simple en 3 pasos</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="border border-gray-200 rounded-xl p-6"
            >
              <h3 className="text-[15px] text-gray-900 mb-2" style={{ fontWeight: 700 }}>{step.title}</h3>
              <p className="text-[12px] text-gray-500 leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Form / Processing / Results */}
      <section id="diagnostico-form" className="max-w-2xl mx-auto px-4 pb-16">
        <AnimatePresence mode="wait">
          {formStep === 0 && (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleSubmit}
              className="bg-[#FCFAF5] border border-gray-200 rounded-2xl p-8 shadow-sm"
            >
              <h3 className="text-xl text-gray-900 mb-6" style={{ fontWeight: 700 }}>Completa tu diagnóstico</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-[13px] text-gray-700 mb-1" style={{ fontWeight: 500 }}>Nombre de la empresa</label>
                  <input
                    type="text"
                    required
                    value={formData.empresa}
                    onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[14px] focus:outline-none focus:border-blue-400 transition-colors"
                    placeholder="Ej: Mi Empresa S.A."
                  />
                </div>
                <div>
                  <label className="block text-[13px] text-gray-700 mb-1" style={{ fontWeight: 500 }}>Industria</label>
                  <select
                    required
                    value={formData.industria}
                    onChange={(e) => setFormData({ ...formData, industria: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[14px] focus:outline-none focus:border-blue-400 transition-colors bg-[#FCFAF5]"
                  >
                    <option value="">Selecciona tu industria</option>
                    <option value="tecnologia">Tecnología</option>
                    <option value="comercio">Comercio</option>
                    <option value="servicios">Servicios</option>
                    <option value="manufactura">Manufactura</option>
                    <option value="salud">Salud</option>
                    <option value="educacion">Educación</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[13px] text-gray-700 mb-1" style={{ fontWeight: 500 }}>Tamaño de empresa</label>
                  <select
                    required
                    value={formData.tamaño}
                    onChange={(e) => setFormData({ ...formData, tamaño: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[14px] focus:outline-none focus:border-blue-400 transition-colors bg-[#FCFAF5]"
                  >
                    <option value="">Selecciona el tamaño</option>
                    <option value="1-10">1-10 empleados</option>
                    <option value="11-50">11-50 empleados</option>
                    <option value="51-200">51-200 empleados</option>
                    <option value="200+">200+ empleados</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[13px] text-gray-700 mb-1" style={{ fontWeight: 500 }}>Describe el problema principal</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.problema}
                    onChange={(e) => setFormData({ ...formData, problema: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[14px] focus:outline-none focus:border-blue-400 transition-colors resize-none"
                    placeholder="Describe brevemente el mayor reto que enfrenta tu negocio..."
                  />
                </div>
                <div>
                  <label className="block text-[13px] text-gray-700 mb-1" style={{ fontWeight: 500 }}>Presupuesto estimado</label>
                  <select
                    value={formData.presupuesto}
                    onChange={(e) => setFormData({ ...formData, presupuesto: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[14px] focus:outline-none focus:border-blue-400 transition-colors bg-[#FCFAF5]"
                  >
                    <option value="">Selecciona tu presupuesto</option>
                    <option value="<5k">Menos de $5,000 USD</option>
                    <option value="5k-15k">$5,000 - $15,000 USD</option>
                    <option value="15k-50k">$15,000 - $50,000 USD</option>
                    <option value="50k+">Más de $50,000 USD</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="mt-6 w-full bg-blue-600 text-white py-3 rounded-full text-[14px] hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                style={{ fontWeight: 600 }}
              >
                Generar diagnóstico
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.form>
          )}

          {formStep === 1 && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="bg-[#FCFAF5] border border-gray-200 rounded-2xl p-12 shadow-sm text-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="inline-block mb-6"
              >
                <Loader2 className="w-12 h-12 text-blue-600" />
              </motion.div>
              <h3 className="text-xl text-gray-900 mb-2" style={{ fontWeight: 700 }}>Analizando tu caso...</h3>
              <p className="text-[14px] text-gray-500">Nuestra IA está procesando la información de tu empresa</p>

              <div className="mt-8 max-w-xs mx-auto">
                <motion.div
                  className="h-1.5 bg-gray-100 rounded-full overflow-hidden"
                >
                  <motion.div
                    className="h-full bg-blue-600 rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 3, ease: "easeInOut" }}
                  />
                </motion.div>
              </div>
            </motion.div>
          )}

          {formStep === 2 && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#FCFAF5] border border-gray-200 rounded-2xl p-8 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-6">
                <CheckCircle className="w-8 h-8 text-green-500" />
                <div>
                  <h3 className="text-xl text-gray-900" style={{ fontWeight: 700 }}>Diagnóstico completado</h3>
                  <p className="text-[13px] text-gray-500">Resultados para {formData.empresa || "tu empresa"}</p>
                </div>
              </div>

              <div className="space-y-4">
                <ResultCard
                  title="Análisis de situación"
                  content={`Tu empresa en la industria de ${formData.industria || "servicios"} presenta oportunidades significativas de digitalización. El problema principal que describes puede resolverse con una estrategia digital integral.`}
                />
                <ResultCard
                  title="Soluciones recomendadas"
                  items={[
                    "Implementación de plataforma web responsive con CMS personalizado",
                    "Sistema de automatización de procesos internos",
                    "Integración con herramientas de analytics y monitoreo",
                    "Estrategia de presencia digital y SEO",
                  ]}
                />
                <ResultCard
                  title="Próximos pasos"
                  content="Agenda una consulta gratuita de 30 minutos con nuestro equipo para discutir el plan de implementación personalizado."
                />
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <button
                  className="flex-1 bg-blue-600 text-white py-3 rounded-full text-[14px] hover:bg-blue-700 transition-colors"
                  style={{ fontWeight: 600 }}
                >
                  Agendar consulta gratuita
                </button>
                <button
                  onClick={() => { setFormStep(0); setFormData({ empresa: "", industria: "", problema: "", tamaño: "", presupuesto: "" }); }}
                  className="flex-1 border border-gray-200 text-gray-700 py-3 rounded-full text-[14px] hover:bg-gray-50 transition-colors"
                  style={{ fontWeight: 500 }}
                >
                  Nuevo diagnóstico
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}

function ResultCard({ title, content, items }: { title: string; content?: string; items?: string[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-gray-50 rounded-xl p-5"
    >
      <h4 className="text-[14px] text-gray-900 mb-2" style={{ fontWeight: 600 }}>{title}</h4>
      {content && <p className="text-[13px] text-gray-600 leading-relaxed">{content}</p>}
      {items && (
        <ul className="space-y-1.5">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-[13px] text-gray-600">
              <CheckCircle className="w-3.5 h-3.5 text-blue-600 mt-0.5 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      )}
    </motion.div>
  );
}