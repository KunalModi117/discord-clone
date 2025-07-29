"use client";

import { AddServerDialog } from "@discord/modules/sidebar/AddServerDialog";
import { useState } from "react";
import Link from "next/link";
import { ServersData } from "@discord/app/apis/getServers";
import { fetcher } from "@discord/utils/fetcher";

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
    <>
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
          <Link
            href={`/${server.id}?channelId=${server.channels[0].id}`}
            className="w-12 h-12 rounded-xl flex items-center justify-center hover:bg-gray-500 bg-gray-500 ml-3"
          >
            {server.name[0]}
          </Link>
        </div>
      ))}
      <AddServerDialog handleOnSuccess={handleOnSuccess} />
    </>
  );
};
