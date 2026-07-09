import Link from "next/link";
import NoticeBox from "@/components/NoticeBox";

const FEATURES = [
  {
    emoji: "🗂️",
    title: "AI 자동 분류",
    desc: "사진·영수증·재난문자를 카테고리별로 자동 정리합니다.",
  },
  {
    emoji: "📝",
    title: "설명문 자동 작성",
    desc: "각 자료에 제출용 설명문(캡션)을 만들어 드립니다.",
  },
  {
    emoji: "🕒",
    title: "피해 타임라인",
    desc: "재난문자 수신부터 피해 발생까지 시간 순으로 정리합니다.",
  },
  {
    emoji: "📦",
    title: "제출용 패키지",
    desc: "요약표·색인·설명문을 하나의 ZIP으로 묶어 드립니다.",
  },
];

const FLOW = [
  "피해 유형 선택",
  "자료 업로드",
  "AI 분류 확인",
  "타임라인 정리",
  "패키지 다운로드",
];

export default function LandingPage() {
  return (
    <div className="animate-fade-up">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white px-6 py-14 shadow-card sm:px-12 sm:py-20">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gradient-to-br from-brand-200/60 to-aqua-200/50 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-gradient-to-tr from-brand-100/70 to-transparent blur-3xl"
        />

        <div className="relative mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-500" />
            재난 피해 증거 패키지 생성기
          </span>

          <h1 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-[2.7rem] sm:leading-[1.15]">
            재난 피해 자료를
            <br className="hidden sm:block" />{" "}
            <span className="bg-gradient-to-r from-brand-600 to-aqua-500 bg-clip-text text-transparent">
              제출 가능한 증거 패키지
            </span>
            로 정리합니다
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-slate-500 sm:text-lg">
            사진, 영수증, 재난문자, 시간 정보를 AI가 분류하고 설명문과 타임라인으로
            정리해 보험사·주민센터·집주인에게 제출하기 쉽게 만들어드립니다.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/damage-type" className="btn-primary w-full px-8 py-3.5 text-base sm:w-auto">
              증거 패키지 만들기
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                <path
                  d="M5 12h14M13 6l6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
            <Link href="/upload" className="btn-secondary w-full px-6 py-3.5 text-base sm:w-auto">
              데모 자료로 둘러보기
            </Link>
          </div>

          <div className="mx-auto mt-6 max-w-lg">
            <NoticeBox tone="warning">
              AI는 보상 가능 여부를 판단하지 않고, 자료 정리만 도와줍니다.
            </NoticeBox>
          </div>
        </div>
      </section>

      {/* 진행 플로우 */}
      <section className="mt-8">
        <div className="card flex flex-wrap items-center justify-center gap-x-2 gap-y-3 px-4 py-4 sm:gap-x-3">
          {FLOW.map((label, i) => (
            <div key={label} className="flex items-center gap-2 sm:gap-3">
              <span className="flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600 sm:text-sm">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-brand-600 text-[11px] font-bold text-white">
                  {i + 1}
                </span>
                {label}
              </span>
              {i < FLOW.length - 1 && (
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-slate-300">
                  <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="card p-5 transition hover:-translate-y-1 hover:shadow-card-hover"
          >
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-brand-50 to-aqua-50 text-2xl">
              {f.emoji}
            </span>
            <h3 className="mt-4 font-bold text-slate-900">{f.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-slate-500">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="mt-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800 px-6 py-10 text-center shadow-xl sm:px-12">
          <div aria-hidden className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-aqua-400/30 blur-3xl" />
          <h2 className="relative text-2xl font-bold text-white sm:text-3xl">
            지금 바로 증거 패키지를 만들어보세요
          </h2>
          <p className="relative mx-auto mt-2 max-w-md text-sm text-brand-100 sm:text-base">
            로그인 없이 몇 분이면 제출용 자료가 완성됩니다.
          </p>
          <Link
            href="/damage-type"
            className="btn relative mt-6 bg-white px-8 py-3.5 text-base text-brand-700 shadow-lg hover:-translate-y-0.5 hover:bg-brand-50"
          >
            증거 패키지 만들기
          </Link>
        </div>
      </section>
    </div>
  );
}
