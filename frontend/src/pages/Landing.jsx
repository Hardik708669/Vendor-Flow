import { motion } from 'framer-motion'
import { 
  ArrowRight, 
  CheckCircle2, 
  BarChart3, 
  ShieldCheck, 
  Zap,
  Play,
  Plus,
  TrendingUp
} from 'lucide-react'
import { Link } from 'react-router-dom'

const Landing = () => {
  return (
    <div className="bg-background text-text selection:bg-primary/30 min-h-screen overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/50 backdrop-blur-xl border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <img src="/favicon.png" alt="VendorFlow Logo" className="w-10 h-10 rounded-xl shadow-lg object-cover" />
             <span className="text-xl font-bold tracking-tight">VendorFlow</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-text-muted hover:text-text transition-colors">Features</a>
            <a href="#solutions" className="text-sm font-medium text-text-muted hover:text-text transition-colors">Solutions</a>
            <a href="#process" className="text-sm font-medium text-text-muted hover:text-text transition-colors">Process</a>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-semibold hover:text-primary transition-colors">Login</Link>
            <Link to="/signup" className="gradient-btn px-6 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-primary/20">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] opacity-20 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] bg-accent rounded-full blur-[100px] animate-pulse delay-700"></div>
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700 text-xs font-bold tracking-widest uppercase mb-6 inline-block text-primary">
              The Future of Vendor Management
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8 leading-[1.1]">
              Manage Orders & <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Track Payments 
              </span>
              <br />Like a Pro.
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-text-muted mb-10 leading-relaxed">
              VendorFlow empowers businesses to streamline order lifecycles, monitor outstanding payments, and minimize financial risks with AI-driven insights.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/signup" className="gradient-btn w-full sm:w-auto px-8 py-4 rounded-2xl text-lg font-bold flex items-center justify-center gap-2 group shadow-xl">
                Start Free Trial
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-800/50 border border-slate-700 text-lg font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <Play size={14} className="text-primary ml-1" />
                </div>
                Watch Demo
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Solutions Section */}
      <section id="solutions" className="py-32 px-6 bg-slate-900/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight">Tailored Solutions for <br /><span className="text-primary">Modern Finance</span></h2>
              <div className="space-y-6">
                <SolutionItem title="For Manufacturers" desc="Track raw material orders and vendor payments in a unified timeline." />
                <SolutionItem title="For Retailers" desc="Manage thousands of SKUs and dozens of suppliers with automated reconciliations." />
                <SolutionItem title="For E-commerce" desc="Seamlessly integrate with your store to track fulfillment and vendor payouts." />
              </div>
            </motion.div>
            <div className="relative group">
              <div className="absolute -inset-4 bg-primary/20 blur-[80px] rounded-full group-hover:bg-primary/30 transition-all duration-700"></div>
              <motion.div 
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="relative bg-card border border-slate-700/50 rounded-[2.5rem] p-5 shadow-premium ring-1 ring-white/5 overflow-hidden"
              >
                <DashboardPreview />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Order Lifecycle Process Section (Replaced Pricing) */}
      <section id="process" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Seamless Order Lifecycle</h2>
            <p className="text-text-muted text-lg max-w-2xl mx-auto">
              Track your business operations from initial creation to final delivery and payment in real-time.
            </p>
          </div>
          
          <div className="relative">
            {/* Connecting Line (Desktop) */}
            <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-blue-500/20 via-purple-500/50 to-green-500/20 hidden lg:block -translate-y-1/2 rounded-full"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-10 lg:gap-4 relative z-10">
              <ProcessStep 
                num="01" 
                title="Created" 
                desc="New order is recorded and assigned to a vendor." 
                icon={Plus}
                color="blue"
              />
              <ProcessStep 
                num="02" 
                title="Confirmed" 
                desc="Vendor accepts and confirms the order details." 
                icon={CheckCircle2}
                color="indigo"
              />
              <ProcessStep 
                num="03" 
                title="Production" 
                desc="Real-time tracking of manufacturing status." 
                icon={Zap}
                color="purple"
              />
              <ProcessStep 
                num="04" 
                title="Dispatch" 
                desc="Order is shipped and tracking is shared." 
                icon={TrendingUp}
                color="amber"
              />
              <ProcessStep 
                num="05" 
                title="Completed" 
                desc="Final delivery and payment reconciliation." 
                icon={ShieldCheck}
                color="green"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 px-6 bg-slate-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Everything you need to <br/> scale your operations</h2>
            <p className="text-text-muted text-lg max-w-2xl mx-auto">
              Our comprehensive toolset helps you maintain healthy cash flow and robust vendor relationships.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={BarChart3} 
              title="Smart Analytics" 
              desc="Visualize your revenue and pending dues with interactive charts and real-time data." 
            />
            <FeatureCard 
              icon={ShieldCheck} 
              title="Risk Management" 
              desc="Identify risky customers automatically based on payment history and delay patterns." 
            />
            <FeatureCard 
              icon={Zap} 
              title="Auto Reminders" 
              desc="Set up automated payment reminders with tiered urgency levels for better recovery." 
            />
          </div>
        </div>
      </section>

      {/* Premium Stats + CTA Section */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="relative rounded-[3rem] overflow-hidden border border-slate-700/50 ring-1 ring-white/5">
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950/40 to-purple-950/30"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/20 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-0">
              {/* Left: Stats */}
              <div className="p-12 md:p-16 border-b lg:border-b-0 lg:border-r border-slate-700/50">
                <p className="text-xs font-black text-primary uppercase tracking-widest mb-10">Trusted by businesses worldwide</p>
                <div className="grid grid-cols-2 gap-8">
                  {[
                    { num: '5,000+', label: 'Active Businesses' },
                    { num: '₹500Cr+', label: 'Payments Tracked' },
                    { num: '98.7%', label: 'Uptime SLA' },
                    { num: '2.1M+', label: 'Orders Processed' },
                  ].map(s => (
                    <motion.div
                      key={s.label}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                    >
                      <p className="text-3xl md:text-4xl font-black text-white mb-1">{s.num}</p>
                      <p className="text-text-muted text-sm">{s.label}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Right: CTA */}
              <div className="p-12 md:p-16 flex flex-col justify-center">
                <h2 className="text-3xl md:text-4xl font-black mb-4 leading-tight">
                  Start managing <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">smarter</span> today.
                </h2>
                <p className="text-text-muted mb-8 leading-relaxed">
                  Join thousands of finance teams who eliminated manual tracking and recovered outstanding dues faster with VendorFlow.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/signup" className="gradient-btn px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 group shadow-xl shadow-primary/20">
                    Get Started Free
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link to="/login" className="px-8 py-4 rounded-2xl font-bold border border-slate-700 hover:bg-slate-800 transition-all flex items-center justify-center text-text-muted">
                    Sign In
                  </Link>
                </div>
                <p className="mt-5 text-xs text-slate-600">No credit card required · Cancel anytime · 14-day free trial</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
             <img src="/favicon.png" alt="VendorFlow Logo" className="w-8 h-8 rounded-lg shadow-lg object-cover" />
             <span className="font-bold">VendorFlow</span>
          </div>
          <p className="text-text-muted text-sm">© 2026 VendorFlow Inc. All rights reserved.</p>
          <div className="flex gap-6">
             <a href="#" className="text-text-muted hover:text-text transition-colors text-sm">Privacy</a>
             <a href="#" className="text-text-muted hover:text-text transition-colors text-sm">Terms</a>
             <a href="#" className="text-text-muted hover:text-text transition-colors text-sm">Twitter</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

const DashboardPreview = () => (
  <div className="w-full bg-slate-900/80 rounded-2xl overflow-hidden text-[10px] font-mono select-none">
    {/* Header bar */}
    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
      <div className="flex items-center gap-2">
        <img src="/favicon.png" alt="Logo" className="w-5 h-5 rounded-md object-cover" />
        <span className="text-slate-400 font-medium">VendorFlow</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div>
        <span className="text-slate-500">Live</span>
      </div>
    </div>

    {/* Stats Row */}
    <div className="grid grid-cols-3 gap-2 p-3">
      {[
        { label: 'Total Revenue', val: '₹48.2L', color: 'text-blue-400', up: true },
        { label: 'Outstanding', val: '₹12.7L', color: 'text-amber-400', up: false },
        { label: 'Orders', val: '1,243', color: 'text-green-400', up: true },
      ].map(s => (
        <div key={s.label} className="bg-slate-800/60 rounded-xl p-2.5 border border-slate-700/50">
          <p className="text-slate-500 mb-1">{s.label}</p>
          <p className={`font-black text-[13px] ${s.color}`}>{s.val}</p>
          <p className={`text-[9px] mt-0.5 ${s.up ? 'text-green-400' : 'text-red-400'}`}>
            {s.up ? '▲ 12.3%' : '▼ 4.1%'} vs last month
          </p>
        </div>
      ))}
    </div>

    {/* Chart Area */}
    <div className="mx-3 mb-3 bg-slate-800/50 rounded-xl p-3 border border-slate-700/50">
      <div className="flex justify-between items-center mb-3">
        <span className="text-slate-300 font-bold">Payment Trend</span>
        <span className="text-slate-500">Last 6 months</span>
      </div>
      <div className="flex items-end gap-1.5 h-16">
        {[40, 65, 50, 80, 60, 90].map((h, i) => (
          <div key={i} className="flex-1 flex flex-col justify-end gap-0.5">
            <div
              style={{ height: `${h}%` }}
              className={`w-full rounded-t-md ${i === 5 ? 'bg-blue-500' : 'bg-blue-500/30'} transition-all`}
            ></div>
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-1.5 text-slate-600">
        {['Oct','Nov','Dec','Jan','Feb','Mar'].map(m => <span key={m}>{m}</span>)}
      </div>
    </div>

    {/* Order Table */}
    <div className="mx-3 mb-3">
      <p className="text-slate-400 font-bold mb-2 px-1">Recent Orders</p>
      <div className="space-y-1.5">
        {[
          { vendor: 'Alpha Textiles', amount: '₹3.2L', status: 'Paid', color: 'text-green-400 bg-green-400/10' },
          { vendor: 'Beta Suppliers', amount: '₹1.8L', status: 'Pending', color: 'text-amber-400 bg-amber-400/10' },
          { vendor: 'Gamma Goods', amount: '₹5.1L', status: 'Overdue', color: 'text-red-400 bg-red-400/10' },
        ].map(o => (
          <div key={o.vendor} className="flex items-center justify-between bg-slate-800/40 rounded-lg px-3 py-2 border border-slate-700/30">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-md bg-slate-700 flex items-center justify-center text-slate-400 font-black">
                {o.vendor[0]}
              </div>
              <span className="text-slate-300">{o.vendor}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-slate-300 font-bold">{o.amount}</span>
              <span className={`px-2 py-0.5 rounded-md font-bold ${o.color}`}>{o.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
)

const FeatureCard = ({ icon: Icon, title, desc }) => (
  <motion.div 
    whileHover={{ y: -10 }}
    className="p-8 rounded-3xl bg-slate-800/20 border border-slate-800 hover:border-primary/50 transition-colors group"
  >
    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 border border-primary/20 group-hover:bg-primary/20 transition-colors">
      <Icon className="text-primary" size={28} />
    </div>
    <h3 className="text-2xl font-bold mb-4">{title}</h3>
    <p className="text-text-muted leading-relaxed">{desc}</p>
  </motion.div>
)

const SolutionItem = ({ title, desc }) => (
  <div className="flex gap-5">
    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mt-1">
      <CheckCircle2 size={14} className="text-primary" />
    </div>
    <div>
      <h4 className="font-bold text-lg mb-1">{title}</h4>
      <p className="text-text-muted text-sm">{desc}</p>
    </div>
  </div>
)


const ProcessStep = ({ num, title, desc, icon: Icon, color }) => {
  const colors = {
    blue: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
    indigo: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
    purple: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
    amber: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    green: 'text-green-500 bg-green-500/10 border-green-500/20',
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      viewport={{ once: true }}
      className="flex flex-col items-center text-center group"
    >
      <div className={`w-20 h-20 rounded-3xl ${colors[color]} border flex items-center justify-center mb-6 relative z-10 group-hover:scale-110 transition-transform duration-500 shadow-xl ring-1 ring-white/10`}>
        <Icon size={32} />
        <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-background border border-slate-800 flex items-center justify-center text-[10px] font-black text-primary shadow-lg ring-1 ring-white/5">
          {num}
        </span>
      </div>
      <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">{title}</h3>
      <p className="text-text-muted text-sm leading-relaxed px-4">{desc}</p>
    </motion.div>
  )
}

export default Landing
