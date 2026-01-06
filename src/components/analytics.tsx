"use client";

import { useEffect } from "react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { useConsent } from "@/providers/consent-provider";

export function ConditionalAnalytics() {
  const { consent } = useConsent();

  // Only render analytics if user has consented
  if (!consent?.analytics) {
    return null;
  }

  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
}

// Hook to track custom events (respects consent)
export function useAnalytics() {
  const { consent } = useConsent();

  const trackEvent = (eventName: string, properties?: Record<string, string | number | boolean>) => {
    if (consent?.analytics && typeof window !== "undefined") {
      // Vercel Analytics automatically captures page views
      // Custom events can be tracked via window.va if needed
      console.log("Track event:", eventName, properties);
    }
  };

  return { trackEvent, isEnabled: consent?.analytics ?? false };
}
