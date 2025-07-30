import { object, string } from "zod";

export const channelSchema = object({
  name: string()
    .min(3, "Channel name must be at least 3 characters")
    .max(20, "Channel name cannot exceed 20 characters"),
});
