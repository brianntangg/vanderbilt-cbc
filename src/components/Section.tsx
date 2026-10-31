import { Eyebrow } from "./Eyebrow";

type SectionProps = {
  id?: string;
  eyebrow?: string;
  title?: string;
  intro?: React.ReactNode;
  /** Use "h1" for the first section on a page. */
  as?: "h1" | "h2";
  children?: React.ReactNode;
  className?: string;
};

/** Page container plus optional eyebrow, heading, and intro. */
export function Section({ id, eyebrow, title, intro, as = "h2", children, className = "" }: SectionProps) {
  const Heading = as;
  return (
    <section id={id} className={`py-16 sm:py-20 ${className}`}>
      <div className="mx-auto max-w-[1160px] px-6">
        {(eyebrow || title || intro) && (
          <header className="mb-10 max-w-[820px]">
            {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
            {title && (
              <Heading
                className={`font-display font-medium tracking-[-0.015em] text-balance ${
                  as === "h1"
                    ? "mt-4 text-[38px] leading-[1.05] sm:text-[60px]"
                    : "mt-3 text-[30px] leading-[1.1] sm:text-[38px]"
                }`}
              >
                {title}
              </Heading>
            )}
            {intro && <div className="mt-4 max-w-[640px] text-lg text-muted">{intro}</div>}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}
