"use client";

import Link from "next/link";
import { cn } from "@discord/lib/utils";
import { ServersData } from "@discord/app/apis/getServers";
import { useSearchParams } from "next/navigation";

interface ChannelListProps {
  activeServer?: ServersData;
}

export const ChannelList = ({ activeServer }: ChannelListProps) => {
  const searchParams = useSearchParams();
  const activeChannel = searchParams.get("channelId")??"";
  return (
    <aside className="w-64 bg-secondary/50 p-4">
      <h2 className="text-lg font-bold mb-4">
        {activeServer?.name || "No Server Selected"}
      </h2>
      <ul className="space-y-1">
        {activeServer?.channels?.map((channel) => (
          <li key={channel.id}>
            <Link
              href={`/${activeServer.id}?channelId=${channel.id}`}
              className={cn("block py-1 px-2 hover:bg-gray-600 rounded-md", {
                "bg-gray-600": channel.id === activeChannel,
              })}
            >
              # {channel.name}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};
