interface FooterSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

function FooterSection({ title, children, className }: FooterSectionProps) {
  return (
    <div className={`${className}`}>
      <h3 className="mb-4 text-foreground/70">{title}</h3>
      {children}
    </div>
  );
}

export default FooterSection;
