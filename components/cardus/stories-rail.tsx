"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Rectangular cards from card-photos, soft borders
const storyCards = [
  {
    id: "you",
    name: "@you",
    photo: "/mock-images/card-photos/cat-sofa.png",
    isYou: true,
    comments: [
      { id: "c1", username: "@neon_rider", text: "That background looks amazing" },
      { id: "c2", username: "@luna_vibes", text: "Need that frame" },
    ],
  },
  {
    id: "1",
    name: "@emma",
    photo: "/mock-images/card-photos/gymgirl.png",
    rarity: "gold",
    hasNew: true,
    comments: [
      { id: "c1", username: "@pasta_lover", text: "Gym glow" },
      { id: "c2", username: "@sunset_queen", text: "That outfit hits" },
    ],
  },
  {
    id: "2",
    name: "@alex",
    photo: "/mock-images/card-photos/outdoors-excursion.png",
    rarity: "purple",
    hasNew: true,
    comments: [
      { id: "c1", username: "@wanderlust", text: "Epic route" },
      { id: "c2", username: "@neon_rider", text: "Where is this" },
      { id: "c3", username: "@luna_vibes", text: "I want that sky" },
    ],
  },
  {
    id: "3",
    name: "@jordan",
    photo: "/mock-images/card-photos/lake.png",
    rarity: "blue",
    hasNew: true,
    comments: [
      { id: "c1", username: "@sunset_queen", text: "Lake vibes" },
      { id: "c2", username: "@foodie_tok", text: "So peaceful" },
    ],
  },
  {
    id: "4",
    name: "@mia",
    photo: "/mock-images/card-photos/couple-trip.png",
    rarity: "gold",
    hasNew: true,
    comments: [
      { id: "c1", username: "@luna_vibes", text: "Goals" },
      { id: "c2", username: "@neon_rider", text: "That trip is fire" },
    ],
  },
  {
    id: "5",
    name: "@noah",
    photo: "/mock-images/card-photos/doggie-tongue.png",
    rarity: "purple",
    hasNew: false,
    comments: [
      { id: "c1", username: "@paws_city", text: "Puppy mood" },
    ],
  },
  {
    id: "6",
    name: "@zoe",
    photo: "/mock-images/card-photos/ramen.png",
    rarity: "blue",
    hasNew: false,
    comments: [
      { id: "c1", username: "@foodie_tok", text: "That ramen looks insane" },
      { id: "c2", username: "@pasta_lover", text: "Instant hunger" },
    ],
  },
];

const rarityColors = {
  gold: "from-amber-400 via-yellow-500 to-amber-600",
  purple: "from-[#8B5CF6] via-purple-500 to-[#8B5CF6]",
  blue: "from-[#3B82F6] via-blue-500 to-[#3B82F6]",
};

export function StoriesRail() {
  const [activeStoryId, setActiveStoryId] = useState<string | null>(null);
  const activeStory = useMemo(
    () => storyCards.find((story) => story.id === activeStoryId) ?? null,
    [activeStoryId]
  );

  return (
    <section className="py-4" aria-label="Stories">
      <div className="flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-hide">
        {storyCards.map((story) => (
          <button
            key={story.id}
            className="flex flex-col items-center gap-1.5 shrink-0"
            aria-label={story.isYou ? "Add your story" : `View ${story.name}'s story`}
            onClick={() => setActiveStoryId(story.id)}
          >
            <div
              className={cn(
                "relative p-0.5 rounded-2xl overflow-hidden",
                story.isYou
                  ? "bg-border"
                  : story.hasNew
                    ? `bg-gradient-to-br ${rarityColors[story.rarity as keyof typeof rarityColors]}`
                    : "bg-border"
              )}
            >
              <div className="relative w-[72px] aspect-[3/4] rounded-[14px] overflow-hidden bg-card">
                <img
                  src={story.photo}
                  alt={story.name}
                  className="w-full h-full object-cover"
                />
                {story.isYou && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] flex items-center justify-center">
                      <Plus className="w-4 h-4 text-white" />
                    </div>
                  </div>
                )}
                {!!story.comments?.length && (
                  <div className="absolute bottom-2 left-2 right-2">
                    <span className="inline-flex w-full items-center justify-center rounded-full bg-black/60 px-2 py-1 text-[10px] font-medium text-white shadow-sm backdrop-blur-sm">
                      <span className="truncate">
                        {story.comments[story.comments.length - 1]?.text}
                      </span>
                    </span>
                  </div>
                )}
              </div>
            </div>
            <span className="text-xs font-medium text-foreground truncate max-w-[76px]">
              {story.name}
            </span>
          </button>
        ))}
      </div>

      <Dialog open={!!activeStory} onOpenChange={(open) => !open && setActiveStoryId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Comments</DialogTitle>
            <DialogDescription>{activeStory?.name}</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {activeStory?.comments?.map((comment) => (
              <div key={comment.id} className="flex items-start gap-2">
                <span className="text-xs font-semibold text-foreground">
                  {comment.username}
                </span>
                <span className="text-xs text-muted-foreground">{comment.text}</span>
              </div>
            ))}
            {!activeStory?.comments?.length && (
              <p className="text-xs text-muted-foreground">No comments yet.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
