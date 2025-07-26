import { object, string } from "zod";

export const signInSchema = object({
  email: string().email("Invalid email address").nonempty("Email is required"),
  password: string().nonempty("Password is required"),
});
