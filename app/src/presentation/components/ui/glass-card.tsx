import * as React from "react";
import { cn } from "@/presentation/utils";

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "blur" | "frosted";
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const variants = {
      default: "bg-white/10 backdrop-blur-md border-white/20",
      blur: "bg-white/5 backdrop-blur-lg border-white/10",
      frosted: "bg-white/20 backdrop-blur-sm border-white/30",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl border shadow-lg",
          variants[variant],
          className
        )}
        {...props}
      />
    );
  }
);
GlassCard.displayName = "GlassCard";

export { GlassCard };
