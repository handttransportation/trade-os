import type { Metadata } from "next";
import "./globals.css";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import AppProviders from "@/components/AppProviders";

export const metadata: Metadata = {
  title: "Trade OS",
  description: "Professional AI-powered trading platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-white antialiased">
        <AppProviders>
          <div className="flex min-h-screen">
            <Sidebar />

            <section className="min-w-0 flex-1 pb-20 md:pb-0">
              <Header />

              <main>{children}</main>
            </section>
          </div>
        </AppProviders>
      </body>
    </html>
  );
}
