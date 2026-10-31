import Link from "next/link";

type ButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
};

const variants = {
  primary: "bg-ink text-bg hover:bg-ink/90",
  secondary: "border border-line text-ink hover:border-muted",
};

/** A link styled as a button. External URLs open in a new tab. */
export function Button({ href, children, variant = "primary", className = "" }: ButtonProps) {
  const classes = `inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-5 text-[15px] font-semibold transition-colors ${variants[variant]} ${className}`;
  if (isExternal(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}

export function isExternal(href: string): boolean {
  return /^https?:\/\//.test(href);
}
