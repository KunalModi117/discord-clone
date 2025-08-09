import Image from "next/image";
import { Message } from "./useGetMessageByChannelId";
import {
  formatFullTimestamp,
  formatMessageTime,
  isMessageFromToday,
} from "@discord/utils/date";
import { cn } from "@discord/lib/utils";
import { X, RefreshCcw } from "lucide-react";
import { Avatar } from "@discord/components/Avatar";

interface MessageItemProps {
  message: Message & {
    isTemp?: boolean;
    tempId?: string;
    uploadStatus?: "PENDING" | "UPLOADING" | "UPLOADED" | "FAILED";
    progress?: number;
  };
  showAvatarAndName: boolean;
  onCancelUpload?: (tempId: string) => void;
  onRetryUpload?: (tempId: string) => void;
}

export function MessageItem({ message, showAvatarAndName, onCancelUpload, onRetryUpload }: MessageItemProps) {
  const isImageOrGif = message.type === "IMAGE" || message.type === "GIF";
  const isUploading = message.isTemp && message.uploadStatus === "UPLOADING";
  const isFailed = message.isTemp && message.uploadStatus === "FAILED";

  const renderContent = () => {
    if (isImageOrGif) {
      return (
        <div className="relative group">
          <Image
            src={message.content}
            alt={isImageOrGif ? "Uploaded media" : "GIF"}
            className={cn(
              "max-w-xs md:max-w-md lg:max-w-lg rounded-lg object-cover mt-1 max-h-[320px] w-fit",
              { "opacity-90": isUploading },
              { "ring-2 ring-red-500": isFailed }
            )}
            width={500}
            height={500}
          />

          {isUploading && (
            <>
              <div className="absolute inset-0 rounded-lg bg-black/30" />
              <div className="absolute left-3 bottom-3 right-12">
                <div className="h-2 w-full rounded bg-white/20 overflow-hidden">
                  <div
                    className="h-full bg-white/90 transition-all"
                    style={{ width: `${Math.min(100, Math.max(0, message.progress ?? 0))}%` }}
                  />
                </div>
                <div className="mt-1 text-xs text-white/90">
                  Uploading {Math.round(message.progress ?? 0)}%
                </div>
              </div>
              {message.tempId && (
                <button
                  aria-label="Cancel upload"
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white opacity-90 hover:bg-black/80"
                  onClick={() => onCancelUpload?.(message.tempId!)}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </>
          )}

          {isFailed && (
            <div className="absolute inset-0 rounded-lg bg-red-600/30 backdrop-blur-[1px] flex items-center justify-center">
              <div className="flex items-center gap-2 bg-background/90 px-3 py-1.5 rounded-full border border-red-500/50">
                <span className="text-xs text-red-200">Upload failed</span>
                {message.tempId && (
                  <button
                    className="text-xs flex items-center gap-1 px-2 py-1 rounded bg-red-500/80 hover:bg-red-500 text-white"
                    onClick={() => onRetryUpload?.(message.tempId!)}
                  >
                    <RefreshCcw className="h-3 w-3" /> Retry
                  </button>
                )}
              </div>
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
