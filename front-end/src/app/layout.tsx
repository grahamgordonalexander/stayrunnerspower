import type { Metadata } from "next";
import { Recursive } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster";
import Providers from "@/components/Providers";
import ToastProvider from "@/components/ToastProvider";
import { constructMetadata } from "@/lib/utils";
import ScrollUp from "@/components/ScrollUp";

const recursive = Recursive({ subsets: ["latin"] });

export const metadata = constructMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={recursive.className}>
      <Providers>
        <ToastProvider>
        
          <Navbar />

          <main className="flex grainy-light flex-col min-h-[calc(100vh-3.5rem-1px)]">
            <div className="flex-1 flex flex-col h-full">
            <ScrollUp />
              {children}
            </div>
            <Footer />
          </main>

          <Toaster />
        </ToastProvider>
        </Providers>
      </body>
    </html>
  );
}