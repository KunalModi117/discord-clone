"use client";

import { useReactHookForm } from "@discord/hooks/useReactHookForm";
import { registrationSchema } from "./registrationSchema";
import { InputField } from "@discord/components/InputField";
import { Typography } from "@discord/components/Typography";
import { Button } from "@discord/components/ui/button";
import { useCreateUser } from "./useCreateUser";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { routePath } from "@discord/utils/routePath";
import { useUploadThing } from "@discord/utils/uploadThing";
import { cn } from "@discord/lib/utils";
import { ImagePlus, Loader2 } from "lucide-react";
import Link from "next/link";

interface FormData {
  userName: string;
  email: string;
  password: string;
  avatar?: string;
}

export const Register = () => {
  const { control, handleSubmit, errors } =
    useReactHookForm(registrationSchema);
  const { createUser, isPending, isSuccess } = useCreateUser();
  const router = useRouter();
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string>("");

  const { startUpload, isUploading } = useUploadThing("avatarUploader", {
    onClientUploadComplete: (res: any[]) => {
      if (res && res[0]) {
        const fileUrl = res[0].serverData.fileUrl;
        setAvatarUrl(fileUrl);
      }
    },
    onUploadError: (error: Error) => {
      console.error("Avatar upload failed:", error);
    },
  });

  useEffect(() => {
    if (isSuccess) {
      router.push(routePath.signIn);
    }
  }, [isSuccess]);

  const submit = (data: FormData) => {
    const payload: FormData = { ...data };
    if (avatarUrl) payload.avatar = avatarUrl;
    createUser(payload);
  };
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="flex flex-col gap-8 items-center justify-center h-fit max-w-[480px] w-full z-20 bg-background rounded-md p-8">
        <Typography variant="h1" className="text-xl lg:text-2xl">
          Create an account
        </Typography>
        <form
          onSubmit={handleSubmit(submit)}
          className="relative flex flex-col gap-4 items-center justify-center w-full"
        >
          <div className="w-full flex flex-col items-center gap-3">
            <div className="relative">
              <div
                className={cn(
                  "h-20 w-20 rounded-full overflow-hidden bg-secondary border border-input flex items-center justify-center",
                  !localPreviewUrl && !avatarUrl && "text-muted-foreground"
                )}
              >
                {localPreviewUrl || avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    alt="avatar preview"
                    src={localPreviewUrl || avatarUrl}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <ImagePlus className="h-8 w-8" />
                )}
              </div>
              <label
                htmlFor="avatar-upload"
                className={cn(
                  "absolute -bottom-2 -right-2 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer shadow",
                  isUploading && "opacity-50 cursor-not-allowed"
                )}
                title={isUploading ? "Uploading..." : "Upload avatar"}
              >
                {isUploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ImagePlus className="h-4 w-4" />
                )}
              </label>
              <input
                id="avatar-upload"
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
                    console.error("Error starting avatar upload:", err);
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
            name="userName"
            message={errors.userName?.message}
            label="Username"
            required
          />
          <InputField
            control={control}
            name="email"
            message={errors.email?.message}
            label="Email"
            required
          />
          <InputField
            control={control}
            name="password"
            message={errors.password?.message}
            label="Password"
            type="password"
            required
          />
          <div className="flex flex-col gap-2 w-full">
            <Button className="w-full" loading={isPending || isUploading} disabled={isUploading}>
              Create account
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              Already have an account? {" "}
              <Link href={routePath.signIn} className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
