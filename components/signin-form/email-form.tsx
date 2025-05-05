import { ArrowRight, Phone } from "lucide-react";
import { z } from "zod";
import { cn } from "@/libs/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { SignInFormProps, ValidatePayload } from "@/types";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/stores";
import { emailSchema } from "@/libs/zod/schema";
import { setLoginStep, validateEmail } from "@/stores/slices/authSlice";
import { useState } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import GoogleButton from "./google-button";

export type FormInputs = z.infer<typeof emailSchema>;

export function EmailForm({
  className,
  onClose,
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
      <div className="flex flex-col md:flex-row md:items-center w-full gap-4">
        <div className="md:w-1/3">
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
          className="flex items-center gap-2 md:w-2/3 text-fourth hover:text-primary cursor-pointer text-sm"
          onClick={() => dispatch(setLoginStep("phone"))}
        >
          <Phone />{" "}
          <span className="font-semibold">Đăng nhập bằng số điện thoại</span>
        </div>
      </div>
      <div className="flex items-center my-6 w-full">
        <hr className="w-[10%] border-sixth h-1" />
        <span className="w-[60%] md:w-[50%] px-3 text-fifth font-semibold text-sm">
          Hoặc tiếp tục với
        </span>
        <hr className="w-full border-sixth h-1" />
      </div>
      <GoogleButton onClose={onClose} />
    </form>
  );
}
