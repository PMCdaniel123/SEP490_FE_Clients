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
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { workspaceSchema } from "@/lib/zod/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import ImageUpload from "../custom-ui/image-upload";

export type FormInputs = z.infer<typeof workspaceSchema>;

interface WorkspaceFormProps {
  initialData?: WorkspaceProps | null;
}

function WorkspaceForm({ initialData }: WorkspaceFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormInputs>({
    resolver: zodResolver(workspaceSchema),
  });

  const facilities = watch("facilities", []);
  const policies = watch("policies", []);
  const images = watch("images", []);

  const onCreate: SubmitHandler<FormInputs> = (data) => {
    alert(JSON.stringify(data));
  };

  // console.log(initialData);

  return (
    <div className="flex flex-col">
      <h1 className="text-xl font-bold text-primary flex items-center gap-4">
        <SquarePen />
        <span>Tạo mới không gian</span>
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
                Tên không gian
              </Label>
              <Input
                className="py-6 px-4 rounded-md file:bg-seventh"
                id="name"
                type="text"
                placeholder="Nhập tên không gian..."
                {...register("name")}
              />
              {errors.name && (
                <p className="text-red-500 text-xs">{errors.name.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label
                htmlFor="address"
                className="text-fourth font-bold text-base ml-6"
              >
                Địa chỉ
              </Label>
              <Input
                className="py-6 px-4 rounded-md file:bg-seventh"
                id="address"
                type="text"
                placeholder="Nhập địa chỉ..."
                {...register("address")}
              />
              {errors.address && (
                <p className="text-red-500 text-xs">{errors.address.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label
                htmlFor="googleMapUrl"
                className="text-fourth font-bold text-base ml-6"
              >
                Link Google Map
              </Label>
              <Input
                className="py-6 px-4 rounded-md file:bg-seventh"
                id="googleMapUrl"
                type="url"
                placeholder="Nhập link Google Map..."
                {...register("googleMapUrl")}
              />
              {errors.googleMapUrl && (
                <p className="text-red-500 text-xs">
                  {errors.googleMapUrl.message}
                </p>
              )}
            </div>
          </div>
          <div className="sm:col-span-1 flex flex-col gap-6 h-full justify-center w-full p-4 bg-primary rounded-md">
            <Label className="text-seventh font-bold text-base ml-6">
              Giá tiền
            </Label>
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="shortTermPrice"
                className="text-seventh font-bold text-sm"
              >
                1. Theo giờ (VND)
              </Label>
              <Input
                className="py-6 px-4 rounded-md file:bg-seventh placeholder:text-seventh text-seventh"
                id="shortTermPrice"
                type="text"
                placeholder="Nhập giá theo giờ..."
                {...register("shortTermPrice")}
              />
              {errors.shortTermPrice && (
                <p className="text-red-500 text-xs">
                  {errors.shortTermPrice.message}
                </p>
              )}
            </div>
            <div className="mt-2 flex flex-col gap-2">
              <Label
                htmlFor="longTermPrice"
                className="text-seventh font-bold text-sm"
              >
                2. Theo ngày (VND)
              </Label>
              <Input
                className="py-6 px-4 rounded-md file:bg-seventh placeholder:text-seventh text-seventh"
                id="longTermPrice"
                type="text"
                placeholder="Nhập giá theo ngày..."
                {...register("longTermPrice")}
              />
              {errors.longTermPrice && (
                <p className="text-red-500 text-xs">
                  {errors.longTermPrice.message}
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
            Loại không gian
          </Label>
          <Select
            onValueChange={(value) =>
              setValue("category", value as "1" | "2" | "3" | "4")
            }
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
          {errors.category && (
            <p className="text-red-500 text-xs">{errors.category.message}</p>
          )}
        </div>
        <div className="sm:col-span-1 flex flex-col gap-2 w-full">
          <Label
            htmlFor="area"
            className="text-fourth font-bold text-base ml-6"
          >
            Diện tích (m2)
          </Label>
          <Input
            className="py-6 px-4 rounded-md file:bg-seventh"
            id="area"
            type="text"
            placeholder="Nhập diện tích..."
            {...register("area")}
          />
          {errors.area && (
            <p className="text-red-500 text-xs">{errors.area.message}</p>
          )}
        </div>
        <div className="sm:col-span-1 flex flex-col gap-2 w-full">
          <Label
            htmlFor="capacity"
            className="text-fourth font-bold text-base ml-6"
          >
            Sức chứa (người)
          </Label>
          <Input
            className="py-6 px-4 rounded-md file:bg-seventh"
            id="capacity"
            type="text"
            placeholder="Nhập sức chứa..."
            {...register("capacity")}
          />
          {errors.capacity && (
            <p className="text-red-500 text-xs">{errors.capacity.message}</p>
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
            <p className="text-red-500 text-xs">{errors.description.message}</p>
          )}
        </div>
        <div className="sm:col-span-1 flex flex-col gap-2 w-full">
          <Label
            htmlFor="cleanTime"
            className="text-fourth font-bold text-base ml-6"
          >
            Thời gian dọn dẹp (phút)
          </Label>
          <Input
            className="py-6 px-4 rounded-md file:bg-seventh"
            id="cleanTime"
            type="text"
            placeholder="Nhập thời gian dọn dẹp..."
            {...register("cleanTime")}
          />
          {errors.cleanTime && (
            <p className="text-red-500 text-xs">{errors.cleanTime.message}</p>
          )}
        </div>
        <div className="sm:col-span-2 flex flex-col gap-2 w-full">
          <Label
            htmlFor="facilities"
            className="text-fourth font-bold text-base ml-6"
          >
            Cơ sở vật chất
          </Label>
          <MultiText
            placeholder="Nhập cơ sở vật chất..."
            value={facilities}
            handleChange={(item) =>
              setValue("facilities", [...facilities, item])
            }
            handleRemove={(tag) =>
              setValue(
                "facilities",
                facilities.filter((item) => item !== tag)
              )
            }
            {...register("facilities")}
          />
        </div>
        <div className="sm:col-span-2 flex flex-col gap-2 w-full">
          <Label
            htmlFor="facilities"
            className="text-fourth font-bold text-base ml-6"
          >
            Quy định chung
          </Label>
          <MultiText
            placeholder="Nhập quy định chung..."
            value={policies}
            handleChange={(item) => setValue("policies", [...policies, item])}
            handleRemove={(tag) =>
              setValue(
                "policies",
                policies.filter((item) => item !== tag)
              )
            }
            {...register("policies")}
          />
        </div>
        <div className="sm:col-span-2 flex flex-col gap-2 w-full">
          <ImageUpload
            value={images}
            handleChange={(item) => setValue("images", [...images, item])}
            handleRemove={(tag) =>
              setValue(
                "images",
                images.filter((item) => item !== tag)
              )
            }
            {...register("images")}
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
    </div>
  );
}

export default WorkspaceForm;
