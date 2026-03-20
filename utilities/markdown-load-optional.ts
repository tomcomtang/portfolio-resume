import type { ArticleMetadata } from "@/types";

export async function loadMarkdownOptional<
  TPath extends string
>(path: TPath): Promise<
  | {
      Content: React.FC;
      metadata: ArticleMetadata;
    }
  | null
> {
  try {
    const mod = await import(
      // webpackInclude: /\.mdx$/
      `../markdown${path}.mdx`
    );

    const { default: Content, metadata, ...other } = mod as {
      default: React.FC;
      metadata: TPath extends `/blog/${string}` | `/projects/${string}`
        ? ArticleMetadata
        : {};
      [key: string]: unknown;
    };

    return {
      Content,
      metadata: {
        ...(metadata as ArticleMetadata),
        path,
      },
      ...(other as Record<string, unknown>),
    } as any;
  } catch {
    return null;
  }
}

