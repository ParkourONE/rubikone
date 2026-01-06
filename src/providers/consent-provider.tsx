"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

// Consent categories
export interface ConsentPreferences {
  necessary: boolean; // Always true, cannot be disabled
  analytics: boolean; // Vercel Analytics, performance tracking
  marketing: boolean; // Future: marketing pixels, etc.
}

interface ConsentContextType {
  consent: ConsentPreferences | null;
  hasConsented: boolean;
  showBanner: boolean;
  acceptAll: () => void;
  rejectAll: () => void;
  updateConsent: (preferences: Partial<ConsentPreferences>) => void;
  openSettings: () => void;
  closeBanner: () => void;
}

const CONSENT_KEY = "rubikone-cookie-consent";
const CONSENT_VERSION = "1"; // Bump this to re-ask for consent after policy changes

const defaultConsent: ConsentPreferences = {
  necessary: true,
  analytics: false,
  marketing: false,
};

const ConsentContext = createContext<ConsentContextType | undefined>(undefined);

export function useConsent() {
  const context = useContext(ConsentContext);
  if (!context) {
    throw new Error("useConsent must be used within a ConsentProvider");
  }
  return context;
}

interface StoredConsent {
  version: string;
  preferences: ConsentPreferences;
  timestamp: number;
}

export function ConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<ConsentPreferences | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load consent from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CONSENT_KEY);
      if (stored) {
        const parsed: StoredConsent = JSON.parse(stored);
        // Check if consent version matches
        if (parsed.version === CONSENT_VERSION) {
          setConsent(parsed.preferences);
          setShowBanner(false);
        } else {
          // Version mismatch, re-ask for consent
          setShowBanner(true);
        }
      } else {
        // No consent stored, show banner
        setShowBanner(true);
      }
    } catch {
      // Error parsing, show banner
      setShowBanner(true);
    }
    setIsInitialized(true);
  }, []);

  const saveConsent = useCallback((preferences: ConsentPreferences) => {
    const stored: StoredConsent = {
      version: CONSENT_VERSION,
      preferences,
      timestamp: Date.now(),
    };
    localStorage.setItem(CONSENT_KEY, JSON.stringify(stored));
    setConsent(preferences);
    setShowBanner(false);
  }, []);

  const acceptAll = useCallback(() => {
    saveConsent({
      necessary: true,
      analytics: true,
      marketing: true,
    });
  }, [saveConsent]);

  const rejectAll = useCallback(() => {
    saveConsent({
      necessary: true,
      analytics: false,
      marketing: false,
    });
  }, [saveConsent]);

  const updateConsent = useCallback((preferences: Partial<ConsentPreferences>) => {
    const newConsent: ConsentPreferences = {
      necessary: true, // Always true
      analytics: preferences.analytics ?? consent?.analytics ?? false,
      marketing: preferences.marketing ?? consent?.marketing ?? false,
    };
    saveConsent(newConsent);
  }, [consent, saveConsent]);

  const openSettings = useCallback(() => {
    setShowBanner(true);
  }, []);

  const closeBanner = useCallback(() => {
    // If no consent given yet, treat as reject all
    if (!consent) {
      rejectAll();
    } else {
      setShowBanner(false);
    }
  }, [consent, rejectAll]);

  return (
    <ConsentContext.Provider
      value={{
        consent,
        hasConsented: consent !== null,
        showBanner: isInitialized && showBanner,
        acceptAll,
        rejectAll,
        updateConsent,
        openSettings,
        closeBanner,
      }}
    >
      {children}
    </ConsentContext.Provider>
  );
}
