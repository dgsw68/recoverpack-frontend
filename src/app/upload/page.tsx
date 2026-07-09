"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ProgressSteps from "@/components/ProgressSteps";
import StepHeader from "@/components/StepHeader";
import NoticeBox from "@/components/NoticeBox";
import FileUploadCard from "@/components/FileUploadCard";
import { filesToUploadedFiles } from "@/lib/files";
import { uploadFiles } from "@/lib/api";
import {
  loadOrCreateProject,
  patchProject,
  setFiles,
  uid,
} from "@/lib/storage";
import type { FileCategory, UploadedFile } from "@/lib/types";

const SAMPLE_FILES: Omit<UploadedFile, "id" | "createdAt">[] = [
  { name: "거실_바닥_침수.jpg", size: 2_310_000, mimeType: "image/jpeg", fileType: "피해 사진", isImage: true },
  { name: "벽면_수분오염.jpg", size: 1_820_000, mimeType: "image/jpeg", fileType: "피해 사진", isImage: true },
  { name: "세탁기_침수.jpg", size: 2_040_000, mimeType: "image/jpeg", fileType: "피해 사진", isImage: true },
  { name: "청소비_영수증.jpg", size: 640_000, mimeType: "image/jpeg", fileType: "영수증", isImage: true },
  { name: "복구공사_견적서.pdf", size: 320_000, mimeType: "application/pdf", fileType: "수리 견적서", isImage: false },
  { name: "재난문자_캡처.png", size: 480_000, mimeType: "image/png", fileType: "재난문자 캡처", isImage: true },
];

export default function UploadPage() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setLocalFiles] = useState<UploadedFile[]>([]);
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const project = loadOrCreateProject();
    setLocalFiles(project.files);
  }, []);

  const persist = (next: UploadedFile[]) => {
    setLocalFiles(next);
    setFiles(next);
  };

  const addFiles = async (fileList: FileList | File[]) => {
    setBusy(true);
    try {
      const uploaded = await filesToUploadedFiles(fileList);
      persist([...files, ...uploaded]);
    } finally {
      setBusy(false);
    }
  };

  const loadSamples = () => {
    const samples: UploadedFile[] = SAMPLE_FILES.map((s) => ({
      ...s,
      id: uid("file"),
      createdAt: new Date().toISOString(),
    }));
    persist([...files, ...samples]);
  };

  const changeType = (id: string, type: FileCategory) => {
    persist(files.map((f) => (f.id === id ? { ...f, fileType: type } : f)));
  };

  const removeFile = (id: string) => {
    persist(files.filter((f) => f.id !== id));
  };

  const handleNext = async () => {
    setBusy(true);
    const project = loadOrCreateProject();
    try {
      await uploadFiles(project.projectId, files);
      patchProject({ backendConnected: true });
    } catch {
      patchProject({ backendConnected: false });
    }
    router.push("/analysis");
  };

  const counts = files.reduce<Record<string, number>>((acc, f) => {
    acc[f.fileType] = (acc[f.fileType] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      <ProgressSteps current="upload" />
      <StepHeader
        eyebrow="STEP 2"
        title="피해 자료를 업로드하세요"
        description="피해 사진, 영수증, 수리 견적서, 재난문자 캡처를 올려주세요. 파일은 브라우저에만 저장되며, AI가 자동으로 분류합니다."
      />

      {/* 드롭존 */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
        }}
        className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-12 text-center transition ${
          dragging
            ? "border-brand-500 bg-brand-50"
            : "border-slate-300 bg-white/60 hover:border-brand-300 hover:bg-white"
        }`}
      >
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-aqua-500 text-white shadow-lg shadow-brand-500/30">
          <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7">
            <path d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M5 15v3a2 2 0 002 2h10a2 2 0 002-2v-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </span>
        <p className="mt-4 font-semibold text-slate-800">
          파일을 끌어다 놓거나 클릭해서 업로드
        </p>
        <p className="mt-1 text-sm text-slate-400">
          이미지(JPG, PNG) · PDF · 여러 개 선택 가능
        </p>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="btn-primary px-6"
            disabled={busy}
          >
            {busy ? "처리 중…" : "파일 선택"}
          </button>
          <button type="button" onClick={loadSamples} className="btn-secondary px-6">
            샘플 자료 불러오기
          </button>
        </div>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*,application/pdf"
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) addFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {/* 요약 칩 */}
      {files.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="chip bg-slate-900 text-white">
            총 {files.length}개
          </span>
          {Object.entries(counts).map(([type, n]) => (
            <span key={type} className="chip bg-slate-100 text-slate-600">
              {type} {n}
            </span>
          ))}
        </div>
      )}

      {/* 파일 목록 */}
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {files.map((file) => (
          <FileUploadCard
            key={file.id}
            file={file}
            onChangeType={changeType}
            onRemove={removeFile}
          />
        ))}
      </div>

      {files.length === 0 && (
        <div className="mt-4">
          <NoticeBox tone="info">
            아직 업로드된 자료가 없습니다. 실제 파일을 올리거나{" "}
            <b>샘플 자료 불러오기</b>로 데모를 진행할 수 있습니다.
          </NoticeBox>
        </div>
      )}

      <div className="mt-8 flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.push("/damage-type")}
          className="btn-ghost"
        >
          이전
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={files.length === 0 || busy}
          className="btn-primary px-7"
          title={files.length === 0 ? "자료를 먼저 업로드하세요" : undefined}
        >
          AI 분류 시작
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
            <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
