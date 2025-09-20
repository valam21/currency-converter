// src/hooks/useOnlineStatus.ts

import { useState, useEffect } from 'react';
import { useCurrencyStore } from '@/store/currencyStore';

export const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(true);
  const { setOnlineStatus } = useCurrencyStore();

  useEffect(() => {
    const updateOnlineStatus = () => {
      const online = navigator.onLine;
      setIsOnline(online);
      setOnlineStatus(online);
    };

    // Set initial status
    updateOnlineStatus();

    // Listen for online/offline events
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, [setOnlineStatus]);

  return isOnline;
};
