"use client";

import { useEffect, useState } from "react";
import { Modal } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/stores";
import { PhoneForm } from "./phone-form";
import { EmailForm } from "./email-form";
import { PasswordForm } from "./password-form";
import { resetLoginStep } from "@/stores/slices/authSlice";
import ForgotPasswordForm from "./forgot-password-form";
import ResetPasswordForm from "./reset-password-form";

interface SignInButtonProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCloseSignUpForm: () => void;
  className?: string;
}

export function SignInButton({
  open,
  onOpenChange,
  onCloseSignUpForm,
}: SignInButtonProps) {
  const { loginStep } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const [formState, setFormState] = useState<"signin" | "forgot" | "reset">(
    "signin"
  );
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    if (open) {
      onCloseSignUpForm();
    }
  }, [open, onCloseSignUpForm]);

  useEffect(() => {
    // Reset to signin form when modal is closed
    if (!open) {
      setFormState("signin");
    }
  }, [open]);

  const handleCancel = () => {
    onOpenChange(false);
    dispatch(resetLoginStep());
    setFormState("signin");
  };

  const handleOpenForgotPassword = () => {
    setFormState("forgot");
  };

  const handleBackToSignIn = () => {
    setFormState("signin");
  };

  const handleBackToForgot = () => {
    setFormState("forgot");
  };

  const handleOpenResetPassword = (email: string) => {
    setUserEmail(email);
    setFormState("reset");
  };

  return (
    <Modal
      title={
        <p className="text-xl font-bold text-primary">
          {formState === "signin"
            ? "Đăng nhập"
            : formState === "forgot"
            ? "Quên mật khẩu"
            : "Đặt lại mật khẩu"}
        </p>
      }
      open={open}
      onCancel={handleCancel}
      footer={null}
      width={formState === "reset" ? 600 : undefined}
    >
      {/* Sign In Forms */}
      {formState === "signin" && loginStep === "phone" && (
        <PhoneForm
          onClose={handleCancel}
          onForgotPassword={handleOpenForgotPassword}
        />
      )}
      {formState === "signin" && loginStep === "email" && (
        <EmailForm
          onClose={handleCancel}
          onForgotPassword={handleOpenForgotPassword}
        />
      )}
      {formState === "signin" && loginStep === "password" && (
        <PasswordForm
          onClose={handleCancel}
          onForgotPassword={handleOpenForgotPassword}
        />
      )}

      {/* Forgot Password Form */}
      {formState === "forgot" && (
        <ForgotPasswordForm
          onBack={handleBackToSignIn}
          onResetPasswordOpen={handleOpenResetPassword}
        />
      )}

      {/* Reset Password Form */}
      {formState === "reset" && (
        <ResetPasswordForm
          email={userEmail}
          onBack={handleBackToForgot}
          backToForgot={true}
          onSuccess={() => {
            handleCancel();
          }}
        />
      )}
    </Modal>
  );
}
