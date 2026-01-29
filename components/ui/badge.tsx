import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-all duration-300",
  {
    variants: {
      variant: {
        default:
          "border-primary/30 bg-primary/10 text-primary hover:border-primary/50 hover:bg-primary/15",
        secondary:
          "border-secondary/30 bg-secondary/10 text-secondary hover:border-secondary/50 hover:bg-secondary/15",
        destructive:
          "border-destructive/30 bg-destructive/10 text-destructive hover:border-destructive/50 hover:bg-destructive/15",
        outline: "border-border/50 bg-transparent text-foreground hover:border-border hover:bg-muted/50",
        success:
          "border-emerald-500/30 bg-emerald-50 text-emerald-700",
        warning:
          "border-yellow-500/30 bg-yellow-50 text-yellow-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
