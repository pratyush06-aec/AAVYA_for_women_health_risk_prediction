import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "sage" | "coral" | "gold" | "neutral";
  children: React.ReactNode;
}

export function Badge({
  variant = "sage",
  className,
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    sage: "bg-[color-mix(in_oklab,var(--secondary)_70%,var(--card))] text-[var(--secondary-foreground)] border-emerald-900/10",
    coral: "bg-[color-mix(in_oklab,var(--coral)_60%,var(--card))] text-[var(--coral-foreground)] border-rose-900/10",
    gold: "bg-[color-mix(in_oklab,var(--gold)_55%,var(--card))] text-[var(--gold-foreground)] border-amber-900/10",
    neutral: "bg-[var(--muted)] text-[var(--muted-foreground)] border-[var(--border)]",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border tracking-wide",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
