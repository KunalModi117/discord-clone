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
interface FormData {
  name: string;
}

export const CreateChannelDialog = ({
  isOpen,
  handleClick,
  serverId,
}: {
  isOpen: boolean;
  handleClick: () => void;
  serverId: string;
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

  return (
    <Dialog open={isOpen} onOpenChange={handleClick}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Customise your server</DialogTitle>
          <DialogDescription>
            Give your new server a personality with a name. You can always
            change it later.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <InputField
            control={control}
            name="name"
            label="Server Name"
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
