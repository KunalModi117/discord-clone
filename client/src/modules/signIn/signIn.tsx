"use client";

import { useReactHookForm } from "@discord/hooks/useReactHookForm";
import { InputField } from "@discord/components/InputField";
import { Typography } from "@discord/components/Typography";
import { Button } from "@discord/components/ui/button";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { signInSchema } from "./signInSchema";
import { useSignIn } from "./useSignIn";
import { useGetServers } from "@discord/hooks/useGetServers";

interface FormData {
  email: string;
  password: string;
}

export const SignIn = () => {
  const { control, handleSubmit, errors } = useReactHookForm(signInSchema);
  const { signIn, isPending, isSuccess } = useSignIn();
  const { getServers, isServersLoaded, isServersLoading,servers } = useGetServers();
  const router = useRouter();

  useEffect(() => {
    if (isSuccess) {
      getServers();
    }
  }, [isSuccess]);

  useEffect(()=>{
    if(isServersLoaded){
      if(servers.length){
        router.push(`/${servers[0].id}?channelId=${servers[0].channels[0].id}`)
      }else{
        router.push("/create-server")
      }
    }
  },[isServersLoaded])

  const submit = (data: FormData) => {
    signIn(data);
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="flex flex-col gap-8 items-center justify-center h-fit max-w-[480px] w-full z-20 bg-background rounded-md p-8">
        <Typography variant="h1" className="text-xl lg:text-2xl">
          Welcome back!
        </Typography>
        <form
          onSubmit={handleSubmit(submit)}
          className="relative flex flex-col gap-4 items-center justify-center w-full"
        >
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
          <Button className="w-full" loading={isPending || isServersLoading}>
            Sign in
          </Button>
        </form>
      </div>
    </div>
  );
};
