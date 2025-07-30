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
        <p
          className={cn("text-sm text-gray-200", {
            "pl-12": !showAvatarAndName,
          })}
        >
          {message.content}
        </p>
      </div>
    </div>
  );
}
