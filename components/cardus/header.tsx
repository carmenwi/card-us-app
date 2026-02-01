"use client";

import { Sparkles, Bell } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface HeaderProps {
  /** Hide Aura chip when true (e.g. on Profile where it's shown elsewhere) */
  hideAura?: boolean;
}

export function Header({ hideAura = false }: HeaderProps) {
  const [showNotification, setShowNotification] = useState(false);
  const [notificationIndex, setNotificationIndex] = useState(0);
  const [customMessage, setCustomMessage] = useState<string | null>(null);
  const [customColor, setCustomColor] = useState("from-purple-500 to-purple-600");

  const pushNotifications = [
    { message: "⏰ Time to post!", color: "from-[#3B82F6] to-[#2563EB]" },
    { message: "🎯 New battle challenge!", color: "from-orange-500 to-orange-600" },
    { message: "🔄 Trade offer received!", color: "from-green-500 to-green-600" },
    { message: "❤️ Someone liked your card!", color: "from-pink-500 to-pink-600" },
    { message: "✨ You earned 100 Aura!", color: "from-purple-500 to-purple-600" },
  ];

  useEffect(() => {
    const handleTradeAccepted = (event: Event) => {
      const customEvent = event as CustomEvent;
      setCustomMessage(customEvent.detail.message);
      setCustomColor("from-green-500 to-green-600");
      setShowNotification(true);
    };

    window.addEventListener("tradeAccepted", handleTradeAccepted);
    return () => window.removeEventListener("tradeAccepted", handleTradeAccepted);
  }, []);

  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => {
        setShowNotification(false);
        setCustomMessage(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [showNotification]);

  const handleBellClick = () => {
    setNotificationIndex((notificationIndex + 1) % pushNotifications.length);
    setCustomMessage(null);
    setShowNotification(true);
  };

  const currentNotification = pushNotifications[notificationIndex];
  const displayMessage = customMessage || currentNotification.message;
  const displayColor = customMessage ? customColor : currentNotification.color;

  return (
    <>
      {/* iPhone-style Push Notification */}
      {showNotification && (
        <div className="fixed top-0 left-0 right-0 z-[9999] pointer-events-none flex justify-center pt-2 px-2">
          <div
            style={{
              animation: "slideDown 0.4s ease-out forwards",
              "@keyframes slideDown": {
                from: {
                  transform: "translateY(-120px)",
                  opacity: 0,
                },
                to: {
                  transform: "translateY(0)",
                  opacity: 1,
                },
              },
            }}
            className={cn(
              "w-full max-w-sm bg-gradient-to-br",
              displayColor,
              "text-white rounded-[24px] px-5 py-4 shadow-2xl",
              "border border-white/20 backdrop-blur-md"
            )}
          >
            <p className="text-sm font-semibold text-center">{displayMessage}</p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideDown {
          from {
            transform: translateY(-150px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>

      <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/80 dark:bg-card/80 border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img src="/mock-images/logo_lila.png" alt="CardUS" className="w-8 h-8" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] bg-clip-text text-transparent">
              CardUS
            </h1>
          </div>

          {/* Right: Notifications + Theme + Aura */}
          <div className="flex items-center gap-0.5 sm:gap-1">
            {/* Notifications */}
            <button
              onClick={handleBellClick}
              aria-label="Notifications"
              className={cn(
                "p-2 rounded-xl transition-colors",
                "hover:bg-[#3B82F6]/10 dark:hover:bg-[#8B5CF6]/20",
                "text-muted-foreground hover:text-[#3B82F6] dark:hover:text-[#8B5CF6]"
              )}
            >
              <Bell className="w-5 h-5" />
            </button>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Aura Chip */}
            {!hideAura && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#3B82F6]/10 to-[#8B5CF6]/10 dark:from-[#3B82F6]/20 dark:to-[#8B5CF6]/20 border border-[#8B5CF6]/20 dark:border-[#8B5CF6]/30">
                <Sparkles className="w-4 h-4 text-[#8B5CF6]" />
                <span className="text-sm font-semibold bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] bg-clip-text text-transparent">
                  12,500 Aura
                </span>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
