import { LayoutFile } from "@discord/components/LayoutFile";

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ serverId?: string }>;
}) {
  const { serverId } = await params;
  return <LayoutFile activeServerId={serverId}>{children}</LayoutFile>;
}
