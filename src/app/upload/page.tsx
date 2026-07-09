"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Badge, Button, ListRow } from "@toss/tds-mobile";
import StepScreen from "@/components/StepScreen";
import NoticeBox from "@/components/NoticeBox";
import { filesToUploadedFiles } from "@/lib/files";
import { uploadFiles } from "@/lib/api";
import { loadOrCreateProject, patchProject, setFiles, uid } from "@/lib/storage";
import { FILE_CATEGORIES, type FileCategory, type UploadedFile } from "@/lib/types";

const SAMPLE_FILES: Omit<UploadedFile, "id" | "createdAt">[] = [
  { name: "거실_바닥_침수.jpg", size: 2_310_000, mimeType: "image/jpeg", fileType: "피해 사진", isImage: true },
  { name: "벽면_수분오염.jpg", size: 1_820_000, mimeType: "image/jpeg", fileType: "피해 사진", isImage: true },
  { name: "세탁기_침수.jpg", size: 2_040_000, mimeType: "image/jpeg", fileType: "피해 사진", isImage: true },
  { name: "청소비_영수증.jpg", size: 640_000, mimeType: "image/jpeg", fileType: "영수증", isImage: true },
  { name: "복구공사_견적서.pdf", size: 320_000, mimeType: "application/pdf", fileType: "수리 견적서", isImage: false },
  { name: "재난문자_캡처.png", size: 480_000, mimeType: "image/png", fileType: "재난문자 캡처", isImage: true },
];

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

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
    <StepScreen
      step={2}
      backTo="/damage-type"
      title="피해 자료를 올려주세요"
      subtitle="사진·영수증·수리 견적서·재난문자 캡처를 올려주세요. 파일은 브라우저에만 저장되고, AI가 자동으로 분류해요."
      footer={
        <Button
          key={files.length === 0 ? "cta-empty" : "cta-ready"}
          display="full"
          size="xlarge"
          loading={busy}
          disabled={files.length === 0}
          onClick={handleNext}
        >
          {files.length > 0 ? `${files.length}개 자료로 AI 분류 시작` : "자료를 먼저 올려주세요"}
        </Button>
      }
    >
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
        className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-9 text-center transition ${
          dragging ? "border-[#3182f6] bg-[#f4f8ff]" : "border-[#d1d6db] bg-[#f9fafb]"
        }`}
      >
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-[#3182f6] text-white">
          <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7">
            <path d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M5 15v3a2 2 0 002 2h10a2 2 0 002-2v-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </span>
        <p className="mt-3 font-bold text-[#333d4b]">파일을 끌어다 놓거나 선택하세요</p>
        <p className="mt-1 text-[13px] text-[#8b95a1]">이미지(JPG·PNG) · PDF · 여러 개 가능</p>
        <div className="mt-4 flex w-full flex-col gap-2">
          <Button display="full" size="medium" loading={busy} onClick={() => inputRef.current?.click()}>
            파일 선택
          </Button>
          <Button display="full" size="medium" color="dark" variant="weak" onClick={loadSamples}>
            샘플 자료 불러오기
          </Button>
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

      {/* 요약 배지 */}
      {files.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          <Badge size="small" color="blue" variant="fill">
            총 {files.length}개
          </Badge>
          {Object.entries(counts).map(([type, n]) => (
            <Badge key={type} size="small" color="elephant" variant="weak">
              {type} {n}
            </Badge>
          ))}
        </div>
      )}

      {/* 파일 목록 */}
      {files.length > 0 && (
        <div className="mt-3 flex flex-col gap-2">
          {files.map((file) => (
            <div key={file.id} className="rounded-2xl border border-[#e5e8eb] bg-white">
              <ListRow
                left={
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-[#f2f4f6]">
                    {file.isImage && file.previewUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={file.previewUrl} alt={file.name} className="h-full w-full object-cover" />
                    ) : (
                      <span className="grid h-full w-full place-items-center text-[20px]">📄</span>
                    )}
                  </div>
                }
                contents={<ListRow.Texts type="2RowTypeA" top={file.name} bottom={formatSize(file.size)} />}
                right={
                  <button
                    type="button"
                    aria-label="파일 삭제"
                    onClick={() => removeFile(file.id)}
                    className="grid h-8 w-8 place-items-center rounded-full text-[#8b95a1] active:bg-[#f2f4f6]"
                  >
                    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                      <path d="M6 7h12M9 7V5.5A1.5 1.5 0 0110.5 4h3A1.5 1.5 0 0115 5.5V7m-8 0l.7 11a2 2 0 002 1.9h4.6a2 2 0 002-1.9L17 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                }
              />
              <div className="px-4 pb-3">
                <select
                  value={file.fileType}
                  onChange={(e) => changeType(file.id, e.target.value as FileCategory)}
                  aria-label="파일 종류 선택"
                  className="w-full rounded-xl border border-[#e5e8eb] bg-[#f9fafb] px-3 py-2 text-[13px] font-medium text-[#4e5968] outline-none focus:border-[#3182f6]"
                >
                  {FILE_CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}

      {files.length === 0 && (
        <div className="mt-4">
          <NoticeBox tone="info">
            아직 올린 자료가 없어요. 실제 파일을 올리거나 <b>샘플 자료 불러오기</b>로
            데모를 진행할 수 있어요.
          </NoticeBox>
        </div>
      )}
    </StepScreen>
  );
}
