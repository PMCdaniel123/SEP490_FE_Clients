"use client";

import { Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { phoneSchema } from "@/lib/zod/schema";
import { useEffect, useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { PhoneProps } from "@/types";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";

interface PhoneFormProps {
  initialData?: PhoneProps | null;
  onSubmit: () => void;
}

function PhoneForm({ initialData, onSubmit }: PhoneFormProps) {
  const [countdown, setCountdown] = useState<number>(0);

  const form = useForm<z.infer<typeof phoneSchema>>({
    resolver: zodResolver(phoneSchema),
    defaultValues: initialData
      ? { ...initialData }
      : {
          phone: "",
        },
  });

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);

  const onCreate = (values: z.infer<typeof phoneSchema>) => {
    alert(JSON.stringify(values));
    onSubmit();
  };

  const onSendOTP = () => {
    setCountdown(60);
  };

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [countdown]);

  return (
    <div className="flex flex-col">
      <Separator className="my-4 bg-primary" />
      <Form {...form}>
        <form
          className="grid sm:grid-cols-2 gap-6"
          onSubmit={form.handleSubmit(onCreate)}
        >
          <div className="sm:col-span-2 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-fourth font-bold text-base ml-6">
                      Số điện thoại
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="py-6 px-4 rounded-md file:bg-seventh"
                        placeholder="Nhập số điện thoại..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="sm:col-span-2 flex flex-col gap-2 items-start justify-center">
            <Button
              className="text-white"
              type="button"
              onClick={onSendOTP}
              disabled={countdown > 0}
            >
              {countdown > 0 ? `Gửi lại trong ${countdown}s` : "Gửi OTP"}
            </Button>

            {countdown > 0 && (
              <p className="text-sm text-gray-500">
                Vui lòng chờ đợi trong {countdown} giây để gửi lại OTP.
              </p>
            )}
          </div>
          <div className="sm:col-span-2 flex flex-col gap-2 w-full">
            <InputOTP maxLength={6}>
              <InputOTPGroup>
                <InputOTPSlot className="h-12 w-12 text-lg" index={0} />
                <InputOTPSlot className="h-12 w-12 text-lg" index={1} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot className="h-12 w-12 text-lg" index={2} />
                <InputOTPSlot className="h-12 w-12 text-lg" index={3} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot className="h-12 w-12 text-lg" index={4} />
                <InputOTPSlot className="h-12 w-12 text-lg" index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
          <div className="sm:col-span-2 flex flex-col gap-2 w-full">
            <button
              className="z-10 flex gap-2 items-center justify-center bg-primary text-white py-3 rounded-md hover:bg-secondary"
              type="submit"
            >
              <Save size={18} /> <span className="font-bold">Xác nhận</span>
            </button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default PhoneForm;
