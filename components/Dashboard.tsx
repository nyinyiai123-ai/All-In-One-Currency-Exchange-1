import React from 'react';
import { Currency } from '../types';
import { RefreshCw, TrendingUp } from 'lucide-react';

interface DashboardProps {
  rates: Record<Currency, number>;
  lastUpdated: Date | null;
  onRefresh: () => void;
  isLoading: boolean;
  lang: 'en' | 'mm';
}

export const Dashboard: React.FC<DashboardProps> = ({ rates, lastUpdated, onRefresh, isLoading, lang }) => {
  const displayCurrencies = [
    { code: Currency.THB, flag: '🇹🇭' },
    { code: Currency.USD, flag: '🇺🇸' },
    { code: Currency.MYR, flag: '🇲🇾' },
    { code: Currency.SGD, flag: '🇸🇬' },
    { code: Currency.CNY, flag: '🇨🇳' },
    { code: Currency.EUR, flag: '🇪🇺' },
  ];

  return (
    <div className="bg-dark-card border border-dark-border rounded-2xl p-5 mb-6 shadow-lg backdrop-blur-sm bg-opacity-80">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-brand-500" />
          {lang === 'mm' ? 'ယနေ့ ပေါက်ဈေးများ' : 'Market Rates Today'}
        </h2>
        <button 
          onClick={onRefresh}
          disabled={isLoading}
          className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {displayCurrencies.map((curr) => (
          <div key={curr.code} className="bg-dark-surface border border-dark-border p-3 rounded-xl flex flex-col items-center text-center hover:border-brand-500/30 transition-colors">
            <span className="text-xs text-gray-500 font-medium mb-1">{curr.flag} {curr.code}</span>
            <span className="text-brand-400 font-bold text-lg tracking-wide">
              {rates[curr.code as Currency]?.toLocaleString() ?? '...'}
            </span>
            <span className="text-[10px] text-gray-600">MMK</span>
          </div>
        ))}
      </div>
      
      {lastUpdated && (
        <div className="mt-4 text-center">
          <p className="text-[10px] text-gray-600">
            {lang === 'mm' ? 'နောက်ဆုံးချိန်ညှိ:' : 'Last updated:'} {lastUpdated.toLocaleTimeString()}
          </p>
        </div>
      )}
    </div>
  );
};
