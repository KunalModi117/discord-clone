import { postMethod } from "@discord/utils/request";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useJoinServer = () => {
  const {
    mutateAsync: joinServer,
    isPending,
    isSuccess,
  } = useMutation({
    mutationFn: async ({ inviteCode }: { inviteCode: string }) => {
      const res = await postMethod(`/servers/join`, { inviteCode });
      return res;
    },
    onSuccess: () => {
      toast.success("Server joined successfully");
    },
    onError: (err) => {
      toast.error("Something went wrong", { description: err.message });
    },
  });

  return { joinServer, isPending, isSuccess };
};
