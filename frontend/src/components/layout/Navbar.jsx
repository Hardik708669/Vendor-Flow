import { Search, Menu } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import NotificationCenter from '../dashboard/NotificationCenter'

const Navbar = ({ activeTab, onMenuClick }) => {
  const { user } = useAuth()

  return (
    <header className="h-20 bg-background/50 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-4 md:px-8 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="p-2 hover:bg-slate-800 rounded-lg text-text-muted transition-colors md:mr-2"
        >
          <Menu size={24} />
        </button>
        <h2 className="text-lg font-semibold text-text hidden sm:block">{activeTab}</h2>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative group hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4 group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search anything..." 
            className="bg-card border border-slate-700 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all w-64"
          />
        </div>

        <div className="flex items-center gap-2">
          <NotificationCenter />
          <div className="h-8 w-[1px] bg-slate-800 mx-2"></div>
          <button className="flex items-center gap-3 p-1 pr-3 hover:bg-slate-800 rounded-full transition-colors">
            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center overflow-hidden border border-primary/30 text-primary font-bold">
              {user?.avatarBase64 
                ? <img src={user.avatarBase64} alt="User Avatar" className="w-full h-full object-cover" />
                : (user?.displayName || user?.email || 'U')[0].toUpperCase()}
            </div>
            <div className="text-left hidden lg:block">
              <p className="text-xs font-semibold leading-none">{user?.displayName || user?.email?.split('@')[0] || 'User'}</p>
              <p className="text-[10px] text-text-muted">{user?.email}</p>
            </div>
          </button>
        </div>
      </div>
    </header>
  )
}

export default Navbar
