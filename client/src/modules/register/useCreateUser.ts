import { postMethod } from "@discord/utils/request";
import { useMutation } from "@tanstack/react-query";

export const useCreateUser = () => {
  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: (userData: {
      userName: string;
      email: string;
      password: string;
    }) => {
      const data = {
        username: userData.userName,
        email: userData.email,
        password: userData.password,
      };
      return postMethod("/auth/register", data);
    },
    onSuccess: (response) => {
      console.log("User created successfully:", response);
    },
  });

  return { createUser: mutate, isPending, isSuccess };
};
