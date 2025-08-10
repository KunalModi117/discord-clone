import { getServers } from "@discord/app/apis/getServers";
import { LayoutFile } from "@discord/components/LayoutFile";

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ serverId?: string }>;
}) {
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
