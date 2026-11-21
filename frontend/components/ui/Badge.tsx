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
    sage: "bg-[var(--surface-secondary)] text-[var(--deep-rose)] border-[rgba(189,115,125,0.2)] shadow-sm",
    coral: "bg-[var(--surface-highlight)] text-[var(--deep-rose)] border-[rgba(189,115,125,0.25)] shadow-sm",
    gold: "bg-[var(--warm-cream)] text-[var(--dark-text)] border-[rgba(189,115,125,0.2)] shadow-sm",
    neutral: "bg-[var(--surface-secondary)] text-[var(--text-secondary)] border-[var(--border)] shadow-sm",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold border tracking-wide",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
