
import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { ProjectDetails } from './components/ProjectDetails';
import { MentorBot } from './components/MentorBot';
import { Login } from './components/Login';
import { Project, UserRole, ProjectTemplate } from './types';
import { MOCK_PROJECTS, MOCK_TEMPLATES } from './constants';
import { Settings, ShieldCheck, Users, BarChart3 } from 'lucide-react';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [userRole, setUserRole] = useState<UserRole>('Civil Engineer');
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [templates, setTemplates] = useState<ProjectTemplate[]>(MOCK_TEMPLATES);

  const handleLogin = (role: string) => {
    setUserRole(role as UserRole);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setSelectedProject(null);
    setActiveTab('dashboard');
  };

  const handleProjectSelect = (projectId: string) => {
    const prj = projects.find(p => p.id === projectId);
    if (prj) {
      setSelectedProject(prj);
      setActiveTab('project-view');
    }
  };

  const addProject = (newProject: Project) => {
    setProjects(prev => [newProject, ...prev]);
  };

  const updateProject = (updatedProject: Project) => {
    setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
    if (selectedProject?.id === updatedProject.id) {
      setSelectedProject(updatedProject);
    }
  };

  const addTemplate = (template: ProjectTemplate) => {
    setTemplates(prev => [template, ...prev]);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
      case 'projects':
        return (
          <Dashboard 
            projects={projects} 
            templates={templates}
            onSelectProject={handleProjectSelect}
            userRole={userRole}
            addProject={addProject}
            addTemplate={addTemplate}
          />
        );
      case 'project-view':
        return selectedProject ? (
          <ProjectDetails 
            project={selectedProject} 
            onBack={() => setActiveTab('dashboard')} 
            userRole={userRole}
            updateProject={updateProject}
          />
        ) : (
          <div className="p-16 text-center">
            <p className="text-slate-400 font-bold uppercase tracking-widest">No project selected</p>
            <button 
              onClick={() => setActiveTab('dashboard')}
              className="mt-4 text-indigo-600 font-black text-sm"
            >
              Back to Dashboard
            </button>
          </div>
        );
      case 'mentorship':
        return <MentorBot userRole={userRole} />;
      case 'admin':
        return userRole === 'Admin' ? (
          <div className="p-8 max-w-5xl mx-auto space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Total Users', value: '1,482', icon: <Users size={24} className="text-rose-500" />, sub: '+12 this week' },
                { label: 'Active Projects', value: '247', icon: <BarChart3 size={24} className="text-rose-500" />, sub: '38 pending review' },
                { label: 'AI API Calls', value: '84.2K', icon: <ShieldCheck size={24} className="text-rose-500" />, sub: 'Last 30 days' },
              ].map((s, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2.5 bg-rose-50 rounded-xl">{s.icon}</div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{s.sub}</span>
                  </div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{s.label}</p>
                  <h3 className="text-3xl font-black text-slate-900 mt-1">{s.value}</h3>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-8">
              <h3 className="text-lg font-black text-slate-800 mb-6">User Role Distribution</h3>
              <div className="space-y-4">
                {[
                  { role: 'Civil Engineer', count: 620, color: 'indigo', pct: 42 },
                  { role: 'Contractor', count: 410, color: 'amber', pct: 28 },
                  { role: 'Student', count: 380, color: 'emerald', pct: 26 },
                  { role: 'Admin', count: 72, color: 'rose', pct: 4 },
                ].map(r => (
                  <div key={r.role}>
                    <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                      <span>{r.role}</span><span>{r.count} users ({r.pct}%)</span>
                    </div>
                    <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full bg-${r.color}-500 rounded-full`} style={{ width: `${r.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-16 flex flex-col items-center justify-center text-slate-400">
            <ShieldCheck size={48} className="mb-4 text-slate-300" />
            <p className="font-black uppercase tracking-widest text-xs">Admin Access Required</p>
          </div>
        );
      default:
        return (
          <div className="p-16 flex flex-col items-center justify-center text-slate-400 space-y-4">
             <div className="w-20 h-20 bg-slate-100 rounded-[2rem] flex items-center justify-center text-slate-300">
                <Settings size={40} />
             </div>
             <p className="font-black uppercase tracking-[0.3em] text-xs">Section Coming Soon</p>
          </div>
        );
    }
  };

  return (
    <Layout 
      activeTab={activeTab} 
      onTabChange={setActiveTab}
      userRole={userRole}
      setUserRole={setUserRole}
      onLogout={handleLogout}
    >
      <div>
        {renderContent()}
      </div>
    </Layout>
  );
};

export default App;
