"use client";

import React from "react";
import { Sun, Moon, Laptop } from "lucide-react";
import { useTheme } from "./ThemeProvider";

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export function ThemeToggle({ className = "", showLabel = false }: ThemeToggleProps) {
  const { theme, rotateTheme, isSignedIn } = useTheme();

  // Only displayed after user has logged in
  if (!isSignedIn) return null;

  const getThemeInfo = () => {
    switch (theme) {
      case "dark":
        return {
          icon: <Moon className="size-3.5 text-[#E6A9B8]" />,
          label: "Dark",
          next: "Light",
        };
      case "light":
        return {
          icon: <Sun className="size-3.5 text-[#BD737D]" />,
          label: "Light",
          next: "System",
        };
      case "system":
        return {
          icon: <Laptop className="size-3.5 text-[var(--muted-foreground)]" />,
          label: "System",
          next: "Dark",
        };
    }
  };

  const info = getThemeInfo();

  return (
    <button
      onClick={rotateTheme}
      type="button"
      className={`relative inline-flex items-center justify-center gap-1.5 h-8 px-2.5 rounded-full border border-[var(--border)] bg-[var(--surface-secondary)]/80 hover:bg-[var(--surface-highlight)] text-[var(--foreground)] transition-all duration-200 cursor-pointer shadow-xs active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] shrink-0 ${className}`}
      title={`Theme: ${info.label} (Click to switch to ${info.next})`}
      aria-label={`Toggle theme, currently ${info.label}`}
    >
      {info.icon}
      {showLabel && (
        <span className="text-[11px] font-semibold text-[var(--foreground)] select-none">
          {info.label}
        </span>
      )}
    </button>
  );
}
