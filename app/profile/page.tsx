"use client";

import { useState, useMemo, useEffect } from "react";
import { ProfileHeader } from "@/components/cardus/profile-header";
import { ProfileMap } from "@/components/cardus/profile-map";
import { FeaturedCard } from "@/components/cardus/featured-card";
import { EnvelopeCard } from "@/components/cardus/envelope-card";
import { CollectionWidget } from "@/components/cardus/collection-widget";
import { CollectionGallery } from "@/components/cardus/collection-gallery";
import { DraggableWidget } from "@/components/cardus/draggable-widget";
import { Header } from "@/components/cardus/header";
import { BottomNav } from "@/components/cardus/bottom-nav";
import { PROFILE_COLLECTIONS, rarityStringToRarity } from "@/lib/profile-collections";
import type { ProfileCollection } from "@/lib/profile-collections";
import type { WidgetLayout } from "@/lib/profile-layout";
import {
  DEFAULT_PROFILE_DATA,
  loadProfileData,
  saveProfileData,
  type ProfileData,
} from "@/lib/profile-data";
import {
  getDefaultProfileLayout,
  loadProfileLayout,
  saveProfileLayout,
  type ProfileLayout,
  type MapSize,
} from "@/lib/profile-section-order";
import { loadUser } from "@/lib/auth";
import { useCardStore } from "@/context/card-store";
import { cn } from "@/lib/utils";
import { GripVertical, Maximize2, Minimize2 } from "lucide-react";

type FreeLayout = Record<string, WidgetLayout>;

const FREE_LAYOUT_STORAGE_KEY = "cardus-free-layout-v1";
const GRID_GAP = 12;
const COL_WIDTH = 200;
const FULL_WIDTH = COL_WIDTH * 2 + GRID_GAP;

const VERTICAL_SPACING = -30;

const getWidgetSize = (id: string, mapSize: MapSize) => {
  if (id === "map") {
    return { w: COL_WIDTH, h: 195 };
  }
  if (id === "envelope") return { w: COL_WIDTH, h: 230 };
  if (id === "featured") return { w: COL_WIDTH, h: 360 };
  return { w: COL_WIDTH, h: 170 };
};

const buildDefaultFreeLayout = (ids: string[], mapSize: MapSize): FreeLayout => {
  const layout: FreeLayout = {};
  let y = 0;
  let col = 0;
  let rowHeight = 0;

  ids.forEach((id) => {
    const size = getWidgetSize(id, mapSize);
    if (id === "map" && mapSize === "full") {
      layout[id] = { x: 0, y, w: size.w, h: size.h };
      y += size.h + GRID_GAP;
      col = 0;
      rowHeight = 0;
      return;
    }

    const x = col === 0 ? 0 : COL_WIDTH + GRID_GAP;
    layout[id] = { x, y, w: size.w, h: size.h };
    rowHeight = Math.max(rowHeight, size.h);

    if (col === 1) {
      y += rowHeight + GRID_GAP;
      rowHeight = 0;
      col = 0;
    } else {
      col = 1;
    }
  });

  return layout;
};
const WIDGET_SPACING = 12;

const compactFreeLayout = (
  current: FreeLayout,
  ids: string[],
  mapSize: MapSize,
  draggedId?: string,
  dragPosition?: { x: number; y: number }
): FreeLayout => {
  // Build ordered list with drag reordering
  let orderedIds = [...ids];
  
  if (draggedId && dragPosition) {
    orderedIds = orderedIds.filter(id => id !== draggedId);
    
    // Find insertion position by vertical position
    let insertIdx = 0;
    let y = 0;

    for (let i = 0; i < orderedIds.length; i++) {
      const id = orderedIds[i];
      const size = getWidgetSize(id, mapSize);
      
      // Check if drag position is in upper half of this widget
      if (dragPosition.y < y + size.h / 2) {
        insertIdx = i;
        break;
      }
      y += size.h + VERTICAL_SPACING;
    }
    
    orderedIds.splice(insertIdx, 0, draggedId);
  }
  
  // Build clean 2-column grid using bin packing (column-by-column)
  const next: FreeLayout = {};
  const columnHeights = [0, 0]; // Track y-position of each column

  orderedIds.forEach((id) => {
    const size = getWidgetSize(id, mapSize);
    
    // Place widget in column with lowest height
    const colIdx = columnHeights[0] <= columnHeights[1] ? 0 : 1;
    const x = colIdx === 0 ? 0 : COL_WIDTH + WIDGET_SPACING;
    const y = columnHeights[colIdx];
    
    next[id] = { x, y, w: size.w, h: size.h };
    columnHeights[colIdx] += size.h + VERTICAL_SPACING;
  });

  return next;
};

