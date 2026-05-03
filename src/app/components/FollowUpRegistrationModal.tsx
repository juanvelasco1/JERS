import { AnimatePresence, motion } from "motion/react";
import { Loader2, X } from "lucide-react";

type Step = "choice" | "register";

export function FollowUpRegistrationModal(props: {
  variant?: "overlay" | "side";
  open: boolean;
  onClose: () => void;
  onChooseRegister: () => void;
  step: Step;

  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  passwordConfirm: string;
  setPasswordConfirm: (v: string) => void;

  error: string | null;
  busy: boolean;
  onSubmitRegister: () => void;

  accountLinked: boolean;
  pendingEmailConfirm: boolean;
}) {
  const {
    variant = "overlay",
    open,
    onClose,
    onChooseRegister,
    step,
    email,
    setEmail,
    password,
    setPassword,
    passwordConfirm,
    setPasswordConfirm,
    error,
    busy,
    onSubmitRegister,
    accountLinked,
    pendingEmailConfirm,
  } = props;

  if (variant === "side") {
    return (
      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.18 }}
            className="h-full w-full rounded-tr-2xl rounded-br-2xl border-l border-gray-100 bg-[#FAFBFC] px-5 py-5"
            aria-label="Registro para continuar"
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <p className="text-[10px] text-gray-500 mb-1" style={{ fontWeight: 600, letterSpacing: "0.10em" }}>
                  SIGUIENTE PASO
                </p>
                <h3 className="text-[14px] text-gray-900 leading-snug" style={{ fontWeight: 800 }}>
                  Guardar tu diagnóstico
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="shrink-0 rounded-lg p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100/70 transition-colors"
                aria-label="Cerrar"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-[12px] text-gray-600 leading-relaxed mb-4">
              Si te registras, este diagnóstico y sus recomendaciones quedan enlazados a tu usuario.
            </p>

            {step === "choice" && (
              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={onChooseRegister}
                  className="w-full rounded-xl bg-gray-900 py-2.5 text-[13px] text-white transition-colors hover:bg-gray-800"
                  style={{ fontWeight: 700 }}
                >
                  Registrarme
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full rounded-xl border border-gray-200 bg-white py-2.5 text-[13px] text-gray-700 transition-colors hover:bg-gray-50"
                  style={{ fontWeight: 600 }}
                >
                  No por ahora
                </button>
              </div>
            )}

            {step === "register" && (
              <div className="space-y-3">
                {accountLinked && (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-[12px] text-emerald-950 leading-relaxed">
                    Listo: tu diagnóstico quedó vinculado a tu cuenta.
                  </div>
                )}

                {pendingEmailConfirm && !accountLinked && (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-[12px] text-amber-950 leading-relaxed">
                    Revisa tu correo para confirmar la cuenta. Al iniciar sesión, vincularemos este diagnóstico automáticamente.
                  </div>
                )}

                {!accountLinked && !pendingEmailConfirm && (
                  <form
                    className="space-y-3"
                    onSubmit={(e) => {
                      e.preventDefault();
                      onSubmitRegister();
                    }}
                  >
                    <div>
                      <label htmlFor="followup-email-side" className="block text-[11px] text-gray-600 mb-1" style={{ fontWeight: 700 }}>
                        Correo
                      </label>
                      <input
                        id="followup-email-side"
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-[13px] text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        placeholder="tu@correo.com"
                      />
                    </div>
                    <div>
                      <label htmlFor="followup-password-side" className="block text-[11px] text-gray-600 mb-1" style={{ fontWeight: 700 }}>
                        Contraseña
                      </label>
                      <input
                        id="followup-password-side"
                        type="password"
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-[13px] text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        placeholder="Mínimo 6 caracteres"
                      />
                    </div>
                    <div>
                      <label htmlFor="followup-password2-side" className="block text-[11px] text-gray-600 mb-1" style={{ fontWeight: 700 }}>
                        Confirmar contraseña
                      </label>
                      <input
                        id="followup-password2-side"
                        type="password"
                        autoComplete="new-password"
                        value={passwordConfirm}
                        onChange={(e) => setPasswordConfirm(e.target.value)}
                        className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-[13px] text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    {error && (
                      <p className="text-[12px] text-red-600" role="alert">
                        {error}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={busy}
                      className="w-full rounded-xl bg-gray-900 py-2.5 text-[13px] text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60 flex items-center justify-center gap-2"
                      style={{ fontWeight: 700 }}
                    >
                      {busy ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                          Creando…
                        </>
                      ) : (
                        "Crear cuenta"
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={onClose}
                      className="w-full rounded-xl border border-gray-200 bg-white py-2.5 text-[13px] text-gray-700 transition-colors hover:bg-gray-50"
                      style={{ fontWeight: 600 }}
                    >
                      Cancelar
                    </button>
                  </form>
                )}
              </div>
            )}
          </motion.aside>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
        >
          <motion.button
            type="button"
            className="absolute inset-0 bg-black/50"
            onClick={onClose}
            aria-label="Cerrar"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            className="relative w-full max-w-[520px] rounded-2xl border border-white/10 bg-white shadow-[0_30px_80px_rgba(0,0,0,0.35)] overflow-hidden"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
          >
            <div className="px-5 sm:px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] text-blue-200 mb-1" style={{ fontWeight: 600, letterSpacing: "0.12em" }}>
                    SIGUIENTE PASO
                  </p>
                  <h3 className="text-[16px] sm:text-[18px] leading-tight" style={{ fontWeight: 800 }}>
                    ¿Quieres seguir el proceso con nosotros?
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="shrink-0 rounded-lg p-2 hover:bg-white/10 transition-colors"
                  aria-label="Cerrar modal"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-2 text-[12px] text-blue-100/90 leading-relaxed">
                Si te registras, este diagnóstico y sus recomendaciones quedarán enlazados a tu usuario.
              </p>
            </div>

            <div className="px-5 sm:px-6 py-5">
              {step === "choice" && (
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={onChooseRegister}
                    className="w-full rounded-xl bg-gray-900 py-3 text-[13px] text-white transition-colors hover:bg-gray-800"
                    style={{ fontWeight: 700 }}
                  >
                    Registrarme
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full rounded-xl border border-gray-200 bg-white py-3 text-[13px] text-gray-700 transition-colors hover:bg-gray-50"
                    style={{ fontWeight: 600 }}
                  >
                    No por ahora
                  </button>
                  <p className="text-[11px] text-gray-400 leading-relaxed text-center">
                    Sin compromiso — Tu información es confidencial.
                  </p>
                </div>
              )}

              {step === "register" && (
                <div className="space-y-3">
                  {accountLinked && (
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-[12px] text-emerald-950 leading-relaxed">
                      Listo: tu diagnóstico quedó vinculado a tu cuenta.
                    </div>
                  )}

                  {pendingEmailConfirm && !accountLinked && (
                    <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-[12px] text-amber-950 leading-relaxed">
                      Revisa tu correo para confirmar la cuenta. Al iniciar sesión, vincularemos este diagnóstico a tu usuario de forma
                      automática.
                    </div>
                  )}

                  {!accountLinked && !pendingEmailConfirm && (
                    <form
                      className="space-y-3"
                      onSubmit={(e) => {
                        e.preventDefault();
                        onSubmitRegister();
                      }}
                    >
                      <div>
                        <label htmlFor="followup-email" className="block text-[11px] text-gray-600 mb-1" style={{ fontWeight: 700 }}>
                          Correo (usuario de acceso)
                        </label>
                        <input
                          id="followup-email"
                          type="email"
                          autoComplete="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-[13px] text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          placeholder="tu@correo.com"
                        />
                      </div>
                      <div>
                        <label htmlFor="followup-password" className="block text-[11px] text-gray-600 mb-1" style={{ fontWeight: 700 }}>
                          Contraseña
                        </label>
                        <input
                          id="followup-password"
                          type="password"
                          autoComplete="new-password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-[13px] text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          placeholder="Mínimo 6 caracteres"
                        />
                      </div>
                      <div>
                        <label htmlFor="followup-password2" className="block text-[11px] text-gray-600 mb-1" style={{ fontWeight: 700 }}>
                          Confirmar contraseña
                        </label>
                        <input
                          id="followup-password2"
                          type="password"
                          autoComplete="new-password"
                          value={passwordConfirm}
                          onChange={(e) => setPasswordConfirm(e.target.value)}
                          className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-[13px] text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                      </div>

                      {error && (
                        <p className="text-[12px] text-red-600" role="alert">
                          {error}
                        </p>
                      )}

                      <button
                        type="submit"
                        disabled={busy}
                        className="w-full rounded-xl bg-gray-900 py-3 text-[13px] text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60 flex items-center justify-center gap-2"
                        style={{ fontWeight: 700 }}
                      >
                        {busy ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                            Creando cuenta…
                          </>
                        ) : (
                          "Crear cuenta"
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={onClose}
                        className="w-full rounded-xl border border-gray-200 bg-white py-3 text-[13px] text-gray-700 transition-colors hover:bg-gray-50"
                        style={{ fontWeight: 600 }}
                      >
                        Cancelar
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

