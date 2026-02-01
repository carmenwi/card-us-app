export type WidgetId = "header" | "map" | "featured" | "collections";

export type WidgetLayout = {
  x: number;
  y: number;
  w: number;
  h: number;
};

export type ProfileLayout = Record<WidgetId, WidgetLayout>;

export const DEFAULT_PROFILE_LAYOUT: ProfileLayout = {
  header: { x: 16, y: 16, w: 400, h: 200 },
  map: { x: 16, y: 232, w: 200, h: 160 },
  featured: { x: 232, y: 232, w: 184, h: 280 },
  collections: { x: 16, y: 532, w: 400, h: 380 },
};

const STORAGE_KEY = "cardus-profile-layout";

export function loadProfileLayout(): ProfileLayout | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ProfileLayout;
  } catch {
    return null;
  }
}

export function saveProfileLayout(layout: ProfileLayout): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(layout));
  } catch (_) {}
}
