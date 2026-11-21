import React from "react";
import { cn } from "@/lib/utils";

interface ClayCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  interactive?: boolean;
  className?: string;
}

export function ClayCard({
  children,
  interactive = false,
  className,
  ...props
}: ClayCardProps) {
  return (
    <div
      className={cn(
        interactive ? "clay-card cursor-pointer" : "clay-card-flat",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
