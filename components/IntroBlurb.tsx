"use client";

import { Heading1 } from "@/mdx-components";
import { useLanguage } from "@/components/useLanguage";
import { twMerge } from "tailwind-merge";

type IntroBlurbProperties = {
  className?: string;
};

const COPY = {
  en: {
    title: "Hey, I'm childtom",
    body: "I'm a romantic front-end code poet. I build the structure with React/Vue and paint the soul with CSS. My promise to this world is like a JavaScript Promise: sometimes pending, but if you're willing to await, I'll never reject.",
  },
  zh: {
    title: "嘿，我是 childtom",
    body: "我是一名浪漫主义前端代码诗人。用 React/Vue 搭建骨架，用 CSS 涂抹灵魂。我对这个世界的承诺就像 JS 里的 Promise，虽然偶尔会处于 pending 状态，但只要你愿意 await，我绝不 reject。",
  },
} as const;

export function IntroBlurb({ className }: IntroBlurbProperties) {
  const [language] = useLanguage();
  const showZh = language === "zh";

  return (
    <div className={className}>
      <Heading1 className="text-5xl/tight md:text-6xl/tight -skew-y-3 md:-skew-y-6 md:origin-left md:mt-4">
        <span className="relative inline-grid align-middle">
          <span className="invisible col-start-1 row-start-1" aria-hidden="true">
            {COPY.en.title}
          </span>
          <span className="invisible col-start-1 row-start-1" aria-hidden="true">
            {COPY.zh.title}
          </span>
          <span className="col-start-1 row-start-1 inline-grid h-[1.2em] overflow-hidden">
            <span
              className={twMerge(
                "col-start-1 row-start-1 transition-opacity duration-300 ease-out",
                showZh ? "opacity-0" : "opacity-100"
              )}
            >
              {COPY.en.title}
            </span>
            <span
              className={twMerge(
                "col-start-1 row-start-1 transition-opacity duration-300 ease-out",
                showZh ? "opacity-100" : "opacity-0"
              )}
            >
              {COPY.zh.title}
            </span>
          </span>
        </span>
      </Heading1>

      <div className={twMerge("relative grid md:text-lg")}>
        <div
          className={twMerge(
            "col-start-1 row-start-1 transition-opacity duration-300 ease-out",
            showZh ? "opacity-0" : "opacity-100"
          )}
        >
          {COPY.en.body}
        </div>
        <div
          className={twMerge(
            "col-start-1 row-start-1 transition-opacity duration-300 ease-out",
            showZh ? "opacity-100" : "opacity-0"
          )}
        >
          {COPY.zh.body}
        </div>
      </div>
    </div>
  );
}
