import { useEffect, useState } from 'react'
import { TrendingUp, Clock, AlertTriangle, Plus, ShoppingCart } from 'lucide-react'
import StatCard from '../components/dashboard/StatCard'
import OrdersTable from '../components/dashboard/OrdersTable'
import { getDashboardSummary } from '../services/dashboardService'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
  const navigate = useNavigate()
  const [stats, setStats] = useState({ totalCustomers: 0, totalOrders: 0, totalRevenue: 0, outstandingDues: 0 })
  const [recentOrders, setRecentOrders] = useState([])

  useEffect(() => {
    getDashboardSummary()
      .then(res => {
        if (res.data && res.data.stats) {
          setStats(res.data.stats)
          setRecentOrders(res.data.recentOrders || [])
        }
      })
      .catch(err => {
        console.error('Dashboard Error:', err)
      })
  }, [])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Business Overview</h1>
          <p className="text-text-muted mt-1">Welcome back, here's what's happening today.</p>
        </div>
        <button onClick={() => navigate('/orders')} className="gradient-btn px-6 py-2.5 rounded-xl font-semibold text-white flex items-center gap-2">
          <Plus size={20} />
          New Order
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Collected" value={`₹${Number(stats.totalRevenue).toLocaleString()}`} change="+0%" icon={TrendingUp} color="blue" />
        <StatCard title="Pending Payments" value={`₹${Number(stats.outstandingDues).toLocaleString()}`} change="+0%" icon={Clock} color="amber" isWarning />
        <StatCard title="Active Orders" value={String(stats.activeOrders || 0)} change="+0" icon={AlertTriangle} color="purple" />
        <StatCard title="Total Orders" value={String(stats.totalOrders || 0)} change="+0%" icon={ShoppingCart} color="red" />
      </div>

      {/* Main area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card rounded-2xl p-6 border border-slate-800 shadow-premium min-h-[400px]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg">Recent Orders</h3>
            <button onClick={() => navigate('/orders')} className="text-primary text-sm font-medium hover:underline">View All</button>
          </div>
          <OrdersTable orders={recentOrders} />
        </div>

        <div className="bg-card rounded-2xl p-6 border border-slate-800 shadow-premium">
          <h3 className="font-bold text-lg mb-6">Payment Insights</h3>
          <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-slate-800 rounded-xl">
            <div className="w-48 h-48 rounded-full border-8 border-primary/20 flex items-center justify-center relative">
              <div className="w-32 h-32 rounded-full border-8 border-primary border-t-accent animate-spin-slow"></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold">
                  {(stats?.totalRevenue || 0) + (stats?.outstandingDues || 0) > 0
                    ? `${Math.round(((stats.totalRevenue || 0) / ((stats.totalRevenue || 0) + (stats.outstandingDues || 0))) * 100)}%`
                    : '0%'}
                </span>
                <span className="text-[10px] text-text-muted uppercase tracking-wider">Collected</span>
              </div>
            </div>
            <div className="mt-6 flex gap-4">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-primary"></div><span className="text-xs text-text-muted">Paid</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-slate-700"></div><span className="text-xs text-text-muted">Pending</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
