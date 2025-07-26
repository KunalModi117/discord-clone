import { postMethod } from "@discord/utils/request";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";

export const useSignIn = () => {
  const { isPending, isSuccess, mutate, data } = useMutation({
    mutationFn: (data: { email: string; password: string }) =>
      postMethod("/auth/login", data),
  });

  useEffect(() => {
    if (data?.token) {
      localStorage.setItem("token", data.token);
    }
  }, [data]);

  return {
    isPending,
    signIn: mutate,
    isSuccess,
  };
};
