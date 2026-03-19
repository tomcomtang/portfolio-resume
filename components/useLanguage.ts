"use client";

import { useEffect, useState } from "react";

export type Language = "en" | "zh";

const STORAGE_KEY = "language";
const EVENT_NAME = "portfolio:language-change";

export function useLanguage() {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const stored =
      typeof localStorage === "undefined"
        ? null
        : localStorage.getItem(STORAGE_KEY);

    if (stored === "zh" || stored === "en") {
      setLanguageState(stored);
    }

    const handleLanguageChange = () => {
      const current = localStorage.getItem(STORAGE_KEY);
      if (current === "zh" || current === "en") {
        setLanguageState(current);
      }
    };

    window.addEventListener(EVENT_NAME, handleLanguageChange);
    return () => {
      window.removeEventListener(EVENT_NAME, handleLanguageChange);
    };
  }, []);

  const setLanguage = (next: Language) => {
    localStorage.setItem(STORAGE_KEY, next);
    setLanguageState(next);
    window.dispatchEvent(new Event(EVENT_NAME));
  };

  return [language, setLanguage] as const;
}
