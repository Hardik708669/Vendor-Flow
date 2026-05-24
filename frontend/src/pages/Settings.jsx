import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  User, Mail, Phone, Building2, MapPin, Lock, Bell, Shield,
  Camera, Check, Globe, Briefcase, AlertTriangle,
  Eye, EyeOff, Save, Smartphone
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const TAB_CONFIG = [
  { id: 'profile',       label: 'Profile',        icon: User },
  { id: 'business',      label: 'Business',       icon: Building2 },
  { id: 'notifications', label: 'Notifications',  icon: Bell },
  { id: 'security',      label: 'Security',       icon: Shield },
]

const inputCls = "w-full bg-slate-900 border border-slate-800 rounded-2xl py-3.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all placeholder:text-slate-600"
const labelCls = "block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 ml-1"

const SectionCard = ({ title, desc, children }) => (
  <div className="bg-card border border-slate-800 rounded-2xl p-6 shadow-premium space-y-5">
    {(title || desc) && (
      <div className="pb-4 border-b border-slate-800">
        {title && <h3 className="font-bold text-lg">{title}</h3>}
        {desc && <p className="text-text-muted text-sm mt-1">{desc}</p>}
      </div>
    )}
    {children}
  </div>
)

const Toggle = ({ enabled, onChange, label, sub }) => (
  <div className="flex items-center justify-between py-2">
    <div>
      <p className="text-sm font-semibold">{label}</p>
      {sub && <p className="text-xs text-text-muted mt-0.5">{sub}</p>}
    </div>
    <button
      onClick={() => onChange(!enabled)}
      className={`relative w-12 h-6 rounded-full transition-all duration-300 ${enabled ? 'bg-primary' : 'bg-slate-700'}`}
    >
      <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-300 ${enabled ? 'translate-x-6' : 'translate-x-0'}`} />
    </button>
  </div>
)

const SaveBar = ({ onSave }) => (
  <div className="flex justify-end">
    <button onClick={onSave} className="gradient-btn px-6 py-3 rounded-xl font-bold flex items-center gap-2">
      <Save size={16} /> Save Changes
    </button>
  </div>
)

export default function Settings() {
  const { user, updateUser } = useAuth()
  const [tab, setTab] = useState('profile')
  const [saved, setSaved] = useState(false)
  const [showPass, setShowPass] = useState({ old: false, new: false, confirm: false })
  const [avatar, setAvatar] = useState(user?.avatarBase64 || null)

  const [profile, setProfile] = useState({
    name: user?.displayName || user?.email?.split('@')[0] || 'User',
    email: user?.email || '',
    phone: user?.phone || '',
    role: user?.role || 'Business Owner',
    city: user?.city || 'Mumbai',
    bio: 'Managing vendor operations.',
  })

  const [business, setBusiness] = useState({
    companyName: user?.businessName || 'VendorFlow Enterprises', 
    type: user?.businessType || 'Manufacturer',
    gst: user?.gst || '', 
    address: '12, Business Park, Andheri East',
    city: user?.city || 'Mumbai', 
    state: 'Maharashtra', 
    pin: '400069', 
    website: 'https://vendorflow.com',
  })

  const [notifs, setNotifs] = useState({
    emailPaymentDue: true, emailNewOrder: true, smsReminders: false,
    weeklyReport: true, overdueAlerts: true, productionUpdates: false,
  })

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result
        setAvatar(base64String)
        updateUser({ avatarBase64: base64String })
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Profile & Settings</h1>
        <p className="text-text-muted mt-1">Manage your account, business info, and preferences.</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 bg-card border border-slate-800 rounded-2xl p-1.5 w-fit">
        {TAB_CONFIG.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              tab === t.id ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'text-text-muted hover:text-text hover:bg-slate-800'
            }`}
          >
            <t.icon size={16} />
            {t.label}
          </button>
        ))}
      </div>

      {/* Save Success Toast */}
      {saved && (
        <motion.div
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
          className="fixed top-6 right-6 z-50 bg-green-500 text-white px-5 py-3 rounded-2xl flex items-center gap-2 font-bold shadow-xl"
        >
          <Check size={18} /> Changes saved!
        </motion.div>
      )}

      {/* ── PROFILE TAB ── */}
      {tab === 'profile' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Avatar Card */}
          <SectionCard title="Profile Photo" desc="Your photo will appear in the dashboard header.">
            <div className="flex items-center gap-6">
              <div className="relative group">
                <div className="w-24 h-24 rounded-full bg-primary/20 border-2 border-primary/30 flex items-center justify-center overflow-hidden shadow-xl">
                  {user?.avatarBase64 || avatar
                    ? <img src={user?.avatarBase64 || avatar} alt="avatar" className="w-full h-full object-cover" />
                    : <span className="text-4xl font-black text-primary">{(profile.name || 'U')[0].toUpperCase()}</span>
                  }
                </div>
                <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Camera size={20} className="text-white" />
                  <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                </label>
              </div>
              <div>
                <p className="font-bold">{profile.name}</p>
                <p className="text-text-muted text-sm">{profile.role}</p>
                <label className="mt-2 inline-flex items-center gap-2 text-xs font-bold text-primary cursor-pointer hover:underline">
                  <Camera size={13} /> Upload new photo
                  <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                </label>
              </div>
            </div>
          </SectionCard>

          {/* Personal Info */}
          <SectionCard title="Personal Information" desc="Update your name, contact, and role.">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelCls}>Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                  <input value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})}
                    className={inputCls + ' pl-10'} />
                </div>
              </div>
              <div>
                <label className={labelCls}>Work Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                  <input value={profile.email} onChange={e => setProfile({...profile, email: e.target.value})}
                    type="email" className={inputCls + ' pl-10'} />
                </div>
              </div>
              <div>
                <label className={labelCls}>Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                  <input value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})}
                    className={inputCls + ' pl-10'} />
                </div>
              </div>
              <div>
                <label className={labelCls}>Role / Title</label>
                <div className="relative">
                  <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                  <input value={profile.role} onChange={e => setProfile({...profile, role: e.target.value})}
                    className={inputCls + ' pl-10'} />
                </div>
              </div>
              <div>
                <label className={labelCls}>City</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                  <input value={profile.city} onChange={e => setProfile({...profile, city: e.target.value})}
                    className={inputCls + ' pl-10'} />
                </div>
              </div>
              <div>
                <label className={labelCls}>Short Bio</label>
                <input value={profile.bio} onChange={e => setProfile({...profile, bio: e.target.value})}
                  placeholder="Tell us about yourself..." className={inputCls} />
              </div>
            </div>
            <SaveBar onSave={handleSave} />
          </SectionCard>

          {/* Danger Zone */}
          <SectionCard>
            <div className="flex items-start gap-4 p-4 rounded-2xl border border-red-500/20 bg-red-500/5">
              <AlertTriangle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-bold text-red-400">Delete Account</p>
                <p className="text-text-muted text-sm mt-1">This will permanently delete your account and all associated data. This action cannot be undone.</p>
              </div>
              <button className="flex-shrink-0 px-4 py-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 text-sm font-bold hover:bg-red-500/20 transition-all">
                Delete
              </button>
            </div>
          </SectionCard>
        </motion.div>
      )}

      {/* ── BUSINESS TAB ── */}
      {tab === 'business' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <SectionCard title="Business Information" desc="This will appear on invoices and official documents.">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className={labelCls}>Company Name</label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                  <input value={business.companyName} onChange={e => setBusiness({...business, companyName: e.target.value})}
                    className={inputCls + ' pl-10'} />
                </div>
              </div>
              <div>
                <label className={labelCls}>Business Type</label>
                <div className="relative">
                  <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4 pointer-events-none" />
                  <select value={business.type} onChange={e => setBusiness({...business, type: e.target.value})}
                    className={inputCls + ' pl-10 appearance-none cursor-pointer'}>
                    {['Manufacturer', 'Retailer', 'Distributor', 'E-commerce', 'Wholesaler', 'Other'].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className={labelCls}>GST Number</label>
                <input value={business.gst} onChange={e => setBusiness({...business, gst: e.target.value.toUpperCase()})}
                  placeholder="22AAAAA0000A1Z5" maxLength={15} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Website</label>
                <div className="relative">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                  <input value={business.website} onChange={e => setBusiness({...business, website: e.target.value})}
                    className={inputCls + ' pl-10'} />
                </div>
              </div>
              <div>
                <label className={labelCls}>PIN Code</label>
                <input value={business.pin} onChange={e => setBusiness({...business, pin: e.target.value})}
                  maxLength={6} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>State</label>
                <input value={business.state} onChange={e => setBusiness({...business, state: e.target.value})}
                  className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>City</label>
                <input value={business.city} onChange={e => setBusiness({...business, city: e.target.value})}
                  className={inputCls} />
              </div>
              <div className="md:col-span-2">
                <label className={labelCls}>Business Address</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                  <input value={business.address} onChange={e => setBusiness({...business, address: e.target.value})}
                    className={inputCls + ' pl-10'} />
                </div>
              </div>
            </div>
            <SaveBar onSave={handleSave} />
          </SectionCard>
        </motion.div>
      )}

      {/* ── NOTIFICATIONS TAB ── */}
      {tab === 'notifications' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <SectionCard title="Email Notifications" desc="Choose what updates you want to receive by email.">
            <div className="divide-y divide-slate-800/50">
              <Toggle enabled={notifs.emailPaymentDue} onChange={v => setNotifs({...notifs, emailPaymentDue: v})} label="Payment Due Alerts" sub="Get notified 3 days before a payment is due." />
              <Toggle enabled={notifs.emailNewOrder} onChange={v => setNotifs({...notifs, emailNewOrder: v})} label="New Order Created" sub="Email when a new order is added to the system." />
              <Toggle enabled={notifs.weeklyReport} onChange={v => setNotifs({...notifs, weeklyReport: v})} label="Weekly Business Report" sub="Receive a summary every Monday morning." />
              <Toggle enabled={notifs.overdueAlerts} onChange={v => setNotifs({...notifs, overdueAlerts: v})} label="Overdue Payment Alerts" sub="Immediate alert when a payment goes overdue." />
            </div>
          </SectionCard>
          <SectionCard title="SMS & Push Notifications" desc="Real-time alerts via SMS.">
            <div className="divide-y divide-slate-800/50">
              <Toggle enabled={notifs.smsReminders} onChange={v => setNotifs({...notifs, smsReminders: v})} label="SMS Payment Reminders" sub="Send SMS reminders to customers automatically." />
              <Toggle enabled={notifs.productionUpdates} onChange={v => setNotifs({...notifs, productionUpdates: v})} label="Production Status Updates" sub="Notify when an order moves to a new stage." />
            </div>
          </SectionCard>
          <SaveBar onSave={handleSave} />
        </motion.div>
      )}

      {/* ── SECURITY TAB ── */}
      {tab === 'security' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <SectionCard title="Change Password" desc="Use a strong password you don't use elsewhere.">
            <div className="space-y-4">
              {[
                { key: 'old', label: 'Current Password', placeholder: '••••••••' },
                { key: 'new', label: 'New Password', placeholder: 'Minimum 8 characters' },
                { key: 'confirm', label: 'Confirm New Password', placeholder: 'Repeat new password' },
              ].map(f => (
                <div key={f.key}>
                  <label className={labelCls}>{f.label}</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                    <input
                      type={showPass[f.key] ? 'text' : 'password'}
                      placeholder={f.placeholder}
                      className={inputCls + ' pl-10 pr-12'}
                    />
                    <button type="button"
                      onClick={() => setShowPass(p => ({...p, [f.key]: !p[f.key]}))}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-primary transition-colors">
                      {showPass[f.key] ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <SaveBar onSave={handleSave} />
          </SectionCard>

          <SectionCard title="Two-Factor Authentication" desc="Add an extra layer of security to your account.">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/50 border border-slate-800">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Smartphone size={22} className="text-primary" />
                </div>
                <div>
                  <p className="font-bold">Authenticator App</p>
                  <p className="text-text-muted text-sm">Use Google Authenticator or Authy</p>
                </div>
              </div>
              <button className="px-4 py-2 rounded-xl bg-primary/10 text-primary border border-primary/20 text-sm font-bold hover:bg-primary/20 transition-all">
                Enable
              </button>
            </div>
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/50 border border-slate-800">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Phone size={22} className="text-primary" />
                </div>
                <div>
                  <p className="font-bold">SMS Verification</p>
                  <p className="text-text-muted text-sm">Get a code via SMS to your phone</p>
                </div>
              </div>
              <button className="px-4 py-2 rounded-xl bg-primary/10 text-primary border border-primary/20 text-sm font-bold hover:bg-primary/20 transition-all">
                Enable
              </button>
            </div>
          </SectionCard>

          <SectionCard title="Active Sessions">
            <div className="space-y-3">
              {[
                { device: 'Chrome on Windows', location: 'Mumbai, India', current: true, time: 'Active now' },
                { device: 'Safari on iPhone', location: 'Delhi, India', current: false, time: '2 days ago' },
              ].map(s => (
                <div key={s.device} className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/50 border border-slate-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm">{s.device}</p>
                      {s.current && <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 text-[10px] font-black">Current</span>}
                    </div>
                    <p className="text-xs text-text-muted mt-0.5">{s.location} · {s.time}</p>
                  </div>
                  {!s.current && (
                    <button className="text-xs font-bold text-red-400 hover:underline">Revoke</button>
                  )}
                </div>
              ))}
            </div>
          </SectionCard>
        </motion.div>
      )}
    </div>
  )
}
