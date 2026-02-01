"use client";

import { useState } from "react";
import { Zap, Clock, Sparkles, Loader2, Trophy, ChevronDown, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FlippableCard } from "./flippable-card";
import { simulateBattle } from "@/app/actions";
import { cn } from "@/lib/utils";
import { FRAME_GRADIENT, FRAME_PADDING, type CardRarity, validateRarity, RARITY_TITLE_BG, RARITY_TITLE_TEXT, RARITY_AURA_BG, RARITY_AURA_COLOR } from "@/lib/rarity";

const BATTLE = {
  id: "1",
  titleA: "Gym Flex",
  titleB: "Cat Energy",
  cardA: {
    photo: "/mock-images/card-photos/gymgirl.png",
    rarity: "rare" as const,
    username: "@carmen",
    score: "2.4k",
    title: "Gym NPC",
    description: "Bro really thought the pump would fix the vibe. Aura: mid.",
    stats: { charisma: 65, style: 72, nature: 40, aura: 800 },
  },
  cardB: {
    photo: "/mock-images/card-photos/cat-in-chair.png",
    rarity: "legendary" as const,
    username: "@sophia",
    score: "2.1k",
    title: "Chaos Cat",
    description: "Sleeping cat energy. Infinite aura. Does nothing and wins.",
    stats: { charisma: 99, style: 95, nature: 100, aura: 5000 },
  },
  timeLeft: "23h left",
  defaultComment: "",
  comments: [
    { id: "1", username: "@neon_rider", text: "Cat card supremacy fr", time: "2m" },
    { id: "2", username: "@luna_vibes", text: "Boosted Sophia, no cap", time: "5m" },
    { id: "3", username: "@sunset_queen", text: "Carmen looking strong 💪", time: "8m" },
  ],
};

