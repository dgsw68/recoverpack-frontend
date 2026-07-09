"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Badge, ListRow } from "@/components/mobile-ui";
import StepScreen from "@/components/StepScreen";
import NoticeBox from "@/components/NoticeBox";
import RequireAuth from "@/components/RequireAuth";
import PillButton from "@/components/PillButton";
import { filesToUploadedFiles } from "@/lib/files";
import { uploadFiles } from "@/api/uploads";
import { ApiError } from "@/api/client";
import { loadOrCreateProject, setFiles } from "@/lib/storage";
import { FILE_CATEGORIES, type FileCategory, type UploadedFile } from "@/lib/types";
import { FileTextIcon } from "@/components/icons";

const MAX_FILE_SIZE = 25 * 1024 * 1024;
const MAX_BATCH = 20;

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function categoryLabel(value: FileCategory): string {
  return FILE_CATEGORIES.find((c) => c.value === value)?.label ?? value;
}

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

function UploadPage() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [files, setLocalFiles] = useState<UploadedFile[]>([]);
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const project = loadOrCreateProject();
    setProjectId(project.projectId);
    setLocalFiles(project.files);
  }, []);

  const persist = (next: UploadedFile[]) => {
    setLocalFiles(next);
    setFiles(next);
  };

  const addFiles = async (fileList: FileList | File[]) => {
    setError(null);
    const arr = Array.from(fileList);
    const oversized = arr.filter((f) => f.size > MAX_FILE_SIZE);
    if (oversized.length > 0) {
      setError(`25MB를 초과하는 파일은 올릴 수 없어요: ${oversized.map((f) => f.name).join(", ")}`);
    }
    const valid = arr.filter((f) => f.size <= MAX_FILE_SIZE);
    if (valid.length === 0) return;
    setBusy(true);
    try {
      const uploaded = await filesToUploadedFiles(valid);
      persist([...files, ...uploaded]);
    } finally {
      setBusy(false);
    }
  };

  const changeType = (id: string, type: FileCategory) => {
    persist(files.map((f) => (f.id === id ? { ...f, fileType: type } : f)));
  };

  const removeFile = (id: string) => {
    persist(files.filter((f) => f.id !== id));
  };

  const handleNext = async () => {
    if (!projectId) {
      setError("프로젝트 정보가 없어요. 이전 단계로 돌아가 주세요.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const groups = FILE_CATEGORIES.map((c) => c.value).reduce<
        Record<FileCategory, UploadedFile[]>
      >(
        (acc, type) => {
          acc[type] = files.filter((f) => f.fileType === type);
          return acc;
        },
        { image: [], receipt: [], estimate: [], disaster_alert: [] },
      );

      const next = [...files];
      for (const [fileType, group] of Object.entries(groups) as [FileCategory, UploadedFile[]][]) {
        if (group.length === 0) continue;
        for (const batch of chunk(group, MAX_BATCH)) {
          const rawFiles = batch.map((f) => f.file).filter((f): f is File => !!f);
          if (rawFiles.length === 0) continue;
          const res = await uploadFiles(projectId, rawFiles, fileType);
          res.files.forEach((remote, i) => {
            const target = batch[i];
            const idx = next.findIndex((f) => f.id === target.id);
            if (idx >= 0) next[idx] = { ...next[idx], remoteId: remote.id };
          });
        }
      }
      persist(next);
      router.push("/analysis");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "파일 업로드에 실패했어요.");
    } finally {
      setBusy(false);
    }
  };

  const counts = files.reduce<Record<string, number>>((acc, f) => {
    acc[f.fileType] = (acc[f.fileType] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <StepScreen
      step={3}
      backTo="/reporter"
      title="피해 자료를 올려주세요"
      subtitle="사진·영수증·수리 견적서·재난문자 캡처를 올려주세요. AI가 자동으로 분류해요."
      footer={
        <>
          {error && (
            <div className="mb-2">
              <NoticeBox tone="warning">{error}</NoticeBox>
            </div>
          )}
          <PillButton
            key={files.length === 0 ? "cta-empty" : "cta-ready"}
            display="full"
            size="xlarge"
            loading={busy}
            disabled={files.length === 0}
            onClick={handleNext}
          >
            {files.length > 0 ? `${files.length}개 자료로 AI 분류 시작` : "자료를 먼저 올려주세요"}
          </PillButton>
        </>
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
        <p className="mt-1 text-[13px] text-[#8b95a1]">이미지(JPG·PNG) · PDF · 파일당 25MB 이하 · 최대 20개씩</p>
        <div className="mt-4 flex w-full flex-col gap-2">
          <PillButton display="full" size="medium" loading={busy} onClick={() => inputRef.current?.click()}>
            파일 선택
          </PillButton>
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
              {categoryLabel(type as FileCategory)} {n}
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
                      <span className="grid h-full w-full place-items-center text-[#b0b8c1]">
                        <FileTextIcon className="h-5 w-5" />
                      </span>
                    )}
                  </div>
                }
                contents={<ListRow.Texts type="2RowTypeA" top={file.name} bottom={formatSize(file.size)} />}
                right={
                  <button
                    type="button"
                    aria-label="파일 삭제"
                    onClick={() => removeFile(file.id)}
                    className="grid h-11 w-11 place-items-center rounded-full text-[#8b95a1] active:bg-[#f2f4f6]"
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
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}

      {files.length === 0 && !error && (
        <div className="mt-4">
          <NoticeBox tone="info">아직 올린 자료가 없어요. 파일을 올려 주세요.</NoticeBox>
        </div>
      )}
    </StepScreen>
  );
}

export default function UploadPageWrapper() {
  return (
    <RequireAuth>
      <UploadPage />
    </RequireAuth>
  );
}
