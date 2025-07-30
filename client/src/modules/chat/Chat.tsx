"use client";

import { useSearchParams } from "next/navigation";
import { Message, useGetMessageByChannelId } from "./useGetMessageByChannelId";
import { useSocket } from "@discord/hooks/useSocket";
import { useEffect, useState } from "react";
import { MessageItem } from "./MessageItem";
import { MessageItemSkeleton } from "./MessageItemSkeleton";
import { formatDateDivider } from "@discord/utils/date";

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

  let lastDate = "";
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-clip p-4 gap-4">
        {isLoading
          ? Array.from({ length: 10 }).map((_, i) => (
              <MessageItemSkeleton key={i} />
            ))
          : messages?.map((message, i) => {
              const messageDate = formatDateDivider(message.createdAt);
              const showDateDivider = messageDate !== lastDate;
              const showAvatarAndName =
                i === 0 || messages[i - 1].user.id !== message.user.id;

              if (showDateDivider) lastDate = messageDate;

              return (
                <div key={message.id}>
                  {showDateDivider && (
                    <div className="flex items-center justify-center my-4">
                      <div className="border-t border-muted w-full"></div>
                      <span className="px-4 text-xs text-muted-foreground whitespace-nowrap">
                        {messageDate}
                      </span>
                      <div className="border-t border-muted w-full"></div>
                    </div>
                  )}

                  <MessageItem
                    message={message}
                    showAvatarAndName={showAvatarAndName}
                  />
                </div>
              );
            })}
      </div>
      <div className="w-full bg-secondary p-4 border-t border-input sticky bottom-0">
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
