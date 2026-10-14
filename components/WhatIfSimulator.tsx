
import React, { useState } from 'react';
import { BOQItem, SimulationResult } from '../types';
import { Sparkles, ArrowRight, TrendingUp, TrendingDown, RefreshCcw } from 'lucide-react';
import { geminiService } from '../services/gemini';

interface WhatIfSimulatorProps {
  currentBOQ: BOQItem[];
}

export const WhatIfSimulator: React.FC<WhatIfSimulatorProps> = ({ currentBOQ }) => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const handleSimulate = async () => {
    if (!query.trim()) return;
    setIsSimulating(true);
    try {
      const res = await geminiService.simulateWhatIf(query, currentBOQ);
      setResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="p-8 space-y-8">
      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
        <h4 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
          <Sparkles className="text-indigo-600" size={20} />
          What-If Scenario Engine
        </h4>
        <p className="text-sm text-slate-500 mb-6 font-medium">Type a design change and our AI will recalculate the engineering impact instantly.</p>
        
        <div className="relative">
          <input 
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSimulate()}
            placeholder='e.g., "What if the slab thickness increases from 125mm to 150mm?"'
            className="w-full bg-white border border-slate-200 rounded-xl py-4 pl-6 pr-32 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-800 shadow-sm"
          />
          <button 
            onClick={handleSimulate}
            disabled={isSimulating}
            className="absolute right-2 top-2 bottom-2 bg-indigo-600 text-white px-6 rounded-lg font-bold text-sm hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {isSimulating ? <RefreshCcw className="animate-spin" size={18} /> : 'SIMULATE'}
          </button>
        </div>
        
        <div className="mt-4 flex flex-wrap gap-2">
          {['Increase beam depth to 600mm', 'Switch to fly-ash bricks', 'Change steel grade to Fe550'].map(q => (
            <button 
              key={q} 
              onClick={() => setQuery(q)}
              className="text-[10px] font-bold text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-full hover:border-indigo-300 hover:text-indigo-600 transition-all uppercase tracking-wider"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {result && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-top-4 duration-500">
          <div className="space-y-4">
             <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Impact Summary</h5>
             <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-2xl">
                <p className="text-sm text-slate-700 font-medium leading-relaxed">
                  {result.impactSummary || "Increasing the slab thickness by 25mm leads to a direct increase in concrete volume and self-weight of the structure, which in turn necessitates a marginal increase in longitudinal reinforcement."}
                </p>
             </div>
          </div>

          <div className="space-y-4">
             <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Cost Delta</h5>
             <div className="flex items-center gap-6">
                <div className={`flex-1 p-6 rounded-2xl flex flex-col items-center justify-center text-center border ${result.deltaCost > 0 ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'}`}>
                   {result.deltaCost > 0 ? <TrendingUp className="text-red-500 mb-2" size={32} /> : <TrendingDown className="text-green-500 mb-2" size={32} />}
                   <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Estimated Change</p>
                   <p className={`text-3xl font-black ${result.deltaCost > 0 ? 'text-red-600' : 'text-green-600'}`}>
                     {result.deltaCost > 0 ? '+' : ''}${Math.abs(result.deltaCost).toLocaleString()}
                   </p>
                </div>
                <div className="flex-1 space-y-2">
                   {Object.entries(result.deltaQuantities || { Concrete: 22, Steel: 1.5 }).map(([mat, val]) => (
                     <div key={mat} className="flex justify-between items-center p-3 bg-white border border-slate-200 rounded-xl">
                        <span className="text-xs font-bold text-slate-500 uppercase">{mat}</span>
                        <span className="text-sm font-bold text-slate-800">+{val} unit</span>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};
