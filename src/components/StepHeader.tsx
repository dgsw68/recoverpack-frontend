export default function StepHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <header className="mb-6 animate-fade-up">
      {eyebrow && (
        <p className="mb-2 text-sm font-semibold text-brand-600">{eyebrow}</p>
      )}
      <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
        {title}
      </h1>
      {description && (
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500 sm:text-base">
          {description}
        </p>
      )}
    </header>
  );
}
