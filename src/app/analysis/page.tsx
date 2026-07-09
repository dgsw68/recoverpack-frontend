"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Badge, Button, ListRow } from "@toss/tds-mobile";
import StepScreen from "@/components/StepScreen";
import NoticeBox from "@/components/NoticeBox";
import { analyzeProject } from "@/lib/api";
import { buildMockEvidence } from "@/lib/mock";
import { loadOrCreateProject, patchProject, setEvidence } from "@/lib/storage";
import {
  EVIDENCE_CATEGORIES,
  type EvidenceCategory,
  type EvidenceItem,
} from "@/lib/types";

function confidenceColor(pct: number): "green" | "blue" | "yellow" {
  if (pct >= 90) return "green";
  if (pct >= 80) return "blue";
  return "yellow";
}

function AnalyzingState() {
  return (
    <div>
      <div className="mb-4 flex items-center gap-3 rounded-2xl bg-[#f4f8ff] px-4 py-3.5">
        <span className="relative grid h-9 w-9 place-items-center">
          <span className="absolute h-9 w-9 animate-ping rounded-full bg-[#3182f6]/30" />
          <span className="grid h-9 w-9 place-items-center rounded-full bg-[#3182f6] text-white">
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 animate-spin" style={{ animationDuration: "1.4s" }}>
              <path d="M12 3a9 9 0 100 18 9 9 0 000-18z" stroke="currentColor" strokeOpacity="0.3" strokeWidth="2" />
              <path d="M21 12a9 9 0 00-9-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
        </span>
        <div>
          <p className="text-[15px] font-bold text-[#1b64da]">AI가 자료를 분류하고 있어요…</p>
          <p className="text-[13px] text-[#3182f6]/80">카테고리 분류 · 설명문 생성 · 신뢰도 계산 중</p>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {[0, 1, 2].map((i) => (
          <ListRow.Loader key={i} type="square" verticalPadding="medium" />
        ))}
      </div>
    </div>
  );
}

function EvidenceRow({
  item,
  index,
  onChange,
}: {
  item: EvidenceItem;
  index: number;
  onChange: (id: string, patch: Partial<EvidenceItem>) => void;
}) {
  const pct = Math.round(item.confidence * 100);
  return (
    <div className="overflow-hidden rounded-2xl border border-[#e5e8eb] bg-white">
      <div className="relative h-40 w-full bg-[#f2f4f6]">
        {item.isImage && item.previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.previewUrl} alt={item.fileName} className="h-full w-full object-cover" />
        ) : (
          <div className="grid h-full w-full place-items-center text-[40px]">📄</div>
        )}
        <span className="absolute left-2.5 top-2.5 rounded-md bg-black/60 px-2 py-0.5 text-[11px] font-bold text-white">
          #{index + 1}
        </span>
      </div>

      <div className="p-4">
        <div className="mb-3 flex flex-wrap items-center gap-1.5">
          <span className="mr-auto truncate text-[14px] font-bold text-[#333d4b]" title={item.fileName}>
            {item.fileName}
          </span>
          {item.edited && (
            <Badge size="small" color="elephant" variant="weak">수정됨</Badge>
          )}
          <Badge size="small" color={confidenceColor(pct)} variant="weak">
            신뢰도 {pct}%
          </Badge>
        </div>

        <label className="mb-1 block text-[12px] font-bold text-[#8b95a1]">AI 분류 카테고리</label>
        <select
          value={item.category}
          onChange={(e) =>
            onChange(item.id, { category: e.target.value as EvidenceCategory, edited: true })
          }
          className="mb-3 w-full rounded-xl border border-[#e5e8eb] bg-[#f9fafb] px-3 py-2.5 text-[14px] font-medium text-[#333d4b] outline-none focus:border-[#3182f6]"
        >
          {EVIDENCE_CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <label className="mb-1 block text-[12px] font-bold text-[#8b95a1]">AI 설명문 (수정 가능)</label>
        <textarea
          value={item.caption}
          onChange={(e) => onChange(item.id, { caption: e.target.value, edited: true })}
          rows={2}
          placeholder="설명문을 입력하세요"
          className="w-full resize-none rounded-xl border border-[#e5e8eb] bg-white px-3 py-2.5 text-[14px] leading-relaxed text-[#333d4b] outline-none focus:border-[#3182f6]"
        />
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
    <StepScreen
      step={3}
      backTo="/upload"
      title="AI 분류 결과를 확인하세요"
      subtitle="AI가 제안한 카테고리와 설명문이에요. 정확하지 않은 부분은 직접 수정할 수 있어요."
      footer={
        <Button
          key={loading || evidence.length === 0 ? "cta-wait" : "cta-ready"}
          display="full"
          size="xlarge"
          disabled={loading || evidence.length === 0}
          onClick={() => router.push("/timeline")}
        >
          타임라인 만들기
        </Button>
      }
    >
      <div className="mb-4">
        <NoticeBox tone="warning">
          AI 분류와 신뢰도는 <b>참고용</b>이에요. AI는 보상 가능 여부를 판단하지
          않으며, 최종 내용은 직접 확인·수정해 주세요.
        </NoticeBox>
      </div>

      {loading ? (
        <AnalyzingState />
      ) : (
        <>
          <div className="mb-3 flex flex-wrap gap-1.5">
            <Badge size="small" color="blue" variant="fill">{evidence.length}개 항목 분류</Badge>
            {editedCount > 0 && (
              <Badge size="small" color="green" variant="weak">{editedCount}개 수정됨</Badge>
            )}
            <Badge size="small" color={usedMock ? "yellow" : "green"} variant="weak">
              {usedMock ? "데모(목업) 분석" : "백엔드 분석 완료"}
            </Badge>
          </div>

          <div className="flex flex-col gap-3">
            {evidence.map((item, index) => (
              <EvidenceRow key={item.id} item={item} index={index} onChange={handleChange} />
            ))}
          </div>

          {evidence.length === 0 && (
            <NoticeBox tone="info">
              분류할 자료가 없어요. 업로드 단계로 돌아가 자료를 추가해 주세요.
            </NoticeBox>
          )}
        </>
      )}
    </StepScreen>
  );
}
