import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router";
import { ChevronDown, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="min-h-dvh min-h-screen flex flex-col bg-[#FCFAF5] w-full max-w-[100vw] overflow-x-hidden">
      <Header mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
      <main className="flex-1 pt-16 min-h-0 min-w-0 w-full overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}

function Header({ mobileMenuOpen, setMobileMenuOpen }: { mobileMenuOpen: boolean; setMobileMenuOpen: (v: boolean) => void }) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const navigate = useNavigate();

  const navItems = [
    { label: "Diagnóstico", hasDropdown: false, href: "/diagnostico" },
    { label: "Portafolio", hasDropdown: false, href: "/portafolio" },
    { label: "Pricing", hasDropdown: false, href: "/pricing" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 bg-[#fcfaf5cc]">
      <div className="w-full max-w-5xl mx-auto px-3 sm:px-6 min-w-0">
        <div className="flex items-center justify-between h-12 gap-2 min-w-0">
          <Link to="/" className="flex items-center gap-1 min-w-0 shrink">
            <span className="text-sm sm:text-[15px] shrink-0" style={{ fontWeight: 700 }}>JERS</span>
            <span className="text-sm sm:text-[15px] text-blue-600 truncate min-w-0">Consultora Digital</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => item.hasDropdown && setOpenDropdown(item.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                {item.hasDropdown ? (
                  <button className="flex items-center gap-0.5 px-3 py-2 text-[13px] text-gray-700 hover:text-black transition-colors rounded-md hover:bg-gray-50">
                    {item.label}
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                ) : item.label === "Diagnóstico" ? (
                  <button onClick={() => navigate("/?diagnostico=true")} className="px-3 py-2 text-[13px] text-gray-700 hover:text-black transition-colors rounded-md hover:bg-gray-50 cursor-pointer">
                    {item.label}
                  </button>
                ) : (
                  <Link to={item.href || "#"} className="px-3 py-2 text-[13px] text-gray-700 hover:text-black transition-colors rounded-md hover:bg-gray-50">
                    {item.label}
                  </Link>
                )}
                {item.hasDropdown && openDropdown === item.label && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full left-0 mt-1 bg-[#FCFAF5] rounded-lg shadow-lg border border-gray-100 py-2 min-w-[180px]"
                  >
                    {item.items?.map((sub) => (
                      <Link
                        key={sub.label}
                        to={sub.href}
                        className="block px-4 py-2 text-[13px] text-gray-600 hover:text-black hover:bg-gray-50 transition-colors"
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </div>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden border-t border-gray-200/50"
          >
            <div className="px-5 py-3 space-y-1">
              <button onClick={() => { setMobileMenuOpen(false); navigate("/?diagnostico=true"); }} className="block py-2 px-3 text-[14px] text-gray-700 rounded-lg hover:bg-gray-100/50 transition-colors cursor-pointer text-left w-full">Diagnóstico</button>
              <Link to="/portafolio" className="block py-2 px-3 text-[14px] text-gray-700 rounded-lg hover:bg-gray-100/50 transition-colors" onClick={() => setMobileMenuOpen(false)}>Portafolio</Link>
              <Link to="/pricing" className="block py-2 px-3 text-[14px] text-gray-700 rounded-lg hover:bg-gray-100/50 transition-colors" onClick={() => setMobileMenuOpen(false)}>Pricing</Link>
              <Link to="/terminos" className="block py-2 px-3 text-[14px] text-gray-700 rounded-lg hover:bg-gray-100/50 transition-colors" onClick={() => setMobileMenuOpen(false)}>Términos</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-[#FCFAF5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-1 mb-4">
              <span className="text-[15px]" style={{ fontWeight: 700 }}>JERS</span>
              <span className="text-[15px] text-blue-600">Consultora Digital</span>
            </Link>
            <p className="text-[12px] text-gray-500 leading-relaxed">
              Especializados en diseño UI/UX y desarrollo web. Transformamos negocios familiares y startups con soluciones digitales personalizadas que generan resultados reales.
            </p>
          </div>

          {/* Servicios */}
          <div>
            <h4 className="text-[13px] text-gray-900 mb-4" style={{ fontWeight: 600 }}>Servicios</h4>
            <ul className="space-y-2">
              {["Análisis de negocio", "Diseño UI/UX", "Desarrollo web", "Hosting en Hostinger", "Soporte continuo"].map((item) => (
                <li key={item}><a href="#" className="text-[12px] text-gray-500 hover:text-blue-600 transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>

          {/* Template Pages */}
          <div>
            <h4 className="text-[13px] text-gray-900 mb-4" style={{ fontWeight: 600 }}>Template Pages</h4>
            <ul className="space-y-2">
              {[
                { label: "Inicio", href: "/" },
                { label: "Sobre Nosotros", href: "#" },
                { label: "Portafolio", href: "/portafolio" },
                { label: "Contacto", href: "/contacto" },
                { label: "FAQS", href: "/portafolio#faq" },
              ].map((item) => (
                <li key={item.label}><Link to={item.href} className="text-[12px] text-gray-500 hover:text-blue-600 transition-colors">{item.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Redes sociales */}
          <div>
            <h4 className="text-[13px] text-gray-900 mb-4" style={{ fontWeight: 600 }}>Redes sociales</h4>
            <ul className="space-y-2">
              {[
                { label: 'Instagram', href: 'https://www.instagram.com/consultora_jers?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==' },
                { label: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61581946824749&rdid=uMi7DUDw5VlKmtc0&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1NCyLJJYRQ%2F#' },
                { label: 'LinkedIn', href: 'https://www.linkedin.com/company/jers-consultora-digital/' },
              ].map((item) => (
                <li key={item.label}><a href={item.href} target="_blank" rel="noreferrer" className="text-[12px] text-gray-500 hover:text-blue-600 transition-colors">{item.label}</a></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-gray-400">© 2025 JERS Consultora Digital. Todos los derechos reservados.</p>
          <div className="flex items-center gap-6">
            <Link to="/terminos" className="text-[11px] text-gray-400 hover:text-gray-600 transition-colors">Términos y Condiciones</Link>
            <a href="#" className="text-[11px] text-gray-400 hover:text-gray-600 transition-colors">Políticas de privacidad</a>
          </div>
        </div>
      </div>
    </footer>
  );
}