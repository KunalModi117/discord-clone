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
import { useDeleteServer } from "./hooks/useDeleteServer";
import { useEffect } from "react";

export const DeleteServerDialog = ({
  isOpen,
  handleClick,
  handleOnSuccess,
  serverId,
  serverName,
}: {
  isOpen: boolean;
  handleClick: () => void;
  handleOnSuccess: () => void;
  serverId: string;
  serverName: string;
}) => {
  const { deleteServer, isPending, isSuccess } = useDeleteServer();
  const onSubmit = () => {
    deleteServer(serverId);
  };

  useEffect(() => {
    if (isSuccess) {
      handleOnSuccess();
      handleClick();
    }
  }, [isSuccess]);
  return (
    <Dialog open={isOpen} onOpenChange={handleClick}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete your server</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Are you sure you want to delete {serverName}?
        </DialogDescription>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">Cancel</Button>
        </DialogClose>
        <Button disabled={isPending} loading={isPending} onClick={onSubmit}>
          Delete
        </Button>
      </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
