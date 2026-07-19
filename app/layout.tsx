import type { Metadata } from "next";
import { Fraunces, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import DotObserver from "@/components/DotObserver";

// The three brand fonts. next/font downloads them at build time and
// self-hosts them, so there is no runtime request to Google.
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  style: ["normal", "italic"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://deeprun.co.nz"),
  title: "Deep Run - Websites That Win Work",
  description:
    "Fast, sharp, fixed-price websites for New Zealand trades, hospitality and local businesses - live in days, with optional care plans that keep them that way.",
  openGraph: {
    title: "Deep Run - Websites That Win Work",
    description:
      "Fast, sharp, fixed-price websites for New Zealand trades, hospitality and local businesses.",
    url: "https://deeprun.co.nz",
    siteName: "Deep Run",
    locale: "en_NZ",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${fraunces.variable} ${inter.variable} ${plexMono.variable}`}
      >
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        {/* LocalBusiness structured data helps Google show the business,
            its contact details and service area in search + maps. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfessionalService",
              name: "Deep Run",
              description:
                "Fast, sharp, fixed-price websites for New Zealand trades, hospitality and local businesses.",
              url: "https://deeprun.co.nz",
              email: "hello@deeprun.co.nz",
              telephone: "+64 20 4134 3263",
              areaServed: "NZ",
              address: {
                "@type": "PostalAddress",
                addressCountry: "NZ",
              },
            }),
          }}
        />
        {/* If JavaScript is unavailable, reveal everything immediately -
            the power-up choreography must never hide content. */}
        <noscript>
          <style>{`[data-pw]{opacity:1 !important;translate:none !important}.mono .dot{background:var(--gold)}`}</style>
        </noscript>
        <DotObserver />
        {children}
      </body>
    </html>
  );
}
