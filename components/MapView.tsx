"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Leaf, Loader2 } from "lucide-react";
import { getSupabase } from "@/lib/supabase";
import type { WasteReport } from "@/lib/types";

const LeafletMap = dynamic(() => import("@/components/LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-[#16a34a]" />
    </div>
  ),
});

export default function MapView() {
  const [reports, setReports] = useState<WasteReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReports() {
      try {
        const supabase = getSupabase();
        const { data, error: fetchError } = await supabase
          .from("reports")
          .select(
            "id, photo_url, lat, lng, description, severity, status, created_at",
          )
          .order("created_at", { ascending: false });

        if (fetchError) {
          throw new Error(fetchError.message);
        }

        setReports((data as WasteReport[]) ?? []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load reports.",
        );
      } finally {
        setLoading(false);
      }
    }

    fetchReports();
  }, []);

  const markers = useMemo(
    () =>
      reports.filter(
        (r) =>
          typeof r.lat === "number" &&
          typeof r.lng === "number" &&
          !Number.isNaN(r.lat) &&
          !Number.isNaN(r.lng),
      ),
    [reports],
  );

  return (
    <div className="flex h-dvh flex-col bg-white">
      <header className="z-[1000] shrink-0 border-b border-gray-100 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-gray-600 transition-colors hover:text-gray-900"
              aria-label="Back to home"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#16a34a]/10 sm:h-9 sm:w-9">
                <Leaf className="h-4 w-4 text-[#16a34a] sm:h-5 sm:w-5" />
              </span>
              <span className="text-base font-bold text-gray-900 sm:text-lg">
                SwachhMap
              </span>
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 sm:justify-end">
            <p className="text-sm font-medium text-gray-700">
              {loading ? (
                <span className="inline-flex items-center gap-2 text-gray-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading reports…
                </span>
              ) : (
                <>
                  <span className="font-bold text-[#16a34a]">
                    {markers.length}
                  </span>{" "}
                  {markers.length === 1 ? "report" : "reports"} found
                </>
              )}
            </p>
            <Link
              href="/report"
              className="rounded-lg bg-[#16a34a] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#15803d]"
            >
              Report Waste
            </Link>
          </div>
        </div>
      </header>

      <div className="relative min-h-0 flex-1">
        {error ? (
          <div className="flex h-full items-center justify-center px-4">
            <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          </div>
        ) : loading ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-[#16a34a]" />
          </div>
        ) : (
          <LeafletMap reports={markers} />
        )}
      </div>
    </div>
  );
}
