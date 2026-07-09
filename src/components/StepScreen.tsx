"use client";

import { useRouter } from "next/navigation";
import { Top } from "@toss/tds-mobile";
import type { ReactNode } from "react";

export const STEP_LABELS = [
  "피해 유형",
  "신고인 정보",
  "자료 업로드",
  "AI 분류",
  "타임라인",
  "패키지",
] as const;

const TOTAL = STEP_LABELS.length;

interface StepScreenProps {
  /** 1부터 시작하는 현재 단계 */
  step: number;
  title: ReactNode;
  subtitle?: ReactNode;
  /** 뒤로가기 경로. 없으면 브라우저 back */
  backTo?: string;
  children: ReactNode;
  /** 하단에 고정되는 CTA 영역 */
  footer?: ReactNode;
}

export default function StepScreen({
  step,
  title,
  subtitle,
  backTo,
  children,
  footer,
}: StepScreenProps) {
  const router = useRouter();

  return (
    <div className="flex min-h-[100dvh] flex-1 flex-col">
      {/* App Bar */}
      <header className="sticky top-0 z-20 flex h-14 items-center justify-between bg-white/90 px-2 backdrop-blur">
        <button
          type="button"
          aria-label="뒤로가기"
          onClick={() => (backTo ? router.push(backTo) : router.back())}
          className="grid h-11 w-11 place-items-center rounded-full text-[#333d4b] active:bg-[#f2f4f6]"
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
            <path
              d="M15 5l-7 7 7 7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <span className="text-[13px] font-semibold tabular-nums text-[#8b95a1]">
          {step} / {TOTAL}
        </span>
        <span className="h-10 w-10" aria-hidden />
      </header>

      {/* Progress bar */}
      <div className="flex gap-1 px-6 pb-1 pt-1">
        {Array.from({ length: TOTAL }, (_, i) => (
          <span
            key={i}
            className={`h-[3px] flex-1 rounded-full transition-colors ${
              i < step ? "bg-[#3182f6]" : "bg-[#e5e8eb]"
            }`}
          />
        ))}
      </div>

      {/* Content */}
      <main className="animate-fade-up flex-1 px-6 pb-6">
        <Top
          upperGap={12}
          lowerGap={subtitle ? 8 : 20}
          title={
            <Top.TitleParagraph size={22}>{title}</Top.TitleParagraph>
          }
          subtitleBottom={
            subtitle ? (
              <Top.SubtitleParagraph size={15}>
                {subtitle}
              </Top.SubtitleParagraph>
            ) : undefined
          }
        />
        {children}
      </main>

      {/* Sticky bottom CTA */}
      {footer && (
        <div className="sticky bottom-0 z-20 border-t border-[#f2f4f6] bg-white/95 px-6 pb-6 pt-3 backdrop-blur">
          {footer}
        </div>
      )}
    </div>
  );
}
