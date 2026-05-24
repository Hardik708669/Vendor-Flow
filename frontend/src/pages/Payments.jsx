import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, CheckCircle2, Clock, AlertTriangle, DollarSign,
  TrendingUp, Send, Download, X
} from 'lucide-react'
import { getPayments, updatePaymentStatus, exportPaymentsCsv } from '../services/paymentService'
import { downloadBlob } from '../utils/download'

const STATUS_CONFIG = {
  Paid:     { color: 'text-green-400 bg-green-400/10 border-green-500/20', icon: CheckCircle2 },
  Pending:  { color: 'text-amber-400 bg-amber-400/10 border-amber-500/20', icon: Clock },
  Overdue:  { color: 'text-red-400 bg-red-400/10 border-red-500/20', icon: AlertTriangle },
  Partial:  { color: 'text-blue-400 bg-blue-400/10 border-blue-500/20', icon: Clock },
  Processing: { color: 'text-indigo-400 bg-indigo-400/10 border-indigo-500/20', icon: Clock },
}

export default function Payments() {
  const [payments, setPayments] = useState([])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const [showModal, setShowModal] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState(null)
  const [amountToPay, setAmountToPay] = useState('')
  const [exporting, setExporting] = useState(false)

  const loadPayments = () => {
    getPayments()
      .then(res => {
        if (Array.isArray(res.data)) setPayments(res.data)
      })
      .catch(err => console.error('Payments Load Error:', err))
  }

  useEffect(() => {
    loadPayments()
  }, [])

  const openPaymentModal = (p) => {
    setSelectedPayment(p)
    setAmountToPay(Number(p.amount) - Number(p.paidAmount || 0))
    setShowModal(true)
  }

  const handleRecordPayment = async (e) => {
    e.preventDefault()
    try {
      await updatePaymentStatus(selectedPayment.id, { amountToApply: Number(amountToPay) })
      loadPayments()
      setShowModal(false)
    } catch (err) {
      console.error(err)
    }
  }

  const handleExport = async () => {
    setExporting(true)
    try {
      const res = await exportPaymentsCsv()
      downloadBlob(res.data, `vendorflow-payments-${new Date().toISOString().slice(0, 10)}.csv`)
    } catch (err) {
      console.error('Payments export failed:', err)
    } finally {
      setExporting(false)
    }
  }

  const totalCollected = payments.reduce((s, p) => s + Number(p.paidAmount || 0), 0)
  const totalPending = payments.reduce((s, p) => s + Math.max(Number(p.amount) - Number(p.paidAmount || 0), 0), 0)
  const totalValue = totalCollected + totalPending

  const filtered = payments.filter(p => {
    const s = search.toLowerCase()
    const matchSearch = (p.customer?.name || '').toLowerCase().includes(s) ||
      p.id.toLowerCase().includes(s) ||
      (p.order?.orderNumber || '').toLowerCase().includes(s)
    const matchFilter = filter === 'All' || p.status === filter
    return matchSearch && matchFilter
  })

  const collectionRate = totalValue > 0
    ? Math.round((totalCollected / totalValue) * 100)
    : 0

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Payments</h1>
          <p className="text-text-muted mt-1">Track outstanding dues and payment history.</p>
        </div>
        <button onClick={handleExport} disabled={exporting} className="gradient-btn px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 disabled:opacity-60">
          <Download size={18} /> {exporting ? 'Exporting...' : 'Export CSV'}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Value', val: `₹${totalValue.toLocaleString()}`, icon: DollarSign, color: 'text-text-muted' },
          { label: 'Collected', val: `₹${totalCollected.toLocaleString()}`, icon: CheckCircle2, color: 'text-green-400' },
          { label: 'Outstanding', val: `₹${totalPending.toLocaleString()}`, icon: Clock, color: 'text-amber-400' },
          { label: 'Collection Rate', val: `${collectionRate}%`, icon: TrendingUp, color: 'text-blue-400' },
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

      {/* Collection Progress Bar */}
      <div className="bg-card border border-slate-800 rounded-2xl p-6 shadow-premium">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold">Collection Progress</h3>
          <span className="text-primary font-black">{collectionRate}% collected</span>
        </div>
        <div className="w-full h-4 bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${collectionRate}%` }}
            transition={{ duration: 1, delay: 0.3, type: 'spring' }}
            className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full"
          />
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-3 text-xs text-slate-500">
          <span className="font-semibold text-slate-400">Total ₹{totalValue.toLocaleString()}</span>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>Collected ₹{totalCollected.toLocaleString()}</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500 inline-block"></span>Due ₹{totalPending.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-slate-800 rounded-2xl shadow-premium overflow-hidden">
        <div className="flex flex-col sm:flex-row gap-4 p-5 border-b border-slate-800">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search payments..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-slate-600"
            />
          </div>
          <div className="flex gap-2">
            {['All', 'Paid', 'Pending', 'Overdue', 'Partial'].map(f => (
              <button key={f} onClick={() => setFilter(f)} className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${filter === f ? 'bg-primary text-white' : 'bg-slate-800 text-text-muted hover:bg-slate-700'}`}>
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800 text-left">
                {['Payment ID', 'Order', 'Customer', 'Amount', 'Due Date', 'Paid On', 'Status', 'Action'].map(h => (
                  <th key={h} className="px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => {
                const cfg = STATUS_CONFIG[p.status] || { color: 'text-slate-400 bg-slate-400/10 border-slate-500/20', icon: Clock }
                const Icon = cfg.icon
                return (
                  <motion.tr key={p.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                    className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors group">
                    <td className="px-5 py-4 font-mono text-sm font-bold text-primary">{p.id}</td>
                    <td className="px-5 py-4 text-sm text-slate-400">{p.order?.orderNumber || '—'}</td>
                    <td className="px-5 py-4 text-sm font-semibold">{p.customer?.name || '—'}</td>
                    <td className="px-5 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-green-400">₹{Number(p.amount).toLocaleString()}</span>
                        {Number(p.paidAmount) > 0 && Number(p.paidAmount) < Number(p.amount) && (
                          <span className="text-xs text-text-muted">₹{Number(p.paidAmount).toLocaleString()} paid</span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-400">{p.dueDate ? new Date(p.dueDate).toLocaleDateString() : '—'}</td>
                    <td className="px-5 py-4 text-sm text-slate-400">{p.paidDate ? new Date(p.paidDate).toLocaleDateString() : '—'}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold ${cfg.color}`}>
                        <Icon size={11} /> {p.status}
                        {p.status === 'Overdue' && <span className="ml-1">{Math.abs(p.daysLeft)}d late</span>}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {p.status !== 'Paid' && (
                        <button
                          onClick={() => openPaymentModal(p)}
                          className="opacity-0 group-hover:opacity-100 transition-all flex items-center gap-1.5 text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-lg hover:bg-primary/20">
                          <Send size={11} /> Record Payment
                        </button>
                      )}
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {showModal && selectedPayment && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="bg-card border border-slate-700 rounded-3xl p-8 w-full max-w-sm shadow-2xl"
              onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Record Payment</h3>
                <button onClick={() => setShowModal(false)} className="p-2 rounded-xl hover:bg-slate-800"><X size={20} /></button>
              </div>
              <form onSubmit={handleRecordPayment} className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Amount to Pay</label>
                  <input required type="number" step="0.01" max={Number(selectedPayment.amount) - Number(selectedPayment.paidAmount || 0)} min="0.01"
                    value={amountToPay} onChange={e => setAmountToPay(e.target.value)}
                    className="mt-1.5 w-full bg-slate-900 border border-slate-800 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                  <p className="text-xs text-text-muted mt-2 ml-1">Remaining Balance: ₹{(Number(selectedPayment.amount) - Number(selectedPayment.paidAmount || 0)).toLocaleString()}</p>
                </div>
                <button type="submit" className="w-full gradient-btn py-3.5 rounded-2xl font-bold mt-2">
                  Submit Payment
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
