import { Search, UserPlus, ChevronRight } from 'lucide-react'

const MEMBERS = [
  { no: '004217', name: 'Amina Njeri',    phone: '0722 000 001', savings: '84,500',  status: 'Active' },
  { no: '004218', name: 'Joseph Mwangi', phone: '0733 000 002', savings: '120,000', status: 'Active' },
  { no: '004219', name: "Grace Ndung'u", phone: '0711 000 003', savings: '55,200',  status: 'Active' },
  { no: '004220', name: 'Peter Kamau',   phone: '0700 000 004', savings: '32,400',  status: 'Inactive' },
]

export default function MembersPage() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold" style={{ color: 'var(--ink)' }}>Members</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
            Search, view, and manage member records.
          </p>
        </div>
        <button
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white"
          style={{ background: 'var(--green)' }}
        >
          <UserPlus size={16} strokeWidth={2.5} />
          Add member
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-md">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2"
          style={{ color: 'var(--muted)' }}
        />
        <input
          type="search"
          placeholder="Name, ID number, or member number…"
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm outline-none transition-all"
          style={{ borderColor: 'var(--line)', background: 'var(--card)' }}
          onFocus={(e) => (e.target.style.borderColor = 'var(--green)')}
          onBlur={(e)  => (e.target.style.borderColor = 'var(--line)')}
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-[18px] border" style={{ borderColor: 'var(--line)' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--line)' }}>
                {['Member #', 'Full name', 'Phone', 'Savings (KES)', 'Status', ''].map((h) => (
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
              {MEMBERS.map((m) => (
                <tr
                  key={m.no}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                  style={{ borderBottom: '1px solid var(--line)' }}
                >
                  <td className="px-6 py-3.5 font-mono text-xs" style={{ color: 'var(--green)' }}>{m.no}</td>
                  <td className="px-6 py-3.5 font-semibold" style={{ color: 'var(--ink)' }}>{m.name}</td>
                  <td className="px-6 py-3.5" style={{ color: 'var(--muted)' }}>{m.phone}</td>
                  <td className="px-6 py-3.5 font-semibold" style={{ color: 'var(--ink)' }}>{m.savings}</td>
                  <td className="px-6 py-3.5">
                    <span
                      className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        m.status === 'Active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {m.status}
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
