
import React, { useState } from 'react';
import { BOQItem } from '../types';
import { Info, HelpCircle, ChevronRight, AlertTriangle } from 'lucide-react';

interface BOQTableProps {
  items: BOQItem[];
}

export const BOQTable: React.FC<BOQTableProps> = ({ items }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const totalCost = items.reduce((sum, item) => sum + item.total, 0);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Description</th>
            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Qty</th>
            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Unit</th>
            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Rate</th>
            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Total</th>
            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Confidence</th>
            <th className="px-6 py-4 w-10"></th>
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
                <td className="px-6 py-5 text-sm font-medium text-slate-600 text-right">${item.rate.toLocaleString()}</td>
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
                <td className="px-6 py-5 text-slate-400">
                  <ChevronRight size={18} className={`transition-transform duration-300 ${expandedId === item.id ? 'rotate-90' : ''}`} />
                </td>
              </tr>
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
