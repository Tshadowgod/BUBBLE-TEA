import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const storeName = process.env.NEXT_PUBLIC_STORE_NAME ?? "Mundo Bubble Tea";

export const metadata: Metadata = {
  title: storeName,
  description: "Order fresh bubble tea, milk tea and lattes online.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-cream">
        <div className="fixed inset-0 -z-10 overflow-hidden bg-cream">
          <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-brand-400/50 blur-3xl" />
          <div className="absolute -right-20 top-52 h-96 w-96 rounded-full bg-accent-500/30 blur-3xl" />
          <div className="absolute bottom-0 left-1/4 h-96 w-96 rounded-full bg-brand-100/70 blur-3xl" />
          <div className="absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-brand-500/25 blur-3xl" />
        </div>
        {children}
      </body>
    </html>
  );
}
