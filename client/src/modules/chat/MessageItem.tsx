// components/MessageItem.tsx
import Image from "next/image";
import { Message } from "./useGetMessageByChannelId";
import {
  formatFullTimestamp,
  formatMessageTime,
  isMessageFromToday,
} from "@discord/utils/date";
import { cn } from "@discord/lib/utils";

interface MessageItemProps {
  message: Message;
  showAvatarAndName: boolean;
}

export function MessageItem({ message, showAvatarAndName }: MessageItemProps) {
  const isImageOrGif = message.type === "IMAGE" || message.type === "GIF";
  const renderContent = () => {
    if (isImageOrGif) {
      return (
        <Image
          src={message.content}
          alt={message.type === "IMAGE" ? "Uploaded image" : "GIF"}
          className="max-w-xs md:max-w-md lg:max-w-lg rounded-lg object-contain mt-1 max-h-[300px] w-fit"
          width={500}
          height={500}
        />
      );
    }
    return <p className="text-white">{message.content}</p>;
  };

  return (
    <div
      className={cn(
        "flex items-start gap-3 px-4 py-1 group hover:bg-secondary",
        { "mt-4": showAvatarAndName }
      )}
    >
      {showAvatarAndName && (
        <div className="rounded-full mt-1 w-9 h-9 border border-input flex items-center justify-center">
          {message.user.username[0].toUpperCase()}
        </div>
      )}

      <div className="flex flex-col">
        {showAvatarAndName && (
          <div className="flex items-baseline gap-2">
            <span className="font-semibold text-white">
              {message.user.username}
            </span>
            <span className="text-xs text-muted-foreground">
              {isMessageFromToday(message.createdAt)
                ? formatMessageTime(message.createdAt)
                : formatFullTimestamp(message.createdAt)}
            </span>
          </div>
        )}
        <div
          className={cn(
            "text-sm text-foreground break-words whitespace-pre-wrap",
            { "pl-12": !showAvatarAndName }
          )}
        >
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
