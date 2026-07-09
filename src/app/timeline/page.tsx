"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProgressSteps from "@/components/ProgressSteps";
import StepHeader from "@/components/StepHeader";
import NoticeBox from "@/components/NoticeBox";
import TimelineEditor from "@/components/TimelineEditor";
import { buildDefaultTimeline } from "@/lib/mock";
import { loadOrCreateProject, setTimeline } from "@/lib/storage";
import type { TimelineEvent } from "@/lib/types";

export default function TimelinePage() {
  const router = useRouter();
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const project = loadOrCreateProject();
    if (project.timeline.length > 0) {
      setEvents(project.timeline);
    } else {
      const defaults = buildDefaultTimeline(project.damageType);
      setEvents(defaults);
      setTimeline(defaults);
    }
    setReady(true);
  }, []);

  const handleChange = (next: TimelineEvent[]) => {
    setEvents(next);
    setTimeline(next);
  };

  return (
    <div>
      <ProgressSteps current="timeline" />
      <StepHeader
        eyebrow="STEP 4"
        title="피해 타임라인을 정리하세요"
        description="재난문자 수신부터 피해 발생, 비용 발생까지 시간 순으로 정리합니다. 날짜·내용·출처를 자유롭게 수정하고 추가할 수 있습니다."
      />

      <div className="mb-5">
        <NoticeBox tone="info">
          기본 타임라인은 예시로 채워져 있습니다. 실제 상황에 맞게 <b>날짜와 내용을
          수정</b>해 주세요. 시간 정보는 제출 문서의 신뢰도를 높여줍니다.
        </NoticeBox>
      </div>

      {ready && <TimelineEditor events={events} onChange={handleChange} />}

      <div className="mt-8 flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.push("/analysis")}
          className="btn-ghost"
        >
          이전
        </button>
        <button
          type="button"
          onClick={() => router.push("/download")}
          className="btn-primary px-7"
        >
          제출 패키지 생성
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
            <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
