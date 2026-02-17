'use client';

import { CRYPTO_LIST } from '@/lib/types';
import { ChevronDown } from 'lucide-react';

interface CryptoSelectorProps {
  selectedCrypto: string;
  onSelect: (cryptoId: string) => void;
  disabled?: boolean;
}

export default function CryptoSelector({ selectedCrypto, onSelect, disabled }: CryptoSelectorProps) {
  return (
    <div className="relative">
      <select
        value={selectedCrypto}
        onChange={(e) => onSelect(e.target.value)}
        disabled={disabled}
        className="appearance-none rounded-xl px-4 py-3 pr-10 text-white font-semibold
                   bg-dark-400/90 border border-dark-100 hover:border-primary-500/70 focus:border-primary-500
                   focus:outline-none focus:ring-2 focus:ring-primary-500/40 shadow-sm
                   transition-all duration-200 cursor-pointer min-w-[200px]
                   disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {CRYPTO_LIST.map((crypto) => (
          <option key={crypto.id} value={crypto.id} className="bg-dark-300 text-white">
            {crypto.symbol} - {crypto.name}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
    </div>
  );
}
