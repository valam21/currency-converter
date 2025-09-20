// src/store/currencyStore.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Currency, FavoritePair, AppState } from '@/types/currency';
import { generateId } from '@/utils/helpers';

interface CurrencyState {
  // Currencies
  currencies: Currency[];
  selectedFrom: string;
  selectedTo: string;
  amount: string;
  
  // Favorites
  favorites: FavoritePair[];
  
  // App state
  appState: AppState;
  
  // Actions
  setCurrencies: (currencies: Currency[]) => void;
  setSelectedFrom: (currency: string) => void;
  setSelectedTo: (currency: string) => void;
  setAmount: (amount: string) => void;
  swapCurrencies: () => void;
  
  // Favorites actions
  addToFavorites: (from: string, to: string) => void;
  removeFromFavorites: (id: string) => void;
  isFavorite: (from: string, to: string) => boolean;
  
  // App state actions
  setOnlineStatus: (isOnline: boolean) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error?: string) => void;
  setLastUpdateTime: (time: string) => void;
}

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set, get) => ({
      // Initial state
      currencies: [],
      selectedFrom: 'USD',
      selectedTo: 'EUR',
      amount: '1',
      
      favorites: [],
      
      appState: {
        isOnline: true,
        isLoading: false,
      },
      
      // Currency actions
      setCurrencies: (currencies) => set({ currencies }),
      
      setSelectedFrom: (currency) => set({ selectedFrom: currency }),
      
      setSelectedTo: (currency) => set({ selectedTo: currency }),
      
      setAmount: (amount) => set({ amount }),
      
      swapCurrencies: () => set((state) => ({
        selectedFrom: state.selectedTo,
        selectedTo: state.selectedFrom,
      })),
      
      // Favorites actions
      addToFavorites: (from, to) => set((state) => {
        // Check if already exists
        const exists = state.favorites.some(
          fav => fav.from === from && fav.to === to
        );
        
        if (exists || state.favorites.length >= 10) return state;
        
        const newFavorite: FavoritePair = {
          id: generateId(),
          from,
          to,
          createdAt: new Date().toISOString(),
        };
        
        return {
          favorites: [...state.favorites, newFavorite],
        };
      }),
      
      removeFromFavorites: (id) => set((state) => ({
        favorites: state.favorites.filter(fav => fav.id !== id),
      })),
      
      isFavorite: (from, to) => {
        const state = get();
        return state.favorites.some(
          fav => fav.from === from && fav.to === to
        );
      },
      
      // App state actions
      setOnlineStatus: (isOnline) => set((state) => ({
        appState: { ...state.appState, isOnline },
      })),
      
      setLoading: (isLoading) => set((state) => ({
        appState: { ...state.appState, isLoading },
      })),
      
      setError: (error) => set((state) => ({
        appState: { ...state.appState, error },
      })),
      
      setLastUpdateTime: (time) => set((state) => ({
        appState: { ...state.appState, lastUpdateTime: time },
      })),
    }),
    {
      name: 'currency-converter-storage',
      partialize: (state) => ({
        selectedFrom: state.selectedFrom,
        selectedTo: state.selectedTo,
        amount: state.amount,
        favorites: state.favorites,
      }),
    }
  )
);

// Rate cache store (separate from persisted state)
interface RateState {
  rates: Record<string, { rate: number; timestamp: number }>;
  historicalData: Record<string, Array<{ date: string; rate: number }>>;
  
  setRate: (from: string, to: string, rate: number) => void;
  getRate: (from: string, to: string) => number | null;
  setHistoricalData: (pair: string, data: Array<{ date: string; rate: number }>) => void;
  getHistoricalData: (pair: string) => Array<{ date: string; rate: number }> | null;
  clearExpiredRates: () => void;
}

export const useRateStore = create<RateState>((set, get) => ({
  rates: {},
  historicalData: {},
  
  setRate: (from, to, rate) => set((state) => ({
    rates: {
      ...state.rates,
      [`${from}_${to}`]: {
        rate,
        timestamp: Date.now(),
      },
    },
  })),
  
  getRate: (from, to) => {
    const state = get();
    const key = `${from}_${to}`;
    const cached = state.rates[key];
    
    if (!cached) return null;
    
    // Check if rate is still valid (15 minutes)
    const now = Date.now();
    const age = now - cached.timestamp;
    const maxAge = 15 * 60 * 1000; // 15 minutes
    
    if (age > maxAge) {
      // Remove expired rate
      set((state) => {
        const newRates = { ...state.rates };
        delete newRates[key];
        return { rates: newRates };
      });
      return null;
    }
    
    return cached.rate;
  },
  
  setHistoricalData: (pair, data) => set((state) => ({
    historicalData: {
      ...state.historicalData,
      [pair]: data,
    },
  })),
  
  getHistoricalData: (pair) => {
    const state = get();
    return state.historicalData[pair] || null;
  },
  
  clearExpiredRates: () => set((state) => {
    const now = Date.now();
    const maxAge = 15 * 60 * 1000; // 15 minutes
    const validRates: Record<string, { rate: number; timestamp: number }> = {};
    
    Object.entries(state.rates).forEach(([key, value]) => {
      if (now - value.timestamp <= maxAge) {
        validRates[key] = value;
      }
    });
    
    return { rates: validRates };
  }),
}));