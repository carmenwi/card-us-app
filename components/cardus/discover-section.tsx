"use client";

import { Compass, TrendingUp, Users, Sparkles, Search, ArrowLeft } from "lucide-react";
import { FramedCard } from "./framed-card";
import type { CardRarity } from "@/lib/rarity";
import { useState } from "react";

const TRENDING = [
  {
    id: "t1",
    photo: "/mock-images/card-photos/goggie-xmas.png",
    rarity: "legendary" as CardRarity,
    username: "@holiday_paws",
    aura: "15.2k",
  },
  {
    id: "t2",
    photo: "/mock-images/card-photos/ramen.png",
    rarity: "special" as CardRarity,
    username: "@foodie_tok",
    aura: "12.8k",
  },
  {
    id: "t3",
    photo: "/mock-images/card-photos/couple-trip.png",
    rarity: "rare" as CardRarity,
    username: "@wanderlust",
    aura: "9.4k",
  },
];

const NEW_CREATORS = [
  { id: "n1", name: "@sunset_queen", cards: 12 },
  { id: "n2", name: "@neon_rider", cards: 8 },
  { id: "n3", name: "@pasta_lover", cards: 5 },
];

const CATEGORIES = [
  { id: "pets", label: "Pets", count: "2.4k cards" },
  { id: "food", label: "Food", count: "1.8k cards" },
  { id: "travel", label: "Travel", count: "1.2k cards" },
  { id: "fitness", label: "Fitness", count: "890 cards" },
];

export function DiscoverSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showGoogleProfile, setShowGoogleProfile] = useState(false);

  const showGoogleResult = searchQuery.trim().length > 0 || searchQuery === "";

  if (showGoogleProfile) {
    return (
      <div className="pb-8">
        <div className="px-4 pt-4">
          <button
            type="button"
            onClick={() => setShowGoogleProfile(false)}
            className="flex items-center gap-2 text-sm font-semibold text-foreground hover:text-[#3B82F6] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Go back
          </button>
        </div>

        <div className="mx-4 mt-4 rounded-3xl border border-border bg-card p-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] flex items-center justify-center text-white font-bold text-xl">
              G
            </div>
            <div className="flex-1">
              <p className="text-lg font-bold text-foreground">google</p>
              <p className="text-xs text-muted-foreground">2.5M followers</p>
            </div>
            <button
              type="button"
              className="px-4 py-2 rounded-full bg-[#3B82F6] text-white text-xs font-semibold hover:bg-[#2563EB] transition-colors"
            >
              Follow
            </button>
          </div>

          <div className="mt-4 grid grid-cols-3 text-center">
            <div>
              <p className="text-sm font-bold text-foreground">1</p>
              <p className="text-[10px] text-muted-foreground">Card</p>
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">0</p>
              <p className="text-[10px] text-muted-foreground">Collections</p>
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">2.5M</p>
              <p className="text-[10px] text-muted-foreground">Followers</p>
            </div>
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            Official Google account. Discover cards, tech drops, and exclusive aura.
          </p>
        </div>

        <div className="mx-4 mt-6">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-[#8B5CF6]" />
            <h2 className="text-sm font-bold text-foreground">Cards</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="w-full">
              <FramedCard
                photoSrc="/mock-images/google card.png"
                rarity="special"
                alt="google"
              />
              <p className="mt-2 text-xs font-semibold text-foreground">Google Card</p>
              <p className="text-[10px] text-muted-foreground">Special · 2.5M Aura</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-4 pb-8 space-y-6">
      {/* Search */}
      <section>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search creators"
            className="w-full pl-9 pr-3 py-2.5 rounded-2xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/30"
          />
        </div>
        {showGoogleResult && (
          <button
            type="button"
            onClick={() => setShowGoogleProfile(true)}
            className="mt-3 w-full flex items-center justify-between gap-3 p-3 rounded-2xl border border-border bg-card hover:bg-muted/50 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] flex items-center justify-center text-white font-bold">
                G
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">google</p>
                <p className="text-xs text-muted-foreground">2.5M followers · 1 card</p>
              </div>
            </div>
            <span className="text-xs text-[#3B82F6] font-semibold">View</span>
          </button>
        )}
      </section>

      {/* Trending cards */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-[#3B82F6]" />
          <h2 className="text-sm font-bold text-foreground">Trending</h2>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {TRENDING.map((item) => (
            <div
              key={item.id}
              className="shrink-0 w-[120px] flex flex-col gap-1.5"
            >
              <FramedCard
                photoSrc={item.photo}
                rarity={item.rarity}
                alt={item.username}
              />
              <p className="text-xs font-medium text-foreground truncate">
                {item.username}
              </p>
              <p className="text-[10px] text-muted-foreground">{item.aura} Aura</p>
            </div>
          ))}
        </div>
      </section>

      {/* New creators */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Users className="w-4 h-4 text-[#8B5CF6]" />
          <h2 className="text-sm font-bold text-foreground">New Creators</h2>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
          {NEW_CREATORS.map((c) => (
            <div
              key={c.id}
              className="flex items-center justify-between py-2 border-b border-border last:border-0 last:pb-0 first:pt-0"
            >
              <span className="text-sm font-medium text-foreground">{c.name}</span>
              <span className="text-xs text-muted-foreground">{c.cards} cards</span>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Compass className="w-4 h-4 text-[#3B82F6]" />
          <h2 className="text-sm font-bold text-foreground">Explore</h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              className="flex flex-col items-start gap-1 p-4 rounded-2xl border border-border bg-card hover:bg-muted/50 transition-colors text-left"
            >
              <Sparkles className="w-5 h-5 text-[#8B5CF6]" />
              <span className="text-sm font-semibold text-foreground">{cat.label}</span>
              <span className="text-xs text-muted-foreground">{cat.count}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
