export type ArticleMetadata = {
  title: string;
  titleZh?: string;
  titleEn?: string;
  description: string;
  descriptionZh?: string;
  /**
   * Optional "heat"/priority label for blog/project cards.
   * Used for bilingual UI, depending on `useLanguage()` showZh flag.
   */
  heatZh?: string;
  heatEn?: string;
  /**
   * Extra highlights rendered under `description` on the Projects list.
   * Used for "具体详情/包含部分" style content.
   */
  highlightsZh?: string[];
  highlightsEn?: string[];
  // Backwards compatible fallback (if you still have older `highlights` entries)
  highlights?: string[];
  date: string;
  website?: string;
  path: string;
};

export type Page = {
  views: number;
};
