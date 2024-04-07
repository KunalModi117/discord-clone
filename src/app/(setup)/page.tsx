import { db } from "@/lib/db";
import { initialprofile } from "@/lib/initial-profile";
import { redirect } from "next/navigation";

const SetUpPage = async () => {
  const profile = await initialprofile();
  const server = await db.server.findFirst({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });
  if (server) {
    return redirect(`/servers/${server.id}`);
  }
  return <div>Create a Server</div>;
};

export default SetUpPage;
