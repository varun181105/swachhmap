"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  ImagePlus,
  Leaf,
  Loader2,
  LocateFixed,
  X,
} from "lucide-react";
import { getSupabase } from "@/lib/supabase";

type Severity = "Low" | "Medium" | "High";

const SEVERITIES: Severity[] = ["Low", "Medium", "High"];

const STORAGE_BUCKET = "report-photos";

const DEFAULT_LAT = 30.7333;
const DEFAULT_LNG = 76.7794;

function formatCoord(value: number) {
  return value.toFixed(2);
}

export default function ReportPage() {
  const [photo, setPhoto] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState<Severity>("Medium");
  const [locating, setLocating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!photo) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(photo);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [photo]);

  const clearForm = useCallback(() => {
    setPhoto(null);
    setPreviewUrl(null);
    setLat(null);
    setLng(null);
    setDescription("");
    setSeverity("Medium");
    setError(null);
  }, []);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file (JPEG, PNG, etc.).");
      e.target.value = "";
      return;
    }
    setError(null);
    setPhoto(file);
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      return;
    }

    setLocating(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLat(position.coords.latitude);
        setLng(position.coords.longitude);
        setLocating(false);
      },
      () => {
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!photo) {
      setError("Please upload a photo of the waste.");
      return;
    }

    const reportLat = lat ?? DEFAULT_LAT;
    const reportLng = lng ?? DEFAULT_LNG;

    setSubmitting(true);

    try {
      const supabase = getSupabase();
      const ext = photo.name.split(".").pop() || "jpg";
      const filePath = `${Date.now()}-${crypto.randomUUID()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(filePath, photo, { contentType: photo.type, upsert: false });

      if (uploadError) {
        throw new Error(
          uploadError.message.includes("Bucket not found")
            ? `Storage bucket "${STORAGE_BUCKET}" not found. Create it in Supabase Storage.`
            : `Photo upload failed: ${uploadError.message}`,
        );
      }

      const { data: urlData } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(filePath);

      const { error: insertError } = await supabase.from("reports").insert({
        photo_url: urlData.publicUrl,
        lat: reportLat,
        lng: reportLng,
        description: description.trim() || null,
        severity,
        status: "pending",
      });

      if (insertError) {
        throw new Error(`Failed to save report: ${insertError.message}`);
      }

      clearForm();
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-full flex-col bg-white text-gray-800">
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur-sm">
        <nav className="mx-auto flex max-w-lg items-center justify-between px-4 py-4 sm:px-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-600 transition-colors hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only sm:not-sr-only sm:text-sm sm:font-medium">
              Back
            </span>
          </Link>
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#16a34a]/10">
              <Leaf className="h-5 w-5 text-[#16a34a]" strokeWidth={2.25} />
            </span>
            <span className="text-lg font-bold tracking-tight text-gray-900">
              SwachhMap
            </span>
          </Link>
          <div className="w-14 sm:w-16" aria-hidden />
        </nav>
      </header>

      <main className="mx-auto w-full max-w-lg flex-1 px-4 py-8 sm:px-6 sm:py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Report Waste
          </h1>
          <p className="mt-2 text-sm text-gray-600 sm:text-base">
            Help keep your city clean by reporting waste in your area.
          </p>
        </div>

        {success ? (
          <div
            className="rounded-xl border border-[#16a34a]/20 bg-[#16a34a]/5 p-6 text-center"
            role="status"
          >
            <CheckCircle2 className="mx-auto h-12 w-12 text-[#16a34a]" />
            <p className="mt-4 text-base font-medium text-gray-900 sm:text-lg">
              Report submitted! Thank you for helping keep your city clean.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={() => {
                  setSuccess(false);
                }}
                className="rounded-lg bg-[#16a34a] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#15803d]"
              >
                Submit another report
              </button>
              <Link
                href="/"
                className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Back to home
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Photo upload */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-900">
                Photo
              </label>
              {previewUrl ? (
                <div className="relative overflow-hidden rounded-xl border border-gray-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewUrl}
                    alt="Waste preview"
                    className="aspect-video w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPhoto(null);
                    }}
                    className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white transition-colors hover:bg-black/80"
                    aria-label="Remove photo"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 px-4 py-10 transition-colors hover:border-[#16a34a]/40 hover:bg-[#16a34a]/5">
                  <ImagePlus className="h-10 w-10 text-gray-400" />
                  <span className="mt-3 text-sm font-medium text-gray-700">
                    Tap to upload a photo
                  </span>
                  <span className="mt-1 text-xs text-gray-500">
                    Images only (JPEG, PNG, WebP)
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={handlePhotoChange}
                  />
                </label>
              )}
              {previewUrl && (
                <label className="mt-2 inline-block cursor-pointer text-sm font-medium text-[#16a34a] hover:text-[#15803d]">
                  Change photo
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={handlePhotoChange}
                  />
                </label>
              )}
            </div>

            {/* Location */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-900">
                Location{" "}
                <span className="font-normal text-gray-500">(optional)</span>
              </label>
              <p className="mb-3 text-xs text-gray-500">
                If skipped, your report will use Chandigarh as the default
                location.
              </p>
              <button
                type="button"
                onClick={handleDetectLocation}
                disabled={locating}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border-2 border-[#16a34a] bg-white px-4 py-3 text-sm font-semibold text-[#16a34a] transition-colors hover:bg-[#16a34a]/5 disabled:cursor-not-allowed disabled:opacity-60 sm:text-base"
              >
                {locating ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <LocateFixed className="h-5 w-5" />
                )}
                {locating ? "Detecting location…" : "Auto-detect location"}
              </button>
              <p className="mt-3 rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-700">
                Lat: {formatCoord(lat ?? DEFAULT_LAT)}, Lng:{" "}
                {formatCoord(lng ?? DEFAULT_LNG)}
                {lat === null && (
                  <span className="mt-1 block text-xs text-gray-500">
                    Default (Chandigarh) — tap above to use your GPS location
                  </span>
                )}
              </p>
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-medium text-gray-900"
              >
                Description
              </label>
              <textarea
                id="description"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the waste issue..."
                className="w-full resize-none rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#16a34a] focus:outline-none focus:ring-2 focus:ring-[#16a34a]/20 sm:text-base"
              />
            </div>

            {/* Severity */}
            <div>
              <span className="mb-2 block text-sm font-medium text-gray-900">
                Severity
              </span>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {SEVERITIES.map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setSeverity(level)}
                    className={`rounded-lg border-2 px-3 py-3 text-sm font-semibold transition-colors sm:py-3.5 sm:text-base ${
                      severity === level
                        ? "border-[#16a34a] bg-[#16a34a] text-white"
                        : "border-gray-200 bg-white text-gray-700 hover:border-[#16a34a]/40 hover:bg-[#16a34a]/5"
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <p
                className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                role="alert"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#16a34a] px-4 py-3.5 text-base font-semibold text-white transition-colors hover:bg-[#15803d] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Submitting…
                </>
              ) : (
                "Submit Report"
              )}
            </button>
          </form>
        )}
      </main>
    </div>
  );
}
