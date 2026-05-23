import Link from "next/link";
import { ArrowRight, Sparkles, FlaskConical, ShoppingBag } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Product } from "@/lib/types";
import ProductCard from "@/components/ProductCard";

// ── Fetch a few featured products from Supabase ──────────────────────────
async function getFeaturedProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .not("ingredients", "eq", "Not Found")
    .limit(8);
  if (error) { console.error(error); return []; }
  return data || [];
}

// ── Top brands data (static — add logo URLs if you have them) ─────────────
const BRANDS = [
  { name: "Conatural",         tagline: "Organic & Natural",       color: "bg-green-50  border-green-200" },
  { name: "AccuFix Cosmetics", tagline: "Dermatologist Approved",  color: "bg-blue-50   border-blue-200"  },
  { name: "Masarrat Makeup",   tagline: "Halal Certified",         color: "bg-pink-50   border-pink-200"  },
  { name: "BNB Body N Body",   tagline: "Natural Skincare",        color: "bg-amber-50  border-amber-200" },
];

// ── How it works steps ────────────────────────────────────────────────────
const STEPS = [
  {
    icon: <Sparkles size={28} className="text-plum-700" />,
    title: "Tell us your skin type",
    desc: "Answer 3 quick questions about your skin — oily, dry, combination, sensitive, or normal.",
  },
  {
    icon: <FlaskConical size={28} className="text-plum-700" />,
    title: "We match ingredients",
    desc: "Our ML model scans ingredient lists of 300+ local products and finds what suits your skin.",
  },
  {
    icon: <ShoppingBag size={28} className="text-plum-700" />,
    title: "Get local recommendations",
    desc: "Discover the best Pakistani skincare products for you — with links to buy them directly.",
  },
];

export default async function HomePage() {
  const featured = await getFeaturedProducts();

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="bg-plum-900 text-white">
        <div className="max-w-6xl mx-auto px-6 py-24 md:py-32 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-gold mb-4">
              AI-Powered Skincare
            </span>
            <h1 className="text-4xl md:text-5xl font-semibold leading-tight mb-6">
              Beauty isn&apos;t made.
              <br />
              <span className="text-gold">It&apos;s revealed.</span>
            </h1>
            <p className="text-plum-200 text-lg mb-8 leading-relaxed">
              Tell us your skin type and concerns. We match you with the best
              local Pakistani skincare products — based on science, not trends.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/recommend"
                className="flex items-center gap-2 bg-gold text-plum-900 font-semibold px-7 py-3 rounded-full hover:brightness-105 transition"
              >
                Find My Skincare <ArrowRight size={18} />
              </Link>
              <Link
                href="/products"
                className="flex items-center gap-2 border border-plum-200 text-white px-7 py-3 rounded-full hover:bg-plum-700 transition"
              >
                Browse Products
              </Link>
            </div>
          </div>

          {/* Hero visual — stat cards */}
          <div className="hidden md:grid grid-cols-2 gap-4">
            {[
              { value: "300+", label: "Local Products" },
              { value: "4",    label: "Pakistani Brands" },
              { value: "5",    label: "Skin Types Covered" },
              { value: "6",    label: "Skin Concerns" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-plum-700/50 border border-plum-700 rounded-2xl p-6"
              >
                <div className="text-3xl font-bold text-gold">{stat.value}</div>
                <div className="text-sm text-plum-200 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────── */}
      <section className="py-20 bg-cream">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-semibold text-plum-900">How it works</h2>
            <p className="text-plum-500 mt-3">Three steps to your perfect routine</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {STEPS.map((step, i) => (
              <div key={i} className="bg-white rounded-2xl border border-plum-100 p-8">
                <div className="w-12 h-12 bg-plum-50 rounded-xl flex items-center justify-center mb-5">
                  {step.icon}
                </div>
                <h3 className="font-semibold text-plum-900 text-lg mb-2">{step.title}</h3>
                <p className="text-sm text-plum-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Top Brands ───────────────────────────────────────── */}
      <section className="py-20 bg-plum-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-semibold text-plum-900">Featured Brands</h2>
            <p className="text-plum-500 mt-3">Top Pakistani skincare brands in our database</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {BRANDS.map((brand) => (
              <Link
                key={brand.name}
                href={`/products?brand=${encodeURIComponent(brand.name)}`}
                className={`rounded-2xl border p-6 text-center hover:shadow-md transition ${brand.color}`}
              >
                <div className="font-semibold text-plum-900 text-sm">{brand.name}</div>
                <div className="text-xs text-plum-500 mt-1">{brand.tagline}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ─────────────────────────────────── */}
      <section className="py-20 bg-cream">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-semibold text-plum-900">Featured Products</h2>
              <p className="text-plum-500 mt-2">Highly recommended across all skin types</p>
            </div>
            <Link
              href="/products"
              className="text-sm font-medium text-plum-700 hover:text-plum-900 flex items-center gap-1"
            >
              View all <ArrowRight size={14} />
            </Link>
          </div>

          {featured.length === 0 ? (
            <div className="text-center py-16 text-plum-400">
              No products yet — upload your dataset to Supabase first.
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {featured.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA Banner ────────────────────────────────────────── */}
      <section className="bg-plum-900 py-20">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-semibold text-white mb-4">
            Ready to find your skincare match?
          </h2>
          <p className="text-plum-200 mb-8">
            Answer 3 quick questions and our ML model will recommend the best
            local products for your skin type and concerns.
          </p>
          <Link
            href="/recommend"
            className="inline-flex items-center gap-2 bg-gold text-plum-900 font-semibold px-8 py-4 rounded-full hover:brightness-105 transition text-lg"
          >
            Start Skin Quiz <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────── */}
      <footer className="bg-plum-900 border-t border-plum-700 py-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-plum-300">
          <div className="font-semibold text-white">MahMetics Skin Advisor</div>
          <div className="flex gap-6">
            <Link href="/" className="hover:text-white transition">Home</Link>
            <Link href="/products" className="hover:text-white transition">Products</Link>
            <Link href="/recommend" className="hover:text-white transition">Skin Advisor</Link>
          </div>
          <div>© 2025 MahMetics · Final Year Project</div>
        </div>
      </footer>
    </>
  );
}