import { cn } from "@discord/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-black/50 animate-pulse rounded-md", className)}
      {...props}
    />
  )
}

export { Skeleton }
