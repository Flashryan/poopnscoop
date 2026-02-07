import type { Metadata } from "next";
import type { ReactNode } from "react";
import { DM_Sans, Space_Grotesk } from "next/font/google";
import Script from "next/script";
import GoogleAnalytics from "@/components/GoogleAnalytics";
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

const APP_URL = process.env.APP_URL || "https://poopnscoop.co.uk";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "Dog Waste Removal Wolverhampton | Poop n Scoop",
    template: "%s | Poop n Scoop Wolverhampton",
  },
  description:
    "Professional dog waste removal and garden sanitisation in Wolverhampton. One-off visits from £15, monthly plans from £30. Serving WV postcodes and surrounding areas within 10 miles.",
  keywords: [
    "dog waste removal Wolverhampton",
    "dog poop pick up Wolverhampton",
    "pet waste removal West Midlands",
    "garden dog waste cleaning",
    "dog poo removal service",
    "pet waste collection Wolverhampton",
    "dog mess cleanup Wolverhampton",
    "professional pooper scooper Wolverhampton",
    "dog waste removal near me",
    "garden sanitisation Wolverhampton",
    "poop scooping service WV",
    "dog waste disposal Wolverhampton",
  ],
  authors: [{ name: "Poop n Scoop" }],
  creator: "Poop n Scoop",
  publisher: "Poop n Scoop",
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: APP_URL,
    siteName: "Poop n Scoop",
    title: "Dog Waste Removal Wolverhampton | Poop n Scoop",
    description:
      "Professional dog waste removal & garden sanitisation in Wolverhampton. From £15 per visit. Sanitisation included. Book online in 2 minutes.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dog Waste Removal Wolverhampton | Poop n Scoop",
    description:
      "Professional dog waste removal & garden sanitisation in Wolverhampton. From £15 per visit. Book online in 2 minutes.",
  },
  alternates: {
    canonical: APP_URL,
  },
  other: {
    "geo.region": "GB-WLV",
    "geo.placename": "Wolverhampton",
    "geo.position": "52.5862;-2.1279",
    ICBM: "52.5862, -2.1279",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <GoogleAnalytics />
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
                <a href="/about" className="hover:text-grass">
                  About
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
