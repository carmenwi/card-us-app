/**
 * Card ranks and frame logic (programmatic frames from rank colors).
 * legendary (purple), rare (pink), common (green), special (blue)
 */
export type CardRarity = "legendary" | "special" | "rare" | "common";

/** Validates and converts any rarity string to a valid CardRarity. */
export function validateRarity(rarity: unknown): CardRarity {
  if (typeof rarity !== "string") return "common";
  const lower = rarity.toLowerCase();
  if (lower === "legendary") return "legendary";
  if (lower === "rare") return "rare";
  if (lower === "common") return "common";
  if (lower === "special") return "special";
  // Fallback: treat any other value as special (blue)
  return "special";
}

/** Card frame border thickness (thicker = more visible). */
export const FRAME_PADDING = "p-2.5";

/** Gradient classes for the card frame border (replaces PNG frames). */
export const FRAME_GRADIENT: Record<CardRarity, string> = {
  legendary: "bg-gradient-to-br from-[#8B5CF6] via-[#A78BFA] to-[#7C3AED]",
  special: "bg-gradient-to-br from-[#3B82F6] via-[#60A5FA] to-[#2563EB]",
  rare: "bg-gradient-to-br from-pink-500 via-rose-400 to-pink-600",
  common: "bg-gradient-to-br from-emerald-500 via-green-400 to-emerald-600",
};

/** Card back background (same color per rarity). */
export const RARITY_BACK_BG: Record<CardRarity, string> = {
  legendary: "bg-gradient-to-br from-[#7C3AED] via-[#8B5CF6] to-[#6D28D9]",
  special: "bg-gradient-to-br from-[#2563EB] via-[#3B82F6] to-[#1D4ED8]",
  rare: "bg-gradient-to-br from-pink-600 via-pink-500 to-rose-600",
  common: "bg-gradient-to-br from-emerald-600 via-emerald-500 to-green-600",
};

/** Stats strip below photo on card (create + featured). */
export const RARITY_STATS_STRIP: Record<CardRarity, string> = {
  legendary:
    "bg-gradient-to-r from-[#6D28D9]/95 via-[#8B5CF6]/90 to-[#7C3AED]/95 text-white",
  special:
    "bg-gradient-to-r from-[#1D4ED8]/95 via-[#3B82F6]/90 to-[#2563EB]/95 text-white",
  rare:
    "bg-gradient-to-r from-pink-600/95 via-pink-500/90 to-rose-600/95 text-white",
  common:
    "bg-gradient-to-r from-emerald-600/95 via-emerald-500/90 to-green-600/95 text-white",
};

/** Value number gradient on stats strip per rarity. */
export const RARITY_VALUE_GRADIENT: Record<CardRarity, string> = {
  legendary: "from-amber-200 to-yellow-300",
  special: "from-sky-200 to-blue-200",
  rare: "from-pink-200 to-rose-200",
  common: "from-emerald-200 to-green-200",
};

/** Glow behind featured card — matches rarity color. */
export const RARITY_GLOW: Record<CardRarity, string> = {
  legendary: "from-[#8B5CF6]/80 via-[#A78BFA]/70 to-[#7C3AED]/80",
  special: "from-[#3B82F6]/80 via-[#60A5FA]/70 to-[#2563EB]/80",
  rare: "from-pink-500/80 via-rose-400/70 to-pink-600/80",
  common: "from-emerald-500/80 via-green-400/70 to-emerald-600/80",
};

/** Aura icon (Sparkles) color on card — matches rarity. */
export const RARITY_AURA_ICON: Record<CardRarity, string> = {
  legendary: "text-[#C4B5FD]",
  special: "text-sky-300",
  rare: "text-pink-300",
  common: "text-emerald-300",
};

/** Spotlight under featured card — radial gradient color (CSS var or class). */
export const RARITY_SPOTLIGHT: Record<CardRarity, string> = {
  legendary: "radial-gradient(ellipse 100% 60% at 50% 100%, rgba(139,92,246,0.8) 0%, rgba(139,92,246,0.3) 40%, transparent 70%)",
  special: "radial-gradient(ellipse 100% 60% at 50% 100%, rgba(59,130,246,0.8) 0%, rgba(59,130,246,0.3) 40%, transparent 70%)",
  rare: "radial-gradient(ellipse 100% 60% at 50% 100%, rgba(236,72,153,0.8) 0%, rgba(236,72,153,0.3) 40%, transparent 70%)",
  common: "radial-gradient(ellipse 100% 60% at 50% 100%, rgba(16,185,129,0.8) 0%, rgba(16,185,129,0.3) 40%, transparent 70%)",
};

