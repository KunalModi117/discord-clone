"use client";

import { ChannelHeader } from "@discord/modules/sidebar/ChannelHeader";
import { Sidebar } from "@discord/modules/sidebar/Sidebar";
import { Sheet, SheetContent, SheetTitle } from "./ui/sheet";
import { useState, useEffect } from "react";
import { MembersSidebar } from "@discord/modules/sidebar/MembersSidebar";
import { useGetMe } from "@discord/modules/chat/useGetMe";
import { redirect } from "next/navigation";
import { Loader } from "./Loader/Loader";
import { useGetServers } from "@discord/hooks/useGetServers";

export const LayoutFile = ({
  children,
  activeServerId,
}: {
  children: React.ReactNode;
  activeServerId?: string;
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isShowMembers, setIsShowMembers] = useState(false);

  const handleMembersClick = () => setIsShowMembers((prev) => !prev);
  const { me, isLoading } = useGetMe();
  const { servers } = useGetServers();
  const activeServer = servers?.find((s) => s.id === activeServerId);

  useEffect(() => {
    if (!isLoading && !me) {
      redirect("/sign-in");
    }
  }, [isLoading, me]);

  useEffect(() => {
    const checkScreenSize = () => setIsMobile(window.innerWidth < 1024);

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  if (!me) {
    return (
      <div className="flex items-center justify-center h-full">
        You&apos;re not authorized to access this page
      </div>
    );
  }

  const openSheet = () => setIsOpen(true);
  const handleSheet = (open: boolean) => setIsOpen(open);

  return (
    <div className="flex text-white h-full">
      {isMobile ? (
        <Sheet open={isOpen} onOpenChange={handleSheet}>
          <SheetContent side="left" className="max-w-[375px] w-full">
            <SheetTitle className="hidden" />
            <Sidebar
              initialServers={servers || []}
              activeServerId={activeServerId || ""}
              handleChannelClick={handleSheet}
            />
          </SheetContent>
        </Sheet>
      ) : (
        <div className="w-[375px] shrink-0">
          <Sidebar
            initialServers={servers || []}
            activeServerId={activeServerId || ""}
            handleChannelClick={handleSheet}
          />
        </div>
      )}

      <div className="flex flex-col bg-secondary h-full w-full relative">
        <ChannelHeader
          activeServer={activeServer}
          handleClick={openSheet}
          handleMembersClick={handleMembersClick}
        />
        <div className="flex gap-2">
          <div className="w-full h-full overflow-y-auto">{children}</div>
          <MembersSidebar
            activeServerId={activeServerId}
            isShowMembers={isShowMembers}
          />
        </div>
      </div>
    </div>
  );
};
