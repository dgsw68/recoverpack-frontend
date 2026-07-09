"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@toss/tds-mobile";
import StepScreen from "@/components/StepScreen";
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
    <StepScreen
      step={4}
      backTo="/analysis"
      title="피해 타임라인을 정리하세요"
      subtitle="재난문자 수신부터 피해 발생, 비용 발생까지 시간 순으로 정리해요. 날짜·내용·출처를 자유롭게 수정할 수 있어요."
      footer={
        <Button
          display="full"
          size="xlarge"
          onClick={() => router.push("/download")}
        >
          제출 패키지 생성
        </Button>
      }
    >
      <div className="mb-4">
        <NoticeBox tone="info">
          기본 타임라인은 예시로 채워져 있어요. 실제 상황에 맞게 <b>날짜와 내용을 수정</b>해
          주세요. 시간 정보는 제출 문서의 신뢰도를 높여줘요.
        </NoticeBox>
      </div>

      {ready && <TimelineEditor events={events} onChange={handleChange} />}
    </StepScreen>
  );
}
