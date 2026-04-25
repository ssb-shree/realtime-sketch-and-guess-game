import z from "zod";

const loginSchema = z.object({
  username: z.string().min(1).max(9),
  password: z.string().min(6).max(255),
});

const registerSchema = loginSchema
  .extend({
    confirmPassword: z.string().min(6).max(255),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "passwords did not match",
    path: ["confirmPassword"],
  });

export { registerSchema, loginSchema };
