
import React, { useState } from 'react';
import { Project, UserRole, ProjectTemplate } from '../types';
import {
  Plus, MapPin, Building2, TrendingUp, AlertCircle,
  FileSpreadsheet, ClipboardList, LayoutTemplate,
  ArrowRight, Zap, Briefcase, GraduationCap, X, Boxes,
  Activity, DollarSign, Users, ShieldCheck, BarChart3, Star, BookOpen, Database
} from 'lucide-react';
import { AreaChart, Area, Tooltip, ResponsiveContainer, XAxis, CartesianGrid, YAxis } from 'recharts';
import { PRACTICE_PROJECTS, MARKET_RATES, REGIONS } from '../constants';

interface DashboardProps {
  projects: Project[];
  templates: ProjectTemplate[];
  onSelectProject: (id: string) => void;
  userRole: UserRole;
  addProject: (p: Project) => void;
  addTemplate: (t: ProjectTemplate) => void;
}

const MOCK_CHART_DATA = [
  { name: 'Jan', cost: 4000, target: 3800 },
  { name: 'Feb', cost: 3000, target: 3500 },
  { name: 'Mar', cost: 5200, target: 4800 },
  { name: 'Apr', cost: 4800, target: 5000 },
  { name: 'May', cost: 6200, target: 5800 },
  { name: 'Jun', cost: 5800, target: 6000 },
  { name: 'Jul', cost: 7100, target: 6500 },
];

const ROLE_STYLES: Record<UserRole, { hex: string; lightHex: string; gradFrom: string; gradTo: string }> = {
  'Civil Engineer': { hex: '#6366f1', lightHex: '#818cf8', gradFrom: '#6366f1', gradTo: '#8b5cf6' },
  'Contractor':    { hex: '#f59e0b', lightHex: '#fbbf24', gradFrom: '#f59e0b', gradTo: '#ef4444' },
  'Student':       { hex: '#10b981', lightHex: '#34d399', gradFrom: '#10b981', gradTo: '#0ea5e9' },
  'Admin':         { hex: '#f43f5e', lightHex: '#fb7185', gradFrom: '#f43f5e', gradTo: '#ec4899' },
};

