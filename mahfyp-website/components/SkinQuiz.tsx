"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Product } from "@/lib/types";
import TransparencyDisclosure from "@/components/TransparencyDisclosure";
import Link from "next/link";
import { ArrowRight, ArrowLeft, Check, Package, Loader } from "lucide-react";



// ── Skin type data ────────────────────────────────────────────────────────────
const SKIN_TYPES = [
  {
    id: "oily",
    label: "Oily",
    emoji: "💧",
    gradient: "from-blue-50 to-cyan-100",
    ring: "ring-blue-400",
    tagline: "Shiny, greasy skin throughout the day",
    signs: [
      "Visible or enlarged pores",
      "Prone to blackheads & breakouts",
      "Makeup slides off by midday",
    ],
    tip: "Your skin produces excess sebum. Look for lightweight, non-comedogenic products.",
  },
  {
    id: "dry",
    label: "Dry",
    emoji: "🌵",
    gradient: "from-amber-50 to-orange-100",
    ring: "ring-amber-400",
    tagline: "Tight, flaky or rough skin texture",
    signs: [
      "Flaky or rough patches",
      "Feels tight after washing",
      "Fine lines appear more visible",
    ],
    tip: "Your skin lacks moisture. Rich, hydrating ingredients like hyaluronic acid and ceramides are your best friends.",
  },
  {
    id: "combination",
    label: "Combination",
    emoji: "☯️",
    gradient: "from-purple-50 to-pink-100",
    ring: "ring-purple-400",
    tagline: "Oily T-zone, normal or dry cheeks",
    signs: [
      "Shiny forehead & nose",
      "Dry or flaky cheeks",
      "Breakouts mainly in T-zone",
    ],
    tip: "You need a balanced approach — gentle enough for dry areas, effective for oily zones.",
  },
  {
    id: "normal",
    label: "Normal",
    emoji: "✨",
    gradient: "from-green-50 to-emerald-100",
    ring: "ring-emerald-400",
    tagline: "Well-balanced, minimal skin concerns",
    signs: [
      "Small, barely visible pores",
      "Smooth, even texture",
      "Rarely breaks out",
    ],
    tip: "Lucky you! Focus on maintenance — gentle cleansing, SPF, and light hydration.",
  },
  {
    id: "sensitive",
    label: "Sensitive",
    emoji: "🌸",
    gradient: "from-rose-50 to-red-100",
    ring: "ring-rose-400",
    tagline: "Skin reacts easily to products",
    signs: [
      "Redness or burning sensation",
      "Reacts to new products",
      "Easily irritated by fragrance",
    ],
    tip: "Stick to fragrance-free, hypoallergenic formulas with soothing ingredients like centella and ceramides.",
  },
];

// ── Skin concern data ─────────────────────────────────────────────────────────
const CONCERNS = [
  {
    id: "acne",
    label: "Acne",
    emoji: "🔴",
    gradient: "from-red-50 to-orange-100",
    ring: "ring-red-400",
    tagline: "Breakouts, pimples & blackheads",
    description:
      "Acne happens when pores get clogged with oil and dead skin cells. Hormones, diet, and stress can all trigger it.",
    ingredients: "Look for: Salicylic Acid, Niacinamide, Zinc, Tea Tree",
  },
  {
    id: "hydration",
    label: "Hydration",
    emoji: "💦",
    gradient: "from-blue-50 to-cyan-100",
    ring: "ring-blue-400",
    tagline: "Dehydrated, dull & tight skin",
    description:
      "Even oily skin can be dehydrated. When your skin lacks water, it can feel tight and look dull or flaky.",
    ingredients: "Look for: Hyaluronic Acid, Glycerin, Ceramides, Aloe Vera",
  },
  {
    id: "brightening",
    label: "Brightening",
    emoji: "⭐",
    gradient: "from-yellow-50 to-amber-100",
    ring: "ring-yellow-400",
    tagline: "Dull complexion & uneven tone",
    description:
      "Dullness is caused by dead skin buildup, sun exposure, and lack of sleep. Brightening ingredients restore your natural glow.",
    ingredients: "Look for: Vitamin C, Niacinamide, AHA, Licorice Extract",
  },
  {
    id: "anti_aging",
    label: "Anti-Aging",
    emoji: "⏳",
    gradient: "from-purple-50 to-violet-100",
    ring: "ring-purple-400",
    tagline: "Fine lines, wrinkles & firmness",
    description:
      "As we age, collagen production slows down. Anti-aging products help maintain firmness and reduce the appearance of lines.",
    ingredients: "Look for: Retinol, Peptides, Vitamin C, Hyaluronic Acid",
  },
  {
    id: "pigmentation",
    label: "Pigmentation",
    emoji: "🟤",
    gradient: "from-orange-50 to-amber-100",
    ring: "ring-orange-400",
    tagline: "Dark spots & uneven skin tone",
    description:
      "Pigmentation is caused by sun damage, acne scars, or hormonal changes. Targeted ingredients can fade dark spots over time.",
    ingredients: "Look for: Alpha Arbutin, Kojic Acid, Vitamin C, Tranexamic Acid",
  },
  {
    id: "sensitivity",
    label: "Sensitivity",
    emoji: "🌿",
    gradient: "from-green-50 to-teal-100",
    ring: "ring-green-400",
    tagline: "Redness, irritation & reactive skin",
    description:
      "Sensitive skin reacts to environmental triggers and harsh ingredients. A gentle, minimal routine is key.",
    ingredients: "Look for: Centella Asiatica, Ceramides, Allantoin, Chamomile",
  },
];