export function BattleWidget({ battleData, onDelete }: { battleData?: any; onDelete?: () => void }) {
  const [battleResult, setBattleResult] = useState<{
    winner: "1" | "2";
    commentary: string;
    critical_hit: boolean;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [reactionsExpanded, setReactionsExpanded] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  // Use provided battleData or default mock data
  const battle = battleData || BATTLE;

  const handleFight = async () => {
    setLoading(true);
    try {
      const data = await simulateBattle(
        {
          title: battle.cardA.title,
          description: battle.cardA.description,
          stats: battle.cardA.stats,
        },
        {
          title: battle.cardB.title,
          description: battle.cardB.description,
          stats: battle.cardB.stats,
        }
      );
      setBattleResult(data);
    } catch {
      setBattleResult({
        winner: "1",
        commentary: "Error connecting to referee. Winner by coin flip.",
        critical_hit: false,
      });
    } finally {
      setLoading(false);
    }
  };
const handleDelete = () => {
    setIsDeleted(true);
    if (onDelete) {
      onDelete();
    }
  };

  if (isDeleted) {
    return null;
  }

  
  return (
    <article className="mx-4 mb-4 p-4 bg-muted/40 rounded-3xl border border-border/30 shadow-sm backdrop-blur-sm">
      <div className="p-5 bg-gradient-to-br from-card to-card/95 rounded-2xl border border-border/50 shadow-md backdrop-blur-sm">
      {/* Timer + Delete Button - Top */}
      <div className="flex items-center justify-between mb-4 gap-2">
        <div></div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              if (battleResult) {
                setBattleResult(null);
              } else {
                handleFight();
              }
            }}
            disabled={loading}
            className={cn(
              "flex items-center gap-1 px-3 py-1.5 rounded-full border transition-all",
              battleResult
                ? "bg-green-500/20 border-green-500/30 text-green-600 dark:text-green-400 hover:bg-green-500/30"
                : loading
                ? "bg-muted border-border text-muted-foreground opacity-70 cursor-wait"
                : "bg-muted border-border text-muted-foreground hover:bg-muted/80 cursor-pointer"
            )}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-xs font-semibold">Battling...</span>
              </>
            ) : battleResult ? (
              <>
                <Trophy className="w-4 h-4" />
                <span className="text-xs font-semibold">Restart</span>
              </>
            ) : (
              <>
                <Clock className="w-4 h-4" />
                <span className="text-xs font-semibold">{battle.timeLeft || "23h left"}</span>
              </>
            )}
          </button>
          <button
            onClick={handleDelete}
            className="p-2 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground transition-colors"
            aria-label="Delete battle"
            title="Delete battle"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Battle Title */}
      <div className="flex items-center justify-between mb-5 gap-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className={cn("px-3 py-1.5 rounded-full", RARITY_TITLE_BG[validateRarity(battle.cardA.rarity)])}>
            <span className={cn("text-xs font-bold bg-clip-text text-transparent", RARITY_TITLE_TEXT[validateRarity(battle.cardA.rarity)])}>
              {battle.titleA}
            </span>
          </div>
          <span className="text-xs font-bold text-muted-foreground">vs</span>
          <div className={cn("px-3 py-1.5 rounded-full", RARITY_TITLE_BG[validateRarity(battle.cardB.rarity)])}>
            <span className={cn("text-xs font-bold bg-clip-text text-transparent", RARITY_TITLE_TEXT[validateRarity(battle.cardB.rarity)])}>
              {battle.titleB}
            </span>
          </div>
        </div>
      </div>

      {/* Battle Arena */}
      <div className="flex items-end gap-1.5 mb-6 relative">
        {/* Confetti effect for winner */}
        {battleResult && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-full animate-ping"
                style={{
                  background: `hsl(${Math.random() * 360}, 70%, 60%)`,
                  left: `${50 + (Math.random() - 0.5) * 40}%`,
                  top: `${20 + Math.random() * 60}%`,
                  animationDelay: `${Math.random() * 0.5}s`,
                  animationDuration: `${1 + Math.random()}s`,
                }}
              />
            ))}
          </div>
        )}

        {/* Card A */}
        <div className="flex-1 flex flex-col items-center gap-2.5 min-w-0 relative">
          {battleResult && battleResult.winner === "1" && (
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-20">
              <Trophy className="w-6 h-6 text-amber-400 drop-shadow-lg animate-bounce" />
            </div>
          )}
          <div className={cn(
            "w-full transition-all duration-500",
            battleResult && battleResult.winner === "1" && "ring-4 ring-amber-400 rounded-xl shadow-lg shadow-amber-400/50",
            battleResult && battleResult.winner === "2" && "opacity-60 grayscale"
          )}>
          <div className={cn(
            "w-full rounded-xl overflow-hidden",
            FRAME_GRADIENT[validateRarity(battle.cardA.rarity)],
            "p-1.5"
          )}>
            <FlippableCard
              data={{
                title: battle.cardA.title,
                stats: battle.cardA.stats || { charisma: 0, style: 0, nature: 0, aura: 0 },
                description: battle.cardA.description,
                rarity: validateRarity(battle.cardA.rarity),
                cardImage: battle.cardA.photo,
              }}
              size="sm"
            />
          </div>
          </div>
          <div className="flex items-center gap-1.5 w-full justify-center">
            <span className={cn(
              "text-xs font-semibold truncate transition-colors",
              battleResult && battleResult.winner === "1" ? "text-amber-400" : "text-foreground"
            )}>
              {battle.cardA.username}
            </span>
            <button className={cn("p-1 rounded-lg transition-colors", RARITY_AURA_BG[validateRarity(battle.cardA.rarity)])} aria-label="Boost">
              <Sparkles className={cn("w-3 h-3", RARITY_AURA_COLOR[validateRarity(battle.cardA.rarity)])} />
            </button>
          </div>
        </div>

        {/* VS - Center */}
        <div className="flex flex-col items-center justify-end pb-6 shrink-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-muted to-muted/80 flex items-center justify-center shadow-lg border border-border/50">
            <Zap className="w-5 h-5 text-muted-foreground" />
          </div>
          <span className="text-[10px] font-bold text-muted-foreground mt-1">VS</span>
        </div>

        {/* Card B */}
        <div className="flex-1 flex flex-col items-center gap-2.5 min-w-0 relative">
          {battleResult && battleResult.winner === "2" && (
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-20">
              <Trophy className="w-6 h-6 text-amber-400 drop-shadow-lg animate-bounce" />
            </div>
          )}
          <div className={cn(
            "w-full transition-all duration-500",
            battleResult && battleResult.winner === "2" && "ring-4 ring-amber-400 rounded-xl shadow-lg shadow-amber-400/50",
            battleResult && battleResult.winner === "1" && "opacity-60 grayscale"
          )}>
          <div className={cn(
            "w-full rounded-xl overflow-hidden",
            FRAME_GRADIENT[validateRarity(battle.cardB.rarity)],
            "p-1.5"
          )}>
            <FlippableCard
              data={{
                title: battle.cardB.title,
                stats: battle.cardB.stats || { charisma: 0, style: 0, nature: 0, aura: 0 },
                description: battle.cardB.description,
                rarity: validateRarity(battle.cardB.rarity),
                cardImage: battle.cardB.photo,
              }}
              size="sm"
            />
          </div>
          </div>
          <div className="flex items-center gap-1.5 w-full justify-center">
            <button className={cn("p-1 rounded-lg transition-colors", RARITY_AURA_BG[validateRarity(battle.cardB.rarity)])} aria-label="Boost">
              <Sparkles className={cn("w-3 h-3", RARITY_AURA_COLOR[validateRarity(battle.cardB.rarity)])} />
            </button>
            <span className={cn(
              "text-xs font-semibold truncate transition-colors",
              battleResult && battleResult.winner === "2" ? "text-amber-400" : "text-foreground"
            )}>
              {battle.cardB.username}
            </span>
          </div>
        </div>
      </div>

      {/* AI Commentary */}
      {battleResult && (
        <div className="flex justify-center mb-4">
          <div
            className={cn(
              "relative max-w-[calc(100%-2rem)]",
              "px-4 py-3 rounded-2xl rounded-tl-sm",
              "bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 shadow-lg",
              "text-xs text-foreground leading-relaxed text-center font-medium"
            )}
          >
            {battleResult.commentary}
            <div
              className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 border-l border-t border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-blue-500/10"
              aria-hidden
            />
          </div>
        </div>
      )}

      {/* Reactions section */}
      <div className="border-t border-border/30 pt-4">
        <button
          onClick={() => setReactionsExpanded(!reactionsExpanded)}
          className="w-full group"
        >
          <div className="flex items-center justify-between p-3 rounded-xl bg-muted/20 group-hover:bg-muted/40 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 flex items-center justify-center">
                <span className="text-xs font-bold text-purple-400">{battle.comments?.length || 0}</span>
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-foreground">Reactions</p>
                <p className="text-[10px] text-muted-foreground">{battle.comments?.[0]?.username || '@user'}: {battle.comments?.[0]?.text || 'No reactions yet'}</p>
              </div>
            </div>
            <ChevronDown className={cn(
              "w-4 h-4 text-muted-foreground transition-transform",
              reactionsExpanded && "rotate-180"
            )} />
          </div>
        </button>
        {reactionsExpanded && battle.comments && battle.comments.length > 0 && (
          <div className="mt-3 space-y-2">
            {battle.comments.map((c: any) => (
              <div key={c.id} className="flex gap-3 items-start p-3 rounded-xl bg-muted/20 hover:bg-muted/30 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-purple-400">{c.username}</span>
                    <span className="text-[9px] text-muted-foreground/70">{c.time}</span>
                  </div>
                  <p className="text-xs text-foreground/90 leading-relaxed">{c.text}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      </div>
    </article>
  );
}
