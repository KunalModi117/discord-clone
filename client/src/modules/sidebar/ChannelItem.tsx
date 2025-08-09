import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@discord/components/ui/dropdown-menu";
import { cn } from "@discord/lib/utils";
import { Settings } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { UpdateChannelDialog } from "./UpdateChannelDialog";
import { DeleteChannelDialog } from "./DeleteChannelDialog";

interface Props {
  serverId?: string;
  channelId?: string;
  channelName?: string;
  isActive: boolean;
  handleSuccess: () => void;
  handleChannelClick: (open: boolean) => void;
}

export const ChannelItem = ({
  serverId,
  channelId,
  channelName,
  isActive,
  handleSuccess,
  handleChannelClick,
}: Props) => {
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleUpdateModal = () => {
    setIsUpdateModalOpen((prev) => !prev);
  };

  const handleDeleteModal = () => {
    setIsDeleteModalOpen((prev) => !prev);
  };

  return (
    <>
      <Link
        href={`/${serverId}?channelId=${channelId}`}
        onClick={(e) => {
          e.stopPropagation();
          handleChannelClick(false);
        }}
        className={cn(
          "flex items-center justify-between px-2 py-1 rounded hover:bg-white/5 transition-colors",
          {
            "bg-white/10 text-white": isActive,
          }
        )}
      >
        <span className={cn("text-sm text-white/80 group-hover:text-white transition-colors", {"text-white": isActive})}># {channelName}</span>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Settings className="w-4 h-4 text-white/70 hover:text-white" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel onClick={handleUpdateModal}>
              Update Channel
            </DropdownMenuLabel>
            <DropdownMenuLabel onClick={handleDeleteModal}>
              Delete Channel
            </DropdownMenuLabel>
          </DropdownMenuContent>
        </DropdownMenu>
      </Link>
      <UpdateChannelDialog
        isOpen={isUpdateModalOpen}
        handleClick={handleUpdateModal}
        channelId={channelId || ""}
        channelName={channelName || ""}
        handleOnSuccess={handleSuccess}
      />
      <DeleteChannelDialog
        isOpen={isDeleteModalOpen}
        handleClick={handleDeleteModal}
        channelId={channelId || ""}
        channelName={channelName || ""}
        handleOnSuccess={handleSuccess}
      />
    </>
  );
};
