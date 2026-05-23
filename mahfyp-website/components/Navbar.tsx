"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-plum-100">
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">

        <Link href="/" className="flex items-center">
          <img src="/logo.png" alt="MahMetics" className="h-8 w-auto" />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm text-plum-500 hover:text-plum-900 transition-colors">
            Home
          </Link>
          <Link href="/products" className="text-sm text-plum-500 hover:text-plum-900 transition-colors">
            Products
          </Link>
          <Link href="/about" className="text-sm text-plum-500 hover:text-plum-900 transition-colors">
            About Us
          </Link>
        </div>

        <Link
          href="/recommend"
          className="hidden md:inline-flex items-center bg-plum-700 text-white text-sm font-medium px-5 py-2.5 rounded-full hover:bg-plum-900 transition-colors"
        >
          Skin Advisor
        </Link>

        <button
          className="md:hidden p-2 text-plum-700"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t border-plum-100 px-5 py-5 flex flex-col gap-4">
          <Link href="/" onClick={() => setOpen(false)} className="text-sm text-plum-700 font-medium">Home</Link>
          <Link href="/products" onClick={() => setOpen(false)} className="text-sm text-plum-700 font-medium">Products</Link>
          <Link href="/about" onClick={() => setOpen(false)} className="text-sm text-plum-700 font-medium">About Us</Link>
          <Link
            href="/recommend"
            onClick={() => setOpen(false)}
            className="bg-plum-700 text-white text-center text-sm font-medium px-5 py-2.5 rounded-full"
          >
            Skin Advisor
          </Link>
        </div>
      )}
    </nav>
  );
}