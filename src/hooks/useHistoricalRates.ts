// src/hooks/useHistoricalRates.ts

import { useState, useEffect } from 'react';
import { HistoricalRate } from '@/types/currency';
import { useRateStore } from '@/store/currencyStore';

export const useHistoricalRates = (from: string, to: string, days: number = 7) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<HistoricalRate[]>([]);
  
  const { getHistoricalData, setHistoricalData } = useRateStore();

  const fetchHistoricalRates = async () => {
    if (!from || !to || from === to) return;

    const cacheKey = `${from}_${to}_${days}`;
    
    // Check cache first
    const cachedData = getHistoricalData(cacheKey);
    if (cachedData) {
      setData(cachedData);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/history?from=${from}&to=${to}&days=${days}`);
      const result = await response.json();

      if (result.success && result.data) {
        const historicalRates = result.data.rates;
        setData(historicalRates);
        
        // Cache the data
        setHistoricalData(cacheKey, historicalRates);
      } else {
        throw new Error(result.error || 'Failed to fetch historical data');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error fetching historical rates:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistoricalRates();
  }, [from, to, days]);

  return {
    data,
    loading,
    error,
    refetch: fetchHistoricalRates,
  };
};
