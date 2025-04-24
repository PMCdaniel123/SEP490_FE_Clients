"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupOwnerSchema } from "@/libs/zod/schema";
import { z } from "zod";
import { useState } from "react";
import { toast } from "react-toastify";
import { LoadingOutlined } from "@ant-design/icons";
import { BASE_URL } from "@/constants/environments";

export type FormInputs = z.infer<typeof signupOwnerSchema>;

export default function BecomeOwnerForm({ onClose }: { onClose: () => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>({
    resolver: zodResolver(signupOwnerSchema),
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async (data: FormInputs) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/owners/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email.trim(),
          phone: data.phone.trim(),
          password: data.password.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Email hoặc số điện thoại đã tồn tại!");
      }

      toast.success("Đăng ký thành công!", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        theme: "light",
      });
      window.open("https://owner.workhive.io.vn/", "_blank");
      onClose();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Đã xảy ra lỗi!";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        theme: "light",
      });
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form
        className="flex flex-col gap-6 w-full"
        onSubmit={handleSubmit(handleSignUp)}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-xl font-bold text-primary">
            Đăng ký tài khoản doanh nghiệp
          </h1>
        </div>
        <div className="grid gap-4">
          <div className="grid gap-1">
            <Label
              htmlFor="email"
              className="text-fourth font-semibold text-xs"
            >
              Email
            </Label>
            <Input
              className="py-6 px-4 rounded-md bg-white shadow-sm"
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
              className="py-6 px-4 rounded-md bg-white shadow-sm"
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
              className="py-6 px-4 rounded-md bg-white shadow-sm"
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
              Mật khẩu
            </Label>
            <Input
              className="py-6 px-4 rounded-md bg-white shadow-sm"
              id="confirmPassword"
              type="password"
              placeholder="Nhập mật khẩu xác nhận..."
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs">
                {errors.confirmPassword.message}
              </p>
            )}
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
    </>
  );
}
