"use client";

import { uid } from "@/lib/storage";
import type { TimelineEvent } from "@/lib/types";

function formatDisplay(datetime: string): string {
  if (!datetime) return "시간 미정";
  const d = new Date(datetime);
  if (Number.isNaN(d.getTime())) return datetime;
  return d.toLocaleString("ko-KR", {
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function TimelineEditor({
  events,
  onChange,
}: {
  events: TimelineEvent[];
  onChange: (events: TimelineEvent[]) => void;
}) {
  const update = (id: string, patch: Partial<TimelineEvent>) => {
    onChange(events.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  };

  const remove = (id: string) => {
    onChange(events.filter((e) => e.id !== id));
  };

  const add = () => {
    const now = new Date().toISOString().slice(0, 16);
    onChange([
      ...events,
      {
        id: uid("tl"),
        datetime: now,
        title: "새 이벤트",
        description: "",
        source: "",
      },
    ]);
  };

  return (
    <div>
      <div className="relative space-y-4 before:absolute before:left-[11px] before:top-2 before:h-[calc(100%-1rem)] before:w-0.5 before:bg-gradient-to-b before:from-brand-300 before:to-aqua-300 sm:before:left-[15px]">
        {events.map((event, index) => (
          <div key={event.id} className="relative pl-9 sm:pl-12">
            {/* 점 */}
            <span className="absolute left-0 top-3 grid h-6 w-6 place-items-center rounded-full bg-white ring-4 ring-brand-100 sm:h-8 sm:w-8">
              <span className="h-2.5 w-2.5 rounded-full bg-brand-600 sm:h-3 sm:w-3" />
            </span>

            <div className="card p-4">
              <div className="mb-3 flex items-center justify-between gap-2">
                <span className="chip bg-brand-50 text-brand-700">
                  {formatDisplay(event.datetime)}
                </span>
                <button
                  type="button"
                  onClick={() => remove(event.id)}
                  className="btn-ghost !px-2 !py-1 text-xs text-slate-400 hover:text-rose-500"
                  aria-label="이벤트 삭제"
                >
                  삭제
                </button>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <label className="label-text">날짜 / 시간</label>
                  <input
                    type="datetime-local"
                    value={event.datetime}
                    onChange={(e) => update(event.id, { datetime: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div className="sm:col-span-1">
                  <label className="label-text">제목</label>
                  <input
                    type="text"
                    value={event.title}
                    onChange={(e) => update(event.id, { title: e.target.value })}
                    className="input-field"
                    placeholder="예: 재난문자 수신"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="label-text">설명</label>
                  <textarea
                    value={event.description}
                    onChange={(e) =>
                      update(event.id, { description: e.target.value })
                    }
                    rows={2}
                    className="input-field resize-none"
                    placeholder="어떤 일이 있었는지 적어주세요"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="label-text">출처</label>
                  <input
                    type="text"
                    value={event.source}
                    onChange={(e) => update(event.id, { source: e.target.value })}
                    className="input-field"
                    placeholder="예: 행정안전부 재난문자, 통화 기록"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={add}
        className="btn-secondary mt-4 w-full border-dashed"
      >
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
          <path
            d="M12 5v14M5 12h14"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        이벤트 추가
      </button>
    </div>
  );
}
