"use client";

import { BentoItem } from "@/components/BentoItem";
import { Heading2 } from "@/mdx-components";
import { TencentMylesCarousel } from "@/components/TencentMylesCarousel";
import { useLanguage } from "@/components/useLanguage";
import { twMerge } from "tailwind-merge";

type CompanyLogo = "xunlei" | "tencent";

const COPY = {
  en: {
    title: "Git Commit Timeline",
    summary: "Every stage of life as a commit, branch, or deployment.",
    points: [
      {
        meta: "2007.09  git init",
        message:
          "Central South University of Forestry and Technology, majoring in Computer Science and Technology.",
      },
      {
        meta: "2011.07  npm run build",
        message:
          "v1.0.0 released at graduation, moving from tutorial mode to production mode.",
      },
      {
        meta: "2011.07-2014  git clone",
        logo: "xunlei" as CompanyLogo,
        message: "Joined Xunlei in the Advertising Media Department.",
      },
      {
        meta: "2015-2026  git checkout -b feature/new-life",
        logo: "tencent" as CompanyLogo,
        message: "Joined Tencent in CSIG Cloud Product Department.",
      },
    ],
  },
  zh: {
    title: "Git Commit 历史流",
    summary: "把人生每个阶段，当成一次提交、分支或部署。",
    points: [
      {
        meta: "2007.09  git init",
        message: "中南林业科技大学，计算机科学与技术专业。",
      },
      {
        meta: "2011.07  npm run build",
        message: "v1.0.0 正式版打包完成（毕业），从新手模式进入生产环境。",
      },
      {
        meta: "2011.07-2014  git clone",
        logo: "xunlei" as CompanyLogo,
        message: "加入迅雷，所在部门为广告传媒部。",
      },
      {
        meta: "2015-2026  git checkout -b feature/new-life",
        logo: "tencent" as CompanyLogo,
        message: "加入腾讯，所在部门为 CSIG 云产品部。",
      },
    ],
  },
} as const;

function CompanyLogoMark({ logo }: { logo?: CompanyLogo }) {
  const src = logo === "xunlei" ? "/logos/xunlei.ico" : logo === "tencent" ? "/logos/tencent.ico" : null;
  if (!src) return null;

  const alt = logo === "xunlei" ? "Xunlei logo" : "Tencent logo";
  return (
    <img
      src={src}
      alt={alt}
      className="h-5 w-auto object-contain"
      loading="lazy"
    />
  );
}

function getLogo(point: { meta: string; message: string } | { meta: string; message: string; logo: CompanyLogo }) {
  return "logo" in point ? point.logo : undefined;
}

export function ExperienceCard() {
  const [language] = useLanguage();
  const showZh = language === "zh";

  return (
    <BentoItem className="order-2 relative sm:col-span-6 sm:row-span-3 bg-gradient-to-b from-yellow-800 to-20% to-orange-300 dark:to-amber-700 overflow-hidden">
      <TencentMylesCarousel />
      <div className="h-52 sm:h-[48%] sm:min-h-44 mb-8" />

      <div className="relative grid">
        <Heading2 className="col-start-1 row-start-1">
          <span
            className={twMerge(
              "transition-opacity duration-300 ease-out",
              showZh ? "opacity-0" : "opacity-100"
            )}
          >
            {COPY.en.title}
          </span>
          <span
            className={twMerge(
              "absolute inset-0 transition-opacity duration-300 ease-out",
              showZh ? "opacity-100" : "opacity-0"
            )}
          >
            {COPY.zh.title}
          </span>
        </Heading2>
      </div>

      <div className="relative mt-8 grid text-sm sm:text-base leading-6">
        <div
          className={twMerge(
            "col-start-1 row-start-1 transition-opacity duration-300 ease-out space-y-3",
            showZh ? "opacity-0" : "opacity-100"
          )}
        >
          <p>{COPY.en.summary}</p>
          <ul className="list-none ml-0 space-y-3">
            {COPY.en.points.map((point) => (
              <li
                key={point.meta}
                className="relative pl-4 border-l border-black/20 dark:border-white/20"
              >
                <span className="absolute -left-[5px] top-2 h-2 w-2 rounded-full bg-black/55 dark:bg-white/60" />
                <div className="font-mono text-[0.82rem] sm:text-xs tracking-tight text-black/80 dark:text-white/85">
                  {point.meta}
                </div>
                <div className="mt-0.5 flex items-center gap-2">
                  <CompanyLogoMark logo={getLogo(point)} />
                  <span className="text-[0.95em] text-black/90 dark:text-white/90">
                    {point.message}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div
          className={twMerge(
            "col-start-1 row-start-1 transition-opacity duration-300 ease-out space-y-3",
            showZh ? "opacity-100" : "opacity-0"
          )}
        >
          <p>{COPY.zh.summary}</p>
          <ul className="list-none ml-0 space-y-3">
            {COPY.zh.points.map((point) => (
              <li
                key={point.meta}
                className="relative pl-4 border-l border-black/20 dark:border-white/20"
              >
                <span className="absolute -left-[5px] top-2 h-2 w-2 rounded-full bg-black/55 dark:bg-white/60" />
                <div className="font-mono text-[0.82rem] sm:text-xs tracking-tight text-black/80 dark:text-white/85">
                  {point.meta}
                </div>
                <div className="mt-0.5 flex items-center gap-2">
                  <CompanyLogoMark logo={getLogo(point)} />
                  <span className="text-[0.95em] text-black/90 dark:text-white/90">
                    {point.message}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </BentoItem>
  );
}
