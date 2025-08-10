"use client";

import { Avatar } from "@discord/components/Avatar";
import { cn } from "@discord/lib/utils";
import { useMemberStore } from "@discord/utils/zustandStore";
import { Crown } from "lucide-react";
import { useEffect } from "react";

export const MembersSidebar = ({
  activeServerId,
  isShowMembers,
}: {
  activeServerId?: string;
  isShowMembers: boolean;
}) => {
  const setActiveServerId = useMemberStore((s) => s.setActiveServerId);
  const statuses = useMemberStore((s) => s.statuses);
  const members = useMemberStore((s) => s.members);
  useEffect(() => {
    if (activeServerId) {
      setActiveServerId(activeServerId);
    }
  }, [activeServerId, setActiveServerId]);

  return (
    <div className={cn("max-w-[256px] w-full h-[calc(100vh-136px)] overflow-y-scroll pt-2 px-2", {hidden: !isShowMembers})}>
      {members?.map((member) => (
        <div
          key={member.id}
          className="flex gap-2 items-center p-1 hover:bg-gray-700 rounded-md"
        >
          <div className="relative">
            <Avatar
              src={member.user.avatar}
              alt={member.user.username}
              username={member.user.username}
              size="sm"
              className="mt-1"
            />
            <div
              className={cn(
                "absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-background", // Increased size and added border for visibility
                // Dynamically set background color based on status from Zustand store
                {
                  "bg-green-500": statuses[member.user.id] === "online",
                  "bg-gray-500":
                    statuses[member.user.id] === "offline" ||
                    !statuses[member.user.id], // Default to gray if no status or offline
                  // Add more colors for 'idle' if you implement it
                  // "bg-yellow-500": statuses[member.user.id] === "idle",
                }
              )}
            />
          </div>
          <div>{member.user.username}</div>
          {member.role === "admin" ? (
            <Crown className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          ) : (
            <div className="text-xs text-muted-foreground">M</div>
          )}
        </div>
      ))}
    </div>
  );
};
