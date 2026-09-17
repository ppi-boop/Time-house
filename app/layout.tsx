import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { SITE_URL, STORE } from "@/lib/constants";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
  weight: ["400", "500", "600"],
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${STORE.name} — Watches, Ladies Bags & Accessories`,
    template: `%s | ${STORE.name}`,
  },
  description: STORE.description,
  applicationName: STORE.name,
  keywords: [
    "watch shop",
    "ladies bags",
    "mens accessories",
    "womens accessories",
    "buy watches on WhatsApp",
    STORE.address.city,
  ],
  authors: [{ name: STORE.legalName }],
  creator: STORE.legalName,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: STORE.name,
    title: `${STORE.name} — Watches, Ladies Bags & Accessories`,
    description: STORE.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${STORE.name} — Watches, Ladies Bags & Accessories`,
    description: STORE.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  category: "shopping",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FCFAF5" },
    { media: "(prefers-color-scheme: dark)", color: "#0A1410" },
  ],
  width: "device-width",
  initialScale: 1,
};

/**
 * Applies the saved theme before first paint so the page never flashes light
 * then dark. Kept tiny and inline on purpose.
 */
const themeScript = `(function(){try{var s=localStorage.getItem('time-house-theme');var d=s?s==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;if(d)document.documentElement.classList.add('dark')}catch(e){}})()`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN" suppressHydrationWarning className={`${playfair.variable} ${inter.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
