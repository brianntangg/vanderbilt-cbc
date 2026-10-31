type CardProps = {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "article" | "li";
};

export function Card({ children, className = "", as: Tag = "div" }: CardProps) {
  return <Tag className={`rounded-xl border border-line bg-surface p-6 ${className}`}>{children}</Tag>;
}
