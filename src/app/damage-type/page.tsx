"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProgressSteps from "@/components/ProgressSteps";
import StepHeader from "@/components/StepHeader";
import NoticeBox from "@/components/NoticeBox";
import DamageTypeCard, { DAMAGE_TYPES } from "@/components/DamageTypeCard";
import { createProject } from "@/lib/api";
import {
  loadOrCreateProject,
  patchProject,
  setDamageType,
} from "@/lib/storage";
import type { DamageType } from "@/lib/types";

const DEFAULT_TYPE: DamageType = "침수";

export default function DamageTypePage() {
  const router = useRouter();
  const [selected, setSelected] = useState<DamageType>(DEFAULT_TYPE);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const project = loadOrCreateProject();
    if (project.damageType) setSelected(project.damageType);
  }, []);

  const handleNext = async () => {
    setSubmitting(true);
    setDamageType(selected);

    // 백엔드가 있으면 프로젝트 생성, 없으면 목업으로 진행
    try {
      const res = await createProject(selected);
      patchProject({ projectId: res.projectId, backendConnected: true });
    } catch {
      patchProject({ backendConnected: false });
    }

    router.push("/upload");
  };

  return (
    <div>
      <ProgressSteps current="damage-type" />
      <StepHeader
        eyebrow="STEP 1"
        title="어떤 피해를 겪으셨나요?"
        description="피해 유형을 선택하면 그에 맞는 분류 기준과 타임라인 템플릿을 준비해 드립니다."
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {DAMAGE_TYPES.map((meta) => (
          <DamageTypeCard
            key={meta.type}
            meta={meta}
            selected={selected === meta.type}
            recommended={meta.type === DEFAULT_TYPE}
            onSelect={setSelected}
          />
        ))}
      </div>

      <div className="mt-6">
        <NoticeBox tone="info">
          MVP 데모에서는 <b>침수</b> 피해가 기본으로 준비되어 있습니다. 다른 유형도
          동일한 방식으로 정리됩니다.
        </NoticeBox>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <span className="text-sm text-slate-500">
          선택: <b className="text-slate-800">{selected}</b>
        </span>
        <button
          type="button"
          onClick={handleNext}
          disabled={submitting}
          className="btn-primary px-7"
        >
          {submitting ? "준비 중…" : "다음 단계로"}
          {!submitting && (
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
