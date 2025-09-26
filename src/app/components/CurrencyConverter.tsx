// src/app/components/CurrencyConverter.tsx

'use client';

import { useEffect } from 'react';
import { ArrowRightLeft, RefreshCw, Heart, Share2 } from 'lucide-react';
import { useCurrencies } from '@/hooks/useCurrencies';
import { useRates } from '@/hooks/useRates';
import { useHistoricalRates } from '@/hooks/useHistoricalRates';
import { useFavorites } from '@/hooks/useFavorites';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useCurrencyStore } from '@/store/currencyStore';
import CurrencySelector from './ui/CurrencySelector';
import AmountInput from './ui/AmountInput';
import ConversionResult from './ui/ConversionResult';
import RateChart from './ui/RateChart';
import FavoritesList from './ui/FavoritesList';

export default function CurrencyConverter() {
  const {
    selectedFrom,
    selectedTo,
    amount,
    setSelectedFrom,
    setSelectedTo,
    setAmount,
    swapCurrencies,
    setLoading: setGlobalLoading,
  } = useCurrencyStore();

  const { currencies, loading: currenciesLoading } = useCurrencies();
  const { rate, convertedAmount, loading: ratesLoading, lastUpdated, refetch } = useRates();
  const { data: historicalData, loading: historyLoading } = useHistoricalRates(selectedFrom, selectedTo, 7);
  const { isFavorite, toggleFavorite } = useFavorites();

  // Enable keyboard shortcuts
  useKeyboardShortcuts();

  useEffect(() => {
    setGlobalLoading(currenciesLoading || ratesLoading);
  }, [currenciesLoading, ratesLoading, setGlobalLoading]);

  const fromCurrency = currencies.find(c => c.code === selectedFrom);
  const toCurrency = currencies.find(c => c.code === selectedTo);

  const handleShare = async () => {
    const url = `${window.location.origin}?from=${selectedFrom}&to=${selectedTo}&amount=${amount}`;
    const text = `${amount} ${selectedFrom} = ${convertedAmount?.toFixed(4)} ${selectedTo}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Currency Conversion',
          text: text,
          url: url,
        });
      } catch (error) {
        // Fallback to clipboard
        await navigator.clipboard.writeText(`${text}\n${url}`);
      }
    } else {
      // Fallback to clipboard
      await navigator.clipboard.writeText(`${text}\n${url}`);
    }
  };

  const isValidConversion = amount && parseFloat(amount) > 0 && rate && convertedAmount;

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main conversion panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Currency conversion card */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="space-y-6">
                {/* From currency */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    From
                  </label>
                  <CurrencySelector
                    currencies={currencies}
                    selected={selectedFrom}
                    onSelect={setSelectedFrom}
                    disabled={currenciesLoading}
                  />
                </div>

                {/* Swap button */}
                <div className="flex justify-center">
                  <button
                    onClick={swapCurrencies}
                    disabled={currenciesLoading || ratesLoading}
                    className="p-3 bg-primary text-white rounded-full hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Swap currencies (Ctrl+Shift+S)"
                  >
                    <ArrowRightLeft className="w-5 h-5" />
                  </button>
                </div>

                {/* To currency */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    To
                  </label>
                  <CurrencySelector
                    currencies={currencies}
                    selected={selectedTo}
                    onSelect={setSelectedTo}
                    disabled={currenciesLoading}
                  />
                </div>

                {/* Amount input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount
                  </label>
                  <AmountInput
                    value={amount}
                    onChange={setAmount}
                    currency={selectedFrom}
                    disabled={currenciesLoading || ratesLoading}
                  />
                </div>

                {/* Action buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    {/* Refresh button */}
                    <button
                      onClick={refetch}
                      disabled={ratesLoading}
                      className="flex items-center space-x-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Refresh rates"
                    >
                      <RefreshCw className={`w-4 h-4 ${ratesLoading ? 'animate-spin' : ''}`} />
                      <span>Refresh</span>
                    </button>

                    {/* Add to favorites */}
                    <button
                      onClick={() => toggleFavorite(selectedFrom, selectedTo)}
                      className={`flex items-center space-x-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                        isFavorite(selectedFrom, selectedTo)
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                      title={isFavorite(selectedFrom, selectedTo) ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      <Heart 
                        className={`w-4 h-4 ${
                          isFavorite(selectedFrom, selectedTo) ? 'fill-current' : ''
                        }`} 
                      />
                      <span>
                        {isFavorite(selectedFrom, selectedTo) ? 'Favorited' : 'Favorite'}
                      </span>
                    </button>
                  </div>

                  {/* Share button */}
                  {isValidConversion && (
                    <button
                      onClick={handleShare}
                      className="flex items-center space-x-2 px-3 py-2 text-sm bg-primary text-white hover:bg-primary/90 rounded-lg transition-colors"
                      title="Share conversion"
                    >
                      <Share2 className="w-4 h-4" />
                      <span className="hidden sm:inline">Share</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Conversion result */}
            {isValidConversion && fromCurrency && toCurrency && (
              <ConversionResult
                amount={parseFloat(amount)}
                from={fromCurrency}
                to={toCurrency}
                result={convertedAmount}
                rate={rate}
                lastUpdated={lastUpdated || undefined}
                loading={ratesLoading}
              />
            )}

            {/* Rate chart */}
            {selectedFrom && selectedTo && selectedFrom !== selectedTo && (
              <RateChart
                data={historicalData}
                from={selectedFrom}
                to={selectedTo}
                loading={historyLoading}
              />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Favorites list */}
            <FavoritesList />

            {/* Quick tips */}
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-4">
                Quick Tips
              </h3>
              <div className="space-y-3 text-sm text-blue-800">
                <div>
                  <strong>Keyboard shortcuts:</strong>
                </div>
                <ul className="space-y-1 ml-4">
                  <li>• Ctrl+Shift+S: Swap currencies</li>
                  <li>• Ctrl+Shift+C: Clear amount</li>
                </ul>
                <div className="pt-2">
                  <strong>Features:</strong>
                </div>
                <ul className="space-y-1 ml-4">
                  <li>• Save up to 10 favorite pairs</li>
                  <li>• View 7-day rate history</li>
                  <li>• Share conversions easily</li>
                  <li>• Works offline with cached data</li>
                </ul>
              </div>
            </div>

            {/* Rate info */}
            {rate && (
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Exchange Rate Info
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Current Rate:</span>
                    <span className="font-mono font-semibold">
                      1 {selectedFrom} = {rate.toFixed(4)} {selectedTo}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Reverse Rate:</span>
                    <span className="font-mono font-semibold">
                      1 {selectedTo} = {(1 / rate).toFixed(4)} {selectedFrom}
                    </span>
                  </div>
                  {lastUpdated && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Updated:</span>
                      <span className="text-gray-900">
                        {new Date(lastUpdated).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}


