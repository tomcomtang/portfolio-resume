"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { PlayIcon, PauseIcon } from "@heroicons/react/24/solid";
import { twMerge } from "tailwind-merge";

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

type Props = {
  src: string;
  title?: string;
  className?: string;
  compact?: boolean;
};

export function MiniAudioPlayer({ src, title, className, compact }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const progress = useMemo(() => {
    if (!duration) return 0;
    return Math.min(1, Math.max(0, currentTime / duration));
  }, [currentTime, duration]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime || 0);
    const onLoaded = () => setDuration(audio.duration || 0);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("durationchange", onLoaded);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);

    // If metadata was already loaded (e.g. cached), read duration immediately
    if (audio.readyState >= 1 && audio.duration) {
      setDuration(audio.duration);
    }

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("durationchange", onLoaded);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
    };
  }, []);

  async function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;
    try {
      if (audio.paused) {
        await audio.play();
      } else {
        audio.pause();
      }
    } catch {
      // Ignore autoplay / play() promise rejections.
    }
  }

  function seekFromEvent(e: React.MouseEvent<HTMLButtonElement>) {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.min(rect.width, Math.max(0, e.clientX - rect.left));
    audio.currentTime = (x / rect.width) * duration;
  }

  return (
    <div
      className={twMerge(
        "flex items-center",
        compact ? "gap-2" : "gap-3",
        className
      )}
    >
      <audio ref={audioRef} src={src} preload="metadata" />

      <button
        type="button"
        onClick={togglePlay}
        className={twMerge(
          "grid place-items-center rounded-full bg-white/15 hover:bg-white/25 active:bg-white/20 transition",
          compact ? "h-6 w-6" : "h-9 w-9"
        )}
        aria-label={isPlaying ? "Pause audio" : "Play audio"}
        title={title ?? "Play"}
      >
        {isPlaying ? (
          <PauseIcon
            className={twMerge(
              "text-white",
              compact ? "h-4 w-4" : "h-5 w-5"
            )}
            aria-hidden="true"
          />
        ) : (
          <PlayIcon
            className={twMerge(
              "text-white",
              compact ? "h-4 w-4 ml-0.5" : "h-5 w-5 ml-0.5"
            )}
            aria-hidden="true"
          />
        )}
      </button>

      <button
        type="button"
        onClick={seekFromEvent}
        className={twMerge(
          "relative rounded-full bg-white/15 overflow-hidden",
          compact ? "h-6 w-32 sm:w-40" : "h-7 w-40 sm:w-52"
        )}
        aria-label="Seek"
        title="Seek"
      >
        <span
          className="mini-eq__fill"
          style={
            {
              "--mini-eq-progress": `${progress * 100}%`,
            } as React.CSSProperties
          }
        />
        <span
          className={twMerge("mini-eq mini-eq--track", !isPlaying && "mini-eq--paused")}
          aria-hidden="true"
          title={isPlaying ? "Playing" : "Paused"}
        >
          {Array.from({ length: compact ? 18 : 22 }).map((_, i) => (
            <span
              // eslint-disable-next-line react/no-array-index-key
              key={i}
              className="mini-eq__bar"
              style={
                {
                  "--mini-eq-delay": `${i * 70}ms`,
                  "--mini-eq-static": String(
                    [0.55, 0.9, 0.65, 1, 0.75, 0.95, 0.6, 0.85, 0.7, 0.92][
                      i % 10
                    ]
                  ),
                } as React.CSSProperties
              }
            />
          ))}
        </span>
      </button>

      <div
        className={twMerge(
          "tabular-nums text-xs text-white/90 select-none",
          compact && "hidden sm:block"
        )}
      >
        {formatTime(currentTime)} / {formatTime(duration)}
      </div>
    </div>
  );
}

