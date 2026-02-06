import type { Metadata } from "next";
import type { ReactNode } from "react";
import { DM_Sans, Space_Grotesk } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
});

const body = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Poop n Scoop | Wolverhampton",
  description:
    "Fast, friendly dog waste removal in Wolverhampton. Instant quotes, flexible plans, and honest coverage checks.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <Script
          // We render the widget explicitly via window.turnstile.render(...).
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          async
          defer
        />
        <div className="min-h-screen bg-cream">
          <header className="border-b border-fog bg-white/80 backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
              <a className="font-display text-xl" href="/">
                Poop n Scoop
              </a>
              <nav className="flex items-center gap-6 text-sm">
                <a href="/pricing" className="hover:text-grass">
                  Pricing
                </a>
                <a href="/service-area" className="hover:text-grass">
                  Service Area
                </a>
                <a href="/faq" className="hover:text-grass">
                  FAQ
                </a>
                <a href="/contact" className="hover:text-grass">
                  Contact
                </a>
              </nav>
            </div>
          </header>
          {children}
          <footer className="border-t border-fog bg-white/80">
            <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-6 text-sm text-ink/70 md:flex-row md:items-center md:justify-between">
              <div>© {new Date().getFullYear()} Poop n Scoop</div>
              <div className="flex gap-4">
                <a href="/privacy" className="hover:text-grass">
                  Privacy
                </a>
                <a href="/terms" className="hover:text-grass">
                  Terms
                </a>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
