import { Link } from "react-router";
import { motion } from "motion/react";
import { Sparkles, Heart, Gauge, TrendingUp, Menu, X } from "lucide-react";
import { useState } from "react";

/** Azul marca del layout maestro (referencia visual). */
const BRAND = "#2563EB";
const BRAND_DEEP = "#1D4ED8";
const CREAM = "#F9F8F3";
const CHARCOAL = "#171717";

const heroStats = [
  { label: "Rol", value: "Consultora" },
  { label: "Sede", value: "Santiago de Cali" },
  { label: "Año", value: "2023" },
  { label: "Proyectos", value: "10+" },
];

const founders = [
  {
    initials: "SR",
    name: "Sergio Restrepo Prado",
    role: "Co-founder & Chief Designer",
    bio: "Diseñador enfocado en producto digital y sistemas visuales. Lidera la dirección creativa y la coherencia de marca en cada entrega.",
  },
  {
    initials: "JV",
    name: "Juan Esteban Velasco",
    role: "Co-founder & Lead Dev",
    bio: "Especialista en desarrollo front-end e integración de IA. Impulsa la arquitectura técnica y la calidad del software.",
  },
];

const valores = [
  {
    icon: Sparkles,
    title: "Innovación constante",
    text: "Exploramos herramientas y metodologías nuevas para mantener soluciones al día con el mercado.",
  },
  {
    icon: Heart,
    title: "Liderazgo centrado en el humano",
    text: "Decisiones guiadas por las personas que usan el producto y por el impacto en sus negocios.",
  },
  {
    icon: Gauge,
    title: "Agilidad estratégica",
    text: "Ciclos cortos, entregas claras y priorización continua sin sacrificar rigor.",
  },
  {
    icon: TrendingUp,
    title: "Impacto real en el negocio",
    text: "Medimos el éxito en resultados medibles: conversión, tiempo ahorrado y crecimiento digital.",
  },
];

const servicios = [
  {
    title: "Diseño de interfaces y experiencia",
    items: ["Diseño UI/UX", "Prototipado interactivo", "Design systems", "Auditorías de usabilidad"],
  },
  {
    title: "Desarrollo y arquitectura",
    items: ["Sitios y landings", "Apps web progresivas", "Front-end escalable", "Integraciones y APIs"],
  },
  {
    title: "Marketing y publicidad digital",
    items: ["Pauta en redes", "Estrategia de contenidos", "SEO técnico y on-page", "Analítica y reporting"],
  },
  {
    title: "Estrategia digital",
    items: ["Consultoría y diagnóstico", "Transformación digital", "Roadmaps de producto", "Modelos de negocio"],
  },
];

const trayectoria = [
  { year: "2023", title: "Fundación de JERS", desc: "Arrancamos en Santiago de Cali con foco en diseño y producto digital." },
  { year: "2023—24", title: "Primeros 10 proyectos", desc: "Consolidamos procesos, plantillas y un portafolio con clientes reales." },
  { year: "Hoy", title: "Expansión digital", desc: "Diagnóstico con IA, automatización y soluciones más integrales." },
];

const IMG_OFICINA =
  "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=960&q=80";
const IMG_CIUDAD =
  "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=1400&q=80";

