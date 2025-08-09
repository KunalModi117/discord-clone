import { postMethod } from "@discord/utils/request";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useJoinServer = () => {
  const router = useRouter();
  const {
    mutateAsync: joinServer,
    isPending,
    isSuccess,
  } = useMutation({
    mutationFn: async ({ inviteCode }: { inviteCode: string }) => {
      const res = await postMethod(`/servers/join`, { inviteCode });
      return res as { server: { id: string; channels: { id: string }[] } };
    },
    onSuccess: (data) => {
      toast.success("Server joined successfully");
      const firstChannelId = data?.server?.channels?.[0]?.id;
      if (data?.server?.id && firstChannelId) {
        router.push(`/${data.server.id}?channelId=${firstChannelId}`);
      }
    },
    onError: (err) => {
      toast.error("Something went wrong", { description: err.message });
    },
  });

  return { joinServer, isPending, isSuccess };
};
