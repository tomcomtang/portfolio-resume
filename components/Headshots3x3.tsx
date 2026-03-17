"use client";

import sprite from "@/assets/headshots-3x3.png";
import preview from "@/assets/headshotsPreview-3x3.png";
import { useCallback, useEffect, useRef, useState } from "react";

type Headshots3x3Props = JSX.IntrinsicElements["div"];

type Cell = {
  row: number;
  col: number;
};

const rows = 3;
const cols = 3;

export function Headshots3x3(props: Headshots3x3Props) {
  // When false: show preview only, don't bind hover events.
  // When true: swap to full sprite + enable interaction.
  const [loaded, setLoaded] = useState(false);
  const [transform, setTransform] = useState(
    `translate3d(-${100 / cols}%, -${100 / rows}%, 0)`
  );
  const ref = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const transformRef = useRef(transform);

  // Preload the full sprite in the background, then enable interaction.
  useEffect(() => {
    let cancelled = false;

    async function preload() {
      try {
        const img = new Image();
        img.decoding = "async";
        img.src = sprite.src;
        // Wait for network load
        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = () => reject(new Error("failed to load sprite"));
        });
        // Hint decode before first paint (best-effort)
        if (typeof img.decode === "function") await img.decode();
      } catch {
        // Even if preload fails, we can still try to show the sprite later.
      } finally {
        if (!cancelled) setLoaded(true);
      }
    }

    void preload();
    return () => {
      cancelled = true;
    };
  }, []);

  const handlePointer = useCallback((event: MouseEvent | TouchEvent) => {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const [clientX, clientY] = [
      "clientX" in event ? event.clientX : event.changedTouches[0].clientX,
      "clientY" in event ? event.clientY : event.changedTouches[0].clientY,
    ];

    // Allow pointer outside container (match original): clamp to edges.
    const x = (clientX - rect.left) / rect.width;
    const y = (clientY - rect.top) / rect.height;
    const cx = Math.min(1, Math.max(0, x));
    const cy = Math.min(1, Math.max(0, y));

    // Pick nearest cell center (stable).
    const rawCol = Math.min(cols - 1, Math.max(0, Math.round(cx * (cols - 1))));
    const rawRow = Math.min(rows - 1, Math.max(0, Math.round(cy * (rows - 1))));

    // Mirror X so moving right looks right.
    const col = cols - 1 - rawCol;
    const row = rawRow;

    const translateX = -(100 / cols) * col;
    const translateY = -(100 / rows) * row;
    const nextTransform = `translate3d(${translateX}%, ${translateY}%, 0)`;
    if (transformRef.current === nextTransform) return;
    transformRef.current = nextTransform;

    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      setTransform(nextTransform);
      rafRef.current = null;
    });
  }, []);

  useEffect(() => {
    if (!loaded) return;
    window.addEventListener("mousemove", handlePointer);
    window.addEventListener("touchstart", handlePointer);
    window.addEventListener("touchmove", handlePointer);

    return () => {
      window.removeEventListener("mousemove", handlePointer);
      window.removeEventListener("touchstart", handlePointer);
      window.removeEventListener("touchmove", handlePointer);
    };
  }, [loaded, handlePointer]);

  return (
    <div {...props}>
      <div className="mx-auto max-w-[50vw] -mb-8">
        <div className="overflow-hidden">
          <div className="relative w-full pb-[133.3333%] -m-1" ref={ref}>
            <img
              src={loaded ? sprite.src : preview.src}
              alt=""
              className="absolute top-0 left-0 w-[300%] max-w-none mix-blend-hard-light dark:contrast-0 dark:mix-blend-luminosity"
              style={{
                transform,
                willChange: "transform",
                backfaceVisibility: "hidden",
              }}
              draggable={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

