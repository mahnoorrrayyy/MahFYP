"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart-context";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { count } = useCart();

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-plum-100">
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">

        <Link href="/" className="flex items-center">
          <img src="/logo.png" alt="MahMetics" className="h-8 w-auto" />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm text-plum-500 hover:text-plum-900 transition-colors">Home</Link>
          <Link href="/products" className="text-sm text-plum-500 hover:text-plum-900 transition-colors">Products</Link>
          <Link href="/about" className="text-sm text-plum-500 hover:text-plum-900 transition-colors">About Us</Link>
        </div>

        <div className="hidden md:flex items-center gap-3">
          {/* Cart icon */}
          <Link href="/cart" className="relative p-2 text-plum-700 hover:text-plum-900">
            <ShoppingBag size={22} />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-gold text-plum-900 text-xs font-bold rounded-full flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>
          <Link
            href="/recommend"
            className="bg-plum-700 text-white text-sm font-medium px-5 py-2.5 rounded-full hover:bg-plum-900 transition-colors"
          >
            Skin Advisor
          </Link>
        </div>

        <div className="md:hidden flex items-center gap-3">
          <Link href="/cart" className="relative p-2 text-plum-700">
            <ShoppingBag size={20} />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-gold text-plum-900 text-xs font-bold rounded-full flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>
          <button className="p-2 text-plum-700" onClick={() => setOpen(!open)}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t border-plum-100 px-5 py-5 flex flex-col gap-4">
          <Link href="/" onClick={() => setOpen(false)} className="text-sm text-plum-700 font-medium">Home</Link>
          <Link href="/products" onClick={() => setOpen(false)} className="text-sm text-plum-700 font-medium">Products</Link>
          <Link href="/recommend" onClick={() => setOpen(false)} className="text-sm text-plum-700 font-medium">Skin Advisor</Link>
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