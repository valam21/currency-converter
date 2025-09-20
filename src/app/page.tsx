// src/app/page.tsx

import { Suspense } from 'react';
import CurrencyConverter from './components/CurrencyConverter';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Currency Converter - Real-time Exchange Rates',
  description: 'Convert currencies with real-time exchange rates. Support for 50+ major currencies with historical charts and favorite pairs.',
};

// Loading component for the main converter
function ConverterSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="animate-pulse space-y-6">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
              </div>
              <div className="flex justify-center">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded mb-4"></div>
              <div className="space-y-3">
                <div className="h-12 bg-gray-200 rounded"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<ConverterSkeleton />}>
      <CurrencyConverter />
    </Suspense>
  );
}
