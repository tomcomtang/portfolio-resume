"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/components/useLanguage";
import { loadMarkdownOptional } from "@/utilities/markdown-load-optional";
import type { ArticleMetadata } from "@/types";
import { ArticleHeader } from "@/components/ArticleHeader";

type LoadedMarkdown = {
  Content: React.FC;
  metadata: ArticleMetadata;
};

function BlogArticleContentBody({
  metadata,
  language,
  Content,
}: {
  metadata: ArticleMetadata;
  language: "en" | "zh";
  Content: React.FC;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  const HIDDEN_STYLE: React.CSSProperties = {
    opacity: 0,
    transitionProperty: "all",
    transform: "translateY(1rem) skewY(1deg) scale(0.98)",
    transformOrigin: "top",
  };

  const [style, setStyle] = useState<React.CSSProperties | undefined>(
    typeof document !== "undefined" && document.documentElement.dataset.animate
      ? HIDDEN_STYLE
      : undefined
  );

  useEffect(() => {
    if (!ref.current) return;
    if (!document.documentElement.dataset.animate) return;

    // Use the element position to compute a slightly varied duration,
    // matching the project's `useFadeIn` behavior.
    const transitionDuration =
      500 +
      (ref.current.getBoundingClientRect().top / window.innerHeight) * 500 +
      (ref.current.getBoundingClientRect().left / window.innerWidth) * 500;

    setStyle((prev) => ({
      ...(prev ?? HIDDEN_STYLE),
      opacity: 1,
      transitionDuration: transitionDuration + "ms",
      transform: "none",
    }));

    const handle = window.setTimeout(() => {
      setStyle(undefined);
    }, transitionDuration);

    return () => window.clearTimeout(handle);
  }, [metadata, language, Content]);

  return (
    <div ref={ref} style={style}>
      <ArticleHeader metadata={metadata} language={language} />
      <Content />
    </div>
  );
}

export function BlogArticleContent({ slug }: { slug: string }) {
  const [language] = useLanguage();
  type Lang = "zh" | "en";

  const targetLanguage: Lang = language === "zh" ? "zh" : "en";

  const [zhLoaded, setZhLoaded] = useState<LoadedMarkdown | null>(null);
  const [enLoaded, setEnLoaded] = useState<LoadedMarkdown | null>(null);

  // What is currently displayed; keep it while we load the target language.
  const [activeLanguage, setActiveLanguage] = useState<Lang>(targetLanguage);
  const [activeLoaded, setActiveLoaded] = useState<LoadedMarkdown | null>(null);

  const [animateKey, setAnimateKey] = useState(0);

  const ensureLoaded = async (lang: Lang) => {
    if (lang === "zh" && zhLoaded) return zhLoaded;
    if (lang === "en" && enLoaded) return enLoaded;

    const zhPath = `/blog/${slug}`;
    const enPath = `/blog/${slug}-en`;

    const primary =
      lang === "zh"
        ? await loadMarkdownOptional(zhPath as any)
        : await loadMarkdownOptional(enPath as any);

    // Fallback: if `*-en.mdx` doesn't exist, use the original `slug.mdx`.
    const fallback =
      lang === "en" ? await loadMarkdownOptional(zhPath as any) : null;

    const finalResult = (primary ?? fallback) as LoadedMarkdown | null;
    if (!finalResult) return null;

    if (lang === "zh") setZhLoaded(finalResult);
    if (lang === "en") setEnLoaded(finalResult);

    return finalResult;
  };

  // Load the target language, but don't blank the page while waiting.
  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      const loaded = await ensureLoaded(targetLanguage);
      if (cancelled || !loaded) return;

      setActiveLoaded(loaded);
      setActiveLanguage(targetLanguage);
      setAnimateKey((k) => k + 1);
    };

    void run();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetLanguage, slug]);

  if (!activeLoaded) return null;

  return (
    <div key={`${activeLanguage}-${animateKey}`}>
      <BlogArticleContentBody
        metadata={activeLoaded.metadata}
        language={activeLanguage}
        Content={activeLoaded.Content}
      />
    </div>
  );
}

