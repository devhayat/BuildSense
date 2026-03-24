
import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { ProjectDetails } from './components/ProjectDetails';
import { MentorBot } from './components/MentorBot';
import { Login } from './components/Login';
import { Project, UserRole, ProjectTemplate } from './types';
import { MOCK_PROJECTS, MOCK_TEMPLATES } from './constants';
import { Settings } from 'lucide-react';

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
      <div className="animate-in fade-in slide-in-from-right-4 duration-700">
        {renderContent()}
      </div>
    </Layout>
  );
};

export default App;
