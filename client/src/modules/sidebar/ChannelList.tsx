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
    <aside className="max-w-[303px] w-full bg-card p-3 sticky left-0 top-0 h-full flex flex-col gap-2 border-r border-input/50">
      <h2 className="text-sm font-semibold text-white/80 mb-2 px-1">
        {server?.name || "No Server Selected"}
      </h2>
      <div
        className="text-[11px] uppercase tracking-wide text-white/40 hover:text-white/60 flex justify-between w-full px-1 cursor-pointer select-none"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <span className="flex items-center gap-1.5">
          <ChevronRight
            className={cn("w-3.5 h-3.5 transition-transform", {
              "rotate-90": !isCollapsed,
            })}
          />
          Text Channels
        </span>
        <PlusIcon
          className="w-4 h-4 text-white/60 hover:text-white"
          onClick={(e) => {
            e.stopPropagation();
            setIsCreateChannelDialogOpen(true);
          }}
        />
      </div>
      {!isCollapsed ? (
        <ul className="mt-1 space-y-1">
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
