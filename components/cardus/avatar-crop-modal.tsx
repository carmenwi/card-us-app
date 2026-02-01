"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const CROP_SIZE = 200;

type AvatarCropModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageSrc: string | null;
  onConfirm: (croppedDataUrl: string) => void;
};

export function AvatarCropModal({
  open,
  onOpenChange,
  imageSrc,
  onConfirm,
}: AvatarCropModalProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [naturalSize, setNaturalSize] = useState({ w: 0, h: 0 });
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || !imageSrc) return;
    setPosition({ x: 0, y: 0 });
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      setNaturalSize({ w: img.naturalWidth, h: img.naturalHeight });
    };
    img.src = imageSrc;
  }, [open, imageSrc]);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    },
    [position]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    },
    [isDragging, dragStart]
  );

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleConfirm = useCallback(() => {
    if (!imageSrc || !imageRef.current || !naturalSize.w || !naturalSize.h) return;
    const img = imageRef.current;
    const W = naturalSize.w;
    const H = naturalSize.h;
    const scale = Math.max(CROP_SIZE / W, CROP_SIZE / H);
    const srcSize = CROP_SIZE / scale;
    const srcX = Math.max(0, Math.min(W - srcSize, -position.x / scale));
    const srcY = Math.max(0, Math.min(H - srcSize, -position.y / scale));
    const srcW = Math.min(srcSize, W - srcX);
    const srcH = Math.min(srcSize, H - srcY);

    const canvas = document.createElement("canvas");
    canvas.width = CROP_SIZE;
    canvas.height = CROP_SIZE;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.beginPath();
    ctx.arc(CROP_SIZE / 2, CROP_SIZE / 2, CROP_SIZE / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, CROP_SIZE, CROP_SIZE);

    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
    onConfirm(dataUrl);
    onOpenChange(false);
  }, [imageSrc, position, naturalSize, onConfirm, onOpenChange]);

  useEffect(() => {
    if (!open) return;
    const onPointerUp = () => setIsDragging(false);
    window.addEventListener("pointerup", onPointerUp);
    return () => window.removeEventListener("pointerup", onPointerUp);
  }, [open]);

  if (!imageSrc) return null;

  const scale =
    naturalSize.w && naturalSize.h
      ? Math.max(CROP_SIZE / naturalSize.w, CROP_SIZE / naturalSize.h)
      : 1;
  const displayW = naturalSize.w * scale;
  const displayH = naturalSize.h * scale;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[320px] p-4 gap-4">
        <DialogHeader>
          <DialogTitle>Crop profile photo</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Drag the image to position it. The circle will be your profile photo.
        </p>
        <div
          ref={containerRef}
          className="relative w-[200px] h-[200px] mx-auto rounded-full overflow-hidden bg-muted border-2 border-border select-none"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          style={{ touchAction: "none" }}
        >
          <img
            ref={imageRef}
            src={imageSrc}
            alt="Crop"
            className="absolute pointer-events-none object-cover"
            style={{
              left: position.x,
              top: position.y,
              width: displayW,
              height: displayH,
              minWidth: CROP_SIZE,
              minHeight: CROP_SIZE,
            }}
            draggable={false}
          />
        </div>
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>Use photo</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
