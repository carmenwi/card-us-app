"use client";

import { cn } from "@/lib/utils";

const tabs = ["Battles", "Cards", "Discover"] as const;
export type FeedTab = (typeof tabs)[number];

interface FilterTabsProps {
  activeTab: FeedTab;
  onTabChange: (tab: FeedTab) => void;
}

export function FilterTabs({ activeTab, onTabChange }: FilterTabsProps) {
  return (
    <div className="px-4 pb-4" role="tablist" aria-label="Feed filters">
      <div className="flex p-1 bg-muted rounded-2xl">
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              role="tab"
              aria-selected={isActive}
              onClick={() => onTabChange(tab)}
              className={cn(
                "flex-1 py-2 px-4 text-sm font-medium rounded-xl transition-all",
                isActive
                  ? "bg-card text-foreground shadow-sm dark:shadow-[#8B5CF6]/10"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab}
            </button>
          );
        })}
      </div>
    </div>
  );
}