// ── Score bar component ───────────────────────────────────────────────────────
function ScoreBar({ score }: { score: number }) {
  const pct = Math.round((score || 0) * 100);
  const color =
    pct >= 70 ? "bg-emerald-500" : pct >= 50 ? "bg-gold" : "bg-plum-400";

  return (
    <div className="flex items-center gap-2 mt-2">
      <div className="flex-1 bg-plum-100 rounded-full h-1.5">
        <div
          className={`${color} h-1.5 rounded-full transition-all`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs font-bold text-plum-700 w-10 text-right">
        {pct}%
      </span>
    </div>
  );
}
{/* Compact transparency badges */}
<div className="mt-2">
  <TransparencyDisclosure
    allergens={
      Array.isArray(p.allergens) ? p.allergens :
      typeof p.allergens === "string" ? JSON.parse(p.allergens || "[]") : []
    }
    cscpFlags={
      Array.isArray(p.cscp_flags) ? p.cscp_flags :
      typeof p.cscp_flags === "string" ? JSON.parse(p.cscp_flags || "[]") : []
    }
    pregnancyFlag={p.pregnancy_flag || false}
    compact={true}
  />
</div>

// ── Result product card ───────────────────────────────────────────────────────
function ResultCard({
  product,
  skinType,
}: {
  product: Product;
  skinType: string;
}) {
  const scoreKey = `score_${skinType}` as keyof Product;
  const score = product[scoreKey] as number;

  const concerns = product.concerns_str
    ? product.concerns_str.split(",").slice(0, 2).map((c) => c.trim()).filter(Boolean)
    : [];

  return (
    <Link
      href={`/products/${product.id}`}
      className="group bg-white rounded-2xl border border-plum-100 overflow-hidden hover:border-plum-300 hover:shadow-lg transition-all"
    >
      {/* Image */}
      <div className="aspect-square bg-plum-50 overflow-hidden flex items-center justify-center">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.product_name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <Package size={32} className="text-plum-200" />
        )}
      </div>

      <div className="p-4">
        <span className="text-xs font-medium text-plum-500 bg-plum-50 px-2 py-0.5 rounded-full">
          {product.brand_name}
        </span>

        <h3 className="text-sm font-semibold text-plum-900 leading-snug line-clamp-2 mt-2 mb-2 group-hover:text-plum-700">
          {product.product_name}
        </h3>

        {product.price && (
          <p className="text-sm font-bold text-plum-700 mb-2">
            PKR {product.price}
          </p>
        )}

        {concerns.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {concerns.map((c) => (
              <span
                key={c}
                className="text-xs bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full capitalize"
              >
                {c.replace("_", " ")}
              </span>
            ))}
          </div>
        )}

        {/* ML Match score */}
        <div>
          <p className="text-xs text-plum-400">ML Match Score</p>
          <ScoreBar score={score} />
        </div>
      </div>
    </Link>
  );
}

