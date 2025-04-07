"use client";

import { useEffect } from "react";
import { Modal } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/stores";
import { PhoneForm } from "./phone-form";
import { EmailForm } from "./email-form";
import { PasswordForm } from "./password-form";
import { resetLoginStep } from "@/stores/slices/authSlice";
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
  const dispatch = useDispatch();

  useEffect(() => {
    if (open) {
      onCloseSignUpForm();
    }
  }, [open, onCloseSignUpForm]);

  const handleCancel = () => {
    onOpenChange(false);
    dispatch(resetLoginStep());
  };

  return (
    <Modal
      title={<p className="text-xl font-bold text-primary">Đăng nhập</p>}
      open={open}
      onCancel={handleCancel}
      footer={null}
    >
      {loginStep === "phone" && <PhoneForm onClose={handleCancel} />}
      {loginStep === "email" && <EmailForm onClose={handleCancel} />}
      {loginStep === "password" && <PasswordForm onClose={handleCancel} />}
    </Modal>
  );
}
