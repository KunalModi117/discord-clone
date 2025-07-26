import Link from "next/link";

const servers = [
  { id: "server1", name: "Server One" },
  { id: "server2", name: "Server Two" },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen text-white">
      <aside className="max-w-[72px] w-full flex flex-col items-center py-4 space-y-4">
        {servers.map((server) => (
          <Link
            key={server.id}
            href={`/${server.id}`}
            className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center hover:bg-gray-500"
          >
            {server.name[0]}
          </Link>
        ))}
      </aside>
      <main className="flex-1">{children}</main>
    </div>
  );
}
