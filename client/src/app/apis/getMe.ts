import { fetcher } from "@discord/utils/fetcher";
import { cookies } from "next/headers";

export const getMe = async () => {
  const cookie = await cookies();
  const token = cookie.get("token")?.value;
  if (!token) return null;

  const response = await fetcher("/user/me", {
    headers: { Cookie: `token=${token}` },
  });
  return response;
};
