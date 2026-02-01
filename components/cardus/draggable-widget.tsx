"use client";

import { useRef, useCallback, useEffect } from "react";
import { motion, useMotionValue } from "framer-motion";
import { GripVertical, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { WidgetLayout } from "@/lib/profile-layout";

type DraggableWidgetProps = {
  id: string;
  layout: WidgetLayout;
  isEditMode: boolean;
  isDragging?: boolean;
  onLayoutChange: (layout: WidgetLayout) => void;
  children: React.ReactNode;
  minW?: number;
  minH?: number;
  autoHeight?: boolean;
  onDragStart?: () => void;
  onDrag?: (x: number, y: number) => void;
  onDragEnd?: () => void;
  onResizeStart?: () => void;
  onResizeEnd?: () => void;
  overflowVisible?: boolean;
};

export function DraggableWidget({
  id,
  layout,
  isEditMode,
  isDragging = false,
  onLayoutChange,
  children,
  minW = 120,
  minH = 80,
  autoHeight = false,
  onDragStart,
  onDrag,
  onDragEnd,
  onResizeStart,
  onResizeEnd,
  overflowVisible = false,
}: DraggableWidgetProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const resizeRef = useRef<{ startX: number; startY: number; startW: number; startH: number } | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const handleDragEnd = useCallback(() => {
    const dx = x.get();
    const dy = y.get();
    onLayoutChange({
      ...layout,
      x: Math.max(0, layout.x + dx),
      y: Math.max(0, layout.y + dy),
    });
    x.set(0);
    y.set(0);
  }, [layout, onLayoutChange, x, y]);

  const handleResizeStart = (e: React.PointerEvent) => {
    e.preventDefault();
    onResizeStart?.();
    resizeRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startW: layout.w,
      startH: layout.h,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handleResizeMove = useCallback(
    (e: React.PointerEvent) => {
      if (!resizeRef.current) return;
      const dx = e.clientX - resizeRef.current.startX;
      const dy = e.clientY - resizeRef.current.startY;
      const newW = Math.max(minW, resizeRef.current.startW + dx);
      const newH = Math.max(minH, resizeRef.current.startH + dy);
      resizeRef.current.startX = e.clientX;
      resizeRef.current.startY = e.clientY;
      resizeRef.current.startW = newW;
      resizeRef.current.startH = newH;
      onLayoutChange({ ...layout, w: newW, h: newH });
    },
    [layout, minW, minH, onLayoutChange]
  );

  const handleResizeEnd = (e: React.PointerEvent) => {
    resizeRef.current = null;
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    onResizeEnd?.();
  };

  useEffect(() => {
    if (!isEditMode || !autoHeight) return;
    const target = contentRef.current;
    if (!target) return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      requestAnimationFrame(() => {
        const nextH = Math.max(minH, Math.ceil(entry.contentRect.height));
        if (Math.abs(nextH - layout.h) > 1) {
          onLayoutChange({ ...layout, h: nextH });
        }
      });
    });
    observer.observe(target);
    // Trigger initial measurement
    requestAnimationFrame(() => {
      const rect = target.getBoundingClientRect();
      const nextH = Math.max(minH, Math.ceil(rect.height));
      if (Math.abs(nextH - layout.h) > 1) {
        onLayoutChange({ ...layout, h: nextH });
      }
    });
    return () => observer.disconnect();
  }, [autoHeight, isEditMode, layout, minH, onLayoutChange]);

  if (!isEditMode) {
    return <>{children}</>;
  }

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0}
      initial={false}
      style={{
        position: "absolute",
        left: layout.x,
        top: layout.y,
        width: layout.w,
        x,
        y,
        zIndex: isDragging ? 50 : 10,
      }}
      transition={isDragging ? { type: "inertia" } : { type: "spring", stiffness: 400, damping: 40 }}
      onDragEnd={handleDragEnd}
      onDragStart={onDragStart}
      onDragEndCapture={onDragEnd}
      onUpdate={(latest) => {
        if (typeof latest.x === "number") x.set(latest.x);
        if (typeof latest.y === "number") y.set(latest.y);
        if (onDrag && typeof latest.x === "number" && typeof latest.y === "number") {
          const currentX = layout.x + latest.x;
          const currentY = layout.y + latest.y;
          onDrag(currentX, currentY);
        }
      }}
      className={cn(
        "rounded-2xl border-2 border-dashed transition-all duration-200",
        isDragging 
          ? "border-purple-400 bg-card/98 shadow-2xl scale-[1.02]" 
          : "border-purple-300/50 bg-card/90 shadow-md hover:shadow-lg hover:border-purple-400/70",
        overflowVisible ? "overflow-visible" : "overflow-hidden"
      )}
    >
      <div className="absolute top-2 left-2 z-20 flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-purple-500/15 to-purple-400/10 px-2.5 py-1.5 cursor-grab active:cursor-grabbing opacity-0 hover:opacity-100 transition-opacity">
        <GripVertical className="w-3.5 h-3.5 text-purple-500 opacity-70" />
        <span className="text-[11px] font-semibold text-foreground/70 capitalize tracking-wide">{id}</span>
      </div>
      <div className={autoHeight ? "w-full" : "w-full overflow-auto"}>
        <div
          ref={contentRef}
          className="w-full"
        >
          {children}
        </div>
      </div>
      <div
        className="absolute bottom-0 right-0 w-8 h-8 cursor-se-resize flex items-center justify-center bg-gradient-to-tl from-purple-500/20 to-transparent rounded-tl-xl opacity-0 hover:opacity-100 transition-opacity"
        onPointerDown={handleResizeStart}
        onPointerMove={handleResizeMove}
        onPointerUp={handleResizeEnd}
        onPointerLeave={handleResizeEnd}
      >
        <Maximize2 className="w-3.5 h-3.5 text-purple-400" />
      </div>
    </motion.div>
  );
}
