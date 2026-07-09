"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Top } from "@toss/tds-mobile";
import NoticeBox from "@/components/NoticeBox";
import PillButton from "@/components/PillButton";
import RequireAuth from "@/components/RequireAuth";
import { FolderIcon, PackageIcon, TimelineIcon } from "@/components/icons";
import { getMe, getMyPackages } from "@/api/me";
import { downloadPackage } from "@/api/packages";
import { ApiError } from "@/api/client";
import { clearSession, getUser } from "@/stores/authStore";
import { resetProject } from "@/lib/storage";
import type { AuthUser, DamageType, MyPackage, PackageStatus } from "@/lib/types";

const DAMAGE_LABEL: Record<DamageType, string> = {
  flood: "침수",
  fire: "화재",
  heavy_snow: "대설",
  typhoon: "태풍",
};

const STATUS_LABEL: Record<PackageStatus, string> = {
  draft: "작성 중",
  pending: "대기",
  processing: "생성 중",
  completed: "완료",
  failed: "실패",
};

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function packageFileName(item: MyPackage): string {
  const damage = DAMAGE_LABEL[item.damageType] ?? "재난";
  const title = item.title?.trim() || "증거패키지";
  return `${damage}_${title}_증빙패키지.zip`.replace(/[\\/:*?"<>|]/g, "_");
}

function StatChip({ icon: Icon, label }: { icon: typeof FolderIcon; label: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-[#f2f4f6] px-2.5 py-1 text-[12px] font-semibold text-[#4e5968]">
      <Icon className="h-3.5 w-3.5" />
      {label}
    </span>
  );
}

function StatusBadge({ status }: { status: PackageStatus }) {
  const done = status === "completed";
  const failed = status === "failed";
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[12px] font-bold ${
        done
          ? "bg-[#eaf2ff] text-[#3182f6]"
          : failed
            ? "bg-[#fff3f0] text-[#f04452]"
            : "bg-[#f2f4f6] text-[#6b7684]"
      }`}
    >
      {STATUS_LABEL[status] ?? status}
    </span>
  );
}

function PackageCard({
  item,
  downloading,
  onDownload,
}: {
  item: MyPackage;
  downloading: boolean;
  onDownload: (item: MyPackage) => void;
}) {
  return (
    <div className="rounded-2xl border border-[#eef0f2] bg-white p-4 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-[16px] font-extrabold text-[#191f28]">
            {item.title || "제목 없는 패키지"}
          </p>
          <p className="mt-1 text-[13px] font-medium text-[#8b95a1]">
            {DAMAGE_LABEL[item.damageType] ?? item.damageType} · {item.location || "지역 미입력"}
          </p>
        </div>
        <StatusBadge status={item.status} />
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        <StatChip icon={FolderIcon} label={`파일 ${item.fileCount}개`} />
        <StatChip icon={PackageIcon} label={`증거 ${item.evidenceCount}개`} />
        <StatChip icon={TimelineIcon} label={`타임라인 ${item.timelineCount}개`} />
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="text-[12px] font-semibold text-[#8b95a1]">
          생성 {formatDate(item.createdAt)}
        </div>
        <PillButton
          size="medium"
          variant={item.downloadAvailable ? "solid" : "weak"}
          disabled={!item.downloadAvailable}
          loading={downloading}
          onClick={() => onDownload(item)}
        >
          다운로드
        </PillButton>
      </div>
    </div>
  );
}

function MyPage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(getUser());
  const [items, setItems] = useState<MyPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [me, packages] = await Promise.all([getMe(), getMyPackages()]);
        if (!mounted) return;
        setUser(me);
        setItems(packages.items);
      } catch (err) {
        if (!mounted) return;
        setError(err instanceof ApiError ? err.message : "내 기록을 불러오지 못했어요.");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const startNewPackage = () => {
    resetProject();
    router.push("/damage-type");
  };

  const logout = () => {
    clearSession();
    router.replace("/");
  };

  const handleDownload = async (item: MyPackage) => {
    setDownloadingId(item.projectId);
    setError(null);
    try {
      const blob = await downloadPackage(item.projectId);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = packageFileName(item);
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "다운로드에 실패했어요.");
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="animate-fade-up flex min-h-[100dvh] flex-1 flex-col bg-[#f9fafb] px-6 pb-6 pt-4">
      <div className="mx-auto flex w-full max-w-[400px] flex-1 flex-col">
        <Top
          style={{ marginLeft: -24, marginRight: -24 }}
          upperGap={16}
          lowerGap={18}
          title={<Top.TitleParagraph size={22}>내 패키지</Top.TitleParagraph>}
          subtitleBottom={
            <Top.SubtitleParagraph size={15}>
              생성한 증거 패키지와 내 정보를 확인할 수 있어요.
            </Top.SubtitleParagraph>
          }
        />

        <section className="rounded-2xl bg-white p-4 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-[18px] font-extrabold text-[#191f28]">
                {user?.name || "사용자"}
              </p>
              <p className="mt-1 truncate text-[13px] font-medium text-[#8b95a1]">
                {user?.email || "이메일 정보를 불러오는 중"}
              </p>
            </div>
            <button
              type="button"
              onClick={logout}
              className="shrink-0 rounded-full bg-[#f2f4f6] px-3 py-2 text-[12px] font-bold text-[#4e5968] active:bg-[#e5e8eb]"
            >
              로그아웃
            </button>
          </div>
        </section>

        <div className="mt-4">
          <PillButton display="full" size="xlarge" onClick={startNewPackage}>
            새 증거 패키지 만들기
          </PillButton>
        </div>

        {error && (
          <div className="mt-4">
            <NoticeBox tone="warning">{error}</NoticeBox>
          </div>
        )}

        <div className="mt-6 flex items-center justify-between">
          <h2 className="text-[17px] font-extrabold text-[#191f28]">생성 기록</h2>
          <span className="text-[13px] font-bold text-[#8b95a1]">{items.length}개</span>
        </div>

        {loading ? (
          <div className="mt-3 flex flex-col gap-3">
            <div className="shimmer h-[132px] rounded-2xl" />
            <div className="shimmer h-[132px] rounded-2xl" />
          </div>
        ) : items.length === 0 ? (
          <div className="mt-3 rounded-2xl border border-dashed border-[#d1d6db] bg-white px-5 py-10 text-center">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#eaf2ff] text-[#3182f6]">
              <PackageIcon className="h-6 w-6" />
            </div>
            <p className="mt-4 text-[16px] font-extrabold text-[#191f28]">
              아직 만든 패키지가 없어요
            </p>
            <p className="mt-1 text-[13px] leading-relaxed text-[#8b95a1]">
              피해 자료를 업로드하면 이곳에서 ZIP 기록을 다시 확인할 수 있어요.
            </p>
          </div>
        ) : (
          <div className="mt-3 flex flex-col gap-3">
            {items.map((item) => (
              <PackageCard
                key={item.packageId || item.projectId}
                item={item}
                downloading={downloadingId === item.projectId}
                onDownload={handleDownload}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function MyPageWrapper() {
  return (
    <RequireAuth>
      <MyPage />
    </RequireAuth>
  );
}
