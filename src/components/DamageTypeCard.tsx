"use client";

import type { DamageType } from "@/lib/types";

export interface DamageTypeMeta {
  type: DamageType;
  emoji: string;
  description: string;
  gradient: string;
}

export const DAMAGE_TYPES: DamageTypeMeta[] = [
  {
    type: "침수",
    emoji: "🌊",
    description: "폭우·하천 범람·역류로 인한 실내 침수 피해",
    gradient: "from-sky-400 to-brand-500",
  },
  {
    type: "화재",
    emoji: "🔥",
    description: "화재·그을음·소방 활동으로 인한 피해",
    gradient: "from-orange-400 to-rose-500",
  },
  {
    type: "폭설",
    emoji: "❄️",
    description: "폭설·붕괴·동파로 인한 시설 피해",
    gradient: "from-cyan-300 to-blue-400",
  },
  {
    type: "태풍",
    emoji: "🌀",
    description: "강풍·비산물·시설물 파손 피해",
    gradient: "from-teal-400 to-indigo-500",
  },
];

export default function DamageTypeCard({
  meta,
  selected,
  recommended,
  onSelect,
}: {
  meta: DamageTypeMeta;
  selected: boolean;
  recommended?: boolean;
  onSelect: (type: DamageType) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(meta.type)}
      aria-pressed={selected}
      className={`group relative flex flex-col items-start overflow-hidden rounded-2xl border p-5 text-left transition-all duration-200 ${
        selected
          ? "border-brand-500 bg-white shadow-card-hover ring-2 ring-brand-200"
          : "border-slate-200 bg-white shadow-card hover:-translate-y-1 hover:border-brand-300 hover:shadow-card-hover"
      }`}
    >
      {recommended && (
        <span className="absolute right-3 top-3 rounded-full bg-brand-600 px-2.5 py-1 text-[11px] font-bold text-white shadow">
          추천
        </span>
      )}
      <span
        className={`grid h-14 w-14 place-items-center rounded-xl bg-gradient-to-br ${meta.gradient} text-2xl shadow-inner`}
      >
        {meta.emoji}
      </span>
      <h3 className="mt-4 text-lg font-bold text-slate-900">{meta.type}</h3>
      <p className="mt-1 text-sm leading-relaxed text-slate-500">
        {meta.description}
      </p>

      <span
        className={`mt-4 inline-flex items-center gap-1 text-sm font-semibold transition ${
          selected ? "text-brand-600" : "text-slate-300 group-hover:text-brand-500"
        }`}
      >
        {selected ? (
          <>
            <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
              <circle cx="10" cy="10" r="9" fill="currentColor" opacity="0.15" />
              <path
                d="M6 10.2l2.6 2.6L14 7.4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            선택됨
          </>
        ) : (
          "선택하기"
        )}
      </span>
    </button>
  );
}
