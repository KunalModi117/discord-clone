import { useMutation } from "@tanstack/react-query";
import { postMethod } from "@discord/utils/request";

export const useCreateServer = () => {
  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: (data: { name: string }) => postMethod("/servers", data),
    onSuccess: () => {
      console.log("Server created successfully");
    },
    onError: () => {
      console.log("Error creating server");
    },
  });

  return {
    createServer: mutate,
    isPending,
    isSuccess,
  };
};
