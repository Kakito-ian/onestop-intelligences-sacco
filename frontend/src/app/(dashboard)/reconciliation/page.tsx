import { Upload, RefreshCw, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react'

const EXCEPTIONS = [
  { ref: 'RK7X2Q1234', amount: '2,800', date: '14 Oct 2026', reason: 'No matching member found',        owner: 'Unassigned' },
  { ref: 'RK7X2Q5678', amount: '5,000', date: '13 Oct 2026', reason: 'Duplicate transaction',           owner: 'Grace N.'   },
  { ref: 'RK7X2Q9012', amount: '1,500', date: '13 Oct 2026', reason: 'Amount mismatch — off by KES 50', owner: 'Unassigned' },
]

export default function ReconciliationPage() {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold" style={{ color: 'var(--ink)' }}>Reconciliation</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
            Import M-Pesa and bank statements, match transactions, and resolve exceptions.
          </p>
        </div>
        <button
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white"
          style={{ background: 'var(--green)' }}
        >
          <Upload size={16} strokeWidth={2.5} />
          Import file
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Matched today',  value: '284', Icon: CheckCircle2,  color: '#1B5E3B' },
          { label: 'Pending match',  value: '17',  Icon: RefreshCw,     color: '#D97706' },
          { label: 'Exceptions',     value: '23',  Icon: XCircle,       color: '#DC2626' },
        ].map(({ label, value, Icon, color }) => (
          <div key={label} className="bg-white rounded-[18px] border p-5 flex items-start gap-4" style={{ borderColor: 'var(--line)' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: color + '18' }}>
              <Icon size={18} color={color} strokeWidth={2} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--muted)' }}>{label}</p>
              <p className="text-2xl font-extrabold" style={{ color }}>{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Exception queue */}
      <div className="bg-white rounded-[18px] border" style={{ borderColor: 'var(--line)' }}>
        <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--line)' }}>
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} color="#DC2626" />
            <h2 className="text-base font-bold" style={{ color: 'var(--ink)' }}>Exception queue</h2>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-red-100 text-red-700">
            {EXCEPTIONS.length} open
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--line)' }}>
                {['M-Pesa ref', 'Amount (KES)', 'Date', 'Reason', 'Owner'].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {EXCEPTIONS.map((ex) => (
                <tr key={ex.ref} className="hover:bg-gray-50 cursor-pointer transition-colors" style={{ borderBottom: '1px solid var(--line)' }}>
                  <td className="px-6 py-3.5 font-mono text-xs" style={{ color: 'var(--green)' }}>{ex.ref}</td>
                  <td className="px-6 py-3.5 font-semibold" style={{ color: 'var(--ink)' }}>{ex.amount}</td>
                  <td className="px-6 py-3.5" style={{ color: 'var(--muted)' }}>{ex.date}</td>
                  <td className="px-6 py-3.5" style={{ color: 'var(--ink)' }}>{ex.reason}</td>
                  <td className="px-6 py-3.5">
                    <span className={`text-xs font-semibold ${ex.owner === 'Unassigned' ? 'text-red-600' : 'text-green-700'}`}>
                      {ex.owner}
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
