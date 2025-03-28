import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { RootState } from "@/stores";
import { toast } from "react-toastify";
import ChangePasswordForm from "../change-password-form/change-password-form";
import { Upload } from "lucide-react";
import { Button, Upload as AntUpload } from "antd";
import ImgCrop from "antd-img-crop";

interface EditProfileFormProps {
  formData: {
    name: string;
    email: string;
    address: string;
    phoneNumber: string;
    dob: string;
    gender: string;
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  };
  avatar: string | File | null;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  handleAvatarChange: (file: File) => void;
  handleCancel: () => void;
  handleSubmit: (e: React.FormEvent) => void;
}

const EditProfileForm: React.FC<EditProfileFormProps> = ({
  formData,
  avatar,
  handleAvatarChange,
  handleCancel,
}) => {
  const { customer } = useSelector((state: RootState) => state.auth);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const { register, handleSubmit, reset } = useForm({
    defaultValues: formData,
  });

  const togglePasswordForm = () => {
    setShowPasswordForm(!showPasswordForm);
  };

  const uploadImage = async (image: File) => {
    const formData = new FormData();
    formData.append("image", image);

    const response = await fetch("https://localhost:5050/files/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Có lỗi xảy ra khi tải lên ảnh.");
    }

    const result = await response.json();
    return result.data[0];
  };

  const onSubmit = async (data: typeof formData) => {
    if (!customer) {
      toast.error("Chưa đăng nhập", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        theme: "light",
      });
      return;
    }

    let avatarUrl = avatar;
    if (avatar && typeof avatar !== "string") {
      try {
        avatarUrl = await uploadImage(avatar);
        if (!avatarUrl) {
          throw new Error("Có lỗi xảy ra khi tải lên ảnh.");
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Đã xảy ra lỗi!";
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          theme: "light",
        });
        return;
      }
    }

    const requestData = {
      userId: customer.id,
      name: data.name,
      email: data.email,
      location: data.address,
      phone: data.phoneNumber,
      dateOfBirth: data.dob,
      sex: data.gender,
      avatar: avatarUrl,
    };

    try {
      const response = await fetch("https://localhost:5050/users/update", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error("Cập nhật hồ sơ không thành công.");
      }

      toast.success("Cập nhật hồ sơ thành công!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        theme: "light",
      });

      reset();
      handleCancel();
      window.location.reload();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Đã xảy ra lỗi!";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        theme: "light",
      });
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded-lg shadow-md border"
      >
        <h2 className="text-xl font-bold mb-4 text-primary">
          Chỉnh sửa thông tin cá nhân
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium">Ảnh đại diện</label>
            <div className="flex items-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full overflow-hidden border my-2 mr-2">
                {avatar ? (
                  <img
                    src={
                      typeof avatar === "string"
                        ? avatar
                        : URL.createObjectURL(avatar)
                    }
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src="/logo.png"
                    alt="Default Avatar"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <ImgCrop rotationSlider>
                <AntUpload
                  beforeUpload={(file) => {
                    handleAvatarChange(file);
                    return false; // Prevent automatic upload
                  }}
                  showUploadList={false}
                >
                  <Button icon={<Upload className="mr-2" />}>Chọn ảnh</Button>
                </AntUpload>
              </ImgCrop>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium">Tên</label>
            <input
              type="text"
              {...register("name")}
              className="w-full p-2 border rounded-lg mt-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              {...register("email")}
              className="w-full p-2 border rounded-lg mt-1"
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Địa chỉ</label>
            <input
              type="text"
              {...register("address")}
              className="w-full p-2 border rounded-lg mt-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Số điện thoại</label>
            <input
              type="text"
              {...register("phoneNumber")}
              className="w-full p-2 border rounded-lg mt-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Ngày sinh</label>
            <input
              type="date"
              {...register("dob")}
              className="w-full p-2 border rounded-lg mt-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Giới tính</label>
            <select
              {...register("gender")}
              className="w-full p-2 border rounded-lg mt-1"
            >
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
              <option value="Khác">Khác</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={handleCancel}
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
      <button
        type="button"
        onClick={togglePasswordForm}
        className="mt-6 px-4 py-2 bg-[#8B5D27] text-white rounded-lg hover:bg-[#6b451f]"
      >
        Thay đổi mật khẩu
      </button>
      {showPasswordForm && (
        <ChangePasswordForm
          isModalOpen={showPasswordForm}
          handleCancel={togglePasswordForm}
        />
      )}
    </>
  );
};

export default EditProfileForm;
