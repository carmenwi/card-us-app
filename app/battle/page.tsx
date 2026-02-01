"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BattleWidget } from "@/components/cardus/battle-widget";

export default function BattlePage() {
  const router = useRouter();
  const [battleData, setBattleData] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const pendingBattle = localStorage.getItem("cardus-pending-battle");
      if (pendingBattle) {
        setBattleData(JSON.parse(pendingBattle));
        // Clear the pending battle after loading
        localStorage.removeItem("cardus-pending-battle");
      } else {
        // No battle data, redirect to home
        router.push("/");
      }
    }
  }, [router]);

  if (!battleData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading battle...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => router.push("/")}
            className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back
          </button>
          <h1 className="text-lg font-bold bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6] bg-clip-text text-transparent">
            Battle Arena
          </h1>
          <div className="w-16" /> {/* Spacer for centering */}
        </div>
      </header>

      <div className="pt-4">
        <BattleWidget battleData={battleData} />
      </div>
    </div>
  );
}
