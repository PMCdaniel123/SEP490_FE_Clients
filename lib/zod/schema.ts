import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().min(3, "Tên người đăng nhập phải có ít nhất 3 ký tự"),
  email: z.string().email("Địa chỉ email không hợp lệ"),
  phone: z.string().min(10, "Số điện thoại phải có ít nhất 10 ký tự"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  sex: z.string({
    required_error: "Vui lòng chọn giới tính hợp lệ",
  }),
});

export const signupOwnerSchema = z.object({
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
  category: z.string({
    required_error: "Vui lòng loại không gian hợp lệ",
  }),
  area: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Diện tích phải lớn hơn 0 m²",
  }),
  capacity: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 1, {
      message: "Sức chứa tối đa phải >= 1 người",
    }),
  cleanTime: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 1, {
      message: "Thời gian dọn dẹp phải >= 1 phút",
    }),
  description: z.string().min(3, "Mô tả không gian phải có ít nhất 3 ký tự"),
  shortTermPrice: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Giá theo giờ phải lớn hơn 0",
    }),
  longTermPrice: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
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
  status: z.string({
    required_error: "Vui lòng chọn trạng thái hợp lệ",
  }),
});

export const amenitySchema = z.object({
  name: z.string().min(3, "Tên tiện ích phải có ít nhất 3 ký tự"),
  category: z.string().min(1, "Phân loại không được để trống"),
  description: z.string().min(3, "Mô tả tiện ích phải có ít nhất 3 ký tự"),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Giá phải lớn hơn 0",
  }),
  quantity: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Số lượng phải lớn hơn 0",
  }),
  image: z.string().url("Vui lòng tải lên một hình ảnh hợp lệ"),
  status: z.string({
    required_error: "Vui lòng chọn trạng thái hợp lệ",
  }),
});

export const beverageSchema = z.object({
  name: z.string().min(3, "Tên món phải có ít nhất 3 ký tự"),
  category: z.string().min(1, "Phân loại không được để trống"),
  description: z.string().min(3, "Mô tả món phải có ít nhất 3 ký tự"),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Giá phải lớn hơn 0",
  }),
  image: z.string().url("Vui lòng tải lên một hình ảnh hợp lệ"),
  status: z.string({
    required_error: "Vui lòng chọn trạng thái hợp lệ",
  }),
});

export const promotionSchema = z
  .object({
    code: z.string().min(3, "Mã code phải có ít nhất 3 ký tự"),
    description: z.string().min(3, "Mô tả món phải có ít nhất 3 ký tự"),
    discount: z
      .string()
      .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: "Giảm giá phải lớn hơn 0",
      }),
    startDate: z.string().nonempty("Vui lòng chọn ngày bắt đầu"),
    endDate: z.string().nonempty("Vui lòng chọn ngày kết thúc"),
    status: z.string({
      required_error: "Vui lòng chọn trạng thái hợp lệ",
    }),
  })
  .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
    message: "Ngày kết thúc phải lớn hơn ngày bắt đầu",
    path: ["endDate"],
  });

export const withdrawalSchema = z.object({
  number: z.string().nonempty("Vui lòng nhập số tài khoản ngân hàng"),
  bank: z.string().nonempty("Vui lòng tên ngân hàng"),
  money: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Giá phải lớn hơn 0",
  }),
});

export const identifySchema = z.object({
  name: z.string().min(3, "Họ và tên phải có ít nhất 3 ký tự"),
  number: z
    .string()
    .min(12, "Số căn cước công dân phải có 12 chữ số")
    .max(12, "Số căn cước công dân phải có 12 chữ số")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Số căn cước công dân phải có 12 chữ số",
    }),
  dateOfBirth: z.string().nonempty("Vui lòng chọn ngày sinh"),
  gender: z.string({
    required_error: "Vui lòng chọn giới tính hợp lệ",
  }),
  nationality: z.string().nonempty("Vui lòng nhập quốc tịch"),
  placeOfOrigin: z.string().nonempty("Vui lòng nhập quê quán"),
  placeOfResidence: z.string().nonempty("Vui lòng nhập nơi thường trú"),
  dateOfExpiry: z.string().nonempty("Vui lòng chọn ngày hết hạn"),
  dateOfCreation: z.string().nonempty("Vui lòng chọn ngày tạo cccd"),
  file: z.string().url("Vui lòng tải lên một file hợp lệ"),
});

export const socialSchema = z.object({
  facebook: z.string().url("Vui lòng nhập đường dẫn hợp lệ"),
  instagram: z.string().url("Vui lòng nhập đường dẫn hợp lệ"),
  twitter: z.string().url("Vui lòng nhập đường dẫn hợp lệ"),
  youtube: z.string().url("Vui lòng nhập đường dẫn hợp lệ"),
  other: z.string().url("Vui lòng nhập đường dẫn hợp lệ"),
});

export const licenseSchema = z.object({
  name: z.string().nonempty("Vui lòng nhập tên doanh nghiệp"),
  number: z.string().nonempty("Vui lòng nhập mã số doanh nghiệp"),
  address: z
    .string()
    .nonempty("Vui lòng nhập địa chỉ trụ sở chính của doanh nghiệp"),
  charterCapital: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Vốn tiền lệ phải lớn hơn 0",
    }),
  file: z.string().url("Vui lòng tải lên một file hợp lệ"),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Mật khẩu hiện tại là bắt buộc."),
  newPassword: z.string().min(6, "Mật khẩu mới phải có ít nhất 6 ký tự."),
  confirmPassword: z.string().min(6, "Mật khẩu xác nhận phải có ít nhất 6 ký tự."),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp.",
  path: ["confirmPassword"],
});