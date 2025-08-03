import { postMethod } from "@discord/utils/request";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useCreateChannel = () => {
  const { isSuccess, isPending, mutate } = useMutation({
    mutationFn: ({
      serverId,
      name,
      type = "text",
    }: {
      serverId: string;
      name: string;
      type?: string;
    }) => postMethod(`/servers/${serverId}/channels`, { name, type }),
    onSuccess: () => {
      console.log("Channel created successfully");
      toast.success("Channel created successfully");
    },
    onError: (err) => {
      console.log("Error creating channel");
      toast.error("Something went wrong", { description: err.message });
    },
  });

  return {
    isChannelCreated: isSuccess,
    isChannelCreating: isPending,
    createChannel: mutate,
  };
};
