import Link from "next/link";

export interface StepDef {
  key: string;
  label: string;
  href: string;
}

export const STEPS: StepDef[] = [
  { key: "damage-type", label: "피해 유형", href: "/damage-type" },
  { key: "upload", label: "자료 업로드", href: "/upload" },
  { key: "analysis", label: "AI 분류", href: "/analysis" },
  { key: "timeline", label: "타임라인", href: "/timeline" },
  { key: "download", label: "패키지 생성", href: "/download" },
];

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden>
      <path
        d="M5 10.5l3.2 3.2L15 6.8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** 현재 단계 key를 받아 진행 상황을 시각화 */
export default function ProgressSteps({ current }: { current: string }) {
  const currentIndex = STEPS.findIndex((s) => s.key === current);

  return (
    <nav aria-label="진행 단계" className="mb-6">
      <ol className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:gap-2">
        {STEPS.map((step, i) => {
          const state =
            i < currentIndex ? "done" : i === currentIndex ? "current" : "todo";
          const circle =
            state === "done"
              ? "bg-brand-600 text-white"
              : state === "current"
                ? "bg-brand-600 text-white ring-4 ring-brand-100"
                : "bg-white text-slate-400 border border-slate-200";
          const text =
            state === "todo"
              ? "text-slate-400"
              : "text-slate-800 font-semibold";

          const content = (
            <div className="flex shrink-0 items-center gap-2">
              <span
                className={`grid h-7 w-7 place-items-center rounded-full text-xs font-bold transition ${circle}`}
              >
                {state === "done" ? <CheckIcon /> : i + 1}
              </span>
              <span className={`hidden text-sm sm:inline ${text}`}>
                {step.label}
              </span>
            </div>
          );

          return (
            <li key={step.key} className="flex items-center gap-1.5 sm:gap-2">
              {i <= currentIndex ? (
                <Link href={step.href} className="rounded-full">
                  {content}
                </Link>
              ) : (
                content
              )}
              {i < STEPS.length - 1 && (
                <span
                  className={`h-px w-4 sm:w-8 ${
                    i < currentIndex ? "bg-brand-400" : "bg-slate-200"
                  }`}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
