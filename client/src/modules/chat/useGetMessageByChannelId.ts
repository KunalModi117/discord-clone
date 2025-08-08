import { useQuery } from "@tanstack/react-query";
import { getMethod } from "@discord/utils/request";
import { useEffect } from "react";
import { toast } from "sonner";

export interface Message {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    username: string;
    avatar?: string;
  };
  type: "TEXT" | "IMAGE" | "GIF";
}

export const useGetMessageByChannelId = ({
  channelId,
}: {
  channelId: string;
}) => {
  const { data, isLoading, isSuccess, isError, error } = useQuery({
    queryKey: ["chat-messages", channelId],
    queryFn: () => getMethod(`/channels/${channelId}/messages`),
  });

  useEffect(() => {
    if (isError) {
      toast.error("Something went wrong", { description: error?.message });
    }
  }, [isError, error]);

  return {
    messages: data as Message[],
    isLoading,
    isSuccess,
  };
};
