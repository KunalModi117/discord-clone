import { patchMethod } from "@discord/utils/request";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useUpdateServer = () => {
  const {
    mutateAsync: updateServer,
    isPending,
    isSuccess,
  } = useMutation({
    mutationFn: ({ serverId, name, image }: { serverId: string; name: string; image?: string }) => {
      const res = patchMethod(`/servers/${serverId}`, { name, image });
      return res;
    },
    onSuccess: () => {
      toast.success("Server updated successfully");
    },
    onError: (err) => {
      toast.error("Something went wrong", { description: err.message });
    },
  });

  return { updateServer, isPending, isSuccess };
};
