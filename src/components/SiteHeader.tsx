import Link from "next/link";
import Logo from "./Logo";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" aria-label="RecoverPack 홈">
          <Logo />
        </Link>
        <div className="flex items-center gap-2">
          <span className="hidden rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 sm:inline">
            재난 피해 증거 패키지
          </span>
          <Link href="/damage-type" className="btn-primary !px-4 !py-2 text-sm">
            시작하기
          </Link>
        </div>
      </div>
    </header>
  );
}
