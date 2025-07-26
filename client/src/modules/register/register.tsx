"use client";

import { useReactHookForm } from "@discord/hooks/useReactHookForm";
import { registrationSchema } from "./registrationSchema";
import { InputField } from "@discord/components/InputField";
import { Typography } from "@discord/components/Typography";
import { Button } from "@discord/components/ui/button";
import { useCreateUser } from "./useCreateUser";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { routePath } from "@discord/utils/routePath";

interface FormData {
  userName: string;
  email: string;
  password: string;
}

export const Register = () => {
  const { control, handleSubmit, errors } =
    useReactHookForm(registrationSchema);
  const { createUser, isPending, isSuccess } = useCreateUser();
  const router = useRouter();

  useEffect(() => {
    if (isSuccess) {
      router.push(routePath.signIn);
    }
  }, [isSuccess]);

  const submit = (data: FormData) => {
    createUser(data);
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
            required
          />
          <Button className="w-full" loading={isPending}>
            Create account
          </Button>
        </form>
      </div>
    </div>
  );
};
