import { postMethod } from "@discord/utils/request";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useSignIn = () => {
  const { isPending, isSuccess, mutate } = useMutation({
    mutationFn: (data: { email: string; password: string }) =>
      postMethod("/auth/login", data),
    onSuccess: () => {
      toast.success("Login successful");
    },
    onError: (err) => {
      toast.error("Something went wrong", { description: err.message });
    },
  });

  return {
    isPending,
    signIn: mutate,
    isSuccess,
  };
};
