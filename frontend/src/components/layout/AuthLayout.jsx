import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

const AuthLayout = ({ children, title, subtitle, alternativeText, alternativeLink, alternativeAction }) => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Go Back Button */}
      <Link 
        to="/" 
        className="absolute top-8 left-8 flex items-center gap-2 text-text-muted hover:text-primary transition-colors font-semibold group z-20"
      >
        <div className="w-10 h-10 rounded-full bg-card border border-slate-800 flex items-center justify-center group-hover:bg-slate-800">
           <ArrowLeft size={20} />
        </div>
        <span className="hidden sm:inline">Go Back</span>
      </Link>

      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary rounded-full blur-[100px]"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-accent rounded-full blur-[100px]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="mb-8 text-center">
            <Link to="/" className="inline-flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-xl">
                 <span className="text-white font-bold text-2xl">V</span>
              </div>
            </Link>
            <h1 className="text-3xl font-black mb-3">{title}</h1>
            <p className="text-text-muted">{subtitle}</p>
        </div>

        <div className="bg-card/50 backdrop-blur-xl border border-slate-800 p-8 md:p-10 rounded-[2.5rem] shadow-premium">
          {children}
        </div>

        <p className="mt-8 text-center text-sm text-text-muted">
          {alternativeText}{' '}
          <Link to={alternativeLink} className="text-primary font-bold hover:underline">
            {alternativeAction}
          </Link>
        </p>
      </motion.div>
    </div>
  )
}

export default AuthLayout
