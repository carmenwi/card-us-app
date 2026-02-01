"use client";

import { Target, Sparkles } from "lucide-react";

const WEEKLY_CHALLENGE = {
  title: "Weekly Challenge",
  target: "Gym Flex",
  progress: 3,
  total: 5,
  reward: "+500 Aura",
};

export function WeeklyChallenge() {
  return (
    <section className="mx-4 mb-4" aria-label="Weekly Challenge">
      <div className="rounded-3xl overflow-hidden border border-border bg-gradient-to-r from-[#3B82F6]/5 via-[#8B5CF6]/5 to-[#3B82F6]/5 dark:from-[#3B82F6]/10 dark:via-[#8B5CF6]/10 dark:to-[#3B82F6]/10 shadow-sm">
        <div className="p-4 flex items-center gap-4">
          <div className="shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] flex items-center justify-center shadow-lg shadow-[#8B5CF6]/20">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-muted-foreground">Current Target</p>
            <p className="text-base font-bold text-foreground truncate">{WEEKLY_CHALLENGE.target}</p>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6]"
                  style={{ width: `${(WEEKLY_CHALLENGE.progress / WEEKLY_CHALLENGE.total) * 100}%` }}
                />
              </div>
              <span className="text-xs font-medium text-muted-foreground shrink-0">
                {WEEKLY_CHALLENGE.progress}/{WEEKLY_CHALLENGE.total}
              </span>
            </div>
          </div>
          <div className="shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-gradient-to-r from-[#3B82F6]/10 to-[#8B5CF6]/10 dark:from-[#3B82F6]/20 dark:to-[#8B5CF6]/20 border border-[#8B5CF6]/20">
            <Sparkles className="w-3.5 h-3.5 text-[#8B5CF6]" />
            <span className="text-xs font-semibold text-[#8B5CF6]">{WEEKLY_CHALLENGE.reward}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
