// src/app/components/ui/ConversionResult.tsx

'use client';

import { Copy, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { formatCurrency, formatNumber } from '@/utils/helpers';
import { Currency } from '@/types/currency';

interface ConversionResultProps {
  amount: number;
  from: Currency;
  to: Currency;
  result: number;
  rate: number;
  lastUpdated?: string; // Changé de string | null à string | undefined
  loading?: boolean;
}

export default function ConversionResult({
  amount,
  from,
  to,
  result,
  rate,
  lastUpdated,
  loading = false,
}: ConversionResultProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const text = `${formatNumber(amount)} ${from.code} = ${formatNumber(result)} ${to.code}`;
    
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-6 border border-primary/20">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-6 border border-primary/20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Conversion Result
        </h3>
        
        <button
          onClick={handleCopy}
          className="flex items-center space-x-2 px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          {copied ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-success" />
              <span className="text-success">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      <div className="space-y-3">
        <div className="text-3xl font-mono font-bold text-gray-900">
          <span className="text-xl text-gray-600">
            {formatNumber(amount)} {from.code}
          </span>
          <span className="mx-3 text-gray-400">=</span>
          <span className="text-primary">
            {formatNumber(result)} {to.code}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600">
          <div>
            <span>Exchange rate: </span>
            <span className="font-mono font-semibold">
              1 {from.code} = {formatNumber(rate)} {to.code}
            </span>
          </div>
          
          {lastUpdated && (
            <div className="text-right">
              <div>Last updated:</div>
              <div className="font-medium">
                {new Date(lastUpdated).toLocaleTimeString()}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}