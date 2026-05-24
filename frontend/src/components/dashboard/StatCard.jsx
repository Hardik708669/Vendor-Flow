import { motion } from 'framer-motion'

const StatCard = ({ title, value, change, icon: Icon, color }) => {
  const colorMap = {
    blue: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    purple: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    amber: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    red: 'bg-red-500/10 text-red-500 border-red-500/20',
  }

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-card p-6 rounded-2xl border border-slate-800 shadow-premium flex flex-col justify-between"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl border ${colorMap[color]}`}>
          <Icon size={24} />
        </div>
        <span className={`text-xs font-bold px-2 py-1 rounded-md ${
          change.startsWith('+') ? 'text-success bg-success/10' : 'text-danger bg-danger/10'
        }`}>
          {change}
        </span>
      </div>
      <div>
        <p className="text-text-muted text-sm font-medium">{title}</p>
        <h3 className="text-2xl font-bold mt-1">{value}</h3>
      </div>
    </motion.div>
  )
}

export default StatCard
