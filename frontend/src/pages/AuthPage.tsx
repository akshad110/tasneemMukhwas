import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useId, useRef, useState, type FormEvent } from 'react'
import { useAuth } from '../context/AuthContext'
import { ApiRequestError, warmApi } from '../lib/api'
import { APP_ROUTES, navigateApp } from '../lib/appRoutes'
import { authApi } from '../lib/services'
import { scrollAppToTop } from '../lib/scrollControl'
import BrandLogo from '../components/shared/BrandLogo'
import BrandNameLockup from '../components/shared/BrandNameLockup'
import {
  BRAND_CREAM_DEEP,
  BRAND_CREAM_LIGHT,
  BRAND_GOLD,
  BRAND_INK,
  BRAND_MUTED,
  BRAND_SANS,
  BRAND_SERIF,
  BRAND_TEXTURE,
} from '../lib/brand'

const INK = BRAND_INK
const CREAM_LIGHT = BRAND_CREAM_LIGHT
const CREAM_DEEP = BRAND_CREAM_DEEP
const GOLD = BRAND_GOLD
const MUTED = BRAND_MUTED
const TEXTURE = BRAND_TEXTURE
const BORDER = 'rgba(10,46,34,0.12)'

const FLOAT_PACKS = [
  { src: '/products/shahi-mukhwas.png', alt: 'Shahi Mukhwas', x: '10%', y: '16%', rot: -16, scale: 0.68, delay: 0 },
  { src: '/products/mango-slice-mukhwas.png', alt: 'Mango Slice', x: '54%', y: '10%', rot: 12, scale: 0.62, delay: 0.15 },
  { src: '/products/paan-shots-mukhwas.png', alt: 'Paan Shots', x: '24%', y: '48%', rot: -6, scale: 0.72, delay: 0.28 },
  { src: '/products/alsi-til-mukhwas.png', alt: 'Alsi Til', x: '56%', y: '52%', rot: 18, scale: 0.6, delay: 0.4 },
] as const

