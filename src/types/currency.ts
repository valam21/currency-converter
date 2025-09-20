// src/types/currency.ts

export interface Currency {
  code: string;
  name: string;
  symbol?: string;
  flag?: string;
}

export interface ExchangeRate {
  from: string;
  to: string;
  rate: number;
  lastUpdated: string;
}

export interface ConversionResult {
  amount: number;
  from: Currency;
  to: Currency;
  result: number;
  rate: number;
  lastUpdated: string;
}

export interface HistoricalRate {
  date: string;
  rate: number;
}

export interface FavoritePair {
  id: string;
  from: string;
  to: string;
  name?: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: number;
}

export interface CurrencyRateResponse {
  base: string;
  rates: Record<string, number>;
  timestamp: number;
}

export interface HistoricalDataResponse {
  base: string;
  start_date: string;
  end_date: string;
  rates: Record<string, Record<string, number>>;
}

export interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

export interface AppState {
  isOnline: boolean;
  isLoading: boolean;
  error?: string;
  lastUpdateTime?: string;
}