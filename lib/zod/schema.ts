import { z } from "zod";

const categories = ["1", "2", "3", "4"] as const;

export const signupSchema = z.object({
  username: z.string().min(3, "Tên người đăng nhập phải có ít nhất 3 ký tự"),
  email: z.string().email("Địa chỉ email không hợp lệ"),
  phone: z.string().min(10, "Số điện thoại phải có ít nhất 10 ký tự"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

export const phoneSchema = z.object({
  phone: z.string().min(10, "Số điện thoại phải có ít nhất 10 ký tự"),
});

export const emailSchema = z.object({
  email: z.string().email("Địa chỉ email không hợp lệ"),
});

export const passwordSchema = z.object({
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

export const workspaceSchema = z.object({
  name: z.string().min(3, "Tên không gian phải có ít nhất 3 ký tự"),
  address: z.string().min(3, "Địa chỉ không gian phải có ít nhất 3 ký tự"),
  googleMapUrl: z.string().min(3, "Google map url phải có ít nhất 3 ký tự"),
  category: z.enum(categories, {
    errorMap: () => ({ message: "Vui lòng chọn loại không gian hợp lệ" }),
  }),
  area: z
    .string()
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val) && val > 0, {
      message: "Diện tích phải lớn hơn 0 m2",
    }),
  capacity: z
    .string()
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val) && val >= 1, {
      message: "Sức chứa tối đa phải >= 1 người",
    }),
  cleanTime: z
    .string()
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val) && val >= 1, {
      message: "Thời gian dọn dẹp phải >= 1 phút",
    }),
  description: z.string().min(3, "Mô tả không gian phải có ít nhất 3 ký tự"),
  shortTermPrice: z
    .string()
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val) && val > 0, {
      message: "Giá theo giờ phải lớn hơn 0",
    }),
  longTermPrice: z
    .string()
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val) && val > 0, {
      message: "Giá theo ngày phải lớn hơn 0",
    }),
  facilities: z.array(z.string(), {
    required_error: "Vui lòng nhập ít nhất một tiện ích",
  }),
  policies: z.array(z.string(), {
    required_error: "Vui lòng nhập ít nhất một chính sách",
  }),
  images: z.array(z.string(), {
    required_error: "Vui lòng tải lên ít nhất một hình ảnh",
  }),
});
