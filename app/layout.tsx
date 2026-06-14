import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SWRConfig } from "swr";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AIFlashcards",
  description: "AI-powered flashcards for effective learning",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
      <body className="min-h-screen bg-[#1a0a2e] text-white antialiased">
        <SWRConfig value={{ revalidateOnFocus: false, errorRetryCount: 2 }}>{children}</SWRConfig>
      </body>
    </html>
  );
}
