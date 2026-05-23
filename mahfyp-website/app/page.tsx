import Link from "next/link";
import { ArrowRight, Sparkles, FlaskConical, ShoppingBag, Star } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Product } from "@/lib/types";
import ProductCard from "@/components/ProductCard";

async function getFeaturedProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .not("ingredients", "eq", "Not Found")
    .order("score_combination", { ascending: false })
    .limit(8);
  if (error) { console.error(error); return []; }
  return data || [];
}

const BRANDS = [
  {
    name: "Conatural",
    tagline: "Organic & Natural",
    logo: "https://conaturalintl.com/cdn/shop/files/Conatural_Logo_9ad6ab73-5943-4725-9a8d-70b24ee9c035.png?v=1750144421&width=300",
    href: "https://conaturalintl.com",
  },
  {
    name: "AccuFix Cosmetics",
    tagline: "Dermatologist Approved",
    logo: "https://media.licdn.com/dms/image/v2/C4E0BAQEQ3OXWk11gyA/company-logo_200_200/company-logo_200_200/0/1630577891205/accufix_cosmetics_pvt_ltd_logo?e=2147483647&v=beta&t=8jqMtnWwXDh-G80syhoICp3WTFfqR8VeYQRAjI4xFrI",
    href: "https://accufixcosmetics.com",
  },
  {
    name: "Masarrat Makeup",
    tagline: "Halal Certified",
    logo: "https://masarratmakeup.com/cdn/shop/files/massarat_misbal_mobile-01_256x256_621f660b-a56b-472c-b74b-e75d2cdc9d08.png?v=1661510755",
    href: "https://masarratmakeup.com",
  },
  {
    name: "BNB Body N Body",
    tagline: "Natural Skincare",
    logo: "https://bodynbody.com/cdn/shop/files/BNB_Logo_512x200_ce32176e-71ed-4069-a2b6-256d46220475.png?v=1737723572&width=200",
    href: "https://bodynbody.com",
  },
];

const STEPS = [
  {
    icon: <Sparkles size={22} />,
    step: "01",
    title: "Tell us your skin type",
    desc: "Answer 3 quick questions about your skin — oily, dry, combination, sensitive, or normal.",
  },
  {
    icon: <FlaskConical size={22} />,
    step: "02",
    title: "We analyse ingredients",
    desc: "Our ML model scans ingredient lists of 300+ local products and finds what suits your skin best.",
  },
  {
    icon: <ShoppingBag size={22} />,
    step: "03",
    title: "Get your matches",
    desc: "Discover the best Pakistani skincare products for your exact skin type and concerns.",
  },
];

const SKIN_TYPES = ["Oily", "Dry", "Combination", "Normal", "Sensitive"];

