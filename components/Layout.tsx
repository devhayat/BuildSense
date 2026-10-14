
import React from 'react';
import { NAV_ITEMS } from '../constants';
import { UserRole } from '../types';
import { HardHat, LogOut, Briefcase, GraduationCap, ShieldCheck, UserCog, Zap } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (id: string) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  onLogout: () => void;
}

const ROLE_CONFIG: Record<UserRole, {
  color: string; hex: string; lightHex: string;
  icon: React.ReactNode; badge: string; email: string;
}> = {
  'Civil Engineer': { color: 'indigo', hex: '#6366f1', lightHex: '#818cf8', icon: <HardHat size={15} />, badge: 'Senior Engineer', email: 'engineer@buildsense.ai' },
  'Contractor':    { color: 'amber',  hex: '#f59e0b', lightHex: '#fbbf24', icon: <Briefcase size={15} />, badge: 'Site Contractor', email: 'contractor@buildsense.ai' },
  'Student':       { color: 'emerald',hex: '#10b981', lightHex: '#34d399', icon: <GraduationCap size={15} />, badge: 'Eng. Student', email: 'student@buildsense.ai' },
  'Admin':         { color: 'rose',   hex: '#f43f5e', lightHex: '#fb7185', icon: <UserCog size={15} />, badge: 'Platform Admin', email: 'admin@buildsense.ai' },
};

const ROLE_LABELS: Record<UserRole, string> = {
  'Civil Engineer': 'Engineer',
  'Contractor': 'Contractor',
  'Student': 'Student',
  'Admin': 'Admin',
};

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange, userRole, setUserRole, onLogout }) => {
  const cfg = ROLE_CONFIG[userRole];

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#f1f5f9' }}>
      {/* Sidebar */}
      <aside className="w-64 flex flex-col shrink-0" style={{ background: 'linear-gradient(180deg, #0f0c29 0%, #1e1b4b 100%)', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
        {/* Brand */}
        <div className="p-6 flex items-center gap-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg" style={{ background: `linear-gradient(135deg, ${cfg.hex}, ${cfg.lightHex})`, boxShadow: `0 4px 16px ${cfg.hex}40` }}>
            <HardHat size={20} />
          </div>
          <div>
            <h1 className="text-lg font-black text-white tracking-tight">BuildSense</h1>
            <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: cfg.lightHex }}>AI Platform</p>
          </div>
        </div>

        {/* AI badge */}
        <div className="mx-4 mt-4 mb-2 flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
          <Zap size={12} className="text-amber-400" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Gemini AI Active</span>
          <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            if (item.id === 'admin' && userRole !== 'Admin') return null;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-150 group text-left"
                style={isActive ? {
                  background: `linear-gradient(135deg, ${cfg.hex}30, ${cfg.hex}15)`,
                  borderLeft: `3px solid ${cfg.hex}`,
                  color: '#fff',
                } : {
                  color: 'rgba(148,163,184,0.8)',
                  borderLeft: '3px solid transparent',
                }}
              >
                <span style={{ color: isActive ? cfg.lightHex : 'rgba(100,116,139,0.8)' }}>{item.icon}</span>
                <span className="font-semibold text-sm">{item.label}</span>
                {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: cfg.lightHex }} />}
              </button>
            );
          })}
        </nav>

        {/* Role switcher */}
        <div className="p-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest px-2 mb-2">Switch Role</p>
          <div className="grid grid-cols-2 gap-1.5 mb-3">
            {(Object.keys(ROLE_CONFIG) as UserRole[]).map(role => {
              const rc = ROLE_CONFIG[role];
              const isSelected = userRole === role;
              return (
                <button
                  key={role}
                  onClick={() => setUserRole(role)}
                  className="py-1.5 px-2 rounded-lg text-[10px] font-bold transition-all"
                  style={isSelected
                    ? { background: `${rc.hex}25`, color: rc.lightHex, border: `1px solid ${rc.hex}40` }
                    : { background: 'rgba(255,255,255,0.04)', color: 'rgba(100,116,139,0.8)', border: '1px solid rgba(255,255,255,0.05)' }
                  }
                >
                  {ROLE_LABELS[role]}
                </button>
              );
            })}
          </div>

          {/* User card */}
          <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: `${cfg.hex}25`, color: cfg.lightHex }}>
              {cfg.icon}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-bold text-white truncate">{cfg.badge}</p>
              <p className="text-[9px] text-slate-500 truncate">{cfg.email}</p>
            </div>
            <button onClick={onLogout} className="p-1.5 rounded-lg transition-all hover:bg-red-500/20 text-slate-600 hover:text-red-400">
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white flex items-center justify-between px-8 shrink-0 z-20" style={{ borderBottom: '1px solid #e2e8f0', boxShadow: '0 1px 8px rgba(0,0,0,0.04)' }}>
          <div className="flex items-center gap-3">
            <h2 className="text-base font-bold text-slate-800 capitalize">
              {activeTab.replace('-', ' ')}
            </h2>
            <span className="text-slate-300">·</span>
            <span className="text-xs font-black uppercase tracking-widest px-2.5 py-1 rounded-full" style={{ background: `${cfg.hex}15`, color: cfg.hex }}>
              {userRole} View
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Live indicator */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Live</span>
            </div>

            <div className="w-px h-6 bg-slate-200" />

            {/* User badge */}
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl" style={{ background: `${cfg.hex}10`, border: `1px solid ${cfg.hex}20` }}>
              <span style={{ color: cfg.hex }}>{cfg.icon}</span>
              <span className="text-xs font-black" style={{ color: cfg.hex }}>{cfg.badge}</span>
            </div>

            <button onClick={onLogout} className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all">
              <LogOut size={16} />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
