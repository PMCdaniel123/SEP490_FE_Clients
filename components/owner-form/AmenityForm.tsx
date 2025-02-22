"use client";

import { Save, SquarePen } from "lucide-react";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { AmenityProps } from "@/types";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { amenitySchema } from "@/lib/zod/schema";
import ImageUpload from "../custom-ui/image-upload";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useEffect } from "react";

interface AmenityFormProps {
  initialData?: AmenityProps | null;
}

function AmenityForm({ initialData }: AmenityFormProps) {
  const form = useForm<z.infer<typeof amenitySchema>>({
    resolver: zodResolver(amenitySchema),
    defaultValues: initialData
      ? { ...initialData }
      : {
          name: "",
          description: "",
          price: "",
          image: "",
          quantity: "",
          category: "",
          status: "1",
        },
  });

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);

  const onCreate = (values: z.infer<typeof amenitySchema>) => {
    alert(JSON.stringify(values));
  };

  return (
    <div className="flex flex-col">
      <h1 className="text-xl font-bold text-primary flex items-center gap-4 mt-4">
        <SquarePen />
        {initialData ? (
          <span>Chỉnh sửa tiện ích</span>
        ) : (
          <span>Tạo mới tiện ích</span>
        )}
      </h1>
      <Separator className="mt-4 mb-8 bg-primary" />
      <Form {...form}>
        <form
          className="grid sm:grid-cols-3 gap-6"
          onSubmit={form.handleSubmit(onCreate)}
        >
          <div className="sm:col-span-3 items-start justify-between gap-6 grid sm:grid-cols-3">
            <div className="sm:col-span-2 flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-fourth font-bold text-base ml-6">
                        Tên tiện ích
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="py-6 px-4 rounded-md file:bg-seventh"
                          placeholder="Nhập tên tiện ích..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="sm:col-span-2 flex flex-col gap-2">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-fourth font-bold text-base ml-6">
                        Mô tả
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          className="py-4 px-4 rounded-md file:bg-seventh"
                          placeholder="Mô tả..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-xs" />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          <div className="sm:col-span-1 flex flex-col gap-2 w-full">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-fourth font-bold text-base ml-6">
                    Loại tiện ích
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="py-6 px-4 rounded-md file:bg-seventh"
                      placeholder="Nhập loại tiện ích..."
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
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-fourth font-bold text-base ml-6">
                    Số lượng
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="py-6 px-4 rounded-md file:bg-seventh"
                      placeholder="Nhập số lượng..."
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
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-fourth font-bold text-base ml-6">
                    Giá tiền (VND)
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="py-6 px-4 rounded-md file:bg-seventh"
                      placeholder="Nhập giá tiền..."
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
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-fourth font-bold text-base ml-6">
                    Hình ảnh
                  </FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value}
                      handleChange={(image) => field.onChange(image)}
                      handleRemove={() => field.onChange("")}
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
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-fourth font-bold text-base ml-6">
                    Trạng thái
                  </FormLabel>
                  <FormControl>
                    <Select
                      value={field.value || "2"}
                      onValueChange={(value) => field.onChange(value)}
                    >
                      <SelectTrigger className="py-6 px-4 rounded-md">
                        <SelectValue placeholder="Chọn trạng thái" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem
                          className="rounded-sm flex items-center gap-2 focus:bg-primary focus:text-white p-2 transition-colors duration-200"
                          value="1"
                        >
                          Hoạt động
                        </SelectItem>
                        <SelectItem
                          className="rounded-sm flex items-center gap-2 focus:bg-primary focus:text-white p-2 transition-colors duration-200"
                          value="2"
                        >
                          Ngừng hoạt động
                        </SelectItem>
                      </SelectContent>
                    </Select>
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

export default AmenityForm;
