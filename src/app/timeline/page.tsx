"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StepScreen from "@/components/StepScreen";
import NoticeBox from "@/components/NoticeBox";
import RequireAuth from "@/components/RequireAuth";
import PillButton from "@/components/PillButton";
import TimelineEditor from "@/components/TimelineEditor";
import { generateTimeline, saveTimeline, type RemoteTimelineEvent } from "@/api/timeline";
import { ApiError } from "@/api/client";
import { loadOrCreateProject, setTimeline, uid } from "@/lib/storage";
import type { TimelineEvent } from "@/lib/types";

function toLocal(events: RemoteTimelineEvent[]): TimelineEvent[] {
  return events.map((e) => ({
    id: uid("tl"),
    eventDate: e.eventDate.replace(" ", "T").slice(0, 16),
    title: e.title,
    description: e.description,
  }));
}

function toRemote(events: TimelineEvent[]): RemoteTimelineEvent[] {
  return events.map((e) => ({
    title: e.title,
    description: e.description,
    eventDate: e.eventDate.replace("T", " "),
  }));
}

function TimelinePage() {
  const router = useRouter();
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      const project = loadOrCreateProject();
      setProjectId(project.projectId);

      if (project.timeline.length > 0) {
        setEvents(project.timeline);
        setLoading(false);
        return;
      }
      if (!project.projectId) {
        setError("프로젝트 정보가 없어요. 이전 단계로 돌아가 주세요.");
        setLoading(false);
        return;
      }
      try {
        const res = await generateTimeline(project.projectId);
        if (cancelled) return;
        const mapped = toLocal(res);
        setEvents(mapped);
        setTimeline(mapped);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof ApiError ? err.message : "타임라인 생성에 실패했어요.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleChange = (next: TimelineEvent[]) => {
    setEvents(next);
    setTimeline(next);
  };

  const handleNext = async () => {
    if (!projectId) {
      setError("프로젝트 정보가 없어요. 이전 단계로 돌아가 주세요.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await saveTimeline(projectId, toRemote(events));
      router.push("/download");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "타임라인 저장에 실패했어요.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <StepScreen
      step={5}
      backTo="/analysis"
      title="피해 타임라인을 정리하세요"
      subtitle="재난문자 수신부터 피해 발생, 비용 발생까지 시간 순으로 정리해요. 날짜·내용을 자유롭게 수정할 수 있어요."
      footer={
        <>
          {error && (
            <div className="mb-2">
              <NoticeBox tone="warning">{error}</NoticeBox>
            </div>
          )}
          <PillButton
            display="full"
            size="xlarge"
            loading={submitting}
            disabled={loading || events.length === 0}
            onClick={handleNext}
          >
            제출 패키지 생성
          </PillButton>
        </>
      }
    >
      <div className="mb-4">
        <NoticeBox tone="info">
          AI가 생성한 타임라인은 예시로 채워져 있어요. 실제 상황에 맞게{" "}
          <b>날짜와 내용을 수정</b>해 주세요.
        </NoticeBox>
      </div>

      {!loading && <TimelineEditor events={events} onChange={handleChange} />}
    </StepScreen>
  );
}

export default function TimelinePageWrapper() {
  return (
    <RequireAuth>
      <TimelinePage />
    </RequireAuth>
  );
}
