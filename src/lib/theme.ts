import { useState, useEffect } from "react";

export type Theme = "light" | "dark";

let currentTheme: Theme = "light";
const listeners = new Set<() => void>();

// Read initial theme
try {
  const saved = localStorage.getItem("erp_theme");
  if (saved === "light" || saved === "dark") {
    currentTheme = saved;
  } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    currentTheme = "dark";
  }
} catch {}

// Set initial class list on document element
if (typeof window !== "undefined") {
  document.documentElement.classList.toggle("dark", currentTheme === "dark");
}

export function getTheme(): Theme {
  return currentTheme;
}

export function setTheme(theme: Theme) {
  if (currentTheme !== theme) {
    currentTheme = theme;
    try {
      localStorage.setItem("erp_theme", theme);
    } catch {}
    if (typeof window !== "undefined") {
      document.documentElement.classList.toggle("dark", theme === "dark");
    }
    listeners.forEach((l) => l());
  }
}

// Sync across tabs
if (typeof window !== "undefined") {
  try {
    window.addEventListener("storage", (e) => {
      if (e.key === "erp_theme") {
        const val = e.newValue;
        if (val === "light" || val === "dark") {
          currentTheme = val;
          document.documentElement.classList.toggle("dark", val === "dark");
          listeners.forEach((l) => l());
        }
      }
    });
  } catch {}
}

export function useTheme() {
  const [theme, setLocalTheme] = useState<Theme>(currentTheme);
  useEffect(() => {
    const handler = () => setLocalTheme(currentTheme);
    listeners.add(handler);
    return () => {
      listeners.delete(handler);
    };
  }, []);
  return {
    theme,
    toggleTheme: () => setTheme(theme === "light" ? "dark" : "light"),
    setTheme,
  };
}
