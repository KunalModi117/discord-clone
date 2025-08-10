import { fetcher } from "@discord/utils/fetcher";
import { cookies } from "next/headers";

export const getMe = async () => {
  const cookie = await cookies();
  console.log(":cookie here - >: ", cookie, " :cookie ends:");
  const token = cookie.get("token")?.value;
  console.log(":token here - >: ", token, " :token ends:");
  if (!token) return null;

  const response = await fetcher("/user/me", {
    headers: { Cookie: `token=${token}` },
  });
  return response;
};
