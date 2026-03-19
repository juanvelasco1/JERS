import { motion } from "motion/react";

export function TerminosPage() {
  return (
    <div className="pb-20">
      <section className="max-w-3xl mx-auto px-4 pt-12">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 bg-blue-600 text-white text-[11px] px-3 py-1 rounded-full mb-6"
          style={{ fontWeight: 600 }}
        >
          Legal
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-4xl text-gray-900 mb-4"
          style={{ fontWeight: 700 }}
        >
          Términos y condiciones
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-[13px] text-gray-400 mb-8"
        >
          Última actualización: 15 de enero, 2025
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="prose prose-sm max-w-none"
        >
          <div className="space-y-6 text-[13px] text-gray-600 leading-relaxed">
            <div>
              <h2 className="text-[15px] text-gray-900 mb-2" style={{ fontWeight: 600 }}>1. Introducción</h2>
              <p>
                Bienvenido a JERS Consultora Digital. Al acceder y utilizar nuestros servicios, usted acepta cumplir con estos Términos y Condiciones. Le recomendamos leerlos cuidadosamente antes de utilizar nuestro sitio web o contratar nuestros servicios.
              </p>
            </div>

            <div>
              <h2 className="text-[15px] text-gray-900 mb-2" style={{ fontWeight: 600 }}>2. Servicios</h2>
              <p>
                JERS Consultora Digital ofrece servicios de consultoría en diseño UI/UX, desarrollo web, análisis de negocio y transformación digital. Nuestros servicios incluyen pero no se limitan a:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Diseño y desarrollo de sitios web y aplicaciones web</li>
                <li>Consultoría en estrategia digital</li>
                <li>Diagnóstico empresarial con inteligencia artificial</li>
                <li>Hosting y mantenimiento de plataformas digitales</li>
                <li>Análisis de experiencia de usuario</li>
              </ul>
            </div>

            <div>
              <h2 className="text-[15px] text-gray-900 mb-2" style={{ fontWeight: 600 }}>3. Uso del sitio web</h2>
              <p>
                Al utilizar este sitio web, usted se compromete a no utilizar el contenido para fines ilícitos, no intentar acceder a áreas restringidas del sitio, no reproducir, duplicar, copiar, vender o explotar cualquier parte del sitio sin autorización expresa.
              </p>
            </div>

            <div>
              <h2 className="text-[15px] text-gray-900 mb-2" style={{ fontWeight: 600 }}>4. Propiedad intelectual</h2>
              <p>
                Todo el contenido presente en este sitio web, incluyendo pero no limitado a textos, gráficos, logos, imágenes, clips de audio, descargas digitales y compilaciones de datos, es propiedad de JERS Consultora Digital o de sus proveedores de contenido y está protegido por las leyes de propiedad intelectual aplicables.
              </p>
            </div>

            <div>
              <h2 className="text-[15px] text-gray-900 mb-2" style={{ fontWeight: 600 }}>5. Limitación de responsabilidad</h2>
              <p>
                JERS Consultora Digital no será responsable de ningún daño directo, indirecto, incidental, especial o consecuente que resulte del uso o la imposibilidad de usar nuestros servicios o sitio web. Esto incluye, sin limitación, daños por pérdida de beneficios, datos u otras pérdidas intangibles.
              </p>
            </div>

            <div>
              <h2 className="text-[15px] text-gray-900 mb-2" style={{ fontWeight: 600 }}>6. Política de privacidad</h2>
              <p>
                La recopilación y uso de información personal se rige por nuestra Política de Privacidad, que forma parte integral de estos Términos y Condiciones. Al utilizar nuestros servicios, usted acepta las prácticas descritas en dicha política.
              </p>
            </div>

            <div>
              <h2 className="text-[15px] text-gray-900 mb-2" style={{ fontWeight: 600 }}>7. Modificaciones</h2>
              <p>
                JERS Consultora Digital se reserva el derecho de modificar estos Términos y Condiciones en cualquier momento. Las modificaciones entrarán en vigor inmediatamente después de su publicación en el sitio web. El uso continuado del sitio después de dichas modificaciones constituye su aceptación de los nuevos términos.
              </p>
            </div>

            <div>
              <h2 className="text-[15px] text-gray-900 mb-2" style={{ fontWeight: 600 }}>8. Contacto</h2>
              <p>
                Si tiene preguntas sobre estos Términos y Condiciones, puede contactarnos a través de nuestro formulario de contacto en el sitio web o enviarnos un correo electrónico a contacto@jersconsultora.com.
              </p>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
