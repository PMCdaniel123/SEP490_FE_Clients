"use client";

import EditProfileForm from "@/components/profile-form/profile-form";
import UserReview from "@/components/user-review/user-review";
import { useState, useEffect } from "react";
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
  const [avatar, setAvatar] = useState<File | null>(null);
  const [reviews] = useState([
    { id: 1, content: "Tuyệt vời 5 sao!", rating: 5 },
    { id: 2, content: "Dịch vụ ok nhé sốp.", rating: 4 },
  ]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const fetchProfile = async () => {
        try {
          const decodeResponse = await fetch(
            "https://localhost:5050/users/decodejwttoken",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ token }),
            }
          );

          if (!decodeResponse.ok) {
            throw new Error("Failed to decode token");
          }

          const decoded = await decodeResponse.json();
          const userId = decoded.claims.sub;

          const profileResponse = await fetch(
            `https://localhost:5050/users/${userId}`
          );

          if (!profileResponse.ok) {
            throw new Error("Failed to fetch profile");
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
            position: "bottom-right",
            autoClose: 2000,
            hideProgressBar: true,
            theme: "dark",
          });
        }
      };

      fetchProfile();
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
    <div className="max-w-7xl mx-auto px-6 py-12 flex gap-8 ">
      <div className="w-1/3 bg-gray-100 p-6 rounded-lg text-center">
        <div className="w-24 h-24 mx-auto bg-gray-300 rounded-full overflow-hidden">
          {avatar ? (
            <img
              src={typeof avatar === "string" ? avatar : URL.createObjectURL(avatar)}
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

        <input
          type="file"
          accept="image/*"
          onChange={handleAvatarChange}
          className="mt-2"
        />
        <p className="font-bold text-xl pt-5">{formData.name}</p>
        <h3 className="mt-6 text-md font-semibold">Thông tin cá nhân</h3>
        <div className="text-left mt-4 space-y-2">
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

      <div className="w-2/3">
        {!isEditing ? (
          <div>
            <h1 className="text-2xl font-bold">Xin chào, {formData.name}</h1>
            <button
              className="mt-4 px-4 py-2 border border-black rounded-lg hover:bg-gray-200"
              onClick={() => setIsEditing(true)}
            >
              Chỉnh sửa
            </button>
            <UserReview reviews={reviews} />
          </div>
        ) : (
          <EditProfileForm
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            handleCancel={handleCancel}
          />
        )}
      </div>
    </div>
  );
}

export default Profile;