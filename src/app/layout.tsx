import type { Metadata, Viewport } from "next";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "RecoverPack — 재난 피해 증거 패키지 생성기",
  description:
    "사진, 영수증, 재난문자, 시간 정보를 AI가 분류하고 설명문과 타임라인으로 정리해 보험사·주민센터·집주인에게 제출하기 쉽게 만들어드립니다.",
};

export const viewport: Viewport = {
  themeColor: "#1f4ce0",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="app-bg min-h-screen antialiased">
        <SiteHeader />
        <main className="mx-auto w-full max-w-5xl px-4 pb-24 pt-6 sm:px-6">
          {children}
        </main>
        <footer className="border-t border-slate-200/70 bg-white/60">
          <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-slate-400 sm:flex-row sm:px-6">
            <span>© 2026 RecoverPack · 해커톤 데모</span>
            <span>AI는 보상 가능 여부를 판단하지 않습니다.</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
