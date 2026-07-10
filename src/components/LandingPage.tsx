import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  TrendingUp, 
  Shield, 
  PieChart as PieChartIcon, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  ArrowRight, 
  DollarSign, 
  Briefcase, 
  FileText, 
  Award,
  Lock,
  Smartphone,
  Eye,
  Mail,
  MapPin,
  PhoneCall,
  Send,
  Sparkles,
  Zap,
  CheckCircle2,
  Menu,
  X
} from 'lucide-react';

export default function LandingPage() {
  const { setRoute, token } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  
  // Contact Form State
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  // Newsletter State
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const toggleFaq = (index: number) => {
    setFaqOpen(faqOpen === index ? null : index);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (contactName && contactEmail && contactMessage) {
      setFormSubmitted(true);
      setContactName('');
      setContactEmail('');
      setContactMessage('');
      setTimeout(() => setFormSubmitted(false), 5000);
    }
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSubscribed(true);
      setNewsletterEmail('');
      setTimeout(() => setNewsletterSubscribed(false), 5000);
    }
  };

  // Smooth scroll helper
  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950">
      
      {/* HEADER / NAVIGATION BAR */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-900/60 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* LOGO */}
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => scrollToSection('hero')}>
              <div className="bg-gradient-to-tr from-emerald-500 to-teal-400 p-2 rounded-xl shadow-lg shadow-emerald-500/10">
                <TrendingUp className="h-6 w-6 text-slate-950 stroke-[2.5]" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-200 bg-clip-text text-transparent tracking-tight">
                Vestra<span className="text-emerald-400">Finance</span>
              </span>
            </div>

            {/* DESKTOP NAV ITEMS */}
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 text-sm font-medium text-slate-300">
              <button onClick={() => scrollToSection('features')} className="px-3 py-2 rounded-lg hover:text-emerald-400 hover:bg-slate-900/40 transition-all duration-200">Features</button>
              <button onClick={() => scrollToSection('how-it-works')} className="px-3 py-2 rounded-lg hover:text-emerald-400 hover:bg-slate-900/40 transition-all duration-200">How It Works</button>
              <button onClick={() => scrollToSection('why-choose-us')} className="px-3 py-2 rounded-lg hover:text-emerald-400 hover:bg-slate-900/40 transition-all duration-200">Why Us</button>
              <button onClick={() => scrollToSection('faq')} className="px-3 py-2 rounded-lg hover:text-emerald-400 hover:bg-slate-900/40 transition-all duration-200">FAQ</button>
              <button onClick={() => scrollToSection('contact')} className="px-3 py-2 rounded-lg hover:text-emerald-400 hover:bg-slate-900/40 transition-all duration-200">Contact</button>
            </nav>

            {/* ACTION BUTTONS */}
            <div className="hidden md:flex items-center space-x-3">
              {token ? (
                <button 
                  onClick={() => setRoute('dashboard')} 
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-300 shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/20"
                >
                  Go to Dashboard
                </button>
              ) : (
                <>
                  <button 
                    onClick={() => setRoute('login')} 
                    className="text-slate-300 hover:text-emerald-400 text-sm font-semibold px-3 py-2 transition-colors duration-200"
                  >
                    Login
                  </button>
                  <button 
                    onClick={() => setRoute('register')} 
                    className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-sm font-bold px-4 py-2 rounded-lg transition-all duration-300 shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/20"
                  >
                    Get Started Free
                  </button>
                </>
              )}
            </div>

            {/* MOBILE HAMBURGER BUTTON */}
            <div className="md:hidden flex items-center">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
                className="text-slate-300 hover:text-emerald-400 focus:outline-none transition-colors"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* MOBILE MENU PANEL */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-900 bg-slate-950/95 backdrop-blur-lg px-4 pt-2 pb-6 space-y-2">
            <button onClick={() => scrollToSection('features')} className="block w-full text-left px-3 py-2 rounded-lg text-slate-300 hover:text-emerald-400 hover:bg-slate-900">Features</button>
            <button onClick={() => scrollToSection('how-it-works')} className="block w-full text-left px-3 py-2 rounded-lg text-slate-300 hover:text-emerald-400 hover:bg-slate-900">How It Works</button>
            <button onClick={() => scrollToSection('why-choose-us')} className="block w-full text-left px-3 py-2 rounded-lg text-slate-300 hover:text-emerald-400 hover:bg-slate-900">Why Us</button>
            <button onClick={() => scrollToSection('faq')} className="block w-full text-left px-3 py-2 rounded-lg text-slate-300 hover:text-emerald-400 hover:bg-slate-900">FAQ</button>
            <button onClick={() => scrollToSection('contact')} className="block w-full text-left px-3 py-2 rounded-lg text-slate-300 hover:text-emerald-400 hover:bg-slate-900">Contact</button>
            
            <div className="pt-4 border-t border-slate-900 flex flex-col space-y-2">
              {token ? (
                <button 
                  onClick={() => setRoute('dashboard')} 
                  className="w-full text-center bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold py-2 rounded-lg transition-all duration-300"
                >
                  Go to Dashboard
                </button>
              ) : (
                <>
                  <button 
                    onClick={() => setRoute('login')} 
                    className="w-full text-center text-slate-300 hover:text-emerald-400 py-2 rounded-lg font-medium hover:bg-slate-900 transition-colors"
                  >
                    Login
                  </button>
                  <button 
                    onClick={() => setRoute('register')} 
                    className="w-full text-center bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2 rounded-lg shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/20 transition-all duration-300"
                  >
                    Get Started Free
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* HERO SECTION */}
      <section id="hero" className="relative pt-16 pb-20 md:pt-24 md:pb-32 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 w-[300px] h-[300px] bg-teal-500/5 rounded-full blur-[90px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* LEFT COLUMN: TEXT & CTAs */}
            <div className="lg:col-span-7 text-center lg:text-left space-y-6">
              <div className="inline-flex items-center space-x-2 bg-emerald-950/40 border border-emerald-900/60 px-3 py-1 rounded-full text-xs font-semibold text-emerald-400 shadow-md">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Modern Personal Expense Manager</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
                Take Control of Your Money, <br />
                <span className="bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-200 bg-clip-text text-transparent">
                  One Expense at a Time.
                </span>
              </h1>
              
              <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Experience a beautiful, highly polished, production-ready expense tracker. Record daily expenses, define category limits, configure budgets, and generate analytical reports instantly. Zero friction, total clarity.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button 
                  onClick={() => setRoute(token ? 'dashboard' : 'register')} 
                  className="w-full sm:w-auto inline-flex items-center justify-center bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-3.5 rounded-xl shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all duration-300 transform hover:-translate-y-0.5 group"
                >
                  <span>Start Tracking Free</span>
                  <ArrowRight className="ml-2 h-4 w-4 stroke-[2.5] group-hover:translate-x-1 transition-transform" />
                </button>
                <button 
                  onClick={() => scrollToSection('features')} 
                  className="w-full sm:w-auto inline-flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 font-semibold px-6 py-3.5 rounded-xl transition-all duration-300"
                >
                  Explore Features
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-8 border-t border-slate-900/80 grid grid-cols-3 gap-4 text-center lg:text-left max-w-md mx-auto lg:mx-0">
                <div>
                  <div className="text-2xl font-bold text-slate-100">100%</div>
                  <div className="text-xs text-slate-500 mt-1">Data Control</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-100">Zero</div>
                  <div className="text-xs text-slate-500 mt-1">Hidden Costs</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-100">SSL</div>
                  <div className="text-xs text-slate-500 mt-1">Encrypted Auth</div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: PREMIUM DASHBOARD MOCKUP */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Background glow surrounding mockup */}
                <div className="absolute inset-0 bg-emerald-500/5 rounded-3xl blur-[30px] -m-4 pointer-events-none" />
                
                {/* Main Card Mockup */}
                <div className="relative bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl p-5 overflow-hidden">
                  {/* Mockup Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-5">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full" />
                      <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                      <div className="w-3 h-3 bg-green-500 rounded-full" />
                    </div>
                    <div className="text-[10px] bg-slate-850 px-2.5 py-1 rounded-md text-slate-400 font-mono tracking-wider">
                      VESTRA_ENGINE_v2.0
                    </div>
                  </div>

                  {/* Mockup Metrics */}
                  <div className="grid grid-cols-2 gap-3 mb-5">
                    <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-900">
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Monthly Limit</div>
                      <div className="text-lg font-bold text-slate-100 mt-1">$2,500.00</div>
                      <div className="w-full bg-slate-900 h-1.5 rounded-full mt-2 overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full" style={{ width: '64%' }} />
                      </div>
                    </div>
                    <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-900">
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Total Expenses</div>
                      <div className="text-lg font-bold text-emerald-400 mt-1">$1,592.40</div>
                      <div className="text-[10px] text-emerald-400/80 flex items-center mt-1.5 font-semibold">
                        <Zap className="h-2.5 w-2.5 mr-1 text-emerald-400" />
                        Within safe limit
                      </div>
                    </div>
                  </div>

                  {/* Mockup Chart Visual */}
                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-900 mb-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Category Breakdown</div>
                      <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded">Real-Time</span>
                    </div>
                    
                    {/* Mock Bars */}
                    <div className="space-y-2.5">
                      <div>
                        <div className="flex justify-between text-[11px] mb-1">
                          <span className="text-slate-400 font-medium">🛒 Shopping</span>
                          <span className="text-slate-300 font-bold">$480.00 (30%)</span>
                        </div>
                        <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                          <div className="bg-emerald-500 h-full rounded-full" style={{ width: '30%' }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-[11px] mb-1">
                          <span className="text-slate-400 font-medium">🍔 Food & Dining</span>
                          <span className="text-slate-300 font-bold">$384.00 (24%)</span>
                        </div>
                        <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                          <div className="bg-teal-400 h-full rounded-full" style={{ width: '24%' }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-[11px] mb-1">
                          <span className="text-slate-400 font-medium">🚗 Travel & Cab</span>
                          <span className="text-slate-300 font-bold">$256.00 (16%)</span>
                        </div>
                        <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                          <div className="bg-blue-400 h-full rounded-full" style={{ width: '16%' }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Transactions List */}
                  <div className="space-y-2">
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-1">Recent Logs</div>
                    
                    <div className="flex items-center justify-between bg-slate-950/60 p-2 rounded-lg border border-slate-900 text-xs">
                      <div className="flex items-center space-x-2">
                        <span className="p-1 bg-emerald-500/10 text-emerald-400 rounded">🛒</span>
                        <div>
                          <p className="font-semibold text-slate-200">Grocery Store</p>
                          <p className="text-[9px] text-slate-500">Today, 2:40 PM</p>
                        </div>
                      </div>
                      <span className="font-bold text-slate-100">-$62.50</span>
                    </div>
                    
                    <div className="flex items-center justify-between bg-slate-950/60 p-2 rounded-lg border border-slate-900 text-xs">
                      <div className="flex items-center space-x-2">
                        <span className="p-1 bg-emerald-500/10 text-emerald-400 rounded">🚗</span>
                        <div>
                          <p className="font-semibold text-slate-200">Gas Station Refill</p>
                          <p className="text-[9px] text-slate-500">Yesterday</p>
                        </div>
                      </div>
                      <span className="font-bold text-slate-100">-$45.00</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CORE FEATURES SECTION */}
      <section id="features" className="py-20 bg-slate-950 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <h2 className="text-xs font-bold text-emerald-400 tracking-widest uppercase">Engineered for Excellence</h2>
            <p className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Powerful Financial Tracking Features
            </p>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Every utility is fine-tuned to deliver seamless, instant finance management. No clutter, no complicated setups—just high-fidelity expense controls.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            
            {/* CARD 1: Add Expenses */}
            <div className="bg-slate-900/40 border border-slate-900 hover:border-emerald-500/30 p-6 rounded-2xl hover:bg-slate-900/60 transition-all duration-300 group">
              <div className="p-3 bg-emerald-950/50 rounded-xl text-emerald-400 w-fit mb-5 border border-emerald-900/40 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors duration-300">
                <DollarSign className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-100 mb-2">Record Daily Expenses</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Log purchases with ease. Store key metadata including title, exact amount, specific tags, payment channel, dates, and auxiliary notes.
              </p>
            </div>

            {/* CARD 2: Expense Categories */}
            <div className="bg-slate-900/40 border border-slate-900 hover:border-emerald-500/30 p-6 rounded-2xl hover:bg-slate-900/60 transition-all duration-300 group">
              <div className="p-3 bg-emerald-950/50 rounded-xl text-emerald-400 w-fit mb-5 border border-emerald-900/40 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors duration-300">
                <Briefcase className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-100 mb-2">Smart Categories</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Tag expenses using organized categories including Food, Travel, Medical, Bills, Shopping, Entertainment, Education, and custom classifications.
              </p>
            </div>

            {/* CARD 3: Interactive Charts */}
            <div className="bg-slate-900/40 border border-slate-900 hover:border-emerald-500/30 p-6 rounded-2xl hover:bg-slate-900/60 transition-all duration-300 group">
              <div className="p-3 bg-emerald-950/50 rounded-xl text-emerald-400 w-fit mb-5 border border-emerald-900/40 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors duration-300">
                <PieChartIcon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-100 mb-2">High-Fidelity Charts</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Render pixel-perfect visualizations using Recharts. Spot category proportions with Pie Charts and spending trends with Bar or Line charts.
              </p>
            </div>

            {/* CARD 4: Budget Alerts */}
            <div className="bg-slate-900/40 border border-slate-900 hover:border-emerald-500/30 p-6 rounded-2xl hover:bg-slate-900/60 transition-all duration-300 group">
              <div className="p-3 bg-emerald-950/50 rounded-xl text-emerald-400 w-fit mb-5 border border-emerald-900/40 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors duration-300">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-100 mb-2">Budget Guard & Alerts</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Establish monthly spending thresholds. Track total progress via dynamic visual feedback bars and stay notified if you breach limits.
              </p>
            </div>

            {/* CARD 5: Comprehensive Reports */}
            <div className="bg-slate-900/40 border border-slate-900 hover:border-emerald-500/30 p-6 rounded-2xl hover:bg-slate-900/60 transition-all duration-300 group">
              <div className="p-3 bg-emerald-950/50 rounded-xl text-emerald-400 w-fit mb-5 border border-emerald-900/40 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors duration-300">
                <FileText className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-100 mb-2">Multi-Format Export</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Compile historical records and print directly from the page, or export cleanly formatted CSV databases to inspect in MS Excel.
              </p>
            </div>

            {/* CARD 6: Secure Authentication */}
            <div className="bg-slate-900/40 border border-slate-900 hover:border-emerald-500/30 p-6 rounded-2xl hover:bg-slate-900/60 transition-all duration-300 group">
              <div className="p-3 bg-emerald-950/50 rounded-xl text-emerald-400 w-fit mb-5 border border-emerald-900/40 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors duration-300">
                <Lock className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-100 mb-2">Secure JWT Vault</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Authenticate with cryptographically-hashed login verification. Your passwords are safe, and APIs are secured behind structured session guards.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-20 bg-slate-900/20 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <h2 className="text-xs font-bold text-emerald-400 tracking-widest uppercase">Simple Process Flow</h2>
            <p className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Get Started in Four Simple Steps
            </p>
            <p className="text-slate-400 text-sm leading-relaxed">
              Experience zero setup friction. Register your account securely and immediately unlock the metrics dashboard to manage transactions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            
            {/* Step 1 */}
            <div className="text-center relative">
              <div className="mx-auto w-16 h-16 bg-slate-900 border border-slate-850 text-emerald-400 flex items-center justify-center rounded-2xl font-bold text-lg shadow-lg relative z-10">
                01
              </div>
              <h3 className="text-md font-bold text-slate-100 mt-4 mb-2">Create Account</h3>
              <p className="text-xs text-slate-400 px-4 leading-relaxed">
                Sign up with your basic details, preferred currency emblem, and basic contact metadata.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center relative">
              <div className="mx-auto w-16 h-16 bg-slate-900 border border-slate-850 text-emerald-400 flex items-center justify-center rounded-2xl font-bold text-lg shadow-lg relative z-10">
                02
              </div>
              <h3 className="text-md font-bold text-slate-100 mt-4 mb-2">Secure Login</h3>
              <p className="text-xs text-slate-400 px-4 leading-relaxed">
                Establish a session securely. JWT tokens safeguard authentication for seamless API requests.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center relative">
              <div className="mx-auto w-16 h-16 bg-slate-900 border border-slate-850 text-emerald-400 flex items-center justify-center rounded-2xl font-bold text-lg shadow-lg relative z-10">
                03
              </div>
              <h3 className="text-md font-bold text-slate-100 mt-4 mb-2">Log Daily Spends</h3>
              <p className="text-xs text-slate-400 px-4 leading-relaxed">
                Input your daily transactions. Specify details like payment mode, tags, amounts, and dates.
              </p>
            </div>

            {/* Step 4 */}
            <div className="text-center relative">
              <div className="mx-auto w-16 h-16 bg-slate-900 border border-slate-850 text-emerald-400 flex items-center justify-center rounded-2xl font-bold text-lg shadow-lg relative z-10">
                04
              </div>
              <h3 className="text-md font-bold text-slate-100 mt-4 mb-2">Analyze Analytics</h3>
              <p className="text-xs text-slate-400 px-4 leading-relaxed">
                Interact with granular charts, compile monthly reports, and optimize your saving strategies.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section id="why-choose-us" className="py-20 bg-slate-950 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center space-x-2 bg-emerald-950/40 border border-emerald-900/60 px-3 py-1 rounded-full text-xs font-semibold text-emerald-400 shadow-md">
                <Award className="h-3.5 w-3.5" />
                <span>Premium Fintech Architecture</span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Designed for speed, clarity, and deep insight.
              </h2>
              
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                We believe tracking your hard-earned money should feel effortless and premium. We developed a lightweight interface packed with micro-interactions, responsive sizing, and durable local databases so you can record your expenses on the fly.
              </p>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="mt-1 bg-emerald-950 p-1.5 rounded text-emerald-400 border border-emerald-900/40">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-200">Instant-Speed Visualizations</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Watch charts update instantly as you create, modify, or delete logs.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="mt-1 bg-emerald-950 p-1.5 rounded text-emerald-400 border border-emerald-900/40">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-200">100% Client-Side Privacy Controls</h4>
                    <p className="text-xs text-slate-400 mt-0.5">No tracking pixels. No unsolicited marketing. Your data is your own.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="mt-1 bg-emerald-950 p-1.5 rounded text-emerald-400 border border-emerald-900/40">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-200">Dynamic Multi-Currency Adaptability</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Configure your preference once, and witness immediate system-wide translations.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 grid grid-cols-2 gap-4">
              <div className="bg-slate-900/40 border border-slate-900 p-6 rounded-2xl space-y-3">
                <div className="text-emerald-400 bg-emerald-950/40 border border-emerald-900/60 p-2.5 rounded-xl w-fit"><Zap className="h-5 w-5" /></div>
                <h4 className="text-sm font-bold text-slate-100">Super Fast</h4>
                <p className="text-xs text-slate-400 leading-relaxed">No bloat or heavy frameworks. Fully reactive Express API and lightning-quick React client.</p>
              </div>
              
              <div className="bg-slate-900/40 border border-slate-900 p-6 rounded-2xl space-y-3 mt-6">
                <div className="text-emerald-400 bg-emerald-950/40 border border-emerald-900/60 p-2.5 rounded-xl w-fit"><Shield className="h-5 w-5" /></div>
                <h4 className="text-sm font-bold text-slate-100">Highly Secure</h4>
                <p className="text-xs text-slate-400 leading-relaxed">Passwords hashed with high-grade key derivation PBKDF2 cryptography algorithms.</p>
              </div>

              <div className="bg-slate-900/40 border border-slate-900 p-6 rounded-2xl space-y-3">
                <div className="text-emerald-400 bg-emerald-950/40 border border-emerald-900/60 p-2.5 rounded-xl w-fit"><Smartphone className="h-5 w-5" /></div>
                <h4 className="text-sm font-bold text-slate-100">Fluid Responsive</h4>
                <p className="text-xs text-slate-400 leading-relaxed">Built with mobile-first Tailwind grids that resize beautifully on ultra-wide screens.</p>
              </div>

              <div className="bg-slate-900/40 border border-slate-900 p-6 rounded-2xl space-y-3 mt-6">
                <div className="text-emerald-400 bg-emerald-950/40 border border-emerald-900/60 p-2.5 rounded-xl w-fit"><Eye className="h-5 w-5" /></div>
                <h4 className="text-sm font-bold text-slate-100">No Hidden Costs</h4>
                <p className="text-xs text-slate-400 leading-relaxed">100% open feature accessibility on our free plan. No limits or surprise charges.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="py-20 bg-slate-900/20 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <h2 className="text-xs font-bold text-emerald-400 tracking-widest uppercase">User Success</h2>
            <p className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Loved by Thousands of Smart Savers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-slate-900/40 border border-slate-900 p-6 rounded-2xl space-y-4">
              <div className="text-yellow-500 flex space-x-1">
                <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
              </div>
              <p className="text-xs text-slate-300 italic leading-relaxed">
                "VestraFinance has completely re-engineered my savings trajectory. Adding spends takes 3 seconds, and the charts on the mobile viewport look amazing."
              </p>
              <div className="flex items-center space-x-3 pt-2">
                <img className="w-10 h-10 rounded-full border border-slate-800" src="https://api.dicebear.com/7.x/avataaars/svg?seed=Michael" alt="Michael" />
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Michael Henderson</h4>
                  <p className="text-[10px] text-slate-500">Principal Architect, Seattle</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/40 border border-slate-900 p-6 rounded-2xl space-y-4">
              <div className="text-yellow-500 flex space-x-1">
                <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
              </div>
              <p className="text-xs text-slate-300 italic leading-relaxed">
                "The category budget tracking limits are fantastic. It warns me as soon as I cross my thresholds, saving me hundreds each month on subscriptions and travel."
              </p>
              <div className="flex items-center space-x-3 pt-2">
                <img className="w-10 h-10 rounded-full border border-slate-800" src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" alt="Sarah" />
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Sarah Jenkins</h4>
                  <p className="text-[10px] text-slate-500">UI/UX Lead, Toronto</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/40 border border-slate-900 p-6 rounded-2xl space-y-4">
              <div className="text-yellow-500 flex space-x-1">
                <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
              </div>
              <p className="text-xs text-slate-300 italic leading-relaxed">
                "Finding past payments with search and custom range filter dates is incredibly fast. Plus, compiling CSV statements to export takes a single click."
              </p>
              <div className="flex items-center space-x-3 pt-2">
                <img className="w-10 h-10 rounded-full border border-slate-800" src="https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan" alt="Rohan" />
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Rohan Das</h4>
                  <p className="text-[10px] text-slate-500">Lead Consultant, Bangalore</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="py-20 bg-slate-950 border-t border-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-xs font-bold text-emerald-400 tracking-widest uppercase">FAQ Hub</h2>
            <p className="text-3xl font-extrabold tracking-tight">Common Inquiries</p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "Is my transaction and financial data secure?",
                a: "Yes. All user logins are protected behind secure JWT authentication parameters. Password credentials undergo multi-iteration salt hashing on our server using native crypto PBKDF2 node modules, meaning your plain password never touches the server storage."
              },
              {
                q: "Can I export my monthly expenses and reports?",
                a: "Absolutely. Our app features a dedicated reports compilation module. You can print directly from the workspace, generate layouts on the screen, or trigger direct client-side CSV spreadsheet exports with a single click."
              },
              {
                q: "How does the monthly category budget module operate?",
                a: "You can define an overall monthly limit or designate specific category thresholds inside your profile settings. The dashboard dynamically gauges spending, updates progress trackers, and triggers alert warnings upon overflow."
              },
              {
                q: "Is VestraFinance fully responsive across mobile systems?",
                a: "Yes. The UI uses mobile-first responsive grids. We optimize layouts for desktop viewports, mid-sized tablets, and tiny handheld touchscreens with ergonomic finger-friendly targets."
              }
            ].map((faq, idx) => (
              <div 
                key={idx} 
                className="bg-slate-900/40 border border-slate-900 rounded-xl overflow-hidden transition-colors"
              >
                <button 
                  onClick={() => toggleFaq(idx)} 
                  className="w-full flex items-center justify-between p-5 text-left font-semibold text-slate-200 hover:text-emerald-400 transition-colors focus:outline-none"
                >
                  <span className="text-sm sm:text-base">{faq.q}</span>
                  {faqOpen === idx ? <ChevronUp className="h-5 w-5 text-emerald-400" /> : <ChevronDown className="h-5 w-5 text-slate-500" />}
                </button>
                {faqOpen === idx && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-400 leading-relaxed border-t border-slate-900/40">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* CONTACT SECTION (No Chat elements!) */}
      <section id="contact" className="py-20 bg-slate-900/20 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <h2 className="text-xs font-bold text-emerald-400 tracking-widest uppercase">Get in Touch</h2>
            <p className="text-3xl sm:text-4xl font-extrabold tracking-tight">Connect with Our Team</p>
            <p className="text-slate-400 text-sm">Have pre-sales queries or technical feedback? Message us directly.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Contact Details Card */}
            <div className="lg:col-span-5 bg-slate-900/60 border border-slate-900 p-6 sm:p-8 rounded-2xl space-y-6">
              <h3 className="text-lg font-bold text-slate-200">Contact Details</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Our support team reviews received correspondence within standard business hours (UTC-7). Fill out the response form, and we will contact you directly via email.
              </p>
              
              <div className="space-y-4 pt-2">
                <div className="flex items-center space-x-3.5">
                  <div className="bg-emerald-950 text-emerald-400 p-2 rounded-xl border border-emerald-900/40"><Mail className="h-5 w-5" /></div>
                  <div>
                    <p className="text-[10px] text-slate-500 font-semibold uppercase">Email Support</p>
                    <p className="text-xs text-slate-300 font-medium">support@vestrafinance.com</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3.5">
                  <div className="bg-emerald-950 text-emerald-400 p-2 rounded-xl border border-emerald-900/40"><MapPin className="h-5 w-5" /></div>
                  <div>
                    <p className="text-[10px] text-slate-500 font-semibold uppercase">Main Headquarters</p>
                    <p className="text-xs text-slate-300 font-medium">100 Pine Street, San Francisco, CA</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3.5">
                  <div className="bg-emerald-950 text-emerald-400 p-2 rounded-xl border border-emerald-900/40"><PhoneCall className="h-5 w-5" /></div>
                  <div>
                    <p className="text-[10px] text-slate-500 font-semibold uppercase">Office Line</p>
                    <p className="text-xs text-slate-300 font-medium">+1 (415) 555-8930</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Response Form */}
            <div className="lg:col-span-7 bg-slate-900/60 border border-slate-900 p-6 sm:p-8 rounded-2xl">
              {formSubmitted ? (
                <div className="text-center py-12 space-y-3">
                  <div className="mx-auto bg-emerald-500/10 text-emerald-400 p-3.5 rounded-full w-fit border border-emerald-500/30">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-100">Message Received!</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                    Thank you for your submission. A technical representative has queued your inquiry and will follow up shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Your Name</label>
                      <input 
                        type="text" 
                        required
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="John Doe" 
                        className="w-full bg-slate-950 text-slate-100 text-xs sm:text-sm border border-slate-850 focus:border-emerald-500/80 rounded-xl px-4 py-3 focus:outline-none transition-all placeholder:text-slate-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Email Address</label>
                      <input 
                        type="email" 
                        required
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="john@example.com" 
                        className="w-full bg-slate-950 text-slate-100 text-xs sm:text-sm border border-slate-850 focus:border-emerald-500/80 rounded-xl px-4 py-3 focus:outline-none transition-all placeholder:text-slate-600"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Message Details</label>
                    <textarea 
                      rows={4}
                      required
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      placeholder="Write your comments or questions here..." 
                      className="w-full bg-slate-950 text-slate-100 text-xs sm:text-sm border border-slate-850 focus:border-emerald-500/80 rounded-xl px-4 py-3 focus:outline-none transition-all placeholder:text-slate-600 resize-none"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full inline-flex items-center justify-center bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 px-6 rounded-xl shadow-lg shadow-emerald-500/15 hover:shadow-emerald-500/25 transition-all duration-300"
                  >
                    <span>Send Message</span>
                    <Send className="ml-2 h-4 w-4" />
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 border-t border-slate-900 pt-16 pb-8 text-slate-400 text-xs sm:text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-slate-900">
            
            {/* BRAND & NEWSLETTER */}
            <div className="md:col-span-5 space-y-6">
              <div className="flex items-center space-x-3 cursor-pointer" onClick={() => scrollToSection('hero')}>
                <div className="bg-gradient-to-tr from-emerald-500 to-teal-400 p-1.5 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-slate-950 stroke-[2.5]" />
                </div>
                <span className="text-lg font-bold bg-gradient-to-r from-emerald-400 to-teal-200 bg-clip-text text-transparent tracking-tight">
                  Vestra<span className="text-emerald-400">Finance</span>
                </span>
              </div>
              <p className="text-xs leading-relaxed max-w-sm text-slate-500">
                A premium, offline-first personal expense tracker. Record spends, configure customized budgets, analyze trends, and compile PDF/CSV files. Crafted for speed and security.
              </p>
              
              {/* Newsletter Form */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-300 uppercase tracking-widest">Subscribe to newsletter</p>
                {newsletterSubscribed ? (
                  <p className="text-emerald-400 text-xs font-semibold flex items-center">
                    <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" /> Subscribed successfully!
                  </p>
                ) : (
                  <form onSubmit={handleNewsletterSubmit} className="flex max-w-sm">
                    <input 
                      type="email" 
                      required
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      placeholder="newsletter@example.com"
                      className="bg-slate-900 text-slate-100 text-xs border border-slate-800 rounded-l-xl px-3.5 py-2.5 w-full focus:outline-none focus:border-emerald-500 placeholder:text-slate-650"
                    />
                    <button 
                      type="submit" 
                      className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 rounded-r-xl transition-colors text-xs"
                    >
                      Subscribe
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* QUICK LINKS */}
            <div className="md:col-span-3 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-300">Quick Links</h4>
              <ul className="space-y-2 text-xs text-slate-500">
                <li><button onClick={() => scrollToSection('features')} className="hover:text-emerald-400 transition-colors">Key Features</button></li>
                <li><button onClick={() => scrollToSection('how-it-works')} className="hover:text-emerald-400 transition-colors">Operation Flow</button></li>
                <li><button onClick={() => scrollToSection('why-choose-us')} className="hover:text-emerald-400 transition-colors">Our Advantage</button></li>
                <li><button onClick={() => scrollToSection('faq')} className="hover:text-emerald-400 transition-colors">FAQ Hub</button></li>
              </ul>
            </div>

            {/* LEGAL & GITHUB */}
            <div className="md:col-span-4 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-300">Compliance & Development</h4>
              <ul className="space-y-2 text-xs text-slate-500">
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Terms of Service</a></li>
                <li><a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">GitHub Repository</a></li>
                <li><a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">LinkedIn Portal</a></li>
              </ul>
            </div>

          </div>

          {/* LOWER FOOTER */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-slate-500 text-xs space-y-4 sm:space-y-0">
            <p>© 2026 VestraFinance Inc. All rights reserved.</p>
            <p className="flex items-center text-[10px] tracking-wider font-mono bg-slate-900 border border-slate-850 px-2.5 py-1 rounded-md text-slate-400">
              SECURE_TLS_AUTHENTICATED
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
