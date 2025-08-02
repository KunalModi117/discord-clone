"use client";

import { useSearchParams } from "next/navigation";
import { Message, useGetMessageByChannelId } from "./useGetMessageByChannelId";
import { useSocket } from "@discord/hooks/useSocket";
import { useEffect, useRef, useState } from "react";
import { MessageItem } from "./MessageItem";
import { MessageItemSkeleton } from "./MessageItemSkeleton";
import { formatDateDivider } from "@discord/utils/date";
import { nanoid } from "nanoid";

interface ExtendedMessage extends Message {
  isTemp?: boolean;
  tempId?: string;
}

export const Chat = () => {
  const [messages, setMessages] = useState<ExtendedMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const searchParams = useSearchParams();
  const channelId = searchParams.get("channelId") ?? "";
  const { socket } = useSocket({ channelId });
  const {
    messages: channelMessages,
    isLoading,
    isSuccess,
  } = useGetMessageByChannelId({
    channelId: channelId || "",
  });
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  const isUserNearBottom = () => {
    if (!scrollRef.current) return false;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    return scrollHeight - scrollTop - clientHeight < 900;
  };

  useEffect(() => {
    if (channelMessages?.length > 0) {
      setMessages(channelMessages);
    }
  }, [channelMessages]);

  useEffect(() => {
    if (isSuccess && messages.length > 0) {
      scrollToBottom();
    }
  }, [isSuccess, messages.length]);

  useEffect(() => {
    if (!socket) return;

    socket.emit("join", channelId);

    socket.on("message:new", (message: ExtendedMessage) => {
      setMessages((prev) => {
        const tempIndex = prev.findIndex(
          (m) => m.tempId && m.tempId === message.tempId
        );
        let updated;
        if (tempIndex !== -1) {
          updated = [...prev];
          updated[tempIndex] = { ...message, isTemp: false };
        } else {
          updated = [...prev, message];
        }
        setTimeout(() => {
          if (isUserNearBottom()) {
            scrollToBottom();
          }
        }, 0);
        return updated;
      });
    });

    return () => {
      socket.emit("leave", channelId);
      socket.off("message:new");
    };
  }, [socket, channelId]);

  const handleSend = () => {
    if (!newMessage.trim()) return;

    const tempId = nanoid();
    const tempMessage: ExtendedMessage = {
      id: tempId,
      tempId,
      content: newMessage,
      createdAt: new Date().toISOString(),
      user: {
        id: "test",
        username: "uzu",
        email: "uzu@gmail.com",
      },
      isTemp: true,
    };

    setMessages((prev) => [...prev, tempMessage]);
    socket?.emit("message:send", {
      channelId,
      content: newMessage,
      tempId,
    });
    setNewMessage("");
    setTimeout(scrollToBottom, 0);
  };

  let lastDate = "";
  return (
    <div className="flex flex-col h-full">
      <div
        className="overflow-y-scroll p-4 gap-4 h-[calc(100vh-136px)]"
        ref={scrollRef}
      >
        {isLoading ? (
          Array.from({ length: 10 }).map((_, i) => (
            <MessageItemSkeleton key={i} />
          ))
        ) : (
          <>
            <div className="flex w-full flex-col gap-2 h-[calc(100vh-170px)] place-content-end">
              <div className="rounded-full bg-gray-500 w-12 h-12 flex items-center justify-center text-3xl">
                #
              </div>
              <div className="text-xl text-white font-medium">Welcome!</div>
              <div className="text-sm text-white">
                This is the start of the channel.
              </div>
            </div>
            {messages?.map((message, i) => {
              const messageDate = formatDateDivider(message.createdAt);
              const showDateDivider = messageDate !== lastDate;
              const showAvatarAndName =
                i === 0 ||
                messages[i - 1].user.id !== message.user.id ||
                messageDate !== lastDate;

              if (showDateDivider) lastDate = messageDate;

              return (
                <div key={message.tempId || message.id}>
                  {showDateDivider && (
                    <div className="flex items-center justify-center my-4">
                      <div className="border-t border-muted w-full"></div>
                      <span className="px-4 text-xs text-muted-foreground whitespace-nowrap">
                        {messageDate}
                      </span>
                      <div className="border-t border-muted w-full"></div>
                    </div>
                  )}
                  <div className={message.isTemp ? "opacity-70" : ""}>
                    <MessageItem
                      message={message}
                      showAvatarAndName={showAvatarAndName}
                    />
                  </div>
                </div>
              );
            })}
          </>
        )}
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
