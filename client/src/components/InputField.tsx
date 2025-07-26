import { Input } from "./ui/input";
import { AnyType } from "../../types";
import { Controller } from "react-hook-form";

type InputFieldProps = {
  name: string;
  control: AnyType;
  label: string;
  className?: string;
  message?: string;
  type?: string;
  regexTest?: RegExp;
  required?: boolean;
};

export function InputField({
  name,
  control,
  label,
  className,
  message,
  type = "text",
  regexTest,
  required,
}: InputFieldProps) {
  const hasError = !!message;

  return (
    <div className="space-y-1 w-full">
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <>
            <label htmlFor={name} className="text-sm font-medium text-white">
              {label}
              {required ? <span className="text-red-500">*</span> : ""}
            </label>
            <Input
              {...field}
              type={type}
              className={`${
                hasError ? "border-destructive ring-destructive/50" : ""
              } ${className}`}
              value={field.value ?? ""}
              onChange={(e) => {
                const value = e.target.value;
                if (!regexTest || regexTest.test(value) || value === "") {
                  field.onChange(value);
                }
              }}
            />
          </>
        )}
      />
      {hasError && <p className="text-sm text-destructive">{message}</p>}
    </div>
  );
}
