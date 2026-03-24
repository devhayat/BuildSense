
import React, { useState } from 'react';
import { Project, UserRole, ProjectTemplate } from '../types';
import { 
  Plus, MapPin, Building2, TrendingUp, AlertCircle, 
  FileSpreadsheet, ClipboardList, LayoutTemplate, 
  ArrowRight, Zap, Save, Briefcase, GraduationCap, X, CheckCircle, Boxes
} from 'lucide-react';
import { AreaChart, Area, Tooltip, ResponsiveContainer, XAxis, CartesianGrid } from 'recharts';

interface DashboardProps {
  projects: Project[];
  templates: ProjectTemplate[];
  onSelectProject: (id: string) => void;
  userRole: UserRole;
  addProject: (p: Project) => void;
  addTemplate: (t: ProjectTemplate) => void;
}

const MOCK_CHART_DATA = [
  { name: 'Week 1', cost: 4000 },
  { name: 'Week 2', cost: 3000 },
  { name: 'Week 3', cost: 5000 },
  { name: 'Week 4', cost: 4500 },
  { name: 'Week 5', cost: 6000 },
  { name: 'Week 6', cost: 5500 },
];

export const Dashboard: React.FC<DashboardProps> = ({ projects, templates, onSelectProject, userRole, addProject, addTemplate }) => {
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [newTemplate, setNewTemplate] = useState({ name: '', type: 'Residential', floors: 1 });

  const getRoleMetrics = () => {
    switch(userRole) {
      case 'Contractor':
        return [
          { label: 'Sub-Contractor Value', value: '$82.4M', icon: <Briefcase className="text-amber-600" />, trend: 'Contracting' },
          { label: 'Material Yield', value: '94%', icon: <TrendingUp className="text-amber-600" />, trend: 'Optimized' },
          { label: 'Operational Crew', value: '342', icon: <Plus className="text-amber-600" />, trend: 'On-site' },
          { label: 'Asset Lifecycle', value: '88%', icon: <Zap className="text-amber-600" />, trend: 'Maintenance' },
        ];
      case 'Student':
        return [
          { label: 'Engineering IQ', value: '72%', icon: <GraduationCap className="text-emerald-600" />, trend: 'Coursework' },
          { label: 'Projects Completed', value: '12', icon: <Building2 className="text-emerald-600" />, trend: 'Verified' },
          { label: 'AI Mentoring', value: '24h', icon: <Zap className="text-emerald-600" />, trend: 'Live Support' },
          { label: 'Accreditation', value: '02', icon: <ClipboardList className="text-emerald-600" />, trend: 'Global' },
        ];
      default:
        return [
          { label: 'Structural Value', value: '$162.5M', icon: <TrendingUp className="text-indigo-600" />, trend: 'Portfolio' },
          { label: 'Safety Score', value: '98.2', icon: <ClipboardList className="text-indigo-600" />, trend: 'High Priority' },
          { label: 'Design Inconsistencies', value: '04', icon: <AlertCircle className="text-indigo-600" />, trend: 'Review Needed' },
          { label: 'Cloud CAD Assets', value: '4.2 GB', icon: <FileSpreadsheet className="text-indigo-600" />, trend: 'Synchronized' },
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
    if (!newTemplate.name.trim()) {
      alert("Template name is mandatory for engineering consistency.");
      return;
    }
    const t: ProjectTemplate = {
      id: `t_${Date.now()}`,
      name: newTemplate.name,
      buildingType: newTemplate.type,
      floors: newTemplate.floors,
      description: `Structural baseline for ${newTemplate.type} architectural designs. Focused on ${newTemplate.floors}-floor scalability.`,
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
    a.href = url;
    a.download = `BuildSense_Executive_Summary_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    alert("Cross-project executive report downloaded.");
  };

  const roleColor = userRole === 'Contractor' ? 'amber' : userRole === 'Student' ? 'emerald' : 'indigo';

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {getRoleMetrics().map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2.5 bg-${roleColor}-50 rounded-xl`}>{stat.icon}</div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.trend}</span>
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Boxes className={`text-${roleColor}-600`} size={24} />
                Live Structural Portfolio
              </h3>
              <button 
                onClick={() => setShowTemplateModal(true)}
                className={`flex items-center gap-2 bg-${roleColor}-600 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-${roleColor}-700 transition-all shadow-lg shadow-${roleColor}-500/20`}
              >
                <Plus size={16} /> New Template
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((project) => (
                <div 
                  key={project.id}
                  onClick={() => onSelectProject(project.id)}
                  className="bg-white group cursor-pointer border border-slate-200 rounded-[2.5rem] overflow-hidden hover:border-indigo-400 transition-all shadow-sm hover:shadow-2xl"
                >
                  <div className="h-48 bg-slate-100 relative overflow-hidden">
                    <img src={project.drawingUrl} alt={project.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                    <div className="absolute top-4 right-4">
                      <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg ${
                        project.status === 'Analyzed' ? 'bg-green-500 text-white' : 'bg-amber-500 text-white'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                  </div>
                  <div className="p-8 relative">
                    <h4 className="text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{project.name}</h4>
                    <div className="flex items-center gap-2 text-slate-400 mt-1 text-xs font-bold uppercase tracking-widest">
                      <MapPin size={12} className="text-slate-300" />
                      <span>{project.location}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-slate-100">
                      <div><p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Value</p><p className="text-sm font-black text-slate-800">${(project.budget / 1000000).toFixed(1)}M</p></div>
                      <div><p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Floors</p><p className="text-sm font-black text-slate-800">{project.floors}F</p></div>
                      <div><p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Class</p><p className="text-sm font-black text-slate-800">{project.buildingType.charAt(0)}</p></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <LayoutTemplate size={24} className={`text-${roleColor}-600`} />
              Structural Baseline Templates
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {templates.map(template => (
                <div key={template.id} className="bg-white border border-slate-200 p-6 rounded-[2rem] hover:border-indigo-400 hover:shadow-2xl transition-all group relative overflow-hidden">
                  <div className={`w-12 h-12 rounded-2xl bg-${roleColor}-50 flex items-center justify-center mb-4 group-hover:bg-${roleColor}-600 group-hover:text-white transition-all`}>
                    <Zap size={22} />
                  </div>
                  <h4 className="text-base font-black text-slate-800">{template.name}</h4>
                  <p className="text-xs text-slate-500 mt-2 font-medium line-clamp-2 leading-relaxed">{template.description}</p>
                  <div className="mt-6 flex items-center justify-between">
                    <span className={`text-[10px] font-black text-${roleColor}-600 uppercase tracking-widest bg-${roleColor}-50 px-3 py-1 rounded-full`}>{template.buildingType} &bull; {template.floors}F</span>
                    <button onClick={() => handleDeployTemplate(template)} className={`text-xs font-black text-${roleColor}-600 group-hover:underline flex items-center gap-1 focus:outline-none`}>
                      INSTANTIATE BASELINE <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              ))}
              <button onClick={() => setShowTemplateModal(true)} className="border-2 border-dashed border-slate-200 p-6 rounded-[2rem] flex flex-col items-center justify-center text-slate-400 hover:border-indigo-400 hover:text-indigo-600 transition-all bg-slate-50/50 hover:bg-white group">
                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center mb-3 group-hover:border-indigo-200 shadow-sm"><Plus size={24} /></div>
                <span className="text-xs font-black uppercase tracking-widest">Architectural Baseline</span>
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-slate-900 p-10 rounded-[2.5rem] shadow-2xl flex flex-col min-h-[600px] text-white relative">
            <h3 className="text-xl font-black mb-1 relative z-10">Structural Neural Insights</h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-10 relative z-10">Real-time Cost Monitoring</p>
            <div className="h-64 mb-12 relative z-10">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={MOCK_CHART_DATA}>
                     <defs><linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#818cf8" stopOpacity={0.4}/><stop offset="95%" stopColor="#818cf8" stopOpacity={0}/></linearGradient></defs>
                     <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                     <XAxis dataKey="name" stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} />
                     <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderRadius: '16px', border: '1px solid #334155', fontSize: '12px' }} itemStyle={{ color: '#818cf8', fontWeight: 'bold' }} />
                     <Area type="monotone" dataKey="cost" stroke="#818cf8" strokeWidth={4} fillOpacity={1} fill="url(#colorCost)" />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
            <div className="space-y-4 mb-auto">
               <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">AI Recommendation</p>
                  <p className="text-sm font-medium text-slate-300 leading-relaxed">System has detected potential concrete waste in slab pouring sequences. Optimization suggested.</p>
               </div>
            </div>
            <button onClick={handleDownloadMasterReport} className={`w-full bg-${roleColor}-600 py-5 rounded-2xl text-xs font-black text-white hover:bg-${roleColor}-700 transition-all shadow-xl shadow-${roleColor}-500/20 uppercase tracking-[0.2em] active:scale-95 focus:outline-none`}>
               Download Master Report
            </button>
          </div>
        </div>
      </div>

      {showTemplateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[3rem] p-10 shadow-2xl animate-in zoom-in-95 border border-slate-100">
            <div className="flex justify-between items-center mb-8">
              <div><h3 className="text-2xl font-black text-slate-900 tracking-tight">New Structural Baseline</h3><p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Template Configuration</p></div>
              <button onClick={() => setShowTemplateModal(false)} className="p-2 bg-slate-50 text-slate-400 hover:text-indigo-600 rounded-xl transition-all focus:outline-none"><X size={24} /></button>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Architectural Label</label>
                <input type="text" value={newTemplate.name} onChange={(e) => setNewTemplate({...newTemplate, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 font-bold transition-all" placeholder="e.g. Modern Residential Baseline" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Building Class</label>
                  <select value={newTemplate.type} onChange={(e) => setNewTemplate({...newTemplate, type: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 font-bold transition-all appearance-none">
                    <option>Residential</option><option>Commercial</option><option>Industrial</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Floor Count</label>
                  <input type="number" value={newTemplate.floors} onChange={(e) => setNewTemplate({...newTemplate, floors: parseInt(e.target.value) || 1})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 font-bold transition-all" />
                </div>
              </div>
            </div>
            <div className="flex gap-4 mt-10 pt-8 border-t border-slate-100">
               <button onClick={() => setShowTemplateModal(false)} className="flex-1 py-4 text-xs font-black text-slate-500 uppercase tracking-[0.2em] focus:outline-none">Discard</button>
               <button onClick={handleCreateTemplate} className={`flex-1 py-4 text-xs font-black bg-slate-900 text-white rounded-2xl uppercase tracking-[0.2em] shadow-xl shadow-slate-200 active:scale-95 transition-all focus:outline-none`}>
                 Add Template
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
