"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { PlusIcon } from "lucide-react";
import { useReactHookForm } from "@discord/hooks/useReactHookForm";
import { createServerSchema } from "./createServerSchema";
import { InputField } from "@discord/components/InputField";
import { useCreateServer } from "./useCreateServer";
import { useEffect, useState } from "react";

interface FormData {
  serverName: string;
}

export const AddServerDialog = ({
  handleOnSuccess,
}: {
  handleOnSuccess: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { control, handleSubmit, errors } =
    useReactHookForm(createServerSchema);
  const { createServer, isPending, isSuccess } = useCreateServer();
  const onSubmit = (data: FormData) => {
    createServer({ name: data.serverName });
  };

  useEffect(() => {
    if (isSuccess) {
      handleOnSuccess();
      setIsOpen(false);
    }
  }, [isSuccess]);

  const handleClick = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <>
      <button
        className="w-12 h-12 rounded-xl flex items-center justify-center hover:bg-primary bg-gray-500 ml-3"
        onClick={() => {
          setIsOpen(true);
        }}
      >
        <PlusIcon />
      </button>
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
                Create
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
