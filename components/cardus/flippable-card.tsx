"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  type CardRarity,
  RARITY_STYLES,
  RARITY_LABELS,
  FRAME_GRADIENT,
  FRAME_PADDING,
  RARITY_BACK_BG,
  RARITY_STATS_STRIP,
  RARITY_VALUE_GRADIENT,
  RARITY_AURA_ICON,
} from "@/lib/rarity";

export interface CardStatsData {
  title: string;
  stats: {
    charisma: number;
    style: number;
    nature: number;
    aura: number;
  };
  description: string;
  rarity: CardRarity;
  cardImage: string;
  tradeFrom?: string;
  tradeDate?: number;
}

interface FlippableCardProps {
  data: CardStatsData;
  className?: string;
  onClick?: () => void;
  size?: "sm" | "md" | "lg";
}

const CARD_ASPECT = "aspect-[3/4]";

/** Compact StatPill for card stats — fits inside card. */
function StatPill({
  rarity,
  label,
  value,
  size = "md",
}: {
  rarity: CardRarity;
  label: string;
  value: number;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClasses = {
    sm: "px-1 py-0.5 text-[7px]",
    md: "px-1.5 py-0.5 text-[8px]",
    lg: "px-2 py-1 text-[9px]",
  };
  
  const valueClasses = {
    sm: "text-[10px]",
    md: "text-xs",
    lg: "text-sm",
  };

  return (
    <div
      className={cn(
        "rounded bg-white/15 backdrop-blur-sm border border-white/30 shadow-sm",
        sizeClasses[size]
      )}
    >
      <span className="font-semibold uppercase tracking-wide text-white/80">
        {label}
      </span>
      <span
        className={cn(
          "ml-0.5 font-bold tabular-nums",
          "bg-gradient-to-r bg-clip-text text-transparent",
          RARITY_VALUE_GRADIENT[rarity],
          valueClasses[size]
        )}
      >
        {value}
      </span>
    </div>
  );
}

export function FlippableCard({
  data,
  className,
  onClick,
  size = "md",
}: FlippableCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const style = RARITY_STYLES[data.rarity];
  const frameGradient = FRAME_GRADIENT[data.rarity];
  const backBg = RARITY_BACK_BG[data.rarity];
  const statsStrip = RARITY_STATS_STRIP[data.rarity];

  const stripHeightClasses = {
    sm: "min-h-[28px] gap-0.5 py-1 px-0.5",
    md: "min-h-[36px] gap-1 py-1.5 px-1",
    lg: "min-h-[42px] gap-1.5 py-2 px-1.5",
  };

  const auraClasses = {
    sm: { icon: "w-2.5 h-2.5", text: "text-[9px]", padding: "px-1 py-0.5" },
    md: { icon: "w-3 h-3", text: "text-[10px]", padding: "px-1.5 py-0.5" },
    lg: { icon: "w-3.5 h-3.5", text: "text-xs", padding: "px-2 py-1" },
  };

  const backTextClasses = {
    sm: { label: "text-[8px]", title: "text-sm", desc: "text-xs", spacing: "mb-2" },
    md: { label: "text-[10px]", title: "text-lg", desc: "text-sm", spacing: "mb-3" },
    lg: { label: "text-[11px]", title: "text-xl", desc: "text-base", spacing: "mb-3" },
  };

  return (
    <motion.div
      className={cn("relative w-full", CARD_ASPECT, className)}
      onClick={() => setIsFlipped(!isFlipped)}
      style={{ perspective: 1000 }}
    >
      <motion.div
        className="w-full h-full relative"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front - Card Image with Stats Strip */}
        <div
          className={cn("absolute inset-0 w-full h-full rounded-[10px] overflow-hidden", frameGradient, FRAME_PADDING)}
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="relative w-full h-full flex flex-col">
            {/* Image */}
            <div className="relative aspect-[3/4] rounded-t-[10px] overflow-hidden bg-muted flex-1">
              <img
                src={data.cardImage}
                alt={data.title}
                className="w-full h-full object-cover"
              />

              {/* Aura badge top-right */}
              <div
                className={cn(
                  "absolute top-1 right-1 z-10 flex items-center gap-0.5 rounded",
                  "bg-black/50 backdrop-blur-sm border border-white/20 shadow-sm",
                  auraClasses[size].padding
                )}
              >
                <Sparkles className={cn(auraClasses[size].icon, RARITY_AURA_ICON[data.rarity])} />
                <span className={cn("font-bold tabular-nums text-white", auraClasses[size].text)}>
                  {data.stats.aura}
                </span>
              </div>
            </div>

            {/* Stats Strip */}
            <div
              className={cn(
                "rounded-b-[10px] flex items-center justify-center",
                "border-t border-white/20 shadow-inner",
                statsStrip,
                stripHeightClasses[size]
              )}
            >
              <StatPill rarity={data.rarity} label="CHR" value={data.stats.charisma} size={size} />
              <StatPill rarity={data.rarity} label="STY" value={data.stats.style} size={size} />
              <StatPill rarity={data.rarity} label="NAT" value={data.stats.nature} size={size} />
            </div>
          </div>
        </div>

        {/* Back - Rarity info, title, description */}
        <div
          className={cn(
            "absolute inset-0 w-full h-full rounded-[10px] flex flex-col justify-center items-center text-white overflow-hidden",
            size === "sm" ? "p-2 py-3" : size === "md" ? "p-3 py-4" : "p-4 py-5"
          )}
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden" as const,
            transform: "rotateY(180deg)",
            background: backBg,
          }}
        >
          {data.tradeFrom ? (
            <>
              <p className={cn("font-medium text-white/80 uppercase tracking-wider", size === "sm" ? "text-[6px]" : size === "md" ? "text-[7px]" : "text-[8px]", "mb-0.5")}>
                Traded From
              </p>
              <p className={cn("font-bold text-white", size === "sm" ? "text-xs" : size === "md" ? "text-sm" : "text-base", "mb-0.5")}>
                {data.tradeFrom.startsWith("@") ? data.tradeFrom.substring(1) : data.tradeFrom}
              </p>
              <p className={cn("text-white/90 text-center font-medium", size === "sm" ? "text-[9px]" : size === "md" ? "text-[10px]" : "text-xs", "mb-0.5 line-clamp-2 px-1")}>
                Their: {data.title}
              </p>
              {data.tradeDate && (
                <p className={cn("text-white/70 text-center", size === "sm" ? "text-[7px]" : size === "md" ? "text-[8px]" : "text-[9px]", "mb-1")}>
                  {new Date(data.tradeDate).toLocaleDateString()}
                </p>
              )}
              <div className="h-px w-10 bg-white/30 mb-1.5"></div>
              <p className={cn("font-medium text-white/80 uppercase tracking-wider", size === "sm" ? "text-[6px]" : size === "md" ? "text-[7px]" : "text-[8px]", "mb-1")}>
                {RARITY_LABELS[data.rarity]}
              </p>
              <p className={cn("text-white/95 leading-snug text-center px-2 line-clamp-3", size === "sm" ? "text-[9px]" : size === "md" ? "text-[10px]" : "text-xs")}>
                {data.description}
              </p>
            </>
          ) : (
            <>
              <p className={cn("font-medium text-white/80 uppercase tracking-wider", backTextClasses[size].label, backTextClasses[size].spacing)}>
                {RARITY_LABELS[data.rarity]}
              </p>
              <h3 className={cn("font-bold line-clamp-2 text-center", backTextClasses[size].title, backTextClasses[size].spacing)}>
                {data.title}
              </h3>
              <p className={cn("text-white/95 leading-relaxed text-center flex-1 flex items-center", backTextClasses[size].desc)}>
                {data.description}
              </p>
            </>
          )}
          <button
            className={cn(
              "absolute rounded-full bg-white/20 hover:bg-white/30 transition-colors",
              size === "sm" ? "bottom-1.5 right-1.5 p-1" : "bottom-3 right-3 p-1.5"
            )}
            aria-label="Audio"
          >
            <Volume2 className={cn("text-white", size === "sm" ? "w-3 h-3" : "w-4 h-4")} />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
