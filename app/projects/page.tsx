import { BentoGrid } from "@/components/BentoGrid";
import { Project } from "@/components/Project";
import { loadMarkdownDirectory } from "@/utilities/markdown";
import { generateTags } from "@/utilities/metadata";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = generateTags({
  url: "/projects",
  title: "Projects",
  description: "Projects created by software engineer Greg Ives.",
});

export default async function ProjectsPage() {
  const projects = (await loadMarkdownDirectory("/projects")).map(
    (project) => project.metadata
  );
  const projectsByTitle = new Map(projects.map((project) => [project.title, project]));

  const fullWidthFeaturedTitles = [
    "Cloud Config",
    "Timmerse",
    "EdgeOne Pages",
    "迅雷广告传媒配置平台",
  ] as const;
  const halfWidthFeaturedTitles = [
    "Astro Cartoon Portfolio",
    "Astro MultiPage Portfolio",
  ] as const;

  const pinnedTitles = new Set([
    ...fullWidthFeaturedTitles,
    ...halfWidthFeaturedTitles,
  ]);

  return (
    <main>
      <BentoGrid>
        {projectsByTitle.get(fullWidthFeaturedTitles[0]) && (
          <Project
            project={projectsByTitle.get(fullWidthFeaturedTitles[0])!}
            className="bg-pink-300 dark:bg-pink-700"
          />
        )}
        {projectsByTitle.get(fullWidthFeaturedTitles[1]) && (
          <Project
            project={projectsByTitle.get(fullWidthFeaturedTitles[1])!}
            className="bg-lime-400 dark:bg-lime-700"
          />
        )}
        {projectsByTitle.get(fullWidthFeaturedTitles[2]) && (
          <Project
            project={projectsByTitle.get(fullWidthFeaturedTitles[2])!}
            className="bg-sky-300 dark:bg-sky-700"
          />
        )}
        {projectsByTitle.get(fullWidthFeaturedTitles[3]) && (
          <Project
            project={projectsByTitle.get(fullWidthFeaturedTitles[3])!}
            className="bg-red-300 dark:bg-red-700"
          />
        )}
        {projectsByTitle.get(halfWidthFeaturedTitles[0]) && (
          <Project
            project={projectsByTitle.get(halfWidthFeaturedTitles[0])!}
            className="sm:col-span-6 bg-indigo-300 dark:bg-indigo-700"
          />
        )}
        {projectsByTitle.get(halfWidthFeaturedTitles[1]) && (
          <Project
            project={projectsByTitle.get(halfWidthFeaturedTitles[1])!}
            className="sm:col-span-6 bg-teal-300 dark:bg-teal-700"
          />
        )}
      </BentoGrid>
    </main>
  );
}
