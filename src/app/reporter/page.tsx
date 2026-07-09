"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StepScreen from "@/components/StepScreen";
import NoticeBox from "@/components/NoticeBox";
import RequireAuth from "@/components/RequireAuth";
import PillButton from "@/components/PillButton";
import { updateProjectReporter } from "@/api/projects";
import { ApiError } from "@/api/client";
import { loadOrCreateProject, patchProject } from "@/lib/storage";
import {
  DEFAULT_INDIRECT_SUPPORT,
  type IndirectSupport,
  type ProjectState,
} from "@/lib/types";

const RESIDENCE_TYPES = [
  "소유자(실거주)",
  "소유자(미거주)",
  "세입자",
  "공공임대 세입자",
];

const SUPPORT_OPTIONS: {
  key: keyof IndirectSupport;
  label: string;
  description: string;
}[] = [
  {
    key: "gasUser",
    label: "가스 사용자",
    description: "가스요금 감면·납부유예 확인 대상",
  },
  {
    key: "vehicleOwner",
    label: "차량 소유자",
    description: "자동차 관련 지원 확인 대상",
  },
  {
    key: "publicHousingRequest",
    label: "공공임대주택 요청",
    description: "임시 거처·공공임대 연계 필요",
  },
  {
    key: "familyCrisisSupport",
    label: "긴급복지 생계지원",
    description: "생계 곤란 지원 확인 필요",
  },
  {
    key: "healthInsuranceArrears",
    label: "건강보험료 체납",
    description: "체납 유예·조정 상담 필요",
  },
  {
    key: "fineDeferralRequest",
    label: "과태료 징수유예",
    description: "과태료 납부 유예 요청 필요",
  },
  {
    key: "disasterLossDeduction",
    label: "재해손실 공제",
    description: "세금 공제 확인 대상",
  },
  {
    key: "windFloodInsuranceOptIn",
    label: "풍수해보험 가입 희망",
    description: "보험 가입 안내 필요",
  },
];

function mergeSupport(value?: Partial<IndirectSupport>): IndirectSupport {
  return { ...DEFAULT_INDIRECT_SUPPORT, ...value };
}

