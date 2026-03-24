
import React, { useState } from 'react';
import { HardHat, Lock, Mail, ArrowRight, ShieldCheck, Cpu } from 'lucide-react';

interface LoginProps {
  onLogin: (role: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Strict hardcoded credentials for BuildSense AI
    setTimeout(() => {
      if (email.toLowerCase() === 'engineer@buildsense.ai' && password === 'admin123') {
        onLogin('Civil Engineer');
      } else {
        setError('Invalid engineering credentials. Access to the neural station is restricted.');
        setIsLoading(false);
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/20 blur-[120px] rounded-full" />
      
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[3rem] shadow-2xl overflow-hidden relative z-10 border border-slate-800/10">
        <div className="hidden lg:flex flex-col justify-between p-12 bg-slate-950 text-white relative">
          <div className="absolute inset-0 opacity-20 pointer-events-none">
             <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #475569 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
          </div>
          <div className="relative">
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/40 mb-8"><HardHat size={32} /></div>
            <h1 className="text-5xl font-black tracking-tighter leading-tight mb-4">BuildSense <span className="text-indigo-400">AI</span></h1>
            <p className="text-slate-400 text-lg font-medium max-w-md leading-relaxed">Professional engineering intelligence station for automated quantity takeoff and design verification.</p>
          </div>
          <div className="relative space-y-6">
            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
               <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl"><ShieldCheck size={24} /></div>
               <div><p className="text-sm font-black uppercase tracking-widest text-slate-300">Station Identity Verified</p><p className="text-xs text-slate-500">ISO-Standard Compliance</p></div>
            </div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.4em]">Neural Processing Node v4.0</p>
          </div>
        </div>

        <div className="p-12 lg:p-20 flex flex-col justify-center bg-white">
          <div className="mb-10">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Engineer Authentication</h2>
            <p className="text-slate-500 mt-2 font-medium">Access your structural engineering dashboard.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-2"><div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />{error}</div>}
            
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Work ID (Email)</label>
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors"><Mail size={18} /></div>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-14 pr-6 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all font-bold text-slate-800" placeholder="engineer@buildsense.ai" required />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Security Key (Password)</label>
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors"><Lock size={18} /></div>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-14 pr-6 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all font-bold text-slate-800" placeholder="••••••••" required />
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="w-full bg-slate-900 hover:bg-indigo-600 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-indigo-500/20 transition-all active:scale-95 flex items-center justify-center gap-3">
              {isLoading ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <>AUTHENTICATE ACCESS <ArrowRight size={16} /></>}
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-center gap-8">
             <div className="flex items-center gap-2 grayscale opacity-50"><Cpu size={16} className="text-slate-900" /><span className="text-[10px] font-black uppercase tracking-tighter">AI Vision Engine Active</span></div>
             <div className="flex items-center gap-2 grayscale opacity-50"><ShieldCheck size={16} className="text-slate-900" /><span className="text-[10px] font-black uppercase tracking-tighter">Encrypted Station</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};
