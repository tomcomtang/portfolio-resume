"use client";

import { QrCodeIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import wechatQrImage from "@/assets/we-chat.jpg";
import { useLanguage } from "@/components/useLanguage";

export function WeChatQRButton() {
  const [open, setOpen] = useState(false);
  const [language] = useLanguage();
  const copy = {
    en: {
      wechat: "WeChat",
      qr: "WeChat QR code",
      close: "Close",
      scan: "Scan to connect",
      imageAlt: "WeChat QR",
    },
    zh: {
      wechat: "微信",
      qr: "微信二维码",
      close: "关闭",
      scan: "扫码添加我",
      imageAlt: "微信二维码",
    },
  } as const;

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-slate-700 hover:text-slate-800 dark:text-slate-200 dark:hover:text-slate-100 transition"
        aria-label={copy[language].qr}
        title={copy[language].wechat}
      >
        <QrCodeIcon className="h-6 w-6" aria-hidden="true" />
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-6"
          onMouseDown={(e) => {
            // Close only when clicking the backdrop.
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div className="bg-slate-900 text-slate-100 rounded-2xl p-6 shadow-2xl max-w-[90vw]">
            <div className="flex items-center justify-between gap-4">
              <div className="font-display font-bold uppercase tracking-wide">
                {copy[language].wechat}
              </div>
              <button
                type="button"
                className="text-slate-300 hover:text-slate-100"
                onClick={() => setOpen(false)}
                aria-label={copy[language].close}
              >
                ✕
              </button>
            </div>
            <div className="mt-4 flex items-center justify-center">
              <img
                src={wechatQrImage.src}
                alt={copy[language].imageAlt}
                className="w-64 h-64 object-contain"
              />
            </div>
            <div className="mt-3 text-center text-sm text-slate-300">
              {copy[language].scan}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

