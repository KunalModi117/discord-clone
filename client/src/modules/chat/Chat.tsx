"use client";

import { useSocket } from "@discord/hooks/useSocket";
import { formatDateDivider } from "@discord/utils/date";
import { useMemberStore } from "@discord/utils/zustandStore";
import { PlusCircle } from "lucide-react";
import { nanoid } from "nanoid";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { MessageItem } from "./MessageItem";
import { MessageItemSkeleton } from "./MessageItemSkeleton";
import { useGetMe } from "./useGetMe";
import { Message, useGetMessageByChannelId } from "./useGetMessageByChannelId";
import { useGetMembersByServerId } from "../sidebar/hooks/useGetMembersByServerId";

import { useUploadThing } from "@discord/utils/uploadThing";
import { cn } from "@discord/lib/utils";

interface TempImageMessage extends Message {
  isTemp: true;
  tempId: string;
  uploadStatus: "PENDING" | "UPLOADING" | "UPLOADED" | "FAILED";
  progress?: number;
  type: "IMAGE" | "GIF";
}

interface ExtendedMessage extends Message {
  isTemp?: boolean;
  tempId?: string;
  uploadStatus?: "PENDING" | "UPLOADING" | "UPLOADED" | "FAILED";
  progress?: number;
}

export const Chat = () => {
  const { addTypingUser, removeTypingUser, setStatus } =
    useMemberStore.getState();
  const [messages, setMessages] = useState<ExtendedMessage[]>([]);
  const typingTimeoutRef = useRef<any>(null);
  const [newMessage, setNewMessage] = useState("");
  const searchParams = useSearchParams();
  const channelId = searchParams.get("channelId") ?? "";
  const typingMap = useMemberStore((s) => s.typingUsers);
  const typingUsers = typingMap[channelId] ?? [];

  const serverId = useMemberStore((s) => s.activeServerId);
  const { data } = useGetMembersByServerId({
    serverId: serverId || "",
  });
  const setMembers = useMemberStore((s) => s.setMembers);
  const members = useMemberStore((s) => s.members);
  const { socket } = useSocket({ channelId });
  const {
    messages: channelMessages,
    isLoading,
    isSuccess,
  } = useGetMessageByChannelId({
    channelId: channelId || "",
  });
  const scrollRef = useRef<HTMLDivElement>(null);
  const { me } = useGetMe();

  const { startUpload, isUploading } = useUploadThing(
    "imageAndGifUploader",
    {
      onClientUploadComplete: (res: any[]) => {
        if (res && res[0]) {
          const fileUrl = res[0].serverData.fileUrl;
          const fileKey = res[0].serverData.fileKey;
          const tempId = res[0].serverData.tempID;
          const isGif = fileUrl.toLowerCase().endsWith(".gif");

          setMessages((prevMessages) =>
            prevMessages.map((msg) =>
              msg.tempId === tempId
                ? {
                    ...msg,
                    content: fileUrl,
                    uploadStatus: "UPLOADED",
                    isTemp: false,
                  }
                : msg
            )
          );
          sendMessageToSocket(fileUrl, isGif ? "GIF" : "IMAGE", tempId);
        }
      },
      onUploadError: (error: Error) => {
        toast.error("Something went wrong with upload", {
          description: error.message,
        });
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.isTemp && msg.uploadStatus === "UPLOADING"
              ? { ...msg, uploadStatus: "FAILED" }
              : msg
          )
        );
      },
      onUploadBegin: (fileName) => {
        console.log("Upload began for:", fileName);
      },
      onUploadProgress: (p) => {
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.isTemp && msg.uploadStatus === "UPLOADING"
              ? { ...msg, progress: p }
              : msg
          )
        );
      },
    }
  );

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "instant",
      });
    }
  };

  const isUserNearBottom = () => {
    if (!scrollRef.current) return false;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    return scrollHeight - scrollTop - clientHeight < 900;
  };

  useEffect(() => {
    if (data) {
      setMembers(data);
    }
  }, [data, setMembers]);

  useEffect(() => {
    if (channelMessages?.length > 0) {
      setMessages(
        channelMessages.map((msg) => ({ ...msg, type: msg.type || "TEXT" }))
      );
    } else {
      setMessages([]);
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

    socket.on(
      "current:statuses",
      (statuses: Record<string, "online" | "offline">) => {
        for (const userId in statuses) {
          setStatus(userId, statuses[userId]);
        }
      }
    );

    socket.on("user:status", ({ userId, status }) => {
      setStatus(userId, status);
    });

    socket.on("typing:started", ({ userId }) => {
      addTypingUser(channelId, userId);
    });

    socket.on("typing:stopped", ({ userId }) => {
      removeTypingUser(channelId, userId);
    });

    socket.on("message:new", (message: ExtendedMessage) => {
      setMessages((prev) => {
        const tempIndex = prev.findIndex(
          (m) => m.tempId && m.tempId === message.tempId
        );
        let updated;
        if (tempIndex !== -1) {
          updated = [...prev];
          updated[tempIndex] = {
            ...message,
            isTemp: false,
            type: message.type || "TEXT",
          };
        } else {
          updated = [...prev, { ...message, type: message.type || "TEXT" }];
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
      socket.off("current:statuses");
      socket.off("user:status");
      socket.off("message:new");
      socket.off("typing:started");
      socket.off("typing:stopped");
    };
  }, [socket, channelId, setStatus, addTypingUser, removeTypingUser]);

  const handeleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    socket?.emit("typing:start", { channelId });
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket?.emit("typing:stop", { channelId });
    }, 2000);
  };

  const sendMessageToSocket = (
    content: string,
    type: "TEXT" | "IMAGE" | "GIF",
    tempId: string
  ) => {
    if (!me || !channelId) return;
    socket?.emit("message:send", {
      channelId,
      content: content,
      tempId,
      type: type,
    });
  };

  const handleSend = () => {
    if (!newMessage.trim()) return;
    const tempId = nanoid();
    sendMessageToSocket(newMessage, "TEXT", tempId);

    const tempMessage: ExtendedMessage = {
      id: tempId,
      tempId,
      content: newMessage,
      createdAt: new Date().toISOString(),
      user: me!,
      isTemp: true,
      type: "TEXT",
    };
    setMessages((prev) => [...prev, tempMessage]);
    setTimeout(scrollToBottom, 0);

    setNewMessage("");
  };

  const handleFileSelect = async (files: File[]) => {
    if (!me || !channelId || files.length === 0) return;

    const file = files[0];
    const tempId = nanoid();
    const isGif = file.type === "image/gif";

    const tempMessage: TempImageMessage = {
      id: tempId,
      tempId,
      content: URL.createObjectURL(file),
      createdAt: new Date().toISOString(),
      user: me,
      isTemp: true,
      type: isGif ? "GIF" : "IMAGE",
      uploadStatus: "UPLOADING",
      progress: 0,
    };

    setMessages((prev) => [...prev, tempMessage]);
    setTimeout(scrollToBottom, 0);

    try {
      await startUpload(files, { tempID: tempId });
    } catch (error) {
      console.error("Error initiating upload:", error);
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.tempId === tempId ? { ...msg, uploadStatus: "FAILED" } : msg
        )
      );
      toast.error("Failed to start upload", { description: error as string });
    }
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
                  <MessageItem
                    message={message}
                    showAvatarAndName={showAvatarAndName}
                  />
                </div>
              );
            })}
          </>
        )}
      </div>
      <div className="w-full lg:w-[calc(100vw-375px)] bg-secondary p-4 border-t border-input fixed bottom-0 pb-6 flex items-center gap-2">
        <label htmlFor="file-upload" className="cursor-pointer">
          <div
            className="
              ut-button:!bg-transparent ut-button:hover:!bg-gray-700 ut-button:!p-2 ut-button:!rounded-full
              ut-button:!border-none ut-button:!shadow-none ut-button:!w-auto ut-button:!h-auto ut-button:!aspect-square
              ut-label:!hidden ut-allowed-content:!hidden
            "
          >
            <PlusCircle
              className={cn(
                "h-6 w-6 text-secondary hover:fill-gray-200 fill-gray-400",
                { "cursor-not-allowed opacity-50": isUploading }
              )}
            />
          </div>
        </label>
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          multiple={false}
          disabled={isUploading}
          onChange={(e) => {
            if (e.target.files) {
              handleFileSelect(Array.from(e.target.files));
              e.target.value = "";
            }
          }}
          className="hidden"
        />

        <input
          type="text"
          placeholder="Type a message..."
          className="flex-grow p-2 bg-secondary rounded border border-input outline-none"
          value={newMessage}
          onChange={handeleInput}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
      </div>
      {typingUsers.length > 0 && (
        <div className="text-sm text-foreground absolute bottom-0 left-4">
          {typingUsers
            .map((id) => members.find((m) => m.user.id === id)?.user.username)
            .filter(Boolean)
            .join(", ")}{" "}
          {typingUsers.length === 1 ? "is typing..." : "are typing..."}
        </div>
      )}
    </div>
  );
};
