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
  const serverId = await params.serverId
  const activeServerId = serverId || servers?.[0]?.id;
  const activeServer = servers?.find((s) => s.id === activeServerId);

  return (
    <div className="flex min-h-screen text-white transition-all">
      <aside className="max-w-[72px] w-full flex flex-col items-center py-4 space-y-4 bg-secondary">
        <Sidebar
          initialServers={servers || []}
          activeServerId={activeServerId || ""}
        />
      </aside>
      <ChannelList activeServer={activeServer} />
      <main className="bg-secondary w-full relative overflow-hidden">
        <ChannelHeader activeServer={activeServer} />
        {children}
      </main>
    </div>
  );
}
