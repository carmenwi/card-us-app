export type ProfileData = {
  username: string;
  avatar: string;
  auraPoints: number;
  friends: number;
  cards: number;
  collections: number;
  aiRole: string;
};

export const DEFAULT_PROFILE_DATA: ProfileData = {
  username: "@luna_vibes",
  avatar: "/mock-images/profile_pic_universal.png",
  auraPoints: 12500,
  friends: 42,
  cards: 127,
  collections: 8,
  aiRole: "Dog Tamer",
};

const STORAGE_KEY = "cardus-profile-data";

export function loadProfileData(): ProfileData {
  if (typeof window === "undefined") return DEFAULT_PROFILE_DATA;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROFILE_DATA;
    return { ...DEFAULT_PROFILE_DATA, ...JSON.parse(raw) } as ProfileData;
  } catch {
    return DEFAULT_PROFILE_DATA;
  }
}

export function saveProfileData(data: ProfileData): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (_) {}
}
