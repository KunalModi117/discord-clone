// app/server/[serverId]/[channelId]/page.tsx
import { notFound } from "next/navigation";

const messages = {
  channel1: [
    { id: 1, user: "Alice", text: "Hey, what's up?" },
    { id: 2, user: "Bob", text: "Just chilling!" },
  ],
  channel3: [{ id: 3, user: "Admin", text: "Welcome to Server Two!" }],
};

export default function ChannelPage({
  params,
}: {
  params: { serverId: string; channelId: string };
}) {
  const channelMessages = messages[params.channelId as keyof typeof messages];

  if (!channelMessages) {
    notFound();
  }

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-xl font-bold mb-4">Channel: {params.channelId}</h2>
      <div className="flex-1 overflow-y-auto">
        {channelMessages.map((message) => (
          <div key={message.id} className="mb-2">
            <span className="font-bold">{message.user}: </span>
            <span>{message.text}</span>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <input
          type="text"
          placeholder="Type a message..."
          className="w-full p-2 bg-gray-800 rounded"
        />
      </div>
    </div>
  );
}
