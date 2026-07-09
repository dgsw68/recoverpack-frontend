"use client";

import {
  EVIDENCE_CATEGORIES,
  type EvidenceCategory,
  type EvidenceItem,
} from "@/lib/types";

function ConfidenceBadge({ value }: { value: number }) {
  const pct = Math.round(value * 100);
  const tone =
    pct >= 90
      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
      : pct >= 80
        ? "bg-brand-50 text-brand-700 ring-brand-200"
        : "bg-amber-50 text-amber-700 ring-amber-200";
  return (
    <span
      className={`chip ring-1 ${tone}`}
      title="AI 분류 신뢰도 (참고용)"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      신뢰도 {pct}%
    </span>
  );
}

function ImageIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-9 w-9 text-slate-300">
      <rect x="3.5" y="4.5" width="17" height="15" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="9" cy="10" r="1.6" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5 17l4.5-4 3 2.5L16 11l3 3.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function EvidenceCard({
  item,
  index,
  onChange,
}: {
  item: EvidenceItem;
  index: number;
  onChange: (id: string, patch: Partial<EvidenceItem>) => void;
}) {
  return (
    <div className="card overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        {/* 미리보기 */}
        <div className="relative h-40 w-full shrink-0 overflow-hidden bg-slate-100 sm:h-auto sm:w-40">
          {item.isImage && item.previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.previewUrl}
              alt={item.fileName}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="grid h-full min-h-[9rem] w-full place-items-center bg-gradient-to-br from-slate-50 to-slate-100">
              <ImageIcon />
            </div>
          )}
          <span className="absolute left-2 top-2 rounded-md bg-slate-900/70 px-2 py-0.5 text-[11px] font-semibold text-white">
            #{index + 1}
          </span>
        </div>

        {/* 내용 */}
        <div className="flex-1 p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <p className="truncate text-sm font-semibold text-slate-800" title={item.fileName}>
              {item.fileName}
            </p>
            <div className="flex items-center gap-2">
              {item.edited && (
                <span className="chip bg-slate-100 text-slate-500">수정됨</span>
              )}
              <ConfidenceBadge value={item.confidence} />
            </div>
          </div>

          <div className="grid gap-3">
            <div>
              <label className="label-text">AI 분류 카테고리</label>
              <select
                value={item.category}
                onChange={(e) =>
                  onChange(item.id, {
                    category: e.target.value as EvidenceCategory,
                    edited: true,
                  })
                }
                className="input-field"
              >
                {EVIDENCE_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label-text">AI 설명문 (수정 가능)</label>
              <textarea
                value={item.caption}
                onChange={(e) =>
                  onChange(item.id, { caption: e.target.value, edited: true })
                }
                rows={2}
                className="input-field resize-none leading-relaxed"
                placeholder="설명문을 입력하세요"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
