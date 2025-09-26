// src/app/components/ui/CurrencySelector.tsx

'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { Currency } from '@/types/currency';
import { getCurrencyFlag } from '@/utils/helpers';

interface CurrencySelectorProps {
  currencies: Currency[];
  selected: string;
  onSelect: (currency: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function CurrencySelector({
  currencies,
  selected,
  onSelect,
  placeholder = 'Select currency',
  disabled = false,
}: CurrencySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const selectedCurrency = currencies.find(c => c.code === selected);
  
  const filteredCurrencies = currencies.filter(currency =>
    currency.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    currency.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [isOpen]);

  const handleSelect = (currencyCode: string) => {
    onSelect(currencyCode);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full flex items-center justify-between p-3 border border-gray-300 rounded-lg 
          bg-white hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary 
          focus:border-transparent transition-colors
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        <div className="flex items-center space-x-3">
          {selectedCurrency ? (
            <>
              <img
                src={getCurrencyFlag(selected)}
                alt={`${selected} flag`}
                className="w-6 h-4 object-cover rounded"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <div className="flex items-center space-x-2">
                <span className="font-mono font-semibold text-gray-900">
                  {selected}
                </span>
                <span className="text-gray-500 truncate">
                  {selectedCurrency.name}
                </span>
              </div>
            </>
          ) : (
            <span className="text-gray-500">{placeholder}</span>
          )}
        </div>
        <ChevronDown
          className={`w-5 h-5 text-gray-400 transition-transform ${
            isOpen ? 'transform rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-hidden">
          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                ref={searchRef}
                type="text"
                placeholder="Search currencies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="max-h-60 overflow-y-auto">
            {filteredCurrencies.length > 0 ? (
              filteredCurrencies.map((currency) => (
                <button
                  key={currency.code}
                  onClick={() => handleSelect(currency.code)}
                  className={`
                    w-full flex items-center space-x-3 p-3 hover:bg-gray-50 
                    transition-colors text-left
                    ${currency.code === selected ? 'bg-primary/10 border-r-2 border-primary' : ''}
                  `}
                >
                  <img
                    src={getCurrencyFlag(currency.code)}
                    alt={`${currency.code} flag`}
                    className="w-6 h-4 object-cover rounded"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-semibold text-gray-900">
                        {currency.code}
                      </span>
                      <span className="text-gray-500 truncate">
                        {currency.name}
                      </span>
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">
                No currencies found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}



