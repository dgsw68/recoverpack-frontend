"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@toss/tds-mobile";
import StepScreen from "@/components/StepScreen";
import NoticeBox from "@/components/NoticeBox";
import PackagePreview from "@/components/PackagePreview";
import { generatePackage } from "@/lib/api";
import { buildPackageEntries, packageFileName } from "@/lib/mock";
import { loadOrCreateProject, resetProject } from "@/lib/storage";
import type { ProjectState } from "@/lib/types";

type Status = "idle" | "generating" | "ready" | "downloaded";

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

export default function DownloadPage() {
  const router = useRouter();
  const [project, setProject] = useState<ProjectState | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [usedMock, setUsedMock] = useState(false);

  useEffect(() => {
    setProject(loadOrCreateProject());
  }, []);

  const entries = useMemo(() => buildPackageEntries(), []);
  const fileName = packageFileName(project?.damageType ?? null);

  const triggerMockDownload = () => {
    if (!project) return;
    const lines = [
      `RecoverPack 증거 패키지 매니페스트`,
      `================================`,
      `피해 유형: ${project.damageType ?? "침수"}`,
      `첨부 파일: ${project.files.length}개`,
      `AI 분류 항목: ${project.evidence.length}개`,
      `타임라인 이벤트: ${project.timeline.length}개`,
      `생성 일시: ${new Date().toLocaleString("ko-KR")}`,
      ``,
      `[패키지 구성]`,
      ...entries.map((e, i) => `${String(i + 1).padStart(2, "0")}. ${e.name} — ${e.description}`),
      ``,
      `※ 본 파일은 데모용 매니페스트입니다. 실제 서비스에서는 위 항목이 ZIP으로 생성됩니다.`,
      `※ AI는 보상 가능 여부를 판단하지 않으며, 자료 정리만 도와줍니다.`,
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName.replace(/\.zip$/, "_매니페스트.txt");
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleGenerate = async () => {
    if (!project) return;
    setStatus("generating");
    let mock = false;
    let downloadUrl: string | undefined;
    try {
      const res = await generatePackage(project.projectId);
      downloadUrl = res.downloadUrl;
    } catch {
      mock = true;
      await new Promise((r) => setTimeout(r, 1400));
    }
    setUsedMock(mock);
    setStatus("ready");
    if (downloadUrl) {
      window.open(downloadUrl, "_blank");
    } else {
      triggerMockDownload();
    }
    setStatus("downloaded");
  };

  const statusLabel =
    status === "generating"
      ? "생성 중…"
      : status === "downloaded"
        ? "완료"
        : status === "ready"
          ? "생성 완료"
          : "대기";

  return (
    <StepScreen
      step={5}
      backTo="/timeline"
      title="제출용 패키지가 준비됐어요"
      subtitle="아래 구성으로 하나의 패키지가 생성돼요. 보험사·주민센터·집주인·관리사무소에 그대로 제출할 수 있어요."
      footer={
        <>
          <Button
            key={status === "generating" ? "gen-busy" : "gen-idle"}
            display="full"
            size="xlarge"
            loading={status === "generating"}
            onClick={handleGenerate}
          >
            증거 패키지 다운로드
          </Button>
          <div className="mt-2">
            <Button
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
            </Button>
          </div>
        </>
      }
    >
      {/* 요약 */}
      <div className="mb-4 grid grid-cols-2 gap-2">
        <StatTile label="피해 유형" value={project?.damageType ?? "침수"} accent />
        <StatTile label="생성 상태" value={statusLabel} accent={status === "downloaded"} />
        <StatTile label="첨부 파일" value={`${project?.files.length ?? 0}개`} />
        <StatTile label="AI 분류 항목" value={`${project?.evidence.length ?? 0}개`} />
        <StatTile label="타임라인" value={`${project?.timeline.length ?? 0}개`} />
        <StatTile label="연동 모드" value={project?.backendConnected ? "백엔드" : "데모"} />
      </div>

      {/* 패키지 구성 */}
      <PackagePreview fileName={fileName} entries={entries} />

      {status === "downloaded" && (
        <div className="mt-4">
          <NoticeBox tone="success">
            패키지가 생성됐어요.{" "}
            {usedMock
              ? "데모 모드에서는 매니페스트(.txt)가 다운로드돼요."
              : "다운로드가 시작됐어요."}
          </NoticeBox>
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
