"use client";

import { useEffect } from "react";
import { Modal } from "antd";
import { useSelector } from "react-redux";
import { RootState } from "@/stores";
import { PhoneForm } from "./phone-form";
import { EmailForm } from "./email-form";
import { PasswordForm } from "./password-form";
// import { OwnerButton } from "./owner-button";

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

  useEffect(() => {
    if (open) {
      onCloseSignUpForm();
    }
  }, [open, onCloseSignUpForm]);

  return (
    <Modal
      title={<p className="text-xl font-bold text-primary">Đăng nhập</p>}
      open={open}
      onCancel={() => onOpenChange(false)}
      footer={null}
    >
      {loginStep === "phone" && (
        <PhoneForm onClose={() => onOpenChange(false)} />
      )}
      {loginStep === "email" && (
        <EmailForm onClose={() => onOpenChange(false)} />
      )}
      {loginStep === "password" && (
        <PasswordForm onClose={() => onOpenChange(false)} />
      )}
      {/* <OwnerButton onOpenChange={onOpenChange} /> */}
    </Modal>
  );
}
