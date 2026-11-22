import React from "react";
import { cn } from "@/lib/utils";

interface ClayButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export function ClayButton({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ClayButtonProps) {
  const sizeStyles = {
    sm: "px-3.5 py-1.5 text-xs min-h-[32px] h-8 whitespace-nowrap",
    md: "px-6 py-2.5 text-sm min-h-[42px] whitespace-nowrap",
    lg: "px-8 py-3.5 text-base min-h-[48px] whitespace-nowrap",
  };

  const variantStyles = {
    primary:
      "clay-button-primary font-semibold text-[#FFF8F4]",
    secondary:
      "clay-button-secondary font-semibold text-[var(--text-primary)]",
    outline:
      "border border-[rgba(189,115,125,0.25)] bg-[var(--surface-secondary)]/50 hover:bg-[var(--surface-secondary)] text-[var(--text-primary)] rounded-full transition-all duration-150 active:scale-[0.97] shadow-sm",
    ghost:
      "bg-transparent hover:bg-[var(--surface-secondary)]/60 text-[var(--text-primary)] rounded-full transition-all duration-150 active:scale-[0.97]",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--deep-rose)] focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
