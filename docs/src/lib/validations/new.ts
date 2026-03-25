// app/new/schema.ts
import { z } from "zod";

export const postSchema = z.object({
  title: z
    .string()
    .min(1, "Tiêu đề không được để trống")
    .max(120, "Tiêu đề không quá 120 ký tự"),

  excerpt: z
    .string()
    .min(1, "Tóm tắt không được để trống")
    .max(160, "Tóm tắt không quá 160 ký tự"),

  body: z.string().min(1, "Nội dung không được để trống"),

  // BẮT BUỘC PHẢI CÓ ẢNH
  image: z
    .instanceof(File, { message: "Vui lòng chọn ảnh bìa" })
    .refine((file) => file.size > 0, {
      message: "Ảnh bìa không được để trống",
    }),

  tags: z
    .array(z.string().min(1, "Tag không được để trống"))
    .max(5, "Tối đa 5 tag"),

  published: z.boolean(),
});

export type PostFormData = z.infer<typeof postSchema>;