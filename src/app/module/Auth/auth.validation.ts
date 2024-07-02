import { z } from "zod";

const singInValidationSchema = z.object({
  body: z.object({
    email: z.string().email({ message: "Invalid Email address" }),
    password: z.string({ required_error: "Password is required" }),
  }),
});

export const AuthValidation = {
  singInValidationSchema,
};
