"use client";

import { useGetServers } from "@discord/hooks/useGetServers";
import { AddServerDialog } from "@discord/modules/sidebar/AddServerDialog";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Page = () => {
  const { getServers, isServersLoaded, servers } = useGetServers();
  const router = useRouter();

  useEffect(() => {
    if (isServersLoaded) {
      if (servers.length) {
        router.push(`/${servers[0].id}?channelId=${servers[0].channels[0].id}`);
      }
    }
  }, [isServersLoaded]);

  return (
    <AddServerDialog
      handleOnSuccess={() => {
        getServers();
      }}
      handleClick={() => {}}
      isOpen={true}
    />
  );
};

export default Page;
