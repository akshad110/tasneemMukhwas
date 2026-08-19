import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useId, useState, type FormEvent } from 'react'
import { useAuth } from '../context/AuthContext'
import { ApiRequestError, warmApi } from '../lib/api'
import { APP_ROUTES, navigateApp } from '../lib/appRoutes'
import { scrollAppToTop } from '../lib/scrollControl'
import BrandLogo from '../components/shared/BrandLogo'
import BrandNameLockup from '../components/shared/BrandNameLockup'

const INK = '#0a2e22'
const CREAM = '#f2f4f5'
const GOLD = '#b8860b'
const TEXTURE = '/image.png_2K_202608092240.jpeg'

const FLOAT_PACKS = [
  { src: '/products/shahi-mukhwas.png', alt: 'Shahi Mukhwas', x: '8%', y: '10%', rot: -18, scale: 1.05, delay: 0 },
  { src: '/products/mango-slice-mukhwas.png', alt: 'Mango Slice', x: '58%', y: '6%', rot: 14, scale: 0.92, delay: 0.15 },
  { src: '/products/paan-shots-mukhwas.png', alt: 'Paan Shots', x: '28%', y: '46%', rot: -8, scale: 1.12, delay: 0.28 },
  { src: '/products/alsi-til-mukhwas.png', alt: 'Alsi Til', x: '62%', y: '50%', rot: 22, scale: 0.88, delay: 0.4 },
] as const

export type AuthMode = 'login' | 'signup'

const ease = [0.22, 1, 0.36, 1] as const

type AuthPageProps = {
  initialMode?: AuthMode
}

/**
 * Full-bleed Login / Signup — left visual + right form touch the viewport edges.
 * Compact signup so the form fits without scrolling on typical laptop heights.
 */
