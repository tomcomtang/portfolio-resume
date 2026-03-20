"use client";

import { EnvelopeIcon, PhoneIcon } from "@heroicons/react/24/outline";
import { BentoItem } from "@/components/BentoItem";
import { Heading2 } from "@/mdx-components";
import { WeChatQRButton } from "@/components/WeChatQRButton";
import Image from "next/image";
import tencentImage from "@/assets/tencent-img/tencent-avatar.png";
import { useLanguage } from "@/components/useLanguage";

function QQIcon(properties: JSX.IntrinsicElements["svg"]) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...properties}
    >
      <path d="M21.395 15.035a40 40 0 0 0-.803-2.264l-1.079-2.695c.001-.032.014-.562.014-.836C19.526 4.632 17.351 0 12 0S4.474 4.632 4.474 9.241c0 .274.013.804.014.836l-1.08 2.695a39 39 0 0 0-.802 2.264c-1.021 3.283-.69 4.643-.438 4.673.54.065 2.103-2.472 2.103-2.472 0 1.469.756 3.387 2.394 4.771-.612.188-1.363.479-1.845.835-.434.32-.379.646-.301.778.343.578 5.883.369 7.482.189 1.6.18 7.14.389 7.483-.189.078-.132.132-.458-.301-.778-.483-.356-1.233-.646-1.846-.836 1.637-1.384 2.393-3.302 2.393-4.771 0 0 1.563 2.537 2.103 2.472.251-.03.581-1.39-.438-4.673" />
    </svg>
  );
}

export function ContactsCard() {
  const [language] = useLanguage();
  const copy = {
    en: {
      title: "Let's connect",
      phone: "Phone",
      email: "Email",
    },
    zh: {
      title: "联系我",
      phone: "电话",
      email: "邮箱",
    },
  } as const;

  return (
    <BentoItem className="h-72 order-2 col-span-6 md:col-span-4 bg-fuchsia-200 dark:bg-fuchsia-900 overflow-hidden">
      {/* Top half image layer: pinned to top, fades smoothly into card color */}
      <div className="absolute inset-x-0 top-0 h-1/2 overflow-hidden">
        <Image
          src={tencentImage}
          alt="Tencent team photo"
          priority
          fill
          className="object-contain object-[87%_top] mix-blend-luminosity scale-90 blur-[0.5px]"
          sizes="(min-width: 768px) 33.3333vw, 50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent from-35% via-fuchsia-200/35 to-fuchsia-200 dark:via-fuchsia-900/45 dark:to-fuchsia-900" />
      </div>

      <div className="relative z-10">
        <Heading2 className="-skew-y-6 origin-left">{copy[language].title}</Heading2>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <a
            href="https://wpa.qq.com/msgrd?v=3&uin=364786053&site=qq&menu=yes"
            target="_blank"
            rel="noreferrer"
            className="text-slate-700 hover:text-slate-800 dark:text-slate-200 dark:hover:text-slate-100 transition"
            aria-label="QQ: 364786053"
            title="QQ: 364786053"
          >
            <QQIcon className="h-6 w-6" aria-hidden="true" />
          </a>

          <a
            href="tel:18813676461"
            className="text-slate-700 hover:text-slate-800 dark:text-slate-200 dark:hover:text-slate-100 transition"
            aria-label={`${copy[language].phone}: 18813676461`}
            title={`${copy[language].phone}: 18813676461`}
          >
            <PhoneIcon className="h-6 w-6" aria-hidden="true" />
          </a>

          <a
            href="mailto:364786053@qq.com"
            className="text-slate-700 hover:text-slate-800 dark:text-slate-200 dark:hover:text-slate-100 transition"
            aria-label={`${copy[language].email}: 364786053@qq.com`}
            title={`${copy[language].email}: 364786053@qq.com`}
          >
            <EnvelopeIcon className="h-6 w-6" aria-hidden="true" />
          </a>

          <WeChatQRButton />
        </div>
      </div>
    </BentoItem>
  );
}
