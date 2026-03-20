import type { ArticleMetadata } from "@/types";
import { notFound } from "next/navigation";

export async function loadMarkdown<TPath extends string>(path: TPath) {
  try {
    const {
      default: Content,
      metadata,
      ...other
    }: {
      default: React.FC;
      metadata: TPath extends `/blog/${string}` | `/projects/${string}`
        ? ArticleMetadata
        : {};
    } = await import(
      // webpackInclude: /\.mdx$/
      `../markdown${path}.mdx`
    );

    return {
      Content,
      metadata: {
        ...metadata,
        path,
      },
      ...other,
    };
  } catch {
    notFound();
  }
}

