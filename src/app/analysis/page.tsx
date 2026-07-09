"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProgressSteps from "@/components/ProgressSteps";
import StepHeader from "@/components/StepHeader";
import NoticeBox from "@/components/NoticeBox";
import EvidenceCard from "@/components/EvidenceCard";
import { analyzeProject } from "@/lib/api";
import { buildMockEvidence } from "@/lib/mock";
import {
  loadOrCreateProject,
  patchProject,
  setEvidence,
} from "@/lib/storage";
import type { EvidenceItem } from "@/lib/types";

function AnalyzingState() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 rounded-2xl border border-brand-100 bg-brand-50/60 px-5 py-4">
        <span className="relative flex h-10 w-10 items-center justify-center">
          <span className="absolute h-10 w-10 animate-ping rounded-full bg-brand-400/40" />
          <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-600 text-white">
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 animate-spin" style={{ animationDuration: "1.4s" }}>
              <path d="M12 3a9 9 0 100 18 9 9 0 000-18z" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2" />
              <path d="M21 12a9 9 0 00-9-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
        </span>
        <div>
          <p className="font-semibold text-brand-800">AI가 자료를 분류하고 있습니다…</p>
          <p className="text-sm text-brand-600/80">
            카테고리 분류 · 설명문 생성 · 신뢰도 계산 중
          </p>
        </div>
      </div>
      <div className="grid gap-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="card flex overflow-hidden">
            <div className="shimmer h-32 w-40 shrink-0 bg-slate-100" />
            <div className="flex-1 space-y-3 p-4">
              <div className="shimmer h-4 w-1/3 rounded bg-slate-100" />
              <div className="shimmer h-9 w-full rounded bg-slate-100" />
              <div className="shimmer h-16 w-full rounded bg-slate-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AnalysisPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [evidence, setEvidenceState] = useState<EvidenceItem[]>([]);
  const [usedMock, setUsedMock] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      const project = loadOrCreateProject();

      // 이미 분석 결과가 있으면 그대로 사용 (뒤로 갔다 온 경우 수정 유지)
      if (project.evidence.length > 0) {
        setEvidenceState(project.evidence);
        setUsedMock(!project.backendConnected);
        setLoading(false);
        return;
      }

      let result: EvidenceItem[] | null = null;
      let mock = false;
      try {
        const res = await analyzeProject(project.projectId);
        result = res.evidence;
        patchProject({ backendConnected: true });
      } catch {
        // 백엔드 없음 → 목업 분석 (최소 딜레이로 분석 느낌)
        mock = true;
        await new Promise((r) => setTimeout(r, 1400));
        result = buildMockEvidence(project.files);
        patchProject({ backendConnected: false });
      }

      if (cancelled) return;
      setUsedMock(mock);
      setEvidenceState(result ?? []);
      setEvidence(result ?? []);
      setLoading(false);
    };

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleChange = (id: string, patch: Partial<EvidenceItem>) => {
    setEvidenceState((prev) => {
      const next = prev.map((e) => (e.id === id ? { ...e, ...patch } : e));
      setEvidence(next);
      return next;
    });
  };

  const editedCount = evidence.filter((e) => e.edited).length;

  return (
    <div>
      <ProgressSteps current="analysis" />
      <StepHeader
        eyebrow="STEP 3"
        title="AI 분류 결과를 확인하세요"
        description="AI가 제안한 카테고리와 설명문입니다. 정확하지 않은 부분은 직접 수정할 수 있어요. 모든 결과는 사용자가 편집 가능합니다."
      />

      <div className="mb-5">
        <NoticeBox tone="warning">
          AI 분류와 신뢰도는 <b>참고용</b>입니다. AI는 보상 가능 여부를 판단하지
          않으며, 최종 내용은 직접 확인·수정하셔야 합니다.
        </NoticeBox>
      </div>

      {loading ? (
        <AnalyzingState />
      ) : (
        <>
          <div className="mb-4 flex flex-wrap items-center gap-2 text-sm">
            <span className="chip bg-slate-900 text-white">
              {evidence.length}개 항목 분류
            </span>
            {editedCount > 0 && (
              <span className="chip bg-emerald-50 text-emerald-700">
                {editedCount}개 수정됨
              </span>
            )}
            <span
              className={`chip ${
                usedMock
                  ? "bg-amber-50 text-amber-700"
                  : "bg-emerald-50 text-emerald-700"
              }`}
            >
              {usedMock ? "데모(목업) 분석" : "백엔드 분석 완료"}
            </span>
          </div>

          <div className="grid gap-4">
            {evidence.map((item, index) => (
              <EvidenceCard
                key={item.id}
                item={item}
                index={index}
                onChange={handleChange}
              />
            ))}
          </div>

          {evidence.length === 0 && (
            <NoticeBox tone="info">
              분류할 자료가 없습니다. 업로드 단계로 돌아가 자료를 추가해주세요.
            </NoticeBox>
          )}

          <div className="mt-8 flex items-center justify-between">
            <button
              type="button"
              onClick={() => router.push("/upload")}
              className="btn-ghost"
            >
              이전
            </button>
            <button
              type="button"
              onClick={() => router.push("/timeline")}
              className="btn-primary px-7"
            >
              타임라인 만들기
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
