import type { Metadata } from "next";
import { Manrope, Space_Mono } from "next/font/google";

import { AuthProvider } from "@/contexts/auth/auth-context";
import { Toaster } from "@/components/ui/sonner";

import "./globals.scss";

const sans = Manrope({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  variable: "--font-manrope",
});

const mono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
});

export const metadata: Metadata = {
  title: "APISIX Dashboard",
  description: "Cloud-Native Microservices API Gateway",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${sans.variable} ${mono.variable} bg-background text-foreground antialiased`}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
