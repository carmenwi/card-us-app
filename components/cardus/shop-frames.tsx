"use client";

import { Sparkles } from "lucide-react";
import { FramedCard } from "./framed-card";
import { EXTRA_FRAME_GRADIENTS } from "@/lib/rarity";
import type { CardRarity } from "@/lib/rarity";
import { cn } from "@/lib/utils";

const PREVIEW_PHOTO = "/mock-images/card-photos/cat-sofa.png";

export interface ShopFrame {
  id: string;
  name: string;
  /** Rank for frame gradient (legendary=purple, rare=pink, common=green, special=blue). */
  rarity: CardRarity;
  /** Optional override for shop-only styles (e.g. amber, neon). */
  frameGradient?: string;
  priceAura: number;
  owned?: boolean;
  accent?: "purple" | "blue" | "pink" | "green" | "amber";
}

const SHOP_FRAMES: ShopFrame[] = [
  { id: "legend", name: "Legendary", rarity: "legendary", priceAura: 5000, accent: "purple" },
  { id: "special", name: "Special", rarity: "special", priceAura: 2500, accent: "blue" },
  { id: "rare", name: "Rare", rarity: "rare", priceAura: 1200, accent: "pink" },
  { id: "common", name: "Common", rarity: "common", priceAura: 500, accent: "green" },
  { id: "google_special", name: "Google Special", rarity: "legendary", frameGradient: EXTRA_FRAME_GRADIENTS.amber, priceAura: 8000, accent: "amber" },
  { id: "neon", name: "Neon", rarity: "special", frameGradient: EXTRA_FRAME_GRADIENTS.neon, priceAura: 3000, accent: "blue" },
  { id: "glitch", name: "Glitch", rarity: "rare", priceAura: 3500, accent: "pink" },
  { id: "retro", name: "Retro", rarity: "common", priceAura: 1800, accent: "amber" },
];

const accentBorder: Record<string, string> = {
  purple: "border-[#8B5CF6]/40 shadow-[#8B5CF6]/10",
  blue: "border-[#3B82F6]/40 shadow-[#3B82F6]/10",
  pink: "border-pink-500/40 shadow-pink-500/10",
  green: "border-emerald-500/40 shadow-emerald-500/10",
  amber: "border-amber-500/40 shadow-amber-500/10",
};

export function ShopFrames() {
  return (
    <section className="mb-8">
      <h2 className="text-sm font-bold text-foreground mb-3 px-1 flex items-center gap-2">
        <span className="w-1 h-4 rounded-full bg-gradient-to-b from-[#3B82F6] to-[#8B5CF6]" />
        Card Frames
      </h2>
      <p className="text-xs text-muted-foreground mb-4 px-1">
        Custom frames for your cards (rank colors). Use Aura to unlock.
      </p>
      <div className="grid grid-cols-2 gap-4">
        {SHOP_FRAMES.map((frame) => (
          <div
            key={frame.id}
            className={cn(
              "rounded-3xl border bg-card/80 backdrop-blur-sm shadow-lg overflow-hidden",
              "transition-all hover:shadow-xl hover:scale-[1.02]",
              accentBorder[frame.accent ?? "blue"]
            )}
          >
            <div className="p-2">
              <div className="rounded-2xl overflow-hidden border border-border">
                <FramedCard
                  photoSrc={PREVIEW_PHOTO}
                  rarity={frame.rarity}
                  frameGradient={frame.frameGradient}
                  alt={frame.name}
                  showSparkles={frame.rarity === "legendary"}
                />
              </div>
            </div>
            <div className="px-3 pb-3 pt-0 flex flex-col gap-2">
              <p className="text-sm font-semibold text-foreground truncate">
                {frame.name}
              </p>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1 min-w-0">
                  <Sparkles className="w-3.5 h-3.5 text-[#8B5CF6] shrink-0" />
                  <span className="text-xs font-bold bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] bg-clip-text text-transparent truncate">
                    {frame.priceAura.toLocaleString("en-US")} Aura
                  </span>
                </div>
                <button
                  className={cn(
                    "shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors",
                    "bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] text-white",
                    "hover:opacity-90 active:scale-95"
                  )}
                >
                  {frame.owned ? "Owned" : "Buy"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
