"use client";

import { Heading2, Paragraph } from "@/mdx-components";
import Link from "next/link";
import { BentoItem } from "./BentoItem";
import { ArticleMetadata } from "@/types";
import { twMerge } from "tailwind-merge";
import { ViewCounter } from "./ViewCounter";
import { EyeIcon } from "@heroicons/react/24/outline";
import { useLanguage } from "@/components/useLanguage";

type ArticleProperties = React.ComponentProps<typeof BentoItem> & {
  metadata: ArticleMetadata & {
    path: string;
  };
};

export function Article({
  metadata,
  className,
  ...properties
}: ArticleProperties) {
  const [language] = useLanguage();
  const showZh = language === "zh";

  const titleText = showZh
    ? metadata.titleZh ?? metadata.titleEn ?? metadata.title
    : metadata.titleEn ?? metadata.title;
  const descriptionText = showZh
    ? metadata.descriptionZh ?? metadata.description
    : metadata.description;

  return (
    <BentoItem
      className={twMerge("md:flex-row flex-wrap justify-between", className)}
      {...properties}
    >
      <Heading2 className="flex-grow relative mb-4 z-20">
        <Link href={metadata.path}>
          {titleText}
          <span className="absolute inset-0" />
        </Link>
      </Heading2>
      <ViewCounter
        path={metadata.path}
        className="self-start flex items-center mb-2"
      >
        <span className="mr-3 text-sm text-slate-600 dark:text-slate-300 font-medium whitespace-nowrap">
          {showZh ? "发布日期：" : "Published:"} {metadata.date}
        </span>
        <EyeIcon className="inline w-6 h-6 mr-2 -my-2" aria-hidden="true" />
      </ViewCounter>
      <Paragraph className="w-full flex-shrink-0 mt-4">
        {descriptionText}
      </Paragraph>
    </BentoItem>
  );
}
