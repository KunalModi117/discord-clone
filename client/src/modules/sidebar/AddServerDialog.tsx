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
import { useEffect, useState } from "react";
import { createServerSchema, joinServerSchema } from "./createServerSchema";
import { useCreateServer } from "./hooks/useCreateServer";
import { useJoinServer } from "./hooks/useJoinServer";
import { cn } from "@discord/lib/utils";

interface FormData {
  serverName: string;
}

interface JoinFormData {
  inviteCode: string;
}

export const AddServerDialog = ({
  handleOnSuccess,
  handleClick,
  isOpen,
}: {
  handleOnSuccess: () => void;
  handleClick: () => void;
  isOpen: boolean;
}) => {
  const { control, handleSubmit, errors } = useReactHookForm(
    createServerSchema,
    { serverName: "" }
  );

  const {
    control: joinControl,
    handleSubmit: joinHandleSubmit,
    errors: joinErrors,
  } = useReactHookForm(joinServerSchema, { inviteCode: "" });
  const [isJoinServer, setIsJoinServer] = useState(false);
  const { createServer, isPending, isSuccess } = useCreateServer();
  const {
    joinServer,
    isPending: isJoinPending,
    isSuccess: isJoinSuccess,
  } = useJoinServer();

  const onSubmitJoin = (data: JoinFormData) => {
    joinServer({ inviteCode: data.inviteCode });
  };

  const onSubmit = (data: FormData) => {
    createServer({ name: data.serverName });
  };

  useEffect(() => {
    if (isSuccess) {
      handleOnSuccess();
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isJoinSuccess) {
      handleOnSuccess();
    }
  }, [isJoinSuccess]);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClick}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Customise your server</DialogTitle>
            <DialogDescription>
              Give your new server a personality with a name. You can always
              change it later.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className={cn("flex flex-col gap-4", {
              hidden: isJoinServer,
            })}
          >
            <InputField
              control={control}
              name="serverName"
              label="Server Name"
              required
              message={errors.serverName?.message}
            />
            <Button onClick={() => setIsJoinServer(true)} type="button">
              Join server
            </Button>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button disabled={isPending} loading={isPending}>
                Create
              </Button>
            </DialogFooter>
          </form>

          <form
            onSubmit={joinHandleSubmit(onSubmitJoin)}
            className={cn("flex flex-col gap-4", {
              hidden: !isJoinServer,
            })}
          >
            <InputField
              control={joinControl}
              name="inviteCode"
              label="Invite Code"
              required
              message={joinErrors.inviteCode?.message}
            />
            <Button
              disabled={isJoinPending}
              loading={isJoinPending}
              className="w-full"
            >
              Join
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
