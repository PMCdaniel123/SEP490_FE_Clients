"use client";

import { Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { licenseSchema } from "@/lib/zod/schema";
import { useEffect } from "react";
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
import { LicenseProps } from "@/types";

interface LicenseFormProps {
  initialData?: LicenseProps | null;
  onSubmit: () => void;
}

function LicenseForm({ initialData, onSubmit }: LicenseFormProps) {
  const form = useForm<z.infer<typeof licenseSchema>>({
    resolver: zodResolver(licenseSchema),
    defaultValues: initialData
      ? { ...initialData }
      : {
          name: "",
          number: "",
          address: "",
          charterCapital: "",
          file: "",
        },
  });

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);

  const onCreate = (values: z.infer<typeof licenseSchema>) => {
    alert(JSON.stringify(values));
    onSubmit();
  };

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
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-fourth font-bold text-base ml-6">
                      Tên doanh nghiệp
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="py-6 px-4 rounded-md file:bg-seventh"
                        placeholder="Nhập tên doanh nghiệp..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="sm:col-span-2 flex flex-col gap-2 w-full">
            <FormField
              control={form.control}
              name="number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-fourth font-bold text-base ml-6">
                    Mã số doanh nghiệp
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="py-6 px-4 rounded-md file:bg-seventh"
                      placeholder="Nhập mã số doanh nghiệp..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs" />
                </FormItem>
              )}
            />
          </div>
          <div className="sm:col-span-2 flex flex-col gap-2 w-full">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-fourth font-bold text-base ml-6">
                    Địa chỉ trụ sở chính của doanh nghiệp
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="py-6 px-4 rounded-md file:bg-seventh"
                      placeholder="Nhập địa chỉ trụ sở chính của doanh nghiệp..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs" />
                </FormItem>
              )}
            />
          </div>
          <div className="sm:col-span-2 items-start justify-between gap-6 grid sm:grid-cols-2">
            <div className="sm:col-span-1 flex flex-col gap-2 w-full">
              <FormField
                control={form.control}
                name="charterCapital"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-fourth font-bold text-base ml-6">
                      Vốn điều lệ (VND)
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="py-6 px-4 rounded-md file:bg-seventh"
                        placeholder="Nhập vốn điều lệ..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="sm:col-span-2 flex flex-col gap-2 w-full">
            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-fourth font-bold text-base ml-6">
                    File
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="py-3 px-4 rounded-md file:bg-seventh border h-[50px]"
                      placeholder="Nhập tên file..."
                      type="file"
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

export default LicenseForm;
