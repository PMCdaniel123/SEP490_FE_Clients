import { z } from "zod";

const categories = ["1", "2", "3", "4"] as const;
const statusArray = ["1", "2"] as const;

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
  status: z.enum(statusArray, {
    errorMap: () => ({ message: "Vui lòng chọn trạng thái hợp lệ" }),
  }),
});

export const amenitySchema = z.object({
  name: z.string().min(3, "Tên tiện ích phải có ít nhất 3 ký tự"),
  category: z.string().min(1, "Phân loại không được để trống"),
  description: z.string().min(3, "Mô tả tiện ích phải có ít nhất 3 ký tự"),
  price: z
    .string()
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val) && val > 0, {
      message: "Giá phải lớn hơn 0",
    }),
  quantity: z
    .string()
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val) && val > 0, {
      message: "Số lượng phải lớn hơn 0",
    }),
  image: z.string().url("Vui lòng tải lên một hình ảnh hợp lệ"),
  status: z.enum(statusArray, {
    errorMap: () => ({ message: "Vui lòng chọn trạng thái hợp lệ" }),
  }),
});

export const beverageSchema = z.object({
  name: z.string().min(3, "Tên món phải có ít nhất 3 ký tự"),
  category: z.string().min(1, "Phân loại không được để trống"),
  description: z.string().min(3, "Mô tả món phải có ít nhất 3 ký tự"),
  price: z
    .string()
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val) && val > 0, {
      message: "Giá phải lớn hơn 0",
    }),
  image: z.string().url("Vui lòng tải lên một hình ảnh hợp lệ"),
  status: z.enum(statusArray, {
    errorMap: () => ({ message: "Vui lòng chọn trạng thái hợp lệ" }),
  }),
});

export const promotionSchema = z
  .object({
    code: z.string().min(3, "Mã code phải có ít nhất 3 ký tự"),
    description: z.string().min(3, "Mô tả món phải có ít nhất 3 ký tự"),
    discount: z
      .string()
      .transform((val) => Number(val))
      .refine((val) => !isNaN(val) && val > 0, {
        message: "Giảm giá phải lớn hơn 0",
      }),
    startDate: z.string().nonempty("Vui lòng chọn ngày bắt đầu"),
    endDate: z.string().nonempty("Vui lòng chọn ngày kết thúc"),
    status: z.enum(statusArray, {
      errorMap: () => ({ message: "Vui lòng chọn trạng thái hợp lệ" }),
    }),
  })
  .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
    message: "Ngày kết thúc phải lớn hơn ngày bắt đầu",
    path: ["endDate"],
  });
