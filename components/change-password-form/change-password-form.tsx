import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/stores";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePasswordSchema } from "@/libs/zod/schema";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";
import { BASE_URL } from "@/constants/environments";

interface ChangePasswordFormProps {
  isModalOpen: boolean;
  handleCancel: () => void;
}

const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({
  isModalOpen,
  handleCancel,
}) => {
  const { customer } = useSelector((state: RootState) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<z.infer<typeof changePasswordSchema>>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (!isModalOpen) {
      reset({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  }, [isModalOpen, reset]);

  const onSubmit = async (data: z.infer<typeof changePasswordSchema>) => {
    if (!customer) {
      toast.error("Người dùng không có quyền truy cập.", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        theme: "light",
      });
      return;
    }

    const requestData = {
      userId: customer.id,
      oldPassword: data.currentPassword,
      newPassword: data.newPassword,
      confirmPassword: data.confirmPassword,
    };

    try {
      const response = await fetch(`${BASE_URL}/users/updatepassword`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error("Cập nhật mật khẩu không thành công.");
      }

      toast.success("Cập nhật mật khẩu thành công!", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        theme: "light",
      });

      reset({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      handleCancel();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Đã xảy ra lỗi!";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        theme: "light",
      });
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white p-6 rounded-lg shadow-md border mt-6"
    >
      <h2 className="text-xl font-bold mb-4 text-primary">Thay đổi mật khẩu</h2>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          {...register("currentPassword")}
          placeholder="Mật khẩu hiện tại"
          className="w-full p-2 border rounded-lg mt-4"
        />
        <button
          type="button"
          onClick={toggleShowPassword}
          className="absolute right-3 top-1/2 transform -translate-y-1/2"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
      {errors.currentPassword && (
        <p className="text-red-500 text-sm mt-1">
          {errors.currentPassword.message}
        </p>
      )}
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          {...register("newPassword")}
          placeholder="Mật khẩu mới"
          className="w-full p-2 border rounded-lg mt-4"
        />
        <button
          type="button"
          onClick={toggleShowPassword}
          className="absolute right-3 top-1/2 transform -translate-y-1/2"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
      {errors.newPassword && (
        <p className="text-red-500 text-sm mt-1">
          {errors.newPassword.message}
        </p>
      )}
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          {...register("confirmPassword")}
          placeholder="Xác nhận mật khẩu mới"
          className="w-full p-2 border rounded-lg mt-4"
        />
        <button
          type="button"
          onClick={toggleShowPassword}
          className="absolute right-3 top-1/2 transform -translate-y-1/2"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
      {errors.confirmPassword && (
        <p className="text-red-500 text-sm mt-1">
          {errors.confirmPassword.message}
        </p>
      )}
      <div className="flex justify-end gap-4 mt-6">
        <button
          type="button"
          onClick={() => {
            reset({
              currentPassword: "",
              newPassword: "",
              confirmPassword: "",
            });
            handleCancel();
          }}
          className="px-4 py-2 border rounded-lg hover:bg-gray-200"
        >
          Hủy
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-[#8B5D27] text-white rounded-lg hover:bg-[#6b451f]"
        >
          Lưu thay đổi
        </button>
      </div>
    </form>
  );
};

export default ChangePasswordForm;
