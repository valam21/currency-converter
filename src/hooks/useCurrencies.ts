// src/hooks/useCurrencies.ts

import { useState, useEffect } from 'react';
import { Currency, ApiResponse } from '@/types/currency';
import { useCurrencyStore } from '@/store/currencyStore';

export const useCurrencies = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { currencies, setCurrencies } = useCurrencyStore();

  const fetchCurrencies = async () => {
    if (currencies.length > 0) return; // Already loaded

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/currencies');
      const result: ApiResponse<Currency[]> = await response.json();

      if (result.success && result.data) {
        setCurrencies(result.data);
      } else {
        throw new Error(result.error || 'Failed to fetch currencies');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error fetching currencies:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrencies();
  }, []);

  return {
    currencies,
    loading,
    error,
    refetch: fetchCurrencies,
  };
};
