"use client";

import { Save, SquarePen } from "lucide-react";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { WithdrawalProps } from "@/types";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { withdrawalSchema } from "@/lib/zod/schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useEffect } from "react";

interface WithdrawalFormProps {
  initialData?: WithdrawalProps | null;
}

function WithdrawalForm({ initialData }: WithdrawalFormProps) {
  const form = useForm<z.infer<typeof withdrawalSchema>>({
    resolver: zodResolver(withdrawalSchema),
    defaultValues: initialData
      ? { ...initialData }
      : {
          number: "",
          bank: "",
          money: "",
        },
  });

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);

  const onCreate = (values: z.infer<typeof withdrawalSchema>) => {
    alert(JSON.stringify(values));
  };

  return (
    <div className="flex flex-col">
      <h1 className="text-xl font-bold text-primary flex items-center gap-4 mt-4">
        <SquarePen />
        {initialData ? (
          <span>Chỉnh sửa yêu cầu rút tiền</span>
        ) : (
          <span>Tạo mới yêu cầu rút tiền</span>
        )}
      </h1>
      <Separator className="mt-4 mb-8 bg-primary" />
      <Form {...form}>
        <form
          className="grid sm:grid-cols-2 gap-6"
          onSubmit={form.handleSubmit(onCreate)}
        >
          <div className="sm:col-span-2 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <FormField
                control={form.control}
                name="number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-fourth font-bold text-base ml-6">
                      Số tài khoản ngân hàng
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="py-6 px-4 rounded-md file:bg-seventh"
                        placeholder="Nhập số tài khoản ngân hàng..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="sm:col-span-2 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <FormField
                control={form.control}
                name="bank"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-fourth font-bold text-base ml-6">
                      Tên ngân hàng
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="py-6 px-4 rounded-md file:bg-seventh"
                        placeholder="Nhập tên ngân hàng..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="sm:col-span-1 flex flex-col gap-2 w-full">
            <FormField
              control={form.control}
              name="money"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-fourth font-bold text-base ml-6">
                    Số tiền
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="py-6 px-4 rounded-md file:bg-seventh"
                      placeholder="Nhập số tiền..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs" />
                </FormItem>
              )}
            />
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

export default WithdrawalForm;
