// src/hooks/useKeyboardShortcuts.ts

import { useEffect } from 'react';
import { useCurrencyStore } from '@/store/currencyStore';

export const useKeyboardShortcuts = () => {
  const { swapCurrencies, setAmount } = useCurrencyStore();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl/Cmd + Shift + S to swap currencies
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'S') {
        event.preventDefault();
        swapCurrencies();
      }

      // Ctrl/Cmd + Shift + C to clear amount
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'C') {
        event.preventDefault();
        setAmount('');
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [swapCurrencies, setAmount]);
};