"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupOwnerSchema } from "@/lib/zod/schema";
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
          email: data.email,
          phone: data.phone,
          password: data.password,
        }),
      });

      if (!response.ok) {
        throw new Error("Email hoặc số điện thoại đã tồn tại!");
      }

      toast.success("Đăng ký thành công!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        theme: "light",
      });
      window.open("https://sep-490-fe-owners.vercel.app/", "_blank");
      onClose();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Đã xảy ra lỗi!";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 2000,
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
          <div className="mt-4 relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
            <span className="relative z-10 bg-background px-2 text-muted-foreground">
              Hoặc tiếp tục với
            </span>
          </div>
          <div className="text-center w-full">
            <Button className="text-white py-6 font-semibold w-3/5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="150"
                height="150"
                viewBox="0 0 48 48"
              >
                <path
                  fill="#fbc02d"
                  d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12	s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20	s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                ></path>
                <path
                  fill="#e53935"
                  d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039	l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                ></path>
                <path
                  fill="#4caf50"
                  d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36	c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                ></path>
                <path
                  fill="#1565c0"
                  d="M43.611,20.083L43.595,20L42,20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571	c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                ></path>
              </svg>
              Đăng nhập với Google
            </Button>
          </div>
        </div>
      </form>
    </>
  );
}
