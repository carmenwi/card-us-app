"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Volume2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCardStore } from "@/context/card-store";
import {
  FRAME_GRADIENT,
  FRAME_PADDING,
  RARITY_BACK_BG,
  RARITY_STATS_STRIP,
  RARITY_VALUE_GRADIENT,
  RARITY_GLOW,
  RARITY_AURA_ICON,
  RARITY_SPOTLIGHT,
} from "@/lib/rarity";
import type { CardRarity } from "@/lib/rarity";

const DEFAULT_FAV_CARD = {
  id: "fav-1",
  image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&h=800&fit=crop",
  rarity: "legendary" as const,
  title: "Mystic Snow",
  stats: { charisma: 92, style: 88, nature: 95, aura: 1200 },
  description: "Main character energy detected. Haters are freezing. The feline energy is immaculate.",
  hasAudio: true,
};

function rarityFromString(r: string): CardRarity {
  const lower = r.toLowerCase();
  if (lower === "legendary") return "legendary";
  if (lower === "rare") return "rare";
  if (lower === "common") return "common";
  return "special";
}

/** Compact StatPill for profile featured card — fits inside card. */
function StatPill({
  rarity,
  label,
  value,
}: {
  rarity: CardRarity;
  label: string;
  value: number;
}) {
  return (
    <div
      className={cn(
        "px-1.5 py-0.5 rounded-md bg-white/15 backdrop-blur-sm border border-white/30",
        "shadow-sm"
      )}
    >
      <span className="text-[8px] font-semibold uppercase tracking-wider text-white/80">
        {label}
      </span>
      <span
        className={cn(
          "ml-0.5 text-xs font-bold tabular-nums",
          "bg-gradient-to-r bg-clip-text text-transparent",
          RARITY_VALUE_GRADIENT[rarity]
        )}
      >
        {value}
      </span>
    </div>
  );
}

