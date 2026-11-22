"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Sun, Moon, Laptop } from "lucide-react";

export type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
  rotateTheme: () => void;
  isSignedIn: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  resolvedTheme: "light",
  setTheme: () => {},
  rotateTheme: () => {},
  isSignedIn: false,
});

const THEME_STORAGE_KEY = "aavya-theme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoaded } = useUser();
  const [theme, setThemeState] = useState<Theme>("dark");
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");

  // Read theme preference or apply default upon auth load
  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      // Unauthenticated users always view the default light design
      setThemeState("light");
      setResolvedTheme("light");
      document.documentElement.removeAttribute("data-theme");
      return;
    }

    // Authenticated users: default to dark if not set
    const saved = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
    const initialTheme: Theme = saved && ["light", "dark", "system"].includes(saved) ? saved : "dark";
    setThemeState(initialTheme);
  }, [isSignedIn, isLoaded]);

  // Apply resolved theme attribute to <html>
  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      document.documentElement.removeAttribute("data-theme");
      setResolvedTheme("light");
      return;
    }

    const applyTheme = () => {
      let active: "light" | "dark" = "dark";
      if (theme === "system") {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        active = prefersDark ? "dark" : "light";
      } else {
        active = theme;
      }
      setResolvedTheme(active);

      if (active === "dark") {
        document.documentElement.setAttribute("data-theme", "dark");
      } else {
        document.documentElement.removeAttribute("data-theme");
      }
    };

    applyTheme();

    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = () => applyTheme();
      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    }
  }, [theme, isSignedIn, isLoaded]);

  const setTheme = (newTheme: Theme) => {
    if (!isSignedIn) return;
    setThemeState(newTheme);
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);
  };

  const rotateTheme = () => {
    if (!isSignedIn) return;
    const next: Theme = theme === "dark" ? "light" : theme === "light" ? "system" : "dark";
    setTheme(next);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        resolvedTheme,
        setTheme,
        rotateTheme,
        isSignedIn: !!isSignedIn,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

export function useThemeInfo() {
  const { theme, rotateTheme, resolvedTheme, isSignedIn } = useTheme();

  const getDetails = () => {
    switch (theme) {
      case "dark":
        return {
          label: "Dark",
          switchLabel: "Theme: Dark (Switch to Light)",
          icon: <Moon className="size-4 text-[#E6A9B8]" />,
        };
      case "light":
        return {
          label: "Light",
          switchLabel: "Theme: Light (Switch to System)",
          icon: <Sun className="size-4 text-[#BD737D]" />,
        };
      case "system":
        return {
          label: "System",
          switchLabel: "Theme: System (Switch to Dark)",
          icon: <Laptop className="size-4 text-[var(--muted-foreground)]" />,
        };
    }
  };

  return { ...getDetails(), rotateTheme, theme, resolvedTheme, isSignedIn };
}
