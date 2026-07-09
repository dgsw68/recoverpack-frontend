import { Badge, ListRow } from "@/components/mobile-ui";
import type { PackageEntry } from "@/lib/types";
import { FilePdfIcon, FileSheetIcon, FileCsvIcon, FileTextIcon, FolderIcon, PackageIcon } from "@/components/icons";

type BadgeColor = "red" | "green" | "teal" | "elephant" | "yellow";

const KIND_META: Record<
  PackageEntry["kind"],
  { label: string; color: BadgeColor; icon: (props: { className?: string }) => JSX.Element }
> = {
  pdf: { label: "PDF", color: "red", icon: FilePdfIcon },
  xlsx: { label: "XLSX", color: "green", icon: FileSheetIcon },
  csv: { label: "CSV", color: "teal", icon: FileCsvIcon },
  txt: { label: "TXT", color: "elephant", icon: FileTextIcon },
  folder: { label: "폴더", color: "yellow", icon: FolderIcon },
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
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-white text-[#3182f6] shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
          <PackageIcon className="h-5 w-5" />
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
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#f2f4f6] text-[#4e5968]">
                  <meta.icon className="h-[18px] w-[18px]" />
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
