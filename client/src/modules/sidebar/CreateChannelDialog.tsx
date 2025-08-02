import { InputField } from "@discord/components/InputField";
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
import { useCreateChannel } from "./useCreateChannel";
import { useReactHookForm } from "@discord/hooks/useReactHookForm";
import { channelSchema } from "./channelSchema";
import { useEffect } from "react";
interface FormData {
  name: string;
}

export const CreateChannelDialog = ({
  isOpen,
  handleClick,
  serverId,
  handleSuccess,
}: {
  isOpen: boolean;
  handleClick: () => void;
  serverId: string;
  handleSuccess: () => void;
}) => {
  const { createChannel, isChannelCreated, isChannelCreating } =
    useCreateChannel();
  const { control, handleSubmit, errors } = useReactHookForm(channelSchema);

  const onSubmit = (data: FormData) => {
    createChannel({
      serverId: serverId,
      name: data.name,
    });
  };

  useEffect(() => {
    if (isChannelCreated) {
      handleSuccess();
      handleClick();
    }
  }, [isChannelCreated]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClick}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Channel</DialogTitle>
          <DialogDescription>
            Create a new channel for your server.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <InputField
            control={control}
            name="name"
            label="Channel Name"
            required
            message={errors.name?.message}
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button disabled={isChannelCreating} loading={isChannelCreating}>
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
