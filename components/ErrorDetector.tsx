
import React from 'react';
import { DesignError } from '../types';
import { ShieldAlert, AlertCircle, Info, CheckCircle2 } from 'lucide-react';

interface ErrorDetectorProps {
  errors: DesignError[];
}

export const ErrorDetector: React.FC<ErrorDetectorProps> = ({ errors }) => {
  return (
    <div className="divide-y divide-slate-100">
      <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
         <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg text-red-600">
               <ShieldAlert size={20} />
            </div>
            <div>
               <h4 className="text-lg font-bold text-slate-800">Design Consistency Check</h4>
               <p className="text-xs text-slate-500 font-medium">Automatic verification against international building codes.</p>
            </div>
         </div>
         <span className="bg-red-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest animate-pulse">
           {errors.length} Issues Found
         </span>
      </div>
      {errors.map((err) => (
        <div key={err.id} className="p-8 hover:bg-slate-50 transition-colors flex gap-6 items-start">
          <div className={`mt-1 p-2 rounded-xl ${
            err.severity === 'Critical' ? 'bg-red-100 text-red-600' : 
            err.severity === 'Warning' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
          }`}>
            {err.severity === 'Critical' ? <ShieldAlert size={20} /> : <AlertCircle size={20} />}
          </div>
          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md ${
                   err.severity === 'Critical' ? 'bg-red-600 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  {err.severity}
                </span>
                <h5 className="text-base font-bold text-slate-900 mt-2">{err.issue}</h5>
                <p className="text-xs font-bold text-indigo-600 uppercase tracking-tighter mt-0.5">Location: {err.location}</p>
              </div>
            </div>
            
            <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 shadow-inner">
               <div className="flex items-center gap-2 text-indigo-400 mb-2">
                  <CheckCircle2 size={16} />
                  <span className="text-xs font-bold uppercase tracking-widest">Recommended Fix</span>
               </div>
               <p className="text-sm text-slate-300 font-medium leading-relaxed">
                 {err.recommendation}
               </p>
            </div>
          </div>
        </div>
      ))}
      <div className="p-12 text-center bg-slate-50/50">
         <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">End of Report</p>
      </div>
    </div>
  );
};
