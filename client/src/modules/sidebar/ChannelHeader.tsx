"use client";

import { ServersData } from "@discord/app/apis/getServers";
import { useSocket } from "@discord/hooks/useSocket";
import { useSearchParams } from "next/navigation";

export const ChannelHeader = ({
  activeServer,
}: {
  activeServer?: ServersData;
}) => {
  const searchParams = useSearchParams();
  const activeChannel = searchParams.get("channelId") ?? "";
  const { isConnected } = useSocket({ channelId: activeChannel });

  const channelName = activeServer?.channels?.find(
    (channel) => channel.id === activeChannel
  )?.name;
  return (
    <div className="flex justify-between items-center p-4 border-b border-input sticky top-0 bg-secondary">
      <h2 className="text-xl font-bold sticky top-0 z-10">
        #&nbsp;{channelName}
      </h2>
      {isConnected ? (
        <div className="rounded-full w-4 h-4 bg-green-500" />
      ) : (
        <div className="rounded-full w-4 h-4 bg-red-500" />
      )}
    </div>
  );
};
