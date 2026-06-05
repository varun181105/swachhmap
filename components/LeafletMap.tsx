"use client";

import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import type { WasteReport } from "@/lib/types";
import "leaflet/dist/leaflet.css";

const CHANDIGARH_CENTER: [number, number] = [30.7333, 76.7794];
const DEFAULT_ZOOM = 12;

function severityColor(severity: string): string {
  switch (severity.toLowerCase()) {
    case "high":
      return "#dc2626";
    case "medium":
      return "#ea580c";
    case "low":
    default:
      return "#16a34a";
  }
}

function createSeverityIcon(severity: string) {
  const color = severityColor(severity);
  return L.divIcon({
    className: "",
    html: `<div style="background-color:${color};width:22px;height:22px;border-radius:50%;border:2.5px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.35)"></div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    popupAnchor: [0, -11],
  });
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

type LeafletMapProps = {
  reports: WasteReport[];
};

export default function LeafletMap({ reports }: LeafletMapProps) {
  return (
    <MapContainer
      center={CHANDIGARH_CENTER}
      zoom={DEFAULT_ZOOM}
      className="h-full w-full z-0"
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {reports.map((report) => (
        <Marker
          key={report.id}
          position={[report.lat, report.lng]}
          icon={createSeverityIcon(report.severity)}
        >
          <Popup>
            <div className="min-w-[180px] max-w-[240px] space-y-2 text-sm text-gray-800">
              <p>
                <span className="font-semibold">Description:</span>{" "}
                {report.description?.trim() || "No description"}
              </p>
              <p>
                <span className="font-semibold">Severity:</span>{" "}
                <span
                  className="font-medium"
                  style={{ color: severityColor(report.severity) }}
                >
                  {capitalize(report.severity)}
                </span>
              </p>
              <p>
                <span className="font-semibold">Status:</span>{" "}
                {capitalize(report.status)}
              </p>
              <p>
                <span className="font-semibold">Date:</span>{" "}
                {formatDate(report.created_at)}
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
