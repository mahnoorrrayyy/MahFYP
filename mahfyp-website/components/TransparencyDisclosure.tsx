type CscpFlag = {
  ingredient: string;
  endpoint: string;
  condition: string;
};

type Props = {
  allergens?: string[];
  cscpFlags?: CscpFlag[];
  pregnancyFlag?: boolean;
  compact?: boolean; // true = show as badges, false = full text
};

export default function TransparencyDisclosure({
  allergens = [],
  cscpFlags = [],
  pregnancyFlag = false,
  compact = false,
}: Props) {
  const hasDisclosures = allergens.length > 0 || cscpFlags.length > 0 || pregnancyFlag;
  if (!hasDisclosures) return null;

  if (compact) {
    return (
      <div className="flex flex-wrap gap-1.5">
        {allergens.length > 0 && (
          <span className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">
            {allergens.length} EU allergen{allergens.length > 1 ? "s" : ""}
          </span>
        )}
        {cscpFlags.length > 0 && (
          <span className="text-xs bg-orange-50 text-orange-700 border border-orange-200 px-2 py-0.5 rounded-full">
            {cscpFlags.length} CSCP flag{cscpFlags.length > 1 ? "s" : ""}
          </span>
        )}
        {pregnancyFlag && (
          <span className="text-xs bg-pink-50 text-pink-700 border border-pink-200 px-2 py-0.5 rounded-full">
            ⚠️ Pregnancy note
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
      <h3 className="font-semibold text-amber-900 text-sm mb-3 flex items-center gap-2">
        🔎 Ingredient Transparency
      </h3>

      <p className="text-xs text-amber-700 mb-4 leading-relaxed">
        The following disclosures are derived from EU Regulation 1223/2009 and
        California&apos;s Safe Cosmetics Program. This is regulatory disclosure —
        not a safety verdict.
      </p>

      {/* EU Allergens */}
      {allergens.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-semibold text-amber-800 uppercase tracking-wide mb-2">
            EU Declarable Fragrance Allergens
          </p>
          <ul className="flex flex-col gap-1">
            {allergens.map((a) => (
              <li key={a} className="text-xs text-amber-800 flex items-start gap-1.5">
                <span className="mt-0.5 shrink-0">•</span>
                Contains <span className="font-medium capitalize">{a}</span>,
                a declarable fragrance allergen (EU Reg. 1223/2009, Annex III).
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* CSCP Flags */}
      {cscpFlags.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-semibold text-amber-800 uppercase tracking-wide mb-2">
            California Safe Cosmetics Program
          </p>
          <ul className="flex flex-col gap-2">
            {cscpFlags.map((f, i) => (
              <li key={i} className="text-xs text-amber-800 flex items-start gap-1.5">
                <span className="mt-0.5 shrink-0">•</span>
                <span>
                  Contains <span className="font-medium">{f.ingredient}</span>,
                  which California&apos;s Safe Cosmetics Program flags as
                  a <span className="font-medium">{f.endpoint}</span> concern
                  ({f.condition}).
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Pregnancy note */}
      {pregnancyFlag && (
        <div className="bg-pink-50 border border-pink-200 rounded-xl p-3 text-xs text-pink-800">
          <span className="font-semibold">Pregnancy note: </span>
          This product contains an ingredient flagged by California&apos;s Safe
          Cosmetics Program as a reproductive or developmental concern.
          Consult your healthcare provider before use during pregnancy.
        </div>
      )}
    </div>
  );
}