import { BentoGrid } from "@/components/BentoGrid";
import { BentoItem } from "@/components/BentoItem";
import { loadMarkdown, loadMarkdownDirectory } from "@/utilities/markdown";
import { Heading2, Paragraph } from "@/mdx-components";
import Link from "next/link";
import { Headshots3x3 } from "@/components/Headshots3x3";
import { Article } from "@/components/Article";
import { Suspense } from "react";
import Image from "next/image";
import { Project } from "@/components/Project";
import { Badge } from "@/components/Badge";
import { WeatherCard } from "@/components/WeatherCard";
import { ContactsCard } from "@/components/ContactsCard";
import { MusicCard } from "@/components/MusicCard";
import tencent2020Image from "@/assets/tencent-img/tencent-2020.png";
import tencent2022Image from "@/assets/tencent-img/tencent-2022.jpg";
import tencent2025Image from "@/assets/tencent-img/tencent-2025.png";
import tencent25Image from "@/assets/tencent-img/tencent-25.png";
import tencent26Image from "@/assets/tencent-img/tencent-26.png";
import tencentAvatarImage from "@/assets/tencent-img/tencent-avatar.jpg";
import tencentHeyingImage from "@/assets/tencent-img/tencent-heying.png";
import tuanjian2Image from "@/assets/tencent-img/tuanjian-2.png";
import xinnianWanhui2Image from "@/assets/tencent-img/xinnianwanhui-2.png";

