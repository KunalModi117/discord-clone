import { Skeleton } from "@discord/components/ui/skeleton";

export const MessageItemSkeleton = () => {
  return (
    <div className="flex items-start gap-3 px-4 py-2">
      <Skeleton className="h-9 w-9 rounded-full mt-1" />

      <div className="flex flex-col gap-2 w-full">
        <div className="flex items-center gap-3">
          <Skeleton className="h-4 w-24 rounded" />
          <Skeleton className="h-3 w-12 rounded" />
        </div>

        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-3/5 rounded" />
      </div>
    </div>
  );
};
