"use client";

import { useEffect, useState } from "react";
import Image, { StaticImageData } from "next/image";
import tencent2020Image from "@/assets/tencent-img/tencent-2020.png";
import tencent2022Image from "@/assets/tencent-img/tencent-2022.jpg";
import tencent2025Image from "@/assets/tencent-img/tencent-2025.png";
import tencent25Image from "@/assets/tencent-img/tencent-25.png";
import tencent26Image from "@/assets/tencent-img/tencent-26.png";
import tencentHeyingImage from "@/assets/tencent-img/tencent-heying.png";
import tuanjian2Image from "@/assets/tencent-img/tuanjian-2.png";
import xinnianWanhui2Image from "@/assets/tencent-img/xinnianwanhui-2.png";

const CAROUSEL_IMAGES: StaticImageData[] = [
  tencent26Image,
  tencent25Image,
  tencent2025Image,
  tencent2020Image,
  tencent2022Image,
  tencentHeyingImage,
  tuanjian2Image,
  xinnianWanhui2Image,
];

const SLIDE_MS = 8400;

export function TencentMylesCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % CAROUSEL_IMAGES.length);
    }, SLIDE_MS);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 h-52 sm:h-[48%] sm:min-h-44 overflow-hidden">
      {CAROUSEL_IMAGES.map((image, index) => {
        const isActive = index === activeIndex;
        return (
          <div
            key={image.src}
            className={[
              "absolute inset-0 transition-opacity duration-[1800ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
              isActive ? "opacity-100" : "opacity-0",
            ].join(" ")}
          >
            <Image
              src={image}
              alt=""
              aria-hidden="true"
              fill
              quality={45}
              loading="lazy"
              className="object-cover object-top -translate-y-1 scale-110 blur-xl opacity-65"
              sizes="(min-width: 640px) 50vw, 100vw"
            />
            <Image
              src={image}
              alt="Tencent team photo background"
              fill
              quality={45}
              loading="lazy"
              className="object-cover object-top -translate-y-1 mix-blend-luminosity"
              sizes="(min-width: 640px) 50vw, 100vw"
            />
          </div>
        );
      })}

      <div className="absolute inset-0 bg-gradient-to-b from-transparent from-18% via-orange-300/28 via-58% to-orange-300 dark:via-amber-700/38 dark:to-amber-700" />
      <div className="absolute inset-x-0 bottom-0 h-24 sm:h-28 bg-gradient-to-b from-transparent via-orange-300/70 to-orange-300 blur-[2px] dark:via-amber-700/75 dark:to-amber-700" />
    </div>
  );
}
