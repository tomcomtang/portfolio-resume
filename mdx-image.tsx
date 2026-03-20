"use client";

import { useEffect, useMemo, useState } from "react";
import NextImage from "next/image";
import { twMerge } from "tailwind-merge";

// MDX 的 `img` 渲染器：按 assets/images/* 动态导入实际图片模块，供 NextImage 使用。
export function MDXImage({
  src: path,
  title: maxWidth,
  className,
  ...properties
}: JSX.IntrinsicElements["img"]) {
  const imagePath = useMemo(() => String(path), [path]);

  const [imageModule, setImageModule] = useState<{
    src: string;
    height: number;
    width: number;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;
    setImageModule(null);

    (async () => {
      try {
        const image = await import(
          // webpackInclude: /\.mdx$|\.png$|\.jpg$|\.jpeg$|\.webp$|\.gif$|\.svg$/
          `@/assets/images/${imagePath}`
        );
        if (cancelled) return;
        setImageModule(image.default as any);
      } catch {
        // Keep blank if the image can't be resolved.
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [imagePath]);

  if (!imageModule) return null;

  const { src, height, width } = imageModule;

  return (
    // @ts-ignore
    <NextImage
      {...properties}
      src={src}
      height={height}
      width={width}
      sizes="(min-width: 640px) 66.6666vw, 100vw"
      className={twMerge(
        "my-4 w-full max-h-[60svh] object-contain object-left drop-shadow-md dark:brightness-90",
        className
      )}
      style={{
        maxWidth,
      }}
    />
  );
}