export function FeaturedCard() {
  const { favoriteCard } = useCardStore();
  const [isFlipped, setIsFlipped] = useState(false);

  const card = favoriteCard
    ? {
        image: favoriteCard.imagePreview,
        title: favoriteCard.title,
        description: favoriteCard.description,
        stats: favoriteCard.stats,
        rarity: rarityFromString(favoriteCard.rarity),
        rarityLabel: favoriteCard.rarity,
        hasAudio: !!favoriteCard.hasAudio,
      }
    : {
        image: DEFAULT_FAV_CARD.image,
        title: DEFAULT_FAV_CARD.title,
        description: DEFAULT_FAV_CARD.description,
        stats: DEFAULT_FAV_CARD.stats,
        rarity: rarityFromString(DEFAULT_FAV_CARD.rarity),
        rarityLabel: DEFAULT_FAV_CARD.rarity,
        hasAudio: DEFAULT_FAV_CARD.hasAudio,
      };

  const gradient = FRAME_GRADIENT[card.rarity];
  const backBg = RARITY_BACK_BG[card.rarity];
  const isLegendary = card.rarity === "legendary";

  const frameRadius = "rounded-xl";

  return (
    <section className={cn("mb-4 relative w-full overflow-visible pb-20")}>
      <div className="relative w-full max-w-[200px] mx-auto overflow-visible">
        {/* Extra glow layer - extends far behind everything */}
        <div
          className={cn(
            "fixed inset-0 -m-20 rounded-3xl blur-3xl opacity-80 mix-blend-lighten pointer-events-none -z-50",
            RARITY_GLOW[card.rarity]
          )}
          aria-hidden
        />
        {/* Glow behind card — matches rarity */}
        <div
          className={cn(
            "absolute inset-0 -m-10 rounded-2xl blur-lg opacity-100 mix-blend-lighten pointer-events-none",
            RARITY_GLOW[card.rarity]
          )}
          aria-hidden
        />
        {/* Strong spotlight under card — rarity-colored cone */}
        <div
          className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-full pointer-events-none opacity-100"
          style={{ 
            background: RARITY_SPOTLIGHT[card.rarity],
            height: "300px",
            filter: "blur(30px)"
          }}
          aria-hidden
        />
        <div
          className="relative z-10 w-full cursor-pointer perspective-[1000px]"
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <motion.div
            className="relative w-full"
            initial={false}
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 80, damping: 18 }}
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Front — filled gradient border like Create Card (FRAME_PADDING = thick border) */}
            <div
              className={cn(frameRadius, "[backface-visibility:hidden]")}
              style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" as const }}
            >
              <div className={cn("relative rounded-xl overflow-hidden", FRAME_PADDING, gradient)}>
                {isLegendary && (
                  <>
                    <Sparkles className="absolute top-0.5 left-1 w-2.5 h-2.5 text-white/90 z-10" />
                    <Sparkles className="absolute top-0.5 right-1 w-2.5 h-2.5 text-white/90 z-10" />
                    <Sparkles className="absolute bottom-0.5 left-1 w-2.5 h-2.5 text-white/90 z-10" />
                    <Sparkles className="absolute bottom-0.5 right-1 w-2.5 h-2.5 text-white/90 z-10" />
                  </>
                )}
                <div className="relative aspect-[3/4] rounded-t-[10px] overflow-hidden bg-muted">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-1 left-1 z-10 inline-flex items-center gap-1 rounded-md bg-white/90 px-1.5 py-0.5 text-[10px] font-bold text-red-500 shadow">
                    <span aria-hidden className="text-red-500">❤</span>
                    FAV
                  </div>
                  <div
                    className={cn(
                      "absolute top-1 right-1 z-10 flex items-center gap-0.5 rounded px-1.5 py-0.5",
                      "bg-black/50 backdrop-blur-sm border border-white/20 shadow-sm"
                    )}
                    aria-label={`${card.stats.aura} Aura`}
                  >
                    <Sparkles className={cn("w-3 h-3", RARITY_AURA_ICON[card.rarity])} />
                    <span className="text-[10px] font-bold tabular-nums text-white">
                      {card.stats.aura}
                    </span>
                  </div>
                </div>
                <div
                  className={cn(
                    "rounded-b-[10px] -mt-0.5 flex items-center justify-center gap-1 py-1.5 px-1 min-h-[36px]",
                    "border-t border-white/20 shadow-inner",
                    RARITY_STATS_STRIP[card.rarity]
                  )}
                >
                  <StatPill rarity={card.rarity} label="CHR" value={card.stats.charisma} />
                  <StatPill rarity={card.rarity} label="STY" value={card.stats.style} />
                  <StatPill rarity={card.rarity} label="NAT" value={card.stats.nature} />
                </div>
              </div>
            </div>

            {/* Back — same as Create Card: rarity bg, label, title, description, "Toca para ver el frente" */}
            <div
              className={cn(
                "absolute inset-0 rounded-xl p-4 flex flex-col justify-center text-white [backface-visibility:hidden]",
                backBg
              )}
              style={{
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden" as const,
                transform: "rotateY(180deg)",
              }}
            >
              <p className="text-[10px] font-medium text-white/80 uppercase tracking-wider mb-1">
                {card.rarityLabel}
              </p>
              <h3 className="text-sm font-bold mb-1.5 line-clamp-2">{card.title}</h3>
              <p className="text-[10px] text-white/95 leading-relaxed line-clamp-4">
                {card.description}
              </p>
              {card.hasAudio && (
                <div className="mt-2 flex items-center gap-1 text-white/80">
                  <Volume2 className="w-3 h-3" />
                  <span className="text-[10px]">Audio</span>
                </div>
              )}
              <p className="text-[10px] text-white/70 mt-2">Tap to see the front</p>
            </div>
          </motion.div>
        </div>
      </div>
      <p className="text-xs text-muted-foreground mt-2 text-center">Tap to flip card</p>
    </section>
  );
}
