"use client";

import { getMethod } from "@discord/utils/request";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";

interface Channel {
  id: string;
  name: string;
  type: string;
  serverId: string;
  createdAt: string;
}

export const useGetChannelsByServer = () => {
  const [token, setToken] = useState<string | null>(null);
  const [serverId, setServerId] = useState<string>();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("token"));
    }
  }, []);

  const { data, isLoading, isSuccess, refetch, error } = useQuery<Channel[]>({
    queryKey: ["get-channels-by-server", serverId],
    queryFn: () =>
      getMethod(`/servers/${serverId}/channels`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    enabled: false,
  });

  useEffect(()=>{
    if(serverId && token){
        refetch();
    }
  },[serverId,token])

  const getChannels = useCallback((serverId: string) => {
    console.log('serverId,',serverId);
    setServerId(serverId);
  }, []);

  return {
    channels: data || [],
    isChannelsLoading: isLoading,
    isChannelsSuccess: isSuccess,
    getChannels,
    channelsError: error,
  };
};
