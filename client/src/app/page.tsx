import { redirect } from "next/navigation";
import { routePath } from "@discord/utils/routePath";

export default function Page() {
  redirect(routePath.signIn);
}


