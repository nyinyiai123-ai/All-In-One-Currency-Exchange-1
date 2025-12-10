import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ArrowRightLeft, ChevronsRight } from 'lucide-react';
import { Currency, Language, HistoryItem } from '../types';
import { getLabel } from '../translations';

interface ExchangeCalculatorProps {
  rates: Record<Currency, number>;
  onSaveHistory: (item: Omit<HistoryItem, 'id'>) => void;
  lang: Language;
}

export const ExchangeCalculator: React.FC<ExchangeCalculatorProps> = ({ rates, onSaveHistory, lang }) => {
  // State
  const [sourceCurrency, setSourceCurrency] = useState<Currency>(Currency.THB);
  const [targetCurrency, setTargetCurrency] = useState<Currency>(Currency.MMK);
  
  // "Foreign" currency tracking for rate lookup
  const [foreignCurrency, setForeignCurrency] = useState<Currency>(Currency.THB);

  const [amount, setAmount] = useState<string>('');
  const [customRate, setCustomRate] = useState<string>('');
  const [isAutoRate, setIsAutoRate] = useState(true);

  // Debounce ref for auto-save
  const debounceTimer = useRef<number>(null);
  const lastSavedParams = useRef<string>('');

  // Update foreign currency when source/target changes
  useEffect(() => {
    if (sourceCurrency !== Currency.MMK) {
      setForeignCurrency(sourceCurrency);
    } else if (targetCurrency !== Currency.MMK) {
      setForeignCurrency(targetCurrency);
    }
  }, [sourceCurrency, targetCurrency]);

  // Sync custom rate with auto rate when enabled
  useEffect(() => {
    if (isAutoRate && rates[foreignCurrency]) {
      setCustomRate(rates[foreignCurrency].toString());
    }
  }, [isAutoRate, rates, foreignCurrency]);

  const handleSwap = () => {
    setSourceCurrency(targetCurrency);
    setTargetCurrency(sourceCurrency);
  };

  const handleRateChange = (val: string) => {
    setCustomRate(val);
    setIsAutoRate(false);
  };

  // Calculation
  const calculateResult = () => {
    const numAmount = parseFloat(amount.replace(/,/g, ''));
    const numRate = parseFloat(customRate.replace(/,/g, ''));

    if (!numAmount || !numRate || isNaN(numAmount) || isNaN(numRate)) return null;

    let res = 0;
    // If Source is Foreign, Target is MMK => Multiply
    if (sourceCurrency !== Currency.MMK) {
      res = numAmount * numRate;
    } 
    // If Source is MMK, Target is Foreign => Divide
    else {
      res = numAmount / numRate;
    }
    return { numAmount, numRate, res };
  };

  const calculation = calculateResult();

  // Auto Save Logic
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (calculation && amount && customRate) {
      const currentParams = `${sourceCurrency}-${targetCurrency}-${amount}-${customRate}`;
      
      // Prevent duplicate saves of same calculation
      if (currentParams === lastSavedParams.current) return;

      debounceTimer.current = window.setTimeout(() => {
        const now = new Date();
        onSaveHistory({
          date: now.toLocaleDateString(),
          time: now.toLocaleTimeString(),
          from: sourceCurrency,
          to: targetCurrency,
          rate: calculation.numRate,
          amount: calculation.numAmount,
          result: calculation.res
        });
        lastSavedParams.current = currentParams;
      }, 2000); // 2 seconds debounce
    }

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [calculation, amount, customRate, sourceCurrency, targetCurrency, onSaveHistory]);

  const currencyOptions = [
    { value: Currency.MMK, label: 'Myanmar Kyat (MMK)' },
    { value: Currency.THB, label: 'Thai Baht (THB)' },
    { value: Currency.USD, label: 'US Dollar (USD)' },
    { value: Currency.MYR, label: 'Malaysian Ringgit (MYR)' },
    { value: Currency.SGD, label: 'Singapore Dollar (SGD)' },
    { value: Currency.CNY, label: 'Chinese Yuan (CNY)' },
    { value: Currency.EUR, label: 'Euro (EUR)' },
  ];

  const formatNumber = (num: number, decimals: number = 2) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(num);
  };

  return (
    <div className="bg-dark-card border border-dark-border rounded-3xl shadow-xl overflow-hidden">
      {/* Direction Selector */}
      <div className="bg-dark-surface p-6 border-b border-dark-border">
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">
          {getLabel(lang, 'direction')}
        </label>
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="w-full relative">
            <select
              value={sourceCurrency}
              onChange={(e) => {
                const val = e.target.value as Currency;
                setSourceCurrency(val);
                if (val === targetCurrency) {
                   setTargetCurrency(val === Currency.MMK ? Currency.USD : Currency.MMK);
                }
              }}
              className="w-full appearance-none bg-black border border-dark-border text-white py-4 pl-4 pr-10 rounded-xl focus:outline-none focus:border-brand-500 transition-colors text-lg font-medium"
            >
              {currencyOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.value}</option>
              ))}
            </select>
          </div>

          <button 
            onClick={handleSwap}
            className="p-3 rounded-full bg-dark-surface border border-dark-border hover:border-brand-500 hover:text-brand-500 text-gray-400 transition-all transform hover:rotate-180"
          >
            <ArrowRightLeft className="w-5 h-5" />
          </button>

          <div className="w-full relative">
            <select
              value={targetCurrency}
              onChange={(e) => {
                const val = e.target.value as Currency;
                setTargetCurrency(val);
                if (val === sourceCurrency) {
                  setSourceCurrency(val === Currency.MMK ? Currency.USD : Currency.MMK);
                }
              }}
              className="w-full appearance-none bg-black border border-dark-border text-white py-4 pl-4 pr-10 rounded-xl focus:outline-none focus:border-brand-500 transition-colors text-lg font-medium"
            >
              {currencyOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.value}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Rate Input */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-400">
              {getLabel(lang, 'rate')} <span className="text-brand-500">({foreignCurrency})</span>
            </label>
            <button 
              onClick={() => setIsAutoRate(!isAutoRate)}
              className="text-xs text-brand-500 hover:text-brand-400 font-medium"
            >
              {isAutoRate ? getLabel(lang, 'manualRate') : getLabel(lang, 'autoRate')}
            </button>
          </div>
          <input
            type="number"
            inputMode="decimal"
            value={customRate}
            onChange={(e) => handleRateChange(e.target.value)}
            placeholder={getLabel(lang, 'ratePlaceholder')}
            className={`w-full bg-black border-2 text-white py-3 px-4 rounded-xl focus:outline-none focus:ring-0 transition-all font-mono text-lg font-medium ${isAutoRate ? 'border-dark-border text-gray-400' : 'border-brand-500/50 focus:border-brand-500'}`}
          />
        </div>

        {/* Amount Input */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            {getLabel(lang, 'amount')} <span className="text-gray-500">({sourceCurrency})</span>
          </label>
          <input
            type="number"
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={getLabel(lang, 'amountPlaceholder')}
            className="w-full bg-black border-2 border-dark-border text-white py-3 px-4 rounded-xl focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all font-mono text-lg font-medium"
          />
        </div>

        {/* Result Display */}
        <div className="mt-6 pt-6 border-t border-dark-border">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-2">
             {getLabel(lang, 'result')}
          </span>
          <div className="flex items-baseline gap-3">
            <span className="text-4xl sm:text-5xl font-bold text-white tracking-tight break-all font-sans">
              {calculation ? formatNumber(calculation.res, targetCurrency === Currency.MMK ? 0 : 2) : '---'}
            </span>
            <span className="text-2xl text-brand-500 font-semibold">
              {targetCurrency}
            </span>
          </div>
          
          {calculation && (
            <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
              <span>{sourceCurrency === Currency.MMK ? '÷' : '×'} {formatNumber(calculation.numRate, 0)}</span>
              <ChevronsRight className="w-3 h-3" />
              <span>{getLabel(lang, 'calculation')}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
