import { PROFILE_COLLECTIONS } from "./profile-collections";

const STORAGE_KEY = "cardus-section-order";

const FIXED_SECTIONS = ["map", "featured"] as const;

export type MapSize = "full" | "half";

export type ProfileLayout = {
  order: string[];
  mapSize: MapSize;
};

function getDefaultOrder(): string[] {
  return [
    ...FIXED_SECTIONS,
    ...PROFILE_COLLECTIONS.map((c) => c.id),
  ];
}

export function getDefaultSectionOrder(): string[] {
  return getDefaultOrder();
}

export function getDefaultProfileLayout(): ProfileLayout {
  return { order: getDefaultOrder(), mapSize: "full" };
}

export function loadSectionOrder(): string[] {
  return loadProfileLayout().order;
}

export function loadProfileLayout(): ProfileLayout {
  if (typeof window === "undefined") return getDefaultProfileLayout();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultProfileLayout();
    const parsed = JSON.parse(raw);
    const validIds = new Set([
      ...FIXED_SECTIONS,
      ...PROFILE_COLLECTIONS.map((c) => c.id),
    ]);
    if (Array.isArray(parsed)) {
      return {
        order: parsed.filter((id: string) => validIds.has(id)),
        mapSize: "full",
      };
    }
    const order = (parsed.order ?? []).filter((id: string) => validIds.has(id));
    const mapSize = parsed.mapSize === "half" ? "half" : "full";
    return { order, mapSize };
  } catch {
    return getDefaultProfileLayout();
  }
}

export function saveSectionOrder(order: string[]): void {
  const layout = loadProfileLayout();
  saveProfileLayout({ ...layout, order });
}

export function saveProfileLayout(layout: ProfileLayout): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(layout));
  } catch (_) {}
}

export function isFixedSection(id: string): boolean {
  return (FIXED_SECTIONS as readonly string[]).includes(id);
}
