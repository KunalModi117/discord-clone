"use client";

import { ServersData } from "@discord/app/apis/getServers";
import { ChevronRight, Users } from "lucide-react";
import { useSearchParams } from "next/navigation";

export const ChannelHeader = ({
  activeServer,
  handleClick,
  handleMembersClick,
}: {
  activeServer?: ServersData;
  handleClick: () => void;
  handleMembersClick: () => void;
}) => {
  const searchParams = useSearchParams();
  const activeChannel = searchParams.get("channelId") ?? "";

  const channelName = activeServer?.channels?.find(
    (channel) => channel.id === activeChannel
  )?.name;
  return (
    <div className="flex gap-4 items-center p-4 border-b border-input sticky top-0 bg-secondary justify-between">
      <div className="flex gap-4 items-center">
        <button onClick={handleClick}>
          <ChevronRight />
        </button>
        <h2 className="text-xl font-bold sticky top-0 z-10">
          #&nbsp;{channelName}
        </h2>
      </div>
      <button onClick={handleMembersClick} className="cursor-pointer">
        <Users className="w-4 h-4" />
      </button>
    </div>
  );
};
