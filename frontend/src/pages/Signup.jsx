import { useState } from 'react'
import AuthLayout from '../components/layout/AuthLayout'
import { User, Mail, Lock, UserPlus, Building2, Phone, Eye, EyeOff, Briefcase, MapPin } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const inputClass = "w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm placeholder:text-slate-600"
const labelClass = "text-xs font-bold uppercase tracking-widest text-text-muted ml-1"
const BUSINESS_TYPES = ['Manufacturer', 'Retailer', 'Distributor', 'E-commerce', 'Wholesaler', 'Other']

const Signup = () => {
  const navigate = useNavigate()
  const { signup, logout } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [step, setStep] = useState(1)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    fullName: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    businessName: '',
    businessType: '',
    gst: '',
    city: '',
    role: 'Staff',
    agreeTerms: false,
  })

  const set = (key, val) => setForm((prev) => ({ ...prev, [key]: val }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signup(form.email, form.password, {
        name: form.fullName,
        username: form.username,
        phone: form.phone,
        businessName: form.businessName,
        businessType: form.businessType,
        gst: form.gst,
        city: form.city,
        role: form.role,
      })
      await logout()
      navigate('/login', { state: { message: 'Account created successfully. Please sign in to continue.' } })
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title={step === 1 ? 'Create Account' : 'Business Details'}
      subtitle={step === 1 ? 'Start your VendorFlow workspace' : 'Tell us about your business'}
      alternativeText="Already have an account?"
      alternativeLink="/login"
      alternativeAction="Sign in"
    >
      <div className="flex items-center gap-3 mb-8">
        {[1, 2].map((s) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${step >= s ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-slate-800 text-slate-500'}`}>
              {s}
            </div>
            <div className={`flex-1 h-0.5 rounded-full transition-all ${s < 2 ? (step > s ? 'bg-primary' : 'bg-slate-800') : 'hidden'}`} />
          </div>
        ))}
        <div className="text-xs text-slate-500 font-medium whitespace-nowrap">Step {step} of 2</div>
      </div>

      {step === 1 && (
        <form onSubmit={(e) => { e.preventDefault(); setStep(2) }} className="space-y-5">
          <Field label="Full Name" icon={User} value={form.fullName} onChange={(v) => set('fullName', v)} placeholder="e.g. Amit Sharma" />
          <Field label="Username" icon={UserPlus} value={form.username} onChange={(v) => set('username', v.toLowerCase().replace(/\s/g, '_'))} placeholder="e.g. amit_owner" />
          <Field label="Work Email" icon={Mail} value={form.email} onChange={(v) => set('email', v)} placeholder="you@company.com" type="email" />
          <Field label="Phone Number" icon={Phone} value={form.phone} onChange={(v) => set('phone', v)} placeholder="+91 98765 43210" type="tel" />
          <div className="space-y-2">
            <label className={labelClass}>Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 group-focus-within:text-primary transition-colors" />
              <input required minLength={8} type={showPassword ? 'text' : 'password'} placeholder="Minimum 8 characters" value={form.password} onChange={(e) => set('password', e.target.value)} className={inputClass} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-primary transition-colors">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <button type="submit" className="w-full gradient-btn py-4 rounded-2xl font-bold shadow-lg shadow-primary/20">Continue</button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleSubmit} className="space-y-5">
          <Field label="Business / Company Name" icon={Building2} value={form.businessName} onChange={(v) => set('businessName', v)} placeholder="e.g. Sharma Textiles Pvt. Ltd." />
          <div className="space-y-2">
            <label className={labelClass}>Business Type</label>
            <div className="relative group">
              <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 pointer-events-none z-10 group-focus-within:text-primary transition-colors" />
              <select required value={form.businessType} onChange={(e) => set('businessType', e.target.value)} className={`${inputClass} appearance-none cursor-pointer`}>
                <option value="" disabled>Select your business type</option>
                {BUSINESS_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <Field label="City / Location" icon={MapPin} value={form.city} onChange={(v) => set('city', v)} placeholder="e.g. Mumbai, Maharashtra" />
          <Field label="GST Number (optional)" icon={null} value={form.gst} onChange={(v) => set('gst', v.toUpperCase())} placeholder="22AAAAA0000A1Z5" required={false} />
          <div className="flex items-start gap-3 px-1 pt-1">
            <input id="terms" required type="checkbox" checked={form.agreeTerms} onChange={(e) => set('agreeTerms', e.target.checked)} className="w-4 h-4 rounded accent-primary mt-0.5 flex-shrink-0 cursor-pointer" />
            <label htmlFor="terms" className="text-xs text-text-muted cursor-pointer leading-relaxed">I agree to VendorFlow's Terms of Service and Privacy Policy</label>
          </div>
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={() => setStep(1)} className="px-6 py-4 rounded-2xl border border-slate-700 hover:bg-slate-800 transition-all font-bold text-text-muted">Back</button>
            <button type="submit" disabled={loading} className="flex-1 gradient-btn py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-60">
              {loading ? 'Creating...' : 'Create Account'}
              {!loading && <UserPlus size={20} />}
            </button>
          </div>
        </form>
      )}
    </AuthLayout>
  )
}

const Field = ({ label, icon: Icon, value, onChange, placeholder, type = 'text', required = true }) => (
  <div className="space-y-2">
    <label className={labelClass}>{label}</label>
    <div className="relative group">
      {Icon ? <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 group-focus-within:text-primary transition-colors" /> : <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-black">GST</span>}
      <input required={required} type={type} placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} className={`${inputClass} ${Icon ? '' : 'pl-14'}`} />
    </div>
  </div>
)

export default Signup
