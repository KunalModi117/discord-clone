import { fetcher } from "@discord/utils/fetcher";
import { cookies } from "next/headers";

export const getMe = async () => {
  const cookieStore = await cookies();
  const cookiesString = cookieStore.toString();
  console.log(":cookiesString here ->", cookiesString);

  if (!cookiesString) {
    return null;
  }

  const response = await fetcher("/user/me", {
    headers: { Cookie: cookiesString },
  });

  return response;
};