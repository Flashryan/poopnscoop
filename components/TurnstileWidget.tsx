"use client";

import { useEffect } from "react";

type Props = {
  siteKey: string;
  onVerify: (token: string) => void;
};

export default function TurnstileWidget({ siteKey, onVerify }: Props) {
  useEffect(() => {
    (window as any).onTurnstileSuccess = (token: string) => {
      onVerify(token);
    };
    return () => {
      if ((window as any).onTurnstileSuccess) {
        delete (window as any).onTurnstileSuccess;
      }
    };
  }, [onVerify]);

  return (
    <div
      className="cf-turnstile"
      data-sitekey={siteKey}
      data-callback="onTurnstileSuccess"
      data-theme="light"
    />
  );
}
