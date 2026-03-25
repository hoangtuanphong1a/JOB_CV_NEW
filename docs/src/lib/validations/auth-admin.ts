/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Email không hợp lệ"),
  password: z
    .string()
    .min(6, "Mật khẩu tối thiểu 6 ký tự")
    .max(128, "Mật khẩu quá dài"),
});

export const registerSchema = z
  .object({
    name: z.string().trim().min(2, "Tên tối thiểu 2 ký tự").max(100),
    email: z.string().trim().toLowerCase().email("Email không hợp lệ"),
    password: z
      .string()
      .min(6, "Mật khẩu tối thiểu 6 ký tự")
      .max(128, "Mật khẩu quá dài"),
    confirmPassword: z.string(),
  })
  .refine((data: any) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });
