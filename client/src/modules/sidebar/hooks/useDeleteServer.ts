import { deleteMethod } from "@discord/utils/request";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useDeleteServer = () => {
  const {
    mutateAsync: deleteServer,
    isPending,
    isSuccess,
  } = useMutation({
    mutationFn: async (serverId: string) => {
      const res = await deleteMethod(`/servers/${serverId}`);
      return res;
    },
    onSuccess: () => {
      toast.success("Server deleted successfully");
    },
    onError: (err) => {
      toast.error("Something went wrong", { description: err.message });
    },
  });

  return { deleteServer, isPending, isSuccess };
};
