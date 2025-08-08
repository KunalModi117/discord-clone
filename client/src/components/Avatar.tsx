import { cn } from "@discord/lib/utils";
import Image from "next/image";

interface AvatarProps {
  src?: string;
  alt: string;
  username: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "w-6 h-6 text-xs",
  md: "w-8 h-8 text-sm",
  lg: "w-12 h-12 text-lg",
};

export const Avatar = ({ src, alt, username, size = "md", className }: AvatarProps) => {
  const sizeClass = sizeClasses[size];

  if (src) {
    return (
      <div className={cn("relative rounded-full overflow-hidden", sizeClass, className)}>
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-full bg-secondary border border-input flex items-center justify-center text-muted-foreground font-medium",
        sizeClass,
        className
      )}
    >
      {username[0].toUpperCase()}
    </div>
  );
};
