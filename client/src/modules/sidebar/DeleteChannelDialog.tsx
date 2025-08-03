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
import { useDeleteChannel } from "./hooks/useDeleteChannel";
import { useEffect } from "react";

export const DeleteChannelDialog = ({
  isOpen,
  handleClick,
  handleOnSuccess,
  channelId,
  channelName,
}: {
  isOpen: boolean;
  handleClick: () => void;
  handleOnSuccess: () => void;
  channelId: string;
  channelName: string;
}) => {
  const { deleteChannel, isPending, isSuccess } = useDeleteChannel();
  const onSubmit = () => {
    deleteChannel(channelId);
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
          <DialogTitle>Delete your channel</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Are you sure you want to delete {channelName}?
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
