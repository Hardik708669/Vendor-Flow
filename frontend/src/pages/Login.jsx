import { useState } from 'react'
import AuthLayout from '../components/layout/AuthLayout'
import { Lock, LogIn, Eye, EyeOff, User } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const inputClass = "w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm placeholder:text-slate-600"
const labelClass = "text-xs font-bold uppercase tracking-widest text-text-muted ml-1"

const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({ identifier: '', password: '', remember: true })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const successMsg = location.state?.message

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form.identifier, form.password, form.remember)
      navigate('/dashboard')
    } catch {
      setError('Invalid identifier or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to your VendorFlow account"
      alternativeText="Don't have an account?"
      alternativeLink="/signup"
      alternativeAction="Create one free"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {successMsg && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 flex items-center gap-3 animate-in fade-in slide-in-from-top-1 duration-300">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
              <LogIn className="w-4 h-4 text-emerald-500" />
            </div>
            <p className="text-sm font-medium text-emerald-500 leading-relaxed">{successMsg}</p>
          </div>
        )}

        {/* Identifier */}
        <div className="space-y-2">
          <label className={labelClass}>Email or Username</label>
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 group-focus-within:text-primary transition-colors" />
            <input
              required
              type="text"
              placeholder="e.g. amit_owner"
              value={form.identifier}
              onChange={e => setForm({ ...form, identifier: e.target.value })}
              className={inputClass}
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-2">
          <div className="flex justify-between items-center px-1">
            <label className={labelClass}>Password</label>
            <a href="#" className="text-xs text-primary font-bold hover:underline">Forgot password?</a>
          </div>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 group-focus-within:text-primary transition-colors" />
            <input
              required
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              className={inputClass}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-primary transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 px-1">
          <input 
            id="remember" 
            type="checkbox" 
            checked={form.remember}
            onChange={e => setForm({ ...form, remember: e.target.checked })}
            className="w-4 h-4 rounded accent-primary cursor-pointer" 
          />
          <label htmlFor="remember" className="text-sm text-text-muted cursor-pointer">Keep me signed in</label>
        </div>

        {error && <p className="text-red-400 text-sm text-center">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full gradient-btn py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 mt-2 disabled:opacity-60"
        >
          {loading ? 'Signing in...' : 'Sign In'}
          {!loading && <LogIn size={20} />}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-4 pt-2">
          <div className="flex-1 h-px bg-slate-800"></div>
          <span className="text-xs text-slate-600">or continue with</span>
          <div className="flex-1 h-px bg-slate-800"></div>
        </div>

        {/* Google SSO placeholder */}
        <button
          type="button"
          className="w-full py-3.5 rounded-2xl border border-slate-700 hover:bg-slate-800 transition-all text-sm font-semibold flex items-center justify-center gap-3 text-text-muted"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
            <path d="M3.964 10.71C3.784 10.17 3.682 9.593 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9s.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>
      </form>
    </AuthLayout>
  )
}

export default Login
