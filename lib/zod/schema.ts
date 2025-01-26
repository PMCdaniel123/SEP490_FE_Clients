import { z } from "zod";

export const signupSchema = z.object({
  username: z.string().min(3, "Tên người đăng nhập phải có ít nhất 3 ký tự"),
  email: z.string().email("Địa chỉ email không hợp lệ"),
  phone: z.string().min(10, "Số điện thoại phải có ít nhất 10 ký tự"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

export const signinSchema = z.object({
  phone: z.string().min(10, "Số điện thoại phải có ít nhất 10 ký tự"),
});

export const passwordSchema = z.object({
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});
