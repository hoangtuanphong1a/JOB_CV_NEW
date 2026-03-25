import z from 'zod';

// const lowercaseRegex = /[a-z]/;
// const specialRegex = /[^a-zA-Z0-9]/;
export const passwordRule = z
  .string()
  .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
  .regex(/[A-Z]/, 'Mật khẩu phải chứa ít nhất 1 chữ hoa')
  .regex(/[a-z]/, 'Mật khẩu phải chứa ít nhất 1 chữ thường')
  .regex(/[0-9]/, 'Mật khẩu phải chứa ít nhất 1 số');


export const loginSchema = z.object({
  email: z.string().nonempty('Email không được để trống').email('Email không hợp lệ'),
  password: passwordRule,
});


export const registerSchema = z
  .object({
    email: z.string().nonempty('Email không được để trống').email('Email không hợp lệ'),
    firstName: z.string().nonempty('Tên không được để trống').min(3, 'Tên phải có ít nhất 3 ký tự'),
    lastName: z.string().nonempty('Họ không được để trống').min(3, 'Họ phải có ít nhất 3 ký tự'),
    password: passwordRule,
    confirmPassword: z
      .string()
      .nonempty('Mật khẩu xác nhận không được để trống')
      .min(6, 'Mật khẩu xác nhận phải có ít nhất 6 ký tự'),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Mật khẩu xác nhận không khớp',
        path: ['confirmPassword'],
      });
    }
  });

export type LoginSchemaType = z.infer<typeof loginSchema>;
export type RegisterSchemaType = z.infer<typeof registerSchema>;
