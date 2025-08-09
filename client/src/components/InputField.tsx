"use client";

import { Input } from "./ui/input";
import { AnyType } from "../../types";
import { Controller } from "react-hook-form";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

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
  const isPassword = type === "password";
  const [showPassword, setShowPassword] = useState(false);

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
            <div className="relative">
              <Input
                {...field}
                type={isPassword ? (showPassword ? "text" : "password") : type}
                className={`${
                  hasError ? "border-destructive ring-destructive/50" : ""
                } ${isPassword ? "pr-9" : ""} ${className}`}
                value={field.value ?? ""}
                onChange={(e) => {
                  const value = e.target.value;
                  if (!regexTest || regexTest.test(value) || value === "") {
                    field.onChange(value);
                  }
                }}
              />
              {isPassword && (
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute inset-y-0 right-2 my-auto h-6 w-6 grid place-items-center rounded hover:bg-foreground/5 text-muted-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              )}
            </div>
          </>
        )}
      />
      {hasError && <p className="text-sm text-destructive">{message}</p>}
    </div>
  );
}
