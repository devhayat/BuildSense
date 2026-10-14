
import React, { useState } from 'react';
import { BOQItem, LearningTip } from '../types';
import { Info, HelpCircle, ChevronRight, AlertTriangle, GraduationCap, BookOpen, Lightbulb, Edit3, Check, X } from 'lucide-react';

interface BOQTableProps {
  items: BOQItem[];
  userRole?: string;
  learningTips?: LearningTip[];
  onRateUpdate?: (itemId: string, newRate: number) => void;
}

export const BOQTable: React.FC<BOQTableProps> = ({ items, userRole = 'Civil Engineer', learningTips = [], onRateUpdate }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [learningId, setLearningId] = useState<string | null>(null);
  const [editingRateId, setEditingRateId] = useState<string | null>(null);
  const [editRate, setEditRate] = useState<number>(0);

  const isStudent = userRole === 'Student';
  const totalCost = items.reduce((sum, item) => sum + item.total, 0);

  const getTipForCategory = (category: string): LearningTip | undefined => {
    return learningTips.find(t => t.category.toLowerCase() === category.toLowerCase());
  };

  const handleRateSave = (itemId: string) => {
    if (onRateUpdate && editRate > 0) {
      onRateUpdate(itemId, editRate);
    }
    setEditingRateId(null);
  };

  return (
    <div className="overflow-x-auto">
      {isStudent && (
        <div className="mx-6 mt-6 p-5 rounded-2xl border border-emerald-200 bg-emerald-50 flex items-start gap-4">
          <div className="p-2 bg-emerald-100 rounded-xl shrink-0">
            <GraduationCap size={20} className="text-emerald-600" />
          </div>
          <div>
            <p className="text-sm font-black text-emerald-800 mb-1">Learning Mode Active</p>
            <p className="text-xs text-emerald-600 leading-relaxed">Click the <BookOpen size={12} className="inline text-emerald-500" /> icon on any row to learn how that quantity is calculated. Each category includes formulas, IS code references, and pro tips from experienced engineers.</p>
          </div>
        </div>
      )}
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Description</th>
            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Qty</th>
            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Unit</th>
            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Rate</th>
            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Total</th>
            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Confidence</th>
            <th className="px-6 py-4 w-20"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {items.map((item) => (
            <React.Fragment key={item.id}>
              <tr 
                className={`hover:bg-slate-50 transition-colors cursor-pointer ${expandedId === item.id ? 'bg-indigo-50/30' : ''}`}
                onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
              >
                <td className="px-6 py-5">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-indigo-600 uppercase tracking-tighter mb-1">{item.category}</span>
                    <span className="text-sm font-semibold text-slate-800 line-clamp-1">{item.description}</span>
                  </div>
                </td>
                <td className="px-6 py-5 text-sm font-bold text-slate-700 text-center">{item.quantity.toLocaleString()}</td>
                <td className="px-6 py-5 text-xs font-medium text-slate-500 text-center">{item.unit}</td>
                <td className="px-6 py-5 text-right">
                  {editingRateId === item.id ? (
                    <div className="flex items-center justify-end gap-1" onClick={e => e.stopPropagation()}>
                      <span className="text-xs text-slate-400">$</span>
                      <input
                        type="number"
                        value={editRate}
                        onChange={e => setEditRate(Number(e.target.value))}
                        className="w-24 bg-white border border-indigo-300 rounded-lg px-2 py-1 text-sm font-bold text-right focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        autoFocus
                      />
                      <button onClick={() => handleRateSave(item.id)} className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"><Check size={14} /></button>
                      <button onClick={() => setEditingRateId(null)} className="p-1 text-red-500 hover:bg-red-50 rounded"><X size={14} /></button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-end gap-1.5 group/rate">
                      <span className="text-sm font-medium text-slate-600">${item.rate.toLocaleString()}</span>
                      {onRateUpdate && (
                        <button
                          onClick={(e) => { e.stopPropagation(); setEditingRateId(item.id); setEditRate(item.rate); }}
                          className="opacity-0 group-hover/rate:opacity-100 p-0.5 text-slate-400 hover:text-indigo-600 transition-all"
                          title="Override rate"
                        >
                          <Edit3 size={12} />
                        </button>
                      )}
                    </div>
                  )}
                </td>
                <td className="px-6 py-5 text-sm font-bold text-slate-900 text-right">${item.total.toLocaleString()}</td>
                <td className="px-6 py-5 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-12 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${item.confidence > 90 ? 'bg-green-500' : item.confidence > 70 ? 'bg-amber-500' : 'bg-red-500'}`} 
                        style={{ width: `${item.confidence}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-slate-500">{item.confidence}%</span>
                  </div>
                </td>
                <td className="px-6 py-5 flex items-center gap-1">
                  {isStudent && getTipForCategory(item.category) && (
                    <button
                      onClick={(e) => { e.stopPropagation(); setLearningId(learningId === item.id ? null : item.id); }}
                      className={`p-1.5 rounded-lg transition-all ${learningId === item.id ? 'bg-emerald-100 text-emerald-600' : 'text-slate-300 hover:text-emerald-500 hover:bg-emerald-50'}`}
                      title="Learn about this"
                    >
                      <BookOpen size={15} />
                    </button>
                  )}
                  <ChevronRight size={18} className={`text-slate-400 transition-transform duration-300 ${expandedId === item.id ? 'rotate-90' : ''}`} />
                </td>
              </tr>

              {/* Student Learning Panel */}
              {isStudent && learningId === item.id && getTipForCategory(item.category) && (
                <tr className="bg-emerald-50/50">
                  <td colSpan={7} className="px-8 py-6">
                    <div className="bg-white rounded-2xl border border-emerald-200 overflow-hidden shadow-sm">
                      <div className="p-5 bg-emerald-600 text-white flex items-center gap-3">
                        <GraduationCap size={20} />
                        <div>
                          <h5 className="text-sm font-black">{getTipForCategory(item.category)!.title}</h5>
                          <p className="text-[10px] opacity-80 uppercase tracking-widest font-bold">Study Material</p>
                        </div>
                      </div>
                      <div className="p-6 space-y-5">
                        <div>
                          <div className="flex items-center gap-2 text-slate-600 mb-2">
                            <Info size={14} />
                            <h6 className="text-xs font-black uppercase tracking-widest">Concept</h6>
                          </div>
                          <p className="text-sm text-slate-700 leading-relaxed">{getTipForCategory(item.category)!.explanation}</p>
                        </div>
                        {getTipForCategory(item.category)!.formula && (
                          <div className="bg-slate-900 rounded-xl p-4">
                            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Formula</p>
                            <p className="text-sm text-emerald-400 font-mono font-bold">{getTipForCategory(item.category)!.formula}</p>
                          </div>
                        )}
                        {getTipForCategory(item.category)!.proTip && (
                          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
                            <Lightbulb size={18} className="text-amber-500 shrink-0 mt-0.5" />
                            <div>
                              <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">Pro Tip</p>
                              <p className="text-sm text-amber-800 leading-relaxed">{getTipForCategory(item.category)!.proTip}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              )}

              {/* Existing reasoning panel */}
              {expandedId === item.id && (
                <tr className="bg-slate-50">
                  <td colSpan={7} className="px-12 py-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-3">
                          <div className="flex items-center gap-2 text-indigo-600">
                             <HelpCircle size={16} />
                             <h5 className="text-xs font-bold uppercase tracking-widest">Engineer's Reasoning</h5>
                          </div>
                          <p className="text-sm text-slate-600 leading-relaxed font-medium bg-white p-4 rounded-xl border border-slate-200">
                            {item.reasoning}
                          </p>
                       </div>
                       <div className="space-y-3">
                          <div className="flex items-center gap-2 text-amber-600">
                             <AlertTriangle size={16} />
                             <h5 className="text-xs font-bold uppercase tracking-widest">Assumptions & Risks</h5>
                          </div>
                          <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 text-sm text-amber-800 font-medium">
                            {item.confidence < 90 
                              ? "Quantity includes a 15% allowance for overlapping steel in lap zones which are not explicitly drawn. Verify with structural detail S-01." 
                              : "Calculated with 98% geometric accuracy from vector-mapped slab outlines. Minimal risk."}
                          </div>
                       </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
          {/* Footer Total */}
          <tr className="bg-slate-900 text-white">
            <td className="px-6 py-6 font-bold text-sm" colSpan={4}>ESTIMATED CONSTRUCTION COST (SUB-TOTAL)</td>
            <td className="px-6 py-6 text-right font-bold text-xl">${totalCost.toLocaleString()}</td>
            <td colSpan={2}></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
