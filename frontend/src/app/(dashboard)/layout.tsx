'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  FileText,
  RefreshCw,
  MessageSquare,
  Shield,
  BarChart2,
  LogOut,
  Leaf,
} from 'lucide-react'
import { clearTokens } from '@/lib/api'

const NAV = [
  { href: '/dashboard',      label: 'Dashboard',      Icon: LayoutDashboard },
  { href: '/members',        label: 'Members',         Icon: Users           },
  { href: '/loans',          label: 'Loans',           Icon: FileText        },
  { href: '/reconciliation', label: 'Reconciliation',  Icon: RefreshCw       },
  { href: '/crm',            label: 'CRM / Cases',     Icon: MessageSquare   },
  { href: '/insurance',      label: 'Insurance',       Icon: Shield          },
  { href: '/reports',        label: 'Reports',         Icon: BarChart2       },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router   = useRouter()

  function signOut() {
    clearTokens()
    sessionStorage.removeItem('onestop_user')
    router.replace('/login')
  }

  return (
    <div className="flex h-screen overflow-hidden">

      {/* ── Sidebar ────────────────────────────────────────────────────── */}
      <aside
        className="w-60 shrink-0 flex flex-col h-full"
        style={{ background: 'var(--green-dark)' }}
      >
        {/* Logo */}
        <div className="px-5 py-5 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
              style={{ background: 'var(--green)' }}
            >
              <Leaf size={14} color="#F5B800" />
            </div>
            <span className="text-lg font-extrabold tracking-tight">
              <span className="text-white">One</span>
              <span style={{ color: 'var(--gold)' }}>Stop</span>
            </span>
          </div>
          <p className="text-white/40 text-[10px] font-semibold tracking-widest uppercase mt-1 ml-10">
            Staff Portal
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
          {NAV.map(({ href, label, Icon }) => {
            const active = pathname === href || pathname.startsWith(href + '/')
            return (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                style={{
                  background: active ? 'rgba(255,255,255,0.12)' : 'transparent',
                  color: active ? '#fff' : 'rgba(255,255,255,0.55)',
                }}
              >
                <Icon size={16} strokeWidth={active ? 2.5 : 2} />
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Sign out */}
        <div className="px-3 py-4 border-t border-white/10">
          <button
            onClick={signOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold
                       text-white/50 hover:text-white hover:bg-white/10 transition-colors"
          >
            <LogOut size={16} strokeWidth={2} />
            Sign out
          </button>
        </div>
      </aside>

      {/* ── Main ───────────────────────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
