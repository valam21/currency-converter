// src/app/components/Header.tsx

'use client';

import { useState } from 'react';
import { TrendingUp, Wifi, WifiOff, Clock, AlertCircle } from 'lucide-react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useCurrencyStore } from '@/store/currencyStore';
import { getTimeAgo } from '@/utils/helpers';

export default function Header() {
  const isOnline = useOnlineStatus();
  const { appState } = useCurrencyStore();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and title */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Currency Converter
              </h1>
              <p className="text-xs text-gray-500 hidden sm:block">
                Real-time exchange rates
              </p>
            </div>
          </div>

          {/* Status indicators */}
          <div className="flex items-center space-x-4">
            {/* Last update time */}
            {appState.lastUpdateTime && (
              <div className="hidden sm:flex items-center space-x-1 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                <span>
                  Updated {getTimeAgo(appState.lastUpdateTime)}
                </span>
              </div>
            )}

            {/* Error indicator */}
            {appState.error && (
              <div className="flex items-center space-x-1 px-2 py-1 bg-error/10 text-error rounded-full text-xs">
                <AlertCircle className="w-3 h-3" />
                <span className="hidden sm:inline">Error</span>
              </div>
            )}

            {/* Online/Offline status */}
            <div className="flex items-center space-x-2">
              {isOnline ? (
                <div className="flex items-center space-x-1 text-success">
                  <Wifi className="w-4 h-4" />
                  <span className="text-xs hidden sm:inline">Online</span>
                </div>
              ) : (
                <div className="flex items-center space-x-1 px-2 py-1 bg-error/10 text-error rounded-full">
                  <WifiOff className="w-4 h-4" />
                  <span className="text-xs">Offline</span>
                </div>
              )}
            </div>

            {/* Loading indicator */}
            {appState.isLoading && (
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            )}
          </div>
        </div>
      </div>

      {/* Offline banner */}
      {!isOnline && (
        <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-2">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center space-x-2 text-yellow-800 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>
                You're offline. Showing last cached exchange rates.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Error banner */}
      {appState.error && (
        <div className="bg-red-50 border-b border-red-200 px-4 py-2">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center space-x-2 text-red-800 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>
                {appState.error} - Showing cached data if available.
              </span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}