"use client";
import { useState } from "react";
import { Upload, CheckCircle, AlertCircle, Loader } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import * as XLSX from "xlsx";

const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY!
);

type UploadStatus = "idle" | "loading" | "success" | "error";

export default function AdminPage() {
  const [status, setStatus]   = useState<UploadStatus>("idle");
  const [message, setMessage] = useState("");
  const [preview, setPreview] = useState<Record<string, string>[]>([]);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatus("loading");
    setMessage("Reading Excel file...");

    try {
      const buffer = await file.arrayBuffer();
      const wb     = XLSX.read(buffer);
      const ws     = wb.Sheets[wb.SheetNames[0]];
      const rows   = XLSX.utils.sheet_to_json(ws) as Record<string, string>[];

      setPreview(rows.slice(0, 3));
      setMessage(`Found ${rows.length} products. Uploading to Supabase...`);

      const records = rows.map((row) => ({
        product_name : row["Product Name"] || "",
        brand_name   : row["Brand"] || "",
        price        : row["Price (PKR)"] || "",
        description  : row["Description"] || "",
        ingredients  : row["Ingredients"] || "",
        image_url    : row["Image URL"] || "",
        url          : row["Product URL"] || "",
        concerns_str : row["Concerns"] || "",
      }));

      const batchSize = 50;
      for (let i = 0; i < records.length; i += batchSize) {
        const batch = records.slice(i, i + batchSize);
        const { error } = await adminSupabase
          .from("products")
          .upsert(batch, { onConflict: "url", ignoreDuplicates: false });
        if (error) throw new Error(error.message);
        setMessage(`Uploaded ${Math.min(i + batchSize, records.length)} / ${records.length}...`);
      }

      setStatus("success");
      setMessage(`✅ ${records.length} products uploaded successfully!`);

    } catch (err: unknown) {
      setStatus("error");
      setMessage(`Error: ${err instanceof Error ? err.message : "Something went wrong"}`);
    }
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-4xl mx-auto px-5 py-16">

        <div className="mb-10">
          <h1 className="text-3xl font-semibold text-plum-900">Admin Dashboard</h1>
          <p className="text-plum-500 mt-2">Upload products via Excel sheet</p>
        </div>

        <div className="bg-white rounded-2xl border border-plum-100 p-8 mb-8">
          <h2 className="font-semibold text-plum-900 text-lg mb-2">Upload Products</h2>
          <p className="text-sm text-plum-500 mb-6">
            Use the Excel file exported from Colab. Existing products with the same URL will be updated.
          </p>

          <div className="bg-plum-50 rounded-xl p-4 mb-6 text-xs text-plum-700 font-mono overflow-x-auto whitespace-nowrap">
            Expected columns: Product Name | Brand | Price (PKR) | Description | Ingredients | Image URL | Product URL | Concerns
          </div>

          <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-plum-200 rounded-xl cursor-pointer hover:border-plum-400 hover:bg-plum-50 transition-all">
            <Upload size={28} className="text-plum-400 mb-2" />
            <span className="text-sm text-plum-600 font-medium">Click to upload Excel file</span>
            <span className="text-xs text-plum-400 mt-1">.xlsx files only</span>
            <input
              type="file"
              accept=".xlsx"
              className="hidden"
              onChange={handleFile}
            />
          </label>

          {status !== "idle" && (
            <div className={`mt-4 flex items-center gap-3 p-4 rounded-xl text-sm ${
              status === "success" ? "bg-green-50 text-green-800" :
              status === "error"   ? "bg-red-50 text-red-800"     :
              "bg-plum-50 text-plum-700"
            }`}>
              {status === "loading" && <Loader size={16} className="animate-spin" />}
              {status === "success" && <CheckCircle size={16} />}
              {status === "error"   && <AlertCircle size={16} />}
              {message}
            </div>
          )}
        </div>

        {preview.length > 0 && (
          <div className="bg-white rounded-2xl border border-plum-100 p-6">
            <h3 className="font-semibold text-plum-900 mb-4">Preview (first 3 rows)</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-plum-100">
                    {Object.keys(preview[0]).map((k) => (
                      <th key={k} className="text-left text-plum-500 font-medium pb-2 pr-4 whitespace-nowrap">
                        {k}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {preview.map((row, i) => (
                    <tr key={i} className="border-b border-plum-50">
                      {Object.values(row).map((v, j) => (
                        <td key={j} className="py-2 pr-4 text-plum-700 max-w-xs truncate">
                          {String(v)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}