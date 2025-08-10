"use client";

import { Button } from "@discord/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@discord/components/ui/dialog";
import { Input } from "@discord/components/ui/input";
import { toast } from "sonner";
import { Copy } from "lucide-react";

export const ShareInviteDialog = ({
  isOpen,
  handleClick,
  inviteCode,
  serverName,
}: {
  isOpen: boolean;
  handleClick: () => void;
  inviteCode: string;
  serverName: string;
}) => {
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(inviteCode);
      toast.success("Invite code copied to clipboard");
    } catch {
      toast.error("Failed to copy invite code");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClick}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite people to {serverName}</DialogTitle>
          <DialogDescription>
            Share this invite code to let others join your server.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-2">
          <Input value={inviteCode} readOnly className="font-mono" />
          <Button type="button" variant="secondary" onClick={copy} aria-label="Copy invite code">
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
