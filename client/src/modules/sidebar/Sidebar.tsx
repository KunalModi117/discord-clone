"use client";

import { AddServerDialog } from "@discord/modules/sidebar/AddServerDialog";
import { useState } from "react";
import Link from "next/link";
import { ServersData } from "@discord/app/apis/getServers";
import { fetcher } from "@discord/utils/fetcher";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@discord/components/ui/tooltip";

export const Sidebar = ({
  initialServers,
  activeServerId,
}: {
  initialServers: ServersData[];
  activeServerId: string;
}) => {
  const [servers, setServers] = useState(initialServers);

  const handleOnSuccess = async () => {
    const res = await fetcher("/servers");
    setServers(res);
  };

  return (
    <div className="flex flex-col items-center py-4 space-y-4 bg-secondary h-full">
      {servers?.map((server) => (
        <div
          className="relative group flex items-center justify-center transition-all"
          key={server.id}
        >
          {server.id === activeServerId ? (
            <div className="h-full w-1 bg-white absolute left-0 rounded-se-2xl rounded-ee-2xl" />
          ) : (
            <div className="h-1/2 w-1 bg-white absolute left-0 rounded-se-2xl rounded-ee-2xl group-hover:block hidden" />
          )}
          <Tooltip>
            <TooltipTrigger>
              <Link
                href={`/${server.id}?channelId=${server.channels[0].id}`}
                className="w-12 h-12 rounded-xl flex items-center justify-center hover:bg-gray-500 bg-gray-500 mx-4"
              >
                {server.name[0]}
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">{server.name}</TooltipContent>
          </Tooltip>
        </div>
      ))}
      <AddServerDialog handleOnSuccess={handleOnSuccess} />
    </div>
  );
};
