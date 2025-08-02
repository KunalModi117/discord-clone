"use client";

import Link from "next/link";
import { cn } from "@discord/lib/utils";
import { ServersData } from "@discord/app/apis/getServers";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronRight, PlusIcon } from "lucide-react";
import { CreateChannelDialog } from "./CreateChannelDialog";
import { useGetServers } from "@discord/hooks/useGetServers";

interface ChannelListProps {
  activeServer?: ServersData;
}

export const ChannelList = ({ activeServer }: ChannelListProps) => {
  const [server, setServer] = useState<ServersData | null>(null);
  const [isCreateChannelDialogOpen, setIsCreateChannelDialogOpen] =
    useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const searchParams = useSearchParams();
  const activeChannelId = searchParams.get("channelId") ?? "";
  const channel = server?.channels?.find(
    (channel) => channel.id === activeChannelId
  );
  const { getServers, servers, isServersLoaded } = useGetServers();

  useEffect(() => {
    if (activeServer) {
      setServer(activeServer);
    }
  }, [activeServer]);

  useEffect(() => {
    if (isServersLoaded) {
      setServer(servers?.find((s) => s.id === activeServer?.id) ?? null);
    }
  }, [isServersLoaded]);

  const handleSuccess = async () => {
    getServers();
  };

  return (
    <aside className="max-w-[303px] w-full bg-secondary/50 p-4 sticky left-0 top-0 h-full flex flex-col gap-2">
      <h2 className="text-lg font-bold mb-4">
        {server?.name || "No Server Selected"}
      </h2>
      <button
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
          onClick={() => setIsCreateChannelDialogOpen(true)}
        />
      </button>
      {!isCollapsed ? (
        <ul className="space-y-1">
          {server?.channels?.map((channel) => (
            <li key={channel.id}>
              <Link
                href={`/${server.id}?channelId=${channel.id}`}
                className={cn("block py-1 px-2 hover:bg-gray-600 rounded-md", {
                  "bg-gray-600": channel.id === activeChannelId,
                })}
              >
                # {channel.name}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <Link
          href={`/${server?.id}?channelId=${channel?.id}`}
          className={cn("block py-1 px-2 hover:bg-gray-600 rounded-md", {
            "bg-gray-600": channel?.id === activeChannelId,
          })}
        >
          # {channel?.name}
        </Link>
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
