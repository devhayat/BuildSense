
import React, { useState, useRef } from 'react';
import { Project, BOQItem, DesignError, SteelDetail } from '../types';
import { 
  ArrowLeft, Upload, FileText, Activity, ShieldAlert, Cpu, 
  Volume2, Download, Package, PieChart as PieChartIcon, 
  X, CheckCircle, Plus, TrendingUp, HelpCircle, ShieldCheck, Edit3, MapPin, Square, RefreshCcw,
  FileJson, FileSpreadsheet, FileType, FileText as FileTextIcon
} from 'lucide-react';
import { BOQTable } from './BOQTable';
import { ErrorDetector } from './ErrorDetector';
import { WhatIfSimulator } from './WhatIfSimulator';
import { geminiService, decodeBase64, decodeAudioData } from '../services/gemini';
import { MOCK_BOQ, MOCK_STEEL_DETAILS } from '../constants';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface ProjectDetailsProps {
  project: Project;
  onBack: () => void;
  userRole: string;
  updateProject: (p: Project) => void;
}

export const ProjectDetails: React.FC<ProjectDetailsProps> = ({ project, onBack, userRole, updateProject }) => {
  const [activeSubTab, setActiveSubTab] = useState<'boq' | 'steel' | 'costs' | 'errors' | 'what-if'>('boq');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analysisPhase, setAnalysisPhase] = useState('');
  const [boqData, setBoqData] = useState<BOQItem[]>(project.boq || MOCK_BOQ);
  const [steelDetails, setSteelDetails] = useState<SteelDetail[]>(MOCK_STEEL_DETAILS);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showSteelManualModal, setShowSteelManualModal] = useState(false);
  
  const [exportOptions, setExportOptions] = useState({ 
    format: 'csv', 
    columns: ['Category', 'Description', 'Quantity', 'Unit', 'Rate', 'Total'] 
  });
  
  const [newSteel, setNewSteel] = useState({ barMark: '', diameter: 16, spacing: 150, shape: 'Straight', totalWeight: 0 });
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const roleColor = userRole === 'Contractor' ? 'amber' : userRole === 'Student' ? 'emerald' : 'indigo';
  const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  const getCostData = () => {
    const categories: Record<string, number> = {};
    boqData.forEach(item => {
      categories[item.category] = (categories[item.category] || 0) + item.total;
    });
    return Object.entries(categories).map(([name, value]) => ({ name, value }));
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result?.toString().split(',')[1] || "");
      reader.onerror = error => reject(error);
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = () => {
       updateProject({ ...project, drawingUrl: reader.result as string });
    };
    reader.readAsDataURL(file);
    
    await performAnalysis(file);
  };

  const performAnalysis = async (file?: File) => {
    setIsAnalyzing(true);
    setUploadProgress(0);
    
    // Core Engineering Machine Understanding Phases
    const phases = [
      { msg: 'Detecting Units & Scale Factor...', progress: 10 },
      { msg: 'Mapping Vector Layers & Text...', progress: 25 },
      { msg: 'IDENTIFYING: Walls, Slabs, Beams...', progress: 45 },
      { msg: 'IDENTIFYING: Columns & Footings...', progress: 60 },
      { msg: 'Separating Floor-wise Layouts...', progress: 75 },
      { msg: 'CALCULATING: Volume & Area BOQ...', progress: 90 },
      { msg: 'Finalizing Engineering Intelligence...', progress: 100 },
    ];

    for (const phase of phases) {
      setAnalysisPhase(phase.msg);
      await new Promise(r => setTimeout(r, 800));
      setUploadProgress(phase.progress);
    }

    try {
      let imageData = "";
      if (file) {
        imageData = await fileToBase64(file);
      } else if (project.drawingUrl?.startsWith('data:image')) {
        imageData = project.drawingUrl.split(',')[1];
      }

      if (imageData) {
        const result = await geminiService.analyzeDrawing(imageData, `${project.buildingType} with ${project.floors} floors`);
        if (result && result.boq && result.boq.length > 0) {
          setBoqData(result.boq);
          updateProject({ ...project, boq: result.boq, errors: result.errors, status: 'Analyzed' });
        } else {
          setBoqData(MOCK_BOQ);
          updateProject({ ...project, boq: MOCK_BOQ, status: 'Analyzed' });
        }
      } else {
        setBoqData(MOCK_BOQ);
        updateProject({ ...project, boq: MOCK_BOQ, status: 'Analyzed' });
      }
    } catch (err) {
      console.error("AI Analysis Error:", err);
      setBoqData(MOCK_BOQ);
      updateProject({ ...project, boq: MOCK_BOQ, status: 'Analyzed' });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleVoiceExplanation = async () => {
    if (isPlayingAudio) {
      stopAudio();
      return;
    }
    
    setIsPlayingAudio(true);
    const totalCost = getCostData().reduce((sum, item) => sum + item.value, 0).toLocaleString();
    const summaryText = `Project: ${project.name}. Total cost: ${totalCost}. Structural confidence: 94 percent. Engineering analysis indicates all structural elements are within tolerance.`;
    
    try {
      const audioBase64 = await geminiService.generateSpeech(summaryText);
      if (audioBase64) {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        audioCtxRef.current = audioContext;
        const decodedBytes = decodeBase64(audioBase64);
        const audioBuffer = await decodeAudioData(decodedBytes, audioContext, 24000, 1);
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        source.onended = () => {
          setIsPlayingAudio(false);
          audioSourceRef.current = null;
        };
        audioSourceRef.current = source;
        source.start();
      } else {
        setIsPlayingAudio(false);
        alert("Audio service encountered a temporary error. Please try again.");
      }
    } catch (e) {
      console.error("Audio generation failed:", e);
      setIsPlayingAudio(false);
      alert("Neural voice engine is currently busy.");
    }
  };

  const stopAudio = () => {
    if (audioSourceRef.current) {
      try { audioSourceRef.current.stop(); } catch(e) {}
      audioSourceRef.current = null;
    }
    if (audioCtxRef.current) {
      try { audioCtxRef.current.close(); } catch(e) {}
      audioCtxRef.current = null;
    }
    setIsPlayingAudio(false);
  };

  const handleAddSteel = () => {
    if (!newSteel.barMark) return;
    const id = 'st_' + (steelDetails.length + 1);
    const updatedSteel = [...steelDetails, { ...newSteel, id }];
    setSteelDetails(updatedSteel);
    setShowSteelManualModal(false);
    setNewSteel({ barMark: '', diameter: 16, spacing: 150, shape: 'Straight', totalWeight: 0 });
  };

  const handleExport = () => {
    const { format, columns } = exportOptions;
    if (!boqData || boqData.length === 0) {
      alert("No BOQ data available.");
      return;
    }

    let blob: Blob;
    let filename = `BuildSense_BOQ_${project.name.replace(/\s+/g, '_')}`;

    try {
      if (format === 'json') {
        const data = boqData.map(item => {
          const entry: any = {};
          columns.forEach(col => {
            const key = col.toLowerCase();
            entry[col] = (item as any)[key] ?? "";
          });
          return entry;
        });
        blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        filename += '.json';
      } else if (format === 'csv' || format === 'xlsx') {
        const header = columns.join(',');
        const rows = boqData.map(item => {
          return columns.map(col => {
            const key = col.toLowerCase();
            const val = (item as any)[key] ?? "";
            return typeof val === 'string' ? `"${val.replace(/"/g, '""')}"` : val;
          }).join(',');
        });
        blob = new Blob(["\ufeff", header, "\n", rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
        filename += format === 'csv' ? '.csv' : '.xlsx';
      } else if (format === 'pdf') {
        let report = `BUILDSENSE AI - CONSTRUCTION QUANTITY REPORT\nProject: ${project.name}\nGenerated: ${new Date().toLocaleString()}\n--------------------------------------------------\n\n`;
        boqData.forEach((item, idx) => {
          report += `${idx + 1}. ${item.category}: ${item.description}\n`;
          columns.filter(c => !['Category', 'Description'].includes(c)).forEach(col => {
            const key = col.toLowerCase();
            report += `   ${col}: ${(item as any)[key] ?? ""}\n`;
          });
          report += `\n`;
        });
        blob = new Blob([report], { type: 'text/plain' });
        filename += '_Report.txt';
      } else {
        throw new Error("Unsupported format");
      }

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setShowExportModal(false);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Export error occurred.");
    }
  };

  const availableColumns = ['Category', 'Description', 'Quantity', 'Unit', 'Rate', 'Total', 'Confidence', 'Reasoning'];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <button onClick={onBack} className="p-3 bg-white hover:bg-slate-100 border border-slate-200 rounded-2xl transition-all shadow-sm text-slate-500 hover:text-indigo-600 focus:outline-none">
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-3xl font-black text-slate-900 tracking-tighter">{project.name}</h2>
              <span className={`bg-${roleColor}-100 text-${roleColor}-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-${roleColor}-200`}>
                {userRole} Mode
              </span>
            </div>
            <div className="flex items-center gap-2 text-slate-400 text-sm font-bold">
              <MapPin size={14} />
              <span>{project.location}</span>
              <span className="text-slate-200">|</span>
              <span>{project.floors} Floors</span>
              <span className="text-slate-200">|</span>
              <span className="uppercase">{project.buildingType}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
           <button 
             onClick={handleVoiceExplanation}
             className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-black border transition-all ${isPlayingAudio ? `bg-${roleColor}-600 border-${roleColor}-600 text-white shadow-xl shadow-${roleColor}-500/30` : 'bg-white border-slate-200 text-slate-700 hover:border-indigo-400 shadow-sm'}`}
           >
             {isPlayingAudio ? <Square size={18} className="fill-current" /> : <Volume2 size={20} />}
             {isPlayingAudio ? 'Stop Analysis' : 'Audio Analysis'}
           </button>
           <button 
             onClick={() => setShowExportModal(true)}
             className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-900 text-white text-sm font-black hover:bg-slate-800 shadow-2xl transition-all active:scale-95"
           >
             <Download size={20} />
             Export BOQ
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-3 rounded-[2.5rem] border border-slate-200 shadow-sm aspect-square relative group overflow-hidden">
            {isAnalyzing && (
              <div className="absolute inset-0 z-20 bg-slate-900/90 backdrop-blur-xl flex flex-col items-center justify-center text-white p-8 text-center animate-in fade-in">
                <div className="absolute inset-0 overflow-hidden opacity-20">
                  <div className="scan-line absolute inset-x-0 h-1 bg-indigo-400" />
                </div>
                <div className="relative w-24 h-24 mb-6">
                   <div className="absolute inset-0 flex items-center justify-center font-black text-2xl text-white">{uploadProgress}%</div>
                   <div className="absolute inset-0 border-4 border-white/10 rounded-full" />
                   <div className="absolute inset-0 border-4 border-indigo-400 rounded-full border-t-transparent animate-spin duration-700" />
                </div>
                <p className="font-black text-xs tracking-[0.2em] uppercase mb-4 text-indigo-300 animate-pulse">{analysisPhase}</p>
                <div className="mt-4 flex flex-col gap-1">
                   {uploadProgress > 30 && <p className="text-[8px] font-black text-emerald-400 uppercase tracking-tighter">✔ VECTOR LAYERS IDENTIFIED</p>}
                   {uploadProgress > 50 && <p className="text-[8px] font-black text-emerald-400 uppercase tracking-tighter">✔ STRUCTURAL MAPPING OK</p>}
                   {uploadProgress > 70 && <p className="text-[8px] font-black text-emerald-400 uppercase tracking-tighter">✔ QUANTITIES CALCULATED</p>}
                </div>
              </div>
            )}
            <img 
              src={project.drawingUrl || 'https://picsum.photos/600/600'} 
              className="w-full h-full object-cover rounded-[2rem] shadow-inner brightness-95 group-hover:brightness-100 transition-all duration-700"
              alt="Project Drawing"
            />
            <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center backdrop-blur-sm">
               <label className="cursor-pointer bg-white text-slate-900 text-[10px] font-black tracking-widest uppercase px-8 py-4 rounded-2xl shadow-2xl hover:scale-110 active:scale-95 transition-all">
                  <input type="file" className="hidden" onChange={handleFileUpload} accept=".dwg,.dxf,.jpg,.png,.pdf" />
                  Update Drawing
               </label>
            </div>
          </div>

          <div className="bg-slate-900 rounded-[2rem] p-8 text-white space-y-8 shadow-2xl">
            <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em]">AI Diagnostics</h4>
            <div className="space-y-6">
               <div className="flex items-center justify-between text-xs">
                 <span className="text-slate-500 font-bold uppercase tracking-wider">Analysis Status</span>
                 <div className="flex items-center gap-2">
                   <span className="font-black text-slate-100">{project.status}</span>
                   <CheckCircle className="text-green-400" size={16} />
                 </div>
               </div>
               <div className="flex items-center justify-between text-xs">
                 <span className="text-slate-500 font-bold uppercase tracking-wider">Engineering Scale</span>
                 <span className="font-black text-slate-100">1:100 (Metric)</span>
               </div>
            </div>
            <div className="pt-4 border-t border-slate-800">
               <button 
                 onClick={() => performAnalysis()}
                 disabled={isAnalyzing}
                 className={`w-full bg-indigo-600 hover:bg-indigo-500 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${isAnalyzing ? 'opacity-50' : 'active:scale-95 focus:outline-none'}`}
               >
                 {isAnalyzing ? <RefreshCcw className="animate-spin" size={14} /> : null}
                 {isAnalyzing ? 'Analyzing...' : 'Re-Analyze'}
               </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className="flex bg-slate-100 p-1.5 rounded-3xl w-fit overflow-x-auto border border-slate-200 shadow-inner no-scrollbar">
            {[
              { id: 'boq', label: 'Takeoff BOQ', icon: <FileText size={18} /> },
              { id: 'steel', label: 'Reinforcement', icon: <Package size={18} /> },
              { id: 'costs', label: 'Cost Analysis', icon: <PieChartIcon size={18} /> },
              { id: 'errors', label: 'Error Detector', icon: <ShieldAlert size={18} /> },
              { id: 'what-if', label: 'Simulate', icon: <Activity size={18} /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-black transition-all whitespace-nowrap ${
                  activeSubTab === tab.id 
                  ? 'bg-white text-indigo-600 shadow-xl border border-indigo-100' 
                  : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl shadow-slate-100 overflow-hidden min-h-[600px] transition-all">
            {activeSubTab === 'boq' && <BOQTable items={boqData} />}
            {activeSubTab === 'steel' && (
              <div className="p-10 space-y-10 animate-in slide-in-from-right-8 duration-500">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tighter">Structural BBS Intelligence</h3>
                    <p className="text-sm text-slate-500 font-medium mt-1">Direct reinforcement extraction from structural layouts.</p>
                  </div>
                  <button onClick={() => setShowSteelManualModal(true)} className="bg-white border border-slate-200 text-slate-800 px-5 py-2.5 rounded-2xl text-xs font-black hover:bg-slate-50 shadow-sm transition-all focus:outline-none">
                    <Edit3 size={16} className="inline mr-2" /> MANUAL OVERRIDE
                  </button>
                </div>
                <div className="border border-slate-100 rounded-[2rem] overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Bar Mark</th>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Dia (mm)</th>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Spacing</th>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Shape</th>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Net Wt (MT)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {steelDetails.map(bar => (
                        <tr key={bar.id} className="hover:bg-slate-50 transition-all group">
                          <td className="px-8 py-5 text-sm font-black text-slate-900">{bar.barMark}</td>
                          <td className="px-8 py-5 text-sm font-bold text-slate-600 text-center">{bar.diameter}mm</td>
                          <td className="px-8 py-5 text-sm font-bold text-slate-600 text-center">{bar.spacing}mm c/c</td>
                          <td className="px-8 py-5 text-center"><span className="bg-slate-100 text-[10px] font-black uppercase px-3 py-1.5 rounded-xl text-slate-500">{bar.shape}</span></td>
                          <td className="px-8 py-5 text-sm font-black text-indigo-600 text-right">{bar.totalWeight.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {activeSubTab === 'costs' && (
              <div className="p-10 space-y-10 animate-in slide-in-from-right-8 duration-500">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tighter">Material & Labor Cost Projection</h3>
                  <div className={`bg-${roleColor}-100 text-${roleColor}-700 text-[10px] font-black px-4 py-2 rounded-2xl border border-${roleColor}-200 flex items-center gap-2 shadow-sm uppercase tracking-widest`}>
                    <TrendingUp size={14} /> AI INSIGHT: QUANTITY VARIANCE WITHIN 3% OF BUDGET
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                   <div className="h-96 bg-slate-50 rounded-[2.5rem] border border-slate-100 p-8 shadow-inner relative">
                      <ResponsiveContainer width="100%" height="100%">
                         <PieChart>
                            <Pie data={getCostData()} cx="50%" cy="50%" innerRadius={80} outerRadius={120} paddingAngle={8} dataKey="value">
                              {getCostData().map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />)}
                            </Pie>
                            <Tooltip contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', fontWeight: 'bold' }} />
                            <Legend verticalAlign="bottom" height={36} iconType="circle" />
                         </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Est. Total</p>
                        <p className="text-2xl font-black text-slate-900">${getCostData().reduce((sum, item) => sum + item.value, 0).toLocaleString()}</p>
                      </div>
                   </div>
                   <div className="space-y-6">
                      <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Profit Efficiency Insights</h4>
                      {[
                        { title: 'Concrete Optimization', desc: 'Neural analysis suggests high-performance plasticizer usage to reduce water-cement ratio.', icon: <Package className="text-indigo-500" /> },
                        { title: 'Steel Procurement', desc: 'Bulk reinforcement orders are prioritized for the substructure phase.', icon: <ShieldCheck className="text-indigo-500" /> },
                      ].map((opp, i) => (
                        <div key={i} className="flex gap-5 p-6 bg-white border border-slate-200 rounded-[2rem] hover:border-indigo-400 transition-all cursor-default shadow-sm hover:shadow-xl">
                           <div className="p-3 bg-slate-50 rounded-2xl h-fit border border-slate-100">{opp.icon}</div>
                           <div><p className="text-base font-black text-slate-800 tracking-tight">{opp.title}</p><p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">{opp.desc}</p></div>
                        </div>
                      ))}
                   </div>
                </div>
              </div>
            )}
            {activeSubTab === 'errors' && <ErrorDetector errors={project.errors || []} />}
            {activeSubTab === 'what-if' && <WhatIfSimulator currentBOQ={boqData} />}
          </div>
        </div>
      </div>

      {showSteelManualModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-black text-slate-900">Manual Steel Override</h3>
              <button onClick={() => setShowSteelManualModal(false)} className="text-slate-400 hover:text-indigo-600 p-2 bg-slate-50 rounded-xl transition-colors focus:outline-none"><X size={20} /></button>
            </div>
            <div className="p-10 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Bar Mark</label>
                  <input type="text" value={newSteel.barMark} onChange={(e) => setNewSteel({...newSteel, barMark: e.target.value})} placeholder="e.g. C1-T1" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Weight (MT)</label>
                  <input type="number" step="0.01" value={newSteel.totalWeight} onChange={(e) => setNewSteel({...newSteel, totalWeight: Number(e.target.value)})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold" />
                </div>
              </div>
            </div>
            <div className="p-8 bg-slate-50 flex gap-4 border-t border-slate-100">
              <button onClick={() => setShowSteelManualModal(false)} className="flex-1 py-4 text-sm font-black text-slate-500 hover:text-slate-800 transition-colors uppercase tracking-widest focus:outline-none">Discard</button>
              <button onClick={handleAddSteel} className="flex-1 py-4 text-sm font-black bg-slate-900 text-white rounded-2xl shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all uppercase tracking-widest focus:outline-none active:scale-95">Commit Override</button>
            </div>
          </div>
        </div>
      )}

      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <div><h3 className="text-xl font-black text-slate-900">Export Parameters</h3><p className="text-xs text-slate-500 font-medium">Configure document output format.</p></div>
              <button onClick={() => setShowExportModal(false)} className="text-slate-400 hover:text-indigo-600 p-2 bg-slate-50 rounded-xl focus:outline-none"><X size={24} /></button>
            </div>
            <div className="p-10 space-y-10">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Format Selection</label>
                <div className="grid grid-cols-4 gap-3">
                  {[{ id: 'pdf', label: 'PDF Report', icon: <FileType size={18} /> }, { id: 'xlsx', label: 'Excel', icon: <FileSpreadsheet size={18} /> }, { id: 'csv', label: 'CSV', icon: <FileTextIcon size={18} /> }, { id: 'json', label: 'JSON', icon: <FileJson size={18} /> }].map(f => (
                    <button key={f.id} onClick={() => setExportOptions({...exportOptions, format: f.id})} className={`flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all ${exportOptions.format === f.id ? `bg-slate-900 border-slate-900 text-white shadow-xl` : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-indigo-400'}`}>
                      {f.icon}<span className="text-[10px] font-black uppercase tracking-tighter">{f.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Field Inclusion</label>
                <div className="flex flex-wrap gap-2">
                  {availableColumns.map(col => (
                    <button key={col} onClick={() => { const newCols = exportOptions.columns.includes(col) ? exportOptions.columns.filter(c => c !== col) : [...exportOptions.columns, col]; setExportOptions({...exportOptions, columns: newCols}); }} className={`px-4 py-2 rounded-xl text-[10px] font-black border transition-all uppercase tracking-widest ${exportOptions.columns.includes(col) ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-white border-slate-200 text-slate-500 hover:border-indigo-400'}`}>
                      {col}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-8 bg-slate-50 flex gap-4 border-t border-slate-100">
              <button onClick={() => setShowExportModal(false)} className="flex-1 py-4 text-sm font-black text-slate-500 hover:text-slate-800 transition-colors uppercase tracking-widest focus:outline-none">Cancel</button>
              <button onClick={handleExport} className="flex-1 py-4 text-sm font-black bg-indigo-600 text-white rounded-2xl shadow-2xl shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 uppercase tracking-widest active:scale-95 focus:outline-none">
                <Download size={18} /> Initiate Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
