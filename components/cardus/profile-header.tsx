"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Pencil, Check, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AvatarCropModal } from "@/components/cardus/avatar-crop-modal";
import { logout } from "@/lib/auth";
import type { ProfileData } from "@/lib/profile-data";

type ProfileHeaderProps = {
  profile: ProfileData;
  isEditing?: boolean;
  onEditModeChange?: (editing: boolean) => void;
  onProfileChange?: (profile: ProfileData) => void;
};

export function ProfileHeader({
  profile,
  isEditing,
  onEditModeChange,
  onProfileChange,
}: ProfileHeaderProps) {
  const p = profile;
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [pendingCropSrc, setPendingCropSrc] = useState<string | null>(null);

  const update = (patch: Partial<ProfileData>) => {
    onProfileChange?.({ ...p, ...patch });
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleAvatarFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPendingCropSrc(url);
    setCropModalOpen(true);
    e.target.value = "";
  };

  const handleCropConfirm = (croppedDataUrl: string) => {
    if (pendingCropSrc) URL.revokeObjectURL(pendingCropSrc);
    setPendingCropSrc(null);
    setCropModalOpen(false);
    update({ avatar: croppedDataUrl });
  };

  const handleCropClose = (open: boolean) => {
    if (!open && pendingCropSrc) {
      URL.revokeObjectURL(pendingCropSrc);
      setPendingCropSrc(null);
    }
    setCropModalOpen(open);
  };

  return (
    <header className="px-4 pt-6 pb-4">
      <div className="flex items-start gap-4">
        {/* Left: Profile pic + AI role below pic (+ upload when editing) */}
        <div className="relative shrink-0 flex flex-col items-center gap-2">
          <div className="relative p-0.5 rounded-full bg-gradient-to-br from-[#3B82F6] via-[#8B5CF6] to-amber-400">
            <div className="p-0.5 bg-white rounded-full">
              <Avatar className="h-20 w-20 rounded-full border-2 border-white">
                <AvatarImage src={p.avatar} alt={p.username} />
                <AvatarFallback className="bg-gradient-to-br from-[#3B82F6]/20 to-[#8B5CF6]/20">
                  LU
                </AvatarFallback>
              </Avatar>
            </div>
            {/* Centered + button overlay in edit mode */}
            {isEditing && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/50 transition-colors cursor-pointer group"
                aria-label="Upload profile picture"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/90 group-hover:bg-white transition-colors">
                  <span className="text-2xl font-light text-[#8B5CF6]">+</span>
                </div>
              </button>
            )}
          </div>
          {/* AI role below profile pic */}
          <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-gradient-to-r from-[#3B82F6]/10 to-[#8B5CF6]/10 border border-[#8B5CF6]/20">
            <span className="text-xs font-medium text-foreground">{p.aiRole}</span>
          </div>
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarFileSelect}
          />
        </div>

        {/* Right: Username + Aura (same row), Stats just below, Edit button (extreme right) */}
        <div className="flex-1 min-w-0 flex flex-col gap-1 pt-1">
          {/* Row 1: Username (left) — Aura (extreme right) */}
          <div className="flex items-center justify-between gap-2">
            {isEditing && onProfileChange ? (
              <input
                type="text"
                value={p.username}
                onChange={(e) => update({ username: e.target.value })}
                className="flex-1 min-w-0 text-lg font-bold text-foreground bg-muted rounded-lg px-2 py-1 border border-border"
                placeholder="Username"
              />
            ) : (
              <h1 className="text-lg font-bold text-foreground truncate flex-1 min-w-0">
                {p.username}
              </h1>
            )}
            <div className="flex items-center gap-1.5 shrink-0">
              <Sparkles className="w-4 h-4 text-[#8B5CF6] shrink-0" />
              <span className="text-sm font-semibold bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] bg-clip-text text-transparent whitespace-nowrap">
                {p.auraPoints.toLocaleString("en-US")} Aura
              </span>
            </div>
          </div>

          {/* Stats row — just below username */}
          <div className="flex gap-4 pt-2">
            <div className="text-center">
              <p className="text-base font-bold text-foreground">{p.friends}</p>
              <p className="text-[10px] text-muted-foreground">Friends</p>
            </div>
            <div className="text-center">
              <p className="text-base font-bold text-foreground">{p.cards}</p>
              <p className="text-[10px] text-muted-foreground">Cards</p>
            </div>
            <div className="text-center">
              <p className="text-base font-bold text-foreground">{p.collections}</p>
              <p className="text-[10px] text-muted-foreground">Collections</p>
            </div>
          </div>

          {/* Edit button — extreme right, same row as stats or below */}
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center justify-center w-9 h-9 rounded-full bg-muted hover:bg-red-500/20 text-muted-foreground hover:text-red-500 transition-colors shrink-0"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onEditModeChange?.(!isEditing)}
              className="flex items-center justify-center w-9 h-9 rounded-full bg-muted hover:bg-[#8B5CF6]/20 text-muted-foreground hover:text-[#8B5CF6] transition-colors shrink-0"
              aria-label={isEditing ? "Done" : "Edit profile"}
            >
              {isEditing ? (
                <Check className="w-4 h-4" />
              ) : (
                <Pencil className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      <AvatarCropModal
        open={cropModalOpen}
        onOpenChange={handleCropClose}
        imageSrc={pendingCropSrc}
        onConfirm={handleCropConfirm}
      />
    </header>
  );
}
