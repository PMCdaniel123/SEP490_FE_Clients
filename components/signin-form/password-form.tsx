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
import GoogleButton from "./google-button";

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

      if (
        result.notification === "Không tìm thấy người dùng" ||
        result.token === ""
      ) {
        throw new Error("Sai tài khoản hoặc mật khẩu! Vui lòng thử lại.");
      }

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
        if (Number(customerData.roleId) !== 4) {
          localStorage.removeItem("auth");
          onClose?.();
          throw new Error(
            "Bạn không được phép truy cập! Vui lòng đăng nhập lại."
          );
        }
        toast.success("Đăng nhập thành công!", {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          theme: "light",
        });
        dispatch(login(customerData));
        localStorage.removeItem("auth");
        onClose?.();
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Có lỗi xảy ra.";
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          theme: "light",
        });
        return;
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Có lỗi xảy ra.";
      toast.error(errorMessage, {
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
      autoComplete="off"
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
      <GoogleButton onClose={onClose} />
    </form>
  );
}
