// src/app/components/ui/AmountInput.tsx

'use client';

import { useState, useEffect } from 'react';
import { DollarSign } from 'lucide-react';
import { sanitizeAmount, isValidAmount } from '@/utils/helpers';

interface AmountInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  currency?: string;
}

export default function AmountInput({
  value,
  onChange,
  placeholder = '0.00',
  disabled = false,
  currency,
}: AmountInputProps) {
  const [localValue, setLocalValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const sanitized = sanitizeAmount(inputValue);
    
    setLocalValue(sanitized);
    onChange(sanitized);
  };

  const handleBlur = () => {
    setIsFocused(false);
    
    // Format the number on blur if valid
    if (localValue && isValidAmount(localValue)) {
      const formatted = parseFloat(localValue).toString();
      setLocalValue(formatted);
      onChange(formatted);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const isValid = !localValue || isValidAmount(localValue);

  return (
    <div className="relative">
      <div
        className={`
          flex items-center border rounded-lg bg-white transition-colors
          ${isFocused ? 'border-primary ring-2 ring-primary/20' : 'border-gray-300'}
          ${!isValid ? 'border-error ring-2 ring-error/20' : ''}
          ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''}
        `}
      >
        <div className="flex items-center pl-4 pr-2 text-gray-500">
          <DollarSign className="w-5 h-5" />
        </div>
        
        <input
          type="text"
          value={localValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            flex-1 py-3 pr-4 text-xl font-mono font-semibold
            bg-transparent border-none outline-none
            ${disabled ? 'cursor-not-allowed' : ''}
          `}
          inputMode="decimal"
          autoComplete="off"
        />
        
        {currency && (
          <div className="px-3 py-2 text-sm font-medium text-gray-500 border-l border-gray-200">
            {currency}
          </div>
        )}
      </div>
      
      {!isValid && localValue && (
        <div className="mt-1 text-sm text-error">
          Please enter a valid amount
        </div>
      )}
    </div>
  );
}
