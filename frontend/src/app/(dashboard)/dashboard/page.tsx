import {
  Users,
  PiggyBank,
  FileText,
  AlertCircle,
  MessageSquare,
  Shield,
} from 'lucide-react'

const STATS = [
  { label: 'Active members',         value: '1,842',  change: '+12 this month',  Icon: Users,         color: '#1B5E3B' },
  { label: 'Total savings (KES)',     value: '48.2M',  change: '+3.1M this month', Icon: PiggyBank,     color: '#1B5E3B' },
  { label: 'Active loans',           value: '316',    change: '14 overdue',       Icon: FileText,      color: '#D97706' },
  { label: 'Pending exceptions',     value: '23',     change: '7 new today',      Icon: AlertCircle,   color: '#DC2626' },
  { label: 'Open CRM cases',         value: '41',     change: '5 due today',      Icon: MessageSquare, color: '#6366F1' },
  { label: 'Policies expiring (30d)', value: '18',    change: 'Need renewal',     Icon: Shield,        color: '#D97706' },
]

const RECENT = [
  { ref: 'TXN-8821', member: 'Amina Njeri',   type: 'Deposit',         amount: 'KES 5,000',   status: 'Posted'    },
  { ref: 'LN-0042',  member: 'Joseph Mwangi', type: 'Loan disbursed',  amount: 'KES 120,000', status: 'Active'    },
  { ref: 'RC-0031',  member: '—',             type: 'Recon exception', amount: 'KES 2,800',   status: 'Exception' },
  { ref: 'CS-2291',  member: 'Wanjiru Kamau', type: 'CRM case',        amount: '—',           status: 'Open'      },
]

const STATUS_CLASS: Record<string, string> = {
  Posted:    'bg-green-100  text-green-700',
  Active:    'bg-blue-100   text-blue-700',
  Exception: 'bg-red-100    text-red-700',
  Open:      'bg-yellow-100 text-yellow-700',
}

export default function DashboardPage() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold" style={{ color: 'var(--ink)' }}>Dashboard</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
          {new Date().toLocaleDateString('en-KE', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
          })}
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
        {STATS.map(({ label, value, change, Icon, color }) => (
          <div
            key={label}
            className="bg-white rounded-[18px] border p-5 flex items-start gap-4"
            style={{ borderColor: 'var(--line)' }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: color + '18' }}
            >
              <Icon size={18} color={color} strokeWidth={2} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--muted)' }}>
                {label}
              </p>
              <p className="text-2xl font-extrabold" style={{ color }}>
                {value}
              </p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{change}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent activity */}
      <div className="bg-white rounded-[18px] border" style={{ borderColor: 'var(--line)' }}>
        <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--line)' }}>
          <h2 className="text-base font-bold" style={{ color: 'var(--ink)' }}>Recent activity</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--line)' }}>
                {['Reference', 'Member', 'Type', 'Amount', 'Status'].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide"
                    style={{ color: 'var(--muted)' }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {RECENT.map((row) => (
                <tr
                  key={row.ref}
                  className="hover:bg-gray-50 transition-colors"
                  style={{ borderBottom: '1px solid var(--line)' }}
                >
                  <td className="px-6 py-3.5 font-mono text-xs" style={{ color: 'var(--green)' }}>
                    {row.ref}
                  </td>
                  <td className="px-6 py-3.5 font-semibold" style={{ color: 'var(--ink)' }}>
                    {row.member}
                  </td>
                  <td className="px-6 py-3.5" style={{ color: 'var(--muted)' }}>
                    {row.type}
                  </td>
                  <td className="px-6 py-3.5 font-semibold" style={{ color: 'var(--ink)' }}>
                    {row.amount}
                  </td>
                  <td className="px-6 py-3.5">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_CLASS[row.status] ?? ''}`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
