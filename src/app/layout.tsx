import "@/lib/ssr-fix"; // MUST be first - Fix para localStorage en SSR
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { CartProvider } from "@/components/marketplace/cart-provider";
import { Footer } from "@/components/marketplace/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HonduMarket - Marketplace de Honduras",
  description: "El marketplace más grande de Honduras. Compra, vende y participa en subastas de forma segura.",
  keywords: ["HonduMarket", "marketplace", "Honduras", "compras", "ventas", "subastas", "eBay", "Amazon"],
  authors: [{ name: "HonduMarket Team" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "HonduMarket - Marketplace de Honduras",
    description: "El marketplace más grande de Honduras. Compra, vende y participa en subastas de forma segura.",
    url: "https://hondumarket.com",
    siteName: "HonduMarket",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HonduMarket - Marketplace de Honduras",
    description: "El marketplace más grande de Honduras. Compra, vende y participa en subastas de forma segura.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <CartProvider>
          {children}
          <Toaster />
        </CartProvider>
        <Footer />
      </body>
    </html>
  );
}
