"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { BASE_URL } from "@/constants/environments";
import { resetPasswordSchema } from "@/libs/zod/schema";
import { LoadingOutlined } from "@ant-design/icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

interface ResetPasswordFormProps {
  email: string;
  onBack: () => void;
  onSuccess: () => void;
  backToForgot?: boolean;
}

function ResetPasswordForm({
  email,
  onBack,
  onSuccess,
  backToForgot = false,
}: ResetPasswordFormProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: email,
      token: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (email) {
      form.reset({
        email: email,
        token: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  }, [form, email]);

  const handleResetPassword = async (
    values: z.infer<typeof resetPasswordSchema>
  ) => {
    const data = {
      token: values.token,
      newPassword: values.newPassword,
      confirmPassword: values.confirmPassword,
    };
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/users/resetpassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        toast.error("Token không chính xác hoặc đã hết hạn.", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          theme: "light",
        });
        return;
      }
      toast.success("Đặt lại mật khẩu thành công!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        theme: "light",
      });
      localStorage.removeItem("email_ls");
      onSuccess();
    } catch (error) {
      console.log(error);
      toast.error("Có lỗi xảy ra. Vui lòng thử lại sau.", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        theme: "light",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6">
      <div
        className="flex items-center gap-2 cursor-pointer hover:text-primary w-fit mb-6"
        onClick={onBack}
      >
        <ArrowLeft size={18} />
        <span>
          {backToForgot ? "Quay lại quên mật khẩu" : "Quay lại đăng nhập"}
        </span>
      </div>

      <Form {...form}>
        <form
          className="flex flex-col gap-4"
          onSubmit={form.handleSubmit(handleResetPassword)}
        >
          <div className="flex flex-col gap-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-fifth font-medium text-xs ml-6">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="py-6 px-4 rounded-md file:bg-seventh"
                      placeholder="Nhập email..."
                      type="email"
                      disabled
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs" />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col gap-2 w-full">
            <FormField
              control={form.control}
              name="token"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-fifth font-medium text-xs ml-6">
                    Mã xác nhận
                  </FormLabel>
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs" />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col gap-2 w-full">
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-fifth font-medium text-xs ml-6">
                    Mật khẩu mới
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="py-6 px-4 rounded-md file:bg-seventh"
                      placeholder="Nhập mật khẩu mới..."
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs" />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col gap-2 w-full">
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-fifth font-medium text-xs ml-6">
                    Xác nhận mật khẩu
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="py-6 px-4 rounded-md file:bg-seventh"
                      placeholder="Nhập lại mật khẩu..."
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs" />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col gap-2 w-full mt-2">
            <button
              className="z-10 flex gap-2 items-center justify-center bg-primary text-white py-3 rounded-md hover:bg-secondary"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <LoadingOutlined style={{ color: "white" }} />
              ) : (
                <span className="font-semibold">Xác nhận</span>
              )}
            </button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default ResetPasswordForm;
