import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "MahMetics — Skincare Advisor",
  description:
    "Find the best Pakistani skincare products for your skin type using AI-powered ingredient matching.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans bg-cream`}>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}