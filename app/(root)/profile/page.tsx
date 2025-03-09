/* eslint-disable @next/next/no-img-element */
"use client";

import EditProfileForm from "@/components/profile-form/profile-form";
import UserReview from "@/components/user-review/user-review";
import { RootState } from "@/stores";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    phoneNumber: "",
    dob: "",
    gender: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [avatar, setAvatar] = useState<File | string | null>(null);
  const [reviews] = useState([
    { id: 1, content: "Tuyệt vời 5 sao!", rating: 5 },
    { id: 2, content: "Dịch vụ ok nhé sốp.", rating: 4 },
  ]);
  const { customer } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && customer) {
      const fetchProfile = async () => {
        try {
          const profileResponse = await fetch(
            `https://localhost:5050/users/${customer?.id}`
          );

          if (!profileResponse.ok) {
            throw new Error("Có lỗi xảy ra khi tải thông tin hồ sơ.");
          }

          const profileData = await profileResponse.json();
          const user = profileData.user;

          setFormData({
            name: user.name || "Chưa cập nhật",
            email: user.email.trim() || "Chưa cập nhật",
            address: user.location || "Chưa cập nhật",
            phoneNumber: user.phone || "Chưa cập nhật",
            dob: user.dateOfBirth || "Chưa cập nhật",
            gender: user.sex || "Chưa cập nhật",
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          });

          if (user.avatar) {
            setAvatar(user.avatar);
          }
        } catch {
          toast.error("Có lỗi xảy ra khi tải thông tin hồ sơ.", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            theme: "light",
          });
        }
      };

      fetchProfile();
    }
  }, [customer]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatar(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Updated Data:", formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-8">
      <div className="w-full lg:w-1/3 bg-secondary p-6 rounded-lg text-center text-white">
        <div className="w-32 h-32 mx-auto bg-white rounded-full overflow-hidden border">
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
        <p className="font-bold text-2xl pt-5">{formData.name}</p>
        <div className="text-left space-y-2 bg-white rounded-lg px-4 py-8 mt-8">
          <p className="text-gray-600">
            <span className="font-semibold">Email:</span> {formData.email}
          </p>
          <p className="text-gray-600">
            <span className="font-semibold">Địa chỉ:</span> {formData.address}
          </p>
          <p className="text-gray-600">
            <span className="font-semibold">Số điện thoại:</span>{" "}
            {formData.phoneNumber}
          </p>
          <p className="text-gray-600">
            <span className="font-semibold">Ngày sinh:</span> {formData.dob}
          </p>
          <p className="text-gray-600">
            <span className="font-semibold">Giới tính:</span> {formData.gender}
          </p>
        </div>
      </div>

      <div className="w-full lg:w-2/3">
        {!isEditing ? (
          <div>
            <h1 className="text-2xl font-bold">Xin chào, {formData.name}</h1>
            <button
              className="mt-4 px-4 py-2 rounded-lg bg-white border=black hover:bg-primary hover:text-white hover:border-white border"
              onClick={() => setIsEditing(true)}
            >
              Chỉnh sửa
            </button>
            <UserReview reviews={reviews} />
          </div>
        ) : (
          <EditProfileForm
            formData={formData}
            avatar={avatar}
            handleChange={handleChange}
            handleAvatarChange={handleAvatarChange}
            handleSubmit={handleSubmit}
            handleCancel={handleCancel}
          />
        )}
      </div>
    </div>
  );
}

export default Profile;
