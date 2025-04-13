import { ArrowRight, Phone } from "lucide-react";
import { z } from "zod";
import { cn } from "@/libs/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { SignInFormProps, ValidatePayload } from "@/types";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/stores";
import { emailSchema } from "@/libs/zod/schema";
import { setLoginStep, validateEmail } from "@/stores/slices/authSlice";
import { useState } from "react";
import { LoadingOutlined } from "@ant-design/icons";

export type FormInputs = z.infer<typeof emailSchema>;

export function EmailForm({
  className,
  onForgotPassword,
}: SignInFormProps & { onForgotPassword?: () => void }) {
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormInputs>({
    resolver: zodResolver(emailSchema),
  });

  const handleContinue: SubmitHandler<FormInputs> = async (data) => {
    setIsLoading(true);
    try {
      const payload: ValidatePayload = { input: data.email };
      await dispatch(validateEmail(payload)).unwrap();
    } catch {
      reset();
      return new Error("Email không hợp lệ!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      className={cn(
        "flex flex-col items-center space-x-2 gap-4 mt-8 w-full",
        className
      )}
      onSubmit={handleSubmit(handleContinue)}
    >
      <div className="flex flex-col w-full border rounded-md h-full justify-center px-6 py-3 relative">
        <p className="text-xs font-medium text-sixth absolute -top-2 left-5 bg-white px-4">
          Email
        </p>
        <input
          type="email"
          className="py-2 focus:outline-none"
          placeholder="Nhập email"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-red-500 text-xs">{errors.email.message}</p>
        )}
      </div>
      <div className="flex items-center justify-between w-full mb-4">
        <p className="text-xs text-fourth w-3/5">
          Nhập email bên trên để đăng nhập vào tài khoản WorkHive
        </p>
        <button
          type="button"
          onClick={onForgotPassword}
          className="text-xs text-primary hover:text-secondary font-medium"
        >
          Quên mật khẩu?
        </button>
      </div>
      <div className="flex items-center w-full sm:gap-4">
        <div className="w-1/3">
          <button
            type="submit"
            disabled={isLoading}
            className="group cursor-pointer rounded-xl border-4 border-primary border-opacity-0 bg-transparent p-1 transition-all duration-500 hover:border-opacity-100"
          >
            <div className="relative flex items-center justify-center gap-4 overflow-hidden rounded-lg bg-primary px-4 py-4 font-bold text-white">
              {isLoading ? (
                <LoadingOutlined style={{ color: "white" }} />
              ) : (
                "Tiếp tục"
              )}
              <ArrowRight className="transition-all group-hover:translate-x-1 group-hover:scale-105" />
              <div
                className={cn(
                  "absolute -left-16 top-0 h-full w-12 rotate-[30deg] scale-y-150 bg-white/10 transition-all duration-700 group-hover:left-[calc(100%+1rem)]"
                )}
              />
            </div>
          </button>
        </div>
        <div
          className="flex items-center gap-2 w-2/3 text-fourth hover:text-primary cursor-pointer text-sm"
          onClick={() => dispatch(setLoginStep("phone"))}
        >
          <Phone />{" "}
          <span className="font-semibold">Đăng nhập bằng số điện thoại</span>
        </div>
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
