"use client";

import { Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { identifySchema } from "@/lib/zod/schema";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IdentifyProps } from "@/types";

interface IdentifyFormProps {
  initialData?: IdentifyProps | null;
  onSubmit: () => void;
}

function IdentifyForm({ initialData, onSubmit }: IdentifyFormProps) {
  const form = useForm<z.infer<typeof identifySchema>>({
    resolver: zodResolver(identifySchema),
    defaultValues: initialData
      ? { ...initialData }
      : {
          name: "",
          number: "",
          dateOfBirth: "",
          gender: "1",
          nationality: "",
          placeOfOrigin: "",
          placeOfResidence: "",
          dateOfExpiry: "",
          dateOfCreation: "",
          file: "",
        },
  });

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);

  const onCreate = (values: z.infer<typeof identifySchema>) => {
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
                      Họ và tên
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="py-6 px-4 rounded-md file:bg-seventh"
                        placeholder="Nhập họ và tên..."
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
                    Số CCCD
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="py-6 px-4 rounded-md file:bg-seventh"
                      placeholder="Nhập số CCCD..."
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
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-fourth font-bold text-base ml-6">
                      Ngày sinh
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="py-6 px-4 rounded-md file:bg-seventh"
                        placeholder="Nhập ngày sinh..."
                        type="date"
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
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-fourth font-bold text-base ml-6">
                    Giới tính
                  </FormLabel>
                  <FormControl>
                    <Select
                      value={field.value || "2"}
                      onValueChange={(value) => field.onChange(value)}
                    >
                      <SelectTrigger className="py-6 px-4 rounded-md">
                        <SelectValue placeholder="Chọn giới tính" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem
                          className="rounded-sm flex items-center gap-2 focus:bg-primary focus:text-white p-2 transition-colors duration-200"
                          value="1"
                        >
                          Nam
                        </SelectItem>
                        <SelectItem
                          className="rounded-sm flex items-center gap-2 focus:bg-primary focus:text-white p-2 transition-colors duration-200"
                          value="2"
                        >
                          Nữ
                        </SelectItem>
                        <SelectItem
                          className="rounded-sm flex items-center gap-2 focus:bg-primary focus:text-white p-2 transition-colors duration-200"
                          value="3"
                        >
                          Khác
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs" />
                </FormItem>
              )}
            />
          </div>
          <div className="sm:col-span-1 flex flex-col gap-2 w-full">
            <FormField
              control={form.control}
              name="nationality"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-fourth font-bold text-base ml-6">
                    Quốc tịch
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="py-6 px-4 rounded-md file:bg-seventh"
                      placeholder="Nhập quốc tịch..."
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
              name="placeOfOrigin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-fourth font-bold text-base ml-6">
                    Quê quán
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="py-6 px-4 rounded-md file:bg-seventh"
                      placeholder="Nhập quê quán..."
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
              name="placeOfResidence"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-fourth font-bold text-base ml-6">
                    Nơi thường trú
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="py-6 px-4 rounded-md file:bg-seventh"
                      placeholder="Nhập nơi thường trú..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs" />
                </FormItem>
              )}
            />
          </div>
          <div className="sm:col-span-1 flex flex-col gap-2 w-full">
            <FormField
              control={form.control}
              name="dateOfExpiry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-fourth font-bold text-base ml-6">
                    Ngày hết hạn
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="py-6 px-4 rounded-md file:bg-seventh"
                      placeholder="Nhập ngày hết hạn..."
                      type="date"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs" />
                </FormItem>
              )}
            />
          </div>
          <div className="sm:col-span-1 flex flex-col gap-2 w-full">
            <FormField
              control={form.control}
              name="dateOfCreation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-fourth font-bold text-base ml-6">
                    Ngày tạo thẻ
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="py-6 px-4 rounded-md file:bg-seventh"
                      placeholder="Nhập ngày tạo thẻ..."
                      type="date"
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

export default IdentifyForm;
