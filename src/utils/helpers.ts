// src/utils/helpers.ts

import { Currency, CacheItem } from '@/types/currency';

export const formatCurrency = (
  amount: number,
  currency: string,
  locale: string = 'en-US'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(amount);
};

export const formatNumber = (
  number: number,
  decimals: number = 4
): string => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: decimals,
  }).format(number);
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export const isValidAmount = (value: string): boolean => {
  const number = parseFloat(value);
  return !isNaN(number) && number > 0;
};

export const sanitizeAmount = (value: string): string => {
  // Remove all non-numeric characters except decimal point
  const cleaned = value.replace(/[^0-9.]/g, '');
  
  // Ensure only one decimal point
  const parts = cleaned.split('.');
  if (parts.length > 2) {
    return parts[0] + '.' + parts.slice(1).join('');
  }
  
  return cleaned;
};

export const getCurrencyFlag = (currencyCode: string): string => {
  const countryMapping: Record<string, string> = {
    'USD': 'us',
    'EUR': 'eu',
    'GBP': 'gb',
    'JPY': 'jp',
    'AUD': 'au',
    'CAD': 'ca',
    'CHF': 'ch',
    'CNY': 'cn',
    'SEK': 'se',
    'NZD': 'nz',
    'MXN': 'mx',
    'SGD': 'sg',
    'HKD': 'hk',
    'NOK': 'no',
    'KRW': 'kr',
    'TRY': 'tr',
    'RUB': 'ru',
    'INR': 'in',
    'BRL': 'br',
    'ZAR': 'za',
    'PLN': 'pl',
    'CZK': 'cz',
    'DKK': 'dk',
    'HUF': 'hu',
    'ILS': 'il',
    'CLP': 'cl',
    'PHP': 'ph',
    'AED': 'ae',
    'COP': 'co',
    'SAR': 'sa',
    'MYR': 'my',
    'RON': 'ro',
    'THB': 'th',
    'BGN': 'bg',
    'HRK': 'hr',
    'ISK': 'is',
    'PKR': 'pk',
    'EGP': 'eg',
    'QAR': 'qa',
    'KWD': 'kw',
    'BHD': 'bh',
    'OMR': 'om',
    'JOD': 'jo',
    'LBP': 'lb',
    'TND': 'tn',
    'DZD': 'dz',
    'MAD': 'ma',
    'XOF': 'bf', // West African CFA franc
    'XAF': 'cm', // Central African CFA franc
  };
  
  const countryCode = countryMapping[currencyCode.toUpperCase()];
  return countryCode ? `https://flagcdn.com/24x18/${countryCode}.png` : '';
};

export const calculatePercentageChange = (
  current: number,
  previous: number
): number => {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
};

export const getTimeAgo = (timestamp: string): string => {
  const now = new Date();
  const past = new Date(timestamp);
  const diffMs = now.getTime() - past.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return past.toLocaleDateString();
};

export const isOnline = (): boolean => {
  return typeof navigator !== 'undefined' ? navigator.onLine : true;
};

// Cache utilities
export const createCacheItem = <T>(
  data: T,
  expirationMinutes: number = 15
): CacheItem<T> => {
  const now = Date.now();
  return {
    data,
    timestamp: now,
    expiresAt: now + (expirationMinutes * 60 * 1000),
  };
};

export const isCacheValid = <T>(cacheItem: CacheItem<T>): boolean => {
  return Date.now() < cacheItem.expiresAt;
};

export const getFromCache = <T>(key: string): T | null => {
  try {
    const cached = localStorage.getItem(key);
    if (!cached) return null;
    
    const cacheItem: CacheItem<T> = JSON.parse(cached);
    if (!isCacheValid(cacheItem)) {
      localStorage.removeItem(key);
      return null;
    }
    
    return cacheItem.data;
  } catch {
    return null;
  }
};

export const setToCache = <T>(
  key: string,
  data: T,
  expirationMinutes: number = 15
): void => {
  try {
    const cacheItem = createCacheItem(data, expirationMinutes);
    localStorage.setItem(key, JSON.stringify(cacheItem));
  } catch {
    // Ignore cache errors
  }
};

export const clearExpiredCache = (): void => {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('currency_')) {
        try {
          const cached = localStorage.getItem(key);
          if (cached) {
            const cacheItem = JSON.parse(cached);
            if (!isCacheValid(cacheItem)) {
              localStorage.removeItem(key);
            }
          }
        } catch {
          localStorage.removeItem(key);
        }
      }
    });
  } catch {
    // Ignore cleanup errors
  }
};