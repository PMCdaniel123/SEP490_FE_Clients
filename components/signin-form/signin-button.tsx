"use client";

import { useEffect } from "react";
import { Modal } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/stores";
import { logout } from "@/stores/slices/authSlice";
import { PhoneForm } from "./phone-form";
import { EmailForm } from "./email-form";
import { PasswordForm } from "./password-form";

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
  const dispatch = useDispatch<AppDispatch>();
  const { loginStep } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (open) {
      onCloseSignUpForm();
    }
  }, [open, onCloseSignUpForm]);

  useEffect(() => {
    if (!open) {
      dispatch(logout());
    }
  }, [open, dispatch]);

  return (
    <Modal
      title="Đăng nhập"
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
    </Modal>
  );
}
