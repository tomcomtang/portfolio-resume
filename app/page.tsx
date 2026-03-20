import { BentoGrid } from "@/components/BentoGrid";
import { BentoItem } from "@/components/BentoItem";
import { loadMarkdownDirectory } from "@/utilities/markdown";
import { Heading2, Paragraph } from "@/mdx-components";
import Link from "next/link";
import { Headshots3x3 } from "@/components/Headshots3x3";
import { Article } from "@/components/Article";
import { Suspense } from "react";
import { WeatherCard } from "@/components/WeatherCard";
import { ContactsCard } from "@/components/ContactsCard";
import { MusicCard } from "@/components/MusicCard";
import { IntroBlurb } from "@/components/IntroBlurb";
import { ExperienceCard } from "@/components/ExperienceCard";
import { ProfileProjectCard } from "@/components/ProfileProjectCard";
import { HomeTestimonialCard } from "@/components/HomeTestimonialCard";

export default async function Home() {
  const [articles] = await Promise.all([loadMarkdownDirectory("/blog")]);

  const latestArticles = articles.slice(0, 3);
  return (
    <main>
      <BentoGrid>
        <BentoItem className="order-1 sm:order-2 sm:col-span-6 md:col-span-4 overflow-hidden bg-blue-200 sm:bg-blue-300 dark:bg-blue-900 max-sm:before:opacity-50">
          <div className="relative max-sm:overflow-hidden">
            <Headshots3x3 />
            <div className="sm:hidden absolute inset-0 bg-gradient-to-b from-transparent from-60% to-blue-200 sm:to-blue-300 dark:to-blue-900" />
          </div>
          <div className="mt-8 text-center sm:hidden">
            <IntroBlurb />
          </div>
        </BentoItem>
        <BentoItem className="hidden sm:flex order-2 sm:order-1 sm:col-span-6 md:col-span-8 bg-blue-100 dark:bg-blue-950 before:opacity-50">
          <div className="max-w-2xl pt-8">
            <IntroBlurb />
          </div>
        </BentoItem>
        <Suspense
          fallback={
            <>
              <BentoItem className="h-72 order-2 col-span-6 md:col-span-4 bg-gray-500 dark:bg-gray-700 before:opacity-25 dark:before:opacity-25 animate-pulse" />
              <BentoItem className="h-72 order-2 col-span-6 md:col-span-4 bg-gray-300 dark:bg-gray-600 before:opacity-25 dark:before:opacity-25 animate-pulse" />
            </>
          }
        >
          <>
            <WeatherCard />
            <ContactsCard />
          </>
        </Suspense>
        <MusicCard />
        <ExperienceCard />
        <ProfileProjectCard
          projectKey="tencent-console"
          className="order-2 sm:col-span-6 bg-pink-300 dark:bg-pink-700"
        />
        <ProfileProjectCard
          projectKey="timmerse"
          className="order-2 sm:col-span-6 bg-lime-400 dark:bg-lime-700"
        />
        <ProfileProjectCard
          projectKey="edgeone-pages"
          className="order-2 sm:col-span-6 bg-sky-300 dark:bg-sky-700"
        />
        <div className="order-2 col-span-full flex flex-wrap justify-stretch text-center -m-1">
          <BentoItem className="order-2 md:order-1 m-1 flex-1 relative items-center bg-blue-300 dark:bg-blue-500">
            <Heading2 link className="text-3xl/tight sm:text-4xl/tight">
              <Link
                href="https://x.com/TangTomcom66610"
                target="_blank"
                className="dock-hover relative block w-full"
              >
                Twitter
                <span className="absolute inset-0 pointer-events-none" />
              </Link>
            </Heading2>
          </BentoItem>
          <BentoItem className="order-3 md:order-2 m-1 flex-1 relative items-center bg-slate-300 dark:bg-slate-600">
            <Heading2 link className="text-3xl/tight sm:text-4xl/tight">
              <Link
                href="https://github.com/tomcomtang"
                target="_blank"
                className="dock-hover relative block w-full"
              >
                GitHub
                <span className="absolute inset-0 pointer-events-none" />
              </Link>
            </Heading2>
          </BentoItem>
          <BentoItem className="order-1 md:order-3 w-full md:w-auto m-1 flex-grow lg:flex-1 relative items-center bg-purple-300 dark:bg-purple-700">
            <Heading2>
              <Link
                href="/projects"
                className="dock-hover relative block w-full"
              >
                Other projects
                <span className="absolute inset-0 pointer-events-none" />
              </Link>
            </Heading2>
          </BentoItem>
        </div>
        <BentoItem
          className="order-2 sm:col-span-3 md:col-span-2 sm:row-span-3 bg-slate-800"
          inset
        >
          <Heading2
            link
            className="text-center sm:text-left sm:[writing-mode:vertical-lr] sm:rotate-180 sm:p-0 sm:text-6xl text-slate-50"
          >
              <Link href="/blog" className="dock-hover relative block w-full">
              From the blog
                <span className="absolute inset-0 pointer-events-none" />
            </Link>
          </Heading2>
        </BentoItem>
        {latestArticles.map((article) => (
          <Article
            key={article.metadata.title}
            metadata={article.metadata}
            className="order-2 sm:col-span-9 md:col-span-10 md:flex-col lg:flex-row bg-emerald-200 dark:bg-emerald-700"
          />
        ))}
        <BentoItem className="order-2 bg-sky-700 dark:bg-sky-900 text-slate-100 before:opacity-25 shadow-xl">
          <HomeTestimonialCard />
        </BentoItem>
      </BentoGrid>
    </main>
  );
}
