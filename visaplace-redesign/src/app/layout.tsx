import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: "VisaPlace - Canadian & US Immigration Law Firm",
  description: "Expert immigration lawyers helping you navigate Canadian and US immigration. Get your visa assessment today.",
  keywords: "immigration lawyer, Canada visa, US visa, permanent residence, work permit, study permit",
  authors: [{ name: "VisaPlace" }],
  creator: "VisaPlace",
  publisher: "VisaPlace",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "VisaPlace - Canadian & US Immigration Law Firm",
    description: "Expert immigration lawyers helping you navigate Canadian and US immigration. Get your visa assessment today.",
    siteName: 'VisaPlace',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "VisaPlace - Canadian & US Immigration Law Firm",
    description: "Expert immigration lawyers helping you navigate Canadian and US immigration. Get your visa assessment today.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} antialiased`}>
        <div className="min-h-screen bg-white">
          {children}
        </div>
      </body>
    </html>
  );
}
