import { Language } from './types';

export const translations = {
  en: {
    appTitle: 'Currency Exchange',
    dashboard: 'Live Rates',
    converter: 'Converter',
    history: 'History',
    direction: 'Exchange Direction',
    amount: 'Amount',
    rate: 'Market Rate',
    ratePlaceholder: 'Enter Rate',
    amountPlaceholder: 'Enter Amount',
    result: 'Result',
    clearHistory: 'Clear History',
    emptyHistory: 'No history yet.',
    autoRate: 'Auto Rate',
    manualRate: 'Manual Rate',
    lastUpdated: 'Last updated:',
    source: 'From',
    target: 'To',
    reset: 'Reset',
    calculation: 'Calculation',
  },
  mm: {
    appTitle: 'ငွေလဲနှုန်း တွက်ချက်စက်',
    dashboard: 'ပေါက်ဈေးများ',
    converter: 'ငွေလဲရန်',
    history: 'မှတ်တမ်း',
    direction: 'ပြောင်းမည့်ငွေကြေး',
    amount: 'ပမာဏ',
    rate: 'ပေါက်ဈေး',
    ratePlaceholder: 'ပေါက်ဈေးထည့်ပါ',
    amountPlaceholder: 'ပမာဏထည့်ပါ',
    result: 'ရလဒ်',
    clearHistory: 'မှတ်တမ်းဖျက်မည်',
    emptyHistory: 'မှတ်တမ်း မရှိသေးပါ။',
    autoRate: 'အော်တိုဈေးနှုန်း',
    manualRate: 'ကိုယ့်စိတ်ကြိုက်ဈေး',
    lastUpdated: 'နောက်ဆုံးချိန်ညှိ:',
    source: 'မှ',
    target: 'သို့',
    reset: 'ပြန်လည်စတင်',
    calculation: 'တွက်ချက်မှု',
  }
};

export const getLabel = (lang: Language, key: keyof typeof translations['en']) => {
  return translations[lang][key];
};
