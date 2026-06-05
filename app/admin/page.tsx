"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Leaf,
  Loader2,
  Lock,
  LogOut,
  Shield,
} from "lucide-react";
import { getSupabase } from "@/lib/supabase";
import type { WasteReport } from "@/lib/types";

const ADMIN_PASSWORD = "swachhmap123";
const AUTH_KEY = "swachhmap_admin_auth";

type Filter = "all" | "pending" | "resolved" | "high";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatArea(lat: number, lng: number) {
  const isDefault =
    Math.abs(lat - 30.7333) < 0.01 && Math.abs(lng - 76.7794) < 0.01;
  if (isDefault) return "Chandigarh (default)";
  return `${lat.toFixed(2)}, ${lng.toFixed(2)}`;
}

function normalizeStatus(status: string) {
  return status.toLowerCase();
}

function severityBadgeClass(severity: string) {
  switch (severity.toLowerCase()) {
    case "high":
      return "bg-red-100 text-red-700";
    case "medium":
      return "bg-orange-100 text-orange-700";
    case "low":
    default:
      return "bg-[#16a34a]/10 text-[#16a34a]";
  }
}

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);

  const [reports, setReports] = useState<WasteReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    if (sessionStorage.getItem(AUTH_KEY) === "true") {
      setAuthenticated(true);
    }
  }, []);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const supabase = getSupabase();
      const { data, error: fetchError } = await supabase
        .from("reports")
        .select(
          "id, photo_url, lat, lng, description, severity, status, created_at",
        )
        .order("created_at", { ascending: false });

      if (fetchError) throw new Error(fetchError.message);
      setReports((data as WasteReport[]) ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load reports.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authenticated) {
      fetchReports();
    }
  }, [authenticated, fetchReports]);

  const stats = useMemo(() => {
    const pending = reports.filter(
      (r) => normalizeStatus(r.status) === "pending",
    ).length;
    const resolved = reports.filter(
      (r) => normalizeStatus(r.status) === "resolved",
    ).length;
    const highSeverity = reports.filter(
      (r) => r.severity.toLowerCase() === "high",
    ).length;
    return {
      total: reports.length,
      pending,
      resolved,
      highSeverity,
    };
  }, [reports]);

  const filteredReports = useMemo(() => {
    switch (filter) {
      case "pending":
        return reports.filter((r) => normalizeStatus(r.status) === "pending");
      case "resolved":
        return reports.filter((r) => normalizeStatus(r.status) === "resolved");
      case "high":
        return reports.filter((r) => r.severity.toLowerCase() === "high");
      default:
        return reports;
    }
  }, [reports, filter]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(AUTH_KEY, "true");
      setAuthenticated(true);
      setLoginError(null);
      setPassword("");
    } else {
      setLoginError("Incorrect password. Please try again.");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(AUTH_KEY);
    setAuthenticated(false);
    setReports([]);
    setFilter("all");
  };

  const handleMarkResolved = async (id: string) => {
    setUpdatingId(id);
    setError(null);
    try {
      const supabase = getSupabase();
      const { error: updateError } = await supabase
        .from("reports")
        .update({ status: "resolved" })
        .eq("id", id);

      if (updateError) throw new Error(updateError.message);

      setReports((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: "resolved" } : r)),
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update report.",
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const filterButtons: { key: Filter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "pending", label: "Pending" },
    { key: "resolved", label: "Resolved" },
    { key: "high", label: "High" },
  ];

  if (!authenticated) {
    return (
      <div className="flex min-h-dvh flex-col bg-white">
        <header className="border-b border-gray-100">
          <div className="mx-auto flex max-w-md items-center justify-center gap-2 px-4 py-5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#16a34a]/10">
              <Leaf className="h-5 w-5 text-[#16a34a]" />
            </span>
            <span className="text-lg font-bold text-gray-900">SwachhMap</span>
          </div>
        </header>

        <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-12">
          <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
            <div className="mb-6 flex flex-col items-center text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#16a34a]/10">
                <Shield className="h-7 w-7 text-[#16a34a]" />
              </span>
              <h1 className="mt-4 text-xl font-bold text-gray-900">
                Municipality Dashboard
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Enter the admin password to continue.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-gray-900"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin password"
                    className="w-full rounded-lg border border-gray-200 py-3 pl-10 pr-4 text-sm text-gray-900 focus:border-[#16a34a] focus:outline-none focus:ring-2 focus:ring-[#16a34a]/20"
                    autoComplete="current-password"
                  />
                </div>
              </div>

              {loginError && (
                <p className="text-sm text-red-600" role="alert">
                  {loginError}
                </p>
              )}

              <button
                type="submit"
                className="w-full rounded-lg bg-[#16a34a] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#15803d]"
              >
                Sign in
              </button>
            </form>

            <p className="mt-6 text-center">
              <Link
                href="/"
                className="text-sm font-medium text-[#16a34a] hover:text-[#15803d]"
              >
                ← Back to home
              </Link>
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col bg-gray-50">
      <header className="border-b border-gray-100 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#16a34a]/10">
              <Leaf className="h-5 w-5 text-[#16a34a]" />
            </span>
            <div>
              <span className="text-lg font-bold text-gray-900">
                SwachhMap
              </span>
              <p className="text-xs text-gray-500">Municipality Dashboard</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {[
            { label: "Total Reports", value: stats.total },
            { label: "Pending", value: stats.pending },
            { label: "Resolved", value: stats.resolved },
            { label: "High Severity", value: stats.highSeverity },
          ].map((card) => (
            <div
              key={card.label}
              className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5"
            >
              <p className="text-xs font-medium text-gray-500 sm:text-sm">
                {card.label}
              </p>
              <p className="mt-1 text-2xl font-bold text-[#16a34a] sm:text-3xl">
                {loading ? "—" : card.value}
              </p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="mt-8 flex flex-wrap gap-2">
          {filterButtons.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                filter === key
                  ? "bg-[#16a34a] text-white"
                  : "border border-gray-200 bg-white text-gray-700 hover:border-[#16a34a]/40 hover:bg-[#16a34a]/5"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {error && (
          <p
            className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            role="alert"
          >
            {error}
          </p>
        )}

        {/* Table */}
        <div className="mt-6 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-[#16a34a]" />
            </div>
          ) : filteredReports.length === 0 ? (
            <p className="py-16 text-center text-sm text-gray-500">
              No reports match this filter.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/80">
                    <th className="px-4 py-3 font-semibold text-gray-900">
                      Date
                    </th>
                    <th className="px-4 py-3 font-semibold text-gray-900">
                      Description
                    </th>
                    <th className="px-4 py-3 font-semibold text-gray-900">
                      Area
                    </th>
                    <th className="px-4 py-3 font-semibold text-gray-900">
                      Severity
                    </th>
                    <th className="px-4 py-3 font-semibold text-gray-900">
                      Status
                    </th>
                    <th className="px-4 py-3 font-semibold text-gray-900">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredReports.map((report) => {
                    const isResolved =
                      normalizeStatus(report.status) === "resolved";
                    return (
                      <tr key={report.id} className="hover:bg-gray-50/50">
                        <td className="whitespace-nowrap px-4 py-3 text-gray-600">
                          {formatDate(report.created_at)}
                        </td>
                        <td className="max-w-[200px] truncate px-4 py-3 text-gray-800">
                          {report.description?.trim() || "—"}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-gray-600">
                          {formatArea(report.lat, report.lng)}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${severityBadgeClass(report.severity)}`}
                          >
                            {report.severity}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
                              isResolved
                                ? "bg-[#16a34a]/10 text-[#16a34a]"
                                : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {report.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {isResolved ? (
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-[#16a34a]">
                              <CheckCircle2 className="h-4 w-4" />
                              Done
                            </span>
                          ) : (
                            <button
                              type="button"
                              disabled={updatingId === report.id}
                              onClick={() => handleMarkResolved(report.id)}
                              className="whitespace-nowrap rounded-lg bg-[#16a34a] px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#15803d] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {updatingId === report.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                "Mark Resolved"
                              )}
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
