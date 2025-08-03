import { deleteMethod } from "@discord/utils/request";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useDeleteChannel = () => {
  const {
    mutateAsync: deleteChannel,
    isPending,
    isSuccess,
  } = useMutation({
    mutationFn: async (channelId: string) => {
      const res = await deleteMethod(`/channels/${channelId}`);
      return res;
    },
    onSuccess: () => {
      toast.success("Channel deleted successfully");
    },
    onError: (err) => {
      toast.error("Something went wrong", { description: err.message });
    },
  });

  return { deleteChannel, isPending, isSuccess };
};
