import Link from "next/link";
import { ArrowRight } from "lucide-react";
import clsx from "clsx";

interface CTAButtonProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary";
}

export default function CTAButton({ href, children, className, variant = "primary" }: CTAButtonProps) {
  const baseClasses = "group inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-semibold transition-all duration-300";
  
  const primaryClasses = "bg-primary text-white hover:bg-primary-hover shadow-glow hover:shadow-[0_0_25px_rgba(108,92,231,0.5)] hover:-translate-y-0.5";
  
  const secondaryClasses = "bg-surface-elevated text-foreground hover:bg-border border border-border hover:-translate-y-0.5";

  return (
    <Link 
      href={href}
      className={clsx(
        baseClasses,
        variant === "primary" ? primaryClasses : secondaryClasses,
        className
      )}
    >
      {children}
      <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
    </Link>
  );
}
