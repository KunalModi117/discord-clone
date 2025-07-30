import { postMethod } from "@discord/utils/request";
import { useMutation } from "@tanstack/react-query";

export const useCreateChannel = () => {
  const { isSuccess, isPending,mutate
   } = useMutation({
    mutationFn: ({
      serverId,
      name,
      type="text",
    }: {
      serverId: string;
      name: string;
      type?: string;
    }) => postMethod(`/servers/${serverId}/channels`, { name, type }),
    onSuccess: () => {
      console.log("Channel created successfully");
    },
    onError: () => {
      console.log("Error creating channel");
    },
  });

  return {
    isChannelCreated: isSuccess,
    isChannelCreating: isPending,
    createChannel:mutate
  };
};