const orderFromLayout = (current: FreeLayout, ids: string[]) => {
  return [...ids].sort((a, b) => {
    const la = current[a];
    const lb = current[b];
    const ya = la?.y ?? 0;
    const yb = lb?.y ?? 0;
    if (ya !== yb) return ya - yb;
    const xa = la?.x ?? 0;
    const xb = lb?.x ?? 0;
    return xa - xb;
  });
};

const layoutsEqual = (a: FreeLayout, b: FreeLayout): boolean => {
  const aKeys = Object.keys(a).sort();
  const bKeys = Object.keys(b).sort();
  if (aKeys.length !== bKeys.length) return false;
  for (const key of aKeys) {
    const la = a[key];
    const lb = b[key];
    if (!lb) return false;
    if (la.x !== lb.x || la.y !== lb.y || la.w !== lb.w || la.h !== lb.h) return false;
  }
  return true;
};

const loadFreeLayout = (): FreeLayout => {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(FREE_LAYOUT_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as FreeLayout) : {};
  } catch {
    return {};
  }
};

const saveFreeLayout = (layout: FreeLayout): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(FREE_LAYOUT_STORAGE_KEY, JSON.stringify(layout));
  } catch (_) {}
};

export default function ProfilePage() {
  const [isHydrated, setIsHydrated] = useState(false);
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>(DEFAULT_PROFILE_DATA);
  const [layout, setLayout] = useState<ProfileLayout>(() =>
    typeof window !== "undefined" ? loadProfileLayout() : getDefaultProfileLayout()
  );
  const [freeLayout, setFreeLayout] = useState<FreeLayout>(() =>
    typeof window !== "undefined" ? loadFreeLayout() : {}
  );
  const [isWidgetInteracting, setIsWidgetInteracting] = useState(false);
  const [draggedSectionId, setDraggedSectionId] = useState<string | null>(null);
  const [dragOverSectionId, setDragOverSectionId] = useState<string | null>(null);
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [activeDragPos, setActiveDragPos] = useState<{ x: number; y: number } | null>(null);

  const { savedCardsByCollection } = useCardStore();

  useEffect(() => {
    setIsHydrated(true);
    const loadedProfile = loadProfileData();
    const user = loadUser();
    
    // Sync username from auth system
    if (user && user.username !== loadedProfile.username) {
      const updatedProfile = { ...loadedProfile, username: user.username };
      setProfileData(updatedProfile);
      saveProfileData(updatedProfile);
    } else {
      setProfileData(loadedProfile);
    }
    
    setLayout(loadProfileLayout());
  }, []);

  useEffect(() => {
    if (!isEditMode) return;
    saveFreeLayout(freeLayout);
  }, [freeLayout, isEditMode]);

  useEffect(() => {
    saveProfileData(profileData);
  }, [profileData]);
  const mergedCollections = useMemo<ProfileCollection[]>(() => {
    return PROFILE_COLLECTIONS.map((c) => ({
      ...c,
      cards: [
        ...c.cards,
        ...(savedCardsByCollection[c.id] ?? []).map((s) => ({
          id: s.id,
          image: s.imagePreview,
          title: s.title,
          description: s.description,
          stats: s.stats,
          rarity: rarityStringToRarity(s.rarity),
          tradeFrom: s.tradeFrom,
          tradeDate: s.tradeDate,
        } as any)),
      ],
    }));
  }, [savedCardsByCollection]);

  const collectionsById = useMemo(
    () => new Map(mergedCollections.map((c) => [c.id, c])),
    [mergedCollections]
  );

  const orderedSectionIds = useMemo(() => {
    const validIds = new Set([
      "map",
      "envelope",
      "featured",
      ...mergedCollections.map((c) => c.id),
    ]);
    let order = layout.order.filter((id) => validIds.has(id));
    if (!order.includes("map")) order = ["map", ...order];
    if (!order.includes("envelope")) order = [order[0], "envelope", ...order.slice(1)];
    if (!order.includes("featured")) order = [order[0], "featured", ...order.slice(1)];
    for (const c of mergedCollections) {
      if (!order.includes(c.id)) order.push(c.id);
    }
    return order;
  }, [layout.order, mergedCollections]);

  useEffect(() => {
    if (isEditMode) return;
    const compacted = compactFreeLayout(
      freeLayout,
      orderedSectionIds,
      layout.mapSize
    );
    if (!layoutsEqual(freeLayout, compacted)) {
      setFreeLayout(compacted);
      saveFreeLayout(compacted);
    }
  }, [isEditMode, freeLayout, orderedSectionIds, layout.mapSize]);

  useEffect(() => {
    if (!isEditMode) return;
    const defaults = buildDefaultFreeLayout(orderedSectionIds, layout.mapSize);
    setFreeLayout((current) => {
      let changed = false;
      const next: FreeLayout = { ...current };
      const mapSize = getWidgetSize("map", layout.mapSize);
      for (const id of orderedSectionIds) {
        if (!next[id]) {
          next[id] = defaults[id];
          changed = true;
        } else if (id === "map") {
          if (next[id].w !== mapSize.w || next[id].h !== mapSize.h) {
            next[id] = { ...next[id], w: mapSize.w, h: mapSize.h };
            changed = true;
          }
        }
      }
      for (const id of Object.keys(next)) {
        if (!orderedSectionIds.includes(id)) {
          delete next[id];
          changed = true;
        }
      }
      return changed ? next : current;
    });
  }, [orderedSectionIds, layout.mapSize, isEditMode]);

  useEffect(() => {
    if (!isEditMode || isWidgetInteracting) return;
    setFreeLayout((current) =>
      compactFreeLayout(current, orderedSectionIds, layout.mapSize)
    );
  }, [isEditMode, isWidgetInteracting, orderedSectionIds, layout.mapSize]);

  const moveSection = (sourceId: string, targetId: string) => {
    if (sourceId === targetId) return;
    const order = [...orderedSectionIds];
    const from = order.indexOf(sourceId);
    const to = order.indexOf(targetId);
    if (from === -1 || to === -1) return;
    order.splice(from, 1);
    order.splice(to, 0, sourceId);
    const next = { ...layout, order };
    setLayout(next);
    saveProfileLayout(next);
  };

  const setMapSize = (mapSize: MapSize) => {
    const next = { ...layout, mapSize };
    setLayout(next);
    saveProfileLayout(next);
    if (isEditMode) {
      setFreeLayout((current) => {
        const size = getWidgetSize("map", mapSize);
        const mapLayout = current.map;
        if (!mapLayout) return current;
        return {
          ...current,
          map: { ...mapLayout, w: size.w, h: size.h },
        };
      });
    }
  };

  const handleDragStart = (e: React.DragEvent, sectionId: string) => {
    setDraggedSectionId(sectionId);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", sectionId);
  };

  const handleDragOver = (e: React.DragEvent, sectionId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (draggedSectionId && draggedSectionId !== sectionId)
      setDragOverSectionId(sectionId);
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    const sourceId = e.dataTransfer.getData("text/plain");
    setDraggedSectionId(null);
    setDragOverSectionId(null);
    if (sourceId && sourceId !== targetId) moveSection(sourceId, targetId);
  };

  const handleDragEnd = () => {
    setDraggedSectionId(null);
    setDragOverSectionId(null);
  };

  const sectionLabels: Record<string, string> = {
    map: "Map",
    featured: "FAV",
  };

  const defaultFreeLayout = useMemo(
    () => buildDefaultFreeLayout(orderedSectionIds, layout.mapSize),
    [orderedSectionIds, layout.mapSize]
  );

  const effectiveFreeLayout = useMemo(
    () =>
      compactFreeLayout(
        { ...defaultFreeLayout, ...freeLayout },
        orderedSectionIds,
        layout.mapSize,
        activeDragId ?? undefined,
        activeDragPos ?? undefined
      ),
    [defaultFreeLayout, freeLayout, orderedSectionIds, layout.mapSize, activeDragId, activeDragPos]
  );

  const freeLayoutHeight = useMemo(() => {
    const layouts = orderedSectionIds
      .map((id) => effectiveFreeLayout[id])
      .filter(Boolean);
    const maxBottom = layouts.reduce(
      (max, item) => Math.max(max, (item?.y ?? 0) + (item?.h ?? 0)),
      0
    );
    return Math.max(320, maxBottom + GRID_GAP * 3);
  }, [orderedSectionIds, effectiveFreeLayout]);

  const collection =
    selectedCollectionId !== null
      ? mergedCollections.find((c) => c.id === selectedCollectionId)
      : null;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto relative">
        <Header hideAura />
        <main className="pb-28">
          {!isHydrated ? (
            <div className="mx-4 py-6">
              <div className="h-32 rounded-2xl bg-muted/50" />
            </div>
          ) : collection ? (
            <CollectionGallery
              collection={collection}
              onBack={() => setSelectedCollectionId(null)}
            />
          ) : (
            <>
              <ProfileHeader
                profile={profileData}
                isEditing={isEditMode}
                onEditModeChange={setIsEditMode}
                onProfileChange={setProfileData}
              />
              {isEditMode ? (
                <div
                  className="mx-4 relative overflow-visible"
                  style={{ height: freeLayoutHeight }}
                >
                  {orderedSectionIds.map((sectionId) => {
                    const collection = collectionsById.get(sectionId);
                    const isCollection =
                      sectionId !== "map" && sectionId !== "featured";
                    const widgetLayout = effectiveFreeLayout[sectionId];
                    if (!widgetLayout) return null;

                    return (
                      <DraggableWidget
                        key={sectionId}
                        id={sectionLabels[sectionId] ?? collection?.name ?? sectionId}
                        layout={widgetLayout}
                        isEditMode
                        isDragging={activeDragId === sectionId}
                        onLayoutChange={(next) =>
                          setFreeLayout((current) => ({
                            ...current,
                            [sectionId]: next,
                          }))
                        }
                        autoHeight
                        overflowVisible={sectionId === "featured"}
                        onDragStart={() => {
                          setIsWidgetInteracting(true);
                          setActiveDragId(sectionId);
                        }}
                        onDrag={(x, y) => {
                          setActiveDragPos({ x, y });
                        }}
                        onDragEnd={() => {
                          setIsWidgetInteracting(false);
                          setActiveDragId(null);
                          setActiveDragPos(null);
                          setFreeLayout((current) => {
                            const compacted = compactFreeLayout(
                              current,
                              orderedSectionIds,
                              layout.mapSize
                            );
                            const order = orderFromLayout(compacted, orderedSectionIds);
                            const nextLayout = { ...layout, order };
                            setLayout(nextLayout);
                            saveProfileLayout(nextLayout);
                            return compacted;
                          });
                        }}
                        onResizeStart={() => setIsWidgetInteracting(true)}
                        onResizeEnd={() => {
                          setIsWidgetInteracting(false);
                          setFreeLayout((current) => {
                            const compacted = compactFreeLayout(
                              current,
                              orderedSectionIds,
                              layout.mapSize
                            );
                            const order = orderFromLayout(compacted, orderedSectionIds);
                            const nextLayout = { ...layout, order };
                            setLayout(nextLayout);
                            saveProfileLayout(nextLayout);
                            return compacted;
                          });
                        }}
                      >
                        <div className="rounded-2xl transition-all">
                          {sectionId === "map" && (
                            <ProfileMap size={layout.mapSize} inGrid />
                          )}
                          {sectionId === "envelope" && <EnvelopeCard />}
                          {sectionId === "featured" && <FeaturedCard />}
                          {isCollection && collection && (
                            <CollectionWidget
                              collection={collection}
                              onClick={() =>
                                setSelectedCollectionId(sectionId)
                              }
                            />
                          )}
                        </div>
                      </DraggableWidget>
                    );
                  })}
                </div>
              ) : (
                <div className="mx-4 relative" style={{ height: freeLayoutHeight }}>
                  {orderedSectionIds.map((sectionId) => {
                    const collection = collectionsById.get(sectionId);
                    const isCollection =
                      sectionId !== "map" && sectionId !== "featured";
                    const widgetLayout = effectiveFreeLayout[sectionId];
                    if (!widgetLayout) return null;

                    return (
                      <div
                        key={sectionId}
                        className="absolute overflow-visible transition-all duration-300 ease-out"
                        style={{
                          left: widgetLayout.x,
                          top: widgetLayout.y,
                          width: widgetLayout.w,
                          height: widgetLayout.h,
                        }}
                      >
                        {sectionId === "map" && (
                          <ProfileMap size={layout.mapSize} inGrid />
                        )}
                        {sectionId === "envelope" && <EnvelopeCard />}
                        {sectionId === "featured" && <FeaturedCard />}
                        {isCollection && collection && (
                          <CollectionWidget
                            collection={collection}
                            onClick={() =>
                              setSelectedCollectionId(sectionId)
                            }
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </main>
        <BottomNav />
      </div>
    </div>
  );
}
