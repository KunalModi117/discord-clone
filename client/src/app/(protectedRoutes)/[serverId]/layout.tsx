import { getMe } from "@discord/app/apis/getMe";
import { getServers } from "@discord/app/apis/getServers";
import { LayoutFile } from "@discord/components/LayoutFile";
import { ChannelHeader } from "@discord/modules/sidebar/ChannelHeader";
import { Sidebar } from "@discord/modules/sidebar/Sidebar";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { serverId?: string };
}) {
  const me = await getMe();
  if (!me) redirect("/sign-in");

  const servers = await getServers();
  const serverId = params.serverId;
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
