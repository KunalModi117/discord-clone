import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ZodType, TypeOf } from "zod";
import { AnyType } from "../../types";

export function useReactHookForm<T extends ZodType<AnyType, AnyType>>(
  schema: T
) {
  const {
    control,
    formState: { errors },
    handleSubmit,
    watch,
    reset,
  } = useForm<TypeOf<T>>({
    resolver: zodResolver(schema),
  });

  const values = watch();

  return {
    control,
    errors,
    handleSubmit,
    values,
    reset,
  };
}
