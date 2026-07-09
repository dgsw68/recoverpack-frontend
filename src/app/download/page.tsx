"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import ProgressSteps from "@/components/ProgressSteps";
import StepHeader from "@/components/StepHeader";
import NoticeBox from "@/components/NoticeBox";
import PackagePreview from "@/components/PackagePreview";
import { generatePackage } from "@/lib/api";
import {
  buildPackageEntries,
  packageFileName,
} from "@/lib/mock";
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
      className={`rounded-xl border p-4 ${
        accent
          ? "border-brand-200 bg-gradient-to-br from-brand-50 to-aqua-50"
          : "border-slate-200 bg-white"
      }`}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-xl font-bold text-slate-900">{value}</p>
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

    // 실제 다운로드: 백엔드 URL이 있으면 열고, 없으면 클라이언트 매니페스트 생성
    if (downloadUrl) {
      window.open(downloadUrl, "_blank");
    } else {
      triggerMockDownload();
    }
    setStatus("downloaded");
  };

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
    const blob = new Blob([lines.join("\n")], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName.replace(/\.zip$/, "_매니페스트.txt");
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const statusLabel =
    status === "generating"
      ? "생성 중…"
      : status === "downloaded"
        ? "다운로드 완료"
        : status === "ready"
          ? "생성 완료"
          : "생성 대기";

  return (
    <div>
      <ProgressSteps current="download" />
      <StepHeader
        eyebrow="STEP 5"
        title="제출용 증거 패키지가 준비되었습니다"
        description="아래 구성으로 하나의 패키지가 생성됩니다. 보험사·주민센터·집주인·관리사무소에 그대로 제출할 수 있습니다."
      />

      <div className="grid gap-6 lg:grid-cols-5">
        {/* 패키지 구성 */}
        <div className="lg:col-span-3">
          <PackagePreview fileName={fileName} entries={entries} />
        </div>

        {/* 요약 + 다운로드 */}
        <div className="lg:col-span-2">
          <div className="card p-5">
            <h2 className="text-base font-bold text-slate-900">패키지 요약</h2>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <StatTile
                label="피해 유형"
                value={project?.damageType ?? "침수"}
                accent
              />
              <StatTile
                label="생성 상태"
                value={statusLabel}
                accent={status === "downloaded"}
              />
              <StatTile label="첨부 파일" value={`${project?.files.length ?? 0}개`} />
              <StatTile
                label="AI 분류 항목"
                value={`${project?.evidence.length ?? 0}개`}
              />
              <StatTile
                label="타임라인 이벤트"
                value={`${project?.timeline.length ?? 0}개`}
              />
              <StatTile
                label="연동 모드"
                value={project?.backendConnected ? "백엔드" : "데모"}
              />
            </div>

            <button
              type="button"
              onClick={handleGenerate}
              disabled={status === "generating"}
              className="btn-primary mt-5 w-full py-3.5 text-base"
            >
              {status === "generating" ? (
                "패키지 생성 중…"
              ) : (
                <>
                  <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                    <path d="M12 3v12m0 0l-4-4m4 4l4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M5 17v2a2 2 0 002 2h10a2 2 0 002-2v-2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                  증거 패키지 다운로드
                </>
              )}
            </button>

            {status === "downloaded" && (
              <div className="mt-4">
                <NoticeBox tone="success">
                  패키지가 생성되었습니다.{" "}
                  {usedMock
                    ? "데모 모드에서는 매니페스트(.txt)가 다운로드됩니다."
                    : "다운로드가 시작되었습니다."}
                </NoticeBox>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              resetProject();
              router.push("/");
            }}
            className="btn-ghost mt-3 w-full"
          >
            새 패키지 만들기 (초기화)
          </button>
        </div>
      </div>

      <div className="mt-6">
        <NoticeBox tone="warning">
          본 패키지는 자료를 <b>정리·요약</b>한 결과물입니다. AI는 보상 가능 여부를
          판단하지 않으며, 제출 전 내용을 반드시 확인해 주세요.
        </NoticeBox>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.push("/timeline")}
          className="btn-ghost"
        >
          이전
        </button>
      </div>
    </div>
  );
}
