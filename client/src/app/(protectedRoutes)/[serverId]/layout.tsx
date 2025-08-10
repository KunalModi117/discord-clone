import { getMe } from "@discord/app/apis/getMe";
import { getServers } from "@discord/app/apis/getServers";
import { LayoutFile } from "@discord/components/LayoutFile";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ serverId?: string }>;
}) {
  const me = await getMe();
  console.log(":me api calls response here - >: ", me, " :me response ends here:");
  // if (!me) redirect("/sign-in");

  const servers = await getServers();
  const { serverId } = await params;
  const activeServerId = serverId || servers?.[0]?.id;
  const activeServer = servers?.find((s) => s.id === activeServerId);

  return (
    <LayoutFile
      servers={servers}
      activeServerId={activeServerId}
      activeServer={activeServer}
    >
      {children}
    </LayoutFile>
  );
}
