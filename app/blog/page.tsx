import { Article } from "@/components/Article";
import { BentoGrid } from "@/components/BentoGrid";
import { loadMarkdownDirectory } from "@/utilities/markdown";
import { generateTags } from "@/utilities/metadata";
import { Metadata } from "next";
import React from "react";

function hashToIndex(input: string, modulo: number) {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return modulo === 0 ? 0 : hash % modulo;
}

export const metadata: Metadata = generateTags({
  url: "/blog",
  title: "Blog",
  description: "Articles written by software engineer Greg Ives.",
});

export default async function ArticlesPage() {
  const articles = (await loadMarkdownDirectory("/blog")).sort((a, b) => {
    const timeA = new Date(a.metadata.date).getTime();
    const timeB = new Date(b.metadata.date).getTime();

    const safeTimeA = Number.isFinite(timeA) ? timeA : 0;
    const safeTimeB = Number.isFinite(timeB) ? timeB : 0;

    // Latest -> oldest
    return safeTimeB - safeTimeA;
  });

  const cardThemes = [
    "bg-emerald-200 dark:bg-emerald-700",
    "bg-pink-200 dark:bg-pink-700",
    "bg-sky-200 dark:bg-sky-700",
    "bg-lime-200 dark:bg-lime-700",
    "bg-violet-200 dark:bg-violet-700",
    "bg-amber-200 dark:bg-amber-700",
    "bg-fuchsia-200 dark:bg-fuchsia-700",
    "bg-teal-200 dark:bg-teal-700",
  ] as const;

  return (
    <main>
      <BentoGrid>
        {articles.map((article) => (
          <Article
            key={article.metadata.path}
            metadata={article.metadata}
            className={
              cardThemes[
                hashToIndex(article.metadata.path, cardThemes.length)
              ]
            }
          />
        ))}
      </BentoGrid>
    </main>
  );
}
