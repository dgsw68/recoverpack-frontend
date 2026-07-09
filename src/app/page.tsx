"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import NoticeBox from "@/components/NoticeBox";
import PillButton from "@/components/PillButton";
import { FolderIcon, EditNoteIcon, TimelineIcon, PackageIcon } from "@/components/icons";
import { isAuthenticated } from "@/stores/authStore";

const FEATURES = [
  {
    icon: FolderIcon,
    title: "AI 자동 분류",
    desc: "사진·영수증·재난문자를 카테고리별로 자동 정리해요.",
  },
  {
    icon: EditNoteIcon,
    title: "설명문 자동 작성",
    desc: "각 자료에 제출용 설명문(캡션)을 만들어 드려요.",
  },
  {
    icon: TimelineIcon,
    title: "피해 타임라인",
    desc: "재난문자 수신부터 피해 발생까지 시간 순으로 정리해요.",
  },
  {
    icon: PackageIcon,
    title: "제출용 패키지",
    desc: "요약표·색인·설명문을 하나의 파일로 묶어 드려요.",
  },
];

const FLOW = ["피해 유형", "자료 업로드", "AI 분류", "타임라인", "패키지"];

export default function LandingPage() {
  const router = useRouter();
  const loggedIn = isAuthenticated();
  const startPackage = () => {
    if (!loggedIn) {
      router.push("/login?reason=auth&next=/damage-type");
      return;
    }
    router.push("/damage-type");
  };

  return (
    <div className="animate-fade-up flex min-h-[100dvh] flex-1 flex-col">
      {/* 히어로 */}
      <div className="bg-[#3182f6] px-6 pb-10 pt-8 text-white">
        <Image src="/logo.png" alt="RecoverPack" width={40} height={35} priority />

        <span className="mt-5 inline-block rounded-full bg-white/15 px-3 py-1 text-[12px] font-semibold">
          재난 피해 증거 패키지 생성기
        </span>

        <h1 className="mt-4 whitespace-pre-line text-[28px] font-extrabold leading-[1.3]">
          {`재난 피해 자료를\n제출 가능한 증거로`}
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-white/85">
          사진·영수증·재난문자·시간 정보를 AI가 분류하고 설명문과 타임라인으로
          정리해 보험사·주민센터·집주인에게 제출하기 쉽게 만들어 드려요.
        </p>

        {/* 진행 플로우 칩 */}
        <div className="mt-6 flex flex-wrap gap-1.5">
          {FLOW.map((label, i) => (
            <span
              key={label}
              className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-[12px] font-semibold"
            >
              <span className="grid h-[18px] w-[18px] place-items-center rounded-full bg-white text-[11px] font-bold text-[#3182f6]">
                {i + 1}
              </span>
              {label}
            </span>
          ))}
        </div>
      </div>

      <main className="flex-1 px-6 pb-6 pt-6">
        {/* 기능 카드 그리드 */}
        <div className="grid grid-cols-2 gap-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="flex flex-col gap-3 rounded-2xl border border-[#eef0f2] bg-white p-4 shadow-[0_1px_2px_rgba(16,24,40,0.04)]"
            >
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#eaf2ff] text-[#3182f6]">
                <f.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[14px] font-bold text-[#191f28]">{f.title}</p>
                <p className="mt-1 text-[12.5px] leading-relaxed text-[#8b95a1]">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <NoticeBox tone="warning">
            AI는 보상 가능 여부를 판단하지 않고, 자료 정리만 도와드려요.
          </NoticeBox>
        </div>
      </main>

      <div className="sticky bottom-0 z-20 border-t border-[#f2f4f6] bg-white/95 px-6 pb-6 pt-3 backdrop-blur">
        <PillButton display="full" size="xlarge" onClick={startPackage}>
          증거 패키지 만들기
        </PillButton>
        <div className="mt-2">
          <PillButton
            display="full"
            size="xlarge"
            color="dark"
            variant="weak"
            onClick={() => router.push(loggedIn ? "/my" : "/login?next=/my")}
          >
            {loggedIn ? "내 기록 보기" : "로그인"}
          </PillButton>
        </div>
      </div>
    </div>
  );
}
