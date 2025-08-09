"use client";

import { ServersData } from "@discord/app/apis/getServers";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@discord/components/ui/context-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@discord/components/ui/tooltip";
import { AddServerDialog } from "@discord/modules/sidebar/AddServerDialog";
import { fetcher } from "@discord/utils/fetcher";
import { DeleteIcon, PlusIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { DeleteServerDialog } from "./DeleteServerDialog";
import { UpdateServerDialog } from "./UpdateServerDialog";
import { ChannelList } from "./ChannelList";
import { ShareInviteDialog } from "./ShareInviteDialog";

export const Sidebar = ({
  initialServers,
  activeServerId,
  handleChannelClick
}: {
  initialServers: ServersData[];
  activeServerId: string;
  handleChannelClick:(open:boolean)=>void
}) => {
  const [servers, setServers] = useState(initialServers);
  const [isOpen, setIsOpen] = useState(false);
  const [deleteModalServerId, setDeleteModalServerId] = useState<string | null>(null);
  const [updateModalServerId, setUpdateModalServerId] = useState<string | null>(null);
  const activeServer = servers?.find((s) => s.id === activeServerId);
  const [shareInviteServerId, setShareInviteServerId] = useState<string | null>(
    null
  );

  const handleClick = () => {
    setIsOpen((prev) => !prev);
  };
  const handleUpdateModal = (serverId: string) => {
    setUpdateModalServerId(updateModalServerId === serverId ? null : serverId);
  };
  const handleDeleteModal = (serverId: string) => {
    setDeleteModalServerId(deleteModalServerId === serverId ? null : serverId);
  };
  const handleShareInvite = (serverId: string) => {
    setShareInviteServerId(shareInviteServerId === serverId ? null : serverId);
  };

  const handleOnSuccess = async () => {
    const res = await fetcher("/servers");
    setServers(res);
  };

  return (
    <aside className="max-w-[375px] w-full h-screen flex items-center sticky left-0 top-0">
      <div className="flex flex-col items-center py-4 bg-secondary h-full gap-4">
        {servers?.map((server) => (
          <ContextMenu key={server.id}>
            <ContextMenuTrigger>
              <div className="relative group flex items-center justify-center transition-all">
                {server.id === activeServerId ? (
                  <div className="h-full w-1 bg-white absolute left-0 rounded-se-2xl rounded-ee-2xl" />
                ) : (
                  <div className="h-1/2 w-1 bg-white absolute left-0 rounded-se-2xl rounded-ee-2xl group-hover:block hidden" />
                )}
                <Tooltip>
                  <TooltipTrigger>
                    <Link
                      href={`/${server.id}?channelId=${server.channels[0].id}`}
                      className="w-12 h-12 rounded-xl flex items-center justify-center hover:bg-gray-500 bg-gray-500 mx-4 overflow-hidden"
                    >
                      {server.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={server.image}
                          alt={server.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-white font-medium">
                          {server.name[0].toUpperCase()}
                        </span>
                      )}
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">{server.name}</TooltipContent>
                </Tooltip>
              </div>
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem onClick={() => handleUpdateModal(server.id)}>
                Update Server
              </ContextMenuItem>
              <ContextMenuItem
                className="flex gap-2"
                onClick={() => handleDeleteModal(server.id)}
              >
                <span>Delete Server</span>
                <DeleteIcon />
              </ContextMenuItem>
              <ContextMenuItem onClick={() => handleShareInvite(server.id)}>
                Share Invite Code
              </ContextMenuItem>
            </ContextMenuContent>
            <UpdateServerDialog
              handleOnSuccess={handleOnSuccess}
              handleClick={() => handleUpdateModal(server.id)}
              isOpen={updateModalServerId === server.id}
              serverId={server.id}
              serverName={server.name}
              serverImage={server.image}
            />
            <DeleteServerDialog
              handleOnSuccess={handleOnSuccess}
              handleClick={() => handleDeleteModal(server.id)}
              isOpen={deleteModalServerId === server.id}
              serverId={server.id}
              serverName={server.name}
            />
            <ShareInviteDialog
              isOpen={shareInviteServerId === server.id}
              handleClick={() => handleShareInvite(server.id)}
              inviteCode={server.inviteCode}
              serverName={server.name}
            />
          </ContextMenu>
        ))}
        <button
          className="w-12 h-12 rounded-xl flex items-center justify-center hover:bg-primary bg-gray-500 mx-3"
          onClick={() => {
            setIsOpen(true);
          }}
        >
          <PlusIcon />
        </button>
        <AddServerDialog
          handleOnSuccess={handleOnSuccess}
          isOpen={isOpen}
          handleClick={handleClick}
        />
      </div>
      <ChannelList
        activeServer={activeServer}
        handleOnSuccess={handleOnSuccess}
        handleChannelClick={handleChannelClick}
      />
    </aside>
  );
};
