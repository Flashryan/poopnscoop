"use client";

import { useEffect, useRef, useCallback } from "react";

type Props = {
  siteKey: string;
  onVerify: (token: string) => void;
};

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          "error-callback"?: () => void;
          "expired-callback"?: () => void;
          theme?: "light" | "dark" | "auto";
        }
      ) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

export default function TurnstileWidget({ siteKey, onVerify }: Props) {
  const trimmedSiteKey = siteKey.trim();
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  const handleVerify = useCallback(
    (token: string) => {
      onVerify(token);
    },
    [onVerify]
  );

  useEffect(() => {
    if (!trimmedSiteKey) {
      // Avoid throwing inside Cloudflare's script when the sitekey is missing.
      console.error(
        '[Turnstile] Missing sitekey. Set the TURNSTILE_SITEKEY environment variable for this deployment.'
      );
      return;
    }

    const renderWidget = () => {
      if (!containerRef.current || !window.turnstile) return;
      if (widgetIdRef.current) return; // Already rendered

      try {
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: trimmedSiteKey,
          callback: handleVerify,
          "error-callback": () => {
            console.error("Turnstile error");
          },
          "expired-callback": () => {
            console.warn("Turnstile token expired");
          },
          theme: "light",
        });
      } catch (err) {
        console.error("Turnstile render failed", err);
      }
    };

    // If turnstile is already loaded, render immediately
    if (window.turnstile) {
      renderWidget();
    } else {
      // Otherwise, wait for it to load
      const checkInterval = setInterval(() => {
        if (window.turnstile) {
          clearInterval(checkInterval);
          renderWidget();
        }
      }, 100);

      // Cleanup interval after 10 seconds
      const timeout = setTimeout(() => {
        clearInterval(checkInterval);
      }, 10000);

      return () => {
        clearInterval(checkInterval);
        clearTimeout(timeout);
      };
    }

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [trimmedSiteKey, handleVerify]);

  if (!trimmedSiteKey) {
    return (
      <div className="rounded-xl border border-fog bg-white p-3 text-sm text-ink/70">
        Security check is temporarily unavailable. Please try again later.
      </div>
    );
  }

  return <div ref={containerRef} className="cf-turnstile" />;
}
