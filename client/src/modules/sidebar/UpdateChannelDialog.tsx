"use client";

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
import { useReactHookForm } from "@discord/hooks/useReactHookForm";
import { useEffect } from "react";
import { channelSchema } from "./channelSchema";
import { useUpdateChannel } from "./hooks/useUpdateChannel";

interface FormData {
  name: string;
}

export const UpdateChannelDialog = ({
  handleOnSuccess,
  handleClick,
  isOpen,
  channelId,
  channelName,
}: {
  handleOnSuccess: () => void;
  handleClick: () => void;
  isOpen: boolean;
  channelId: string;
  channelName: string;
}) => {
  const { control, handleSubmit, errors } = useReactHookForm(channelSchema, {
    name: channelName,
  });
  const { updateChannel, isPending, isSuccess } = useUpdateChannel();
  const onSubmit = (data: FormData) => {
    updateChannel({ channelId, name: data.name });
  };

  useEffect(() => {
    if (isSuccess) {
      handleOnSuccess();
      handleClick();
    }
  }, [isSuccess]);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClick}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update your channel</DialogTitle>
            <DialogDescription>
              Give your channel a personality with a name.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
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
              <Button disabled={isPending} loading={isPending}>
                Update
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