export const Dashboard: React.FC<DashboardProps> = ({ projects, templates, onSelectProject, userRole, addProject, addTemplate }) => {
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [newTemplate, setNewTemplate] = useState({ name: '', type: 'Residential', floors: 1 });
  const style = ROLE_STYLES[userRole];

  const getRoleMetrics = () => {
    switch (userRole) {
      case 'Contractor': return [
        { label: 'Contract Value',   value: '$82.4M', sub: '+12% MoM',  icon: <DollarSign size={20} />,  positive: true },
        { label: 'Material Yield',   value: '94%',    sub: 'Optimized',  icon: <Activity size={20} />,    positive: true },
        { label: 'Active Crew',      value: '342',    sub: 'On-site',    icon: <Users size={20} />,       positive: true },
        { label: 'Asset Health',     value: '88%',    sub: '↑ 3% wk',    icon: <Zap size={20} />,         positive: true },
      ];
      case 'Student': return [
        { label: 'Engineering IQ',   value: '72%',    sub: 'Improving',  icon: <Star size={20} />,        positive: true },
        { label: 'Completed',        value: '12',     sub: 'Projects',   icon: <Building2 size={20} />,   positive: true },
        { label: 'AI Sessions',      value: '24h',    sub: 'This month', icon: <Zap size={20} />,         positive: true },
        { label: 'Certifications',   value: '02',     sub: 'Verified',   icon: <ShieldCheck size={20} />, positive: true },
      ];
      case 'Admin': return [
        { label: 'Total Users',      value: '1,482',  sub: '+12 today',  icon: <Users size={20} />,       positive: true },
        { label: 'Active Projects',  value: '247',    sub: '38 pending', icon: <BarChart3 size={20} />,   positive: false },
        { label: 'AI Calls',         value: '84.2K',  sub: 'This month', icon: <Zap size={20} />,         positive: true },
        { label: 'Revenue',          value: '$4.8M',  sub: '+18% YoY',   icon: <DollarSign size={20} />,  positive: true },
      ];
      default: return [
        { label: 'Portfolio Value',  value: '$162.5M', sub: '+8% QoQ',   icon: <TrendingUp size={20} />,  positive: true },
        { label: 'Safety Score',     value: '98.2',   sub: 'Excellent',  icon: <ShieldCheck size={20} />, positive: true },
        { label: 'Design Issues',    value: '04',     sub: 'Need review', icon: <AlertCircle size={20} />, positive: false },
        { label: 'CAD Assets',       value: '4.2 GB', sub: 'In sync',    icon: <FileSpreadsheet size={20} />, positive: true },
      ];
    }
  };

  const handleDeployTemplate = (template: ProjectTemplate) => {
    const newPrj: Project = {
      id: `prj_${Date.now()}`,
      name: `${template.name} Deployment`,
      location: 'Site Location: TBD',
      buildingType: template.buildingType,
      floors: template.floors,
      budget: template.buildingType === 'Commercial' ? 120000000 : 45000000,
      timeline: '18 Months',
      status: 'Draft',
      createdAt: new Date(),
      drawingUrl: 'https://picsum.photos/800/600?random=' + Math.floor(Math.random() * 1000),
      boq: []
    };
    addProject(newPrj);
    onSelectProject(newPrj.id);
  };

  const handleCreateTemplate = () => {
    if (!newTemplate.name.trim()) return;
    const t: ProjectTemplate = {
      id: `t_${Date.now()}`,
      name: newTemplate.name,
      buildingType: newTemplate.type,
      floors: newTemplate.floors,
      description: `Structural baseline for ${newTemplate.type} designs. Focused on ${newTemplate.floors}-floor scalability.`,
      baseBoq: []
    };
    addTemplate(t);
    setShowTemplateModal(false);
    setNewTemplate({ name: '', type: 'Residential', floors: 1 });
  };

  const handleDownloadMasterReport = () => {
    const header = "Project ID,Name,Location,Status,Budget,Floors,Type\n";
    const rows = projects.map(p => `${p.id},"${p.name}","${p.location}",${p.status},${p.budget},${p.floors},${p.buildingType}`).join("\n");
    const blob = new Blob(["\ufeff", header, rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `BuildSense_Report_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a); a.click();
    document.body.removeChild(a); URL.revokeObjectURL(url);
  };

  const metrics = getRoleMetrics();

  return (
    <div className="p-8 space-y-8" style={{ minHeight: '100%', background: '#f8fafc' }}>

      {/* Welcome banner */}
      <div className="relative overflow-hidden rounded-3xl p-8 text-white" style={{
        background: `linear-gradient(135deg, ${style.gradFrom}, ${style.gradTo})`,
        boxShadow: `0 8px 32px ${style.hex}30`
      }}>
        <div className="absolute right-0 top-0 w-64 h-64 rounded-full opacity-10" style={{ background: 'white', transform: 'translate(30%, -30%)' }} />
        <div className="absolute right-20 bottom-0 w-40 h-40 rounded-full opacity-10" style={{ background: 'white', transform: 'translateY(50%)' }} />
        <div className="relative z-10">
          <p className="text-sm font-bold opacity-80 uppercase tracking-widest mb-2">Welcome back 👋</p>
          <h2 className="text-3xl font-black mb-1">
            {userRole === 'Civil Engineer' ? 'Structural Dashboard' :
             userRole === 'Contractor' ? 'Contractor Operations' :
             userRole === 'Student' ? 'Learning Hub' : 'Admin Control Center'}
          </h2>
          <p className="text-sm opacity-70">{projects.length} active projects · AI analysis ready</p>
        </div>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {metrics.map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.04)' }}>
            <div className="flex items-start justify-between mb-5">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: `${style.hex}12`, color: style.hex }}>
                {stat.icon}
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${stat.positive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                {stat.sub}
              </span>
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-2xl font-black text-slate-900">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Projects + Templates */}
        <div className="lg:col-span-2 space-y-8">

          {/* Projects */}
          <div>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                <Boxes size={20} style={{ color: style.hex }} />
                Live Projects
              </h3>
              <button
                onClick={() => setShowTemplateModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest text-white transition-all active:scale-95"
                style={{ background: `linear-gradient(135deg, ${style.gradFrom}, ${style.gradTo})`, boxShadow: `0 4px 16px ${style.hex}30` }}
              >
                <Plus size={14} /> New
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {projects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => onSelectProject(project.id)}
                  className="group cursor-pointer bg-white rounded-3xl overflow-hidden border border-slate-100 hover:border-transparent hover:shadow-2xl transition-all duration-300"
                  style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
                >
                  <div className="h-44 relative overflow-hidden">
                    <img src={project.drawingUrl} alt={project.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)' }} />
                    <div className="absolute top-3 right-3">
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg ${
                        project.status === 'Analyzed' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-4">
                      <h4 className="text-lg font-black text-white drop-shadow-lg">{project.name}</h4>
                      <div className="flex items-center gap-1 text-white/70 text-xs font-bold mt-0.5">
                        <MapPin size={10} /> {project.location}
                      </div>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: 'Budget', value: `$${(project.budget / 1000000).toFixed(1)}M` },
                        { label: 'Floors', value: `${project.floors}F` },
                        { label: 'Type', value: project.buildingType },
                      ].map((d, i) => (
                        <div key={i} className="text-center py-2 rounded-xl" style={{ background: '#f8fafc' }}>
                          <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">{d.label}</p>
                          <p className="text-sm font-black text-slate-800 mt-0.5">{d.value}</p>
                        </div>
                      ))}
                    </div>
                    <button
                      className="mt-3 w-full py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
                      style={{ background: `${style.hex}10`, color: style.hex }}
                    >
                      Open Project <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Templates */}
          <div>
            <h3 className="text-lg font-black text-slate-800 flex items-center gap-2 mb-5">
              <LayoutTemplate size={20} style={{ color: style.hex }} />
              Baseline Templates
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {templates.map(template => (
                <div key={template.id} className="bg-white p-6 rounded-2xl border border-slate-100 hover:shadow-xl hover:border-transparent transition-all duration-200 group">
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4 transition-all" style={{ background: `${style.hex}12`, color: style.hex }}>
                    <Zap size={20} />
                  </div>
                  <h4 className="text-sm font-black text-slate-800 mb-1">{template.name}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-4">{template.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black px-3 py-1 rounded-full" style={{ background: `${style.hex}12`, color: style.hex }}>
                      {template.buildingType} · {template.floors}F
                    </span>
                    <button onClick={() => handleDeployTemplate(template)} className="text-xs font-black flex items-center gap-1 hover:underline" style={{ color: style.hex }}>
                      Deploy <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              ))}
              <button
                onClick={() => setShowTemplateModal(true)}
                className="p-6 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:border-slate-300 hover:text-slate-600 hover:bg-white transition-all group"
              >
                <div className="w-11 h-11 rounded-2xl bg-slate-100 flex items-center justify-center mb-3 group-hover:bg-slate-200 transition-all">
                  <Plus size={22} />
                </div>
                <span className="text-xs font-black uppercase tracking-widest">Add Template</span>
              </button>
            </div>
          </div>

          {/* Practice Projects for Students */}
          {userRole === 'Student' && (
            <div>
              <h3 className="text-lg font-black text-slate-800 flex items-center gap-2 mb-5">
                <BookOpen size={20} className="text-emerald-500" />
                Practice Projects
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full uppercase tracking-widest">Learn</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {PRACTICE_PROJECTS.map(pp => (
                  <div key={pp.id} onClick={() => { addProject(pp); onSelectProject(pp.id); }} className="group cursor-pointer bg-white rounded-2xl overflow-hidden border border-emerald-100 hover:border-emerald-300 hover:shadow-xl transition-all">
                    <div className="h-28 relative overflow-hidden">
                      <img src={pp.drawingUrl} alt={pp.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)' }} />
                      <span className="absolute top-2 right-2 bg-emerald-500 text-white text-[9px] font-black px-2 py-0.5 rounded-md uppercase">Practice</span>
                      <p className="absolute bottom-2 left-3 text-white text-sm font-black">{pp.name}</p>
                    </div>
                    <div className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-slate-500 font-bold"><MapPin size={10} /> {pp.location}</div>
                      <span className="text-[10px] font-black text-emerald-600">{pp.floors}F · {pp.buildingType}</span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-400 mt-3 text-center font-medium">Click any project to start practicing BOQ analysis with AI</p>
            </div>
          )}

          {/* Rate Master for Admin */}
          {userRole === 'Admin' && (
            <div>
              <h3 className="text-lg font-black text-slate-800 flex items-center gap-2 mb-5">
                <Database size={20} className="text-rose-500" />
                Regional Rate Master
                <span className="text-[10px] font-bold bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full uppercase tracking-widest">CPWD DSR 2026</span>
              </h3>
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Material</th>
                        <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Unit</th>
                        {['Mumbai', 'Delhi', 'Dubai'].map(c => (
                          <th key={c} className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">{c}</th>
                        ))}
                        <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Source</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {MARKET_RATES.map(r => (
                        <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3 text-xs font-bold text-slate-800">{r.material}</td>
                          <td className="px-4 py-3 text-[10px] text-slate-500 font-medium text-center">{r.unit}</td>
                          {['Mumbai, IN', 'Delhi, IN', 'Dubai, UAE'].map(region => (
                            <td key={region} className="px-4 py-3 text-xs font-bold text-slate-700 text-right">
                              {region.includes('UAE') ? 'AED ' : '\u20B9'}{r.rates[region]?.toLocaleString() || '-'}
                            </td>
                          ))}
                          <td className="px-4 py-3 text-[10px] text-indigo-500 font-bold">{r.source}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="p-3 bg-slate-50 border-t border-slate-200 text-center">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Last Updated: Oct 2026 · {MARKET_RATES.length} Materials · {REGIONS.length} Regions</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Chart panel */}
        <div className="space-y-5">
          <div className="rounded-3xl p-7 text-white" style={{ background: 'linear-gradient(180deg, #0f0c29 0%, #1e1b4b 100%)', boxShadow: '0 8px 40px rgba(15,12,41,0.3)' }}>
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-lg font-black">Cost Analytics</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Real-time monitoring</p>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.2)' }}>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-bold text-emerald-400">LIVE</span>
              </div>
            </div>

            <div className="h-52 my-6">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MOCK_CHART_DATA} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={style.lightHex} stopOpacity={0.4} />
                      <stop offset="95%" stopColor={style.lightHex} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="name" stroke="#334155" fontSize={10} axisLine={false} tickLine={false} />
                  <YAxis stroke="#334155" fontSize={10} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', border: '1px solid #334155', fontSize: '11px' }}
                    itemStyle={{ color: style.lightHex, fontWeight: 'bold' }}
                    labelStyle={{ color: '#94a3b8' }}
                  />
                  <Area type="monotone" dataKey="cost" stroke={style.lightHex} strokeWidth={3} fillOpacity={1} fill="url(#grad1)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-3 mb-6">
              <div className="p-4 rounded-2xl" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1.5">AI Insight</p>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {userRole === 'Admin'
                    ? 'Platform usage up 22% this month. Consider scaling API capacity.'
                    : 'Concrete waste detected in slab sequences. Optimization could save ~$12K.'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'This Month', value: '$5.8M' },
                  { label: 'Projected', value: '$7.2M' },
                ].map((s, i) => (
                  <div key={i} className="p-3 rounded-xl text-center" style={{ background: 'rgba(255,255,255,0.04)' }}>
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{s.label}</p>
                    <p className="text-base font-black text-white mt-1">{s.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleDownloadMasterReport}
              className="w-full py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 text-white transition-all active:scale-95"
              style={{ background: `linear-gradient(135deg, ${style.gradFrom}, ${style.gradTo})`, boxShadow: `0 4px 16px ${style.hex}30` }}
            >
              <FileSpreadsheet size={14} /> Download Report
            </button>
          </div>
        </div>
      </div>

      {/* New Template Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}>
          <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl border border-slate-100">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-black text-slate-900">New Template</h3>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Structural Baseline</p>
              </div>
              <button onClick={() => setShowTemplateModal(false)} className="p-2 bg-slate-100 text-slate-400 hover:text-slate-700 rounded-xl transition-all">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Template Name</label>
                <input
                  type="text" value={newTemplate.name} onChange={e => setNewTemplate({ ...newTemplate, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 focus:outline-none font-bold text-slate-800 text-sm transition-all"
                  style={{ '--tw-ring-color': style.hex } as React.CSSProperties}
                  placeholder="e.g. Modern Residential"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Building Type</label>
                  <select
                    value={newTemplate.type} onChange={e => setNewTemplate({ ...newTemplate, type: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 focus:outline-none font-bold text-slate-800 text-sm appearance-none"
                  >
                    <option>Residential</option><option>Commercial</option><option>Industrial</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Floors</label>
                  <input
                    type="number" value={newTemplate.floors} min={1}
                    onChange={e => setNewTemplate({ ...newTemplate, floors: parseInt(e.target.value) || 1 })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 focus:outline-none font-bold text-slate-800 text-sm"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <button onClick={() => setShowTemplateModal(false)} className="flex-1 py-3.5 text-xs font-black text-slate-500 uppercase tracking-widest hover:bg-slate-50 rounded-2xl transition-all">
                Cancel
              </button>
              <button
                onClick={handleCreateTemplate}
                className="flex-2 flex-1 py-3.5 text-xs font-black text-white rounded-2xl uppercase tracking-widest transition-all active:scale-95"
                style={{ background: `linear-gradient(135deg, ${style.gradFrom}, ${style.gradTo})` }}
              >
                Create Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
