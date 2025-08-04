"use client";

import { ServersData } from "@discord/app/apis/getServers";
import { ChannelHeader } from "@discord/modules/sidebar/ChannelHeader";
import { Sidebar } from "@discord/modules/sidebar/Sidebar";
import { Sheet, SheetContent, SheetTitle } from "./ui/sheet";
import { useState, useEffect } from "react";

export const LayoutFile = ({
  children,
  servers,
  activeServerId,
  activeServer,
}: {
  children: React.ReactNode;
  servers: ServersData[] | null;
  activeServerId?: string;
  activeServer?: ServersData;
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    console.log('test');
    const checkScreenSize = () =>
      setIsMobile(window.innerWidth < 1024);

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

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

      <div className="flex flex-col bg-secondary h-full w-full">
        <ChannelHeader activeServer={activeServer} handleClick={openSheet} />
        <div className="w-full h-full overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};
