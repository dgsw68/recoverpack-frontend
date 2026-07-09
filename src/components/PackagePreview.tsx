import type { PackageEntry } from "@/lib/types";

const KIND_META: Record<
  PackageEntry["kind"],
  { label: string; className: string }
> = {
  pdf: { label: "PDF", className: "bg-rose-50 text-rose-600" },
  xlsx: { label: "XLSX", className: "bg-emerald-50 text-emerald-600" },
  csv: { label: "CSV", className: "bg-teal-50 text-teal-600" },
  txt: { label: "TXT", className: "bg-slate-100 text-slate-500" },
  folder: { label: "폴더", className: "bg-amber-50 text-amber-600" },
};

function EntryIcon({ kind }: { kind: PackageEntry["kind"] }) {
  if (kind === "folder") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-amber-500">
        <path
          d="M3.5 7.5A1.5 1.5 0 015 6h4l2 2h8a1.5 1.5 0 011.5 1.5v7A1.5 1.5 0 0119 18H5a1.5 1.5 0 01-1.5-1.5v-9z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-slate-400">
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

export default function PackagePreview({
  fileName,
  entries,
}: {
  fileName: string;
  entries: PackageEntry[];
}) {
  return (
    <div className="card overflow-hidden">
      {/* zip 헤더 */}
      <div className="flex items-center gap-3 border-b border-slate-200 bg-gradient-to-r from-brand-50 to-aqua-50 px-4 py-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-white shadow-sm">
          <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 text-brand-600">
            <path
              d="M6 3h9l4 4v13a1 1 0 01-1 1H6a1 1 0 01-1-1V4a1 1 0 011-1z"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            <path d="M11 4v3h2M11 8h2M11 11h2M11 14h2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </span>
        <div className="min-w-0">
          <p className="truncate font-bold text-slate-900">{fileName}</p>
          <p className="text-xs text-slate-500">{entries.length}개 항목 · 제출용 구성</p>
        </div>
      </div>

      {/* 항목 목록 */}
      <ul className="divide-y divide-slate-100">
        {entries.map((entry) => {
          const meta = KIND_META[entry.kind];
          return (
            <li
              key={entry.name}
              className="flex items-center gap-3 px-4 py-3 transition hover:bg-slate-50"
            >
              <EntryIcon kind={entry.kind} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-mono text-sm text-slate-800">
                  {entry.name}
                </p>
                <p className="truncate text-xs text-slate-400">
                  {entry.description}
                </p>
              </div>
              <span
                className={`chip shrink-0 font-semibold ${meta.className}`}
              >
                {meta.label}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