function ConocenosFooter() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          <div>
            <Link to="/" className="flex flex-wrap items-center gap-1 mb-4">
              <span className="text-[15px]" style={{ fontWeight: 700 }}>
                JERS
              </span>
              <span className="text-[15px]" style={{ fontWeight: 700, color: BRAND }}>
                Consultora Digital
              </span>
            </Link>
            <p className="text-[12px] text-gray-500 leading-relaxed">
              Especializados en diseño UI/UX y desarrollo web. Transformamos negocios y startups con soluciones digitales
              personalizadas.
            </p>
          </div>
          <div>
            <h4 className="text-[13px] text-gray-900 mb-3" style={{ fontWeight: 600 }}>
              Empresa
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/conocenos" className="text-[12px] text-gray-500 hover:text-blue-600 transition-colors">
                  Sobre nosotros
                </Link>
              </li>
              <li>
                <Link to="/contacto" className="text-[12px] text-gray-500 hover:text-blue-600 transition-colors">
                  Contacto
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-[12px] text-gray-500 hover:text-blue-600 transition-colors">
                  Precios
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-[13px] text-gray-900 mb-3" style={{ fontWeight: 600 }}>
              Soluciones
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/?diagnostico=true" className="text-[12px] text-gray-500 hover:text-blue-600 transition-colors">
                  Diagnóstico digital
                </Link>
              </li>
              <li>
                <Link to="/portafolio" className="text-[12px] text-gray-500 hover:text-blue-600 transition-colors">
                  Portafolio
                </Link>
              </li>
              <li>
                <Link to="/diagnostico" className="text-[12px] text-gray-500 hover:text-blue-600 transition-colors">
                  Proceso
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-[13px] text-gray-900 mb-3" style={{ fontWeight: 600 }}>
              Información legal
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/terminos" className="text-[12px] text-gray-500 hover:text-blue-600 transition-colors">
                  Términos y condiciones
                </Link>
              </li>
              <li>
                <a href="#" className="text-[12px] text-gray-500 hover:text-blue-600 transition-colors">
                  Políticas de privacidad
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-gray-400">© {new Date().getFullYear()} JERS Consultora Digital. Todos los derechos reservados.</p>
          <div className="flex items-center gap-6">
            <a
              href="https://www.instagram.com/consultora_jers"
              target="_blank"
              rel="noreferrer"
              className="text-[11px] text-gray-400 hover:text-blue-600 transition-colors"
            >
              Instagram
            </a>
            <a
              href="https://www.linkedin.com/company/jers-consultora-digital/"
              target="_blank"
              rel="noreferrer"
              className="text-[11px] text-gray-400 hover:text-blue-600 transition-colors"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function ConocenosPage() {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="min-h-dvh min-h-screen bg-white text-gray-900 antialiased">
      {/* Hero + barra superior (pantalla completa ancho viewport) */}
      <header className="relative text-white" style={{ background: `linear-gradient(165deg, ${BRAND_DEEP} 0%, ${BRAND} 55%, #3B82F6 100%)` }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-5 pb-16 sm:pb-24">
          <div className="flex items-center justify-between gap-4 mb-10 sm:mb-14">
            <Link to="/" className="flex flex-wrap items-center gap-1.5 shrink-0">
              <span className="text-[15px] sm:text-[16px]" style={{ fontWeight: 700 }}>
                JERS
              </span>
              <span className="text-[13px] sm:text-[14px] text-white/90" style={{ fontWeight: 600 }}>
                Consultora Digital
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-8 text-[13px] text-white/90" style={{ fontWeight: 500 }}>
              <a href="#proposito" className="hover:text-white transition-colors">
                Propósito
              </a>
              <a href="#equipo" className="hover:text-white transition-colors">
                Nuestro equipo
              </a>
              <Link to="/pricing" className="hover:text-white transition-colors">
                Precios
              </Link>
            </nav>

            <button
              type="button"
              className="md:hidden p-2 rounded-lg text-white/90 hover:bg-white/10"
              aria-label="Menú"
              onClick={() => setNavOpen((v) => !v)}
            >
              {navOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {navOpen && (
            <div className="md:hidden border-t border-white/15 py-4 space-y-3 text-[14px] text-white/95 mb-8">
              <a href="#proposito" className="block py-1" onClick={() => setNavOpen(false)}>
                Propósito
              </a>
              <a href="#equipo" className="block py-1" onClick={() => setNavOpen(false)}>
                Nuestro equipo
              </a>
              <Link to="/pricing" className="block py-1" onClick={() => setNavOpen(false)}>
                Precios
              </Link>
            </div>
          )}

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
            <span className="inline-block rounded-full border border-white/35 bg-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-white/95 mb-4">
              Sobre nosotros
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl max-w-3xl leading-tight mb-3" style={{ fontWeight: 800 }}>
              JERS Consultora Digital
            </h1>
            <p className="text-lg sm:text-xl text-white/90 mb-6 max-w-2xl" style={{ fontWeight: 600 }}>
              Creciendo de forma exponencial
            </p>
            <p id="proposito" className="text-[15px] sm:text-[16px] text-white/85 max-w-2xl leading-relaxed mb-10 sm:mb-12 scroll-mt-24">
              Consultora colombiana especializada en transformación digital y consultoría estratégica. Unimos diseño,
              tecnología e inteligencia artificial para lanzar productos digitales con impacto medible en tu negocio.
            </p>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {heroStats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-white/25 bg-white/10 backdrop-blur-sm px-4 py-4 sm:py-5"
                >
                  <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.12em] text-white/70 mb-1" style={{ fontWeight: 600 }}>
                    {s.label}
                  </p>
                  <p className="text-[15px] sm:text-[17px]" style={{ fontWeight: 700 }}>
                    {s.value}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </header>

      {/* Origen */}
      <section id="origen" className="scroll-mt-20 py-14 sm:py-20" style={{ backgroundColor: CREAM }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <div>
            <p className="text-[11px] uppercase tracking-[0.14em] mb-2" style={{ fontWeight: 600, color: BRAND }}>
              Nuestra historia
            </p>
            <h2 className="text-2xl sm:text-3xl text-gray-900 mb-5" style={{ fontWeight: 800 }}>
              Origen y enfoque
            </h2>
            <div className="space-y-4 text-[15px] text-gray-600 leading-relaxed">
              <p>
                Nacimos como respuesta a negocios que necesitan evolucionar rápido sin perder identidad: combinamos
                pensamiento de diseño, ingeniería front-end y uso práctico de IA para acelerar entregas sin bajar la
                calidad.
              </p>
              <p>
                Trabajamos cerca de founders y equipos locales; entendemos contexto, presupuesto y urgencia. Cada
                propuesta es accionable: prototipos claros, prioridades visibles y un roadmap que puedes ejecutar.
              </p>
              <p>
                Nos posicionamos como socios digitales: menos slides, más producto. Interfaces que convierten, sitios
                que cargan rápido y automatizaciones que recuperan horas de tu semana.
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-xl ring-1 ring-black/5 aspect-[4/3]">
              <img src={IMG_OFICINA} alt="Equipo trabajando en espacio digital" className="h-full w-full object-cover" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      {/* Equipo */}
      <section id="equipo" className="scroll-mt-20 py-14 sm:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
            <p className="text-[11px] uppercase tracking-[0.14em] mb-2" style={{ fontWeight: 600, color: BRAND }}>
              Fundadores
            </p>
            <h2 className="text-2xl sm:text-3xl text-gray-900 mb-3" style={{ fontWeight: 800 }}>
              El equipo detrás de JERS
            </h2>
            <p className="text-[14px] sm:text-[15px] text-gray-500">
              Diseñadores y builders colombianos con experiencia en innovación digital y producto.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {founders.map((f) => (
              <div
                key={f.initials}
                className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-8 shadow-[0_8px_40px_-12px_rgba(15,23,42,0.12)]"
              >
                <div className="flex items-start gap-4 mb-5">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center text-white text-[13px] shrink-0"
                    style={{ background: `linear-gradient(135deg, ${BRAND} 0%, ${BRAND_DEEP} 100%)`, fontWeight: 800 }}
                  >
                    {f.initials}
                  </div>
                  <div>
                    <h3 className="text-lg text-gray-900" style={{ fontWeight: 800 }}>
                      {f.name}
                    </h3>
                    <p className="text-[13px] mt-0.5" style={{ fontWeight: 600, color: BRAND }}>
                      {f.role}
                    </p>
                  </div>
                </div>
                <p className="text-[14px] text-gray-600 leading-relaxed">{f.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="py-14 sm:py-20" style={{ backgroundColor: CREAM }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
            <p className="text-[11px] uppercase tracking-[0.14em] mb-2" style={{ fontWeight: 600, color: BRAND }}>
              Cultura
            </p>
            <h2 className="text-2xl sm:text-3xl text-gray-900" style={{ fontWeight: 800 }}>
              Lo que nos guía
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-5 lg:gap-6">
            {valores.map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="flex gap-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm"
              >
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${BRAND}14`, color: BRAND }}
                >
                  <Icon className="w-5 h-5" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-[16px] text-gray-900 mb-1.5" style={{ fontWeight: 700 }}>
                    {title}
                  </h3>
                  <p className="text-[13px] sm:text-[14px] text-gray-600 leading-relaxed">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Servicios */}
      <section className="py-14 sm:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
            <p className="text-[11px] uppercase tracking-[0.14em] mb-2" style={{ fontWeight: 600, color: BRAND }}>
              Capacidades
            </p>
            <h2 className="text-2xl sm:text-3xl text-gray-900" style={{ fontWeight: 800 }}>
              Propuesta de valor
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-5 lg:gap-6">
            {servicios.map((block) => (
              <div key={block.title} className="rounded-3xl border border-gray-100 bg-[#FAFAF9] p-6 sm:p-7">
                <h3 className="text-[16px] text-gray-900 mb-4" style={{ fontWeight: 700 }}>
                  {block.title}
                </h3>
                <ul className="space-y-2.5">
                  {block.items.map((item) => (
                    <li key={item} className="flex gap-2 text-[13px] sm:text-[14px] text-gray-600">
                      <span style={{ color: BRAND }}>·</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trayectoria */}
      <section className="py-14 sm:py-20" style={{ backgroundColor: CREAM }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <p className="text-[11px] uppercase tracking-[0.14em] mb-2" style={{ fontWeight: 600, color: BRAND }}>
              Trayectoria
            </p>
            <h2 className="text-2xl sm:text-3xl text-gray-900" style={{ fontWeight: 800 }}>
              Nuestro camino
            </h2>
          </div>
          <div className="space-y-4 max-w-3xl mx-auto">
            {trayectoria.map((t) => (
              <div
                key={t.title}
                className="rounded-3xl border border-gray-100 bg-white px-6 py-5 sm:px-8 sm:py-6 shadow-sm flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-8"
              >
                <span
                  className="text-[13px] sm:text-sm uppercase tracking-wider text-white rounded-2xl px-4 py-2 shrink-0 self-start sm:self-center"
                  style={{ background: BRAND, fontWeight: 700 }}
                >
                  {t.year}
                </span>
                <div>
                  <h3 className="text-[17px] text-gray-900 mb-1" style={{ fontWeight: 700 }}>
                    {t.title}
                  </h3>
                  <p className="text-[14px] text-gray-600 leading-relaxed">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comunidad */}
      <section className="text-white py-14 sm:py-20" style={{ background: `linear-gradient(165deg, ${BRAND_DEEP} 0%, ${BRAND} 100%)` }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <div>
            <h2 className="text-2xl sm:text-3xl mb-4" style={{ fontWeight: 800 }}>
              Conectados con la comunidad
            </h2>
            <p className="text-[15px] text-white/85 leading-relaxed mb-6">
              Participamos en iniciativas locales, compartimos conocimiento en redes y colaboramos con otros equipos que
              impulsan emprendimiento y cultura digital en Colombia — con base en el ecosistema de Cali.
            </p>
            <div className="inline-flex items-center gap-2 rounded-2xl border border-white/25 bg-white/10 px-4 py-3 text-[13px] text-white/90">
              <span className="font-semibold">JERS</span>
              <span className="text-white/60">·</span>
              <span>Impacto local + alcance digital</span>
            </div>
          </div>
          <div className="rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/20 aspect-[16/11]">
            <img src={IMG_CIUDAD} alt="Ciudad y comunidad" className="h-full w-full object-cover" loading="lazy" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20" style={{ backgroundColor: CREAM }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div
            className="rounded-[1.75rem] px-6 py-10 sm:px-10 sm:py-12 text-white shadow-2xl"
            style={{ backgroundColor: CHARCOAL }}
          >
            <h2 className="text-2xl sm:text-3xl mb-3" style={{ fontWeight: 800 }}>
              Trabajemos juntos
            </h2>
            <p className="text-[14px] sm:text-[15px] text-white/75 mb-8 max-w-lg mx-auto leading-relaxed">
              Cuéntanos tu reto: te proponemos un plan claro con alcance, tiempos y próximos pasos.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/?diagnostico=true"
                className="inline-flex justify-center items-center rounded-2xl px-7 py-3.5 text-[14px] text-white transition-opacity hover:opacity-95"
                style={{ background: BRAND, fontWeight: 700 }}
              >
                Agendar una cita
              </Link>
            </div>
          </div>
          <p className="mt-8">
            <Link to="/" className="text-[13px] text-gray-500 hover:text-blue-600 transition-colors" style={{ fontWeight: 600 }}>
              ← Volver al inicio
            </Link>
          </p>
        </div>
      </section>

      <ConocenosFooter />
    </div>
  );
}
