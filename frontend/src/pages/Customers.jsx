import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Search, Plus, MoreVertical, TrendingUp, TrendingDown,
  CheckCircle2, Users, Phone, Mail, MapPin, X
} from 'lucide-react'
import { getCustomers, createCustomer } from '../services/customerService'

const riskColor = (score) => {
  if (score >= 80) return 'text-green-400 bg-green-400/10 border-green-500/20'
  if (score >= 55) return 'text-amber-400 bg-amber-400/10 border-amber-500/20'
  return 'text-red-400 bg-red-400/10 border-red-500/20'
}

const statusBadge = {
  'Active':   'bg-green-400/10 text-green-400 border-green-500/20',
  'At Risk':  'bg-amber-400/10 text-amber-400 border-amber-500/20',
  'Overdue':  'bg-red-400/10 text-red-400 border-red-500/20',
}

export default function Customers() {
  const [customers, setCustomers] = useState([])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const [selected, setSelected] = useState(null)
  
  // Modal State
  const [isModalOpen, setModalOpen] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', contactPerson: '', city: '' })
  const [loading, setLoading] = useState(false)

  const loadCustomers = () => {
    getCustomers()
      .then(res => {
        if (Array.isArray(res.data)) setCustomers(res.data)
        else setCustomers([])
      })
      .catch(err => {
        console.error('Customers Load Error:', err)
        setCustomers([])
      })
  }

  useEffect(() => {
    loadCustomers()
  }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await createCustomer(formData)
      setModalOpen(false)
      setFormData({ name: '', email: '', phone: '', contactPerson: '', city: '' })
      loadCustomers() // Refresh list
    } catch {
      alert("Failed to create customer")
    } finally {
      setLoading(false)
    }
  }

  const filtered = customers.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.contactPerson || '').toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'All' || c.status === filter
    return matchSearch && matchFilter
  })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Customers</h1>
          <p className="text-text-muted mt-1">Manage your customer relationships and credit scores.</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="gradient-btn px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-primary/20">
          <Plus size={18} /> Add Customer
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Customers', val: String(customers.length), icon: Users, color: 'text-blue-400' },
          { label: 'At Risk', val: String(customers.filter(c => c.status !== 'Active').length), icon: TrendingDown, color: 'text-red-400' },
        ].map(s => (
          <div key={s.label} className="bg-card border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-text-muted text-sm">{s.label}</p>
              <s.icon size={18} className={s.color} />
            </div>
            <p className={`text-2xl font-black ${s.color}`}>{s.val}</p>
          </div>
        ))}
      </div>

      {/* Table Card */}
      <div className="bg-card border border-slate-800 rounded-2xl shadow-premium overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 p-5 border-b border-slate-800">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or contact..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-slate-600"
            />
          </div>
          <div className="flex gap-2">
            {['All', 'Active', 'At Risk', 'Overdue'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${filter === f ? 'bg-primary text-white' : 'bg-slate-800 text-text-muted hover:bg-slate-700'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800 text-left">
                {['Customer', 'Contact', 'Orders', 'Total Value', 'Outstanding', 'Risk Score', 'Status', ''].map(h => (
                  <th key={h} className="px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <motion.tr
                  key={c.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors cursor-pointer group"
                  onClick={() => setSelected(selected?.id === c.id ? null : c)}
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center font-black text-primary text-sm">
                        {c.name[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{c.name}</p>
                        <p className="text-xs text-slate-500">{c.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-text-muted">{c.contactPerson || '—'}</td>
                  <td className="px-5 py-4 text-sm font-semibold">{c.orders?.length ?? '—'}</td>
                  <td className="px-5 py-4 text-sm font-semibold text-green-400">—</td>
                  <td className="px-5 py-4 text-sm font-semibold text-amber-400">—</td>
                  <td className="px-5 py-4">
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-black ${riskColor(c.riskScore)}`}>
                      {c.riskScore >= 80 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                      {c.riskScore}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-3 py-1 rounded-full border text-xs font-bold ${statusBadge[c.status]}`}>{c.status}</span>
                  </td>
                  <td className="px-5 py-4">
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-slate-700">
                      <MoreVertical size={16} className="text-slate-400" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Expanded Detail */}
        {selected && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="border-t border-slate-800 bg-slate-900/50 p-6"
          >
            <h4 className="font-bold text-primary mb-4">{selected.name} — Details</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 text-sm">
              <div className="flex items-center gap-2 text-text-muted"><Mail size={14} />{selected.email || '—'}</div>
              <div className="flex items-center gap-2 text-text-muted"><Phone size={14} />{selected.phone || '—'}</div>
              <div className="flex items-center gap-2 text-text-muted"><MapPin size={14} />{selected.city || '—'}</div>
              <div className="flex items-center gap-2 text-text-muted"><CheckCircle2 size={14} />Joined {new Date(selected.createdAt).toLocaleDateString()}</div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Add Customer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card w-full max-w-md rounded-2xl border border-slate-800 shadow-premium overflow-hidden"
          >
            <div className="flex items-center justify-between p-5 border-b border-slate-800">
              <h3 className="font-bold text-lg">Add New Customer</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-500 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-5 space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-text-muted ml-1 mb-2 block">Company / Business Name *</label>
                <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/40 focus:border-primary focus:outline-none text-sm" placeholder="e.g. Acme Corp" />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-text-muted ml-1 mb-2 block">Contact Person</label>
                <input value={formData.contactPerson} onChange={e => setFormData({...formData, contactPerson: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/40 focus:border-primary focus:outline-none text-sm" placeholder="e.g. John Doe" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-text-muted ml-1 mb-2 block">Email</label>
                  <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/40 focus:border-primary focus:outline-none text-sm" placeholder="contact@acme.com" />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-text-muted ml-1 mb-2 block">Phone</label>
                  <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/40 focus:border-primary focus:outline-none text-sm" placeholder="+91..." />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-text-muted ml-1 mb-2 block">City / Location</label>
                <input value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/40 focus:border-primary focus:outline-none text-sm" placeholder="e.g. Mumbai" />
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setModalOpen(false)} className="flex-1 py-3 rounded-xl border border-slate-700 hover:bg-slate-800 transition-colors font-semibold">Cancel</button>
                <button type="submit" disabled={loading} className="flex-1 gradient-btn py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50">
                  {loading ? 'Adding...' : 'Add Customer'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
