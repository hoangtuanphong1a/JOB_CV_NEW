import z from "zod";

// Schema for update - image is optional
export const updatePostSchema = z.object({
  title: z
    .string()
    .min(1, 'Tiêu đề không được để trống')
    .max(120, 'Tiêu đề không quá 120 ký tự'),
  excerpt: z
    .string()
    .min(1, 'Tóm tắt không được để trống')
    .max(160, 'Tóm tắt không quá 160 ký tự'),
  body: z.string().min(1, 'Nội dung không được để trống'),
  image: z.instanceof(File).nullable().optional(),
  tags: z
    .array(z.string().min(1, 'Tag không được để trống'))
    .max(5, 'Tối đa 5 tag'),
  published: z.boolean(),
});

export type PostFormData = z.infer<typeof updatePostSchema>;