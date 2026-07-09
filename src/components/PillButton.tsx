"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

type Size = "medium" | "large" | "xlarge";
type Color = "blue" | "dark";
type Variant = "solid" | "weak";

const SIZE_CLASS: Record<Size, string> = {
  medium: "h-11 px-5 text-[14px]",
  large: "h-12 px-6 text-[15px]",
  xlarge: "h-[54px] px-6 text-[16px]",
};

const COLOR_CLASS: Record<`${Color}-${Variant}`, string> = {
  "blue-solid": "bg-[#3182f6] text-white active:bg-[#2272eb]",
  "blue-weak": "bg-[#eaf2ff] text-[#3182f6] active:bg-[#dbe9ff]",
  "dark-solid": "bg-[#191f28] text-white active:bg-[#0d1117]",
  "dark-weak": "bg-[#f2f4f6] text-[#333d4b] active:bg-[#e5e8eb]",
};

interface PillButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "color"> {
  display?: "full" | "inline";
  size?: Size;
  color?: Color;
  variant?: Variant;
  loading?: boolean;
  children: ReactNode;
}

export default function PillButton({
  display = "inline",
  size = "large",
  color = "blue",
  variant = "solid",
  loading = false,
  disabled,
  className = "",
  children,
  ...rest
}: PillButtonProps) {
  const isDisabled = disabled || loading;
  return (
    <button
      type="button"
      disabled={isDisabled}
      className={`inline-flex items-center justify-center gap-2 rounded-full font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-45 ${
        display === "full" ? "w-full" : ""
      } ${SIZE_CLASS[size]} ${COLOR_CLASS[`${color}-${variant}`]} ${className}`}
      {...rest}
    >
      {loading && (
        <span className="h-[1em] w-[1em] animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden />
      )}
      {children}
    </button>
  );
}
