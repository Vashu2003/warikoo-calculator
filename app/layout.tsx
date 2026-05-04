import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Fraunces, JetBrains_Mono } from "next/font/google";
import { Toaster } from "sonner";

import { ThemeProvider } from "@/components/shared/theme-provider";

import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  axes: ["SOFT", "WONK", "opsz"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://warikoo-calculator.vercel.app"),
  title: {
    default: "Warikoo Finance Calculator — Honest Money Advice for India",
    template: "%s | Warikoo Calculator",
  },
  description:
    "Free financial health calculator based on Ankur Warikoo's framework. Get your Warikoo Health Score, loan prepayment strategy, SIP projections, and goal feasibility — all private, no signup, all in your browser.",
  keywords: [
    "Ankur Warikoo",
    "Warikoo Calculator",
    "Money Matters",
    "personal finance India",
    "financial health score",
    "loan prepayment calculator",
    "SIP calculator",
    "emergency fund calculator",
    "50/30/20 rule India",
    "financial planning India",
  ],
  authors: [{ name: "Warikoo Calculator" }],
  creator: "Warikoo Calculator",
  publisher: "Warikoo Calculator",
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    title: "Warikoo Finance Calculator — Honest Money Advice for India",
    description:
      "Free financial health calculator based on Ankur Warikoo's framework. Score your finances in 5 minutes. No signup, fully private.",
    siteName: "Warikoo Calculator",
  },
  twitter: {
    card: "summary_large_image",
    title: "Warikoo Finance Calculator",
    description:
      "Free financial health calculator based on Ankur Warikoo's framework. No signup, fully private.",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#1F4E78" },
    { media: "(prefers-color-scheme: dark)", color: "#0E2840" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${fraunces.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster position="bottom-right" closeButton richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
