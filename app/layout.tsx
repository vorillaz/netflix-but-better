import type { Metadata } from "next";
import localFont from "next/font/local";
import { NetflixSidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Suspense } from "react";

import "./globals.css";

export const metadata: Metadata = {
  title: "Nextflix but Better",
  description: "Browse 8 thousand movies and tv shows",
};

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
      >
        <NuqsAdapter>
          <div className="flex min-h-screen bg-gray-50">
            <div className="md:block sticky top-0 h-screen">
              <NetflixSidebar />
            </div>
            <div className="flex-1 min-w-0 relative">
              <div className="sticky top-0 bg-white z-30">
                <Suspense fallback={null}>
                  <Header />
                </Suspense>
              </div>
              <main className="px-4 pt-8 pb-14 md:px-6 space-y-6 overflow-y-auto">
                {children}
              </main>
            </div>
          </div>
        </NuqsAdapter>
      </body>
    </html>
  );
}
