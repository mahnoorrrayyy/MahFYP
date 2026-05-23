"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-plum-100">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <img
            src="https://mahmetics.pk/wp-content/uploads/2025/03/logo-dark.png"
            alt="MahMetics"
            className="h-8 w-auto"
          />
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-plum-900">
          <Link href="/" className="hover:text-plum-700 transition-colors">Home</Link>
          <Link href="/products" className="hover:text-plum-700 transition-colors">Products</Link>
          <Link href="/recommend" className="hover:text-plum-700 transition-colors">Skin Advisor</Link>
        </div>

        {/* CTA */}
        <Link
          href="/recommend"
          className="hidden md:inline-block bg-plum-700 text-white text-sm font-medium px-5 py-2 rounded-full hover:bg-plum-900 transition-colors"
        >
          Find My Match
        </Link>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden text-plum-900"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden bg-white border-t border-plum-100 px-6 py-4 flex flex-col gap-4 text-sm font-medium text-plum-900">
          <Link href="/" onClick={() => setOpen(false)}>Home</Link>
          <Link href="/products" onClick={() => setOpen(false)}>Products</Link>
          <Link href="/recommend" onClick={() => setOpen(false)}>Skin Advisor</Link>
          <Link
            href="/recommend"
            onClick={() => setOpen(false)}
            className="bg-plum-700 text-white text-center px-5 py-2 rounded-full"
          >
            Find My Match
          </Link>
        </div>
      )}
    </nav>
  );
}