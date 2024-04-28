"use client";
import { Plus } from "lucide-react";
import React from "react";
import { ActionTooltip } from "@/components/ActionTooltip";
import { useModal } from "../../../hooks/useModalStore";

const NavigationAction = () => {
  const { onOpen } = useModal();
  return (
    <ActionTooltip align="center" side="right" label="Add a server">
      <div>
        <button
          className="group flex items-center"
          onClick={() => onOpen("createServer")}
        >
          <div className="flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden items-center justify-center bg-background dark:bg-neutral-700 group-hover:bg-emerald-500">
            <Plus
              className="group-hover:text-white transition text-emerald-500"
              size={25}
            />
          </div>
        </button>
      </div>
    </ActionTooltip>
  );
};

export default NavigationAction;
