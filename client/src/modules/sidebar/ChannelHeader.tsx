"use client";

import { ServersData } from "@discord/app/apis/getServers";
import { ChevronRight } from "lucide-react";
import { useSearchParams } from "next/navigation";

export const ChannelHeader = ({
  activeServer,
  handleClick,
}: {
  activeServer?: ServersData;
  handleClick: () => void;
}) => {
  const searchParams = useSearchParams();
  const activeChannel = searchParams.get("channelId") ?? "";

  const channelName = activeServer?.channels?.find(
    (channel) => channel.id === activeChannel
  )?.name;
  return (
    <div className="flex gap-4 items-center p-4 border-b border-input sticky top-0 bg-secondary">
      <button onClick={handleClick}>
        <ChevronRight />
      </button>
      <h2 className="text-xl font-bold sticky top-0 z-10">
        #&nbsp;{channelName}
      </h2>
    </div>
  );
};
