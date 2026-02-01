"use client";

import Image from "next/image";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

export type MapSize = "full" | "half";

/** Fewer pins, clustered down-right (lat/lng ~0.55–0.9). */
const MAP_PINS = [
  { id: "1", lat: 0.62, lng: 0.68, color: "purple" as const },
  { id: "2", lat: 0.72, lng: 0.78, color: "blue" as const },
  { id: "3", lat: 0.58, lng: 0.82, color: "green" as const },
  { id: "4", lat: 0.78, lng: 0.62, color: "gray" as const },
  { id: "5", lat: 0.68, lng: 0.72, color: "purple" as const },
];

const pinColors = {
  purple: "text-[#8B5CF6] fill-[#8B5CF6]",
  blue: "text-[#3B82F6] fill-[#3B82F6]",
  green: "text-emerald-500 fill-emerald-500",
  gray: "text-gray-500 fill-gray-500",
};

type ProfileMapProps = {
  size?: MapSize;
  inGrid?: boolean;
};

export function ProfileMap({ size = "full", inGrid }: ProfileMapProps) {
  return (
    <section className={cn(!inGrid && "mx-4", !inGrid && "mb-4", inGrid && "pb-2") }>
      <div className="rounded-3xl overflow-hidden border border-border bg-muted/50 shadow-sm">
        <div
          className={cn(
            "relative bg-muted",
            size === "half" ? "aspect-[16/9]" : "aspect-[4/3]"
          )}
        >
          <Image
            src="/mock-images/map.jpeg"
            alt="Map of card locations"
            fill
            className="object-cover"
            sizes="(max-width: 448px) 100vw, 448px"
          />
          {/* Overlay so pins stand out */}
          <div className="absolute inset-0 bg-black/10 pointer-events-none" />

          {/* Pins: purple, blue, green, gray */}
          {MAP_PINS.map((pin) => (
            <div
              key={pin.id}
              className="absolute transform -translate-x-1/2 -translate-y-full z-10"
              style={{ left: `${pin.lng * 100}%`, top: `${pin.lat * 100}%` }}
            >
              <MapPin className={cn("w-6 h-6 drop-shadow-lg", pinColors[pin.color])} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
