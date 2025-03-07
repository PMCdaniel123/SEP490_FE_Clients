import React, { useState } from "react";
import ChangePasswordForm from "../change-password-form/change-password-form";
import { Upload } from "lucide-react";

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
  avatar: File | string | null;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  handleAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleCancel: () => void;
}

const EditProfileForm: React.FC<EditProfileFormProps> = ({
  formData,
  avatar,
  handleChange,
  handleAvatarChange,
  handleSubmit,
  handleCancel,
}) => {
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const togglePasswordForm = () => {
    setShowPasswordForm(!showPasswordForm);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md border"
      >
        <h2 className="text-xl font-bold mb-4 text-primary">
          Chỉnh sửa thông tin cá nhân
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium">Ảnh đại diện</label>
            <div className="flex items-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full overflow-hidden border">
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
              <label
                htmlFor="avatarInput"
                className="ml-4 px-4 py-2 bg-[#8B5D27] text-white rounded-lg cursor-pointer hover:bg-[#6b451f] flex items-center"
              >
                <Upload className="mr-2" />
                Chọn ảnh
              </label>
              <input
                id="avatarInput"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium">Tên</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg mt-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg mt-1"
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Địa chỉ</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg mt-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Số điện thoại</label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg mt-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Ngày sinh</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg mt-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Giới tính</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
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