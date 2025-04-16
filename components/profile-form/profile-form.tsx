/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/stores";
import { toast } from "react-toastify";
import ChangePasswordForm from "../change-password-form/change-password-form";
import { Upload } from "lucide-react";
import { Button, Upload as AntUpload, ConfigProvider } from "antd";
import ImgCrop from "antd-img-crop";
import { BASE_URL } from "@/constants/environments";
import { login } from "@/stores/slices/authSlice";

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
  const dispatch = useDispatch();
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatDateForDisplay = (dateString: string) => {
    if (!dateString || dateString === "Chưa cập nhật") return "";
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
      return dateString;
    }

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "";
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch {
      return "";
    }
  };

  const formattedFormData = {
    ...formData,
    dob:
      formData.dob && formData.dob !== "Chưa cập nhật"
        ? formatDateForDisplay(formData.dob)
        : formData.dob,
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: formattedFormData,
  });

  const togglePasswordForm = () => {
    setShowPasswordForm(!showPasswordForm);
  };

  const uploadImage = async (image: File) => {
    const formData = new FormData();
    formData.append("image", image);

    const response = await fetch(`${BASE_URL}/images/upload`, {
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
        autoClose: 1500,
        hideProgressBar: false,
        theme: "light",
      });
      return;
    }

    setIsSubmitting(true);

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
          autoClose: 1500,
          hideProgressBar: false,
          theme: "light",
        });
        setIsSubmitting(false);
        return;
      }
    }

    const requestData = {
      userId: customer.id,
      name: data.name,
      email: data.email,
      location: data.address,
      phone: data.phoneNumber,
      dateOfBirth: data.dob ? formatDateForAPI(data.dob) : data.dob,
      sex: data.gender,
      avatar: avatarUrl,
    };

    try {
      const response = await fetch(`${BASE_URL}/users/update`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error("Cập nhật hồ sơ không thành công.");
      }

      // Update Redux store
      if (customer) {
        dispatch(
          login({
            id: customer.id,
            fullName: data.name,
            email: data.email,
            phone: customer.phone,
            roleId: customer.roleId,
            avatar: typeof avatarUrl === "string" ? avatarUrl : customer.avatar,
          })
        );
      }

      toast.success("Cập nhật hồ sơ thành công!", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        theme: "light",
      });

      reset();
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
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDateForAPI = (dateString: string) => {
    if (!dateString) return dateString;
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString;
    }

    // Convert from DD/MM/YYYY to YYYY-MM-DD
    const [day, month, year] = dateString.split("/");
    return `${year}-${month}-${day}`;
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
                    return false;
                  }}
                  showUploadList={false}
                >
                  <ConfigProvider
                    theme={{
                      components: {
                        Button: {
                          colorBgContainer: "#835101",
                          colorText: "#fff",
                          defaultHoverBg: "#B49057",
                          defaultHoverColor: "#fff",
                          defaultHoverBorderColor: "#B49057",
                          paddingBlockLG: 12,
                          defaultActiveColor: "#fff",
                        },
                      },
                    }}
                  >
                    <Button
                      size="large"
                      icon={<Upload className="mr-2" size={20} />}
                    >
                      Chọn ảnh
                    </Button>
                  </ConfigProvider>
                </AntUpload>
              </ImgCrop>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium">Tên</label>
            <input
              type="text"
              {...register("name", {
                minLength: {
                  value: 2,
                  message: "Tên phải có ít nhất 2 ký tự",
                },
              })}
              className="w-full p-2 border rounded-lg mt-1"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              {...register("email", {
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Email không hợp lệ",
                },
              })}
              className="w-full p-2 border rounded-lg mt-1"
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Địa chỉ</label>
            <input
              type="text"
              {...register("address", {
                minLength: {
                  value: 5,
                  message: "Địa chỉ phải có ít nhất 5 ký tự",
                },
              })}
              className="w-full p-2 border rounded-lg mt-1"
            />
            {errors.address && (
              <p className="text-red-500 text-xs mt-1">
                {errors.address.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium">Số điện thoại</label>
            <input
              type="text"
              {...register("phoneNumber", {
                pattern: {
                  value: /^[0-9]{10,15}$/,
                  message: "Số điện thoại không hợp lệ (10–15 chữ số)",
                },
              })}
              className="w-full p-2 border rounded-lg mt-1"
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Ngày sinh</label>
            <input
              type="text"
              placeholder="DD/MM/YYYY"
              {...register("dob", {
                validate: (value) => {
                  if (!value) return true;

                  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
                    return "Định dạng ngày không hợp lệ (DD/MM/YYYY)";
                  }

                  const [day, month, year] = value.split("/").map(Number);

                  const date = new Date(year, month - 1, day);
                  if (
                    date.getDate() !== day ||
                    date.getMonth() + 1 !== month ||
                    date.getFullYear() !== year
                  ) {
                    return "Ngày không hợp lệ";
                  }

                  const today = new Date();
                  let age = today.getFullYear() - year;
                  if (
                    today.getMonth() < month - 1 ||
                    (today.getMonth() === month - 1 && today.getDate() < day)
                  ) {
                    age--;
                  }

                  if (age < 12 || age > 100) {
                    return "Tuổi phải từ 12 đến 100";
                  }

                  return true;
                },
              })}
              className="w-full p-2 border rounded-lg mt-1"
            />
            {errors.dob && (
              <p className="text-red-500 text-xs mt-1">{errors.dob.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium">Giới tính</label>
            <select
              {...register("gender")}
              className="w-full p-2 border rounded-lg mt-1"
            >
              <option value="" disabled>
                -- Vui lòng chọn giới tính --
              </option>
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
            disabled={isSubmitting}
          >
            Hủy
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-[#8B5D27] text-white rounded-lg hover:bg-[#6b451f] flex items-center justify-center min-w-[120px]"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Đang lưu...
              </>
            ) : (
              "Lưu thay đổi"
            )}
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
