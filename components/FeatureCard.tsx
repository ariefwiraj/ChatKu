interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export default function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="flex flex-col p-6 rounded-2xl glass transition-all hover:-translate-y-1 hover:shadow-card group">
      <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-surface-elevated text-primary mb-5 group-hover:bg-primary group-hover:text-white transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-foreground mb-3">{title}</h3>
      <p className="text-muted leading-relaxed flex-grow">{description}</p>
    </div>
  );
}
