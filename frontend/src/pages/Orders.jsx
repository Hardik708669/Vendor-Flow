import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, Plus, Package, CheckCircle2,
  MoreVertical, ShoppingCart, DollarSign, AlertTriangle, TrendingUp, X, Download
} from 'lucide-react'
import { getOrders, createOrder, updateOrderStatus } from '../services/orderService'
import { getCustomers } from '../services/customerService'

const API_ORIGIN = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/api\/?$/, '')

const STATUS_CONFIG = {
  Processing:{ color: 'text-indigo-400 bg-indigo-400/10 border-indigo-500/20', icon: Package },
  Created:   { color: 'text-slate-400 bg-slate-400/10 border-slate-500/20', icon: Package },
  Confirmed: { color: 'text-blue-400 bg-blue-400/10 border-blue-500/20', icon: CheckCircle2 },
  Completed: { color: 'text-green-400 bg-green-400/10 border-green-500/20', icon: CheckCircle2 },
  Overdue:   { color: 'text-red-400 bg-red-400/10 border-red-500/20', icon: AlertTriangle },
}

const LIFECYCLE = ['Created', 'Confirmed', 'Completed']

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [customers, setCustomers] = useState([])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const [showModal, setShowModal] = useState(false)
  const [statusUpdatingId, setStatusUpdatingId] = useState(null)
  const [newOrder, setNewOrder] = useState({ customerId: '', product: '', quantity: '1', unitPrice: '', gstRate: '18', dueDate: '' })

  useEffect(() => {
    getOrders()
      .then(res => {
        if (Array.isArray(res.data)) setOrders(res.data)
      })
      .catch(err => console.error('Orders Load Error:', err))
      
    getCustomers()
      .then(res => {
        if (Array.isArray(res.data)) setCustomers(res.data)
      })
      .catch(err => console.error('Customers Load Error:', err))
  }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      const subTotal = (parseFloat(newOrder.unitPrice) || 0) * (parseFloat(newOrder.quantity) || 0)
      const gstAmt = subTotal * ((parseFloat(newOrder.gstRate) || 0) / 100)
      const payload = { ...newOrder, amount: (subTotal + gstAmt).toFixed(2) }

      const res = await createOrder(payload)
      setOrders(prev => [res.data, ...prev])
      setShowModal(false)
      setNewOrder({ customerId: '', product: '', quantity: '1', unitPrice: '', gstRate: '18', dueDate: '' })
    } catch (err) {
      console.error(err)
    }
  }

  const handleConfirmOrder = async (orderId) => {
    setStatusUpdatingId(orderId)
    try {
      const res = await updateOrderStatus(orderId, 'Confirmed')
      setOrders(prev => prev.map(order => order.id === orderId ? res.data : order))
    } catch (err) {
      console.error(err)
    } finally {
      setStatusUpdatingId(null)
    }
  }

  const filtered = orders.filter(o => {
    const s = search.toLowerCase()
    const matchSearch = (o.orderNumber || '').toLowerCase().includes(s) ||
      (o.customer?.name || '').toLowerCase().includes(s) ||
      (o.product || '').toLowerCase().includes(s)
    const matchFilter = filter === 'All' || o.status === filter
    return matchSearch && matchFilter
  })

  // Dynamic calculations for preview
  const subTotal = (parseFloat(newOrder.unitPrice) || 0) * (parseFloat(newOrder.quantity) || 0);
  const gstAmount = subTotal * ((parseFloat(newOrder.gstRate) || 0) / 100);
  const totalAmount = subTotal + gstAmount;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Orders</h1>
          <p className="text-text-muted mt-1">Track every order across its full lifecycle.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="gradient-btn px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2">
          <Plus size={18} /> New Order
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Orders', val: String(orders.length), icon: ShoppingCart, color: 'text-blue-400' },
          { label: 'Total Value', val: `₹${orders.reduce((s, o) => s + Number(o.amount), 0).toLocaleString()}`, icon: DollarSign, color: 'text-text-muted' },
          { label: 'Collected', val: `₹${orders.reduce((s, o) => s + Number(o.payment?.paidAmount || 0), 0).toLocaleString()}`, icon: TrendingUp, color: 'text-green-400' },
          { label: 'Outstanding', val: `₹${orders.reduce((s, o) => s + (Number(o.amount) - Number(o.payment?.paidAmount || 0)), 0).toLocaleString()}`, icon: AlertTriangle, color: 'text-red-400' },
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

      {/* Lifecycle Visual */}
      <div className="bg-card border border-slate-800 rounded-2xl p-6 shadow-premium">
        <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-5">Order Lifecycle Pipeline</p>
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {LIFECYCLE.map((stage, i) => {
            const count = orders.filter(o => o.status === stage).length
            const cfg = STATUS_CONFIG[stage]
            const Icon = cfg.icon
            return (
              <React.Fragment key={stage}>
                <div className={`flex-shrink-0 flex flex-col items-center gap-2 px-6 py-4 rounded-2xl border ${cfg.color} min-w-[110px]`}>
                  <Icon size={20} />
                  <p className="text-xs font-bold">{stage}</p>
                  <p className="text-2xl font-black">{count}</p>
                </div>
                {i < LIFECYCLE.length - 1 && (
                  <div className="flex-shrink-0 text-slate-700 text-xl">→</div>
                )}
              </React.Fragment>
            )
          })}
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-card border border-slate-800 rounded-2xl shadow-premium overflow-hidden">
        <div className="flex flex-col sm:flex-row gap-4 p-5 border-b border-slate-800">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search orders..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-slate-600"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {['All', ...LIFECYCLE, 'Overdue'].map(f => (
              <button key={f} onClick={() => setFilter(f)} className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${filter === f ? 'bg-primary text-white' : 'bg-slate-800 text-text-muted hover:bg-slate-700'}`}>
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800 text-left">
                {['Order ID', 'Customer', 'Product', 'Date', 'Due Date', 'Amount', 'Status', ''].map(h => (
                  <th key={h} className="px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((o, i) => {
                const cfg = STATUS_CONFIG[o.status] || { color: 'text-slate-500 bg-slate-500/10 border-slate-500/20', icon: Package }
                const Icon = cfg.icon
                return (
                  <motion.tr key={o.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                    className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors group">
                    <td className="px-5 py-4 font-mono text-sm font-bold text-primary">{o.orderNumber}</td>
                    <td className="px-5 py-4 text-sm font-semibold">{o.customer?.name || '—'}</td>
                    <td className="px-5 py-4 text-sm text-text-muted max-w-[200px] truncate">{o.product}</td>
                    <td className="px-5 py-4 text-sm text-slate-500">{new Date(o.createdAt).toLocaleDateString()}</td>
                    <td className="px-5 py-4 text-sm text-slate-500">{o.dueDate ? new Date(o.dueDate).toLocaleDateString() : '—'}</td>
                    <td className="px-5 py-4 text-sm font-bold text-green-400">₹{Number(o.amount).toLocaleString()}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold ${cfg.color}`}>
                        <Icon size={11} /> {o.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {o.invoiceUrl && (
                          <a href={`${API_ORIGIN}${o.invoiceUrl}`} target="_blank" rel="noreferrer" title="Download Invoice" className="p-1.5 rounded-lg text-primary hover:bg-primary/20 transition-all">
                            <Download size={16} />
                          </a>
                        )}
                        {o.status === 'Created' && (
                          <button
                            onClick={() => handleConfirmOrder(o.id)}
                            disabled={statusUpdatingId === o.id}
                            className="text-xs font-bold text-blue-300 bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 rounded-lg hover:bg-blue-500/20 transition-all disabled:opacity-50"
                          >
                            {statusUpdatingId === o.id ? 'Confirming...' : 'Confirm'}
                          </button>
                        )}
                        <button className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-slate-700 transition-all">
                          <MoreVertical size={16} className="text-slate-400" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Order Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="bg-card border border-slate-700 rounded-3xl p-8 w-full max-w-lg shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Create New Order</h3>
                <button onClick={() => setShowModal(false)} className="p-2 rounded-xl hover:bg-slate-800"><X size={20} /></button>
              </div>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Customer</label>
                  <select required value={newOrder.customerId} onChange={e => setNewOrder({...newOrder, customerId: e.target.value})}
                    className="mt-1.5 w-full bg-slate-900 border border-slate-800 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40">
                    <option value="">Select customer</option>
                    {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Product / Description</label>
                  <input required type="text" placeholder="e.g. Steel Pipes"
                    value={newOrder.product} onChange={e => setNewOrder({...newOrder, product: e.target.value})}
                    className="mt-1.5 w-full bg-slate-900 border border-slate-800 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Quantity</label>
                    <input required type="number" min="1"
                      value={newOrder.quantity} onChange={e => setNewOrder({...newOrder, quantity: e.target.value})}
                      className="mt-1.5 w-full bg-slate-900 border border-slate-800 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Price per Unit (₹)</label>
                    <input required type="number" step="0.01" min="0" placeholder="e.g. 1500"
                      value={newOrder.unitPrice} onChange={e => setNewOrder({...newOrder, unitPrice: e.target.value})}
                      className="mt-1.5 w-full bg-slate-900 border border-slate-800 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">GST Rate (%)</label>
                    <select value={newOrder.gstRate} onChange={e => setNewOrder({...newOrder, gstRate: e.target.value})}
                      className="mt-1.5 w-full bg-slate-900 border border-slate-800 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40">
                      <option value="0">0% (Exempt)</option>
                      <option value="5">5%</option>
                      <option value="12">12%</option>
                      <option value="18">18%</option>
                      <option value="28">28%</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Due Date</label>
                    <input required type="date"
                      value={newOrder.dueDate} onChange={e => setNewOrder({...newOrder, dueDate: e.target.value})}
                      className="mt-1.5 w-full bg-slate-900 border border-slate-800 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>
                </div>

                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 mt-2">
                  <div className="flex justify-between text-sm text-text-muted mb-1">
                    <span>Subtotal</span>
                    <span>₹{subTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-text-muted mb-2 pb-2 border-b border-slate-800/50">
                    <span>GST ({newOrder.gstRate}%)</span>
                    <span>₹{gstAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-primary">
                    <span>Total Amount</span>
                    <span>₹{totalAmount.toFixed(2)}</span>
                  </div>
                </div>
                <button type="submit" className="w-full gradient-btn py-3.5 rounded-2xl font-bold mt-2">
                  Create Order
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
