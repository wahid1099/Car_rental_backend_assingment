import { z } from "zod";
import { User } from "./user.model";

const userValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, { message: "Name is required" }),
    password: z.string().min(1, { message: "Password is required" }),
    email: z.string().email({ message: "Invalid Email address" }),
    phone: z.string().min(1, { message: "Phone number is required" }),
    role: z.enum(["user", "admin"]),
    image: z.string().min(1, { message: "Image is required" }).optional(),
    // address: z.string(),
  }),
});

export const UserValidation = {
  userValidationSchema,
};
