"use client";

import { Save, SquarePen } from "lucide-react";
import { Separator } from "../ui/separator";
import { Label } from "../ui/label";
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
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { amenitySchema } from "@/lib/zod/schema";
import ImageUpload from "../custom-ui/image-upload";

export type FormInputs = z.infer<typeof amenitySchema>;

interface AmenityFormProps {
  initialData?: AmenityProps | null;
}

function AmenityForm({ initialData }: AmenityFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormInputs>({
    resolver: zodResolver(amenitySchema),
  });
  const image = watch("image", "");

  const onCreate: SubmitHandler<FormInputs> = (data) => {
    alert(JSON.stringify(data));
  };

  // console.log(initialData);

  return (
    <div className="flex flex-col">
      <h1 className="text-xl font-bold text-primary flex items-center gap-4 mt-4">
        <SquarePen />
        <span>Tạo mới tiện ích</span>
      </h1>
      <Separator className="mt-4 mb-8 bg-primary" />
      <form
        className="grid sm:grid-cols-3 gap-6"
        onSubmit={handleSubmit(onCreate)}
      >
        <div className="sm:col-span-3 items-start justify-between gap-6 grid sm:grid-cols-3">
          <div className="sm:col-span-2 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="name"
                className="text-fourth font-bold text-base ml-6"
              >
                Tên tiện ích
              </Label>
              <Input
                className="py-6 px-4 rounded-md file:bg-seventh"
                id="name"
                type="text"
                placeholder="Nhập tên tiện ích..."
                {...register("name")}
              />
              {errors.name && (
                <p className="text-red-500 text-xs">{errors.name.message}</p>
              )}
            </div>

            <div className="sm:col-span-2 flex flex-col gap-2">
              <Label
                htmlFor="description"
                className="text-fourth font-bold text-base ml-6"
              >
                Mô tả
              </Label>
              <Textarea
                className="py-4 px-4 rounded-md file:bg-seventh"
                id="description"
                placeholder="Mô tả..."
                {...register("description")}
              />
              {errors.description && (
                <p className="text-red-500 text-xs">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="sm:col-span-1 flex flex-col gap-2 w-full">
          <Label
            htmlFor="category"
            className="text-fourth font-bold text-base ml-6"
          >
            Loại tiện ích
          </Label>
          <Input
            className="py-6 px-4 rounded-md file:bg-seventh"
            id="category"
            type="text"
            placeholder="Nhập loại tiện ích..."
            {...register("category")}
          />
          {errors.category && (
            <p className="text-red-500 text-xs">{errors.category.message}</p>
          )}
        </div>
        <div className="sm:col-span-1 flex flex-col gap-2 w-full">
          <Label
            htmlFor="quantity"
            className="text-fourth font-bold text-base ml-6"
          >
            Số lượng
          </Label>
          <Input
            className="py-6 px-4 rounded-md file:bg-seventh"
            id="quantity"
            type="text"
            placeholder="Nhập số lượng..."
            {...register("quantity")}
          />
          {errors.quantity && (
            <p className="text-red-500 text-xs">{errors.quantity.message}</p>
          )}
        </div>
        <div className="sm:col-span-1 flex flex-col gap-2 w-full">
          <Label
            htmlFor="price"
            className="text-fourth font-bold text-base ml-6"
          >
            Giá tiền (VND)
          </Label>
          <Input
            className="py-6 px-4 rounded-md file:bg-seventh"
            id="price"
            type="text"
            placeholder="Nhập giá tiền..."
            {...register("price")}
          />
          {errors.price && (
            <p className="text-red-500 text-xs">{errors.price.message}</p>
          )}
        </div>
        <div className="sm:col-span-2 flex flex-col gap-2 w-full">
          <ImageUpload
            value={image}
            handleChange={(item) => setValue("image", item)}
            handleRemove={() => setValue("image", "")}
            {...register("image")}
          />
          {errors.image && (
            <p className="text-red-500 text-xs">{errors.image.message}</p>
          )}
        </div>
        <div className="sm:col-span-1 flex flex-col gap-2 w-full">
          <Label
            htmlFor="category"
            className="text-fourth font-bold text-base ml-6"
          >
            Trạng thái
          </Label>
          <Select
            onValueChange={(value) => setValue("status", value as "1" | "2")}
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
          {errors.status && (
            <p className="text-red-500 text-xs">{errors.status.message}</p>
          )}
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
    </div>
  );
}

export default AmenityForm;
