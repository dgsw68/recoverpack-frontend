"use client";

import { Badge } from "@toss/tds-mobile";
import PillButton from "@/components/PillButton";
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

const inputCls =
  "w-full rounded-xl border border-[#e5e8eb] bg-white px-3 py-2.5 text-[14px] text-[#333d4b] outline-none focus:border-[#3182f6]";
const labelCls = "mb-1 block text-[12px] font-bold text-[#8b95a1]";

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
      { id: uid("tl"), eventDate: now, title: "새 이벤트", description: "" },
    ]);
  };

  return (
    <div>
      <div className="relative flex flex-col gap-3 before:absolute before:left-[11px] before:top-3 before:h-[calc(100%-2rem)] before:w-0.5 before:bg-[#c6dcff]">
        {events.map((event) => (
          <div key={event.id} className="relative pl-8">
            <span className="absolute left-0 top-3 grid h-6 w-6 place-items-center rounded-full bg-white ring-4 ring-[#e8f1ff]">
              <span className="h-2.5 w-2.5 rounded-full bg-[#3182f6]" />
            </span>

            <div className="rounded-2xl border border-[#e5e8eb] bg-white p-4">
              <div className="mb-3 flex items-center justify-between gap-2">
                <Badge size="small" color="blue" variant="weak">
                  {formatDisplay(event.eventDate)}
                </Badge>
                <button
                  type="button"
                  onClick={() => remove(event.id)}
                  className="-mr-2 flex min-h-11 min-w-11 items-center justify-center rounded-lg px-3 text-[13px] font-medium text-[#8b95a1] active:bg-[#f2f4f6]"
                  aria-label="이벤트 삭제"
                >
                  삭제
                </button>
              </div>

              <div className="flex flex-col gap-3">
                <div>
                  <label className={labelCls}>날짜 / 시간</label>
                  <input
                    type="datetime-local"
                    value={event.eventDate}
                    onChange={(e) => update(event.id, { eventDate: e.target.value })}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>제목</label>
                  <input
                    type="text"
                    value={event.title}
                    onChange={(e) => update(event.id, { title: e.target.value })}
                    className={inputCls}
                    placeholder="예: 재난문자 수신"
                  />
                </div>
                <div>
                  <label className={labelCls}>설명</label>
                  <textarea
                    value={event.description}
                    onChange={(e) => update(event.id, { description: e.target.value })}
                    rows={2}
                    className={`${inputCls} resize-none`}
                    placeholder="어떤 일이 있었는지 적어주세요"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3">
        <PillButton display="full" size="large" color="dark" variant="weak" onClick={add}>
          + 이벤트 추가
        </PillButton>
      </div>
    </div>
  );
}
