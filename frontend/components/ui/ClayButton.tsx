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
    sm: "px-3.5 py-1.5 text-xs min-h-[36px]",
    md: "px-5 py-2.5 text-sm min-h-[44px]",
    lg: "px-7 py-3 text-base min-h-[48px]",
  };

  const variantStyles = {
    primary:
      "clay-button-primary font-medium tracking-normal text-[var(--primary-foreground)]",
    secondary:
      "clay-button-secondary font-medium tracking-normal text-[var(--secondary-foreground)]",
    outline:
      "border border-[var(--border)] bg-transparent hover:bg-[var(--card)] text-[var(--foreground)] rounded-full transition-[transform,background-color] duration-150 active:scale-[0.97]",
    ghost:
      "bg-transparent hover:bg-[color-mix(in_oklab,var(--secondary)_40%,transparent)] text-[var(--foreground)] rounded-full transition-[transform,background-color] duration-150 active:scale-[0.97]",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
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
