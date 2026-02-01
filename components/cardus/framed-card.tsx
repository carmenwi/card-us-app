"use client";

import { cn } from "@/lib/utils";
import { FRAME_GRADIENT, FRAME_PADDING } from "@/lib/rarity";
import type { CardRarity } from "@/lib/rarity";
import { Sparkles } from "lucide-react";

/** Aspect ratio matching card display. */
const CARD_ASPECT = "aspect-[3/4]";

interface FramedCardProps {
  photoSrc: string;
  rarity: CardRarity;
  frameGradient?: string;
  alt: string;
  className?: string;
  score?: string;
  scoreGradient?: string;
  /** Sparkles en el borde cuando es legendary */
  showSparkles?: boolean;
}

export function FramedCard({
  photoSrc,
  rarity,
  frameGradient,
  alt,
  className,
  score,
  scoreGradient = "from-[#3B82F6] to-[#8B5CF6]",
  showSparkles = false,
}: FramedCardProps) {
  const gradient = frameGradient ?? FRAME_GRADIENT[rarity];

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-2xl",
        FRAME_PADDING,
        gradient,
        className
      )}
    >
      {showSparkles && rarity === "legendary" && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-visible z-10">
          {[...Array(6)].map((_, i) => (
            <Sparkles
              key={i}
              className="absolute w-3 h-3 text-white/90 drop-shadow-sm"
              style={{
                top: `${15 + (i % 3) * 35}%`,
                left: `${10 + (i % 2) * 80}%`,
                transform: `rotate(${i * 60}deg)`,
              }}
            />
          ))}
        </div>
      )}
      <div className={cn("relative w-full rounded-[10px] overflow-hidden bg-muted", CARD_ASPECT)}>
        <img
          src={photoSrc}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover"
        />
        {score && (
          <div
            className={cn(
              "absolute bottom-1 right-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold text-white bg-gradient-to-r",
              scoreGradient
            )}
          >
            {score}
          </div>
        )}
      </div>
    </div>
  );
}
