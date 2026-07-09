import { Badge, ListRow } from "@toss/tds-mobile";
import type { PackageEntry } from "@/lib/types";

type BadgeColor = "red" | "green" | "teal" | "elephant" | "yellow";

const KIND_META: Record<
  PackageEntry["kind"],
  { label: string; color: BadgeColor; emoji: string }
> = {
  pdf: { label: "PDF", color: "red", emoji: "📄" },
  xlsx: { label: "XLSX", color: "green", emoji: "📊" },
  csv: { label: "CSV", color: "teal", emoji: "🧾" },
  txt: { label: "TXT", color: "elephant", emoji: "📃" },
  folder: { label: "폴더", color: "yellow", emoji: "📁" },
};

export default function PackagePreview({
  fileName,
  entries,
}: {
  fileName: string;
  entries: PackageEntry[];
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#e5e8eb] bg-white">
      {/* zip 헤더 */}
      <div className="flex items-center gap-3 border-b border-[#f2f4f6] bg-[#f4f8ff] px-4 py-3.5">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-white text-[20px] shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
          📦
        </span>
        <div className="min-w-0">
          <p className="truncate text-[15px] font-bold text-[#191f28]">{fileName}</p>
          <p className="text-[12px] text-[#8b95a1]">{entries.length}개 항목 · 제출용 구성</p>
        </div>
      </div>

      {/* 항목 목록 */}
      <div>
        {entries.map((entry) => {
          const meta = KIND_META[entry.kind];
          return (
            <ListRow
              key={entry.name}
              verticalPadding="small"
              left={
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#f2f4f6] text-[17px]">
                  {meta.emoji}
                </span>
              }
              contents={<ListRow.Texts type="2RowTypeA" top={entry.name} bottom={entry.description} />}
              right={
                <Badge size="small" color={meta.color} variant="weak">
                  {meta.label}
                </Badge>
              }
            />
          );
        })}
      </div>
    </div>
  );
}
