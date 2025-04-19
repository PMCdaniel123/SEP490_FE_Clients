import { passwordSchema } from "@/libs/zod/schema";
import { z } from "zod";
import { toast } from "react-toastify";
import { cn } from "@/libs/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { SignInFormProps } from "@/types";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/stores";
import { login, resetLoginStep } from "@/stores/slices/authSlice";
import Image from "next/image";
import { useState } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { BASE_URL } from "@/constants/environments";
import Cookies from "js-cookie";

export type FormInputs = z.infer<typeof passwordSchema>;

export function PasswordForm({
  className,
  onClose,
  onForgotPassword,
}: SignInFormProps & { onForgotPassword?: () => void }) {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const auth = localStorage.getItem("auth");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>({
    resolver: zodResolver(passwordSchema),
  });

  const handleSignIn: SubmitHandler<FormInputs> = async (data) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          auth: auth ? auth : "",
          password: data.password,
        }),
      });

      if (!response.ok) {
        toast.error("Đăng nhập thất bại! Vui lòng kiểm tra lại.", {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          theme: "light",
        });
        return;
      }

      const result = await response.json();
      const token = result.token;

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
        localStorage.removeItem("auth");
        onClose?.();
      } catch {
        toast.error("Có lỗi xảy ra khi đăng nhập.", {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          theme: "light",
        });
        return;
      }
    } catch {
      toast.error("Có lỗi xảy ra. Vui lòng thử lại sau.", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        theme: "light",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      className={cn(
        "flex flex-col items-center space-x-2 gap-4 mt-4 w-full",
        className
      )}
      onSubmit={handleSubmit(handleSignIn)}
    >
      <div className="flex items-center w-full mb-2">
        <div>
          <Image
            src="/WorkHive.svg"
            alt="Image"
            width={60}
            height={60}
            className="rounded-full border"
          />
        </div>
        <div className="flex flex-col ml-2 gap-1">
          <p className="text-base font-bold text-fourth">Xin chào, {user}</p>
          <p
            className="text-sm font-medium text-fifth cursor-pointer hover:text-sixth"
            onClick={() => dispatch(resetLoginStep())}
          >
            Không phải bạn?
          </p>
        </div>
      </div>
      <div className="flex flex-col w-full border rounded-md h-full justify-center px-6 py-3 relative">
        <p className="text-xs font-medium text-sixth absolute -top-2 left-5 bg-white px-4">
          Mật khẩu
        </p>
        <input
          type="password"
          className="py-2 focus:outline-none"
          placeholder="Nhập mật khẩu"
          {...register("password")}
        />
        {errors.password && (
          <p className="text-red-500 text-xs">{errors.password.message}</p>
        )}
      </div>
      <div className="flex justify-end w-full">
        <button
          type="button"
          onClick={onForgotPassword}
          className="text-xs text-primary hover:text-secondary font-medium"
        >
          Quên mật khẩu?
        </button>
      </div>
      <div className="text-center w-full">
        <Button
          className="text-white py-6 font-semibold w-3/5"
          disabled={isLoading}
        >
          {isLoading ? (
            <LoadingOutlined style={{ color: "white" }} />
          ) : (
            "Đăng nhập"
          )}
        </Button>
      </div>
      <div className="flex items-center my-6 w-full">
        <hr className="w-[10%] border-sixth h-1" />
        <span className="w-[50%] px-3 text-fifth font-semibold text-sm">
          Hoặc tiếp tục với
        </span>
        <hr className="w-full border-sixth h-1" />
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
    </form>
  );
}
