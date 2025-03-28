/* eslint-disable @next/next/no-img-element */
"use client";

import Loader from "@/components/loader/Loader";
import EditProfileForm from "@/components/profile-form/profile-form";
import UserReview from "@/components/user-review/user-review";
import { BASE_URL } from "@/constants/environments";
import { RootState } from "@/stores";
import dayjs from "dayjs";
import { useState, useEffect, useCallback } from "react";
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
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { customer } = useSelector((state: RootState) => state.auth);

  const fetchReviews = useCallback(async () => {
    try {
      if (!customer?.id) return;
      
      const reviewsResponse = await fetch(
        `${BASE_URL}/users/rating/getallratingbyuserid/${customer.id}`
      );

      if (!reviewsResponse.ok) {
        throw new Error("Có lỗi xảy ra khi tải đánh giá.");
      }

      const reviewsData = await reviewsResponse.json();
      const formattedReviews = reviewsData.ratingByUserIdDTOs.map(
        (review: {
          ratingId: number;
          comment: string;
          rate: number;
          created_At: string;
          workspace_Name: string;
          owner_Name: string;
          images: { url: string }[];
        }) => ({
          id: review.ratingId,
          content: review.comment,
          rating: review.rate,
          created_At: review.created_At,
          workspace_Name: review.workspace_Name,
          owner_Name: review.owner_Name,
          images: review.images,
        })
      );
      setReviews(formattedReviews);
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
  }, [customer?.id]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && customer) {
      const fetchProfile = async () => {
        try {
          setLoading(true);
          const profileResponse = await fetch(
            `${BASE_URL}/users/${customer?.id}`
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
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Đã xảy ra lỗi!";
          toast.error(errorMessage, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            theme: "light",
          });
        } finally {
          setLoading(false);
        }
      };

      fetchProfile();
      fetchReviews();
    }
  }, [customer, fetchReviews]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (file: File) => {
    setAvatar(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Updated Data:", formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

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
            <span className="font-semibold">Ngày sinh:</span>{" "}
            {dayjs(formData.dob).format("DD/MM/YYYY")}
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
              Chỉnh sửa hồ sơ
            </button>
            <UserReview 
              reviews={reviews} 
              userId={customer?.id ? Number(customer.id) : 0} 
              onReviewUpdated={fetchReviews}
            />
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
