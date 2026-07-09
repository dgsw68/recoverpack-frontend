type Tone = "info" | "warning" | "success";

const TONES: Record<
  Tone,
  { wrap: string; icon: string; iconPath: React.ReactNode }
> = {
  info: {
    wrap: "border-brand-100 bg-brand-50/70 text-brand-800",
    icon: "text-brand-500",
    iconPath: (
      <>
        <circle cx="12" cy="12" r="9" strokeWidth="1.8" />
        <path d="M12 11v5" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="12" cy="7.8" r="1" fill="currentColor" stroke="none" />
      </>
    ),
  },
  warning: {
    wrap: "border-amber-200 bg-amber-50 text-amber-800",
    icon: "text-amber-500",
    iconPath: (
      <>
        <path
          d="M12 3.5l9 15.5H3l9-15.5z"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path d="M12 9.5v4" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="12" cy="16.4" r="1" fill="currentColor" stroke="none" />
      </>
    ),
  },
  success: {
    wrap: "border-emerald-200 bg-emerald-50 text-emerald-800",
    icon: "text-emerald-500",
    iconPath: (
      <>
        <circle cx="12" cy="12" r="9" strokeWidth="1.8" />
        <path
          d="M8 12.2l2.6 2.6L16 9.4"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </>
    ),
  },
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
      className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm ${t.wrap} ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        className={`mt-0.5 h-5 w-5 shrink-0 ${t.icon}`}
        aria-hidden
      >
        {t.iconPath}
      </svg>
      <div className="leading-relaxed">
        {title && <p className="font-semibold">{title}</p>}
        <div className={title ? "mt-0.5 opacity-90" : ""}>{children}</div>
      </div>
    </div>
  );
}
