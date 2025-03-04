"use client";

import { useState } from "react";

function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "Khanh Quang",
    email: "khanhqn03@gmail.com",
    address: "Thu Duc",
    phoneNumber: "0123456789",
    dob: "1990-01-01",
    gender: "Nam", // Add gender field
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [avatar, setAvatar] = useState<File | null>(null);
  const [reviews] = useState([
    { id: 1, content: "Great service!", rating: 5 },
    { id: 2, content: "Very satisfied.", rating: 4 },
  ]);

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

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 flex gap-8 ">
      <div className="w-1/3 bg-gray-100 p-6 rounded-lg text-center">
        <div className="w-24 h-24 mx-auto bg-gray-300 rounded-full overflow-hidden">
          {avatar ? (
            <img
              src={URL.createObjectURL(avatar)}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-300"></div>
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
            <p className="mt-6 font-semibold">⭐ {reviews.length} Reviews</p>
            <div className="mt-2 text-gray-600">
              {reviews.length > 0 ? (
                <ul className="space-y-2">
                  {reviews.map((review) => (
                    <li key={review.id} className="border-b pb-2">
                      <p className="font-semibold">
                        Rating: {review.rating} ⭐
                      </p>
                      <p>{review.content}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Reviewed Bởi Bạn</p>
              )}
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <h2 className="text-xl font-bold mb-4">
              Chỉnh sửa thông tin cá nhân
            </h2>
            <div className="grid grid-cols-2 gap-4">
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
                <label className="block text-sm font-medium">
                  Số điện thoại
                </label>
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
            <h3 className="text-lg font-bold mt-6">Thay đổi mật khẩu</h3>
            <input
              type="password"
              name="currentPassword"
              placeholder="Mật khẩu hiện tại"
              onChange={handleChange}
              className="w-full p-2 border rounded-lg mt-2"
            />
            <input
              type="password"
              name="newPassword"
              placeholder="Mật khẩu mới"
              onChange={handleChange}
              className="w-full p-2 border rounded-lg mt-2"
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Xác nhận mật khẩu mới"
              onChange={handleChange}
              className="w-full p-2 border rounded-lg mt-2"
            />
            <div className="flex justify-end gap-4 mt-6">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
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
        )}
      </div>
    </div>
  );
}

export default Profile;