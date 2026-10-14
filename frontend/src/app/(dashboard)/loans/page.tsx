import { FilePlus, ChevronRight } from 'lucide-react'

const LOANS = [
  { no: 'LN-0042', member: 'Joseph Mwangi',  principal: '120,000', balance: '98,400', dueDate: '28 Oct 2026', status: 'Active'   },
  { no: 'LN-0043', member: 'Amina Njeri',    principal:  '50,000', balance: '45,200', dueDate: '31 Oct 2026', status: 'Active'   },
  { no: 'LN-0038', member: 'Peter Kamau',    principal:  '80,000', balance: '12,000', dueDate: '14 Oct 2026', status: 'Overdue'  },
  { no: 'LN-0041', member: 'Fatuma Hassan',  principal: '200,000', balance:       '0', dueDate: '—',          status: 'Closed'   },
]

const STATUS: Record<string, string> = {
  Active:  'bg-blue-100  text-blue-700',
  Overdue: 'bg-red-100   text-red-700',
  Pending: 'bg-yellow-100 text-yellow-700',
  Closed:  'bg-gray-100  text-gray-600',
}

export default function LoansPage() {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold" style={{ color: 'var(--ink)' }}>Loans</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
            Applications, approvals, and repayment schedules.
          </p>
        </div>
        <button
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white"
          style={{ background: 'var(--green)' }}
        >
          <FilePlus size={16} strokeWidth={2.5} />
          New application
        </button>
      </div>

      <div className="bg-white rounded-[18px] border" style={{ borderColor: 'var(--line)' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--line)' }}>
                {['Loan #', 'Member', 'Principal (KES)', 'Balance (KES)', 'Next due', 'Status', ''].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--muted)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {LOANS.map((l) => (
                <tr key={l.no} className="hover:bg-gray-50 cursor-pointer transition-colors" style={{ borderBottom: '1px solid var(--line)' }}>
                  <td className="px-6 py-3.5 font-mono text-xs" style={{ color: 'var(--green)' }}>{l.no}</td>
                  <td className="px-6 py-3.5 font-semibold" style={{ color: 'var(--ink)' }}>{l.member}</td>
                  <td className="px-6 py-3.5" style={{ color: 'var(--ink)' }}>{l.principal}</td>
                  <td className="px-6 py-3.5 font-semibold" style={{ color: 'var(--ink)' }}>{l.balance}</td>
                  <td className="px-6 py-3.5" style={{ color: 'var(--muted)' }}>{l.dueDate}</td>
                  <td className="px-6 py-3.5">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS[l.status] ?? ''}`}>
                      {l.status}
                    </span>
                  </td>
                  <td className="px-6 py-3.5">
                    <ChevronRight size={16} style={{ color: 'var(--muted)' }} />
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
