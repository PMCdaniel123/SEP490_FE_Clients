"use client";

import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "../ui/separator";
import { SignInForm } from "./signin-form";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/stores";
import { PasswordForm } from "./password-form";
import { logout } from "@/stores/slices/authSlice";

export function SignInButton({
  className,
}: React.ComponentPropsWithoutRef<"div">) {
  const [open, isOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { loginStep } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!open) {
      dispatch(logout());
    }
  }, [open, dispatch]);

  return (
    <Dialog open={open} onOpenChange={isOpen}>
      <DialogTrigger asChild>
        <Button className={cn("text-white py-6 font-semibold", className)}>
          Đăng nhập
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-primary font-bold mb-4 text-xl">
            Đăng nhập
          </DialogTitle>
          <Separator />
        </DialogHeader>
        {loginStep === "emailOrPhone" ? (
          <SignInForm onClose={() => isOpen(false)} />
        ) : (
          <PasswordForm onClose={() => isOpen(false)} />
        )}
      </DialogContent>
    </Dialog>
  );
}
