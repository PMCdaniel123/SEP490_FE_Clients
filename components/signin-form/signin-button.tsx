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
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/stores";
import { PasswordForm } from "./password-form";
import { logout } from "@/stores/slices/authSlice";
import { PhoneForm } from "./phone-form";
import { EmailForm } from "./email-form";

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
        <Button
          className={cn(
            "bg-transparent p-0 m-0 border-0 shadow-none rounded-none hover:bg-transparent h-auto",
            className
          )}
        >
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
        {loginStep === "phone" && <PhoneForm onClose={() => isOpen(false)} />}
        {loginStep === "email" && <EmailForm onClose={() => isOpen(false)} />}
        {loginStep === "password" && (
          <PasswordForm onClose={() => isOpen(false)} />
        )}
      </DialogContent>
    </Dialog>
  );
}
