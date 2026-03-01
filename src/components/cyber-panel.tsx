export function CyberPanel({
  title,
  children,
  className = "",
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`cyber-panel ${className}`}>
      {title && <div className="cyber-panel-header">{title}</div>}
      {children}
    </div>
  );
}
