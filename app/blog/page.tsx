import { Article } from "@/components/Article";
import { BentoGrid } from "@/components/BentoGrid";
import { loadMarkdownDirectory } from "@/utilities/markdown";
import { generateTags } from "@/utilities/metadata";
import { Metadata } from "next";
import React from "react";

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

  return (
    <main>
      <BentoGrid>
        {articles.map((article) => (
          <Article key={article.metadata.path} metadata={article.metadata} />
        ))}
      </BentoGrid>
    </main>
  );
}
