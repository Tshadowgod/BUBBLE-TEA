import type { Metadata } from "next";
import { Fredoka, Nunito } from "next/font/google";
import "./globals.css";

const display = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const body = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

const storeName = process.env.NEXT_PUBLIC_STORE_NAME ?? "Mundo Bubble Tea";

export const metadata: Metadata = {
  title: storeName,
  description: "Pide bubble tea, milk tea y lattes online.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${display.variable} ${body.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-cream font-sans text-foreground">
        <div className="store-atmosphere fixed inset-0 -z-10" />
        {children}
      </body>
    </html>
  );
}
