"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

type HeatmapCell = {
  h3Index: string;
  count: number;
  latitude: number;
  longitude: number;
  source?: string;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

function getCellColor(count: number) {
  if (count >= 4) return "#F87171";
  if (count >= 2) return "#FBBF24";
  return "#6EE7A8";
}

function createHexagon(lat: number, lng: number, radius = 0.00135) {
  const points: [number, number][] = [];

  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i + Math.PI / 6;
    points.push([
      lat + radius * Math.sin(angle),
      lng + radius * Math.cos(angle),
    ]);
  }

  return points;
}

function drawH3Cell(L: any, map: any, cell: HeatmapCell) {
  const color = getCellColor(cell.count);
  const boundary = createHexagon(cell.latitude, cell.longitude);

  L.polygon(boundary, {
    color,
    fillColor: color,
    fillOpacity: 0.5,
    opacity: 0.95,
    weight: 2,
  })
    .bindPopup(
      `<strong>H3 Cell</strong><br/>
       ${cell.h3Index}<br/>
       Active users: ${cell.count}<br/>
       Source: ${cell.source || "real"}`
    )
    .addTo(map);
}

export default function Heatmap() {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadMap() {
      if (!mapRef.current) return;

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      mapRef.current.innerHTML = "";

      const L = (await import("leaflet")).default;

      const response = await fetch(`${API_BASE_URL}/heatmap`, {
        cache: "no-store",
      });

      const result = await response.json();
      const cells: HeatmapCell[] = result.data ?? [];

      if (!isMounted || !mapRef.current) return;

      const map = L.map(mapRef.current, {
        center: [32.0845, 34.773],
        zoom: 14,
        scrollWheelZoom: false,
        zoomControl: true,
      });

      mapInstanceRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "OpenStreetMap",
      }).addTo(map);

      cells.forEach((cell) => {
        if (cell.latitude && cell.longitude) {
          drawH3Cell(L, map, cell);
        }
      });

      setTimeout(() => {
        map.invalidateSize();
      }, 200);
    }

    loadMap();

    return () => {
      isMounted = false;

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      if (mapRef.current) {
        mapRef.current.innerHTML = "";
      }
    };
  }, []);

  return (
    <div className="relative h-[430px] overflow-hidden rounded-[28px] border border-[#DBEAFE] bg-white shadow-sm">
      <div ref={mapRef} className="h-full w-full" />

      <div className="absolute bottom-4 left-4 z-[500] rounded-2xl bg-white/85 px-4 py-3 text-[#2F3A45] shadow-lg backdrop-blur">
        <p className="text-xs font-bold">Density level</p>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-xs">Low</span>
          <span className="h-3 w-10 rounded-full bg-[#6EE7A8]" />
          <span className="h-3 w-10 rounded-full bg-[#FBBF24]" />
          <span className="h-3 w-10 rounded-full bg-[#F87171]" />
          <span className="text-xs">High</span>
        </div>
      </div>
    </div>
  );
}