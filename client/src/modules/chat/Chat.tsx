"use client";

import { useSearchParams } from "next/navigation";
import { Message, useGetMessageByChannelId } from "./useGetMessageByChannelId";
import { useSocket } from "@discord/hooks/useSocket";
import { useEffect, useState } from "react";
import { MessageItem } from "./MessageItem";
import { MessageItemSkeleton } from "./MessageItemSkeleton";

export const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const searchParams = useSearchParams();
  const channelId = searchParams.get("channelId") ?? "";
  const { socket } = useSocket({ channelId });
  const { messages: channelMessages, isLoading } = useGetMessageByChannelId({
    channelId: channelId || "",
  });

  useEffect(() => {
    setMessages(channelMessages);
  }, [channelMessages]);

  useEffect(() => {
    if (!socket) return;

    socket.emit("join", channelId);

    socket.on("message:new", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.emit("leave", channelId);
      socket.off("message:new");
    };
  }, [socket, channelId]);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    socket?.emit("message:send", {
      channelId,
      content: newMessage,
    });
    setNewMessage("");
  };

  const getRandomCount = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;
  
  const skeletonCount = getRandomCount(3, 7);

  return (
    <div className="flex flex-col h-full p-4">
      <div className="flex-1 flex flex-col">
        {isLoading ? (
          Array.from({ length: skeletonCount }).map((_, index) => (
            <MessageItemSkeleton key={index} />
          ))
        ) : (
          messages?.map((msg, index) => {
            const prevMsg = messages[index - 1];
            const showHeader = !prevMsg || prevMsg.user.id !== msg.user.id;

            return (
              <MessageItem key={msg.id} message={msg} showHeader={showHeader} />
            );
          })
        )}
      </div>
      <div className="w-full sticky bottom-0 bg-secondary p-4 z-10">
        <input
          type="text"
          placeholder="Type a message..."
          className="w-full p-2 bg-secondary rounded border border-input"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
      </div>
    </div>
  );
};
