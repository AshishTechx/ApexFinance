import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingDown, ArrowLeft, ShieldAlert } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-emerald-500/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-[100px]" />

      <div className="w-full max-w-md relative z-10 text-center space-y-6">
        <Link to="/" className="inline-flex items-center gap-2 mb-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <TrendingDown size={22} className="text-slate-950 stroke-[3]" />
          </div>
          <span className="font-extrabold text-2xl bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
            ApexFinance
          </span>
        </Link>

        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-4">
          <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center mx-auto text-red-400">
            <ShieldAlert size={26} />
          </div>
          <h2 className="text-2xl font-black text-slate-200">Page Not Found</h2>
          <p className="text-xs text-slate-400 leading-relaxed">The requested secure URL path does not exist, or you might not be authorized to view this transaction node. Please login first.</p>
          
          <div className="pt-4">
            <Link 
              to="/dashboard"
              className="inline-flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm transition-all shadow-lg shadow-emerald-500/10"
            >
              <ArrowLeft size={14} /> Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
