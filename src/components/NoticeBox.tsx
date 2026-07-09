import { InfoIcon, WarningIcon, SuccessIcon } from "@/components/icons";

type Tone = "info" | "warning" | "success";

const TONES: Record<Tone, { wrap: string; icon: (props: { className?: string }) => JSX.Element }> = {
  info: { wrap: "bg-[#eff4ff] text-[#1b64da]", icon: InfoIcon },
  warning: { wrap: "bg-[#fff4e6] text-[#c2410c]", icon: WarningIcon },
  success: { wrap: "bg-[#e7f7ef] text-[#0f8a5f]", icon: SuccessIcon },
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
      <t.icon className="mt-px h-[17px] w-[17px] shrink-0" />
      <div>
        {title && <p className="font-bold">{title}</p>}
        <div className={title ? "mt-0.5" : ""}>{children}</div>
      </div>
    </div>
  );
}
