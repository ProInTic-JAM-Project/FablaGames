"use client";

import { useEffect, useState } from "react";

type ThemeMode = "light" | "dark";

export function ThemeToggle() {
  const [mode, setMode] = useState<ThemeMode>("light");

  useEffect(() => {
    const stored = localStorage.getItem("theme") as ThemeMode | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = stored ?? (prefersDark ? "dark" : "light");
    const rafId = window.requestAnimationFrame(() => {
      setMode(initial);
    });

    return () => {
      window.cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", mode === "dark");
    try {
      localStorage.setItem("theme", mode);
    } catch {
      // ignore storage errors
    }
  }, [mode]);

  const toggle = () => {
    setMode((current) => (current === "dark" ? "light" : "dark"));
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600 transition hover:bg-white dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:bg-slate-900"
      aria-label={`Cambiar a modo ${mode === "dark" ? "claro" : "oscuro"}`}
    >
      <span className="text-sm">{mode === "dark" ? "☀️" : "🌙"}</span>
      {mode === "dark" ? "Modo claro" : "Modo oscuro"}
    </button>
  );
}
