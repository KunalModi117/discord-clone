import { getMethod } from "@discord/utils/request";
import { useQuery } from "@tanstack/react-query";

interface Members {
  id: string;
  userId: string;
  serverId: string;
  role: string;
  createdAt: string;
  user: {
    id: string;
    username: string;
    avatar?: string;
  };
}

export const useGetMembersByServerId = ({ serverId }: { serverId: string }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["members", serverId],
    queryFn: () => getMethod(`/servers/${serverId}/members`),
  });

  return { data: data as Members[], isLoading, error };
};
