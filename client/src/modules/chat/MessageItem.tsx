// components/MessageItem.tsx
import React from "react";
import Image from "next/image";
import { Message } from "./useGetMessageByChannelId";
import { getRelativeTime } from "@discord/utils/date";
import { cn } from "@discord/lib/utils";

interface Props {
  message: Message;
  showHeader: boolean;
}

export const MessageItem = ({ message, showHeader }: Props) => {
  return (
    <div className={cn("flex items-start gap-3 px-4 py-1 group hover:bg-secondary",{"mt-4":showHeader})}>
      {showHeader && (
        <div className="rounded-full mt-1 w-9 h-9 border border-input flex items-center justify-center">
          {message.user.username[0].toUpperCase()}
        </div>
      )}

      <div className="flex flex-col">
        {showHeader && (
          <div className="flex items-baseline gap-2">
            <span className="text-white font-medium text-sm">
              {message.user.username}
            </span>
            <span className="text-xs text-gray-400">
              {getRelativeTime(message.createdAt)}
            </span>
          </div>
        )}
        <p className={cn("text-sm text-gray-200", { "pl-12": !showHeader })}>
          {message.content}
        </p>
      </div>
    </div>
  );
};
