"use client";

import { useEffect } from "react";

export function ScrollToHash() {
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash || hash.length < 2) return;

    const id = decodeURIComponent(hash.slice(1));
    const el = document.getElementById(id);
    if (!el) return;

    // Let the layout settle (BentoGrid + animations) before scrolling.
    const t = window.setTimeout(() => {
      el.scrollIntoView({ block: "start", behavior: "auto" });
    }, 50);

    return () => window.clearTimeout(t);
  }, []);

  return null;
}

