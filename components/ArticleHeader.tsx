"use client";

import { ArticleMetadata } from "@/types";
import { Heading1, Paragraph } from "@/mdx-components";
import { ViewCounter } from "./ViewCounter";
import { EyeIcon } from "@heroicons/react/24/outline";
import { twMerge } from "tailwind-merge";
import { useLanguage } from "@/components/useLanguage";

type Language = "en" | "zh";

type ArticleHeaderProperties = Omit<
  JSX.IntrinsicElements["div"],
  "children"
> & {
  metadata: ArticleMetadata;
  language?: Language;
};

export function ArticleHeader({
  metadata,
  language: forcedLanguage,
  className,
  ...properties
}: ArticleHeaderProperties) {
  const [language] = useLanguage();
  const activeLanguage = forcedLanguage ?? language;
  const showZh = activeLanguage === "zh";

  const titleText = showZh
    ? metadata.titleZh ?? metadata.titleEn ?? metadata.title
    : metadata.titleEn ?? metadata.title;

  const descriptionText = showZh
    ? metadata.descriptionZh ?? metadata.description
    : metadata.description;

  return (
    <div className={twMerge("mb-16", className)} {...properties}>
      <Heading1>{titleText}</Heading1>
      <div className="flex -mt-6 mb-8">
        <ViewCounter className="flex items-center">
          <span className="mr-3 text-sm text-slate-600 dark:text-slate-300 font-medium whitespace-nowrap">
            {showZh ? "发布日期：" : "Published:"} {metadata.date}
          </span>
          <EyeIcon className="inline w-6 h-6 mr-2 -my-2" aria-hidden="true" />
        </ViewCounter>
      </div>
      <Paragraph className="text-xl text-blue-600 dark:text-blue-300 font-medium">
        {descriptionText}
      </Paragraph>
    </div>
  );
}
