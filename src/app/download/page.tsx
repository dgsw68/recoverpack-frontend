"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import StepScreen from "@/components/StepScreen";
import NoticeBox from "@/components/NoticeBox";
import RequireAuth from "@/components/RequireAuth";
import PackagePreview from "@/components/PackagePreview";
import PillButton from "@/components/PillButton";
import { generatePackage, downloadPackage } from "@/api/packages";
import { ApiError } from "@/api/client";
import { buildPackageEntries, packageFileName } from "@/lib/mock";
import { loadOrCreateProject, resetProject } from "@/lib/storage";
import type { ProjectState } from "@/lib/types";

type Status = "idle" | "generating" | "downloaded";

function StatTile({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl p-3.5 ${
        accent ? "bg-[#f4f8ff]" : "bg-[#f9fafb]"
      }`}
    >
      <p className="text-[12px] font-semibold text-[#8b95a1]">{label}</p>
      <p className="mt-0.5 text-[18px] font-bold text-[#191f28]">{value}</p>
    </div>
  );
}

function DownloadPage() {
  const router = useRouter();
  const [project, setProject] = useState<ProjectState | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setProject(loadOrCreateProject());
  }, []);

  const entries = useMemo(() => buildPackageEntries(), []);
  const fileName = packageFileName(project?.damageType ?? null);

  const handleGenerate = async () => {
    if (!project?.projectId) {
      setError("프로젝트 정보가 없어요. 이전 단계로 돌아가 주세요.");
      return;
    }
    setStatus("generating");
    setError(null);
    try {
      await generatePackage(project.projectId);
      const blob = await downloadPackage(project.projectId);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setStatus("downloaded");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "패키지 생성에 실패했어요.");
      setStatus("idle");
    }
  };

  const statusLabel =
    status === "generating" ? "생성 중…" : status === "downloaded" ? "완료" : "대기";

  return (
    <StepScreen
      step={6}
      backTo="/timeline"
      title="제출용 패키지가 준비됐어요"
      subtitle="아래 구성으로 하나의 패키지가 생성돼요. 보험사·주민센터·집주인·관리사무소에 그대로 제출할 수 있어요."
      footer={
        <>
          {error && (
            <div className="mb-2">
              <NoticeBox tone="warning">{error}</NoticeBox>
            </div>
          )}
          <PillButton
            key={status === "generating" ? "gen-busy" : "gen-idle"}
            display="full"
            size="xlarge"
            loading={status === "generating"}
            onClick={handleGenerate}
          >
            증거 패키지 다운로드
          </PillButton>
          <div className="mt-2">
            <PillButton
              display="full"
              size="large"
              color="dark"
              variant="weak"
              onClick={() => {
                resetProject();
                router.push("/");
              }}
            >
              새 패키지 만들기 (초기화)
            </PillButton>
          </div>
        </>
      }
    >
      {/* 요약 */}
      <div className="mb-4 grid grid-cols-2 gap-2">
        <StatTile label="피해 유형" value={fileName.replace("피해_증빙패키지.zip", "")} accent />
        <StatTile label="생성 상태" value={statusLabel} accent={status === "downloaded"} />
        <StatTile label="첨부 파일" value={`${project?.files.length ?? 0}개`} />
        <StatTile label="AI 분류 항목" value={`${project?.evidence.length ?? 0}개`} />
        <StatTile label="타임라인" value={`${project?.timeline.length ?? 0}개`} />
      </div>

      {/* 패키지 구성 */}
      <PackagePreview fileName={fileName} entries={entries} />

      {status === "downloaded" && (
        <div className="mt-4">
          <NoticeBox tone="success">패키지가 생성됐고 다운로드가 시작됐어요.</NoticeBox>
        </div>
      )}

      <div className="mt-4">
        <NoticeBox tone="warning">
          본 패키지는 자료를 <b>정리·요약</b>한 결과물이에요. AI는 보상 가능 여부를
          판단하지 않으며, 제출 전 내용을 반드시 확인해 주세요.
        </NoticeBox>
      </div>
    </StepScreen>
  );
}

export default function DownloadPageWrapper() {
  return (
    <RequireAuth>
      <DownloadPage />
    </RequireAuth>
  );
}
