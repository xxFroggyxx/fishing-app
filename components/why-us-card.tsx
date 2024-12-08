interface WhyUsCardProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
}

export default function WhyUsCard({
  icon,
  title,
  description,
}: WhyUsCardProps) {
  return (
    <div className="flex flex-col items-center gap-3 text-center">
      {icon}
      <p className="text-xl font-semibold">{title}</p>
      <p className="text-sm">{description}</p>
    </div>
  );
}
