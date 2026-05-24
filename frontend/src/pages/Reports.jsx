import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp, TrendingDown, DollarSign,
  ShoppingCart, Download, CheckCircle2, AlertTriangle
} from 'lucide-react'
import { getReportAnalytics, exportReportPdf } from '../services/reportService'
import { downloadBlob } from '../utils/download'

export default function Reports() {
  const [period, setPeriod] = useState('6M')
  const [data, setData] = useState({ monthlyData: [], topCustomers: [], statusBreakdown: [] })
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    getReportAnalytics()
      .then(res => {
        if (res.data) setData(res.data)
      })
      .catch(console.error)
  }, [])

  const monthlyData = data.monthlyData || []
  const topCustomers = data.topCustomers || []
  const statusBreakdown = data.statusBreakdown || []

  const totalRevenue = monthlyData.reduce((s, d) => s + (d.revenue || 0), 0)
  const totalCollected = monthlyData.reduce((s, d) => s + (d.collected || 0), 0)
  const collectionRate = totalRevenue > 0 ? Math.round((totalCollected / totalRevenue) * 100) : 0
  const outstanding = totalRevenue - totalCollected

  const BAR_MAX = Math.max(...monthlyData.map(d => d.revenue || 0), 1000)

  const handleExportPdf = async () => {
    setExporting(true)
    try {
      const res = await exportReportPdf()
      downloadBlob(res.data, `vendorflow-report-${new Date().toISOString().slice(0, 10)}.pdf`)
    } catch (err) {
      console.error('Report export failed:', err)
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          <p className="text-text-muted mt-1">Financial performance insights for your business.</p>
        </div>
        <div className="flex gap-3">
          <div className="flex bg-slate-800 rounded-xl p-1">
            {['1M', '3M', '6M', '1Y'].map(p => (
              <button key={p} onClick={() => setPeriod(p)} className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${period === p ? 'bg-primary text-white' : 'text-slate-400 hover:text-text'}`}>{p}</button>
            ))}
          </div>
          <button onClick={handleExportPdf} disabled={exporting} className="gradient-btn px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 disabled:opacity-60">
            <Download size={18} /> {exporting ? 'Exporting...' : 'Export PDF'}
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', val: `₹${totalRevenue.toLocaleString()}`, sub: totalRevenue > 0 ? 'Total contract value' : 'No data', icon: DollarSign, color: 'text-text-muted', trend: 'up' },
          { label: 'Collected', val: `₹${totalCollected.toLocaleString()}`, sub: `${collectionRate}% collection rate`, icon: CheckCircle2, color: 'text-green-400', trend: 'up' },
          { label: 'Outstanding', val: `₹${outstanding.toLocaleString()}`, sub: totalRevenue > 0 ? `${Math.round((outstanding/totalRevenue)*100)}% of total` : 'No dues', icon: AlertTriangle, color: 'text-amber-400', trend: 'down' },
          { label: 'Avg Order Value', val: `₹${statusBreakdown.length > 0 ? Math.round(totalRevenue / statusBreakdown.reduce((s, b) => s + b.count, 0)).toLocaleString() : '0'}`, sub: totalRevenue > 0 ? 'Real-time calculation' : 'No orders', icon: ShoppingCart, color: 'text-purple-400', trend: 'up' },
        ].map(s => (
          <div key={s.label} className="bg-card border border-slate-800 rounded-2xl p-5 shadow-premium">
            <div className="flex items-center justify-between mb-3">
              <p className="text-text-muted text-sm">{s.label}</p>
              <s.icon size={18} className={s.color} />
            </div>
            <p className={`text-2xl font-black ${s.color} mb-1`}>{s.val}</p>
            <p className={`text-xs flex items-center gap-1 ${s.trend === 'up' ? 'text-green-400' : 'text-danger'}`}>
              {s.trend === 'up' ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
              {s.sub}
            </p>
          </div>
        ))}
      </div>

      {/* Main Chart + Customer Rankings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Bar Chart: Revenue vs Collected */}
        <div className="lg:col-span-2 bg-card border border-slate-800 rounded-2xl p-6 shadow-premium">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-lg">Revenue vs Collected</h3>
              <p className="text-text-muted text-xs mt-0.5">Monthly breakdown</p>
            </div>
            <div className="flex gap-4 text-xs">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-blue-500/60 inline-block"></span>Revenue</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-green-500 inline-block"></span>Collected</span>
            </div>
          </div>

          <div className="flex items-end gap-3 h-52">
            {monthlyData.length === 0 ? (
              <div className="w-full flex items-center justify-center text-text-muted border-2 border-dashed border-slate-800 rounded-xl bg-slate-900/30">
                No revenue data for the selected period.
              </div>
            ) : (
              monthlyData.map((d, i) => (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-1.5">
                  <div className="w-full flex gap-1 items-end" style={{ height: '180px' }}>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(d.revenue / BAR_MAX) * 100}%` }}
                      transition={{ delay: i * 0.1, duration: 0.6, type: 'spring' }}
                      className="flex-1 bg-blue-500/30 rounded-t-lg border border-blue-500/20 hover:bg-blue-500/50 transition-colors cursor-pointer"
                      title={`Revenue: ₹${d.revenue.toLocaleString()}`}
                    />
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(d.collected / BAR_MAX) * 100}%` }}
                      transition={{ delay: i * 0.1 + 0.05, duration: 0.6, type: 'spring' }}
                      className="flex-1 bg-green-500 rounded-t-lg hover:bg-green-400 transition-colors cursor-pointer"
                      title={`Collected: ₹${d.collected.toLocaleString()}`}
                    />
                  </div>
                  <span className="text-xs text-slate-500">{d.month}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top Customers */}
        <div className="bg-card border border-slate-800 rounded-2xl p-6 shadow-premium">
          <h3 className="font-bold text-lg mb-5">Top Customers</h3>
          <div className="space-y-5">
            {topCustomers.length === 0 ? (
              <div className="py-8 text-center text-xs text-text-muted border border-dashed border-slate-800 rounded-xl">
                No customer spend data yet.
              </div>
            ) : (
              topCustomers.map((c, i) => (
                <div key={c.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-slate-600 w-4">#{i + 1}</span>
                      <span className="text-sm font-semibold truncate max-w-[130px]">{c.name}</span>
                    </div>
                    <span className="text-xs font-bold text-green-400">₹{c.value.toLocaleString()}</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${c.share}%` }}
                      transition={{ delay: i * 0.1 + 0.5, duration: 0.6 }}
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                    />
                  </div>
                  <p className="text-[10px] text-slate-600 mt-1">{c.orders} orders</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Order Status Breakdown */}
      <div className="bg-card border border-slate-800 rounded-2xl p-6 shadow-premium">
        <h3 className="font-bold text-lg mb-6">Order Status Distribution</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {statusBreakdown.length === 0 ? (
            <div className="col-span-full py-12 text-center text-text-muted border-2 border-dashed border-slate-800 rounded-2xl">
              No orders found to analyze.
            </div>
          ) : (
            statusBreakdown.map(s => {
              const colors = {
                Created: 'bg-slate-500', Confirmed: 'bg-blue-500',
                Production: 'bg-purple-500', Dispatch: 'bg-amber-500', 
                Completed: 'bg-green-500', Processing: 'bg-indigo-500'
              }
              const colorClass = colors[s.label] || 'bg-slate-700'
              return (
                <div key={s.label} className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-slate-900/50 border border-slate-800">
                  <div className={`w-10 h-10 rounded-xl ${colorClass} flex items-center justify-center font-black text-white`}>{s.count}</div>
                  <p className="text-sm font-semibold">{s.label}</p>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${s.pct}%` }} transition={{ delay: 0.8 }} className={`h-full ${colorClass} rounded-full`} />
                  </div>
                  <p className="text-xs text-slate-500">{s.pct}%</p>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
