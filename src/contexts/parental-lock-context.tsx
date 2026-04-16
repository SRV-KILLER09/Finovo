
"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of the context data
interface ParentalLockContextType {
  parentalPin: string | null;
  setParentalPin: (pin: string | null) => void;
  isUnlocked: boolean;
  setIsUnlocked: (unlocked: boolean) => void;
  enabledFeatures: Record<string, boolean>;
  setEnabledFeatures: (features: React.SetStateAction<Record<string, boolean>>) => void;
}

// Create the context with a default value
const ParentalLockContext = createContext<ParentalLockContextType | undefined>(undefined);

// Create a provider component
export const ParentalLockProvider = ({ children }: { children: ReactNode }) => {
  const [parentalPin, setParentalPin] = useState<string | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [enabledFeatures, setEnabledFeatures] = useState<Record<string, boolean>>({
    dashboard: true,
    pay: true,
    'bill-splitter': true,
    reports: true,
    'itr-filing': true,
    digigold: true,
    digibitcoin: true,
    digistock: true,
    'bank-simulator': true,
    'scam-hunter': true,
    'policy-challenges': true,
    developer: true,
    settings: true,
  });

  const value = {
    parentalPin,
    setParentalPin,
    isUnlocked,
    setIsUnlocked,
    enabledFeatures,
    setEnabledFeatures,
  };

  return (
    <ParentalLockContext.Provider value={value}>
      {children}
    </ParentalLockContext.Provider>
  );
};

// Create a custom hook to use the context
export const useParentalLock = () => {
  const context = useContext(ParentalLockContext);
  if (context === undefined) {
    throw new Error('useParentalLock must be used within a ParentalLockProvider');
  }
  return context;
};
