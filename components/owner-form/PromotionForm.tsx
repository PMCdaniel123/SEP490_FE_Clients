"use client";

import { Save, SquarePen } from "lucide-react";
import { Separator } from "../ui/separator";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { PromotionProps } from "@/types";
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
import { promotionSchema } from "@/lib/zod/schema";

export type FormInputs = z.infer<typeof promotionSchema>;

interface PromotionFormProps {
  initialData?: PromotionProps | null;
}

function PromotionForm({ initialData }: PromotionFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormInputs>({
    resolver: zodResolver(promotionSchema),
  });

  const onCreate: SubmitHandler<FormInputs> = (data) => {
    alert(JSON.stringify(data));
  };

  // console.log(initialData);

  return (
    <div className="flex flex-col">
      <h1 className="text-xl font-bold text-primary flex items-center gap-4 mt-4">
        <SquarePen />
        <span>Tạo mới mã khuyến mại</span>
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
                htmlFor="code"
                className="text-fourth font-bold text-base ml-6"
              >
                Mã khuyến mại
              </Label>
              <Input
                className="py-6 px-4 rounded-md file:bg-seventh"
                id="code"
                type="text"
                placeholder="Nhập mã khuyến mại..."
                {...register("code")}
              />
              {errors.code && (
                <p className="text-red-500 text-xs">{errors.code.message}</p>
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
            htmlFor="startDate"
            className="text-fourth font-bold text-base ml-6"
          >
            Ngày bắt đầu
          </Label>
          <Input
            className="py-6 px-4 rounded-md file:bg-seventh"
            id="startDate"
            type="date"
            placeholder="Nhập ngày bắt đầu..."
            {...register("startDate")}
          />
          {errors.startDate && (
            <p className="text-red-500 text-xs">{errors.startDate.message}</p>
          )}
        </div>
        <div className="sm:col-span-1 flex flex-col gap-2 w-full">
          <Label
            htmlFor="endDate"
            className="text-fourth font-bold text-base ml-6"
          >
            Ngày kết thúc
          </Label>
          <Input
            className="py-6 px-4 rounded-md file:bg-seventh"
            id="endDate"
            type="date"
            placeholder="Nhập ngày kết thúc..."
            {...register("endDate")}
          />
          {errors.endDate && (
            <p className="text-red-500 text-xs">{errors.endDate.message}</p>
          )}
        </div>
        <div className="sm:col-span-3 grid sm:grid-cols-3 gap-6">
          <div className="sm:col-span-1 flex flex-col gap-2 w-full">
            <Label
              htmlFor="discount"
              className="text-fourth font-bold text-base ml-6"
            >
              Giảm giá (%)
            </Label>
            <Input
              className="py-6 px-4 rounded-md file:bg-seventh"
              id="discount"
              type="text"
              placeholder="Nhập % giảm giá..."
              {...register("discount")}
            />
            {errors.discount && (
              <p className="text-red-500 text-xs">{errors.discount.message}</p>
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

export default PromotionForm;
