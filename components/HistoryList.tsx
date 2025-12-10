import React from 'react';
import { HistoryItem, Language } from '../types';
import { Trash2, History } from 'lucide-react';
import { getLabel } from '../translations';

interface HistoryListProps {
  history: HistoryItem[];
  onClear: () => void;
  lang: Language;
}

export const HistoryList: React.FC<HistoryListProps> = ({ history, onClear, lang }) => {
  if (history.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 bg-dark-card border border-dark-border rounded-2xl overflow-hidden">
      <div className="p-4 border-b border-dark-border flex items-center justify-between bg-dark-surface">
        <h3 className="text-white font-semibold flex items-center gap-2">
          <History className="w-4 h-4 text-gray-400" />
          {getLabel(lang, 'history')}
        </h3>
        <button 
          onClick={onClear}
          className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors px-2 py-1 rounded hover:bg-red-500/10"
        >
          <Trash2 className="w-3 h-3" />
          {getLabel(lang, 'clearHistory')}
        </button>
      </div>
      
      <div className="max-h-64 overflow-y-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-500 bg-dark-bg uppercase sticky top-0">
            <tr>
              <th className="px-4 py-3 font-medium">Time</th>
              <th className="px-4 py-3 font-medium">Conversion</th>
              <th className="px-4 py-3 font-medium text-right">Result</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-border">
            {history.map((item) => (
              <tr key={item.id} className="hover:bg-white/5 transition-colors">
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-gray-400 text-xs">{item.date}</div>
                  <div className="text-gray-500 text-[10px]">{item.time}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 text-gray-300 font-medium">
                    {item.from} <span className="text-gray-600">→</span> {item.to}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    Rate: {item.rate.toLocaleString()}
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="text-brand-400 font-bold">
                    {item.result.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                  </div>
                  <div className="text-[10px] text-gray-600">{item.to}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
