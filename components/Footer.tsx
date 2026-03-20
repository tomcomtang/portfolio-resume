"use client";

import { Container } from "./Container";
import { EnvelopeIcon } from "@heroicons/react/24/solid";
import { Heading2, Paragraph } from "@/mdx-components";
import { Button } from "./Button";
import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLanguage } from "@/components/useLanguage";

const navigation = [
  {
    name: "Email",
    href: "mailto:364786053@qq.com",
    icon: EnvelopeIcon,
  },
  {
    name: "Twitter",
    href: "https://x.com/TangTomcom66610",
    icon: (properties: JSX.IntrinsicElements["svg"]) => (
      <svg fill="currentColor" viewBox="0 0 24 24" {...properties}>
        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
      </svg>
    ),
  },
  {
    name: "GitHub",
    href: "https://github.com/tomcomtang",
    icon: (properties: JSX.IntrinsicElements["svg"]) => (
      <svg fill="currentColor" viewBox="0 0 24 24" {...properties}>
        <path
          fillRule="evenodd"
          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
];

type FooterProperties = JSX.IntrinsicElements["footer"];

export function Footer(properties: FooterProperties) {
  const [language] = useLanguage();
  const showZh = language === "zh";

  const copy = {
    en: {
      heading: "Hiring & Collaboration",
      paragraph:
        "If you’d like to hire me, share your email below and I’ll follow up. You’ll also get occasional updates on new blog posts and selected projects.",
      formEmailAria: "Your email",
      formMessageAria: "Your message",
      emailPlaceholder: "Email address",
      messagePlaceholder: "Your message",
      submit: "Submit",
      errors: {
        emailRequired: "Please enter your email address.",
        emailInvalid: "Please enter a valid email address.",
        messageRequired: "Please leave a message.",
        submitFailed: "Submit failed. Please try again.",
      },
      success: "Submitted successfully. I’ll contact you via email.",
      closeTipsError: "Submit failed. Please try again.",
    },
    zh: {
      heading: "招聘与合作",
      paragraph:
        "如果你想雇佣我，请在下方填写你的邮箱，我会尽快回复你。你也会收到关于新博客文章以及精选项目的少量更新。",
      formEmailAria: "你的邮箱",
      formMessageAria: "你的留言",
      emailPlaceholder: "邮箱地址",
      messagePlaceholder: "你的留言",
      submit: "提交",
      errors: {
        emailRequired: "请输入你的邮箱地址。",
        emailInvalid: "请输入有效的邮箱地址。",
        messageRequired: "请填写留言内容。",
        submitFailed: "提交失败，请重试。",
      },
      success: "提交成功，我将通过邮箱联系你。",
      closeTipsError: "提交失败，请重试。",
    },
  } as const;

  const t = showZh ? copy.zh : copy.en;

  const scrollToBottom = () => {
    document.documentElement.scrollTo(0, document.documentElement.scrollHeight);
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tip, setTip] = useState<{
    kind: "idle" | "success" | "error";
    visible: boolean;
    message: string;
  }>({ kind: "idle", visible: false, message: "" });

  const fadeTimerRef = useRef<number | null>(null);
  const hideTimerRef = useRef<number | null>(null);

  const showTip = (kind: "success" | "error", message: string) => {
    if (fadeTimerRef.current) window.clearTimeout(fadeTimerRef.current);
    if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current);

    setTip({ kind, visible: true, message });

    fadeTimerRef.current = window.setTimeout(() => {
      setTip((prev) =>
        prev.kind === "idle" ? prev : { ...prev, visible: false }
      );
    }, 3800);

    hideTimerRef.current = window.setTimeout(() => {
      setTip({ kind: "idle", visible: false, message: "" });
    }, 4600);
  };

  return (
    <>
      <footer onFocus={scrollToBottom} {...properties}>
        <Container className="pb-8 px-6 sm:px-8 md:px-10 lg:px-12">
          <div className="py-16 sm:py-24 text-center flex flex-col items-center bg-radial-gradient-t from-sky-900 to-transparent">
            <Heading2 className="text-4xl/tight sm:text-5xl/tight tracking-wide">
              {showZh ? (
                <span className="inline-block">{t.heading}</span>
              ) : (
                <>
                  <span className="hidden sm:inline-block md:skew-y-6 origin-right">
                    Hiring
                  </span>{" "}
                  & Collaboration
                </>
              )}
            </Heading2>
            <Paragraph className="max-w-xl">
              {t.paragraph}
            </Paragraph>
          <form
            action="/api/notion/subscribe"
            onSubmit={async (e) => {
              e.preventDefault();
              setIsSubmitting(true);

              const formData = new FormData(e.currentTarget);
              // Unique id for this submission (also stored into Notion).
              const requestId =
                typeof crypto !== "undefined" && crypto.randomUUID
                  ? crypto.randomUUID()
                  : String(Date.now()) + "-" + String(Math.random());
              formData.set("id", requestId);

              const email = formData.get("email_address")?.toString().trim();
              if (!email) {
                  showTip("error", t.errors.emailRequired);
                setIsSubmitting(false);
                return;
              }

              if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                  showTip("error", t.errors.emailInvalid);
                setIsSubmitting(false);
                return;
              }

              const message = formData.get("message")?.toString().trim();
              if (!message) {
                  showTip("error", t.errors.messageRequired);
                setIsSubmitting(false);
                return;
              }

              try {
                const res = await fetch("/api/notion/subscribe", {
                  method: "POST",
                  body: formData,
                });

                const json = (await res.json().catch(() => null)) as
                  | { ok?: boolean; error?: string }
                  | null;

                if (res.ok && json?.ok) {
                  showTip(
                    "success",
                    t.success
                  );
                  // Clear form on success.
                  e.currentTarget.reset();
                } else {
                  showTip(
                    "error",
                    json?.error ?? t.errors.submitFailed
                  );
                }
              } catch {
                showTip("error", t.closeTipsError);
              } finally {
                setIsSubmitting(false);
              }
            }}
            className="mt-8 w-full max-w-xl border border-white/10 bg-slate-900/30 relative overflow-hidden rounded-[1.5rem] px-5 py-7 sm:px-10 sm:py-10 flex flex-col space-y-3"
            method="POST"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(220%_62%_at_0%_55%,_#0A4F75_0%,_#072C3D_60%,_rgba(8,56,79,0.25)_100%)] footer-glow-pulse"
            />
            <label className="relative z-10 block">
              <span className="sr-only">{t.formEmailAria}</span>
              <input
                type="email"
                name="email_address"
                placeholder={t.emailPlaceholder}
                className="text-lg leading-[1.2] border border-white/15 rounded-2xl w-full transition-colors px-5 py-3 sm:py-3.5 placeholder:opacity-60 hover:border-white focus:border-white focus:outline-none pr-[110px] bg-transparent text-white"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className={[
                  "absolute right-2 top-2 bottom-2 cursor-pointer text-sm leading-none rounded-full px-4 font-medium",
                  "bg-slate-800/70 hover:bg-slate-700/70 active:bg-slate-700/60",
                  "dock-hover",
                  "border border-white/10",
                  "text-slate-100",
                  "disabled:opacity-70 disabled:cursor-default",
                ].join(" ")}
              >
                {isSubmitting ? (
                  <svg
                    className="h-4 w-4 animate-spin mx-auto"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-90"
                      d="M22 12c0-5.523-4.477-10-10-10"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                  </svg>
                ) : (
                  t.submit
                )}
              </button>
            </label>

            <textarea
              aria-label={t.formMessageAria}
              name="message"
              placeholder={t.messagePlaceholder}
              maxLength={2000}
              className="relative z-10 w-full appearance-none bg-transparent text-white rounded-2xl px-5 py-3 border border-white/15 placeholder:text-slate-400 focus:outline-none focus:ring-0 focus:border-white min-h-[96px] resize-y"
            />
          </form>
          </div>
          <div className="flex flex-wrap items-center justify-between space-y-8 sm:space-y-0">
            <div className="w-full sm:w-auto flex space-x-6 sm:order-3">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="footer-dock group text-slate-400 hover:text-slate-500 transition-colors duration-200"
                >
                  <span className="sr-only">{item.name}</span>
                <item.icon
                  className="footer-dock-icon h-6 w-6 transform-gpu will-change-transform"
                  aria-hidden="true"
                />
                </a>
              ))}
            </div>
            <p className="text-slate-500 sm:order-1">
              &copy; {new Date().getFullYear()} Childtom
            </p>
          </div>
        </Container>
      </footer>

      {tip.kind !== "idle" &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            role="status"
            aria-live="polite"
            className={[
              "fixed bottom-5 left-1/2 -translate-x-1/2 z-[9999] pointer-events-none px-4 py-3 rounded-xl border shadow-2xl backdrop-blur supports-[backdrop-filter]:bg-opacity-20",
              tip.kind === "success"
                ? "bg-gradient-to-r from-emerald-500/95 to-emerald-700/95 border-emerald-200/70 text-white font-semibold"
                : "bg-gradient-to-r from-rose-500/95 to-rose-700/95 border-rose-200/70 text-white font-semibold",
              "transition-opacity duration-500",
              tip.visible ? "opacity-100" : "opacity-0",
            ].join(" ")}
          >
          {tip.message}
          </div>,
          document.body
        )}
    </>
  );
}
