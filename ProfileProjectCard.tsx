"use client";

import { BentoItem } from "@/components/BentoItem";
import { Heading2, Paragraph } from "@/mdx-components";
import { useLanguage } from "@/components/useLanguage";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import Image from "next/image";
import trtcShowroomImage from "@/assets/tencent-img/trtc-showroom.png";
import consoleViewImage from "@/assets/tencent-img/console-view.png";
import pagesViewImage from "@/assets/tencent-img/pages-view.png";

type ProjectKey = "tencent-console" | "timmerse" | "edgeone-pages";

type ProfileProjectCardProperties = {
    className?: string;
    projectKey: ProjectKey;
};

const COPY = {
    en: {
        "tencent-console": {
            title: "Cloud Config",
            description:
                "Unified platform for Tencent Cloud teams to manage permissions, menus, account configuration, release workflows, and observability.",
            href: "https://console.cloud.tencent.com",
        },
        timmerse: {
            title: "Timmerse",
            description:
                "Web-based 3D metaverse editor for reusable space templates, avatar customization, scene editing, and real-time collaboration.",
            href: "https://trtc.io/showroom",
        },
        "edgeone-pages": {
            title: "EdgeOne Pages",
            description:
                "All-in-one hosting platform for static and full-stack apps with build, deploy, edge acceleration, and CLI-driven developer workflows.",
            href: "https://pages.edgeone.ai",
        },
    },
    zh: {
        "tencent-console": {
            title: "腾讯云控制台配置平台",
            description:
                "统一支撑腾讯云产品团队的权限、菜单、账号配置、发布流程与可观测能力的控制台平台。",
            href: "https://console.cloud.tencent.com",
        },
        timmerse: {
            title: "Timmerse",
            description:
                "面向 Web 的 3D 元宇宙空间编辑与实时协作平台，支持模板化搭建、角色编辑与场景协同。",
            href: "https://trtc.io/showroom",
        },
        "edgeone-pages": {
            title: "EdgeOne Pages",
            description:
                "静态站点与全栈应用托管平台，覆盖构建、部署、边缘加速与 CLI 开发体验的完整链路。",
            href: "https://pages.edgeone.ai",
        },
    },
} as const;

export function ProfileProjectCard({
    className,
    projectKey,
}: ProfileProjectCardProperties) {
    const [language] = useLanguage();
    const showZh = language === "zh";
    const backgroundImage =
        projectKey === "timmerse"
            ? trtcShowroomImage
            : projectKey === "tencent-console"
                ? consoleViewImage
                : projectKey === "edgeone-pages"
                    ? pagesViewImage
                    : null;
    const hasBackground = backgroundImage !== null;

    return (
        <BentoItem className={twMerge(className, hasBackground && "overflow-hidden")}>
            {hasBackground && (
                <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 overflow-hidden">
                    <Image
                        src={backgroundImage}
                        alt={projectKey === "timmerse" ? "TRTC showroom preview" : "Tencent Cloud console preview"}
                        fill
                        className="object-cover object-top mix-blend-luminosity opacity-15"
                        sizes="(min-width: 640px) 50vw, 100vw"
                    />
                    <div
                        className={twMerge(
                            "absolute inset-0 bg-gradient-to-b from-transparent from-30%",
                            projectKey === "timmerse"
                                ? "to-lime-400 dark:to-lime-700"
                                : projectKey === "tencent-console"
                                    ? "to-pink-300 dark:to-pink-700"
                                    : "to-sky-300 dark:to-sky-700"
                        )}
                    />
                </div>
            )}

            <div className="relative z-10">
                <Heading2 link className="relative">
                    <Link href={COPY.en[projectKey].href} target="_blank">
                        <span className="relative grid">
                            <span
                                className={twMerge(
                                    "col-start-1 row-start-1 transition-opacity duration-300 ease-out",
                                    showZh ? "opacity-0" : "opacity-100"
                                )}
                            >
                                {COPY.en[projectKey].title}
                            </span>
                            <span
                                className={twMerge(
                                    "col-start-1 row-start-1 transition-opacity duration-300 ease-out",
                                    showZh ? "opacity-100" : "opacity-0"
                                )}
                            >
                                {COPY.zh[projectKey].title}
                            </span>
                        </span>
                        <span className="absolute inset-0" />
                    </Link>
                </Heading2>

                <Paragraph>
                    <span className="relative grid">
                        <span
                            className={twMerge(
                                "col-start-1 row-start-1 transition-opacity duration-300 ease-out",
                                showZh ? "opacity-0" : "opacity-100"
                            )}
                        >
                            {COPY.en[projectKey].description}
                        </span>
                        <span
                            className={twMerge(
                                "col-start-1 row-start-1 transition-opacity duration-300 ease-out",
                                showZh ? "opacity-100" : "opacity-0"
                            )}
                        >
                            {COPY.zh[projectKey].description}
                        </span>
                    </span>
                </Paragraph>
            </div>
        </BentoItem>
    );
}
