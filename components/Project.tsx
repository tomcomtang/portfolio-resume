"use client";

import { Heading2, Paragraph } from "@/mdx-components";
import { BentoItem } from "./BentoItem";
import { ArticleMetadata } from "@/types";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { useLanguage } from "@/components/useLanguage";

type ProjectProperties = React.ComponentProps<typeof BentoItem> & {
  project: ArticleMetadata;
};

export function Project({
  children,
  project,
  ...properties
}: ProjectProperties) {
  const [language] = useLanguage();
  const showZh = language === "zh";

  // Render both language lists and toggle with `opacity` for smooth switching.
  const highlightsZh = project.highlightsZh ?? project.highlights ?? [];
  const highlightsEn = project.highlightsEn ?? project.highlights ?? [];
  const hasHighlights = highlightsZh.length > 0 || highlightsEn.length > 0;

  const { className, ...bentoProperties } = properties;
  const descriptionZhText = project.descriptionZh ?? project.description;
  const descriptionEnText = project.description;
  const titleText = showZh
    ? project.titleZh ?? project.title
    : project.titleEn ?? project.title;

  return (
    <BentoItem
      {...bentoProperties}
      className={twMerge(className, "justify-start")}
    >
      {children}
      <Heading2 link={project.website !== undefined} className="relative">
        <Link
          href={project.website ? project.website : project.path}
          target={project.website ? "_blank" : undefined}
        >
          {titleText}
          <span className="absolute inset-0" />
        </Link>
      </Heading2>
      <Paragraph className="mb-0">
        {showZh ? descriptionZhText : descriptionEnText}
      </Paragraph>
      {hasHighlights && (
        <>
          <div className="text-xs font-medium opacity-70 mt-3 mb-0">
            <span className="relative grid">
              <span
                className={twMerge(
                  "col-start-1 row-start-1 transition-opacity duration-300 ease-out",
                  showZh ? "opacity-100" : "opacity-0"
                )}
              >
                具体详情 / 包含部分
              </span>
              <span
                className={twMerge(
                  "col-start-1 row-start-1 transition-opacity duration-300 ease-out",
                  showZh ? "opacity-0" : "opacity-100"
                )}
              >
                Details / Included parts
              </span>
            </span>
          </div>

          <div className="relative grid">
            <span
              className={twMerge(
                "col-start-1 row-start-1 transition-opacity duration-300 ease-out",
                showZh ? "opacity-100" : "opacity-0"
              )}
            >
              <ul className="mt-2 mb-0 list-none pl-0 text-sm leading-relaxed">
                {highlightsZh.map((item, idx) => (
                  <li
                    key={`zh-${idx}-${item}`}
                    className={twMerge(
                      "mt-1 rounded-lg px-2 py-1 text-left",
                      idx % 2 === 0
                        ? "text-slate-900/90 dark:text-slate-100/90 bg-black/[0.02] dark:bg-white/[0.03]"
                        : "text-slate-900/90 dark:text-slate-100/90 bg-black/[0.04] dark:bg-white/[0.06]"
                    )}
                  >
                    <span className="leading-relaxed">
                      {idx + 1}. {item}
                    </span>
                  </li>
                ))}
              </ul>
            </span>
            <span
              className={twMerge(
                "col-start-1 row-start-1 transition-opacity duration-300 ease-out",
                showZh ? "opacity-0" : "opacity-100"
              )}
            >
              <ul className="mt-2 mb-0 list-none pl-0 text-sm leading-relaxed">
                {highlightsEn.map((item, idx) => (
                  <li
                    key={`en-${idx}-${item}`}
                    className={twMerge(
                      "mt-1 rounded-lg px-2 py-1 text-left",
                      idx % 2 === 0
                        ? "text-slate-900/90 dark:text-slate-100/90 bg-black/[0.02] dark:bg-white/[0.03]"
                        : "text-slate-900/90 dark:text-slate-100/90 bg-black/[0.04] dark:bg-white/[0.06]"
                    )}
                  >
                    <span className="leading-relaxed">
                      {idx + 1}. {item}
                    </span>
                  </li>
                ))}
              </ul>
            </span>
          </div>
        </>
      )}
    </BentoItem>
  );
}
