"use client";

import { FILE_CATEGORIES, type FileCategory, type UploadedFile } from "@/lib/types";

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function FileGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8 text-slate-300">
      <path
        d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8l-5-5z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M14 3v5h5" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

export default function FileUploadCard({
  file,
  onChangeType,
  onRemove,
}: {
  file: UploadedFile;
  onChangeType: (id: string, type: FileCategory) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="group card flex items-center gap-3 p-3 transition hover:shadow-card-hover">
      {/* 미리보기 */}
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-100 ring-1 ring-slate-200">
        {file.isImage && file.previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={file.previewUrl}
            alt={file.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="grid h-full w-full place-items-center">
            <FileGlyph />
          </div>
        )}
      </div>

      {/* 정보 */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-slate-800" title={file.name}>
          {file.name}
        </p>
        <p className="mt-0.5 text-xs text-slate-400">{formatSize(file.size)}</p>
        <div className="mt-2">
          <select
            value={file.fileType}
            onChange={(e) => onChangeType(file.id, e.target.value as FileCategory)}
            className="w-full max-w-[12rem] rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-700 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
            aria-label="파일 종류 선택"
          >
            {FILE_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 삭제 */}
      <button
        type="button"
        onClick={() => onRemove(file.id)}
        aria-label="파일 삭제"
        className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-slate-400 transition hover:bg-rose-50 hover:text-rose-500"
      >
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
          <path
            d="M6 7h12M9 7V5.5A1.5 1.5 0 0110.5 4h3A1.5 1.5 0 0115 5.5V7m-8 0l.7 11a2 2 0 002 1.9h4.6a2 2 0 002-1.9L17 7"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
