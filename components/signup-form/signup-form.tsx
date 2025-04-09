"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "@/lib/zod/schema";
import { z } from "zod";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [isSignInModalOpen, setSignInModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async (data: FormInputs) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/users/register`, data);
      console.log("Sign up successful:", response.data);

      if (
        response.data &&
        response.data.token === "" &&
        response.data.notification === "Email và số điện thoại đã được sử dụng"
      ) {
        toast.error("Email hoặc số điện thoại đã được sử dụng", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          theme: "light",
        });
        setIsLoading(false);
        return;
      }

      toast.success("Đăng ký thành công!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        theme: "dark",
      });

      if (response.status !== 201) {
        toast.error("Đăng ký thất bại! Vui lòng kiểm tra lại.", {
          position: "top-right",
          autoClose: 2000,
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
          autoClose: 2000,
          hideProgressBar: false,
          theme: "light",
        });

        dispatch(login(customerData));
        handleCloseSignUpForm();
      } catch {
        toast.error("Có lỗi xảy ra khi giải mã token.", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          theme: "light",
        });
        return;
      }

      router.push("/");
    } catch {
      toast.error("Có lỗi xảy ra. Vui lòng thử lại sau.", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        theme: "light",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseSignUpForm = () => {
    reset();
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
          <h1 className="text-2xl font-bold text-primary">
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
              className="py-6 px-4 rounded-md bg-white shadow-sm"
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
              Nhập lại mật khẩu
            </Label>
            <Input
              className="py-6 px-4 rounded-md bg-white shadow-sm"
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
              className="py-6 px-4 rounded-md bg-white shadow-sm"
              {...register("sex")}
            >
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
              <option value="Khác">Khác</option>
            </select>
            {errors.sex && (
              <p className="text-red-500 text-xs">{errors.sex.message}</p>
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

          <div className="text-left text-sm text-fourth font-medium my-1">
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

      <SignInButton
        open={isSignInModalOpen}
        onOpenChange={setSignInModalOpen}
        onCloseSignUpForm={handleCloseSignUpForm}
      />
    </>
  );
}