// ── Main quiz component ───────────────────────────────────────────────────────
export default function SkinQuiz() {
  const [step, setStep]           = useState<1 | 2 | 3>(1);
  const [skinType, setSkinType]   = useState("");
  const [concern, setConcern]     = useState("");
  const [products, setProducts]   = useState<Product[]>([]);
  const [loading, setLoading]     = useState(false);
  const [isPregnant, setIsPregnant] = useState(false);

  async function fetchResults(selectedSkinType: string, selectedConcern: string) {
    setLoading(true);
    setStep(3);

    const suitableCol = `suitable_${selectedSkinType}`;
    const scoreCol    = `score_${selectedSkinType}`;

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq(suitableCol, 1);

    if (error) { console.error(error); setLoading(false); return; }

    let candidates = (data as Product[]) || [];

    // Filter by concern
    if (selectedConcern) {
      candidates = candidates.filter((p) =>
        p.concerns_str?.toLowerCase().includes(selectedConcern)
      );
    }

    // For pregnancy: filter out pregnancy_flag = true
    if (isPregnant) {
      candidates = candidates.filter((p) => !p.pregnancy_flag);
    }

    // Normalize risk_score to 0-1 across candidate set
    const riskScores = candidates.map((p) => p.risk_score || 0);
    const maxRisk    = Math.max(...riskScores, 1);
    const minRisk    = Math.min(...riskScores, 0);
    const riskRange  = maxRisk - minRisk || 1;

    // For sensitive skin: drop top risk quartile before ranking
    if (selectedSkinType === "sensitive") {
      const sorted  = [...candidates].sort((a, b) => (b.risk_score || 0) - (a.risk_score || 0));
      const cutoff  = sorted[Math.floor(sorted.length * 0.25)]?.risk_score ?? maxRisk;
      candidates    = candidates.filter((p) => (p.risk_score || 0) <= cutoff);
    }

    // Re-rank: skin_type_score - 0.3 * risk_norm
    candidates.sort((a, b) => {
      const sA      = (a[scoreCol as keyof Product] as number) || 0;
      const sB      = (b[scoreCol as keyof Product] as number) || 0;
      const rNormA  = ((a.risk_score || 0) - minRisk) / riskRange;
      const rNormB  = ((b.risk_score || 0) - minRisk) / riskRange;
      return (sB - 0.3 * rNormB) - (sA - 0.3 * rNormA);
    });

    setProducts(candidates);
    setLoading(false);
  }

  function handleSkinTypeSelect(id: string) {
    setSkinType(id);
  }

  function handleConcernSelect(id: string) {
    setConcern(id);
  }

  function goToStep2() {
    if (skinType) setStep(2);
  }

  function handleGetResults() {
  if (concern) fetchResults(skinType, concern);
}

  function resetQuiz() {
    setSkinType("");
    setConcern("");
    setProducts([]);
    setStep(1);
  }

  const selectedSkinTypeData = SKIN_TYPES.find((s) => s.id === skinType);
  const selectedConcernData  = CONCERNS.find((c) => c.id === concern);

  // ── Step 1: Skin Type ───────────────────────────────────────────────────────
  if (step === 1) {
    return (
      <div className="min-h-screen bg-cream">
        <div className="max-w-5xl mx-auto px-5 py-12">

          {/* Header */}
          <div className="text-center mb-3">
            <div className="inline-flex items-center gap-2 bg-plum-100 text-plum-700 text-xs font-medium px-4 py-1.5 rounded-full mb-4">
              Step 1 of 2
            </div>
            <h1 className="text-3xl md:text-4xl font-semibold text-plum-900 mb-3">
              What is your skin type?
            </h1>
            <p className="text-plum-500 max-w-lg mx-auto">
              Choose the option that best describes how your skin normally behaves — not on a bad day or after trying a new product.
            </p>
          </div>

          {/* Cards grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-10">
            {SKIN_TYPES.map((type) => (
              <button
                key={type.id}
                onClick={() => handleSkinTypeSelect(type.id)}
                className={`relative flex flex-col items-center text-center bg-gradient-to-b ${type.gradient} rounded-2xl border-2 p-5 transition-all hover:shadow-md ${
                  skinType === type.id
                    ? "border-plum-700 shadow-lg scale-105"
                    : "border-transparent hover:border-plum-200"
                }`}
              >
                {skinType === type.id && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-plum-700 rounded-full flex items-center justify-center">
                    <Check size={12} className="text-white" />
                  </div>
                )}
                <span className="text-5xl mb-3">{type.emoji}</span>
                <h3 className="font-semibold text-plum-900 text-base mb-1">
                  {type.label}
                </h3>
                <p className="text-xs text-plum-500 leading-relaxed mb-3">
                  {type.tagline}
                </p>
                <ul className="text-xs text-plum-600 space-y-1 text-left w-full">
                  {type.signs.map((sign) => (
                    <li key={sign} className="flex items-start gap-1">
                      <span className="text-plum-400 mt-0.5">•</span>
                      {sign}
                    </li>
                  ))}
                </ul>
              </button>
            ))}
          </div>

          {/* Tip box */}
          {selectedSkinTypeData && (
            <div className="mt-6 bg-plum-50 border border-plum-200 rounded-xl p-4 text-sm text-plum-700 text-center">
              💡 {selectedSkinTypeData.tip}
            </div>
          )}

          {/* Next button */}
          <div className="flex justify-center mt-8">
            <button
              onClick={goToStep2}
              disabled={!skinType}
              className="inline-flex items-center gap-2 bg-plum-700 text-white font-semibold px-8 py-3.5 rounded-full hover:bg-plum-900 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next — Choose Your Concern <ArrowRight size={18} />
            </button>
          </div>

        </div>
      </div>
    );
  }

  // ── Step 2: Skin Concern ────────────────────────────────────────────────────
  if (step === 2) {
    return (
      <div className="min-h-screen bg-cream">
        <div className="max-w-5xl mx-auto px-5 py-12">

          {/* Header */}
          <div className="text-center mb-3">
            <div className="inline-flex items-center gap-2 bg-plum-100 text-plum-700 text-xs font-medium px-4 py-1.5 rounded-full mb-4">
              Step 2 of 2
            </div>
            <h1 className="text-3xl md:text-4xl font-semibold text-plum-900 mb-3">
              What is your main skin concern?
            </h1>
            <p className="text-plum-500 max-w-lg mx-auto">
              Pick the concern you want to target most right now. You can always come back and try a different one.
            </p>
          </div>

          {/* Cards grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-10">
            {CONCERNS.map((c) => (
              <button
                key={c.id}
                onClick={() => handleConcernSelect(c.id)}
                className={`relative flex flex-col items-start text-left bg-gradient-to-br ${c.gradient} rounded-2xl border-2 p-6 transition-all hover:shadow-md ${
                  concern === c.id
                    ? "border-plum-700 shadow-lg"
                    : "border-transparent hover:border-plum-200"
                }`}
              >
                {concern === c.id && (
                  <div className="absolute top-3 right-3 w-6 h-6 bg-plum-700 rounded-full flex items-center justify-center">
                    <Check size={12} className="text-white" />
                  </div>
                )}
                <span className="text-4xl mb-3">{c.emoji}</span>
                <h3 className="font-semibold text-plum-900 text-base mb-1">
                  {c.label}
                </h3>
                <p className="text-xs font-medium text-plum-600 mb-2">
                  {c.tagline}
                </p>
                <p className="text-xs text-plum-500 leading-relaxed mb-3">
                  {c.description}
                </p>
                <p className="text-xs text-plum-700 font-medium bg-white/60 rounded-lg px-2 py-1.5 w-full">
                  {c.ingredients}
                </p>
              </button>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <button
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-2 text-plum-500 hover:text-plum-900 font-medium text-sm"
            >
              <ArrowLeft size={16} /> Back
            </button>

            <button
              onClick={handleGetResults}
              disabled={!concern}
              className="inline-flex items-center gap-2 bg-gold text-plum-900 font-semibold px-8 py-3.5 rounded-full hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Get My Recommendations <ArrowRight size={18} />
            </button>
          </div>

        </div>
      </div>
    );
  }
  {/* Pregnancy option */}
    <div className="mt-6 bg-pink-50 border border-pink-200 rounded-2xl p-5">
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={isPregnant}
          onChange={(e) => setIsPregnant(e.target.checked)}
          className="mt-0.5 w-4 h-4 accent-plum-700"
        />
        <div>
          <p className="text-sm font-semibold text-plum-900">
            I am pregnant or planning to become pregnant
          </p>
          <p className="text-xs text-plum-500 mt-0.5">
            Products containing ingredients flagged as reproductive concerns
            by California&apos;s Safe Cosmetics Program will be deprioritised
            in your results.
          </p>
        </div>
      </label>
    </div>

  // ── Step 3: Results ─────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-6xl mx-auto px-5 py-12">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {selectedSkinTypeData && (
                <span className="inline-flex items-center gap-1 bg-plum-100 text-plum-700 text-xs font-medium px-3 py-1 rounded-full">
                  {selectedSkinTypeData.emoji} {selectedSkinTypeData.label} Skin
                </span>
              )}
              {selectedConcernData && (
                <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-xs font-medium px-3 py-1 rounded-full">
                  {selectedConcernData.emoji} {selectedConcernData.label}
                </span>
              )}
            </div>
            <h1 className="text-2xl md:text-3xl font-semibold text-plum-900">
              {loading
                ? "Finding your matches..."
                : `${products.length} products found for you`}
            </h1>
            <p className="text-plum-500 text-sm mt-1">
              Sorted by ML confidence score — highest match first
            </p>
          </div>

          <button
            onClick={resetQuiz}
            className="inline-flex items-center gap-2 border border-plum-200 text-plum-700 text-sm font-medium px-5 py-2.5 rounded-full hover:bg-plum-50 transition-all shrink-0"
          >
            <ArrowLeft size={14} /> Retake Quiz
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader size={36} className="text-plum-700 animate-spin" />
            <p className="text-plum-500 text-sm">
              Analysing ingredients for your skin type...
            </p>
          </div>
        )}

        {/* No results */}
        {!loading && products.length === 0 && (
          <div className="text-center py-24 bg-white rounded-2xl border border-plum-100">
            <p className="text-plum-400 text-lg mb-2">No products found</p>
            <p className="text-plum-300 text-sm mb-6">
              Try a different skin type or concern combination
            </p>
            <button
              onClick={resetQuiz}
              className="bg-plum-700 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-plum-900"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Results grid */}
        {!loading && products.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {products.map((p) => (
              <ResultCard key={p.id} product={p} skinType={skinType} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}