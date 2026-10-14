'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Eye, EyeOff, Leaf, Lock, User, ArrowRight, ShieldCheck } from 'lucide-react'
import { authApi, setTokens } from '@/lib/api'

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername]         = useState('')
  const [password, setPassword]         = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading]           = useState(false)
  const [error, setError]               = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await authApi.login({ username, password })
      setTokens(res.accessToken, res.refreshToken)
      sessionStorage.setItem('onestop_user', JSON.stringify(res.user))
      router.replace('/dashboard')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid credentials. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">

      {/* ── Left hero panel — same image as mobile login ─────────────────── */}
      <div className="hidden lg:block relative w-[480px] shrink-0 overflow-hidden">
        {/* Background image */}
        <Image
          src="/login_hero.png"
          alt="OneStop SACCO"
          fill
          className="object-cover object-left"
          priority
        />

        {/* Dark green overlay so text is readable */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to right, rgba(13,61,37,0.88) 0%, rgba(13,61,37,0.35) 100%)',
          }}
        />

        {/* Content on top of image */}
        <div className="relative z-10 flex flex-col h-full p-12">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
              style={{ background: 'var(--green)' }}
            >
              <Leaf size={15} color="#F5B800" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight">
              <span className="text-white">One</span>
              <span style={{ color: 'var(--gold)' }}>Stop</span>
            </span>
          </div>

          <div className="flex-1" />

          {/* Tagline */}
          <h1
            className="text-5xl font-extrabold text-white leading-tight mb-3"
            style={{ fontFamily: 'cursive' }}
          >
            Save Today,<br />Build Tomorrow
          </h1>
          <div className="w-20 h-1 rounded-full mb-5" style={{ background: 'var(--gold)' }} />
          <p className="text-white/75 text-base leading-relaxed mb-8">
            Your SACCO. Your Goals. All in One Place.
          </p>

          {/* Feature list — Lucide icons */}
          <ul className="space-y-4 mb-10">
            {[
              { Icon: User,        text: 'Member accounts & savings ledger' },
              { Icon: ArrowRight,  text: 'Full loan lifecycle management'   },
              { Icon: RefreshCwIcon, text: 'M-Pesa reconciliation engine'  },
              { Icon: ShieldCheck, text: 'Insurance policy tracking'        },
            ].map(({ Icon, text }) => (
              <li key={text} className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: 'rgba(245,184,0,0.2)' }}
                >
                  <Icon size={15} color="#F5B800" />
                </div>
                <span className="text-white/80 text-sm font-medium">{text}</span>
              </li>
            ))}
          </ul>

          <p className="text-white/30 text-xs">
            © {new Date().getFullYear()} OneStop Intelligent SACCO
          </p>
        </div>
      </div>

      {/* ── Right form panel ─────────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 bg-[#F7F8F5]">
        <div className="w-full max-w-md">

          {/* Mobile logo (shown when hero panel is hidden) */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: 'var(--green)' }}
            >
              <Leaf size={14} color="#F5B800" />
            </div>
            <span className="text-xl font-extrabold">
              <span style={{ color: 'var(--green)' }}>One</span>
              <span style={{ color: 'var(--gold)' }}>Stop</span>
            </span>
          </div>

          <h2 className="text-3xl font-extrabold mb-1" style={{ color: 'var(--green)' }}>
            Welcome back
          </h2>
          <p className="text-sm mb-8" style={{ color: 'var(--muted)' }}>
            Sign in to access the staff portal.
          </p>

          {error && (
            <div className="mb-5 flex items-start gap-2.5 px-4 py-3 rounded-xl text-sm font-medium bg-red-50 text-red-700 border border-red-200">
              <ShieldCheck size={16} className="shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Username */}
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--ink)' }}>
                Username
              </label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted)' }} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoComplete="username"
                  placeholder="e.g. grace.ndunga"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border text-sm outline-none transition-all bg-white"
                  style={{ borderColor: 'var(--line)' }}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--green)')}
                  onBlur={(e)  => (e.target.style.borderColor = 'var(--line)')}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--ink)' }}>
                Password
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 rounded-xl border text-sm outline-none transition-all bg-white"
                  style={{ borderColor: 'var(--line)' }}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--green)')}
                  onBlur={(e)  => (e.target.style.borderColor = 'var(--line)')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--muted)' }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Forgot password */}
            <div className="flex justify-end">
              <button
                type="button"
                className="text-sm font-semibold"
                style={{ color: 'var(--green)' }}
              >
                Forgot password?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl text-white text-sm font-extrabold
                         flex items-center justify-center gap-2 transition-opacity disabled:opacity-60"
              style={{ background: 'var(--green)' }}
            >
              {loading
                ? <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                : <><span>Sign In</span><ArrowRight size={16} /></>
              }
            </button>
          </form>

          {/* Security note */}
          <div className="mt-8 flex items-center justify-center gap-2" style={{ color: 'var(--muted)' }}>
            <ShieldCheck size={14} />
            <p className="text-xs">Your session is encrypted. Never share your password.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Inline to avoid import confusion with the nav icon
function RefreshCwIcon({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 2v6h-6" /><path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
      <path d="M3 22v-6h6" /><path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
    </svg>
  )
}
