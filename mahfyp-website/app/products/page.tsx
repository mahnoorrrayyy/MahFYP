import { supabase } from "@/lib/supabase";
import type { Product } from "@/lib/types";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";

async function getProducts(brand?: string): Promise<Product[]> {
  let query = supabase.from("products").select("*");
  if (brand) {
    query = query.eq("brand_name", brand);
  }
  const { data, error } = await query.order("product_name").limit(100);
  if (error) { console.error(error); return []; }
  return (data as Product[]) || [];
}

const BRANDS = [
  "Conatural",
  "AccuFix Cosmetics",
  "Masarrat Makeup",
  "BNB Body N Body",
];

const CONCERNS = [
  "acne",
  "hydration",
  "brightening",
  "anti_aging",
  "pigmentation",
  "sensitivity",
];

function activePill(isActive: boolean) {
  return isActive
    ? "text-sm px-4 py-1.5 rounded-full border bg-plum-700 text-white border-plum-700"
    : "text-sm px-4 py-1.5 rounded-full border bg-white text-plum-700 border-plum-200 hover:border-plum-400";
}

function activeConcernPill(isActive: boolean) {
  return isActive
    ? "text-sm px-4 py-1.5 rounded-full border capitalize bg-gold text-plum-900 border-gold"
    : "text-sm px-4 py-1.5 rounded-full border capitalize bg-white text-plum-700 border-plum-200 hover:border-plum-400";
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ brand?: string; concern?: string; skin_type?: string }>;
}) {
  const params = await searchParams;
  const products = await getProducts(params.brand);

  const filtered = params.concern
    ? products.filter((p) =>
        p.concerns_str?.toLowerCase().includes(params.concern!)
      )
    : params.skin_type
    ? products.filter((p) => {
        const key = `suitable_${params.skin_type}` as keyof Product;
        return (p[key] as number) === 1;
      })
    : products;

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-6xl mx-auto px-5 py-12">

        <div className="mb-10">
          <h1 className="text-3xl font-semibold text-plum-900">All Products</h1>
          <p className="text-plum-500 mt-2">{filtered.length} products found</p>
        </div>

        <div className="flex flex-col gap-4 mb-10">

          {/* Brand filter */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs font-medium text-plum-500 uppercase tracking-wide w-20">
              Brand
            </span>
            <Link href="/products" className={activePill(!params.brand)}>
              All
            </Link>
            {BRANDS.map((b) => (
              <Link
                key={b}
                href={`/products?brand=${encodeURIComponent(b)}`}
                className={activePill(params.brand === b)}
              >
                {b}
              </Link>
            ))}
          </div>

          {/* Concern filter */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs font-medium text-plum-500 uppercase tracking-wide w-20">
              Concern
            </span>
            <Link href="/products" className={activeConcernPill(!params.concern)}>
              All
            </Link>
            {CONCERNS.map((c) => (
              <Link
                key={c}
                href={`/products?concern=${c}`}
                className={activeConcernPill(params.concern === c)}
              >
                {c.replace("_", " ")}
              </Link>
            ))}
          </div>

        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-plum-100">
            <p className="text-plum-400">No products found for this filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}