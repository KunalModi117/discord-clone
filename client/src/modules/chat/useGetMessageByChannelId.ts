import { useQuery } from "@tanstack/react-query";
import { getMethod } from "@discord/utils/request";

export interface Message {
    id: string;
    content: string;
    createdAt: string;
    user: {
        id: string;
        username: string;
        email: string;
    };
}

export const useGetMessageByChannelId = ({
  channelId,
}: {
  channelId: string;
}) => {
  const { data, isLoading } = useQuery({
    queryKey: ["chat-messages", channelId],
    queryFn: () => getMethod(`/channels/${channelId}/messages`),
  });

  return {
    messages: data as Message[],
    isLoading,
  };
};
