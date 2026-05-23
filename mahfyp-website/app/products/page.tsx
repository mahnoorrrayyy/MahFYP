import { supabase } from "@/lib/supabase";
import type { Product } from "@/lib/types";
import ProductCard from "@/components/ProductCard";

async function getProducts(brand?: string): Promise<Product[]> {
  let query = supabase.from("products").select("*");
  if (brand) query = query.eq("brand_name", brand);
  const { data, error } = await query.order("product_name").limit(100);
  if (error) { console.error(error); return []; }
  return data || [];
}

const BRANDS = ["Conatural", "AccuFix Cosmetics", "Masarrat Makeup", "BNB Body N Body"];
const CONCERNS = ["acne", "hydration", "brightening", "anti_aging", "pigmentation", "sensitivity"];

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { brand?: string; concern?: string };
}) {
  const products = await getProducts(searchParams.brand);

  const filtered = searchParams.concern
    ? products.filter((p) =>
        p.concerns_str?.toLowerCase().includes(searchParams.concern!)
      )
    : products;

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-6xl mx-auto px-5 py-12">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-semibold text-plum-900">All Products</h1>
          <p className="text-plum-500 mt-2">{filtered.length} products found</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 mb-10">

          {/* Brand filter */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs font-medium text-plum-500 uppercase tracking-wide w-20">Brand</span>
            
              href="/products"
              className={`text-sm px-4 py-1.5 rounded-full border transition-all ${
                !searchParams.brand
                  ? "bg-plum-700 text-white border-plum-700"
                  : "bg-white text-plum-700 border-plum-200 hover:border-plum-400"
              }`}
            >
              All
            </a>
            {BRANDS.map((b) => (
              
                key={b}
                href={`/products?brand=${encodeURIComponent(b)}${searchParams.concern ? `&concern=${searchParams.concern}` : ""}`}
                className={`text-sm px-4 py-1.5 rounded-full border transition-all ${
                  searchParams.brand === b
                    ? "bg-plum-700 text-white border-plum-700"
                    : "bg-white text-plum-700 border-plum-200 hover:border-plum-400"
                }`}
              >
                {b}
              </a>
            ))}
          </div>

          {/* Concern filter */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs font-medium text-plum-500 uppercase tracking-wide w-20">Concern</span>
            
              href={`/products${searchParams.brand ? `?brand=${searchParams.brand}` : ""}`}
              className={`text-sm px-4 py-1.5 rounded-full border transition-all ${
                !searchParams.concern
                  ? "bg-gold text-plum-900 border-gold"
                  : "bg-white text-plum-700 border-plum-200 hover:border-plum-400"
              }`}
            >
              All
            </a>
            {CONCERNS.map((c) => (
              
                key={c}
                href={`/products?${searchParams.brand ? `brand=${searchParams.brand}&` : ""}concern=${c}`}
                className={`text-sm px-4 py-1.5 rounded-full border transition-all capitalize ${
                  searchParams.concern === c
                    ? "bg-gold text-plum-900 border-gold"
                    : "bg-white text-plum-700 border-plum-200 hover:border-plum-400"
                }`}
              >
                {c.replace("_", " ")}
              </a>
            ))}
          </div>

        </div>

        {/* Grid */}
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