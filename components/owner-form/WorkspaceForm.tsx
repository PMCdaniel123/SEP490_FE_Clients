"use client";

import { Save, SquarePen } from "lucide-react";
import { Separator } from "../ui/separator";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { WorkspaceProps } from "@/types";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import MultiText from "../custom-ui/multi-text";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { workspaceSchema } from "@/lib/zod/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import MultiImageUpload from "../custom-ui/multi-image-upload";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useEffect } from "react";

interface WorkspaceFormProps {
  initialData?: WorkspaceProps | null;
}

function WorkspaceForm({ initialData }: WorkspaceFormProps) {
  const form = useForm<z.infer<typeof workspaceSchema>>({
    resolver: zodResolver(workspaceSchema),
    defaultValues: initialData
      ? { ...initialData }
      : {
          name: "",
          description: "",
          address: "",
          googleMapUrl: "",
          area: "",
          cleanTime: "",
          shortTermPrice: "",
          longTermPrice: "",
          images: [],
          facilities: [],
          policies: [],
          capacity: "",
          category: "1",
          status: "1",
        },
  });

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);

  const onCreate = (values: z.infer<typeof workspaceSchema>) => {
    alert(JSON.stringify(values));
  };

  return (
    <div className="flex flex-col">
      <h1 className="text-xl font-bold text-primary flex items-center gap-4 mt-4">
        <SquarePen />
        {initialData ? (
          <span>Chỉnh sửa không gian</span>
        ) : (
          <span>Tạo mới không gian</span>
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
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-fourth font-bold text-base ml-6">
                      Tên không gian
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="py-6 px-4 rounded-md file:bg-seventh"
                        placeholder="Nhập tên không gian..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-fourth font-bold text-base ml-6">
                      Địa chỉ
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="py-6 px-4 rounded-md file:bg-seventh"
                        placeholder="Nhập địa chỉ..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="googleMapUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-fourth font-bold text-base ml-6">
                      Link Google Map
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="py-6 px-4 rounded-md file:bg-seventh"
                        placeholder="Nhập link Google Map..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />
            </div>

            <div className="sm:col-span-1 flex flex-col gap-6 h-full justify-center w-full p-4 bg-primary rounded-md">
              <Label className="text-seventh font-bold text-base ml-6">
                Giá tiền
              </Label>
              <FormField
                control={form.control}
                name="shortTermPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-seventh font-bold text-sm">
                      1. Theo giờ (VND)
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="py-6 px-4 rounded-md file:bg-seventh placeholder:text-seventh text-seventh"
                        placeholder="Nhập giá theo giờ..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="longTermPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-seventh font-bold text-sm">
                      2. Theo ngày (VND)
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="py-6 px-4 rounded-md file:bg-seventh placeholder:text-seventh text-seventh"
                        placeholder="Nhập giá theo ngày..."
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
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-fourth font-bold text-base ml-6">
                    Loại không gian
                  </FormLabel>
                  <FormControl>
                    <Select
                      value={field.value || "2"}
                      onValueChange={(value) => field.onChange(value)}
                    >
                      <SelectTrigger className="py-6 px-4 rounded-md">
                        <SelectValue placeholder="Chọn loại không gian" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem
                          className="rounded-sm flex items-center gap-2 focus:bg-primary focus:text-white p-2 transition-colors duration-200"
                          value="1"
                        >
                          Bàn cá nhân
                        </SelectItem>
                        <SelectItem
                          className="rounded-sm flex items-center gap-2 focus:bg-primary focus:text-white p-2 transition-colors duration-200"
                          value="2"
                        >
                          Văn phòng
                        </SelectItem>
                        <SelectItem
                          className="rounded-sm flex items-center gap-2 focus:bg-primary focus:text-white p-2 transition-colors duration-200"
                          value="3"
                        >
                          Phòng họp
                        </SelectItem>
                        <SelectItem
                          className="rounded-sm flex items-center gap-2 focus:bg-primary focus:text-white p-2 transition-colors duration-200"
                          value="4"
                        >
                          Phòng hội thảo
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
              name="area"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-fourth font-bold text-base ml-6">
                    Diện tích (m2)
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="py-6 px-4 rounded-md file:bg-seventh"
                      placeholder="Nhập diện tích..."
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
              name="capacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-fourth font-bold text-base ml-6">
                    Sức chứa tối đa (người)
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="py-6 px-4 rounded-md file:bg-seventh"
                      placeholder="Nhập sức chứa tối đa..."
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
          <div className="sm:col-span-1 flex flex-col gap-2 w-full">
            <FormField
              control={form.control}
              name="cleanTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-fourth font-bold text-base ml-6">
                    Thời gian dọn dẹp (phút)
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="py-6 px-4 rounded-md file:bg-seventh"
                      placeholder="Nhập thời gian dọn dẹp..."
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
              name="facilities"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-fourth font-bold text-base ml-6">
                    Cơ sở vật chất
                  </FormLabel>
                  <FormControl>
                    <MultiText
                      placeholder="Nhập cơ sở vật chất..."
                      value={field.value}
                      handleChange={(tag) =>
                        field.onChange([...field.value, tag])
                      }
                      handleRemove={(tag) =>
                        field.onChange([
                          ...field.value.filter((item) => item !== tag),
                        ])
                      }
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
            <FormField
              control={form.control}
              name="policies"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-fourth font-bold text-base ml-6">
                    Quy định chung
                  </FormLabel>
                  <FormControl>
                    <MultiText
                      placeholder="Nhập quy định chung..."
                      value={field.value}
                      handleChange={(tag) =>
                        field.onChange([...field.value, tag])
                      }
                      handleRemove={(tag) =>
                        field.onChange([
                          ...field.value.filter((item) => item !== tag),
                        ])
                      }
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
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-fourth font-bold text-base ml-6">
                    Hình ảnh
                  </FormLabel>
                  <FormControl>
                    <MultiImageUpload
                      value={field.value}
                      handleChange={(tag) =>
                        field.onChange([...field.value, tag])
                      }
                      handleRemove={(tag) =>
                        field.onChange([
                          ...field.value.filter((item) => item !== tag),
                        ])
                      }
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

export default WorkspaceForm;
