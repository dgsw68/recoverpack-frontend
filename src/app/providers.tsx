"use client";

import { ColorSchemeArea, TDSMobileProvider } from "@toss/tds-mobile";
import EmotionRegistry from "@/lib/emotion";

// 웹(데스크톱/모바일 브라우저) 환경을 가정한 기본 UA 설정.
// TDS는 이 값으로 다크모드/폰트 스케일/OS 분기를 결정한다.
const userAgent = {
  fontA11y: undefined,
  fontScale: undefined,
  isAndroid: false,
  isIOS: false,
  colorPreference: "light" as const,
};

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <EmotionRegistry>
      <TDSMobileProvider userAgent={userAgent}>
        <ColorSchemeArea theme="light">{children}</ColorSchemeArea>
      </TDSMobileProvider>
    </EmotionRegistry>
  );
}
