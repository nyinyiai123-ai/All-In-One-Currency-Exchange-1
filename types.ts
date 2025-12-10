export enum Currency {
  MMK = 'MMK',
  USD = 'USD',
  THB = 'THB',
  MYR = 'MYR',
  SGD = 'SGD',
  CNY = 'CNY',
  EUR = 'EUR',
}

export type Language = 'en' | 'mm';

export interface HistoryItem {
  id: string;
  date: string;
  time: string;
  from: Currency;
  to: Currency;
  rate: number;
  amount: number;
  result: number;
}

export interface ExchangeRate {
  currency: Currency;
  buy: number; // Market rate (Foreign -> MMK)
  sell: number; // Market rate (MMK -> Foreign), often same as buy in simple apps, but can differ. We will use one rate for simplicity as per requirements.
}

export const CURRENCIES = [
  Currency.THB,
  Currency.USD,
  Currency.MYR,
  Currency.SGD,
  Currency.CNY,
  Currency.EUR,
];
