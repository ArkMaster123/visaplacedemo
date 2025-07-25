import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: "HALO – Expertise Capture App",
  description: "Organize and capture human expertise for the AI age. HALO guides users through expert knowledge elicitation using four advanced methods.",
  keywords: "expertise capture, knowledge elicitation, AI, narrative storytelling, protocol analysis, targeted questioning, simulation, HALO",
  authors: [{ name: "HALO by Mega Lab" }],
  creator: "HALO",
  publisher: "HALO",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "HALO – Expertise Capture App",
    description: "Organize and capture human expertise for the AI age. HALO guides users through expert knowledge elicitation using four advanced methods.",
    siteName: 'HALO',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "HALO – Expertise Capture App",
    description: "Organize and capture human expertise for the AI age. HALO guides users through expert knowledge elicitation using four advanced methods.",
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
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen bg-background text-foreground">
            {children}
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
