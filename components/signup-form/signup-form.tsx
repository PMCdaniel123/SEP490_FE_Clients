"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/libs/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "@/libs/zod/schema";
import { z } from "zod";
import { useState } from "react";
import { SignInButton } from "@/components/signin-form/signin-button";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LoadingOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/stores";
import { login } from "@/stores/slices/authSlice";
import { BASE_URL } from "@/constants/environments";
import Cookies from "js-cookie";

export type FormInputs = z.infer<typeof signupSchema>;

export function SignUpForm({
  className,
  onCloseSignUpForm,
  ...props
}: React.ComponentPropsWithoutRef<"form"> & { onCloseSignUpForm: () => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormInputs>({
    resolver: zodResolver(signupSchema),
  });

  const { role } = props;
  const dispatch = useDispatch<AppDispatch>();
  const [isSignInModalOpen, setSignInModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async (data: FormInputs) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/users/register`, data);

      if (
        response.data &&
        response.data.token === "" &&
        response.data.notification === "Email và số điện thoại đã được sử dụng"
      ) {
        toast.error("Email hoặc số điện thoại đã được sử dụng", {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          theme: "light",
        });
        setIsLoading(false);
        return;
      }

      toast.success("Đăng ký thành công!", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: true,
        theme: "dark",
      });

      if (response.status !== 201) {
        toast.error("Đăng ký thất bại! Vui lòng kiểm tra lại.", {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          theme: "light",
        });
        return;
      }

      const token = response.data.token;

      Cookies.set("token", token, { expires: 3 });

      try {
        const decodeResponse = await fetch(`${BASE_URL}/users/decodejwttoken`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            token: token,
          }),
        });
        const decoded = await decodeResponse.json();
        const customerData = {
          id: decoded.claims.sub,
          fullName: decoded.claims.name,
          email: decoded.claims.email,
          phone: decoded.claims.Phone,
          roleId: decoded.claims.RoleId,
          avatar: decoded.avatarUrl,
        };
        toast.success("Đăng nhập thành công!", {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          theme: "light",
        });

        dispatch(login(customerData));
        handleCloseSignUpForm();
      } catch {
        toast.error("Có lỗi xảy ra khi giải mã token.", {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          theme: "light",
        });
        return;
      }

      window.location.reload();
    } catch {
      toast.error("Có lỗi xảy ra. Vui lòng thử lại sau.", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: true,
        theme: "light",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseSignUpForm = () => {
    reset({
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      sex: "",
    });
    onCloseSignUpForm();
  };

  return (
    <>
      <ToastContainer />
      <form
        className={cn("flex flex-col gap-6 w-full", className)}
        {...props}
        onSubmit={handleSubmit(handleSignUp)}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-xl font-bold text-primary">
            {role === "owner"
              ? "Đăng ký tài khoản doanh nghiệp"
              : "Tạo tài khoản"}
          </h1>
        </div>
        <div className="grid gap-4">
          <div className="grid gap-1">
            <Label htmlFor="name" className="text-fourth font-semibold text-xs">
              Họ và tên
            </Label>
            <Input
              className="py-4 px-4 rounded-md bg-white shadow-sm text-sm"
              id="name"
              type="text"
              placeholder="Nhập họ và tên"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-red-500 text-xs">{errors.name.message}</p>
            )}
          </div>
          <div className="grid gap-1">
            <Label
              htmlFor="email"
              className="text-fourth font-semibold text-xs"
            >
              Email
            </Label>
            <Input
              className="py-4 px-4 rounded-md bg-white shadow-sm text-sm"
              id="email"
              type="email"
              placeholder="Nhập email"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-500 text-xs">{errors.email.message}</p>
            )}
          </div>
          <div className="grid gap-1">
            <Label
              htmlFor="phone"
              className="text-fourth font-semibold text-xs"
            >
              Số điện thoại
            </Label>
            <Input
              className="py-4 px-4 rounded-md bg-white shadow-sm text-sm"
              id="phone"
              type="tel"
              placeholder="Nhập số điện thoại"
              {...register("phone")}
            />
            {errors.phone && (
              <p className="text-red-500 text-xs">{errors.phone.message}</p>
            )}
          </div>
          <div className="grid gap-1">
            <Label
              htmlFor="password"
              className="text-fourth font-semibold text-xs"
            >
              Mật khẩu
            </Label>
            <Input
              className="py-4 px-4 rounded-md bg-white shadow-sm text-sm"
              id="password"
              type="password"
              placeholder="Nhập mật khẩu"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-red-500 text-xs">{errors.password.message}</p>
            )}
          </div>
          <div className="grid gap-1">
            <Label
              htmlFor="confirmPassword"
              className="text-fourth font-semibold text-xs"
            >
              Nhập lại mật khẩu
            </Label>
            <Input
              className="py-4 px-4 rounded-md bg-white shadow-sm text-sm"
              id="confirmPassword"
              type="password"
              placeholder="Nhập lại mật khẩu"
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
          <div className="grid gap-1">
            <Label htmlFor="sex" className="text-fourth font-semibold text-xs">
              Giới tính
            </Label>
            <select
              id="sex"
              className="py-2 px-4 rounded-md bg-white shadow-sm text-sm border border-gray-300"
              {...register("sex")}
            >
              <option value="" disabled>
                -- Vui lòng chọn giới tính --
              </option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
              <option value="Khác">Khác</option>
            </select>
            {errors.sex && (
              <p className="text-red-500 text-xs">{errors.sex.message}</p>
            )}
          </div>
          <div className="text-left text-sm text-fourth font-medium mt-1 mb-4">
            Bạn đã có tài khoản ?{" "}
            <button
              type="button"
              onClick={() => {
                setSignInModalOpen(true);
                handleCloseSignUpForm();
              }}
              className="underline underline-offset-4 text-primary"
            >
              Đăng nhập
            </button>
          </div>
          <div className="text-center w-full">
            <Button
              type="submit"
              className="text-white py-6 font-semibold w-3/5"
              disabled={isLoading}
            >
              {isLoading ? (
                <LoadingOutlined style={{ color: "white" }} />
              ) : (
                "Đăng ký"
              )}
            </Button>
          </div>
        </div>
      </form>

      <SignInButton
        open={isSignInModalOpen}
        onOpenChange={setSignInModalOpen}
        onCloseSignUpForm={handleCloseSignUpForm}
      />
    </>
  );
}
