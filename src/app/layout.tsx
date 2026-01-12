/**
 * Root layout for the Paginated Document Editor application.
 */

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

export const metadata: Metadata = {
  title: "Paginated Document Editor",
  description: "A Tiptap-based rich text editor with real-time pagination that displays content as A4 pages with proper margins, exactly as they would appear when printed.",
  keywords: ["editor", "tiptap", "pagination", "document", "word processor", "A4"],
  authors: [{ name: "Developer" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Prevent FOUC */}
        <style dangerouslySetInnerHTML={{ __html: `html { visibility: visible; opacity: 1; }` }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
