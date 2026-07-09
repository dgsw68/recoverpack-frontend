"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Badge, ListRow } from "@/components/mobile-ui";
import StepScreen from "@/components/StepScreen";
import NoticeBox from "@/components/NoticeBox";
import RequireAuth from "@/components/RequireAuth";
import PillButton from "@/components/PillButton";
import { DAMAGE_TYPES } from "@/lib/damage";
import { createProject } from "@/api/projects";
import { ApiError } from "@/api/client";
import { loadOrCreateProject, patchProject, setDamageType } from "@/lib/storage";
import type { DamageType } from "@/lib/types";
import { FloodIcon, FireIcon, SnowIcon, TyphoonIcon } from "@/components/icons";

const DEFAULT_TYPE: DamageType = "flood";

const TYPE_ICON: Record<DamageType, (props: { className?: string }) => JSX.Element> = {
  flood: FloodIcon,
  fire: FireIcon,
  heavy_snow: SnowIcon,
  typhoon: TyphoonIcon,
};

function DamageTypePage() {
  const router = useRouter();
  const [selected, setSelected] = useState<DamageType>(DEFAULT_TYPE);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [occurredAt, setOccurredAt] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const project = loadOrCreateProject();
    if (project.damageType) setSelected(project.damageType);
    setTitle(project.title);
    setLocation(project.location);
    setOccurredAt(project.occurredAt);
  }, []);

  const handleNext = async () => {
    setSubmitting(true);
    setError(null);
    const label = DAMAGE_TYPES.find((d) => d.type === selected)?.label ?? "침수";
    const finalTitle = title.trim() || `${label} 피해`;

    if (!location.trim()) {
      setError("피해 위치를 입력해 주세요.");
      setSubmitting(false);
      return;
    }
    if (!occurredAt) {
      setError("피해 발생 시각을 입력해 주세요.");
      setSubmitting(false);
      return;
    }
    // datetime-local -> "YYYY-MM-DD HH:mm"
    const formattedOccurredAt = occurredAt.replace("T", " ");
    try {
      const res = await createProject({
        damageType: selected,
        title: finalTitle,
        location,
        occurredAt: formattedOccurredAt,
      });
      const projectId = "projectId" in res ? res.projectId : res.id;
      patchProject({
        projectId,
        damageType: selected,
        title: finalTitle,
        location,
        occurredAt: formattedOccurredAt,
        // createProject always makes a brand-new backend project, so any
        // evidence/timeline/files cached from a previous run no longer
        // belong to this projectId and must not be reused.
        files: [],
        evidence: [],
        timeline: [],
        ...(!("projectId" in res)
          ? {
              description: res.description,
              reporterName: res.reporterName,
              reporterPhone: res.reporterPhone,
              reporterAddress: res.reporterAddress,
              residenceType: res.residenceType,
              indirectSupport: res.indirectSupport,
            }
          : {}),
      });
      router.push("/reporter");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "프로젝트 생성에 실패했어요.");
      setDamageType(selected);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <StepScreen
      step={1}
      backTo="/"
      title="어떤 피해를 겪으셨나요?"
      subtitle="피해 유형을 선택하면 그에 맞는 분류 기준과 타임라인 템플릿을 준비해 드려요."
      footer={
        <>
          {error && (
            <div className="mb-2">
              <NoticeBox tone="warning">{error}</NoticeBox>
            </div>
          )}
          <PillButton display="full" size="xlarge" loading={submitting} onClick={handleNext}>
            {DAMAGE_TYPES.find((d) => d.type === selected)?.label} 피해로 시작하기
          </PillButton>
        </>
      }
    >
      <div className="flex flex-col gap-2.5">
        {DAMAGE_TYPES.map((meta) => {
          const isSelected = selected === meta.type;
          const Icon = TYPE_ICON[meta.type];
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
                  <div
                    className={`grid h-11 w-11 place-items-center rounded-2xl ${
                      isSelected ? "bg-[#3182f6] text-white" : "bg-[#f2f4f6] text-[#4e5968]"
                    }`}
                  >
                    <Icon className="h-[22px] w-[22px]" />
                  </div>
                }
                contents={
                  <ListRow.Texts
                    type="2RowTypeA"
                    top={meta.label}
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

      <div className="mt-4 flex flex-col gap-3">
        <div>
          <label className="mb-1 block text-[12px] font-bold text-[#8b95a1]">
            제목 (선택)
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="예: 우리 집 침수 피해"
            className="w-full rounded-xl border border-[#e5e8eb] bg-[#f9fafb] px-3.5 py-3 text-[15px] outline-none focus:border-[#3182f6]"
          />
        </div>
        <div>
          <label className="mb-1 block text-[12px] font-bold text-[#8b95a1]">
            피해 위치
          </label>
          <input
            type="text"
            required
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="예: 서울특별시 강남구"
            className="w-full rounded-xl border border-[#e5e8eb] bg-[#f9fafb] px-3.5 py-3 text-[15px] outline-none focus:border-[#3182f6]"
          />
        </div>
        <div>
          <label className="mb-1 block text-[12px] font-bold text-[#8b95a1]">
            피해 발생 시각
          </label>
          <input
            type="datetime-local"
            required
            value={occurredAt}
            onChange={(e) => setOccurredAt(e.target.value)}
            className="w-full rounded-xl border border-[#e5e8eb] bg-[#f9fafb] px-3.5 py-3 text-[15px] outline-none focus:border-[#3182f6]"
          />
        </div>
      </div>

      <div className="mt-4">
        <NoticeBox tone="info">
          <b>침수</b> 피해가 기본으로 준비되어 있어요. 다른 유형도 동일한 방식으로
          정리돼요.
        </NoticeBox>
      </div>
    </StepScreen>
  );
}

export default function DamageTypePageWrapper() {
  return (
    <RequireAuth>
      <DamageTypePage />
    </RequireAuth>
  );
}