export default async function HomePage() {
  const featured = await getFeaturedProducts();

  return (
    <div className="min-h-screen">

    {/* ── Hero ─────────────────────────────────────────── */}
<section className="bg-plum-900 relative overflow-hidden min-h-[90vh] flex items-center">

  {/* Background video */}
  <video
    autoPlay
    muted
    loop
    playsInline
    className="absolute inset-0 w-full h-full object-cover"
  >
    <source src="/hero.mp4" type="video/mp4" />
  </video>

  {/* Overlay */}
  <div className="absolute inset-0 bg-plum-900/75" />

  {/* Content */}
  <div className="relative z-10 max-w-6xl mx-auto px-5 py-20 w-full">
    <div className="max-w-2xl">
      <div className="inline-flex items-center gap-2 bg-plum-700/50 border border-plum-700 rounded-full px-4 py-1.5 mb-6">
        <Star size={12} className="text-gold fill-gold" />
        <span className="text-xs font-medium text-plum-200 tracking-wide uppercase">
          AI-Powered Skincare
        </span>
      </div>

      <h1 className="text-4xl md:text-6xl font-semibold text-white leading-tight mb-6">
        Beauty isn&apos;t made.{" "}
        <span className="text-gold">It&apos;s revealed.</span>
      </h1>

      <p className="text-lg text-plum-200 leading-relaxed mb-10 max-w-xl">
        Tell us your skin type and we&apos;ll match you with the best local
        Pakistani skincare products — based on ingredient science, not trends.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/recommend"
          className="inline-flex items-center justify-center gap-2 bg-gold text-plum-900 font-semibold px-7 py-3.5 rounded-full hover:brightness-110 transition-all text-sm"
        >
          Find My Skincare Match <ArrowRight size={16} />
        </Link>
        <Link
          href="/products"
          className="inline-flex items-center justify-center gap-2 border border-plum-500 text-plum-200 px-7 py-3.5 rounded-full hover:bg-plum-700/30 transition-all text-sm"
        >
          Browse All Products
        </Link>
      </div>
    </div>

    {/* Stats */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 pt-16 border-t border-plum-700">
      {[
        { value: "150+", label: "Products" },
        { value: "4",    label: "Local Brands" },
        { value: "5",    label: "Skin Types" },
        { value: "6",    label: "Skin Concerns" },
      ].map((s) => (
        <div key={s.label}>
          <div className="text-2xl md:text-3xl font-bold text-gold">{s.value}</div>
          <div className="text-sm text-plum-200 mt-1">{s.label}</div>
        </div>
      ))}
    </div>
  </div>

</section>
      {/* ── Skin type pills ──────────────────────────────── */}
      <section className="bg-plum-50 border-b border-plum-100 py-5">
        <div className="max-w-6xl mx-auto px-5">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-medium text-plum-500 uppercase tracking-wide mr-2">
              Find products for:
            </span>
            {SKIN_TYPES.map((type) => (
              <Link
                key={type}
                href={`/recommend?skin_type=${type.toLowerCase()}`}
                className="text-sm bg-white border border-plum-200 text-plum-700 px-4 py-1.5 rounded-full hover:bg-plum-700 hover:text-white hover:border-plum-700 transition-all"
              >
                {type} Skin
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-cream">
        <div className="max-w-6xl mx-auto px-5">
          <div className="max-w-xl mb-14">
            <h2 className="text-3xl md:text-4xl font-semibold text-plum-900 mb-3">
              How it works
            </h2>
            <p className="text-plum-500">
              From your skin type to your perfect routine in three steps.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {STEPS.map((step) => (
              <div
                key={step.step}
                className="bg-white rounded-2xl border border-plum-100 p-8 relative overflow-hidden"
              >
                <div className="absolute top-4 right-6 text-6xl font-bold text-plum-50 select-none">
                  {step.step}
                </div>
                <div className="w-11 h-11 bg-plum-50 rounded-xl flex items-center justify-center text-plum-700 mb-5">
                  {step.icon}
                </div>
                <h3 className="font-semibold text-plum-900 text-lg mb-2">{step.title}</h3>
                <p className="text-sm text-plum-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Brands ───────────────────────────────────────── */}
      <section className="py-20 bg-white border-y border-plum-100">
        <div className="max-w-6xl mx-auto px-5">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-semibold text-plum-900 mb-2">
                Pakistani Brands
              </h2>
              <p className="text-plum-500">Locally made, dermatologist-reviewed products</p>
            </div>
            <Link href="/products" className="text-sm font-medium text-plum-700 hover:text-plum-900 flex items-center gap-1 shrink-0">
              Browse all products <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {BRANDS.map((brand) => (
  <Link
    key={brand.name}
    href={`/products?brand=${encodeURIComponent(brand.name)}`}
    className="group bg-white rounded-2xl border border-plum-100 p-6 hover:border-plum-300 hover:shadow-md transition-all flex flex-col items-center text-center gap-3"
  >
    <div className="w-20 h-12 flex items-center justify-center">
      <img
        src={brand.logo}
        alt={brand.name}
        className="max-h-10 max-w-full object-contain grayscale group-hover:grayscale-0 transition-all"
      />
    </div>
    <div>
      <div className="font-semibold text-plum-900 text-sm">{brand.name}</div>
      <div className="text-xs text-plum-500 mt-0.5">{brand.tagline}</div>
    </div>
  </Link>
))}
          </div>
        </div>
      </section>

      {/* ── Featured products ─────────────────────────────── */}
      <section className="py-20 md:py-28 bg-cream">
        <div className="max-w-6xl mx-auto px-5">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-semibold text-plum-900 mb-2">
                Top Picks
              </h2>
              <p className="text-plum-500">Highly recommended across all skin types</p>
            </div>
            <Link href="/products" className="text-sm font-medium text-plum-700 hover:text-plum-900 flex items-center gap-1 shrink-0">
              View all <ArrowRight size={14} />
            </Link>
          </div>

          {featured.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-plum-100">
              <p className="text-plum-400 text-sm">Products loading — connect Supabase to see results.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {featured.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="bg-plum-900 py-20 md:py-28">
        <div className="max-w-2xl mx-auto px-5 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">
            Ready to find your perfect skincare?
          </h2>
          <p className="text-plum-200 mb-10 leading-relaxed">
            Answer 3 quick questions and our model will recommend the best
            local products for your exact skin type and concerns.
          </p>
          <Link
            href="/recommend"
            className="inline-flex items-center gap-2 bg-gold text-plum-900 font-semibold px-8 py-4 rounded-full hover:brightness-110 transition-all"
          >
            Start Skin Quiz <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────── */}
      <footer className="bg-plum-900 border-t border-plum-700 py-10">
        <div className="max-w-6xl mx-auto px-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <img
              src="https://mahmetics.pk/wp-content/uploads/2025/03/cropped-logo-web-transparent.png"
              alt="MahMetics"
              className="h-7 w-auto opacity-80"
            />
            <div className="flex gap-6 text-sm text-plum-300">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <Link href="/products" className="hover:text-white transition-colors">Products</Link>
              <Link href="/recommend" className="hover:text-white transition-colors">Skin Advisor</Link>
            </div>
            <p className="text-xs text-plum-500">© 2025 MahMetics · Final Year Project</p>
          </div>
        </div>
      </footer>

    </div>
  );
}