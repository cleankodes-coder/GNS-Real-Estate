import React, { createContext, useContext, useState, useEffect } from 'react';
import { Currency, Unit } from '../types/property';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  unit: Unit;
  setUnit: (u: Unit) => void;
  convertPrice: (priceUSD: number) => number;
  formatPrice: (priceUSD: number, compact?: boolean) => string;
  formatArea: (areaSqFt: number) => string;
  currencySymbol: string;
}

const RATES: Record<Currency, number> = {
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.79,
  AED: 3.6725,
  JPY: 154.5,
};

const SYMBOLS: Record<Currency, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  AED: 'AED ',
  JPY: '¥',
};

const SQFT_TO_SQM = 0.092903;

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<Currency>(() => {
    return (localStorage.getItem('gns_currency') as Currency) || 'USD';
  });

  const [unit, setUnitState] = useState<Unit>(() => {
    return (localStorage.getItem('gns_unit') as Unit) || 'sqft';
  });

  useEffect(() => {
    localStorage.setItem('gns_currency', currency);
  }, [currency]);

  useEffect(() => {
    localStorage.setItem('gns_unit', unit);
  }, [unit]);

  const setCurrency = (c: Currency) => setCurrencyState(c);
  const setUnit = (u: Unit) => setUnitState(u);

  const convertPrice = (priceUSD: number): number => {
    return priceUSD * (RATES[currency] || 1);
  };

  const formatPrice = (priceUSD: number, compact = false): string => {
    const converted = convertPrice(priceUSD);
    const symbol = SYMBOLS[currency];

    if (compact) {
      if (converted >= 1_000_000) {
        return `${symbol}${(converted / 1_000_000).toFixed(1)}M`;
      }
      if (converted >= 1_000) {
        return `${symbol}${(converted / 1_000).toFixed(0)}K`;
      }
      return `${symbol}${Math.round(converted).toLocaleString()}`;
    }

    // Full formatted currency
    const formattedNum = Math.round(converted).toLocaleString('en-US');
    return `${symbol}${formattedNum}`;
  };

  const formatArea = (areaSqFt: number): string => {
    if (unit === 'sqm') {
      const sqM = Math.round(areaSqFt * SQFT_TO_SQM);
      return `${sqM.toLocaleString()} m²`;
    }
    return `${areaSqFt.toLocaleString()} sq ft`;
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        unit,
        setUnit,
        convertPrice,
        formatPrice,
        formatArea,
        currencySymbol: SYMBOLS[currency],
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
