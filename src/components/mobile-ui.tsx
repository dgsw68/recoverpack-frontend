"use client";

import type { CSSProperties, MouseEventHandler, ReactNode } from "react";

type BadgeColor = "blue" | "green" | "red" | "teal" | "elephant" | "yellow";
type BadgeVariant = "fill" | "weak";

const BADGE_STYLE: Record<BadgeColor, Record<BadgeVariant, string>> = {
  blue: {
    fill: "bg-[#3182f6] text-white",
    weak: "bg-[#eaf2ff] text-[#3182f6]",
  },
  green: {
    fill: "bg-[#00a661] text-white",
    weak: "bg-[#e8f8f0] text-[#008f5a]",
  },
  red: {
    fill: "bg-[#f04452] text-white",
    weak: "bg-[#fff3f0] text-[#f04452]",
  },
  teal: {
    fill: "bg-[#00a3a3] text-white",
    weak: "bg-[#e5f8f8] text-[#008a8a]",
  },
  elephant: {
    fill: "bg-[#4e5968] text-white",
    weak: "bg-[#f2f4f6] text-[#4e5968]",
  },
  yellow: {
    fill: "bg-[#f9a825] text-white",
    weak: "bg-[#fff7df] text-[#b76e00]",
  },
};

export function Badge({
  children,
  color = "elephant",
  variant = "weak",
}: {
  children: ReactNode;
  size?: "small";
  color?: BadgeColor;
  variant?: BadgeVariant;
}) {
  return (
    <span
      className={`inline-flex h-6 items-center rounded-full px-2 text-[12px] font-bold leading-none ${
        BADGE_STYLE[color][variant]
      }`}
    >
      {children}
    </span>
  );
}

function Texts({ top, bottom }: { type?: "2RowTypeA"; top: ReactNode; bottom?: ReactNode }) {
  return (
    <div className="min-w-0 py-0.5">
      <p className="truncate text-[15px] font-bold leading-[1.35] text-[#191f28]">{top}</p>
      {bottom && (
        <p className="mt-0.5 line-clamp-2 text-[13px] font-medium leading-[1.35] text-[#8b95a1]">
          {bottom}
        </p>
      )}
    </div>
  );
}

function Loader({
  verticalPadding = "medium",
}: {
  type?: "square";
  verticalPadding?: "small" | "medium";
}) {
  return (
    <div className={`flex items-center gap-3 px-4 ${verticalPadding === "small" ? "py-2.5" : "py-3"}`}>
      <div className="shimmer h-11 w-11 rounded-xl" />
      <div className="min-w-0 flex-1">
        <div className="shimmer h-4 w-3/5 rounded" />
        <div className="shimmer mt-2 h-3 w-4/5 rounded" />
      </div>
    </div>
  );
}

function ListRowBase({
  left,
  contents,
  right,
  onClick,
  verticalPadding = "medium",
}: {
  left?: ReactNode;
  contents: ReactNode;
  right?: ReactNode;
  onClick?: MouseEventHandler<HTMLDivElement>;
  verticalPadding?: "small" | "medium";
}) {
  return (
    <div
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(e) => {
        if (!onClick || (e.key !== "Enter" && e.key !== " ")) return;
        e.preventDefault();
        e.currentTarget.click();
      }}
      className={`flex items-center gap-3 px-4 ${
        verticalPadding === "small" ? "py-2.5" : "py-3.5"
      } ${onClick ? "cursor-pointer active:bg-[#f9fafb]" : ""}`}
    >
      {left && <div className="shrink-0">{left}</div>}
      <div className="min-w-0 flex-1">{contents}</div>
      {right && <div className="shrink-0">{right}</div>}
    </div>
  );
}

export const ListRow = Object.assign(ListRowBase, { Texts, Loader });

function TitleParagraph({ children, size = 22 }: { children: ReactNode; size?: number }) {
  return (
    <h1 className="font-extrabold leading-[1.28] text-[#191f28]" style={{ fontSize: size }}>
      {children}
    </h1>
  );
}

function SubtitleParagraph({ children, size = 15 }: { children: ReactNode; size?: number }) {
  return (
    <p className="font-medium leading-[1.45] text-[#6b7684]" style={{ fontSize: size }}>
      {children}
    </p>
  );
}

function TopBase({
  title,
  subtitleBottom,
  upperGap = 0,
  lowerGap = 0,
  style,
}: {
  title: ReactNode;
  subtitleBottom?: ReactNode;
  upperGap?: number;
  lowerGap?: number;
  style?: CSSProperties;
}) {
  return (
    <div style={style}>
      <div style={{ height: upperGap }} />
      <div className="px-6">
        {title}
        {subtitleBottom && <div className="mt-2">{subtitleBottom}</div>}
      </div>
      <div style={{ height: lowerGap }} />
    </div>
  );
}

export const Top = Object.assign(TopBase, {
  TitleParagraph,
  SubtitleParagraph,
});
