"use client";

import { useRouter } from "next/navigation";
import { Badge, Button, List, ListRow, Top } from "@toss/tds-mobile";
import NoticeBox from "@/components/NoticeBox";

const FEATURES = [
  {
    emoji: "🗂️",
    title: "AI 자동 분류",
    desc: "사진·영수증·재난문자를 카테고리별로 자동 정리해요.",
  },
  {
    emoji: "📝",
    title: "설명문 자동 작성",
    desc: "각 자료에 제출용 설명문(캡션)을 만들어 드려요.",
  },
  {
    emoji: "🕒",
    title: "피해 타임라인",
    desc: "재난문자 수신부터 피해 발생까지 시간 순으로 정리해요.",
  },
  {
    emoji: "📦",
    title: "제출용 패키지",
    desc: "요약표·색인·설명문을 하나의 파일로 묶어 드려요.",
  },
];

const FLOW = ["피해 유형", "자료 업로드", "AI 분류", "타임라인", "패키지"];

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="animate-fade-up flex min-h-[100dvh] flex-1 flex-col">
      <main className="flex-1 px-6 pb-6 pt-4">
        <Badge size="small" color="blue" variant="weak">
          재난 피해 증거 패키지 생성기
        </Badge>

        <Top
          upperGap={16}
          lowerGap={12}
          title={
            <Top.TitleParagraph size={28}>
              {`재난 피해 자료를\n제출 가능한 증거로`}
            </Top.TitleParagraph>
          }
          subtitleBottom={
            <Top.SubtitleParagraph size={15}>
              사진·영수증·재난문자·시간 정보를 AI가 분류하고 설명문과 타임라인으로
              정리해 보험사·주민센터·집주인에게 제출하기 쉽게 만들어 드려요.
            </Top.SubtitleParagraph>
          }
        />

        {/* 진행 플로우 칩 */}
        <div className="mb-6 mt-2 flex flex-wrap gap-1.5">
          {FLOW.map((label, i) => (
            <span
              key={label}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#f2f4f6] px-3 py-1.5 text-[12px] font-semibold text-[#4e5968]"
            >
              <span className="grid h-4 w-4 place-items-center rounded-full bg-[#3182f6] text-[10px] font-bold text-white">
                {i + 1}
              </span>
              {label}
            </span>
          ))}
        </div>

        {/* 기능 리스트 */}
        <List>
          {FEATURES.map((f) => (
            <ListRow
              key={f.title}
              left={
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#f2f4f6] text-[22px]">
                  {f.emoji}
                </div>
              }
              contents={
                <ListRow.Texts
                  type="2RowTypeA"
                  top={f.title}
                  bottom={f.desc}
                />
              }
            />
          ))}
        </List>

        <div className="mt-4">
          <NoticeBox tone="warning">
            AI는 보상 가능 여부를 판단하지 않고, 자료 정리만 도와드려요.
          </NoticeBox>
        </div>
      </main>

      <div className="sticky bottom-0 z-20 border-t border-[#f2f4f6] bg-white/95 px-6 pb-6 pt-3 backdrop-blur">
        <Button
          display="full"
          size="xlarge"
          onClick={() => router.push("/damage-type")}
        >
          증거 패키지 만들기
        </Button>
        <div className="mt-2">
          <Button
            display="full"
            size="xlarge"
            color="dark"
            variant="weak"
            onClick={() => router.push("/upload")}
          >
            데모 자료로 둘러보기
          </Button>
        </div>
      </div>
    </div>
  );
}
