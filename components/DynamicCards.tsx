import { getRecentlyPlayed } from "@/utilities/spotify";
import { BentoItem } from "@/components/BentoItem";
import { Heading2, Paragraph } from "@/mdx-components";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import Image from "next/image";
import { WeatherCard } from "@/components/WeatherCard";
import { MiniAudioPlayer } from "@/components/MiniAudioPlayer";

export async function DynamicCards() {
  const recentlyPlayedSong = await getRecentlyPlayed();
  const isSpotifyPlaceholder =
    recentlyPlayedSong.artist === "" && recentlyPlayedSong.album === "";

  return (
    <>
      <BentoItem className="h-72 order-2 col-span-6 md:col-span-4 bg-slate-800">
        <div className="absolute inset-0 rounded-3xl overflow-hidden">
          <Image
            alt=""
            priority
            unoptimized
            sizes="(min-width: 768px) 33.3333vw, 50vw"
            src={recentlyPlayedSong.albumImage.url}
            height={recentlyPlayedSong.albumImage.height}
            width={recentlyPlayedSong.albumImage.width}
            className="w-full h-full object-cover blur-2xl scale-125 saturate-200 brightness-125 dark:brightness-110"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/80" />
        </div>
        <div className="z-10 flex flex-col justify-end text-white">
          <Heading2
            className={twMerge(
              "font-bold tracking-wide text-3xl/tight md:text-4xl/tight"
            )}
          >
            {isSpotifyPlaceholder ? (
              <span className="line-clamp-2">{recentlyPlayedSong.name}</span>
            ) : (
              <Link
                href={recentlyPlayedSong.url}
                target="_blank"
                className="line-clamp-2"
              >
                {recentlyPlayedSong.name}
                <span className="absolute inset-0" />
              </Link>
            )}
          </Heading2>

          <div className="mb-6 last:mb-0">
            <MiniAudioPlayer
              src="/audio/i-believe.mp3"
              title="Play local track"
              compact
            />
          </div>

          {!isSpotifyPlaceholder && recentlyPlayedSong.artist && (
            <Paragraph className="leading-7 line-clamp-2">
              {recentlyPlayedSong.artist}
            </Paragraph>
          )}
        </div>
      </BentoItem>
      <WeatherCard />
    </>
  );
}
