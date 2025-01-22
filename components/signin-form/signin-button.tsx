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
import { Mail } from "lucide-react";

export function SignInButton({
  className,
}: React.ComponentPropsWithoutRef<"button">) {
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
        <div className="flex flex-col items-center space-x-2 gap-4 mt-8 w-full">
          <div className="flex border rounded-full p-6 w-full justify-between items-center">
            <div className="flex items-center border rounded-lg overflow-hidden mb-4">
              <select
                className="bg-gray-100 border-r p-3 focus:outline-none"
                defaultValue="VN (+84)"
              >
                <option value="VN (+84)">VN (+84)</option>
                <option value="US (+1)">US (+1)</option>
                <option value="UK (+44)">UK (+44)</option>
              </select>
              <input
                type="text"
                placeholder="Nhập số điện thoại"
                className="flex-1 p-3 focus:outline-none"
              />
            </div>

            <div className="flex flex-col">
              <h1>Số điện thoại</h1>
              <h2>Nhập số điện thoại</h2>
            </div>
          </div>
          <div className="flex items-center w-full sm:gap-10">
            <div className="w-1/3">
              <Button className="w-full text-white py-6 font-semibold">
                Tiếp tục
              </Button>
            </div>
            <div className="flex items-center gap-2 w-2/3 text-fourth hover:text-primary cursor-pointer text-sm">
              <Mail />{" "}
              <span className="font-semibold">Đăng nhập bằng Email</span>
            </div>
          </div>
          <div className="flex items-center my-6 w-full">
            <hr className="w-[10%] border-sixth h-1" />
            <span className="w-[40%] px-3 text-fifth font-semibold text-sm">
              Hoặc tiếp tục với
            </span>
            <hr className="w-full border-sixth h-1" />
          </div>
          <div className="text-center w-full">
            <Button className="text-white py-6 font-semibold w-3/5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="150"
                height="150"
                viewBox="0 0 48 48"
              >
                <path
                  fill="#fbc02d"
                  d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12	s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20	s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                ></path>
                <path
                  fill="#e53935"
                  d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039	l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                ></path>
                <path
                  fill="#4caf50"
                  d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36	c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                ></path>
                <path
                  fill="#1565c0"
                  d="M43.611,20.083L43.595,20L42,20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571	c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                ></path>
              </svg>
              Đăng nhập với Google
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
