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
import { createServerSchema } from "./createServerSchema";
import { useUpdateServer } from "./hooks/useUpdateServer";

interface FormData {
  serverName: string;
}

export const UpdateServerDialog = ({
  handleOnSuccess,
  handleClick,
  isOpen,
  serverId,
  serverName,
}: {
  handleOnSuccess: () => void;
  handleClick: () => void;
  isOpen: boolean;
  serverId: string;
  serverName: string;
}) => {
  const { control, handleSubmit, errors } = useReactHookForm(
    createServerSchema,
    { serverName }
  );
  const { updateServer, isPending, isSuccess } = useUpdateServer();
  const onSubmit = (data: FormData) => {
    updateServer({ serverId, name: data.serverName });
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
            <DialogTitle>Update your server</DialogTitle>
            <DialogDescription>
              Give your server a personality with a name.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <InputField
              control={control}
              name="serverName"
              label="Server Name"
              required
              message={errors.serverName?.message}
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
