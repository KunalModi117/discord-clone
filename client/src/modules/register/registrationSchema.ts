import { passwordRegex } from "@discord/utils/regex";
import { object, string } from "zod";

export const registrationSchema = object({
  email: string().email("Invalid email address"),

  userName: string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username cannot exceed 20 characters"),

  password: string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      passwordRegex,
      "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character"
    ),
  avatar: string().url("Invalid image url").optional().or(string().length(0)),
});
