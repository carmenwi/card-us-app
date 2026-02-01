"use client";

import { useState } from "react";
import { ArrowLeftRight, Sparkles } from "lucide-react";
import { FramedCard } from "./framed-card";
import type { CardRarity } from "@/lib/rarity";
import { cn } from "@/lib/utils";

interface TradeCard {
  id: string;
  photo: string;
  rarity: CardRarity;
  from?: string;
}

const MY_OFFERS: TradeCard[] = [
  { id: "o1", photo: "/mock-images/card-photos/gymgirl.png", rarity: "rare" },
  { id: "o2", photo: "/mock-images/card-photos/lake.png", rarity: "common" },
  { id: "o3", photo: "/mock-images/card-photos/pasta.JPG", rarity: "common" },
];

const INCOMING_TRADES: TradeCard[] = [
  { id: "i1", photo: "/mock-images/card-photos/cat-in-chair.png", rarity: "legendary", from: "@sophia" },
  { id: "i2", photo: "/mock-images/card-photos/ramen.png", rarity: "special", from: "@foodie_tok" },
  { id: "i3", photo: "/mock-images/card-photos/couple-trip.png", rarity: "rare", from: "@wanderlust" },
];

export function TradeCentre() {
  const [selectedOffer, setSelectedOffer] = useState<string | null>(null);
  const [selectedIncoming, setSelectedIncoming] = useState<string | null>(null);
  const [isExchanging, setIsExchanging] = useState(false);

  const canExchange = selectedOffer && selectedIncoming;

  const handleExchange = () => {
    if (!canExchange) return;
    setIsExchanging(true);
    setTimeout(() => {
      setIsExchanging(false);
      setSelectedOffer(null);
      setSelectedIncoming(null);
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Split: My Offers | Incoming Trades */}
      <div className="grid grid-cols-2 gap-4">
        {/* My Offers */}
        <section className="min-w-0">
          <h2 className="text-sm font-bold text-foreground mb-3 px-1 flex items-center gap-2">
            <span className="w-1 h-4 rounded-full bg-gradient-to-b from-[#3B82F6] to-[#8B5CF6]" />
            My Offers
          </h2>
          <div className="space-y-3">
            {MY_OFFERS.map((card) => (
              <button
                key={card.id}
                onClick={() => setSelectedOffer(selectedOffer === card.id ? null : card.id)}
                className={cn(
                  "w-full rounded-2xl overflow-hidden border-2 transition-all",
                  selectedOffer === card.id
                    ? "border-[#3B82F6] shadow-lg shadow-[#3B82F6]/20 ring-2 ring-[#3B82F6]/30"
                    : "border-border hover:border-[#3B82F6]/50"
                )}
              >
                <FramedCard
                  photoSrc={card.photo}
                  rarity={card.rarity}
                  alt={`Offer ${card.id}`}
                />
              </button>
            ))}
          </div>
        </section>

        {/* Incoming Trades */}
        <section className="min-w-0">
          <h2 className="text-sm font-bold text-foreground mb-3 px-1 flex items-center gap-2">
            <span className="w-1 h-4 rounded-full bg-gradient-to-b from-[#8B5CF6] to-pink-500" />
            Incoming
          </h2>
          <div className="space-y-3">
            {INCOMING_TRADES.map((card) => (
              <button
                key={card.id}
                onClick={() => setSelectedIncoming(selectedIncoming === card.id ? null : card.id)}
                className={cn(
                  "w-full rounded-2xl overflow-hidden border-2 transition-all",
                  selectedIncoming === card.id
                    ? "border-[#8B5CF6] shadow-lg shadow-[#8B5CF6]/20 ring-2 ring-[#8B5CF6]/30"
                    : "border-border hover:border-[#8B5CF6]/50"
                )}
              >
                <FramedCard
                  photoSrc={card.photo}
                  rarity={card.rarity}
                  alt={card.from ?? `Incoming ${card.id}`}
                />
                {card.from && (
                  <p className="text-[10px] font-medium text-muted-foreground truncate px-1 py-0.5 bg-card/90">
                    {card.from}
                  </p>
                )}
              </button>
            ))}
          </div>
        </section>
      </div>

      {/* Exchange button — center, with animation */}
      <div className="flex justify-center pt-2">
        <button
          onClick={handleExchange}
          disabled={!canExchange}
          className={cn(
            "flex items-center gap-2 px-8 py-4 rounded-3xl font-semibold text-white",
            "bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6]",
            "shadow-lg shadow-[#8B5CF6]/30",
            "transition-all duration-300",
            canExchange
              ? "hover:shadow-xl hover:scale-105 active:scale-95"
              : "opacity-50 cursor-not-allowed",
            isExchanging && "scale-110 opacity-90"
          )}
        >
          <ArrowLeftRight
            className={cn("w-5 h-5 transition-transform", isExchanging && "rotate-180")}
          />
          <span>{isExchanging ? "Exchanging…" : "Exchange"}</span>
          <Sparkles className="w-4 h-4 opacity-80" />
        </button>
      </div>

      {canExchange && (
        <p className="text-xs text-center text-muted-foreground">
          Tap Exchange to confirm the trade
        </p>
      )}
    </div>
  );
}