function ReporterPage() {
  const router = useRouter();
  const [projectId, setProjectId] = useState<string | null>(null);
  const [reporterName, setReporterName] = useState("");
  const [reporterPhone, setReporterPhone] = useState("");
  const [reporterAddress, setReporterAddress] = useState("");
  const [residenceType, setResidenceType] = useState(RESIDENCE_TYPES[0]);
  const [indirectSupport, setIndirectSupport] = useState<IndirectSupport>({
    ...DEFAULT_INDIRECT_SUPPORT,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const project = loadOrCreateProject();
    setProjectId(project.projectId);
    setReporterName(project.reporterName);
    setReporterPhone(project.reporterPhone);
    setReporterAddress(project.reporterAddress);
    setResidenceType(project.residenceType || RESIDENCE_TYPES[0]);
    setIndirectSupport(mergeSupport(project.indirectSupport));
  }, []);

  const toggleSupport = (key: keyof IndirectSupport) => {
    setIndirectSupport((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const persistLocal = (patch?: Partial<ProjectState>) => {
    patchProject({
      reporterName,
      reporterPhone,
      reporterAddress,
      residenceType,
      indirectSupport,
      ...patch,
    });
  };

  const handleSubmit = async () => {
    if (!projectId) {
      setError("프로젝트 정보가 없어요. 이전 단계로 돌아가 주세요.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const updated = await updateProjectReporter(projectId, {
        reporterName,
        reporterPhone,
        reporterAddress,
        residenceType,
        indirectSupport,
      });
      persistLocal({
        projectId: updated.id,
        damageType: updated.damageType,
        title: updated.title,
        location: updated.location,
        occurredAt: updated.occurredAt,
        description: updated.description,
        reporterName: updated.reporterName,
        reporterPhone: updated.reporterPhone,
        reporterAddress: updated.reporterAddress,
        residenceType: updated.residenceType,
        indirectSupport: mergeSupport(updated.indirectSupport),
      });
      router.push("/upload");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "신고인 정보 저장에 실패했어요.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSkip = () => {
    persistLocal();
    router.push("/upload");
  };

  return (
    <StepScreen
      step={2}
      backTo="/damage-type"
      title="신고인 정보를 입력하세요"
      subtitle="피해신고서와 접수용 요약표에 표시할 기본 정보예요. 주민등록번호와 계좌번호는 입력하지 않아요."
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
            onClick={handleSubmit}
          >
            신고인 정보 저장
          </PillButton>
          <div className="mt-2">
            <PillButton
              display="full"
              size="large"
              color="dark"
              variant="weak"
              disabled={submitting}
              onClick={handleSkip}
            >
              나중에 입력하기
            </PillButton>
          </div>
        </>
      }
    >
      <div className="flex flex-col gap-3">
        <div>
          <label className="mb-1 block text-[12px] font-bold text-[#8b95a1]">
            이름
          </label>
          <input
            type="text"
            value={reporterName}
            onChange={(e) => setReporterName(e.target.value)}
            placeholder="예: 홍길동"
            className="w-full rounded-xl border border-[#e5e8eb] bg-[#f9fafb] px-3.5 py-3 text-[15px] outline-none focus:border-[#3182f6]"
          />
        </div>
        <div>
          <label className="mb-1 block text-[12px] font-bold text-[#8b95a1]">
            연락처
          </label>
          <input
            type="tel"
            value={reporterPhone}
            onChange={(e) => setReporterPhone(e.target.value)}
            placeholder="예: 010-1234-5678"
            className="w-full rounded-xl border border-[#e5e8eb] bg-[#f9fafb] px-3.5 py-3 text-[15px] outline-none focus:border-[#3182f6]"
          />
        </div>
        <div>
          <label className="mb-1 block text-[12px] font-bold text-[#8b95a1]">
            주소
          </label>
          <input
            type="text"
            value={reporterAddress}
            onChange={(e) => setReporterAddress(e.target.value)}
            placeholder="예: 서울특별시 강남구 테헤란로 123"
            className="w-full rounded-xl border border-[#e5e8eb] bg-[#f9fafb] px-3.5 py-3 text-[15px] outline-none focus:border-[#3182f6]"
          />
        </div>
        <div>
          <label className="mb-1 block text-[12px] font-bold text-[#8b95a1]">
            주거형태
          </label>
          <select
            value={residenceType}
            onChange={(e) => setResidenceType(e.target.value)}
            className="w-full rounded-xl border border-[#e5e8eb] bg-[#f9fafb] px-3.5 py-3 text-[15px] font-medium text-[#333d4b] outline-none focus:border-[#3182f6]"
          >
            {RESIDENCE_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-5">
        <p className="mb-2 text-[13px] font-bold text-[#4e5968]">간접지원 확인 항목</p>
        <div className="grid gap-2">
          {SUPPORT_OPTIONS.map((option) => (
            <label
              key={option.key}
              className={`flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3 transition-colors ${
                indirectSupport[option.key]
                  ? "border-[#3182f6] bg-[#f4f8ff]"
                  : "border-[#e5e8eb] bg-white"
              }`}
            >
              <input
                type="checkbox"
                checked={indirectSupport[option.key]}
                onChange={() => toggleSupport(option.key)}
                className="mt-1 h-5 w-5 accent-[#3182f6]"
              />
              <span>
                <span className="block text-[14px] font-bold text-[#333d4b]">
                  {option.label}
                </span>
                <span className="block text-[12px] leading-relaxed text-[#8b95a1]">
                  {option.description}
                </span>
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <NoticeBox tone="info">
          간접지원 항목은 선택한 전체 값이 한 번에 저장돼요. 체크 하나만 바꿔도 8개
          항목 전체를 서버에 보냅니다.
        </NoticeBox>
      </div>
    </StepScreen>
  );
}

export default function ReporterPageWrapper() {
  return (
    <RequireAuth>
      <ReporterPage />
    </RequireAuth>
  );
}
