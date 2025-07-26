import { notFound } from "next/navigation";
const servers = {
  server1: {
    id: "server1",
    name: "Server One",
    channels: [
      { id: "channel1", name: "General" },
      { id: "channel2", name: "Random" },
    ],
  },
  server2: {
    id: "server2",
    name: "Server Two",
    channels: [
      { id: "channel3", name: "Announcements" },
      { id: "channel4", name: "Gaming" },
    ],
  },
};

export default function ServerLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { serverId: string };
}) {
  const server = servers[params.serverId as keyof typeof servers];

  if (!server) {
    notFound();
  }

  return (
    <div className="flex flex-1 h-full">
      {/* Channel Sidebar */}
      <aside className="w-64 bg-gray-700 p-4">
        <h2 className="text-lg font-bold mb-4">{server.name}</h2>
        <ul>
          {server.channels.map((channel) => (
            <li key={channel.id}>
              <button
                // href={`/server/${server.id}/${channel.id}`}
                className="block py-2 px-4 hover:bg-gray-600 rounded"
              >
                # {channel.name}
              </button>
            </li>
          ))}
        </ul>
      </aside>
      {/* Chat Area */}
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
}
