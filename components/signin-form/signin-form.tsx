import { Button } from "../ui/button";
import { Mail } from "lucide-react";
import { signinSchema } from "@/lib/zod/schema";
import { z } from "zod";
import { toast } from "react-toastify";
import { cn } from "@/lib/utils";
import { useRef, useState } from "react";

export type FormInputs = z.infer<typeof signinSchema>;
export function SignInForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const [phone, setPhone] = useState<string>("");
  const phoneRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const handleSignIn = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    console.log("Phone: ", phone);
    toast.success("Đăng nhập thành công!", {
      position: "bottom-right",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colorful",
    });
  };

  return (
    <form
      className={cn(
        "flex flex-col items-center space-x-2 gap-4 mt-8 w-full",
        className
      )}
      {...props}
    >
      <div className="flex w-full justify-center items-center">
        <div className="flex w-1/3 rounded-s-full items-center border overflow-hidden">
          <div className="flex flex-col pl-6 p-4 w-full justify-center h-full">
            <p className="text-sm font-medium text-fifth">Quốc gia</p>
            <select
              className="py-2 focus:outline-none w-full font-bold text-fourth cursor-pointer"
              defaultValue="VN"
            >
              <option value="VN">VN (+84)</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col w-2/3 border rounded-e-full h-full justify-center pl-6 pr-4">
          <p className="text-sm font-medium text-fifth">Số điện thoại</p>
          <input
            type="tel"
            className="py-2 focus:outline-none"
            placeholder="Nhập số điện thoại"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            ref={phoneRef}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
          {!isFocused && phone.length < 10 && phone.length > 0 && (
            <p className="text-red-500 text-xs">
              Số điện thoại phải có ít nhất 10 ký tự
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center w-full mb-4">
        <p className="text-xs text-fifth">
          Nhập sdt bên trên để đăng nhập vào tài khoản WorkHive
        </p>
      </div>
      <div className="flex items-center w-full sm:gap-10">
        <div className="w-1/3">
          <Button
            className="w-full text-white py-6 font-semibold"
            type="submit"
            onClick={handleSignIn}
          >
            Tiếp tục
          </Button>
        </div>
        <div className="flex items-center gap-2 w-2/3 text-fourth hover:text-primary cursor-pointer text-sm">
          <Mail /> <span className="font-semibold">Đăng nhập bằng Email</span>
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
    </form>
  );
}
