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
import { cn } from "@discord/lib/utils";
import { AnyType } from "@discord/type";
import { useUploadThing } from "@discord/utils/uploadThing";
import { ImagePlus, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { createServerSchema } from "./createServerSchema";
import { useUpdateServer } from "./hooks/useUpdateServer";

interface UpdateServerFormData {
  serverName: string;
  image?: string;
}

export const UpdateServerDialog = ({
  handleOnSuccess,
  handleClick,
  isOpen,
  serverId,
  serverName,
  serverImage,
}: {
  handleOnSuccess: () => void;
  handleClick: () => void;
  isOpen: boolean;
  serverId: string;
  serverName: string;
  serverImage?: string;
}) => {
  const { control, handleSubmit, errors } = useReactHookForm(
    createServerSchema,
    { serverName }
  );
  const { updateServer, isPending, isSuccess } = useUpdateServer();
  
  const [serverImageUrl, setServerImageUrl] = useState<string>(serverImage || "");
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string>("");

  const { startUpload, isUploading } = useUploadThing("serverImageUploader", {
    onClientUploadComplete: (res: AnyType[]) => {
      if (res && res[0]) {
        const fileUrl = res[0].serverData.fileUrl;
        setServerImageUrl(fileUrl);
      }
    },
    onUploadError: (error: Error) => {
      console.error("Server image upload failed:", error);
    },
  });

  const onSubmit = (data: UpdateServerFormData) => {
    const payload = { name: data.serverName, image: serverImageUrl };
    updateServer({ serverId, ...payload });
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
                  htmlFor="server-image-upload-update"
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
                  id="server-image-upload-update"
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
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button disabled={isPending || isUploading} loading={isPending || isUploading}>
                Update
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
