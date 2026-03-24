
import React from 'react';
import { NAV_ITEMS } from '../constants';
import { UserRole } from '../types';
import { HardHat, LogOut, ChevronDown, Briefcase, GraduationCap, ShieldCheck } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (id: string) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange, userRole, setUserRole, onLogout }) => {
  const getRoleColor = () => {
    switch(userRole) {
      case 'Contractor': return 'amber';
      case 'Student': return 'emerald';
      default: return 'indigo';
    }
  };

  const roleColor = getRoleColor();

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 shrink-0">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className={`w-10 h-10 bg-${roleColor}-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-${roleColor}-500/20 transition-colors duration-500`}>
            <HardHat size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">BuildSense</h1>
            <p className={`text-[10px] uppercase tracking-widest text-${roleColor}-400 font-semibold transition-colors duration-500`}>AI Engine</p>
          </div>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                activeTab === item.id 
                ? `bg-${roleColor}-600 text-white shadow-lg shadow-${roleColor}-500/30` 
                : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span className={`${activeTab === item.id ? 'text-white' : `text-slate-500 group-hover:text-${roleColor}-400`}`}>
                {item.icon}
              </span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="bg-slate-800/50 rounded-xl p-4 flex items-center gap-3 border border-slate-700/50 relative overflow-hidden group">
             <div className={`w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-${roleColor}-400`}>
                {userRole === 'Contractor' ? <Briefcase size={16} /> : userRole === 'Student' ? <GraduationCap size={16} /> : <ShieldCheck size={16} />}
             </div>
             <div className="flex-1 overflow-hidden">
                <p className="text-xs font-semibold text-white truncate">Pro Account</p>
                <div className="relative inline-flex items-center gap-1 text-[10px] text-slate-500">
                   {userRole}
                </div>
             </div>
             <button 
               onClick={onLogout}
               className="text-slate-500 hover:text-red-400 transition-colors p-1"
             >
                <LogOut size={18} />
             </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 relative z-20">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-slate-800 capitalize">
              {activeTab.replace('-', ' ')}
            </h2>
            <span className="text-slate-300">|</span>
            <span className={`text-xs font-bold uppercase tracking-widest text-${roleColor}-600`}>{userRole} View</span>
          </div>
          
          <div className="flex items-center gap-6">
             <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-inner">
                {(['Civil Engineer', 'Contractor', 'Student'] as UserRole[]).map(role => (
                   <button 
                    key={role}
                    onClick={() => setUserRole(role)}
                    className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${userRole === role ? `bg-white shadow-md text-${roleColor}-600` : 'text-slate-500 hover:text-slate-800'}`}
                   >
                    {role}
                   </button>
                ))}
             </div>
             <div className="w-px h-6 bg-slate-200" />
             <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Enterprise Link</p>
                  <p className="text-xs font-bold text-slate-700">Verified Station</p>
                </div>
                <div className={`w-8 h-8 rounded-lg bg-${roleColor}-100 flex items-center justify-center text-${roleColor}-600 border border-${roleColor}-200`}>
                  <HardHat size={16} />
                </div>
             </div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto scroll-smooth">
          {children}
        </div>
      </main>
    </div>
  );
};
