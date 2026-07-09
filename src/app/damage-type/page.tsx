"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Badge, Button, ListRow } from "@toss/tds-mobile";
import StepScreen from "@/components/StepScreen";
import NoticeBox from "@/components/NoticeBox";
import { DAMAGE_TYPES } from "@/lib/damage";
import { createProject } from "@/lib/api";
import { loadOrCreateProject, patchProject, setDamageType } from "@/lib/storage";
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
    try {
      const res = await createProject(selected);
      patchProject({ projectId: res.projectId, backendConnected: true });
    } catch {
      patchProject({ backendConnected: false });
    }
    router.push("/upload");
  };

  return (
    <StepScreen
      step={1}
      backTo="/"
      title="어떤 피해를 겪으셨나요?"
      subtitle="피해 유형을 선택하면 그에 맞는 분류 기준과 타임라인 템플릿을 준비해 드려요."
      footer={
        <Button
          display="full"
          size="xlarge"
          loading={submitting}
          onClick={handleNext}
        >
          {selected} 피해로 시작하기
        </Button>
      }
    >
      <div className="flex flex-col gap-2.5">
        {DAMAGE_TYPES.map((meta) => {
          const isSelected = selected === meta.type;
          return (
            <div
              key={meta.type}
              className={`overflow-hidden rounded-2xl border transition-colors ${
                isSelected
                  ? "border-[#3182f6] bg-[#f4f8ff]"
                  : "border-[#e5e8eb] bg-white"
              }`}
            >
              <ListRow
                onClick={() => setSelected(meta.type)}
                left={
                  <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-[22px] shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
                    {meta.emoji}
                  </div>
                }
                contents={
                  <ListRow.Texts
                    type="2RowTypeA"
                    top={meta.type}
                    bottom={meta.description}
                  />
                }
                right={
                  isSelected ? (
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-[#3182f6] text-white">
                      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                        <path
                          d="M5 12.5l4 4 10-10"
                          stroke="currentColor"
                          strokeWidth="2.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  ) : meta.type === DEFAULT_TYPE ? (
                    <Badge size="small" color="blue" variant="weak">
                      추천
                    </Badge>
                  ) : (
                    <span className="h-6 w-6 rounded-full border-2 border-[#d1d6db]" />
                  )
                }
              />
            </div>
          );
        })}
      </div>

      <div className="mt-4">
        <NoticeBox tone="info">
          MVP 데모에서는 <b>침수</b> 피해가 기본으로 준비되어 있어요. 다른 유형도
          동일한 방식으로 정리돼요.
        </NoticeBox>
      </div>
    </StepScreen>
  );
}
