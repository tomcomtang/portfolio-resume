"use client";

import { BentoItem } from "@/components/BentoItem";
import { Heading2, Paragraph } from "@/mdx-components";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import { useEffect, useMemo, useState } from "react";

type WeatherResult = {
  description: string;
  icon: string;
  background: string;
  location: string;
};

function getFallback(): WeatherResult {
  return {
    description: "Weather unavailable",
    icon: "/openweather/04d@4x.png",
    background: twMerge(
      "bg-gradient-to-b before:opacity-25 dark:before:opacity-25",
      "from-gray-400 to-gray-200 dark:from-gray-700 dark:to-gray-800",
      "text-white"
    ),
    location: "Location unavailable",
  };
}

export function WeatherCard() {
  const fallback = useMemo(() => getFallback(), []);
  const [weather, setWeather] = useState<WeatherResult>(fallback);

  useEffect(() => {
    let cancelled = false;

    async function fetchWeatherServerFallback() {
      const res = await fetch(`/api/weather`, { cache: "no-store" });
      if (!res.ok) return;
      const data = (await res.json()) as WeatherResult;
      if (!cancelled) setWeather(data);
    }

    async function fetchWeather(lat: number, lon: number) {
      const res = await fetch(`/api/weather?lat=${lat}&lon=${lon}`, {
        cache: "no-store",
      });
      if (!res.ok) return;
      const data = (await res.json()) as WeatherResult;
      if (!cancelled) setWeather(data);
    }

    // First paint: use server's fallback location (deployment region / configured coords).
    void fetchWeatherServerFallback();

    if (!("geolocation" in navigator)) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        void fetchWeather(pos.coords.latitude, pos.coords.longitude);
      },
      () => {
        // User denied / unavailable; keep server fallback.
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 60_000 }
    );

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <BentoItem
      className={twMerge(
        "h-72 order-2 col-span-6 md:col-span-4 bg-gray-300 dark:bg-gray-700",
        weather.background
      )}
    >
      <Image
        alt=""
        src={weather.icon}
        height={128}
        width={128}
        className={twMerge(
          "justify-self-start self-end w-48 -mt-8 -mb-12 sm:-mx-8 sm:-mt-12 sm:-mb-16 hue-rotate-[10deg] brightness-200 saturate-150 drop-shadow-lg",
          weather.icon.includes("/wn/13") && "brightness-0 invert"
        )}
        unoptimized
      />
      <Heading2
        className={twMerge(
          "text-3xl/tight md:text-4xl/tight",
          weather.icon.includes("n@") && "font-bold tracking-wide"
        )}
      >
        {weather.description}
      </Heading2>
      <Paragraph>{weather.location}</Paragraph>
    </BentoItem>
  );
}

