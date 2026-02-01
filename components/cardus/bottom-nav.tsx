"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingBag, ArrowLeftRight, User, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const leftNavItems = [
  { id: "feed", path: "/", icon: Home, label: "Feed" },
  { id: "shop", path: "/shop", icon: ShoppingBag, label: "Shop" },
];
const centerNavItem = { id: "create", path: "/create", icon: Plus, label: "Create" };
const rightNavItems = [
  { id: "trade", path: "/trade", icon: ArrowLeftRight, label: "Trade" },
  { id: "profile", path: "/profile", icon: User, label: "Profile" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      <div className="max-w-md mx-auto">
        <div className="mx-4 mb-4 backdrop-blur-md bg-white/80 dark:bg-card/80 rounded-3xl shadow-lg border border-border">
          {/* Grid: 2 cols | center btn | 2 cols — center button truly centered */}
          <div className="grid grid-cols-5 items-end gap-0">
            {/* Left two */}
            {leftNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.id}
                  href={item.path}
                  className={cn(
                    "flex flex-col items-center gap-0.5 p-2 pt-3 pb-3 rounded-2xl transition-colors",
                    isActive && "bg-gradient-to-r from-[#3B82F6]/10 to-[#8B5CF6]/10"
                  )}
                  aria-label={item.label}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon
                    className={cn(
                      "w-5 h-5 transition-colors",
                      isActive ? "text-[#3B82F6]" : "text-muted-foreground"
                    )}
                  />
                  <span
                    className={cn(
                      "text-[10px] font-medium transition-colors",
                      isActive
                        ? "bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] bg-clip-text text-transparent"
                        : "text-muted-foreground"
                    )}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
            {/* Center: + button */}
            <div className="flex justify-center items-center -mt-8">
              <Link
                href={centerNavItem.path}
                className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] shadow-lg shadow-[#8B5CF6]/30 active:scale-95 transition-transform"
                aria-label={centerNavItem.label}
              >
                <Plus className="w-6 h-6 text-white" />
              </Link>
            </div>
            {/* Right two */}
            {rightNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.id}
                  href={item.path}
                  className={cn(
                    "flex flex-col items-center gap-0.5 p-2 pt-3 pb-3 rounded-2xl transition-colors",
                    isActive && "bg-gradient-to-r from-[#3B82F6]/10 to-[#8B5CF6]/10"
                  )}
                  aria-label={item.label}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon
                    className={cn(
                      "w-5 h-5 transition-colors",
                      isActive ? "text-[#3B82F6]" : "text-muted-foreground"
                    )}
                  />
                  <span
                    className={cn(
                      "text-[10px] font-medium transition-colors",
                      isActive
                        ? "bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] bg-clip-text text-transparent"
                        : "text-muted-foreground"
                    )}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
