import { twMerge } from "tailwind-merge";
import { ArrowUpRightIcon } from "@heroicons/react/24/outline";
import { Children, cloneElement, isValidElement } from "react";

type HeadingProperties<T extends keyof JSX.IntrinsicElements> =
  JSX.IntrinsicElements[T] & {
    level: 1 | 2 | 3 | 4 | 5 | 6;
    as?: T;
    link?: boolean;
  };

export function Heading<T extends keyof JSX.IntrinsicElements>({
  level,
  // @ts-ignore
  as: Component = `h${level}`,
  link = false,
  children,
  className,
  ...properties
}: HeadingProperties<T>) {
  className = twMerge(
    level === 1
      ? "text-5xl/tight"
      : level === 2
      ? "text-4xl/tight"
      : level === 3
      ? "text-3xl/tight"
      : "text-2xl/tight",
    "font-display font-extrabold dark:font-bold dark:tracking-wide uppercase",
    link &&
      // 交互主要由内部的 Link 负责，这里只保留轻微透明度过渡
      "transition-opacity duration-200 ease-out hover:opacity-80",
    className
  );

  // 当 `link` 为 true 时（Heading 内只有一个子元素，一般就是 <Link />），把箭头 SVG 注入到 Link 内部，
  // 这样鼠标悬停/点击箭头都会与标题文案一致触发跳转与 hover 动效。
  const childArray = link
    ? Children.toArray(children).filter((c) => {
        // React 会把换行/缩进当作文本节点塞进 children，这里去掉纯空白文本，避免导致注入失败
        return typeof c !== "string" || c.trim() !== "";
      })
    : [];
  const singleChild = link && childArray.length === 1 ? childArray[0] : null;
  const shouldInjectArrow = link && isValidElement(singleChild);

  return (
    // @ts-ignore
    <Component className={className} {...properties}>
      {shouldInjectArrow
        ? cloneElement(singleChild as any, {
            children: (
              <span className="relative flex items-end space-x-2 w-full">
                {((singleChild as any).props?.children ?? null) as any}
                <ArrowUpRightIcon
                  className="flex-shrink-0 h-[1em] w-[1em] mb-1.5"
                  aria-hidden="true"
                  strokeWidth={2.5}
                />
              </span>
            ),
          })
        : children}
    </Component>
  );
}
