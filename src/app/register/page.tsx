"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Top } from "@toss/tds-mobile";
import NoticeBox from "@/components/NoticeBox";
import PillButton from "@/components/PillButton";
import { register } from "@/api/auth";
import { ApiError } from "@/api/client";
import { saveSession } from "@/stores/authStore";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const session = await register({ name, email, password });
      saveSession(session);
      router.push("/my");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "회원가입에 실패했어요.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[100dvh] flex-1 flex-col px-6 pb-6 pt-4">
      <div className="mx-auto flex w-full max-w-[400px] flex-1 flex-col">
        <Top
          style={{ marginLeft: -24, marginRight: -24 }}
          upperGap={16}
          lowerGap={20}
          title={<Top.TitleParagraph size={22}>회원가입</Top.TitleParagraph>}
          subtitleBottom={
            <Top.SubtitleParagraph size={15}>
              몇 가지 정보만 입력하면 바로 시작할 수 있어요.
            </Top.SubtitleParagraph>
          }
        />

        <form onSubmit={handleSubmit} className="flex flex-1 flex-col">
          <div className="flex flex-col gap-3">
            <div>
              <label className="mb-1 block text-[12px] font-bold text-[#8b95a1]">이름</label>
              <input
                type="text"
                required
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="홍길동"
                className="w-full rounded-xl border border-[#e5e8eb] bg-[#f9fafb] px-3.5 py-3 text-[15px] outline-none focus:border-[#3182f6]"
              />
            </div>
            <div>
              <label className="mb-1 block text-[12px] font-bold text-[#8b95a1]">이메일</label>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-[#e5e8eb] bg-[#f9fafb] px-3.5 py-3 text-[15px] outline-none focus:border-[#3182f6]"
              />
            </div>
            <div>
              <label className="mb-1 block text-[12px] font-bold text-[#8b95a1]">비밀번호</label>
              <input
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="8자 이상"
                className="w-full rounded-xl border border-[#e5e8eb] bg-[#f9fafb] px-3.5 py-3 text-[15px] outline-none focus:border-[#3182f6]"
              />
            </div>
          </div>

          {error && (
            <div className="mt-4">
              <NoticeBox tone="warning">{error}</NoticeBox>
            </div>
          )}

          <div className="mt-auto pt-6">
            <PillButton display="full" size="xlarge" type="submit" loading={submitting}>
              회원가입
            </PillButton>
            <p className="mt-3 text-center text-[13px] text-[#8b95a1]">
              이미 계정이 있으신가요?{" "}
              <Link href="/login" className="font-semibold text-[#3182f6]">
                로그인
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
