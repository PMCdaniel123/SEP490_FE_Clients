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

export function SignInButton({
  className,
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <Dialog>
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
        <SignInForm />
      </DialogContent>
    </Dialog>
  );
}
