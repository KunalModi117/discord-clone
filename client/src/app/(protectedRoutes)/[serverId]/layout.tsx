import { getMe } from "@discord/app/apis/getMe";
import { getServers } from "@discord/app/apis/getServers";
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
    <div className="flex text-white">
      <Sidebar
        initialServers={servers || []}
        activeServerId={activeServerId || ""}
      />
      <div className="flex flex-col bg-secondary h-full w-full">
        <ChannelHeader activeServer={activeServer} />
        <div className="w-full h-full">{children}</div>
      </div>
    </div>
  );
}
