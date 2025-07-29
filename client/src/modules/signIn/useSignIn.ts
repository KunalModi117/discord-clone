import { postMethod } from "@discord/utils/request";
import { useMutation } from "@tanstack/react-query";

export const useSignIn = () => {
  const { isPending, isSuccess, mutate, data } = useMutation({
    mutationFn: (data: { email: string; password: string }) =>
      postMethod("/auth/login", data),
  });

  return {
    isPending,
    signIn: mutate,
    isSuccess,
  };
};
