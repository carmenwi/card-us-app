"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { FlippableCard, type CardStatsData } from "./flippable-card";
import { FRAME_GRADIENT, type CardRarity } from "@/lib/rarity";

export function EnvelopeCard() {
  const [isOpen, setIsOpen] = useState(false);
  const sender = "neon_rider";
  const cardData: CardStatsData = {
    title: "Sunset Drift",
    description: "A surprise pull from a friend. Golden hour energy.",
    rarity: "special" as CardRarity,
    cardImage: "/mock-images/card-photos/couple-trip.png",
    stats: { charisma: 72, style: 88, nature: 64, aura: 1200 },
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => setIsOpen((prev) => !prev)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setIsOpen((prev) => !prev);
        }
      }}
      className="w-full rounded-2xl bg-card border border-border shadow-sm p-4 text-left cursor-pointer"
      aria-label="Open mystery envelope"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-foreground">Mystery Envelope</h3>
        <span className="text-[10px] text-muted-foreground">
          Tap to {isOpen ? "close" : "open"}
        </span>
      </div>

      <div className="relative w-full h-[200px]">
        {/* Card inside */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2"
          initial={false}
          animate={{ y: isOpen ? -50 : 30, opacity: isOpen ? 1 : 0.7 }}
          transition={{ duration: 0.4 }}
        >
          <div
            className={cn(
              "w-[140px] rounded-xl overflow-hidden shadow-lg",
              FRAME_GRADIENT[cardData.rarity],
              "p-1.5"
            )}
          >
            <FlippableCard data={cardData} size="sm" />
          </div>
          <p className="mt-1 text-[10px] text-center text-muted-foreground">
            From @{sender}
          </p>
        </motion.div>

        {/* Envelope body */}
        <div className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-[220px] h-[120px]">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#FDE68A] to-[#F59E0B] border border-[#F59E0B]/40 shadow-md" />
          <div className="absolute inset-0 rounded-2xl border border-white/30" />

          {/* Envelope flap */}
          <motion.div
            className="absolute left-0 right-0 top-0 mx-auto h-[60px]"
            initial={false}
            animate={{ rotateX: isOpen ? 180 : 0 }}
            transition={{ duration: 0.4 }}
            style={{ transformOrigin: "top", perspective: 600 }}
          >
            <div
              className="w-full h-full rounded-t-2xl"
              style={{
                background:
                  "linear-gradient(135deg, rgba(251,191,36,0.95), rgba(245,158,11,0.95))",
                clipPath: "polygon(0 0, 100% 0, 50% 100%)",
              }}
            />
          </motion.div>

          {/* Envelope front */}
          <div
            className="absolute left-0 right-0 bottom-0 h-[70px]"
            style={{
              background:
                "linear-gradient(180deg, rgba(251,191,36,0.95), rgba(245,158,11,0.95))",
              clipPath: "polygon(0 0, 50% 60%, 100% 0, 100% 100%, 0 100%)",
              borderRadius: "0 0 16px 16px",
            }}
          />
        </div>
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        A friend sent you a surprise card. Tap to reveal it.
      </p>
    </div>
  );
}
