"use client";

import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { FRAME_GRADIENT, FRAME_PADDING } from "@/lib/rarity";
import { FlippableCard, type CardStatsData } from "./flippable-card";
import type { ProfileCollection } from "@/lib/profile-collections";

type CollectionGalleryProps = {
  collection: ProfileCollection;
  onBack: () => void;
};

export function CollectionGallery({ collection, onBack }: CollectionGalleryProps) {
  return (
    <div className="animate-in fade-in duration-200">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card sticky top-0 z-10">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-muted hover:bg-muted/80 text-foreground transition-colors"
          aria-label="Back to profile"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold text-foreground truncate flex-1">
          {collection.name}
        </h1>
      </div>

      <div className="p-4 pb-28">
        <p className="text-xs text-muted-foreground mb-4">
          {collection.cards.length} card{collection.cards.length !== 1 ? "s" : ""}
        </p>
        <div className="grid grid-cols-2 gap-4">
          {collection.cards.map((card) => {
            const cardData: CardStatsData = {
              title: card.title,
              description: card.description || "No description",
              rarity: card.rarity,
              cardImage: card.image,
              stats: card.stats || { charisma: 50, style: 50, nature: 50, aura: 0 },
              tradeFrom: (card as any).tradeFrom,
              tradeDate: (card as any).tradeDate,
            };
            return (
              <div key={card.id} className={cn("rounded-xl overflow-hidden", FRAME_PADDING, FRAME_GRADIENT[card.rarity])}>
                <FlippableCard data={cardData} className="rounded-[10px]" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