const AUTH_PACK_WIDTH = '22%'

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
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [forgotOpen, setForgotOpen] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotSubmitting, setForgotSubmitting] = useState(false)
  const [forgotError, setForgotError] = useState('')
  const [forgotSuccess, setForgotSuccess] = useState('')
  const loginFormRef = useRef<HTMLFormElement>(null)

  const compact = mode === 'signup'
  const fieldClass = compact
    ? 'auth-field w-full rounded-xl border px-3 py-2.5 text-[0.84rem] outline-none transition'
    : 'auth-field w-full rounded-xl border px-3.5 py-2.5 text-[0.9rem] outline-none transition'

  useEffect(() => {
    setMode(initialMode)
    setSubmitting(false)
    setShowPass(false)
    setError('')
    setForgotOpen(false)
    setForgotError('')
    setForgotSuccess('')
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
    setForgotOpen(false)
    setForgotError('')
    setForgotSuccess('')
    navigateApp(next === 'signup' ? APP_ROUTES.signup : APP_ROUTES.login)
  }

  const openForgotPassword = () => {
    const typedEmail = String(
      loginFormRef.current?.querySelector<HTMLInputElement>('input[name="email"]')?.value || '',
    ).trim()
    setForgotEmail(typedEmail)
    setForgotError('')
    setForgotSuccess('')
    setForgotOpen(true)
  }

  const onForgotSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setForgotError('')
    setForgotSuccess('')

    const email = forgotEmail.trim().toLowerCase()
    if (!email) {
      setForgotError('Enter your account email address.')
      return
    }

    const typedLoginEmail = String(
      loginFormRef.current?.querySelector<HTMLInputElement>('input[name="email"]')?.value || '',
    )
      .trim()
      .toLowerCase()

    if (typedLoginEmail && typedLoginEmail !== email) {
      setForgotError('Use the same email address as your Tasneem Mukhwas account.')
      return
    }

    setForgotSubmitting(true)
    try {
      await authApi.forgotPassword(email)
      setForgotSuccess('A new login password has been sent to your email. Check your inbox.')
    } catch (err) {
      setForgotError(err instanceof ApiRequestError ? err.message : 'Could not send recovery email')
    } finally {
      setForgotSubmitting(false)
    }
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
          document.title = 'Tasneem Mukhwas'
          navigateApp(user.role === 'admin' ? APP_ROUTES.admin : APP_ROUTES.home)
          return
        }

        await register({
          name: String(fd.get('name') || '').trim(),
          phone: String(fd.get('phone') || '').trim(),
          email,
          password,
        })
        document.title = 'Tasneem Mukhwas'
        navigateApp(APP_ROUTES.home)
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
      className="auth-page fixed inset-0 z-[70] flex h-svh w-svw overflow-hidden"
      aria-label={mode === 'login' ? 'Login' : 'Sign up'}
    >
      {/* —— Left: full-height brand stage with C-curve edge —— */}
      <svg className="pointer-events-none absolute h-0 w-0" aria-hidden>
        <defs>
          <clipPath id="auth-left-curve" clipPathUnits="objectBoundingBox">
            {/* Green panel — gentle C on the shared boundary */}
            <path d="M 0 0 H 1 C 0.72 0.06 0.72 0.90 1 1 H 0 Z" />
          </clipPath>
          <clipPath id="auth-right-curve" clipPathUnits="objectBoundingBox">
            {/* Form panel — mirrored left edge (no cream gap) */}
            <path d="M 0 0 L 1 0 L 1 1 L 0 1 C -0.9 0.94 -0.7 0.06 0 0 Z" />
          </clipPath>
        </defs>
      </svg>

      <motion.aside
        className="auth-split-visual auth-split-visual--cream relative z-10 hidden h-full w-1/2 shrink-0 overflow-hidden lg:block"
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease }}
      >
        <img
          src={TEXTURE}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover opacity-[0.12] saturate-[0.35]"
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
                width: AUTH_PACK_WIDTH,
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
                className="h-auto w-full select-none"
                style={{
                  transform: `scale(${pack.scale})`,
                  filter: 'drop-shadow(0 14px 22px rgba(10,46,34,0.16))',
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
            style={{ color: GOLD, fontFamily: BRAND_SANS }}
          >
            Tasneem Mukhwas
          </p>
          <h1
            className="mt-2 m-0 max-w-md text-[clamp(1.75rem,3vw,2.4rem)] leading-[1.1]"
            style={{
              color: INK,
              fontFamily: BRAND_SERIF,
              letterSpacing: '-0.01em',
            }}
          >
            Tradition that freshens every bite.
          </h1>
          <p
            className="mt-2 m-0 max-w-sm text-[0.85rem] leading-relaxed"
            style={{ color: MUTED, fontFamily: BRAND_SANS }}
          >
            Sign in to save favourites, track wholesale enquiries, and order faster.
          </p>
        </div>
      </motion.aside>

      {/* —— Right: full-height form —— */}
      <motion.section
        className="auth-split-form relative z-[5] flex h-full w-full flex-col overflow-hidden lg:w-1/2"
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease }}
      >
        <button
          type="button"
          onClick={goHome}
          className="absolute top-4 right-4 z-20 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border transition hover:brightness-[0.98] sm:top-5 sm:right-5"
          style={{ color: INK, backgroundColor: CREAM_LIGHT, borderColor: BORDER }}
          aria-label="Back to home"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          </svg>
        </button>

        <div
          className={`flex h-full flex-col items-center justify-center px-5 sm:px-10 lg:px-8 xl:px-10 ${
            compact ? 'py-6' : 'py-8'
          }`}
        >
          <div className="auth-form-card flex w-full max-w-[380px] flex-col items-stretch">
          <div className={`mb-4 flex items-center justify-center gap-2.5 lg:hidden ${compact ? 'mb-3' : ''}`}>
            <BrandLogo className="h-11 w-9 object-contain" alt="Tasneem Mukhwas" />
            <BrandNameLockup size="sm" />
          </div>

          {!forgotOpen && (
          <div
            className="relative mb-4 grid w-full grid-cols-2 overflow-hidden rounded-xl border p-1"
            style={{ backgroundColor: CREAM_DEEP, borderColor: BORDER }}
            role="tablist"
            aria-label="Auth mode"
          >
            <motion.div
              className="absolute inset-y-1 left-1 rounded-lg"
              style={{ width: 'calc(50% - 0.5rem)', backgroundColor: INK }}
              initial={false}
              animate={{ x: mode === 'signup' ? '100%' : 0 }}
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
                  className="relative z-10 cursor-pointer border-0 bg-transparent py-2.5 text-[0.72rem] font-semibold tracking-[0.12em] uppercase transition-colors duration-200 sm:text-[0.78rem]"
                  style={{
                    color: active ? CREAM_LIGHT : INK,
                    fontFamily: BRAND_SANS,
                  }}
                >
                  {m === 'login' ? 'Login' : 'Sign up'}
                </button>
              )
            })}
          </div>
          )}

          <h2
            id={`${formId}-title`}
            className={`m-0 text-center leading-tight ${compact ? 'text-[1.45rem] sm:text-[1.7rem]' : 'text-[clamp(1.55rem,2.6vw,2rem)]'}`}
            style={{ color: INK, fontFamily: BRAND_SERIF }}
          >
            {forgotOpen ? 'Forgot password' : mode === 'login' ? 'Welcome back' : 'Create account'}
          </h2>
          <p
            className={`m-0 text-center leading-relaxed ${compact ? 'mt-1 text-[0.78rem]' : 'mt-1.5 text-[0.84rem]'}`}
            style={{ color: MUTED, fontFamily: BRAND_SANS }}
          >
            {forgotOpen
              ? 'Enter your registered email. We will send a new login password to that inbox.'
              : mode === 'login'
                ? 'Enter your details to continue shopping with Tasneem.'
                : 'Join for wholesale updates, favourites, and faster checkout.'}
          </p>

          <AnimatePresence mode="wait">
            {forgotOpen && mode === 'login' ? (
              <motion.form
                key="forgot"
                onSubmit={onForgotSubmit}
                className="mt-3 grid w-full gap-2"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22, ease }}
              >
                <label className="grid gap-1">
                  <span
                    className="text-[0.62rem] font-semibold tracking-[0.12em] uppercase"
                    style={{ color: MUTED, fontFamily: BRAND_SANS }}
                  >
                    Account email
                  </span>
                  <input
                    required
                    type="email"
                    name="forgot-email"
                    autoComplete="email"
                    placeholder="you@email.com"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className={fieldClass}
                    style={{ color: INK, fontFamily: BRAND_SANS }}
                  />
                </label>

                {forgotError ? (
                  <p
                    className="m-0 rounded-xl border px-3 py-2 text-[0.78rem]"
                    style={{
                      color: '#a32020',
                      borderColor: 'rgba(163,32,32,0.25)',
                      backgroundColor: 'rgba(163,32,32,0.06)',
                      fontFamily: BRAND_SANS,
                    }}
                    role="alert"
                  >
                    {forgotError}
                  </p>
                ) : null}

                {forgotSuccess ? (
                  <p
                    className="m-0 rounded-xl border px-3 py-2 text-[0.78rem]"
                    style={{
                      color: '#1b7a3e',
                      borderColor: 'rgba(27,122,62,0.25)',
                      backgroundColor: 'rgba(27,122,62,0.08)',
                      fontFamily: BRAND_SANS,
                    }}
                    role="status"
                  >
                    {forgotSuccess}
                  </p>
                ) : null}

                <button
                  type="submit"
                  disabled={forgotSubmitting}
                  className="mt-0 flex w-full cursor-pointer items-center justify-center rounded-xl py-3 text-[0.88rem] font-semibold tracking-[0.06em] uppercase transition hover:brightness-110 disabled:cursor-wait disabled:opacity-70"
                  style={{
                    backgroundColor: INK,
                    color: CREAM_LIGHT,
                    fontFamily: BRAND_SANS,
                    boxShadow: '0 16px 36px -16px rgba(10,46,34,0.45)',
                  }}
                >
                  {forgotSubmitting ? 'Sending…' : 'Send password email'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setForgotOpen(false)
                    setForgotError('')
                    setForgotSuccess('')
                  }}
                  className="m-0 cursor-pointer border-0 bg-transparent text-center text-[0.75rem] font-semibold hover:underline"
                  style={{ color: GOLD, fontFamily: BRAND_SANS }}
                >
                  Back to login
                </button>
              </motion.form>
            ) : (
            <motion.form
              key={mode}
              ref={loginFormRef}
              onSubmit={onSubmit}
              className={`grid w-full ${compact ? 'mt-4 gap-2.5' : 'mt-3 gap-2'}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease }}
            >
                {mode === 'signup' && (
                  <div className="grid grid-cols-1 gap-2.5">
                    <label className="grid gap-1">
                      <span
                        className="text-[0.62rem] font-semibold tracking-[0.12em] uppercase"
                        style={{ color: MUTED, fontFamily: BRAND_SANS }}
                      >
                        Full name
                      </span>
                      <input
                        required
                        name="name"
                        autoComplete="name"
                        placeholder="Your name"
                        className={fieldClass}
                        style={{ color: INK, fontFamily: BRAND_SANS }}
                      />
                    </label>
                    <label className="grid gap-1">
                      <span
                        className="text-[0.62rem] font-semibold tracking-[0.12em] uppercase"
                        style={{ color: MUTED, fontFamily: BRAND_SANS }}
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
                        style={{ color: INK, fontFamily: BRAND_SANS }}
                      />
                    </label>
                  </div>
                )}

                <label className="grid gap-1">
                  <span
                    className="text-[0.62rem] font-semibold tracking-[0.12em] uppercase"
                    style={{ color: MUTED, fontFamily: BRAND_SANS }}
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
                    style={{ color: INK, fontFamily: BRAND_SANS }}
                  />
                </label>

                <label className="grid gap-1">
                  <span
                    className="text-[0.62rem] font-semibold tracking-[0.12em] uppercase"
                    style={{ color: MUTED, fontFamily: BRAND_SANS }}
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
                      style={{ color: INK, fontFamily: BRAND_SANS }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass((v) => !v)}
                      className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer border-0 bg-transparent text-[0.68rem] font-semibold tracking-[0.1em] uppercase hover:opacity-90"
                      style={{ color: GOLD, fontFamily: BRAND_SANS }}
                    >
                      {showPass ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </label>

                {error ? (
                  <p
                    className="m-0 rounded-xl border px-3 py-2 text-[0.78rem]"
                    style={{
                      color: '#a32020',
                      borderColor: 'rgba(163,32,32,0.25)',
                      backgroundColor: 'rgba(163,32,32,0.06)',
                      fontFamily: BRAND_SANS,
                    }}
                    role="alert"
                  >
                    {error}
                  </p>
                ) : null}

                {mode === 'login' && !forgotOpen && (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={openForgotPassword}
                      className="cursor-pointer border-0 bg-transparent text-[0.72rem] font-medium hover:underline"
                      style={{ color: GOLD, fontFamily: BRAND_SANS }}
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className={`flex w-full cursor-pointer items-center justify-center rounded-xl text-[0.88rem] font-semibold tracking-[0.06em] uppercase transition hover:brightness-110 disabled:cursor-wait disabled:opacity-70 ${
                    compact ? 'mt-0.5 py-3' : 'mt-0 py-3'
                  }`}
                  style={{
                    backgroundColor: INK,
                    color: CREAM_LIGHT,
                    fontFamily: BRAND_SANS,
                    boxShadow: '0 16px 36px -16px rgba(10,46,34,0.45)',
                  }}
                >
                  {submitting
                    ? 'Please wait…'
                    : mode === 'login'
                      ? 'Login'
                      : 'Create account'}
                </button>

                <p
                  className={`m-0 text-center ${compact ? 'mt-1 text-[0.7rem]' : 'mt-1 text-[0.75rem]'}`}
                  style={{ color: MUTED, fontFamily: BRAND_SANS }}
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
