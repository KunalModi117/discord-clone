"use client"

import { getMethod } from "@discord/utils/request";
import { useQuery } from "@tanstack/react-query";

interface Channel {
  id: string;
  name: string;
  type: string;
  serverId: string;
  createdAt: string;
}

interface ServersData {
  id: string;
  name: string;
  ownerId: string;
  inviteCode: string;
  createdAt: string;
  channels: Channel[];
}

export const useGetServers = () => {
  const { refetch, isLoading, isSuccess, data } = useQuery({
    queryKey: ["get-servers"],
    queryFn: () =>
      getMethod("/servers"),
    enabled: false,
  });
  const serverData = data as ServersData[];

  return {
    getServers: refetch,
    isServersLoading: isLoading,
    isServersLoaded: isSuccess,
    servers: serverData,
  };
};
