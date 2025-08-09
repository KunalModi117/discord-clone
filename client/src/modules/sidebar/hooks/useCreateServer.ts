import { useMutation } from "@tanstack/react-query";
import { postMethod } from "@discord/utils/request";
import { toast } from "sonner";

export const useCreateServer = () => {
  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: (data: { name: string; image?: string }) => postMethod("/servers", data),
    onSuccess: () => {
      console.log("Server created successfully");
      toast.success("Server created successfully");
    },
    onError: (err) => {
      console.log("Error creating server");
      toast.error("Something went wrong", { description: err.message });
    },
  });

  return {
    createServer: mutate,
    isPending,
    isSuccess,
  };
};
