"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type SavedCard = {
  id: string;
  imagePreview: string; // base64 data URL for persistence
  title: string;
  description: string;
  stats: { charisma: number; style: number; nature: number; aura: number };
  rarity: string;
  location?: string;
  hasAudio?: boolean;
  audioBase64?: string;
  tradeFrom?: string; // username of who you traded from
  tradeDate?: number; // timestamp of trade
};

type CardStoreState = {
  favoriteCard: SavedCard | null;
  savedCardsByCollection: Record<string, SavedCard[]>;
};

const STORAGE_KEY = "cardus-store";

function loadState(): CardStoreState {
  if (typeof window === "undefined")
    return { favoriteCard: null, savedCardsByCollection: {} };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { favoriteCard: null, savedCardsByCollection: {} };
    const parsed = JSON.parse(raw) as CardStoreState;
    return {
      favoriteCard: parsed.favoriteCard ?? null,
      savedCardsByCollection: parsed.savedCardsByCollection ?? {},
    };
  } catch {
    return { favoriteCard: null, savedCardsByCollection: {} };
  }
}

function saveState(state: CardStoreState) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (_) {}
}

type CardStoreContextValue = CardStoreState & {
  setFavoriteCard: (card: SavedCard | null) => void;
  addCardToCollection: (collectionId: string, card: SavedCard) => void;
  removeCardFromCollection: (collectionId: string, cardId: string) => void;
  isCardInCollection: (collectionId: string, cardId: string) => boolean;
};

const CardStoreContext = createContext<CardStoreContextValue | null>(null);

export function CardStoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<CardStoreState>(loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const setFavoriteCard = useCallback((card: SavedCard | null) => {
    setState((prev) => ({ ...prev, favoriteCard: card }));
  }, []);

  const addCardToCollection = useCallback(
    (collectionId: string, card: SavedCard) => {
      setState((prev) => {
        const list = prev.savedCardsByCollection[collectionId] ?? [];
        if (list.some((c) => c.id === card.id)) return prev;
        return {
          ...prev,
          savedCardsByCollection: {
            ...prev.savedCardsByCollection,
            [collectionId]: [...list, card],
          },
        };
      });
    },
    []
  );

  const removeCardFromCollection = useCallback(
    (collectionId: string, cardId: string) => {
      setState((prev) => {
        const list = prev.savedCardsByCollection[collectionId] ?? [];
        const next = list.filter((c) => c.id !== cardId);
        if (next.length === list.length) return prev;
        return {
          ...prev,
          savedCardsByCollection: {
            ...prev.savedCardsByCollection,
            [collectionId]: next,
          },
        };
      });
    },
    []
  );

  const isCardInCollection = useCallback(
    (collectionId: string, cardId: string) => {
      const list = state.savedCardsByCollection[collectionId] ?? [];
      return list.some((c) => c.id === cardId);
    },
    [state.savedCardsByCollection]
  );

  const value = useMemo<CardStoreContextValue>(
    () => ({
      ...state,
      setFavoriteCard,
      addCardToCollection,
      removeCardFromCollection,
      isCardInCollection,
    }),
    [
      state,
      setFavoriteCard,
      addCardToCollection,
      removeCardFromCollection,
      isCardInCollection,
    ]
  );

  return (
    <CardStoreContext.Provider value={value}>
      {children}
    </CardStoreContext.Provider>
  );
}

export function useCardStore() {
  const ctx = useContext(CardStoreContext);
  if (!ctx) throw new Error("useCardStore must be used within CardStoreProvider");
  return ctx;
}
