import { getMethod } from "@discord/utils/request";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";

interface User {
  id: string;
  email: string;
  username: string;
  createdAt: string;
}

interface Me {
  user: User;
}

export const useGetMe = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await getMethod("/user/me");
      return res as Me;
    },
  });

  useEffect(() => {
    if (isError) {
      toast.error("Something went wrong", { description: error?.message });
    }
  }, [isError, error]);

  return { me: data?.user, isLoading, isError, error };
};
