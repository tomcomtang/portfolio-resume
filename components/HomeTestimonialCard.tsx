"use client";

import { useLanguage } from "@/components/useLanguage";

function FadeText({ en, zh }: { en: string; zh: string }) {
  // Keep both nodes in DOM and just cross-fade to avoid flicker.
  // This matches the smooth language-switch behavior you already have elsewhere.
  const [language] = useLanguage();
  const showZh = language === "zh";

  return (
    <span className="relative inline-flex">
      <span
        className={[
          "transition-opacity duration-300 ease-out",
          showZh ? "opacity-0" : "opacity-100",
        ].join(" ")}
      >
        {en}
      </span>
      <span
        className={[
          "absolute inset-0 transition-opacity duration-300 ease-out",
          showZh ? "opacity-100" : "opacity-0",
        ].join(" ")}
      >
        {zh}
      </span>
    </span>
  );
}

export function HomeTestimonialCard() {
  const [language] = useLanguage();
  const showZh = language === "zh";

  const quote = {
    en: `He is a full-stack developer and front-end architect with a wide range of skills—from building reliable product systems to designing 3D scene experiences and delivering real-time collaboration. His working style is calm, proactive, and quality-driven.`,
    zh: `他是一位全栈开发工程师与前端架构师，具备广泛的能力：从搭建可靠的产品体系，到打造 3D 场景体验，并实现实时协作。他的工作风格沉稳、主动，且始终以质量为导向。`,
  } as const;

  const sig = {
    enName: "Mr. Li",
    zhName: "李先生",
    enTitle: "Head, Fifth Dept., Tencent Cloud",
    zhTitle: "腾讯云五部管理者",
  } as const;

  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between">
      <div className="flex flex-col lg:flex-row">
        <div className="relative w-20 h-16 flex-shrink-0">
          <div className="absolute -top-1 left-0 font-display font-extrabold text-9xl/none">
            &ldquo;
          </div>
        </div>
        <blockquote className="text-xl sm:text-2xl flex-grow max-w-xl font-light">
          <FadeText en={quote.en} zh={quote.zh} />
        </blockquote>
      </div>

      <div className="flex-shrink-0 md:ml-16">
        <p className="mt-12 md:mt-0 md:text-right text-4xl/tight sm:text-5xl/tight font-display font-bold tracking-wide uppercase">
          {showZh ? sig.zhName : sig.enName}
        </p>
        <p className="mt-4 md:text-right md:text-lg">
          {showZh ? sig.zhTitle : sig.enTitle}
        </p>
      </div>
    </div>
  );
}