export default async function Home() {
  const [
    { Content },
    { metadata: mylesWellbeing },
    { metadata: whatWouldYouLookLike },
    { metadata: jotboard },
    { metadata: emojiFamily },
    articles,
  ] = await Promise.all([
    loadMarkdown("/index"),
    loadMarkdown("/projects/myles-wellbeing"),
    loadMarkdown("/projects/what-would-you-look-like"),
    loadMarkdown("/projects/jotboard"),
    loadMarkdown("/projects/emoji-family"),
    loadMarkdownDirectory("/blog"),
  ]);

  const latestArticles = articles.slice(0, 3);
  const tencentMylesBackgrounds = [
    tencentAvatarImage,
    tencent26Image,
    tencent25Image,
    tencent2025Image,
    tencent2020Image,
    tencent2022Image,
    tencentHeyingImage,
    tuanjian2Image,
    xinnianWanhui2Image,
  ];
  const tencentBackgroundIndex = new Date().getDate() % tencentMylesBackgrounds.length;
  const mylesBackgroundImage = tencentMylesBackgrounds[tencentBackgroundIndex];

  return (
    <main>
      <BentoGrid>
        <BentoItem className="order-1 sm:order-2 sm:col-span-6 md:col-span-4 overflow-hidden bg-blue-200 sm:bg-blue-300 dark:bg-blue-900 max-sm:before:opacity-50">
          <div className="relative max-sm:overflow-hidden">
            <Headshots3x3 />
            <div className="sm:hidden absolute inset-0 bg-gradient-to-b from-transparent from-60% to-blue-200 sm:to-blue-300 dark:to-blue-900" />
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Content />
          </div>
        </BentoItem>
        <BentoItem className="hidden sm:flex order-2 sm:order-1 sm:col-span-6 md:col-span-8 bg-blue-100 dark:bg-blue-950 before:opacity-50">
          <div className="max-w-2xl pt-8">
            <Content />
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
        <Project
          project={mylesWellbeing}
          className="order-2 relative sm:col-span-6 sm:row-span-3 bg-gradient-to-b from-yellow-800 to-20% to-orange-300 dark:to-amber-700 overflow-hidden"
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-52 sm:h-[48%] sm:min-h-44 overflow-hidden">
            {/* Blurred backing layer keeps visual continuity for all aspect ratios. */}
            <Image
              src={mylesBackgroundImage}
              alt=""
              aria-hidden="true"
              fill
              className="object-cover object-top -translate-y-1 scale-110 blur-xl opacity-65"
              sizes="(min-width: 640px) 50vw, 100vw"
            />
            <Image
              src={mylesBackgroundImage}
              alt="Tencent team photo background"
              priority
              fill
              className="object-cover object-top -translate-y-1 mix-blend-luminosity"
              sizes="(min-width: 640px) 50vw, 100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent from-18% via-orange-300/28 via-58% to-orange-300 dark:via-amber-700/38 dark:to-amber-700" />
            <div className="absolute inset-x-0 bottom-0 h-24 sm:h-28 bg-gradient-to-b from-transparent via-orange-300/70 to-orange-300 blur-[2px] dark:via-amber-700/75 dark:to-amber-700" />
          </div>
          <div className="h-52 sm:h-[48%] sm:min-h-44 mb-8" />
          <Badge>Acquired!</Badge>
        </Project>
        <Project
          project={whatWouldYouLookLike}
          className="order-2 sm:col-span-6 bg-pink-300 dark:bg-pink-700"
        />
        <Project
          project={jotboard}
          className="order-2 sm:col-span-6 bg-lime-400 dark:bg-lime-700"
        />
        <Project
          project={emojiFamily}
          className="order-2 sm:col-span-6 bg-sky-300 dark:bg-sky-700"
        />
        <div className="order-2 col-span-full flex flex-wrap justify-stretch text-center -m-1">
          <BentoItem className="order-2 md:order-1 m-1 flex-1 relative items-center bg-blue-300 dark:bg-blue-500">
            <Heading2 link className="text-3xl/tight sm:text-4xl/tight">
              <Link href="https://twitter.com/gregiv_es" target="_blank">
                Twitter
                <span className="absolute inset-0" />
              </Link>
            </Heading2>
          </BentoItem>
          <BentoItem className="order-3 md:order-2 m-1 flex-1 relative items-center bg-slate-300 dark:bg-slate-600">
            <Heading2 link className="text-3xl/tight sm:text-4xl/tight">
              <Link href="https://github.com/gregives" target="_blank">
                GitHub
                <span className="absolute inset-0" />
              </Link>
            </Heading2>
          </BentoItem>
          <BentoItem className="order-1 md:order-3 w-full md:w-auto m-1 flex-grow lg:flex-1 relative items-center bg-purple-300 dark:bg-purple-700">
            <Heading2>
              <Link href="/projects">
                Other projects
                <span className="absolute inset-0" />
              </Link>
            </Heading2>
          </BentoItem>
        </div>
        <BentoItem
          className="order-2 sm:col-span-3 md:col-span-2 sm:row-span-3 bg-slate-800"
          inset
        >
          <Heading2 className="text-center sm:text-left sm:[writing-mode:vertical-lr] sm:rotate-180 sm:p-0 sm:text-6xl text-slate-50">
            From the blog
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
          <div className="flex flex-col md:flex-row md:items-end justify-between">
            <div className="flex flex-col lg:flex-row">
              <div className="relative w-20 h-16 flex-shrink-0">
                <div className="absolute -top-1 left-0 font-display font-extrabold text-9xl/none">
                  &ldquo;
                </div>
              </div>
              <blockquote className="text-xl sm:text-2xl flex-grow max-w-xl font-light">
                Greg is a rare breed of developer that can work across the full
                stack and is a genuine joy to work with. We&rsquo;re lucky to
                have him leading our development at Myles.
              </blockquote>
            </div>
            <div className="flex-shrink-0 md:ml-16">
              <p className="mt-12 md:mt-0 md:text-right text-4xl/tight sm:text-5xl/tight font-display font-bold tracking-wide uppercase">
                Toby Cannon
              </p>
              <p className="mt-4 md:text-right md:text-lg">
                CEO, Myles Wellbeing
              </p>
            </div>
          </div>
        </BentoItem>
      </BentoGrid>
    </main>
  );
}
