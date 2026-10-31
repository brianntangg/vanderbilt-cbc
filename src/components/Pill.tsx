export function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-accent/40 bg-accent-soft px-2.5 py-0.5 font-mono text-xs font-medium uppercase tracking-[0.06em] text-accent">
      {children}
    </span>
  );
}
