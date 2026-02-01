"use client";

import { useState } from "react";
import Image from "next/image";
import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProfileCollection } from "@/lib/profile-collections";

type CollectionsGridProps = {
  collections: ProfileCollection[];
  isEditing?: boolean;
  onSelectCollection: (collectionId: string) => void;
  onReorder?: (newOrder: string[]) => void;
};

export function CollectionsGrid({
  collections,
  isEditing = false,
  onSelectCollection,
  onReorder,
}: CollectionsGridProps) {
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, collectionId: string) => {
    setDraggedId(collectionId);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", collectionId);
    e.dataTransfer.setDragImage(e.currentTarget, 0, 0);
  };

  const handleDragOver = (e: React.DragEvent, collectionId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (draggedId && draggedId !== collectionId) setDragOverId(collectionId);
  };

  const handleDragLeave = () => setDragOverId(null);

  const handleDrop = (e: React.DragEvent, dropTargetId: string) => {
    e.preventDefault();
    setDragOverId(null);
    setDraggedId(null);
    const sourceId = e.dataTransfer.getData("text/plain");
    if (!sourceId || sourceId === dropTargetId || !onReorder) return;
    const ids = collections.map((c) => c.id);
    const from = ids.indexOf(sourceId);
    const to = ids.indexOf(dropTargetId);
    if (from === -1 || to === -1) return;
    const next = [...ids];
    next.splice(from, 1);
    next.splice(to, 0, sourceId);
    onReorder(next);
  };

  const handleDragEnd = () => {
    setDraggedId(null);
    setDragOverId(null);
  };

  return (
    <section className="mx-4 mb-8">
      <h2 className="text-sm font-semibold text-foreground mb-3 px-1">Collections</h2>
      <div className="flex flex-col gap-4">
        {collections.map((collection) => {
          const isDragging = draggedId === collection.id;
          const isDropTarget = dragOverId === collection.id;
          return (
            <div
              key={collection.id}
              draggable={isEditing}
              onDragStart={isEditing ? (e) => handleDragStart(e, collection.id) : undefined}
              onDragOver={isEditing ? (e) => handleDragOver(e, collection.id) : undefined}
              onDragLeave={isEditing ? handleDragLeave : undefined}
              onDrop={isEditing ? (e) => handleDrop(e, collection.id) : undefined}
              onDragEnd={isEditing ? handleDragEnd : undefined}
              className={cn(
                "rounded-[2rem] transition-all",
                isEditing && "cursor-grab active:cursor-grabbing",
                isDragging && "opacity-50 scale-[0.98]",
                isDropTarget && "ring-2 ring-[#8B5CF6] ring-offset-2 ring-offset-background"
              )}
            >
              <button
                type="button"
                onClick={() => !isEditing && onSelectCollection(collection.id)}
                className={cn(
                  "w-full text-left rounded-[2rem] p-4 transition-all flex items-center gap-4",
                  "bg-card/80 dark:bg-card/90 border border-border shadow-sm backdrop-blur-sm",
                  !isEditing &&
                    "hover:shadow-lg hover:border-[#8B5CF6]/40 hover:scale-[1.02] active:scale-[0.98]",
                  isEditing && "pointer-events-none"
                )}
              >
                {isEditing && (
                  <div
                    className="shrink-0 touch-none cursor-grab active:cursor-grabbing text-muted-foreground p-1 -m-1"
                    aria-label="Drag to reorder"
                  >
                    <GripVertical className="w-5 h-5" />
                  </div>
                )}
                {/* Bubble: circular preview of cards */}
                <div className="relative shrink-0 w-16 h-16 rounded-full overflow-hidden bg-muted border-2 border-background shadow-inner ring-2 ring-black/5">
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
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {collection.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {collection.cards.length} carta{collection.cards.length !== 1 ? "s" : ""}
                  </p>
                </div>
                {!isEditing && (
                  <span className="text-muted-foreground text-xl leading-none">›</span>
                )}
              </button>
            </div>
          );
        })}
      </div>
      {isEditing && (
        <p className="text-xs text-muted-foreground mt-2 px-1">
          Drag collections to change their order.
        </p>
      )}
    </section>
  );
}
