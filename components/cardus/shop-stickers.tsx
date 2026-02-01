"use client";

import { Sparkles, Flame, Heart, Laugh, Zap, Star } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ShopSticker {
  id: string;
  name: string;
  icon: "flame" | "heart" | "laugh" | "zap" | "star";
  priceAura: number;
  owned?: boolean;
}

const STICKERS: ShopSticker[] = [
  { id: "flame", name: "Fire", icon: "flame", priceAura: 200 },
  { id: "heart", name: "Heart", icon: "heart", priceAura: 150 },
  { id: "laugh", name: "LOL", icon: "laugh", priceAura: 180 },
  { id: "zap", name: "Zap", icon: "zap", priceAura: 250 },
  { id: "star", name: "Star", icon: "star", priceAura: 300 },
];

const iconMap = {
  flame: Flame,
  heart: Heart,
  laugh: Laugh,
  zap: Zap,
  star: Star,
};

export function ShopStickers() {
  return (
    <section className="mb-8">
      <h2 className="text-sm font-bold text-foreground mb-3 px-1 flex items-center gap-2">
        <span className="w-1 h-4 rounded-full bg-gradient-to-b from-[#8B5CF6] to-pink-500" />
        Battle Stickers
      </h2>
      <p className="text-xs text-muted-foreground mb-4 px-1">
        React to battles with stickers. Unlock with Aura.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {STICKERS.map((sticker) => {
          const Icon = iconMap[sticker.icon];
          return (
            <button
              key={sticker.id}
              className={cn(
                "flex flex-col items-center gap-3 p-4 rounded-3xl border border-border",
                "bg-card/80 backdrop-blur-sm shadow-sm",
                "hover:border-[#8B5CF6]/40 hover:shadow-lg hover:shadow-[#8B5CF6]/10",
                "transition-all active:scale-95"
              )}
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#3B82F6]/20 to-[#8B5CF6]/20 flex items-center justify-center border border-[#8B5CF6]/20">
                <Icon className="w-7 h-7 text-[#8B5CF6]" />
              </div>
              <span className="text-sm font-semibold text-foreground">
                {sticker.name}
              </span>
              <div className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#8B5CF6]" />
                <span className="text-xs font-bold bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] bg-clip-text text-transparent">
                  {sticker.priceAura} Aura
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
