import { object, string } from "zod";

export const createServerSchema = object({
  serverName: string()
    .min(3, "Server name must be at least 3 characters")
    .max(20, "Server name cannot exceed 20 characters"),
});
