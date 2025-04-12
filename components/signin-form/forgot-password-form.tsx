"use client";

import { Input } from "@/components/ui/input";
import { BASE_URL } from "@/constants/environments";
import { LoadingOutlined } from "@ant-design/icons";
import { ArrowLeft, SquareCheckBig } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import { Button } from "../ui/button";

interface ForgotPasswordFormProps {
  onBack: () => void;
  onResetPasswordOpen: (email: string) => void;
}

function ForgotPasswordForm({
  onBack,
  onResetPasswordOpen,
}: ForgotPasswordFormProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error("Vui lòng nhập email!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        theme: "light",
      });
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/users/forgotpassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      // Get JSON response regardless of HTTP status
      const result = await response.json();

      // Check for specific notification in response first
      if (result.notification === "Tài khoản không tồn tại") {
        toast.error("Tài khoản không tồn tại.", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          theme: "light",
        });
        return;
      }

      // Then check if response was successful
      if (!response.ok) {
        toast.error("Email không tồn tại hoặc có lỗi xảy ra.", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          theme: "light",
        });
        return;
      }

      // Only proceed if response is OK
      toast.success("Vui lòng kiểm tra email để lấy mã xác nhận!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        theme: "light",
      });

      localStorage.setItem("email_ls", email);
      // Open the reset password form and pass the email
      onResetPasswordOpen(email);
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
    <div className="mt-6 flex flex-col gap-6">
      <div
        className="flex items-center gap-2 cursor-pointer hover:text-primary w-fit"
        onClick={onBack}
      >
        <ArrowLeft size={18} />
        <span>Quay lại đăng nhập</span>
      </div>

      <div className="flex items-center justify-center p-4 border border-primary rounded-md">
        <p className="text-fifth text-sm flex items-center gap-4">
          <span>
            <SquareCheckBig size={16} />
          </span>{" "}
          Vui lòng nhập địa chỉ email bạn đã đăng ký. Chúng tôi sẽ kiểm tra và
          gửi hướng dẫn đặt lại mật khẩu nếu tài khoản tồn tại.
        </p>
      </div>
      <div className="flex flex-col gap-2 w-full">
        <label className="text-fifth font-medium text-xs ml-6">Email</label>
        <Input
          type="email"
          placeholder="Nhập email..."
          className="py-6 px-4 rounded-md file:bg-seventh"
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-2 w-full">
        <Button
          className="text-white py-6 font-semibold w-full"
          disabled={loading || !email}
          onClick={handleForgotPassword}
        >
          {loading ? (
            <LoadingOutlined style={{ color: "white" }} />
          ) : (
            <span className="font-semibold">Xác nhận</span>
          )}
        </Button>
      </div>
    </div>
  );
}

export default ForgotPasswordForm;