export default function AuthPage({ initialMode = 'login' }: AuthPageProps) {
  const formId = useId()
  const { login, register } = useAuth()
  const [mode, setMode] = useState<AuthMode>(initialMode)
  const [showPass, setShowPass] = useState(false)
  const [done, setDone] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [doneAsAdmin, setDoneAsAdmin] = useState(false)

  const compact = mode === 'signup'
  const fieldClass = compact
    ? 'w-full rounded-none border border-[#0a2e22]/20 bg-white/80 px-3 py-2 text-[0.84rem] outline-none transition focus:border-[#0a2e22] focus:bg-white'
    : 'w-full rounded-none border border-[#0a2e22]/20 bg-white/80 px-3.5 py-2.5 text-[0.9rem] outline-none transition focus:border-[#0a2e22] focus:bg-white'

  useEffect(() => {
    setMode(initialMode)
    setDone(false)
    setSubmitting(false)
    setShowPass(false)
    setError('')
    setDoneAsAdmin(false)
    document.title =
      initialMode === 'signup'
        ? 'Sign up · Tasneem Mukhwas'
        : 'Login · Tasneem Mukhwas'
  }, [initialMode])

  useEffect(() => {
    scrollAppToTop(true)
    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
    void warmApi()
    return () => {
      document.documentElement.style.removeProperty('overflow')
      document.body.style.removeProperty('overflow')
    }
  }, [])

  const goHome = () => {
    document.title = 'Tasneem Mukhwas'
    navigateApp(APP_ROUTES.home)
  }

  const switchMode = (next: AuthMode) => {
    setMode(next)
    setDone(false)
    navigateApp(next === 'signup' ? APP_ROUTES.signup : APP_ROUTES.login)
  }

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    const fd = new FormData(e.currentTarget)
    const email = String(fd.get('email') || '').trim()
    const password = String(fd.get('password') || '')

    const maxAttempts = 5
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        if (mode === 'login') {
          const user = await login(email, password)
          setDoneAsAdmin(user.role === 'admin')
          setDone(true)
          if (user.role === 'admin') {
            navigateApp(APP_ROUTES.admin)
            return
          }
        } else {
          await register({
            name: String(fd.get('name') || '').trim(),
            phone: String(fd.get('phone') || '').trim(),
            email,
            password,
          })
          setDoneAsAdmin(false)
          setDone(true)
        }
        setSubmitting(false)
        return
      } catch (err) {
        const retryable = err instanceof ApiRequestError && err.status === 0
        if (retryable && attempt < maxAttempts - 1) {
          await warmApi(4)
          continue
        }
        setError(err instanceof ApiRequestError ? err.message : 'Authentication failed')
        break
      }
    }
    setSubmitting(false)
  }

  return (
    <main
      className="fixed inset-0 z-[70] flex h-svh w-svw overflow-hidden"
      style={{ backgroundColor: CREAM }}
      aria-label={mode === 'login' ? 'Login' : 'Sign up'}
    >
      {/* —— Left: full-height brand stage —— */}
      <motion.aside
        className="relative hidden h-full w-1/2 shrink-0 overflow-hidden lg:block"
        style={{ backgroundColor: INK }}
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease }}
      >
        <img
          src={TEXTURE}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover brightness-[0.85] saturate-[0.9]"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 70% 60% at 40% 40%, rgba(184,134,11,0.22) 0%, transparent 55%), linear-gradient(165deg, rgba(10,46,34,0.35) 0%, rgba(6,22,16,0.75) 100%)',
          }}
        />
        <div
          className="pointer-events-none absolute bottom-[-8%] left-1/2 h-[40%] w-[88%] -translate-x-1/2 rounded-[100%] blur-3xl"
          style={{ background: 'rgba(184,134,11,0.28)' }}
        />

        <div
          className="absolute inset-0"
          style={{ perspective: '1200px', transformStyle: 'preserve-3d' }}
        >
          {FLOAT_PACKS.map((pack) => (
            <motion.div
              key={pack.src}
              className="absolute"
              style={{
                left: pack.x,
                top: pack.y,
                width: '36%',
                transformStyle: 'preserve-3d',
              }}
              initial={{ opacity: 0, y: 40, rotateZ: pack.rot }}
              animate={{
                opacity: 1,
                y: [0, -14, 0],
                rotateZ: pack.rot,
                rotateY: [0, 8, 0],
              }}
              transition={{
                opacity: { duration: 0.6, delay: 0.2 + pack.delay },
                y: {
                  duration: 4.2 + pack.delay,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: pack.delay,
                },
                rotateY: {
                  duration: 5.5 + pack.delay,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: pack.delay,
                },
              }}
            >
              <img
                src={pack.src}
                alt={pack.alt}
                draggable={false}
                className="h-auto w-full select-none drop-shadow-[0_28px_40px_rgba(0,0,0,0.55)]"
                style={{
                  transform: `scale(${pack.scale})`,
                  filter: 'drop-shadow(0 18px 24px rgba(0,0,0,0.35))',
                }}
              />
            </motion.div>
          ))}
        </div>

        <div className="absolute inset-x-0 top-0 z-10 flex items-center gap-3 p-8 xl:p-10">
          <BrandLogo className="h-16 w-12 object-contain drop-shadow-lg" alt="Tasneem Mukhwas" />
          <BrandNameLockup size="md" />
        </div>

        <div className="absolute inset-x-0 bottom-0 z-10 p-8 xl:p-10">
          <p
            className="m-0 text-[0.65rem] font-semibold tracking-[0.2em] uppercase"
            style={{ color: GOLD, fontFamily: 'Inter, sans-serif' }}
          >
            Tasneem Mukhwas
          </p>
          <h1
            className="mt-2 m-0 max-w-md text-[clamp(1.75rem,3vw,2.4rem)] leading-[1.08]"
            style={{
              color: CREAM,
              fontFamily: 'Anton, Impact, sans-serif',
              letterSpacing: '0.02em',
            }}
          >
            Tradition that freshens every bite.
          </h1>
          <p
            className="mt-2 m-0 max-w-sm text-[0.85rem] leading-relaxed opacity-70"
            style={{ color: CREAM, fontFamily: 'Inter, sans-serif' }}
          >
            Sign in to save favourites, track wholesale enquiries, and order faster.
          </p>
        </div>
      </motion.aside>

      {/* —— Right: full-height form —— */}
      <motion.section
        className="relative flex h-full w-full flex-col overflow-hidden lg:w-1/2"
        style={{ backgroundColor: CREAM }}
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease }}
      >
        <button
          type="button"
          onClick={goHome}
          className="absolute top-4 right-4 z-20 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-[#0a2e22]/12 bg-white/70 transition hover:bg-white sm:top-5 sm:right-5"
          style={{ color: INK }}
          aria-label="Back to home"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          </svg>
        </button>

        <div
          className={`flex h-full flex-col items-center justify-center px-5 sm:px-10 xl:px-14 ${
            compact ? 'py-6' : 'py-8'
          }`}
        >
          <div className="flex w-full max-w-[340px] flex-col items-stretch">
          <div className={`mb-4 flex items-center justify-center gap-2.5 lg:hidden ${compact ? 'mb-3' : ''}`}>
            <BrandLogo className="h-11 w-9 object-contain" alt="Tasneem Mukhwas" />
            <BrandNameLockup size="sm" />
          </div>

          {/* Segmented toggle — sliding ink block */}
          <div
            className={`relative grid w-full grid-cols-2 border border-[#0a2e22]/15 ${compact ? 'mb-4' : 'mb-6'}`}
            style={{ backgroundColor: 'rgba(10,46,34,0.06)' }}
            role="tablist"
            aria-label="Auth mode"
          >
            <motion.div
              className="absolute inset-y-0 w-1/2"
              style={{ backgroundColor: INK }}
              initial={false}
              animate={{ x: mode === 'signup' ? '100%' : '0%' }}
              transition={{ type: 'spring', stiffness: 420, damping: 34, mass: 0.6 }}
              aria-hidden
            />
            {(['login', 'signup'] as const).map((m) => {
              const active = mode === m
              return (
                <button
                  key={m}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => switchMode(m)}
                  className="relative z-10 cursor-pointer border-0 bg-transparent py-2.5 text-[0.72rem] font-semibold tracking-wide uppercase transition-colors duration-200 sm:text-[0.78rem]"
                  style={{
                    color: active ? CREAM : INK,
                    fontFamily: 'Inter, sans-serif',
                  }}
                >
                  {m === 'login' ? 'Login' : 'Sign up'}
                </button>
              )
            })}
          </div>

          <h2
            id={`${formId}-title`}
            className={`m-0 text-center leading-tight ${compact ? 'text-[1.45rem] sm:text-[1.7rem]' : 'text-[clamp(1.55rem,2.6vw,2rem)]'}`}
            style={{ color: INK, fontFamily: 'Anton, Impact, sans-serif' }}
          >
            {done
              ? mode === 'login'
                ? 'Welcome back'
                : 'Account ready'
              : mode === 'login'
                ? 'Welcome back'
                : 'Create account'}
          </h2>
          <p
            className={`m-0 text-center leading-relaxed opacity-65 ${compact ? 'mt-1 text-[0.78rem]' : 'mt-1.5 text-[0.86rem]'}`}
            style={{ color: INK, fontFamily: 'Inter, sans-serif' }}
          >
            {done
              ? mode === 'login'
                ? doneAsAdmin
                  ? 'You are signed in as admin.'
                  : 'You are signed in. Continue shopping with Tasneem.'
                : 'Your account is ready. Continue shopping with Tasneem.'
              : mode === 'login'
                ? 'Enter your details to continue shopping with Tasneem.'
                : 'Join for wholesale updates, favourites, and faster checkout.'}
          </p>

          <AnimatePresence mode="wait">
            {done ? (
              <motion.div
                key="done"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-6 w-full"
              >
                <div
                  className="rounded-none border px-4 py-4"
                  style={{
                    borderColor: 'rgba(184,134,11,0.35)',
                    background:
                      'linear-gradient(145deg, rgba(184,134,11,0.12), rgba(242,244,245,0.5))',
                  }}
                >
                  <p
                    className="m-0 text-[0.9rem] font-semibold"
                    style={{ color: INK, fontFamily: 'Inter, sans-serif' }}
                  >
                    {mode === 'login' ? 'Signed in' : 'Signed up'}
                  </p>
                  <p
                    className="mt-1 m-0 text-[0.78rem] opacity-70"
                    style={{ color: INK, fontFamily: 'Inter, sans-serif' }}
                  >
                    {doneAsAdmin
                      ? 'Opening your admin panel…'
                      : 'Your session is saved securely on this device.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={goHome}
                  className="mt-4 w-full cursor-pointer rounded-none py-3 text-[0.88rem] font-semibold tracking-wide transition hover:brightness-110"
                  style={{
                    backgroundColor: INK,
                    color: CREAM,
                    fontFamily: 'Inter, sans-serif',
                    boxShadow: '0 16px 36px -16px rgba(10,46,34,0.7)',
                  }}
                >
                  Continue browsing
                </button>
              </motion.div>
            ) : (
              <motion.form
                key={mode}
                onSubmit={onSubmit}
                className={`grid w-full ${compact ? 'mt-4 gap-2.5' : 'mt-5 gap-3'}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22, ease }}
              >
                {mode === 'signup' && (
                  <div className="grid grid-cols-1 gap-2.5">
                    <label className="grid gap-1">
                      <span
                        className="text-[0.62rem] font-semibold tracking-[0.12em] uppercase opacity-55"
                        style={{ color: INK, fontFamily: 'Inter, sans-serif' }}
                      >
                        Full name
                      </span>
                      <input
                        required
                        name="name"
                        autoComplete="name"
                        placeholder="Your name"
                        className={fieldClass}
                        style={{ color: INK, fontFamily: 'Inter, sans-serif' }}
                      />
                    </label>
                    <label className="grid gap-1">
                      <span
                        className="text-[0.62rem] font-semibold tracking-[0.12em] uppercase opacity-55"
                        style={{ color: INK, fontFamily: 'Inter, sans-serif' }}
                      >
                        Phone
                      </span>
                      <input
                        required
                        type="tel"
                        name="phone"
                        autoComplete="tel"
                        placeholder="+91 …"
                        className={fieldClass}
                        style={{ color: INK, fontFamily: 'Inter, sans-serif' }}
                      />
                    </label>
                  </div>
                )}

                <label className="grid gap-1">
                  <span
                    className="text-[0.62rem] font-semibold tracking-[0.12em] uppercase opacity-55"
                    style={{ color: INK, fontFamily: 'Inter, sans-serif' }}
                  >
                    Email
                  </span>
                  <input
                    required
                    type="email"
                    name="email"
                    autoComplete="email"
                    placeholder="you@email.com"
                    className={fieldClass}
                    style={{ color: INK, fontFamily: 'Inter, sans-serif' }}
                  />
                </label>

                <label className="grid gap-1">
                  <span
                    className="text-[0.62rem] font-semibold tracking-[0.12em] uppercase opacity-55"
                    style={{ color: INK, fontFamily: 'Inter, sans-serif' }}
                  >
                    Password
                  </span>
                  <div className="relative">
                    <input
                      required
                      type={showPass ? 'text' : 'password'}
                      name="password"
                      autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                      placeholder="••••••••"
                      minLength={6}
                      className={`${fieldClass} pr-12`}
                      style={{ color: INK, fontFamily: 'Inter, sans-serif' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass((v) => !v)}
                      className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer border-0 bg-transparent text-[0.68rem] font-semibold tracking-wide uppercase opacity-55 hover:opacity-90"
                      style={{ color: INK, fontFamily: 'Inter, sans-serif' }}
                    >
                      {showPass ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </label>

                {error ? (
                  <p
                    className="m-0 rounded-none border px-3 py-2 text-[0.78rem]"
                    style={{
                      color: '#a32020',
                      borderColor: 'rgba(163,32,32,0.25)',
                      backgroundColor: 'rgba(163,32,32,0.06)',
                      fontFamily: 'Inter, sans-serif',
                    }}
                    role="alert"
                  >
                    {error}
                  </p>
                ) : null}

                {mode === 'login' && (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="cursor-pointer border-0 bg-transparent text-[0.72rem] font-medium opacity-60 hover:opacity-100"
                      style={{ color: INK, fontFamily: 'Inter, sans-serif' }}
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className={`flex w-full cursor-pointer items-center justify-center rounded-none text-[0.88rem] font-semibold tracking-wide transition hover:brightness-110 disabled:cursor-wait disabled:opacity-70 ${
                    compact ? 'mt-0.5 py-2.5' : 'mt-1 py-3'
                  }`}
                  style={{
                    backgroundColor: INK,
                    color: CREAM,
                    fontFamily: 'Inter, sans-serif',
                    boxShadow: '0 16px 36px -16px rgba(10,46,34,0.7)',
                  }}
                >
                  {submitting
                    ? 'Please wait…'
                    : mode === 'login'
                      ? 'Login'
                      : 'Create account'}
                </button>

                <p
                  className={`m-0 text-center opacity-55 ${compact ? 'mt-1 text-[0.7rem]' : 'mt-2 text-[0.75rem]'}`}
                  style={{ color: INK, fontFamily: 'Inter, sans-serif' }}
                >
                  {mode === 'login' ? (
                    <>
                      New here?{' '}
                      <button
                        type="button"
                        onClick={() => switchMode('signup')}
                        className="cursor-pointer border-0 bg-transparent font-semibold underline-offset-2 hover:underline"
                        style={{ color: GOLD }}
                      >
                        Create an account
                      </button>
                    </>
                  ) : (
                    <>
                      Already have an account?{' '}
                      <button
                        type="button"
                        onClick={() => switchMode('login')}
                        className="cursor-pointer border-0 bg-transparent font-semibold underline-offset-2 hover:underline"
                        style={{ color: GOLD }}
                      >
                        Login
                      </button>
                    </>
                  )}
                </p>
              </motion.form>
            )}
          </AnimatePresence>
          </div>
        </div>
      </motion.section>
    </main>
  )
}
