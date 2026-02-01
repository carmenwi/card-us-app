"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Camera, Sparkles, Loader2, Heart, FolderOpen, MapPin, Mic, Square } from "lucide-react";
import { generateCardStats, type CardStatsResult } from "@/app/actions";
import {
  FRAME_GRADIENT,
  FRAME_PADDING,
  RARITY_BACK_BG,
  RARITY_STATS_STRIP,
  RARITY_VALUE_GRADIENT,
} from "@/lib/rarity";
import type { CardRarity } from "@/lib/rarity";
import { cn } from "@/lib/utils";
import { useCardStore, type SavedCard } from "@/context/card-store";
import { loadProfileData } from "@/lib/profile-data";

const COLLECTIONS = [
  { id: "all", name: "All" },
  { id: "outdoors", name: "Outdoors" },
  { id: "pets", name: "Pets" },
  { id: "food", name: "Food" },
  { id: "travel", name: "Travel" },
  { id: "gym", name: "Gym Flex" },
];

function rarityToKey(r: string): CardRarity {
  const lower = r.toLowerCase();
  if (lower === "legendary") return "legendary";
  if (lower === "rare") return "rare";
  if (lower === "common") return "common";
  return "special";
}

const MAX_WIDTH = 800;
const JPEG_QUALITY = 0.7;

function resizeImageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;
      if (width > MAX_WIDTH) {
        height = (height * MAX_WIDTH) / width;
        width = MAX_WIDTH;
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", JPEG_QUALITY));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Error al cargar la imagen"));
    };
    img.src = url;
  });
}

