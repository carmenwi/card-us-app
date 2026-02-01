"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import type { ProfileCollection } from "@/lib/profile-collections";

type CollectionWidgetProps = {
  collection: ProfileCollection;
  onClick: () => void;
  className?: string;
};

/** Single collection widget — square, used as a profile section. */
export function CollectionWidget({ collection, onClick, className }: CollectionWidgetProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full rounded-2xl px-4 py-3 transition-all flex flex-col items-center justify-center gap-1.5",
        "bg-card/80 dark:bg-card/90 border border-border shadow-sm backdrop-blur-sm",
        "hover:shadow-lg hover:border-[#8B5CF6]/40 hover:scale-[1.02] active:scale-[0.98]",
        className
      )}
    >
      <div className="relative shrink-0 w-12 h-12 rounded-full overflow-hidden bg-muted border-2 border-background shadow-inner ring-2 ring-black/5">
        {collection.cards.slice(0, 3).map((card, i) => (
          <div
            key={card.id}
            className="absolute rounded-full overflow-hidden border-2 border-background shadow-sm"
            style={{
              width: "58%",
              height: "58%",
              left: i === 0 ? "0%" : i === 1 ? "21%" : "42%",
              top: i === 0 ? "0%" : i === 1 ? "21%" : "42%",
              zIndex: 3 - i,
            }}
          >
            <Image
              src={card.image}
              alt=""
              width={56}
              height={56}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
      <p className="text-sm font-semibold text-foreground truncate w-full text-center">
        {collection.name}
      </p>
      <p className="text-xs text-muted-foreground">
        {collection.cards.length} card{collection.cards.length !== 1 ? "s" : ""}
      </p>
    </button>
  );
}
