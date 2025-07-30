// layout.tsx
import { getServers } from "../../apis/getServers";
import { getMe } from "../../apis/getMe";
import { redirect } from "next/navigation";
import { ChannelList } from "@discord/modules/sidebar/ChannelList";
import { Sidebar } from "@discord/modules/sidebar/Sidebar";
import { ChannelHeader } from "@discord/modules/sidebar/ChannelHeader";

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
      <aside className="max-w-[375px] w-full h-screen flex items-center space-y-4 sticky left-0 top-0">
        <Sidebar
          initialServers={servers || []}
          activeServerId={activeServerId || ""}
        />
        <ChannelList activeServer={activeServer} />
      </aside>
      <div className="flex flex-col bg-secondary h-full w-full">
        <ChannelHeader activeServer={activeServer} />
        <div className="w-full h-full">{children}</div>
      </div>
    </div>
  );
}
