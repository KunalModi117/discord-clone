"use client";

import { Skeleton } from "@discord/components/ui/skeleton";
import { cn } from "@discord/lib/utils";
import { useGetMembersByServerId } from "@discord/modules/sidebar/hooks/useGetMembersByServerId";
import { useMemberStore } from "@discord/utils/zustandStore";
import { useEffect } from "react";

const SkeletonItem = () => {
  return (
    <div className="flex gap-2 items-center p-1 hover:bg-gray-700 rounded-md mt-2">
      <Skeleton className="h-8 w-8 rounded-full" />
      <Skeleton className="w-18 h-3" />
      <Skeleton className="w-2 h-2" />
    </div>
  );
};

export const MembersSidebar = ({
  activeServerId,
}: {
  activeServerId?: string;
}) => {
  const { data, isLoading } = useGetMembersByServerId({
    serverId: activeServerId || "",
  });
  const setMembers = useMemberStore((s) => s.setMembers);
  const statuses = useMemberStore((s) => s.statuses);

  useEffect(() => {
    if (data) {
      setMembers(data);
    }
  }, [data]);

  return (
    <div className="max-w-[256px] w-full h-[calc(100vh-136px)] overflow-y-scroll pt-2 px-2">
      {isLoading
        ? Array.from({ length: 20 }).map((_, i) => <SkeletonItem key={i} />)
        : data?.map((member) => (
            <div
              key={member.id}
              className="flex gap-2 items-center p-1 hover:bg-gray-700 rounded-md"
            >
              <div className="rounded-full mt-1 w-8 h-8 border border-input flex items-center justify-center relative">
                {member.user.username[0].toUpperCase()}
                <div
                  className={cn(
                    "absolute bottom-0 right-0 w-2 h-2 rounded-full bg-gray-500 border",
                    { "bg-green-500": statuses[member.user.id] === "online" }
                  )}
                />
              </div>
              <div>{member.user.username}</div>
              {member.role === "admin" ? (
                <div>👑</div>
              ) : (
                <div className="text-xs text-muted-foreground">M</div>
              )}
            </div>
          ))}
    </div>
  );
};
