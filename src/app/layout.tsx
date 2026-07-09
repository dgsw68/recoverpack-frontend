import type { Metadata, Viewport } from "next";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "RecoverPack — 재난 피해 증거 패키지 생성기",
  description:
    "사진, 영수증, 재난문자, 시간 정보를 AI가 분류하고 설명문과 타임라인으로 정리해 보험사·주민센터·집주인에게 제출하기 쉽게 만들어드립니다.",
  icons: {
    icon: "/logo.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#3182f6",
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
      <body>
        <Providers>
          <div className="tds-frame">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