export function CreateCardForm() {
  const inputRef = useRef<HTMLInputElement>(null);
  const cardIdRef = useRef<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CardStatsResult | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedCollections, setSelectedCollections] = useState<Set<string>>(new Set());
  const [isFavorite, setIsFavorite] = useState(false);
  const [showCollections, setShowCollections] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [locationText, setLocationText] = useState("");
  const [audioBase64, setAudioBase64] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [createdAt, setCreatedAt] = useState<Date | null>(null);
  const [creator, setCreator] = useState<string>("");
  const [context, setContext] = useState<string>("");
  const [customTitle, setCustomTitle] = useState<string>("");

  const {
    setFavoriteCard,
    addCardToCollection,
    removeCardFromCollection,
  } = useCardStore();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCreator(loadProfileData().username);
    }
  }, []);

  const handleButtonClick = () => inputRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setResult(null);
    setCreatedAt(null);
    setImageBase64(null);
    setAudioBase64(null);
    cardIdRef.current = null;
    setIsFlipped(false);
    setPreview(URL.createObjectURL(file));
    setLoading(true);
    try {
      const base64 = await resizeImageToBase64(file);
      const data = await generateCardStats(base64, context || undefined, customTitle || undefined);
      setResult(data);
      setCreatedAt(new Date());
      setImageBase64(base64);
      cardIdRef.current = `card-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al analizar la imagen.");
    } finally {
      setLoading(false);
    }
    e.target.value = "";
  };

  function buildSavedCard(): SavedCard | null {
    if (!result || !imageBase64 || !cardIdRef.current) return null;
    return {
      id: cardIdRef.current,
      imagePreview: imageBase64,
      title: result.title,
      description: result.description,
      stats: result.stats,
      rarity: result.rarity,
      location: locationEnabled ? locationText || undefined : undefined,
      hasAudio: !!audioBase64,
      audioBase64: audioBase64 ?? undefined,
    };
  }


  const toggleCollection = (id: string) => {
    const card = buildSavedCard();
    const id_ = cardIdRef.current;
    if (!card || !id_) return;
    const wasSelected = selectedCollections.has(id);
    setSelectedCollections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    if (wasSelected) {
      removeCardFromCollection(id, id_);
    } else {
      addCardToCollection(id, card);
    }
  };

  useEffect(() => {
    if (!result) return;
    if (isFavorite) {
      const c = buildSavedCard();
      if (c) setFavoriteCard(c);
    } else {
      setFavoriteCard(null);
    }
  }, [isFavorite, result, imageBase64, locationEnabled, locationText, audioBase64]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size) chunks.push(e.data);
      };
      recorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunks, { type: "audio/webm" });
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result as string;
          setAudioBase64(base64);
        };
        reader.readAsDataURL(blob);
      };
      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
    } catch {
      setError("Couldn't access the microphone.");
    }
  };

  const stopRecording = () => {
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      recorder.stop();
      setIsRecording(false);
    }
  };

  const rarity = result ? rarityToKey(result.rarity) : "common";
  const gradient = FRAME_GRADIENT[rarity];
  const backBg = RARITY_BACK_BG[rarity];
  const isLegendary = rarity === "legendary";

  return (
    <div className="space-y-6">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Optional context and title fields */}
      <div className="space-y-3">
        <div>
          <label htmlFor="custom-title" className="text-sm font-medium text-foreground mb-1.5 block">
            Custom Title <span className="text-muted-foreground">(optional)</span>
          </label>
          <input
            id="custom-title"
            type="text"
            value={customTitle}
            onChange={(e) => setCustomTitle(e.target.value)}
            placeholder="e.g., The Coffee Warrior"
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent"
          />
        </div>
        <div>
          <label htmlFor="context" className="text-sm font-medium text-foreground mb-1.5 block">
            Context <span className="text-muted-foreground">(optional)</span>
          </label>
          <textarea
            id="context"
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="Add context for AI (e.g., 'This was taken at my graduation' or 'My first marathon')"
            rows={3}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent resize-none"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={handleButtonClick}
        disabled={loading}
        className={cn(
          "w-full flex flex-col items-center justify-center gap-3 py-12 rounded-3xl border-2 border-dashed border-border",
          "bg-muted/50 hover:bg-muted transition-colors",
          "disabled:opacity-60 disabled:pointer-events-none"
        )}
      >
        {loading ? (
          <>
            <Loader2 className="w-14 h-14 text-[#8B5CF6] animate-spin" />
            <span className="text-sm font-semibold text-foreground">Analyzing Aura...</span>
          </>
        ) : (
          <>
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] flex items-center justify-center shadow-lg shadow-[#8B5CF6]/30">
              <Camera className="w-8 h-8 text-white" />
            </div>
            <span className="text-sm font-semibold text-foreground">
              Upload a photo to create your card
            </span>
          </>
        )}
      </button>

      {error && (
        <div className="rounded-2xl border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {preview && result && !loading && (
        <>
          {/* Flippable card: front = image + stats below; back = rarity bg + title + description */}
          <div className="max-w-[280px] mx-auto">
            <div
              className="relative w-full cursor-pointer perspective-[1000px]"
              onClick={() => setIsFlipped(!isFlipped)}
            >
              <motion.div
                className="relative w-full"
                initial={false}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.5, type: "spring", stiffness: 80, damping: 18 }}
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Frente: marco grueso + imagen + stats debajo */}
                <div
                  className="rounded-2xl [backface-visibility:hidden]"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <div className={cn("relative rounded-2xl", FRAME_PADDING, gradient)}>
                    {isLegendary && (
                      <>
                        <Sparkles className="absolute top-1 left-2 w-3 h-3 text-white/90 z-10" />
                        <Sparkles className="absolute top-1 right-2 w-3 h-3 text-white/90 z-10" />
                        <Sparkles className="absolute bottom-1 left-2 w-3 h-3 text-white/90 z-10" />
                        <Sparkles className="absolute bottom-1 right-2 w-3 h-3 text-white/90 z-10" />
                      </>
                    )}
                    <div className="relative aspect-[3/4] rounded-t-[10px] overflow-hidden bg-muted">
                      <img
                        src={preview}
                        alt="Carta"
                        className="w-full h-full object-cover"
                      />
                      {/* Aura: top-right, icon + points only */}
                      <div
                        className={cn(
                          "absolute top-2 right-2 z-10 flex items-center gap-1 rounded-lg px-2 py-1",
                          "bg-black/50 backdrop-blur-sm border border-white/20",
                          "shadow-md"
                        )}
                        aria-label={`${result.stats.aura} Aura`}
                      >
                        <Sparkles className="w-4 h-4 text-amber-300/95" />
                        <span className="text-sm font-bold tabular-nums text-white">
                          {result.stats.aura}
                        </span>
                      </div>
                    </div>
                    {/* Stats ON the card, below photo — CHR, STY, NAT only */}
                    <div
                      className={cn(
                        "rounded-b-[10px] -mt-0.5 flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 px-2 min-h-[52px]",
                        "border-t border-white/20 shadow-inner",
                        RARITY_STATS_STRIP[rarity]
                      )}
                    >
                      <StatPill rarity={rarity} label="CHR" value={result.stats.charisma} />
                      <StatPill rarity={rarity} label="STY" value={result.stats.style} />
                      <StatPill rarity={rarity} label="NAT" value={result.stats.nature} />
                    </div>
                  </div>
                </div>

                {/* Back: rarity bg + title + description + date + creator */}
                <div
                  className={cn(
                    "absolute inset-0 rounded-2xl p-4 flex flex-col justify-center text-white [backface-visibility:hidden]",
                    backBg
                  )}
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                  }}
                >
                  <p className="text-[10px] font-medium text-white/80 uppercase tracking-wider mb-1">
                    {result.rarity}
                  </p>
                  <h3 className="text-lg font-bold mb-2 line-clamp-2">{result.title}</h3>
                  <p className="text-sm text-white/95 leading-relaxed line-clamp-4">
                    {result.description}
                  </p>
                  {createdAt && (
                    <p className="text-[10px] text-white/70 mt-2">
                      Created {createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                  )}
                  {creator && (
                    <p className="text-[10px] text-white/80 mt-0.5 font-medium">
                      by {creator}
                    </p>
                  )}
                  <p className="text-xs text-white/70 mt-3">Tap to see the front</p>
                </div>
              </motion.div>
            </div>
            <p className="text-center text-xs text-muted-foreground mt-2">
              Tap the card to flip
            </p>
          </div>

          {/* Location */}
          <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Location</span>
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={locationEnabled}
                onChange={(e) => setLocationEnabled(e.target.checked)}
                className="rounded border-border"
              />
              <span className="text-sm text-muted-foreground">Enable location</span>
            </label>
            {locationEnabled && (
              <input
                type="text"
                value={locationText}
                onChange={(e) => setLocationText(e.target.value)}
                placeholder="Enter location manually"
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-muted/50 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/50"
              />
            )}
          </div>

          {/* Record audio */}
          <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Mic className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Audio for the card</span>
            </div>
            {!audioBase64 ? (
              <button
                type="button"
                onClick={isRecording ? stopRecording : startRecording}
                className={cn(
                  "w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                  isRecording
                    ? "bg-red-500/15 text-red-500"
                    : "bg-muted hover:bg-muted/80 text-foreground"
                )}
              >
                {isRecording ? (
                  <>
                    <Square className="w-4 h-4 fill-current" />
                    Stop recording
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4" />
                    Record audio for the card
                  </>
                )}
              </button>
            ) : (
              <p className="text-sm text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                <Mic className="w-4 h-4" />
                Audio ready
              </p>
            )}
          </div>

          {/* Save to collections + Favorite */}
          <div className="rounded-2xl border border-border bg-card p-4 space-y-4">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowCollections(!showCollections)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors",
                  "bg-muted hover:bg-muted/80 text-foreground"
                )}
              >
                <FolderOpen className="w-4 h-4" />
                {selectedCollections.size > 0
                  ? `${selectedCollections.size} collection(s)`
                  : "Add to collections"}
              </button>
              <button
                type="button"
                onClick={() => setIsFavorite(!isFavorite)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors",
                  isFavorite
                    ? "bg-red-500/15 text-red-500"
                    : "bg-muted hover:bg-muted/80 text-foreground"
                )}
                aria-label={isFavorite ? "Remove from favorites" : "Mark as favorite"}
              >
                <Heart
                  className={cn("w-4 h-4", isFavorite && "fill-red-500")}
                />
                {isFavorite ? "Favorite" : "Favorite"}
              </button>
            </div>

            {showCollections && (
              <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
                {COLLECTIONS.map((col) => {
                  const selected = selectedCollections.has(col.id);
                  return (
                    <button
                      key={col.id}
                      type="button"
                      onClick={() => toggleCollection(col.id)}
                      className={cn(
                        "px-3 py-1.5 rounded-xl text-xs font-medium transition-colors",
                        selected
                          ? "bg-[#8B5CF6] text-white"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      )}
                    >
                      {col.name}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function StatPill({
  rarity,
  label,
  value,
}: {
  rarity: CardRarity;
  label: string;
  value: number;
}) {
  return (
    <div
      className={cn(
        "px-2 py-1 rounded-lg bg-white/15 backdrop-blur-sm border border-white/30",
        "shadow-sm"
      )}
    >
      <span className="text-[9px] font-semibold uppercase tracking-wider text-white/80">
        {label}
      </span>
      <span
        className={cn(
          "ml-1 text-sm font-bold tabular-nums",
          "bg-gradient-to-r bg-clip-text text-transparent",
          RARITY_VALUE_GRADIENT[rarity]
        )}
      >
        {value}
      </span>
    </div>
  );
}
