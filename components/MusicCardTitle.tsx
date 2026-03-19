"use client";

import { useLanguage } from "@/components/useLanguage";
import { twMerge } from "tailwind-merge";

const COPY = {
  en: "My Life's Theme Song",
  zh: "我的生活主旋律",
} as const;

export function MusicCardTitle({ fallbackName }: { fallbackName: string }) {
  const [language] = useLanguage();
  const showZh = language === "zh";

  return (
    <span className="relative inline-grid line-clamp-2">
      <span
        className={twMerge(
          "col-start-1 row-start-1 transition-opacity duration-300 ease-out",
          showZh ? "opacity-0" : "opacity-100"
        )}
      >
        {COPY.en}
      </span>
      <span
        className={twMerge(
          "col-start-1 row-start-1 transition-opacity duration-300 ease-out",
          showZh ? "opacity-100" : "opacity-0"
        )}
      >
        {COPY.zh}
      </span>
    </span>
  );
}
