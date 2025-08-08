import Image from "next/image";
import { Message } from "./useGetMessageByChannelId";
import {
  formatFullTimestamp,
  formatMessageTime,
  isMessageFromToday,
} from "@discord/utils/date";
import { cn } from "@discord/lib/utils";
import { Avatar } from "@discord/components/Avatar";

interface MessageItemProps {
  message: Message & {
    isTemp?: boolean;
    tempId?: string;
    uploadStatus?: "PENDING" | "UPLOADING" | "UPLOADED" | "FAILED";
    progress?: number;
  };
  showAvatarAndName: boolean;
}

export function MessageItem({ message, showAvatarAndName }: MessageItemProps) {
  const isImageOrGif = message.type === "IMAGE" || message.type === "GIF";
  const isUploading = message.isTemp && message.uploadStatus === "UPLOADING";
  const isFailed = message.isTemp && message.uploadStatus === "FAILED";

  const renderContent = () => {
    if (isImageOrGif) {
      return (
        <div className="relative">
          <Image
            src={message.content}
            alt={isImageOrGif ? "Uploaded media" : "GIF"}
            className={cn(
              "max-w-xs md:max-w-md lg:max-w-lg rounded-lg object-contain mt-1 max-h-[300px] w-fit",
              { "opacity-50 blur-sm": isUploading || isFailed }
            )}
            width={500}
            height={500}
          />
          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white rounded-lg">
              <div className="relative w-10 h-10 animate-spin">
                <svg
                  className="absolute top-0 left-0 w-full h-full"
                  viewBox="0 0 36 36"
                >
                  <circle
                    className="fill-black"
                    cx="18"
                    cy="18"
                    r="15.9155"
                    strokeWidth="3"
                    stroke="transparent"
                  />
                  <circle
                    className="fill-black"
                    cx="18"
                    cy="18"
                    r="15.9155"
                    strokeWidth="3"
                    stroke="currentColor"
                    strokeDasharray="110"
                    strokeDashoffset="40"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          )}
          {isFailed && (
            <div className="absolute inset-0 flex items-center justify-center bg-red-600 bg-opacity-75 text-white text-sm font-bold rounded-lg">
              Failed to upload ❌
            </div>
          )}
        </div>
      );
    }
    return (
      <p className={cn("text-white", { "opacity-50": message.isTemp })}>
        {message.content}
      </p>
    );
  };

  return (
    <div
      className={cn(
        "flex items-start gap-3 px-4 py-1 group hover:bg-secondary",
        { "mt-4": showAvatarAndName }
      )}
    >
      {showAvatarAndName && (
        <Avatar
          src={message.user.avatar}
          alt={message.user.username}
          username={message.user.username}
          size="md"
          className="mt-1"
        />
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
            { "pl-12": !showAvatarAndName}
          )}
        >
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
