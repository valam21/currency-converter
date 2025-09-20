// src/hooks/useRates.ts

import { useState, useEffect, useCallback } from 'react';
import { useCurrencyStore } from '@/store/currencyStore';
import { useRateStore } from '@/store/currencyStore';
import { debounce } from '@/utils/helpers';

export const useRates = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rate, setRate] = useState<number | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const { selectedFrom, selectedTo, amount } = useCurrencyStore();
  const { getRate, setRate: cacheRate } = useRateStore();
  const { setError: setGlobalError, setLastUpdateTime } = useCurrencyStore();

  const fetchRate = async (from: string, to: string) => {
    // Check cache first
    const cachedRate = getRate(from, to);
    if (cachedRate !== null) {
      setRate(cachedRate);
      return cachedRate;
    }

    setLoading(true);
    setError(null);
    setGlobalError(undefined);

    try {
      const response = await fetch(`/api/rates?from=${from}&to=${to}`);
      const result = await response.json();

      if (result.success && result.data) {
        const fetchedRate = result.data.rate;
        setRate(fetchedRate);
        setLastUpdated(result.data.lastUpdated);
        
        // Cache the rate
        cacheRate(from, to, fetchedRate);
        
        // Update global state
        setLastUpdateTime(result.data.lastUpdated);
        
        return fetchedRate;
      } else {
        throw new Error(result.error || 'Failed to fetch rate');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      setGlobalError(errorMessage);
      console.error('Error fetching rate:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Debounced fetch function
  const debouncedFetch = useCallback(
    debounce((from: string, to: string) => {
      if (from && to && from !== to) {
        fetchRate(from, to);
      }
    }, 500),
    []
  );

  useEffect(() => {
    if (selectedFrom && selectedTo && selectedFrom !== selectedTo) {
      debouncedFetch(selectedFrom, selectedTo);
    }
  }, [selectedFrom, selectedTo, debouncedFetch]);

  const convertedAmount = rate && amount ? parseFloat(amount) * rate : null;

  return {
    rate,
    convertedAmount,
    loading,
    error,
    lastUpdated,
    refetch: () => fetchRate(selectedFrom, selectedTo),
  };
};
