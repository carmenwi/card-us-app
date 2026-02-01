import { PROFILE_COLLECTIONS } from "./profile-collections";

const STORAGE_KEY = "cardus-collection-order";

export function getDefaultCollectionOrder(): string[] {
  return PROFILE_COLLECTIONS.map((c) => c.id);
}

export function loadCollectionOrder(): string[] {
  if (typeof window === "undefined") return getDefaultCollectionOrder();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultCollectionOrder();
    const parsed = JSON.parse(raw) as string[];
    const validIds = new Set(PROFILE_COLLECTIONS.map((c) => c.id));
    return parsed.filter((id) => validIds.has(id));
  } catch {
    return getDefaultCollectionOrder();
  }
}

export function saveCollectionOrder(order: string[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(order));
  } catch (_) {}
}
