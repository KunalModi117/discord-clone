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
import { useUploadThing } from "@discord/utils/uploadThing";
import { Avatar } from "@discord/components/Avatar";
import { ImagePlus, Loader2 } from "lucide-react";

interface ServerFormData {
  serverName: string;
  image?: string;
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
  
  const [serverImageUrl, setServerImageUrl] = useState<string>("");
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string>("");

  const { startUpload, isUploading } = useUploadThing("serverImageUploader", {
    onClientUploadComplete: (res: any[]) => {
      if (res && res[0]) {
        const fileUrl = res[0].serverData.fileUrl;
        setServerImageUrl(fileUrl);
      }
    },
    onUploadError: (error: Error) => {
      console.error("Server image upload failed:", error);
    },
  });

  const onSubmitJoin = (data: JoinFormData) => {
    joinServer({ inviteCode: data.inviteCode });
  };

  const onSubmit = (data: ServerFormData) => {
    const payload = { name: data.serverName, image: serverImageUrl };
    createServer(payload);
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
            <div className="w-full flex flex-col items-center gap-3">
              <div className="relative">
                <div
                  className={cn(
                    "h-20 w-20 rounded-xl overflow-hidden bg-secondary border border-input flex items-center justify-center",
                    !localPreviewUrl && !serverImageUrl && "text-muted-foreground"
                  )}
                >
                  {localPreviewUrl || serverImageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      alt="server preview"
                      src={localPreviewUrl || serverImageUrl}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <ImagePlus className="h-8 w-8" />
                  )}
                </div>
                <label
                  htmlFor="server-image-upload"
                  className={cn(
                    "absolute -bottom-2 -right-2 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer shadow",
                    isUploading && "opacity-50 cursor-not-allowed"
                  )}
                  title={isUploading ? "Uploading..." : "Upload server image"}
                >
                  {isUploading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ImagePlus className="h-4 w-4" />
                  )}
                </label>
                <input
                  id="server-image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={isUploading}
                  onChange={async (e) => {
                    const files = e.target.files ? Array.from(e.target.files) : [];
                    if (files.length === 0) return;
                    const file = files[0];
                    setLocalPreviewUrl(URL.createObjectURL(file));
                    try {
                      await startUpload([file]);
                    } catch (err) {
                      console.error("Error starting server image upload:", err);
                    } finally {
                      if (e.currentTarget) {
                        e.currentTarget.value = "";
                      }
                    }
                  }}
                />
              </div>
            </div>
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
              <Button disabled={isPending || isUploading} loading={isPending || isUploading}>
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
