import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  CreditCard,
  BarChart3,
  LogOut,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Favicon from '/favicon.png'

const menuItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { name: 'Customers',  icon: Users,           path: '/customers' },
  { name: 'Orders',     icon: ShoppingCart,    path: '/orders' },
  { name: 'Payments',   icon: CreditCard,      path: '/payments' },
  { name: 'Reports',    icon: BarChart3,       path: '/reports' },
  { name: 'Settings',   icon: Settings,        path: '/settings' },
]

const Sidebar = ({ activeTab, isCollapsed, onToggle }) => {
  const navigate = useNavigate()
  const { logout, user } = useAuth()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <motion.aside 
      initial={false}
      animate={{ width: isCollapsed ? 80 : 256 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="bg-card border-r border-slate-800 hidden md:flex flex-col relative shadow-xl z-50"
    >
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-20 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white border-2 border-background hover:scale-110 transition-transform shadow-md z-50"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      <div className="p-6 overflow-hidden">
        <Link to="/" className="flex items-center gap-3">
          <motion.img 
            src={Favicon} 
            alt="Logo" 
            className="w-10 h-10 rounded-xl shadow-lg object-cover flex-shrink-0"
            animate={{ scale: isCollapsed ? 0.9 : 1 }}
          />
          <AnimatePresence>
            {!isCollapsed && (
              <motion.h1 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent whitespace-nowrap"
              >
                VendorFlow
              </motion.h1>
            )}
          </AnimatePresence>
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-x-hidden overflow-y-auto scrollbar-hide">
        {menuItems.map((item) => {
          const isActive = activeTab === item.name
          return (
            <Link
              key={item.name}
              to={item.path}
              title={isCollapsed ? item.name : ''}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative ${
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-text-muted hover:bg-slate-800 hover:text-text'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -left-3 w-1 h-6 bg-primary rounded-r-full"
                />
              )}
              <div className="flex-shrink-0 w-6 flex justify-center">
                <item.icon
                  size={20}
                  className={`transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-primary' : 'text-text-muted'}`}
                />
              </div>
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="font-medium whitespace-nowrap"
                  >
                    {item.name}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          )
        })}
      </nav>

      <div className="p-3 border-t border-slate-800 space-y-1 overflow-hidden">
        <Link to="/settings" className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-slate-800 transition-colors group">
          <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center font-black text-primary text-sm flex-shrink-0 overflow-hidden">
            {user?.avatarBase64 
                ? <img src={user.avatarBase64} alt="User Avatar" className="w-full h-full object-cover" />
                : (user?.displayName || user?.email || 'U')[0].toUpperCase()}
          </div>
          {!isCollapsed && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="flex-1 min-w-0"
            >
              <p className="text-sm font-semibold truncate">{user?.displayName || user?.email?.split('@')[0] || 'User'}</p>
              <p className="text-xs text-slate-500 truncate">{user?.email}</p>
            </motion.div>
          )}
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-3 text-text-muted hover:text-danger rounded-xl transition-colors"
        >
          <div className="w-6 flex justify-center flex-shrink-0">
            <LogOut size={20} />
          </div>
          {!isCollapsed && (
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-medium">Logout</motion.span>
          )}
        </button>
      </div>
    </motion.aside>
  )
}

export default Sidebar