/** Title bubble background per rarity. */
export const RARITY_TITLE_BG: Record<CardRarity, string> = {
  legendary: "bg-gradient-to-br from-[#8B5CF6]/20 via-[#A78BFA]/20 to-[#7C3AED]/20 border border-[#8B5CF6]/30",
  special: "bg-gradient-to-br from-[#3B82F6]/20 via-[#60A5FA]/20 to-[#2563EB]/20 border border-[#3B82F6]/30",
  rare: "bg-gradient-to-br from-pink-500/20 via-rose-400/20 to-pink-600/20 border border-pink-500/30",
  common: "bg-gradient-to-br from-emerald-500/20 via-green-400/20 to-emerald-600/20 border border-emerald-500/30",
};

/** Title bubble text gradient per rarity. */
export const RARITY_TITLE_TEXT: Record<CardRarity, string> = {
  legendary: "bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA]",
  special: "bg-gradient-to-r from-[#3B82F6] to-[#60A5FA]",
  rare: "bg-gradient-to-r from-pink-500 to-rose-400",
  common: "bg-gradient-to-r from-emerald-500 to-green-400",
};

/** Aura button background per rarity. */
export const RARITY_AURA_BG: Record<CardRarity, string> = {
  legendary: "bg-gradient-to-br from-[#8B5CF6]/20 to-[#A78BFA]/20 hover:from-[#8B5CF6]/30 hover:to-[#A78BFA]/30 border border-[#8B5CF6]/30",
  special: "bg-gradient-to-br from-[#3B82F6]/20 to-[#60A5FA]/20 hover:from-[#3B82F6]/30 hover:to-[#60A5FA]/30 border border-[#3B82F6]/30",
  rare: "bg-gradient-to-br from-pink-500/20 to-rose-400/20 hover:from-pink-500/30 hover:to-rose-400/30 border border-pink-500/30",
  common: "bg-gradient-to-br from-emerald-500/20 to-green-400/20 hover:from-emerald-500/30 hover:to-green-400/30 border border-emerald-500/30",
};

/** Aura icon color per rarity. */
export const RARITY_AURA_COLOR: Record<CardRarity, string> = {
  legendary: "text-[#A78BFA]",
  special: "text-[#60A5FA]",
  rare: "text-rose-400",
  common: "text-green-400",
};

/** Optional frame gradient for shop-only styles (e.g. Google Special, Neon). */
export const EXTRA_FRAME_GRADIENTS: Record<string, string> = {
  amber: "bg-gradient-to-br from-amber-500 via-yellow-400 to-amber-600",
  neon: "bg-gradient-to-br from-[#3B82F6] via-cyan-400 to-[#8B5CF6]",
};

export const RARITY_LABELS: Record<CardRarity, string> = {
  legendary: "Legendary",
  special: "Special",
  rare: "Rare",
  common: "Common",
};

/** Badge/ring colors: legendary=purple, rare=pink, common=green, special=blue */
export const RARITY_STYLES: Record<
  CardRarity,
  { badge: string; ring: string }
> = {
  legendary: {
    badge: "bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA]",
    ring: "from-[#8B5CF6] to-[#A78BFA]",
  },
  special: {
    badge: "bg-gradient-to-r from-[#3B82F6] to-[#60A5FA]",
    ring: "from-[#3B82F6] to-[#60A5FA]",
  },
  rare: {
    badge: "bg-gradient-to-r from-pink-500 to-rose-500",
    ring: "from-pink-500 to-rose-500",
  },
  common: {
    badge: "bg-gradient-to-r from-emerald-500 to-green-500",
    ring: "from-emerald-500 to-green-500",
  },
};

export function getFrameGradient(rarity: CardRarity): string {
  return FRAME_GRADIENT[rarity];
}
