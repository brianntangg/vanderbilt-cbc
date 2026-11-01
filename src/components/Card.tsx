type CardProps = {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "article" | "li";
  id?: string;
};

export function Card({ children, className = "", as: Tag = "div", id }: CardProps) {
  return <Tag id={id} className={`rounded-xl border border-line bg-surface p-6 ${className}`}>{children}</Tag>;
}
