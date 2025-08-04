"use client";

import { ServersData } from "@discord/app/apis/getServers";
import { cn } from "@discord/lib/utils";
import { ChevronRight, PlusIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { ChannelItem } from "./ChannelItem";
import { CreateChannelDialog } from "./CreateChannelDialog";

interface ChannelListProps {
  activeServer?: ServersData;
  handleOnSuccess: () => void;
  handleChannelClick: (open:boolean) => void;
}

export const ChannelList = ({
  activeServer,
  handleOnSuccess,
  handleChannelClick,
}: ChannelListProps) => {
  const server = activeServer;
  const [isCreateChannelDialogOpen, setIsCreateChannelDialogOpen] =
    useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const searchParams = useSearchParams();
  const activeChannelId = searchParams.get("channelId") ?? "";
  const channel = server?.channels?.find(
    (channel) => channel.id === activeChannelId
  );

  const handleSuccess = async () => {
    handleOnSuccess();
  };

  return (
    <aside className="max-w-[303px] w-full bg-secondary/50 p-4 sticky left-0 top-0 h-full flex flex-col gap-2">
      <h2 className="text-lg font-bold mb-4">
        {server?.name || "No Server Selected"}
      </h2>
      <div
        className="text-xs text-white/50 flex justify-between w-full"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <span className="flex gap-4 hover:text-white">
          Text channels
          <ChevronRight
            className={cn("w-4 h-4 transition-all", {
              "rotate-90": !isCollapsed,
            })}
          />
        </span>
        <PlusIcon
          className="w-4 h-4 hover:text-white"
          onClick={(e) => {
            e.stopPropagation();
            setIsCreateChannelDialogOpen(true);
          }}
        />
      </div>
      {!isCollapsed ? (
        <ul className="space-y-1">
          {server?.channels?.map((channel) => (
            <li key={channel.id}>
              <ChannelItem
                serverId={server.id}
                channelId={channel.id}
                channelName={channel.name}
                isActive={channel.id === activeChannelId}
                handleSuccess={handleSuccess}
                handleChannelClick={handleChannelClick}
              />
            </li>
          ))}
        </ul>
      ) : (
        <ChannelItem
          key={channel?.id}
          serverId={server?.id}
          channelId={channel?.id}
          channelName={channel?.name}
          isActive={channel?.id === activeChannelId}
          handleSuccess={handleSuccess}
          handleChannelClick={handleChannelClick}
        />
      )}
      <CreateChannelDialog
        isOpen={isCreateChannelDialogOpen}
        handleClick={() => setIsCreateChannelDialogOpen(false)}
        serverId={server?.id || ""}
        handleSuccess={handleSuccess}
      />
    </aside>
  );
};
