import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  TrendingDown, 
  ChevronDown, 
  Star, 
  ArrowRight, 
  ShieldCheck, 
  Smartphone, 
  BarChart3, 
  Receipt, 
  Zap, 
  Moon, 
  CheckCircle2, 
  Mail, 
  Users, 
  Calendar,
  Lock,
  Download,
  Check
} from 'lucide-react';
import { useToast } from '../components/Toast';

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  // States for FAQs
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  
  // Contact Form State
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMsg, setContactMsg] = useState('');
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMsg) {
      showToast('Please fill out all fields', 'warning');
      return;
    }
    showToast('Message sent successfully! Our team will contact you shortly.', 'success');
    setContactName('');
    setContactEmail('');
    setContactMsg('');
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) {
      showToast('Please enter your email', 'warning');
      return;
    }
    showToast('Subscribed to our newsletter successfully!', 'success');
    setNewsletterEmail('');
  };

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const faqs = [
    { q: 'How secure is my financial data?', a: 'Your data is encrypted securely. All operations are kept fully private and tokenized. We never share your personal expenses or details.' },
    { q: 'Can I export my expense reports?', a: 'Absolutely! You can instantly generate and download customized CSV, Excel, or formatted printable PDF sheets of your transaction history.' },
    { q: 'Is there a limit on how many expenses I can track?', a: 'No. The Free SaaS Starter tier allows unlimited transaction logging, category tracking, and interactive analysis charts.' },
    { q: 'Does ApexFinance support multiple currencies?', a: 'Yes. You can switch your preferred currency symbol ($, €, £, ₹, etc.) at any time from your settings panel.' },
    { q: 'Is the platform mobile responsive?', a: 'Yes, absolutely. The design is engineered from a mobile-first philosophy. It functions beautifully on any smartphone, tablet, or large screen.' }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-slate-950 scroll-smooth">
      
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-900 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <TrendingDown size={20} className="text-slate-950 stroke-[3]" />
            </div>
            <span className="font-extrabold text-xl bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              ApexFinance
            </span>
          </div>

          {/* Desktop Nav links */}
          <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#hero" className="hover:text-emerald-400 transition-colors">Home</a>
            <a href="#features" className="hover:text-emerald-400 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-emerald-400 transition-colors">How It Works</a>
            <a href="#why-choose-us" className="hover:text-emerald-400 transition-colors">Why Choose Us</a>
            <a href="#pricing" className="hover:text-emerald-400 transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-emerald-400 transition-colors">FAQ</a>
            <a href="#contact" className="hover:text-emerald-400 transition-colors">Contact</a>
          </div>

          {/* CTA Group */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <button 
                onClick={() => navigate('/dashboard')}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold px-4.5 py-2 rounded-xl text-sm transition-all flex items-center gap-1.5 shadow-lg shadow-emerald-500/10 cursor-pointer"
              >
                Go to Dashboard <ArrowRight size={15} />
              </button>
            ) : (
              <>
                <Link to="/login" className="text-sm font-semibold text-slate-300 hover:text-emerald-400 px-3 py-2 transition-colors">
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4.5 py-2 rounded-xl text-sm transition-all shadow-lg shadow-emerald-500/10"
                >
                  Get Started Free
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="relative pt-20 pb-24 px-6 overflow-hidden">
        {/* Decorative background radial grids */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 right-10 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-center relative z-10">
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <Zap size={13} /> Secure Daily Financial Assistant
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-100 leading-[1.1] tracking-tight">
              Take Control of Your Money, <br />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent">
                One Expense at a Time.
              </span>
            </h1>
            <p className="text-slate-400 text-lg max-w-xl leading-relaxed">
              Ditch complicated spreadsheets. Record, categorize, analyze, and manage your daily expenses with a polished SaaS platform engineered to keep you smart, secure, and under budget.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button 
                onClick={() => navigate(isAuthenticated ? '/dashboard' : '/register')}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-6 py-3.5 rounded-2xl flex items-center gap-2 transition-all shadow-xl shadow-emerald-500/10 hover:translate-y-[-2px] cursor-pointer"
              >
                Start Free Trial <ArrowRight size={18} />
              </button>
              <a 
                href="#how-it-works"
                className="bg-slate-900 border border-slate-800 hover:bg-slate-850 text-slate-300 font-bold px-6 py-3.5 rounded-2xl transition-all inline-flex items-center"
              >
                Learn More
              </a>
            </div>
            
            {/* Quick trust metrics */}
            <div className="pt-8 grid grid-cols-3 gap-6 border-t border-slate-900">
              <div>
                <p className="text-2xl font-extrabold text-emerald-400">100%</p>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-0.5">Privacy Assured</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-slate-200">0 ms</p>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-0.5">Sync Delay</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-slate-200">$0 / mo</p>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-0.5">Always Free Starter</p>
              </div>
            </div>
          </div>

          {/* Right side Mockup Dashboard */}
          <div className="lg:col-span-5 relative">
            <div className="w-full bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-10 bg-slate-900/60 border-b border-slate-800/80 flex items-center justify-between px-4">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-500/50" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500/50" />
                  <span className="w-3 h-3 rounded-full bg-green-500/50" />
                </div>
                <span className="text-[10px] text-slate-500 font-mono font-medium">apexfinance.app/dashboard</span>
                <span className="w-4" />
              </div>

              {/* Mock Dashboard widgets inside */}
              <div className="mt-8 space-y-4 text-left">
                {/* Balance & Month */}
                <div className="flex justify-between items-center bg-slate-950/40 p-4 rounded-xl border border-slate-800/50">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold block">July Total Spent</span>
                    <span className="text-2xl font-black text-slate-100">$1,248.50</span>
                  </div>
                  <div className="px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
                    -12.4% vs Last Month
                  </div>
                </div>

                {/* Progress bar mock */}
                <div className="space-y-1.5 p-3 rounded-xl bg-slate-950/20 border border-slate-800/20">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span className="font-semibold">Monthly Budget Target</span>
                    <span className="font-bold">$1,248 / $2,000</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: '62%' }} />
                  </div>
                </div>

                {/* Categories mockup list */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs p-2 rounded-lg hover:bg-slate-800/20">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span className="text-slate-300 font-medium">Food & Dining</span>
                    </div>
                    <span className="text-slate-200 font-bold">$412.00 (33%)</span>
                  </div>
                  <div className="flex justify-between items-center text-xs p-2 rounded-lg hover:bg-slate-800/20">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-400" />
                      <span className="text-slate-300 font-medium">Travel & Fuel</span>
                    </div>
                    <span className="text-slate-200 font-bold">$280.50 (22%)</span>
                  </div>
                  <div className="flex justify-between items-center text-xs p-2 rounded-lg hover:bg-slate-800/20">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      <span className="text-slate-300 font-medium">Bills & Utilities</span>
                    </div>
                    <span className="text-slate-200 font-bold">$185.00 (15%)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 border-t border-slate-900 bg-slate-950">
        <div className="max-w-7xl mx-auto text-center space-y-12">
          <div className="space-y-4">
            <span className="text-xs text-emerald-400 uppercase tracking-widest font-black">Robust Feature Set</span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-100">
              Everything You Need to Track and Grow
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
              Designed from the ground up for individual expense monitoring, featuring advanced statistics tools, local exports, and instant alerts.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800/60 hover:border-emerald-500/30 transition-all group hover:translate-y-[-2px] text-left">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors mb-4">
                <Receipt size={18} />
              </div>
              <h3 className="font-bold text-lg text-slate-100 mb-2">Add Expenses Instantly</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Log purchases with metadata including category tags, notes, payment methods, date, and description in seconds.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800/60 hover:border-emerald-500/30 transition-all group hover:translate-y-[-2px] text-left">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors mb-4">
                <BarChart3 size={18} />
              </div>
              <h3 className="font-bold text-lg text-slate-100 mb-2">Interactive Charts</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Visualize categories and trends beautifully through fully responsive pie charts, line graphs, and payment-method breakups.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800/60 hover:border-emerald-500/30 transition-all group hover:translate-y-[-2px] text-left">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors mb-4">
                <Lock size={18} />
              </div>
              <h3 className="font-bold text-lg text-slate-100 mb-2">Secure Authentication</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Rest easy with JWT validation, secure password hashing, rate limits, and custom-designed system guardrails.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800/60 hover:border-emerald-500/30 transition-all group hover:translate-y-[-2px] text-left">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors mb-4">
                <Calendar size={18} />
              </div>
              <h3 className="font-bold text-lg text-slate-100 mb-2">Monthly Budget Alerts</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Set active targets. Our system alerts you when you reach 80% or exceed your monthly cap to keep you aligned.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800/60 hover:border-emerald-500/30 transition-all group hover:translate-y-[-2px] text-left">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors mb-4">
                <Download size={18} />
              </div>
              <h3 className="font-bold text-lg text-slate-100 mb-2">PDF & CSV Exports</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Export all transactions with filters applied. Instant local downloads optimized for tax filing, printouts, or sharing.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800/60 hover:border-emerald-500/30 transition-all group hover:translate-y-[-2px] text-left">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors mb-4">
                <Smartphone size={18} />
              </div>
              <h3 className="font-bold text-lg text-slate-100 mb-2">100% Mobile Optimized</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Keep tracking on the move. Fast response rates, comfortable touch points, and layouts designed for any hand-held viewport.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-6 border-t border-slate-900 bg-slate-900/20">
        <div className="max-w-7xl mx-auto text-center space-y-12">
          <div className="space-y-4">
            <span className="text-xs text-emerald-400 uppercase tracking-widest font-black">Four Step Workflow</span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-100">
              Simple. Streamlined. Immediate.
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* Step 1 */}
            <div className="space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 text-emerald-400 font-extrabold text-lg flex items-center justify-center mx-auto shadow-md">
                1
              </div>
              <h3 className="font-bold text-lg text-slate-100">Create Account</h3>
              <p className="text-slate-400 text-xs sm:text-sm max-w-xs mx-auto">
                Sign up with your email and basic information. Choose your default currency.
              </p>
            </div>

            {/* Step 2 */}
            <div className="space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 text-emerald-400 font-extrabold text-lg flex items-center justify-center mx-auto shadow-md">
                2
              </div>
              <h3 className="font-bold text-lg text-slate-100">Login Securely</h3>
              <p className="text-slate-400 text-xs sm:text-sm max-w-xs mx-auto">
                Enter your hashed password to access your secure profile anytime, on any device.
              </p>
            </div>

            {/* Step 3 */}
            <div className="space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 text-emerald-400 font-extrabold text-lg flex items-center justify-center mx-auto shadow-md">
                3
              </div>
              <h3 className="font-bold text-lg text-slate-100">Add Daily Expenses</h3>
              <p className="text-slate-400 text-xs sm:text-sm max-w-xs mx-auto">
                Input transactions fast. Pick a category, select a payment method, and hit Save.
              </p>
            </div>

            {/* Step 4 */}
            <div className="space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 text-emerald-400 font-extrabold text-lg flex items-center justify-center mx-auto shadow-md">
                4
              </div>
              <h3 className="font-bold text-lg text-slate-100">Analyze Your Spending</h3>
              <p className="text-slate-400 text-xs sm:text-sm max-w-xs mx-auto">
                Track indicators, budget alerts, and category totals with interactive charts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section id="why-choose-us" className="py-24 px-6 border-t border-slate-900 bg-slate-950">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 text-left space-y-6">
            <span className="text-xs text-emerald-400 uppercase tracking-widest font-black">Our Philosophy</span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-100 leading-tight">
              Designed for Speed, Security, and Ease of Use.
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              We understand that the best personal expense tracker is the one you actually use. That is why we focused on making logging effortless, visual representation clean, and security unbreakable.
            </p>
            <div className="space-y-3">
              {[
                'Instant dashboard load times',
                'No third-party cookies or tracker scripts',
                'One-click download of all transaction details',
                'Custom target thresholds with automatic alerts'
              ].map((point, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-slate-300 font-medium">
                  <div className="w-5 h-5 rounded bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
                    <Check size={12} strokeWidth={3} />
                  </div>
                  {point}
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 grid sm:grid-cols-2 gap-6">
            <div className="bg-slate-900/20 p-6 rounded-2xl border border-slate-800 text-left space-y-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <Zap size={16} />
              </div>
              <h4 className="font-bold text-slate-200">Ultra Fast Loading</h4>
              <p className="text-slate-400 text-xs sm:text-sm">
                Engineered with React + Vite to serve pages instantly with zero layout shifts or lag.
              </p>
            </div>

            <div className="bg-slate-900/20 p-6 rounded-2xl border border-slate-800 text-left space-y-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <ShieldCheck size={16} />
              </div>
              <h4 className="font-bold text-slate-200">Encrypted Backups</h4>
              <p className="text-slate-400 text-xs sm:text-sm">
                Passwords hashed on server, session logs JWT controlled, and secure database parameters.
              </p>
            </div>

            <div className="bg-slate-900/20 p-6 rounded-2xl border border-slate-800 text-left space-y-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <CheckCircle2 size={16} />
              </div>
              <h4 className="font-bold text-slate-200">Zero Complications</h4>
              <p className="text-slate-400 text-xs sm:text-sm">
                Extremely intuitive layout that requires no tutorial. Start tracking in under 30 seconds.
              </p>
            </div>

            <div className="bg-slate-900/20 p-6 rounded-2xl border border-slate-800 text-left space-y-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <BarChart3 size={16} />
              </div>
              <h4 className="font-bold text-slate-200">Dynamic Analytics</h4>
              <p className="text-slate-400 text-xs sm:text-sm">
                Recharts analytics tracking category breakups, payments split, and monthly budget trends.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6 border-t border-slate-900 bg-slate-900/10">
        <div className="max-w-7xl mx-auto text-center space-y-12">
          <div className="space-y-4">
            <span className="text-xs text-emerald-400 uppercase tracking-widest font-black">Flexible Tier</span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-100">
              One Always-Free Starter Plan
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-xs sm:text-sm">
              We believe daily money management should be accessible to all. Start logging right now with zero hidden charges or premium locks on core features.
            </p>
          </div>

          <div className="max-w-md mx-auto bg-slate-900/60 rounded-3xl border-2 border-emerald-500/40 p-8 text-left relative overflow-hidden shadow-2xl">
            {/* Ribbon */}
            <div className="absolute top-4 right-[-32px] rotate-45 bg-emerald-500 text-slate-950 text-[10px] font-black uppercase tracking-widest py-1 px-10">
              Free Trial
            </div>

            <div className="space-y-2 mb-6">
              <h3 className="text-lg font-bold text-slate-300">Starter SaaS Account</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-slate-100">$0</span>
                <span className="text-slate-400 text-sm">/ always free</span>
              </div>
              <p className="text-slate-400 text-xs">Full access to core tracking, analytics charts, and reports.</p>
            </div>

            <div className="space-y-3.5 mb-8">
              {[
                'Unlimited transaction logs',
                'Advanced category analytics charts',
                'Automatic monthly budget threshold alerts',
                'Download data as Excel/CSV',
                'Formated browser printable PDFs',
                'Responsive client-side settings dashboard'
              ].map((benefit, index) => (
                <div key={index} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                  <Check size={14} className="text-emerald-400 mt-0.5 shrink-0" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>

            <button 
              onClick={() => navigate(isAuthenticated ? '/dashboard' : '/register')}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3.5 rounded-2xl text-center text-sm transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              Get Started Instantly
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 border-t border-slate-900 bg-slate-950">
        <div className="max-w-7xl mx-auto text-center space-y-12">
          <div className="space-y-4">
            <span className="text-xs text-emerald-400 uppercase tracking-widest font-black">Social Proof</span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-100">
              Trusted by Individual Builders
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-slate-900/30 p-6 rounded-2xl border border-slate-800/80 text-left space-y-4">
              <div className="flex gap-1">
                {[1,2,3,4,5].map(s => <Star key={s} size={13} className="fill-emerald-400 text-emerald-400" />)}
              </div>
              <p className="text-slate-300 text-sm leading-relaxed italic">
                "ApexFinance changed how I budget. The UI is absolutely gorgeous on my mobile. Adding expenses is incredibly fast when I am traveling."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center font-bold text-xs text-emerald-400">
                  AS
                </div>
                <div>
                  <h5 className="font-semibold text-xs text-slate-200">Alex Shaker</h5>
                  <span className="text-[10px] text-slate-500">Software Engineer</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/30 p-6 rounded-2xl border border-slate-800/80 text-left space-y-4">
              <div className="flex gap-1">
                {[1,2,3,4,5].map(s => <Star key={s} size={13} className="fill-emerald-400 text-emerald-400" />)}
              </div>
              <p className="text-slate-300 text-sm leading-relaxed italic">
                "Simple, elegant, and secure. I love that it lets me export everything to Excel. It made filing my business deductions exceptionally simple."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center font-bold text-xs text-emerald-400">
                  MH
                </div>
                <div>
                  <h5 className="font-semibold text-xs text-slate-200">Monica H.</h5>
                  <span className="text-[10px] text-slate-500">SaaS Founder</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/30 p-6 rounded-2xl border border-slate-800/80 text-left space-y-4">
              <div className="flex gap-1">
                {[1,2,3,4,5].map(s => <Star key={s} size={13} className="fill-emerald-400 text-emerald-400" />)}
              </div>
              <p className="text-slate-300 text-sm leading-relaxed italic">
                "The budget tracking and overspending warning alert is my favorite feature. It immediately saved me from crossing my dining-out target."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center font-bold text-xs text-emerald-400">
                  KD
                </div>
                <div>
                  <h5 className="font-semibold text-xs text-slate-200">Kartik Deshmukh</h5>
                  <span className="text-[10px] text-slate-500">Freelancer</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 px-6 border-t border-slate-900 bg-slate-900/10">
        <div className="max-w-3xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <span className="text-xs text-emerald-400 uppercase tracking-widest font-black">Help Center</span>
            <h2 className="text-3xl font-black text-slate-100">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-3.5">
            {faqs.map((faq, idx) => (
              <div 
                key={idx} 
                className="bg-slate-900/60 rounded-2xl border border-slate-800 overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between p-5 text-left font-bold text-slate-200 hover:text-emerald-400 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown 
                    size={16} 
                    className={`transform transition-transform text-slate-400 ${openFaq === idx ? 'rotate-180 text-emerald-400' : ''}`} 
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 text-slate-400 text-sm leading-relaxed border-t border-slate-800/40 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-6 border-t border-slate-900 bg-slate-950 relative">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-start">
          <div className="space-y-6 text-left">
            <span className="text-xs text-emerald-400 uppercase tracking-widest font-black">Get in Touch</span>
            <h2 className="text-3xl font-black text-slate-100 leading-tight">We Are Here to Support You</h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Have questions, custom SaaS requirements, or feature suggestions? Fill out the contact form, and we will get back to you within 24 hours.
            </p>
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400 shrink-0">
                  <Mail size={14} />
                </div>
                <span>support@apexfinance.app</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400 shrink-0">
                  <ShieldCheck size={14} />
                </div>
                <span>SSL Secured & Verified Sandbox</span>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleContactSubmit} className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800/85 space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-1.5">Your Name</label>
              <input 
                type="text" 
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="John Doe"
                className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl p-3 text-sm text-slate-100 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-1.5">Email Address</label>
              <input 
                type="email" 
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="john@example.com"
                className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl p-3 text-sm text-slate-100 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-1.5">Message</label>
              <textarea 
                value={contactMsg}
                onChange={(e) => setContactMsg(e.target.value)}
                placeholder="Tell us what you need..."
                rows={4}
                className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl p-3 text-sm text-slate-100 outline-none transition-colors resize-none"
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3.5 rounded-xl text-center text-sm transition-all shadow-md shadow-emerald-500/10 cursor-pointer"
            >
              Send Secure Message
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 px-6 py-12">
        <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-12 gap-10">
          
          <div className="lg:col-span-5 text-left space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
                <TrendingDown size={18} className="text-slate-950 stroke-[3]" />
              </div>
              <span className="font-extrabold text-lg text-slate-200">ApexFinance</span>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm max-w-sm leading-relaxed">
              Engineered with care to assist users in complete tracking of transaction accounts. Real-time analysis, visual pie charts, and printable reports out-of-the-box.
            </p>
          </div>

          <div className="lg:col-span-3 text-left space-y-4">
            <h5 className="text-slate-200 font-bold text-sm tracking-widest uppercase">Quick Navigation</h5>
            <div className="flex flex-col gap-2 text-xs sm:text-sm text-slate-400">
              <a href="#hero" className="hover:text-emerald-400 transition-colors">Home</a>
              <a href="#features" className="hover:text-emerald-400 transition-colors">Features</a>
              <a href="#how-it-works" className="hover:text-emerald-400 transition-colors">How It Works</a>
              <a href="#pricing" className="hover:text-emerald-400 transition-colors">Pricing Plan</a>
            </div>
          </div>

          <div className="lg:col-span-4 text-left space-y-4">
            <h5 className="text-slate-200 font-bold text-sm tracking-widest uppercase">Stay Informed</h5>
            <p className="text-slate-400 text-xs leading-relaxed">
              Subscribe to receive secure feature summaries and tax budget savings guides.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
              <input 
                type="email" 
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Your email address"
                className="bg-slate-900 border border-slate-800 focus:border-emerald-500 rounded-xl p-2.5 text-xs text-slate-100 outline-none flex-1 transition-colors"
              />
              <button 
                type="submit"
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-3 py-2 rounded-xl text-xs transition-colors shrink-0 cursor-pointer"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="max-w-7xl mx-auto border-t border-slate-900/60 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-xs">
          <div>
            &copy; {new Date().getFullYear()} ApexFinance. All rights reserved. Built with senior developer excellence.
          </div>
          <div className="flex gap-6">
            <span className="hover:text-slate-400 transition-colors">Privacy Policy</span>
            <span className="hover:text-slate-400 transition-colors">Terms of Service</span>
            <span className="hover:text-slate-400 transition-colors">Sandbox Secure</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
