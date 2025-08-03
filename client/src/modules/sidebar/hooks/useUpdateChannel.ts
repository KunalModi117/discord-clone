import { patchMethod } from "@discord/utils/request";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useUpdateChannel = () => {
  const {
    mutateAsync: updateChannel,
    isPending,
    isSuccess,
  } = useMutation({
    mutationFn: ({ channelId, name }: { channelId: string; name: string }) => {
      const res = patchMethod(`/channels/${channelId}`, { name });
      return res;
    },
    onSuccess: () => {
      toast.success("Channel updated successfully");
    },
    onError: (err) => {
      toast.error("Something went wrong", { description: err.message });
    },
  });

  return { updateChannel, isPending, isSuccess };
};
