"use client";

import { twMerge } from "tailwind-merge";
import { Container } from "./Container";
import Link from "next/link";
import { MoonIcon, SunIcon } from "@heroicons/react/24/solid";
import { useCallback, useEffect, useState } from "react";
import { useLanguage } from "@/components/useLanguage";

type HeaderProperties = JSX.IntrinsicElements["header"];

function FadeText({
  en,
  zh,
  language,
  className,
}: {
  en: string;
  zh: string;
  language: "en" | "zh";
  className?: string;
}) {
  const showZh = language === "zh";
  return (
    <span className={twMerge("relative inline-grid align-middle", className)}>
      <span className="invisible col-start-1 row-start-1" aria-hidden="true">
        {en}
      </span>
      <span className="invisible col-start-1 row-start-1" aria-hidden="true">
        {zh}
      </span>
      <span
        className={twMerge(
          "col-start-1 row-start-1 transition-opacity duration-300 ease-out",
          showZh ? "opacity-0" : "opacity-100"
        )}
      >
        {en}
      </span>
      <span
        className={twMerge(
          "col-start-1 row-start-1 transition-opacity duration-300 ease-out",
          showZh ? "opacity-100" : "opacity-0"
        )}
      >
        {zh}
      </span>
    </span>
  );
}

function HeaderLink({
  className,
  ...properties
}: React.ComponentProps<typeof Link>) {
  return (
    <Link
      className={twMerge(
        "-my-1 py-1 px-2 inline-flex items-center text-sm font-medium",
        className
      )}
      {...properties}
    />
  );
}

function HeaderButton({
  className,
  ...properties
}: JSX.IntrinsicElements["button"]) {
  return (
    <button
      className={twMerge(
        "-my-1 py-1 px-2 inline-flex items-center text-sm font-medium",
        className
      )}
      {...properties}
    />
  );
}

type Theme = "light" | "dark";

function useTheme() {
  const [theme, setTheme] = useState<Theme>();

  const setThemeWrapper = (theme: Theme) => {
    if (theme === "dark") {
      document.documentElement.dataset.theme = "dark";
    } else {
      delete document.documentElement.dataset.theme;
    }

    setTheme(theme);
  };

  useEffect(() => {
    const initialTheme =
      typeof localStorage === "undefined"
        ? "light"
        : (localStorage.getItem("theme") as Theme) ?? "light";

    setThemeWrapper(initialTheme);
  }, []);

  useEffect(() => {
    if (theme !== undefined) {
      localStorage.setItem("theme", theme);
    }
  }, [theme]);

  return [theme, setThemeWrapper] as const;
}

export function Header({ className, ...properties }: HeaderProperties) {
  const [theme, setTheme] = useTheme();
  const [language, setLanguage] = useLanguage();
  const [switching, setSwitching] = useState(false);
  const copy = {
    en: {
      home: "Home",
      blog: "Blog",
      projects: "Projects",
      lang: "Lang",
      theme: "Theme",
    },
    zh: {
      home: "首页",
      blog: "博客",
      projects: "项目",
      lang: "语言",
      theme: "主题",
    },
  } as const;

  const toggleTheme = useCallback(() => {
    setSwitching(true);
    setTimeout(() => {
      setTheme(theme === "dark" ? "light" : "dark");
      setTimeout(() => {
        setSwitching(false);
      }, 100);
    }, 100);
  }, [setTheme, theme]);

  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "zh" : "en");
  };

  return (
    <header
      className={twMerge("relative", className)}
      onFocus={scrollToTop}
      {...properties}
    >
      <Container className="relative bg-radial-gradient-b from-slate-800 to-transparent py-8 px-6 sm:px-8 md:px-10 lg:px-12 flex overflow-x-auto hide-scrollbar justify-between">
        <div className="flex space-x-2 mr-2 sm:space-x-6 sm:mr-6 -ml-2">
          <HeaderLink href="/">
            <FadeText en={copy.en.home} zh={copy.zh.home} language={language} />
          </HeaderLink>
          <HeaderLink href="/blog">
            <FadeText en={copy.en.blog} zh={copy.zh.blog} language={language} />
          </HeaderLink>
          <HeaderLink href="/projects">
            <FadeText
              en={copy.en.projects}
              zh={copy.zh.projects}
              language={language}
            />
          </HeaderLink>
        </div>
        <div className="flex space-x-2 sm:space-x-6 -mr-2">
          <HeaderButton onClick={toggleLanguage}>
            <FadeText
              en={copy.en.lang}
              zh={copy.zh.lang}
              language={language}
              className="mr-2"
            />
            <span
              aria-live="polite"
              className="relative inline-flex h-5 w-9 overflow-hidden align-middle"
            >
              <span
                className={twMerge(
                  "absolute left-0 top-0 flex w-full flex-col text-left transition-transform duration-300 ease-in-out",
                  language === "en" ? "translate-y-0" : "-translate-y-1/2"
                )}
              >
                <span className="h-5 leading-5">EN</span>
                <span className="h-5 leading-5">中文</span>
              </span>
            </span>
          </HeaderButton>
          <HeaderButton onClick={toggleTheme}>
            <FadeText
              en={copy.en.theme}
              zh={copy.zh.theme}
              language={language}
              className="mr-2"
            />
            <MoonIcon
              className={twMerge(
                "hidden dark:inline w-4 h-4 transition-transform origin-bottom",
                switching && "rotate-90 scale-0"
              )}
              aria-hidden="true"
            />
            <SunIcon
              className={twMerge(
                "inline dark:hidden w-4 h-4 scale-125 transition-transform",
                switching && "-rotate-90 scale-0"
              )}
              aria-hidden="true"
            />
          </HeaderButton>
        </div>
      </Container>
      <div className="absolute pointer-events-none top-0 left-0 h-full w-6 sm:w-8 md:w-10 lg:w-12 bg-gradient-to-r from-slate-950 to-transparent" />
      <div className="absolute pointer-events-none top-0 right-0 h-full w-6 sm:w-8 md:w-10 lg:w-12 bg-gradient-to-l from-slate-950 to-transparent" />
    </header>
  );
}
