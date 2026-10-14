
import React, { useState } from 'react';
import { HardHat, Lock, Mail, ArrowRight, ShieldCheck, Cpu, Briefcase, GraduationCap, UserCog, Zap, ChevronRight } from 'lucide-react';

interface LoginProps {
  onLogin: (role: string) => void;
}

const ROLES = [
  {
    role: 'Civil Engineer',
    email: 'engineer@buildsense.ai',
    password: 'eng123',
    color: '#6366f1',
    gradient: 'from-indigo-500 to-violet-600',
    bg: 'bg-indigo-500/10',
    border: 'border-indigo-500/30',
    text: 'text-indigo-400',
    icon: <HardHat size={18} />,
    label: 'Civil Engineer',
    desc: 'Full structural analysis & BOQ',
  },
  {
    role: 'Contractor',
    email: 'contractor@buildsense.ai',
    password: 'contractor123',
    color: '#f59e0b',
    gradient: 'from-amber-500 to-orange-500',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    text: 'text-amber-400',
    icon: <Briefcase size={18} />,
    label: 'Contractor',
    desc: 'Material & crew management',
  },
  {
    role: 'Student',
    email: 'student@buildsense.ai',
    password: 'student123',
    color: '#10b981',
    gradient: 'from-emerald-500 to-teal-500',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    text: 'text-emerald-400',
    icon: <GraduationCap size={18} />,
    label: 'Student',
    desc: 'AI-powered learning mode',
  },
  {
    role: 'Admin',
    email: 'admin@buildsense.ai',
    password: 'admin123',
    color: '#f43f5e',
    gradient: 'from-rose-500 to-pink-500',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/30',
    text: 'text-rose-400',
    icon: <UserCog size={18} />,
    label: 'Admin',
    desc: 'Platform-wide control',
  },
];

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedRole, setSelectedRole] = useState<typeof ROLES[0] | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    const match = ROLES.find(
      r => r.email === email.toLowerCase().trim() && r.password === password
    );
    if (match) {
      onLogin(match.role);
    } else {
      setError('Invalid credentials. Use the role cards below to quick-fill.');
      setIsLoading(false);
    }
  };

  const quickFill = (r: typeof ROLES[0]) => {
    setEmail(r.email);
    setPassword(r.password);
    setSelectedRole(r);
    setError('');
  };

  return (
    <div className="min-h-screen flex overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)' }}>
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-20 blur-3xl" style={{ background: 'radial-gradient(circle, #6366f1, transparent)' }} />
        <div className="absolute top-1/2 -right-40 w-96 h-96 rounded-full opacity-20 blur-3xl" style={{ background: 'radial-gradient(circle, #10b981, transparent)' }} />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 rounded-full opacity-20 blur-3xl" style={{ background: 'radial-gradient(circle, #f43f5e, transparent)' }} />
      </div>

      {/* Left - Branding */}
      <div className="hidden lg:flex w-[55%] flex-col justify-between p-16 relative z-10">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-2xl" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
            <HardHat size={26} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">BuildSense</h1>
            <p className="text-xs text-indigo-400 font-bold uppercase tracking-widest">AI Platform</p>
          </div>
        </div>

        {/* Hero text */}
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 border border-white/10 bg-white/5 backdrop-blur-sm">
            <Zap size={14} className="text-amber-400" />
            <span className="text-xs font-bold text-white/70 uppercase tracking-widest">Powered by Gemini AI</span>
          </div>
          <h2 className="text-6xl font-black text-white leading-tight mb-6">
            Engineering<br />
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(90deg, #818cf8, #34d399)' }}>Intelligence</span><br />
            Platform
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed max-w-md">Automated quantity takeoff, structural analysis, and AI-powered design verification for modern engineering teams.</p>
        </div>

        {/* Role cards */}
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-4">Select your role to quick-fill</p>
          <div className="grid grid-cols-2 gap-3">
            {ROLES.map(r => (
              <button
                key={r.role}
                onClick={() => quickFill(r)}
                className={`group flex items-center gap-3 p-4 rounded-2xl border transition-all duration-200 text-left ${
                  selectedRole?.role === r.role
                    ? `${r.bg} ${r.border} border`
                    : 'border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/10'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${r.bg} ${r.text}`}>
                  {r.icon}
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-black text-white">{r.label}</p>
                  <p className="text-[10px] text-slate-500 truncate">{r.desc}</p>
                </div>
                <ChevronRight size={14} className={`ml-auto shrink-0 ${r.text} opacity-0 group-hover:opacity-100 transition-opacity`} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center p-8 relative z-10">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="rounded-3xl overflow-hidden shadow-2xl border border-white/10" style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(40px)' }}>
            <div className="p-10">
              {/* Mobile logo */}
              <div className="lg:hidden flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                  <HardHat size={20} />
                </div>
                <span className="text-xl font-black text-white">BuildSense AI</span>
              </div>

              <h3 className="text-3xl font-black text-white mb-1">Welcome back</h3>
              <p className="text-slate-400 text-sm mb-8">Sign in to your engineering workspace</p>

              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="p-4 rounded-2xl border border-red-500/30 bg-red-500/10 text-red-300 text-sm font-medium flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse shrink-0" />
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Email</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"><Mail size={16} /></div>
                    <input
                      type="email" value={email} onChange={e => setEmail(e.target.value)}
                      className="w-full py-4 pl-12 pr-4 rounded-2xl text-white text-sm font-medium placeholder-slate-600 focus:outline-none transition-all"
                      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                      onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.6)'}
                      onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                      placeholder="your@buildsense.ai"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Password</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"><Lock size={16} /></div>
                    <input
                      type="password" value={password} onChange={e => setPassword(e.target.value)}
                      className="w-full py-4 pl-12 pr-4 rounded-2xl text-white text-sm font-medium placeholder-slate-600 focus:outline-none transition-all"
                      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                      onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.6)'}
                      onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit" disabled={isLoading}
                  className="w-full py-4 rounded-2xl font-black text-sm text-white uppercase tracking-widest flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-60"
                  style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: '0 8px 32px rgba(99,102,241,0.4)' }}
                >
                  {isLoading
                    ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    : <><span>Sign In</span><ArrowRight size={16} /></>
                  }
                </button>
              </form>

              {/* Mobile role quick-fill */}
              <div className="lg:hidden mt-6 grid grid-cols-2 gap-2">
                {ROLES.map(r => (
                  <button key={r.role} onClick={() => quickFill(r)}
                    className={`p-3 rounded-xl border text-left transition-all ${selectedRole?.role === r.role ? `${r.bg} ${r.border}` : 'border-white/5 bg-white/5'}`}
                  >
                    <p className={`text-xs font-black ${r.text}`}>{r.label}</p>
                    <p className="text-[10px] text-slate-500">{r.password}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="px-10 py-5 flex items-center justify-between border-t border-white/5" style={{ background: 'rgba(0,0,0,0.2)' }}>
              <div className="flex items-center gap-2 text-slate-600">
                <Cpu size={13} />
                <span className="text-[10px] font-bold uppercase tracking-widest">AI Engine Active</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <ShieldCheck size={13} />
                <span className="text-[10px] font-bold uppercase tracking-widest">4 Roles</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
