import { twMerge } from "tailwind-merge";

type BadgeTone = "yellow" | "red";

type BadgeProperties = JSX.IntrinsicElements["div"] & {
  tone?: BadgeTone;
};

export function Badge({
  className,
  children,
  tone = "yellow",
  ...properties
}: BadgeProperties) {
  const isRed = tone === "red";

  return (
    <div
      className={twMerge(
        "absolute inset-0 overflow-hidden pointer-events-none flex justify-end items-start",
        className
      )}
      {...properties}
    >
      <div
        className={twMerge(
          "origin-top-left rotate-[30deg] p-1 md:p-2 before:absolute before:inset-0 before:-z-10 before:shadow",
          isRed
            ? "before:bg-red-200 dark:before:bg-red-900 before:-mx-12 p-1 md:p-1.5"
            : "before:bg-yellow-200 dark:before:bg-slate-900 before:-mx-64"
        )}
      >
        {children}
      </div>
    </div>
  );
}
