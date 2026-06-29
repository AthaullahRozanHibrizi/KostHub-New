"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";

const MapEmbed = dynamic(() => import("./MapEmbedInner"), {
  ssr: false,
  loading: () => (
    <div className="h-64 rounded-2xl bg-gray-800/50 flex items-center justify-center border border-white/5">
      <p className="text-gray-500 text-sm">Memuat peta...</p>
    </div>
  ),
});

interface MapEmbedProps {
  lat: number;
  lng: number;
  name: string;
}

export function MapEmbedWrapper({ lat, lng, name }: MapEmbedProps) {
  return <MapEmbed lat={lat} lng={lng} name={name} />;
}
