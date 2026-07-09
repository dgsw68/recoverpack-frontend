type Tone = "info" | "warning" | "success";

const TONES: Record<Tone, { wrap: string; emoji: string }> = {
  info: { wrap: "bg-[#eff4ff] text-[#1b64da]", emoji: "💡" },
  warning: { wrap: "bg-[#fff4e6] text-[#c2410c]", emoji: "⚠️" },
  success: { wrap: "bg-[#e7f7ef] text-[#0f8a5f]", emoji: "✅" },
};

export default function NoticeBox({
  tone = "info",
  title,
  children,
  className = "",
}: {
  tone?: Tone;
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const t = TONES[tone];
  return (
    <div
      className={`flex items-start gap-2.5 rounded-2xl px-4 py-3 text-[14px] leading-relaxed ${t.wrap} ${className}`}
    >
      <span className="mt-px shrink-0 text-[15px] leading-none" aria-hidden>
        {t.emoji}
      </span>
      <div>
        {title && <p className="font-bold">{title}</p>}
        <div className={title ? "mt-0.5" : ""}>{children}</div>
      </div>
    </div>
  );
}
