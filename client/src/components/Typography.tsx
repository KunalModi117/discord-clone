import { cn } from "@discord/lib/utils";
import React from "react";

export type TypographyVariant =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "p"
  | "muted"
  | "label"
  | "small";

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant: TypographyVariant;
  children: React.ReactNode;
}

const variantClasses: Record<TypographyVariant, string> = {
  h1: "text-4xl font-bold tracking-tight lg:text-5xl",
  h2: "text-3xl font-semibold tracking-tight lg:text-4xl",
  h3: "text-2xl font-semibold tracking-tight",
  h4: "text-xl font-medium tracking-tight",
  h5: "text-lg font-medium tracking-tight",
  h6: "text-base font-medium tracking-tight",
  p: "text-base leading-relaxed",
  muted: "text-sm text-muted-foreground",
  label: "text-sm font-medium text-muted-foreground",
  small: "text-xs text-muted-foreground",
};

export const Typography: React.FC<TypographyProps> = ({
  variant,
  children,
  className,
  ...props
}) => {
  const Component = variant.startsWith("h") || variant === "p" ? variant : "p";

  return React.createElement(
    Component,
    {
      className: cn(variantClasses[variant], className),
      ...props,
    },
    children
  );
};
